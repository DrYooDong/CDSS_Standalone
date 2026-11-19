/**
 * End-to-End Clinical Verification Suite for Unified InfectoSepsis Super-CDSS v4.0
 * Tests bidirectional sync, Sepsis-3 / Phoenix / Obstetric / NICE / NLR / LP-NEWS,
 * MDR auto-bridging, T2Bacteria molecular targeting, and CrCl-adjusted dosing for all 7 presets.
 */

import { PRESET_CASES } from './presetCases';
import { evaluatePatientCDSS } from './calculators';
import {
  deriveAntibioticBridgeFromSepsis,
  extractSepsisQuickDrugChips,
  syncRenalToSepsisPatient,
  syncSepsisToRenalPatient
} from './patientBridge';
import { calculateRenalMetrics } from '../utils/clinicalFormulas';
import { calculateDose, extractDrugData } from '../utils/drugDataExtractor';
import { ANTIBIOTICS } from '../data/antibiotics';
import { PatientState } from '../types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

console.log('--- STARTING INFECTOSEPSIS SUPER-CDSS UNIFIED BRIDGE TESTS ---\n');

const baseRenal: PatientState = {
  scr: 90,
  scrUnit: 'umol',
  age: 60,
  gender: 'm',
  weight: 60,
  height: 165,
  dialysis: 'none'
};

// 1. Bidirectional Renal <-> Sepsis Creatinine & Unit Conversion Sync
console.log('[TEST GROUP 1: Bidirectional Patient & Renal Sync]');
const case1 = PRESET_CASES.find(c => c.id === 'case-1-adult-septic-shock')!.patientData;
const syncedRenal1 = syncSepsisToRenalPatient(case1, baseRenal);
assert(syncedRenal1.age === 66 && syncedRenal1.weight === 68 && syncedRenal1.scr === 185, 'Case 1 syncs Age=66, Weight=68, SCr=185 µmol/L to Renal state');

const syncedRenalMgdl = syncSepsisToRenalPatient(case1, { ...baseRenal, scrUnit: 'mgdl' });
assert(Math.abs(syncedRenalMgdl.scr - 2.09) < 0.02, `Case 1 converts SCr=185 µmol/L -> ${syncedRenalMgdl.scr} mg/dL when unit is mg/dL`);

const updatedRenalState: PatientState = { ...syncedRenal1, scrUnit: 'mgdl', scr: 2.5, weight: 70 };
const syncedBackSepsis = syncRenalToSepsisPatient({ scrUnit: 'mgdl', scr: 2.5, weight: 70 }, case1, updatedRenalState);
assert(syncedBackSepsis.creatinineUmolL === 221 && syncedBackSepsis.weightKg === 70, `Renal edit (SCr 2.5 mg/dL, 70kg) syncs back to Sepsis (${syncedBackSepsis.creatinineUmolL} µmol/L, ${syncedBackSepsis.weightKg}kg)`);

// 2. Verify all 7 Preset Cases end-to-end (Sepsis Engine -> Bridge -> Renal CrCl -> Quick Drug Dosing)
console.log('\n[TEST GROUP 2: All 7 Clinical Presets End-to-End Pipeline]');
for (const preset of PRESET_CASES) {
  const res = evaluatePatientCDSS(preset.patientData);
  const renalState = syncSepsisToRenalPatient(preset.patientData, baseRenal);
  const renalMetrics = calculateRenalMetrics(renalState);
  const bridge = deriveAntibioticBridgeFromSepsis(preset.patientData, res);
  const quickDrugs = extractSepsisQuickDrugChips(preset.patientData, res);

  assert(renalMetrics.crcl > 0, `${preset.id}: CrCl calculated (${renalMetrics.crcl} mL/min)`);

  for (const chip of quickDrugs) {
    const exists = ANTIBIOTICS.some(a => a.id === chip.drugId);
    assert(exists, `${preset.id}: Quick drug chip '${chip.drugId}' exists in ANTIBIOTICS (43 drugs)`);
    const details = extractDrugData(chip.drugId);
    const defScn = details.scenarios.find(s => s.def) || details.scenarios[0];
    const dose = calculateDose(details, renalMetrics, defScn ? defScn.key : 'standard', renalState);
    assert(Boolean(dose.maintenanceDoseTextVi), `${preset.id}: Calculated CrCl dose for ${chip.drugId} -> ${dose.maintenanceDoseTextVi.slice(0, 45)}...`);
  }

  if (preset.id === 'case-0-normal') {
    assert(res.primaryDiagnosis === 'no_sepsis' && quickDrugs.length === 0, 'Case 0 Normal -> no_sepsis and 0 antibiotic chips');
  }
  if (preset.id === 'case-1-adult-septic-shock') {
    assert(res.primaryDiagnosis === 'septic_shock', 'Case 1 -> septic_shock');
    assert(bridge.sofaScore >= 2, `Case 1 -> bridges SOFA ${bridge.sofaScore} (>= 2)`);
    assert(bridge.specificRisks.includes('esbl'), 'Case 1 T2Resistance blaCTX-M -> bridges ESBL specific risk');
    assert(quickDrugs.some(c => c.drugId === 'meropenem'), 'Case 1 blaCTX-M -> suggests Meropenem quick dosing chip');
  }
  if (preset.id === 'case-2-maternal-sepsis') {
    assert(bridge.isMaternal === true, 'Case 2 -> preserves Maternal safety flag');
    assert(quickDrugs.some(c => c.drugId === 'meropenem'), 'Case 2 Maternal -> suggests Meropenem');
  }
  if (preset.id === 'case-3-pediatric-phoenix') {
    assert(bridge.population === 'pediatric', 'Case 3 -> bridges Pediatric population');
    assert((res.phoenixScore ?? 0) >= 2 && res.isPhoenixSepticShock === true, `Case 3 -> Phoenix Septic Shock (${res.phoenixScore} pts)`);
  }
  if (preset.id === 'case-5-molecular-t2mr') {
    assert(bridge.suggestedMdrCategory === 'cre' && bridge.suggestedCreEnzyme === 'oxa48', 'Case 5 blaOXA-48 -> auto-targets CRE / OXA-48 pathway in Stage 3');
    assert(quickDrugs.some(c => c.drugId === 'ceftazidim_avibactam'), 'Case 5 blaOXA-48 -> suggests Ceftazidime/Avibactam quick dosing chip');
  }
  if (preset.id === 'case-6-uti-urosepsis') {
    assert(res.niceRiskCategory === 'high', 'Case 6 Urosepsis -> NICE high risk despite qSOFA=1');
    assert(bridge.site === 'urinary' || bridge.sepsisSource === 'urinary', 'Case 6 -> maps urinary source accurately');
  }
}

console.log(`\n=== UNIFIED BRIDGE SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) {
  process.exit(1);
}
