/**
 * Unit Tests for CDSS Antibiotic Selection Engine
 * Validates clinical decision rules against BVBND 2026 guidelines
 */

import {
  classifyRisk,
  getEmpiricRegimens,
  evaluate48hReassessment,
  evaluateStopCriteria,
  evaluateIvToPo
} from './engine';

import { SeverityAssessment } from './types';
import { extractDrugData, calculateDose } from '../utils/drugDataExtractor';
import { calculateRenalMetrics } from '../utils/clinicalFormulas';
import {
  getAvailableScoresForSite,
  calculateCurb65,
  calculatePsi,
  calculateAtsCap,
  calculateCpis,
  calculateQsofa,
  calculateSofaFull,
  calculateLrinec,
  calculateUtiEsbl,
  calculateClifSbp,
  calculateTg18Biliary,
  calculateCnsMeningitis,
  buildDefaultCurb65,
  buildDefaultLrinec
} from './scoring/siteScoresEngine';

function runTests() {
  console.log('--- STARTING CLINICAL ENGINE TESTS ---');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      throw new Error(`Test failed: ${testName}`);
    }
  }

  // 1. RISK CLASSIFICATION TESTS (BVBND File 2, P.2)
  console.log('\n[TEST GROUP 1: Risk Classification Engine]');
  
  // Case A: 0 general risks -> Group 1
  const res1 = classifyRisk([], { scoreType: 'sofa', scoreValue: 0, isHighSeverity: false });
  assert(res1.group === 'group_1', '0 general risks -> Group 1');

  // Case B: 1 general risk + Low Severity (SOFA = 1 < 2) -> Group 1
  const res2 = classifyRisk(['hospital_90d'], { scoreType: 'sofa', scoreValue: 1, isHighSeverity: false });
  assert(res2.group === 'group_1', '1 general risk + SOFA 1 (< 2) -> Group 1');

  // Case C: 1 general risk + High Severity (SOFA = 3 >= 2) -> Group 2
  const res3 = classifyRisk(['hospital_90d'], { scoreType: 'sofa', scoreValue: 3, isHighSeverity: true });
  assert(res3.group === 'group_2', '1 general risk + SOFA 3 (>= 2) -> Group 2');

  // Case D: 1 general risk + Pediatric High Severity (pSOFA = 9 >= 8) -> Group 2
  const res4 = classifyRisk(['invasive_device'], { scoreType: 'psofa', scoreValue: 9, isHighSeverity: true });
  assert(res4.group === 'group_2', '1 general risk + pSOFA 9 (>= 8) -> Group 2');

  // Case E: 1 general risk + Liver Cirrhosis High Severity (CLIF-SOFA = 13 >= 12) -> Group 2
  const res5 = classifyRisk(['iv_abx_30d'], { scoreType: 'clif_sofa', scoreValue: 13, isHighSeverity: true });
  assert(res5.group === 'group_2', '1 general risk + CLIF-SOFA 13 (>= 12) -> Group 2');

  // Case F: 2 general risks regardless of SOFA -> Group 2
  const res6 = classifyRisk(['hospital_90d', 'age_over_60'], { scoreType: 'sofa', scoreValue: 0, isHighSeverity: false });
  assert(res6.group === 'group_2', '2 general risks + SOFA 0 -> Group 2');

  // Case G: 4 general risks -> Group 2
  const res7 = classifyRisk(['hospital_90d', 'invasive_device', 'iv_abx_30d', 'age_over_60'], { scoreType: 'sofa', scoreValue: 4, isHighSeverity: true }, ['mrsa', 'esbl']);
  assert(res7.group === 'group_2', '4 general risks -> Group 2');
  assert(res7.activeSpecificRisks.includes('mrsa') && res7.activeSpecificRisks.includes('esbl'), 'Retains specific risks tags');

  // Case H: Auto-inference from granular factor IDs (mrsa_fq_90d -> mrsa, ps_icu_5d -> pseudo_acineto)
  const res8 = classifyRisk(
    ['hospital_90d', 'invasive_device'],
    { scoreType: 'sofa', scoreValue: 2, isHighSeverity: true },
    [],
    { site: 'respiratory', specificRiskFactorIds: ['mrsa_fq_90d', 'ps_icu_5d'] }
  );
  assert(res8.activeSpecificRisks.includes('mrsa'), 'Auto-infers MRSA from mrsa_fq_90d');
  assert(res8.activeSpecificRisks.includes('pseudo_acineto'), 'Auto-infers pseudo_acineto from ps_icu_5d');
  assert(res8.isGramPosGramNegCoRisk === true, 'BVBND Note b: Triggers Gram(+) & Gram(-) co-risk alert');

  // Case I: Dual Gram(-) risk (ESBL + Pseudo/Acineto) -> isDualGramNegRisk = true
  const res9 = classifyRisk(
    ['hospital_90d', 'invasive_device'],
    { scoreType: 'sofa', scoreValue: 2, isHighSeverity: true },
    ['esbl', 'pseudo_acineto']
  );
  assert(res9.isDualGramNegRisk === true, 'BVBND Note b: Triggers dual Gram(-) risk prioritization');

  // Case J: Group 1 Suggested Organisms by Site
  const res10 = classifyRisk([], { scoreType: 'sofa', scoreValue: 0, isHighSeverity: false }, [], { site: 'skin_soft_tissue' });
  assert(res10.suggestedOrganismsVi.some(o => o.includes('Streptococcus')), 'Group 1 skin suggests Strep');
  assert(res10.suggestedOrganismsVi.some(o => o.includes('Staphylococcus aureus')), 'Group 1 skin suggests MSSA');
  console.log('\n[TEST GROUP 2: Empiric Regimen Selection]');
  
  // Adult CAP Group 1
  const capRegimens = getEmpiricRegimens('respiratory', 'adult', 'group_1');
  assert(capRegimens.length > 0, 'Finds adult respiratory Group 1 regimen');
  assert(capRegimens[0].drugs.some(d => d.drugId === 'ceftriaxon'), 'Group 1 respiratory contains Ceftriaxone');

  // Adult Pneumonia Group 2 + MRSA
  const mrsaRegimens = getEmpiricRegimens('respiratory', 'adult', 'group_2', undefined, ['mrsa']);
  assert(mrsaRegimens.length > 0, 'Finds adult respiratory Group 2 MRSA regimen');
  assert(mrsaRegimens[0].drugs.some(d => d.drugId === 'vancomycin'), 'MRSA respiratory contains Vancomycin');

  // Adult UTI Group 2 + ESBL
  const utiEsblRegimens = getEmpiricRegimens('urinary', 'adult', 'group_2', undefined, ['esbl']);
  assert(utiEsblRegimens.length > 0, 'Finds adult UTI Group 2 ESBL regimen');
  assert(utiEsblRegimens[0].drugs.some(d => d.drugId === 'ertapenem'), 'UTI ESBL contains Ertapenem');

  // 3. 48-72h REASSESSMENT TESTS (BVBND File 1, P.2)
  console.log('\n[TEST GROUP 3: 48-72h Reassessment Decision]');
  
  const re1 = evaluate48hReassessment('improved', 'negative', 'sensitive');
  assert(re1.actionType === 'de_escalate', 'Improved + Neg culture -> De-escalate');
  assert(re1.stopChecklistEligible === true, 'Stop checklist eligible');

  const re2 = evaluate48hReassessment('improved', 'positive', 'sensitive');
  assert(re2.actionType === 'de_escalate', 'Improved + Sensitive organism -> De-escalate');

  const re3 = evaluate48hReassessment('not_improved', 'positive', 'resistant');
  assert(re3.actionType === 'switch_by_ast', 'Not improved + Resistant -> Switch by AST');

  // 4. STOPPING CRITERIA TESTS (BVBND File 1, P.3)
  console.log('\n[TEST GROUP 4: Evidence-Based Antibiotic Stopping]');
  
  // CAP: 3 days, 5/5 clinical + 1 lab met -> canStop = true
  const stop1 = evaluateStopCriteria(
    ['crit_afebrile', 'crit_hemodynamic', 'crit_oxygenation', 'crit_local_signs', 'crit_oral_intake'],
    ['crit_pct'],
    3,
    'respiratory'
  );
  assert(stop1.canStop === true, 'CAP: 3 days + 5/5 clinical + PCT met -> CAN STOP');

  // CAP: only 2 days (< 3 days min) -> canStop = false
  const stop2 = evaluateStopCriteria(
    ['crit_afebrile', 'crit_hemodynamic', 'crit_oxygenation', 'crit_local_signs', 'crit_oral_intake'],
    ['crit_pct'],
    2,
    'respiratory'
  );
  assert(stop2.canStop === false, 'CAP: 2 days (< min days) -> CANNOT STOP');

  // CAP: 5 days but only 4/5 clinical met -> canStop = false
  const stop3 = evaluateStopCriteria(
    ['crit_afebrile', 'crit_hemodynamic', 'crit_oxygenation', 'crit_local_signs'], // missing oral intake
    ['crit_pct'],
    5,
    'respiratory'
  );
  assert(stop3.canStop === false, 'Missing 1 clinical criteria -> CANNOT STOP');

  // GI / Intra-abdominal: minDays is 4 (STOP-IT trial)
  const stopGi = evaluateStopCriteria(
    ['crit_afebrile', 'crit_hemodynamic', 'crit_oxygenation', 'crit_local_signs', 'crit_oral_intake'],
    ['crit_pct'],
    4,
    'gastrointestinal'
  );
  assert(stopGi.canStop === true && stopGi.minDays === 4, 'GI / Intra-abdominal benchmark: 4 days min');

  // SSTI: minDays is 5
  const stopSsti = evaluateStopCriteria(
    ['crit_afebrile', 'crit_hemodynamic', 'crit_oxygenation', 'crit_local_signs', 'crit_oral_intake'],
    ['crit_pct'],
    5,
    'skin_soft_tissue'
  );
  assert(stopSsti.canStop === true && stopSsti.minDays === 5, 'SSTI benchmark: 5 days min');

  // CNS (Meningitis): minDays is 10
  const stopCns = evaluateStopCriteria(
    ['crit_afebrile', 'crit_hemodynamic', 'crit_oxygenation', 'crit_local_signs', 'crit_oral_intake'],
    ['crit_pct'],
    9,
    'cns'
  );
  assert(stopCns.canStop === false && stopCns.minDays === 10, 'CNS / Meningitis benchmark: 10 days min (9 days CANNOT STOP)');

  // 5. IV-TO-PO SWITCH TESTS (BYT 2020)
  console.log('\n[TEST GROUP 5: IV-to-PO Switch Engine]');
  
  const switch1 = evaluateIvToPo(true, true, true, false, 'Levofloxacin IV');
  assert(switch1.isEligible === true, 'Afebrile, stable, gut OK, no contraindication -> ELIGIBLE');
  assert(switch1.suggestedPoDrugs.length > 0, 'Provides PO suggestion');

  const switch2 = evaluateIvToPo(false, true, true, false, 'Levofloxacin IV');
  assert(switch2.isEligible === false, 'Still fever -> NOT ELIGIBLE');
  assert(switch2.blockingReasonsVi.some(r => r.includes('sốt')), 'Lists fever as blocking reason');

  console.log('\n[TEST GROUP 6: PK/PD & Dosing Safeguard Calculations]');
  // Vancomycin loading dose in obesity (BMI >= 30): capped at 2000 mg
  const vancoData = extractDrugData('vancomycin');
  const obesePatient = { age: 45, gender: 'm' as const, weight: 110, height: 165, scr: 90, scrUnit: 'umol' as const, dialysis: 'none' as const };
  const obeseRenal = calculateRenalMetrics(obesePatient, vancoData.weightRule);
  const vancoObeseDose = calculateDose(vancoData, obeseRenal, 'standard', obesePatient);
  assert(vancoObeseDose.loadingDoseTextVi?.includes('2.000 mg') === true, 'Vancomycin loading dose in obesity capped at 2.000 mg');

  // Colistin maintenance start interval in renal failure (CrCl <= 40 mL/min): starts 24h after loading dose
  const colistinData = extractDrugData('colistin');
  const renalFailPatient = { age: 70, gender: 'm' as const, weight: 60, height: 168, scr: 220, scrUnit: 'umol' as const, dialysis: 'none' as const };
  const failRenal = calculateRenalMetrics(renalFailPatient, colistinData.weightRule);
  const colistinFailDose = calculateDose(colistinData, failRenal, 'standard', renalFailPatient);
  assert(colistinFailDose.selectedRowNoteVi?.includes('24 giờ') === true, 'Colistin maintenance interval delayed to 24h when CrCl <= 40');

  console.log('\n[TEST GROUP 7: Site-Specific Clinical Scoring Systems]');
  // Context-aware score filtering
  const respAdultScores = getAvailableScoresForSite('respiratory', 'adult').map(s => s.id);
  assert(
    respAdultScores.includes('curb65') && respAdultScores.includes('psi') && respAdultScores.includes('ats_cap') && respAdultScores.includes('cpis'),
    'Respiratory adult provides CURB-65, PSI, ATS/IDSA, CPIS'
  );
  const respPedsScores = getAvailableScoresForSite('respiratory', 'pediatric').map(s => s.id);
  assert(!respPedsScores.includes('curb65') && respPedsScores.includes('psofa_calc'), 'Respiratory pediatric excludes adult CURB-65 and includes pSOFA');

  // Auto-prefill from PatientState
  const elderlyCurb = buildDefaultCurb65({ age: 72, gender: 'm', weight: 60, height: 165, scr: 90, scrUnit: 'umol', dialysis: 'none' });
  assert(elderlyCurb.ageOver65 === true, 'CURB-65 auto-prefills age >= 65 from patient state');
  const lrinecDefault = buildDefaultLrinec(failRenal);
  assert(lrinecDefault.crOver141 === true, 'LRINEC auto-prefills Scr > 141 umol/L from patient renal metrics');

  // CURB-65 calculation
  const curbLow = calculateCurb65({ confusion: false, ureaOver7Mmol: false, rrOver30: false, bpLow: false, ageOver65: false });
  assert(curbLow.totalScore === 0 && curbLow.riskLevel === 'low', 'CURB-65 = 0 -> Low risk');
  const curbHigh = calculateCurb65({ confusion: true, ureaOver7Mmol: true, rrOver30: true, bpLow: false, ageOver65: true });
  assert(curbHigh.totalScore === 4 && curbHigh.riskLevel === 'critical', 'CURB-65 = 4 -> Critical risk');

  // PSI / PORT calculation
  const psiClass1 = calculatePsi({
    age: 35, isFemale: true, nursingHome: false, neoplasticDisease: false, liverDisease: false, chf: false,
    cerebrovascularDisease: false, renalDisease: false, alteredMentalStatus: false, rrOver30: false, sbpUnder90: false,
    tempAbnormal: false, hrOver125: false, phUnder735: false, bunOver30: false, naUnder130: false,
    glucoseOver250: false, hctUnder30: false, pao2Under60: false, pleuralEffusion: false
  });
  assert(psiClass1.displayScoreText.includes('Class I') && psiClass1.riskLevel === 'low', 'PSI young healthy female -> Class I');
  const psiClass5 = calculatePsi({
    age: 78, isFemale: false, nursingHome: true, neoplasticDisease: true, liverDisease: false, chf: true,
    cerebrovascularDisease: false, renalDisease: true, alteredMentalStatus: true, rrOver30: true, sbpUnder90: false,
    tempAbnormal: false, hrOver125: false, phUnder735: false, bunOver30: true, naUnder130: false,
    glucoseOver250: false, hctUnder30: false, pao2Under60: false, pleuralEffusion: false
  });
  assert(psiClass5.totalScore > 130 && psiClass5.displayScoreText.includes('Class V') && psiClass5.riskLevel === 'critical', 'PSI > 130 -> Class V Critical');

  // ATS/IDSA Severe CAP
  const atsSevere = calculateAtsCap({
    invasiveMechVent: false, septicShockVasopressors: false,
    rrOver30: true, pao2Fio2Under250: true, multilobarInfiltrates: true,
    confusion: false, bunOver20: false, wbcUnder4000: false, pltUnder100k: false, tempUnder36: false, hypotensionFluid: false
  });
  assert(atsSevere.riskLevel === 'high' && atsSevere.suggestedAction?.suggestGroup === 'group_2', 'ATS/IDSA 3 minor criteria -> Severe CAP');

  // CPIS > 6
  const cpisVap = calculateCpis({
    tempScore: 2, wbcScore: 1, secretionsScore: 2, oxygenationLow: true, xrayScore: 2, progression: false, culturePositive: 0
  });
  assert(cpisVap.totalScore === 9 && cpisVap.riskLevel === 'high', 'CPIS = 9 (> 6) -> High suspicion of VAP');

  // qSOFA & SOFA
  const qsofaPos = calculateQsofa({ alteredMental: true, rrOver22: true, sbpUnder100: false });
  assert(qsofaPos.totalScore === 2 && qsofaPos.riskLevel === 'high', 'qSOFA >= 2 -> Positive');
  const sofaSepsis = calculateSofaFull({ resp: 2, coag: 1, liver: 0, cardio: 2, cns: 0, renal: 1 });
  assert(sofaSepsis.totalScore === 6 && sofaSepsis.suggestedAction?.suggestSofaScore === 6, 'SOFA = 6 syncs back');

  // LRINEC
  const lrinecHigh = calculateLrinec({ crpOver150: true, wbcTier: 2, hbTier: 1, naUnder135: true, crOver141: true, glucoseOver10: false });
  assert(lrinecHigh.totalScore === 11 && lrinecHigh.riskLevel === 'critical', 'LRINEC = 11 (>= 8) -> Critical necrotizing fasciitis risk');

  // UTI ESBL Tumbarello
  const utiEsbl = calculateUtiEsbl({
    recentHospitalization: true, transferFromHealthcare: false, recentAbx3m: true,
    urinaryCatheter: false, ageOver70: false, maleGender: true, isPyelonephritisOrSepsis: true
  });
  assert(utiEsbl.totalScore === 6 && utiEsbl.suggestedAction?.suggestSpecificRisks?.includes('esbl') === true, 'Tumbarello ESBL >= 6 triggers ESBL suggestion');

  // CLIF-SOFA SBP + Albumin
  const clifSbp = calculateClifSbp({
    liverBiliTier: 3, renalCrTier: 2, brainHeGrade: 2, coagInrTier: 2, circMapVasopressor: 2, respPao2Fio2Tier: 1, sbpScrOver1Mgdl: true
  });
  assert(clifSbp.totalScore === 12 && clifSbp.riskLevel === 'critical' && (clifSbp.clinicalNotesVi?.[0].includes('ALBUMIN') ?? false), 'CLIF-SOFA = 12 triggers Group 2 and Albumin guidance');

  // TG18 Biliary
  const tg18Grade3 = calculateTg18Biliary({
    cardioVasopressor: true, neuroAltered: false, respPao2Fio2Under300: false, renalCrOver176: false, hepaticInrOver15: false, hematoPltUnder100k: false,
    wbcAbnormal: false, highFever39: false, ageOver75: false, hyperbilirubinemia: false, hypoalbuminemia: false
  });
  assert(tg18Grade3.totalScore === 3 && tg18Grade3.riskLevel === 'critical', 'TG18 with organ dysfunction -> Grade III');

  // CNS Meningitis (BMS + Listeria)
  const cnsMeningitis = calculateCnsMeningitis({
    gramStainPositive: true, csfProteinOver80: true, peripheralAncOver10k: false, csfAncOver1000: true, seizureAtPresentation: false,
    ageOver50: true, immunocompromisedOrPregnant: false, neurosurgeryOrShunt: false
  });
  assert(cnsMeningitis.totalScore === 4 && (cnsMeningitis.clinicalNotesVi?.some(n => n.includes('Ampicillin')) ?? false), 'BMS = 4 + age >= 50 triggers Listeria Ampicillin warning');

  console.log(`\nALL ${passed}/${total} CLINICAL TESTS PASSED SUCCESSFULLY!`);
}

runTests();
