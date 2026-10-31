import { ANTIBIOTICS } from '../src/data/antibiotics';
import { extractDrugData } from '../src/utils/drugDataExtractor';

const drugsWithEmpty: any[] = [];
for (const a of ANTIBIOTICS) {
  const d = extractDrugData(a.id);
  d.rows.forEach((r, idx) => {
    if (r.empty || (r.doses && Object.values(r.doses).every(v => v === null))) {
      drugsWithEmpty.push({ id: a.id, name: d.name, rowIdx: idx, label: r.label, empty: r.empty });
    }
  });
}
console.log('Drugs with empty or null doses count:', drugsWithEmpty.length);
console.log('Drugs with empty or null doses:', JSON.stringify(drugsWithEmpty, null, 2));
