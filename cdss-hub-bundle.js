(() => {
  // src/cdss-registry.ts
  var CDSS_MODULES = [
    {
      id: "cdss-dengue-fluid",
      slug: "dengue",
      title: "Ph\xE1c \u0110\u1ED3 D\u1ECBch Truy\u1EC1n & Ch\u1ED1ng S\u1ED1c SXHD Dengue (B\u1ED9 Y T\u1EBF 2023)",
      titleEn: "Dengue Fluid Resuscitation & Shock Management CDSS",
      shortTitle: "SXHD Dengue",
      brandCode: "DENGUE-BYT",
      department: "Truy\u1EC1n Nhi\u1EC5m \u2022 C\u1EA5p C\u1EE9u",
      urgency: "stat",
      statTrigger: "SXHD Ng\xE0y 4-6 \u2022 C\xF4 \u0110\u1EB7c Hct \u2022 S\u1ED1c T\u1EE5t Huy\u1EBFt \xC1p",
      shortDesc: "T\u1EF1 \u0111\u1ED9ng t\xEDnh c\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh CDC 2014, b\u1EA3ng k\u1EBF ho\u1EA1ch c\u1ECDc d\u1ECBch 4 c\u1ED9t \u0111\u1ED9ng h\u1ECDc v\xE0 li\u1EC1u v\u1EADn m\u1EA1ch Dopamin/Noradrenalin b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml.",
      category: "resuscitation",
      categoryName: "H\u1ED3i S\u1EE9c C\u1EA5p C\u1EE9u",
      version: "2.0.0 (BYT 2023)",
      updatedAt: "2026-09-08",
      author: "CliniPortal CDSS Squad & BYT Q\u0110 2760/Q\u0110-BYT",
      guidelineSource: "Quy\u1EBFt \u0111\u1ECBnh 2760/Q\u0110-BYT ng\xE0y 04/07/2023 c\u1EE7a B\u1ED9 Y t\u1EBF Vi\u1EC7t Nam",
      icd10: ["A97", "A97.0", "A97.1", "A97.2"],
      icon: "fa-solid fa-droplet",
      badge: "B\u1ED9 Y T\u1EBF 2023",
      features: ["C\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh CDC 2014", "C\u1ECDc d\u1ECBch 4 c\u1ED9t \u0111\u1ED9ng h\u1ECDc", "B\u01A1m ti\xEAm \u0111i\u1EC7n Dopamin/Noradrenalin", "S\u1ED1c tr\u01A1 & Dextran 40"],
      isStandalone: true,
      standaloneUrl: "dengue/index.html"
    },
    {
      id: "cdss-sepsis-risk",
      slug: "sepsis",
      title: "Ph\xE2n T\u1EA7ng Nguy C\u01A1 Nhi\u1EC5m Tr\xF9ng & S\u1ED1c Nhi\u1EC5m Khu\u1EA9n (SepsisCDSS)",
      titleEn: "Sepsis & Septic Shock Clinical Decision Support System",
      shortTitle: "SepsisCDSS",
      brandCode: "SEPSIS-3",
      department: "H\u1ED3i S\u1EE9c T\xEDch C\u1EF1c \u2022 C\u1EA5p C\u1EE9u",
      urgency: "stat",
      statTrigger: "S\u1ED1t Cao / H\u1EA1 Nhi\u1EC7t \u2022 T\u1EE5t HA \u2022 Lactate > 2 \u2022 T\u0103ng \u0110i\u1EC3m SOFA",
      shortDesc: "S\xE0ng l\u1ECDc \u0111a ph\u01B0\u01A1ng th\u1EE9c, nh\u1EADn di\u1EC7n v\xE0 ph\xE2n t\u1EA7ng nguy c\u01A1 nhi\u1EC5m tr\xF9ng, nhi\u1EC5m khu\u1EA9n huy\u1EBFt v\xE0 s\u1ED1c nhi\u1EC5m khu\u1EA9n theo NICE 2024/2026, Sepsis-3 (SOFA/qSOFA), Phoenix 2024 v\xE0 t\u1EF7 s\u1ED1 NLR.",
      category: "resuscitation",
      categoryName: "H\u1ED3i S\u1EE9c C\u1EA5p C\u1EE9u",
      version: "2.0.0 (NICE & Phoenix)",
      updatedAt: "2026-09-23",
      author: "CliniPortal Critical Care Squad & NICE NG253 / SSC 2024",
      guidelineSource: "NICE NG253 (2024/2026), Surviving Sepsis Campaign (SSC) & Phoenix 2024",
      icd10: ["A41.9", "R65.2", "R65.21", "A40"],
      icon: "fa-solid fa-biohazard",
      badge: "NICE 2024 + Phoenix",
      features: ["Thang \u0111i\u1EC3m SOFA & qSOFA", "Phoenix 2024 (Nhi khoa)", "NICE NG253 Ph\xE2n t\u1EA7ng nguy c\u01A1", "T\u1EF7 s\u1ED1 NLR & G\xF3i 1 gi\u1EDD SSC"],
      isStandalone: true,
      standaloneUrl: "sepsis/index.html"
    },
    {
      id: "cdss-ecg-analysis",
      slug: "ecg",
      title: "Ph\xE2n T\xEDch \u0110i\u1EC7n T\xE2m \u0110\u1ED3 12 Chuy\u1EC3n \u0110\u1EA1o & AI Ch\u1EA9n \u0110o\xE1n (ECG Master)",
      titleEn: "12-Lead ECG Waveform Analysis & Diagnostic Assistant CDSS",
      shortTitle: "ECG Master",
      brandCode: "ECG-MASTER",
      department: "Tim M\u1EA1ch \u2022 C\u1EA5p C\u1EE9u",
      urgency: "stat",
      statTrigger: "\u0110au Ng\u1EF1c C\u1EA5p \u2022 \u0110\u1ECBnh Khu STEMI \u2022 \u0110o Caliper \u2022 Lo\u1EA1n Nh\u1ECBp",
      shortDesc: "B\u1ED9 ph\xE2n t\xEDch \u0111i\u1EC7n t\xE2m \u0111\u1ED3 12 \u0111\u1EA1o tr\xECnh tr\u1EF1c quan tr\xEAn canvas \u0111\u1ED9 ph\xE2n gi\u1EA3i cao: 21 ca b\u1EC7nh l\xE2m s\xE0ng \u0111i\u1EC3n h\xECnh, \u0111o \u0111\u1EA1c th\u01B0\u1EDBc Caliper \u0111i\u1EC7n t\u1EED, c\u1EA9m nang 10 b\u01B0\u1EDBc BS Nguy\u1EC5n T\xF4n Kinh Thi, STEMI \u0111\u1ECBnh khu v\xE0 Brugada.",
      category: "cardiology",
      categoryName: "Tim M\u1EA1ch",
      version: "2.5.0 (21 Ca L\xE2m S\xE0ng)",
      updatedAt: "2026-09-09",
      author: "CliniPortal ECG Master Squad & Dr. Atul Luthra",
      guidelineSource: "AHA/ACC/HRS Guidelines & BS Nguy\u1EC5n T\xF4n Kinh Thi",
      icd10: ["I21", "I47", "I48", "I49"],
      icon: "fa-solid fa-heart-pulse",
      badge: "21 Ca L\xE2m S\xE0ng + Caliper",
      features: ["21 Ca l\xE2m s\xE0ng m\u1EABu", "Th\u01B0\u1EDBc Caliper \u0111o \u0111\u1EA1c miligi\xE2y", "10 B\u01B0\u1EDBc \u0111\u1ECDc BS Kinh Thi", "\u0110\u1ECBnh khu nh\u1ED3i m\xE1u STEMI"],
      isStandalone: true,
      standaloneUrl: "ecg/index.html"
    },
    {
      id: "cdss-abg-pro",
      slug: "abg",
      title: "Ph\xE2n T\xEDch Kh\xED M\xE1u \u0110\u1ED9ng M\u1EA1ch & X\u1EED Tr\xED L\xE2m S\xE0ng (ABG Pro)",
      titleEn: "Arterial Blood Gas Analysis & Acid-Base Decision Support",
      shortTitle: "Kh\xED M\xE1u ABG",
      brandCode: "ABG-PRO",
      department: "H\xF4 H\u1EA5p \u2022 H\u1ED3i S\u1EE9c T\xEDch C\u1EF1c",
      urgency: "stat",
      statTrigger: "Kh\xF3 Th\u1EDF \u2022 R\u1ED1i Lo\u1EA1n Toan Ki\u1EC1m H\u1ED7n H\u1EE3p \u2022 Anion Gap & PaO2",
      shortDesc: "\u0110\xE1nh gi\xE1 6 b\u01B0\u1EDBc r\u1ED1i lo\u1EA1n toan ki\u1EC1m, 24 ca l\xE2m s\xE0ng chuy\xEAn s\xE2u, Nomogram Siggaard-Andersen t\u01B0\u01A1ng t\xE1c, 3 c\xE2y quy\u1EBFt \u0111\u1ECBnh trao \u0111\u1ED5i kh\xED, GOLDMARK v\xE0 c\u1EA9m nang Test Allen.",
      category: "respiratory",
      categoryName: "H\xF4 H\u1EA5p & C\u1EA5p C\u1EE9u",
      version: "2.5.0 (24 Ca + Nomogram)",
      updatedAt: "2026-09-09",
      author: "CliniPortal Critical Care Squad & EBM Guidelines",
      guidelineSource: "Hennessey & Japp / Pierre & Ranson / ABG Made Easy",
      icd10: ["E87.2", "E87.3", "J96", "E10.1"],
      icon: "fa-solid fa-lungs",
      badge: "24 Ca + Nomogram",
      features: ["L\u01B0u \u0111\u1ED3 6 b\u01B0\u1EDBc toan ki\u1EC1m", "Nomogram Siggaard-Andersen", "24 Ca b\u1EC7nh k\xE8m gi\u1EA3i th\xEDch", "Anion Gap & GOLDMARK"],
      isStandalone: true,
      standaloneUrl: "abg/index.html"
    },
    {
      id: "cdss-antibiotic-dosing",
      slug: "antibiotic",
      title: "\u0110\xE1nh Gi\xE1 Nhi\u1EC5m Tr\xF9ng & Ph\xE1c \u0110\u1ED3, Li\u1EC1u Kh\xE1ng Sinh (InfectoDose CDSS)",
      titleEn: "Infection Assessment, MDR Risk Stratification & Antibiotic Dosing",
      shortTitle: "InfectoDose",
      brandCode: "INFECTODOSE",
      department: "Truy\u1EC1n Nhi\u1EC5m \u2022 D\u01B0\u1EE3c L\xE2m S\xE0ng",
      urgency: "urgent",
      statTrigger: "Nhi\u1EC5m Tr\xF9ng B\u1EC7nh Vi\u1EC7n \u2022 Nguy C\u01A1 MDR \u2022 Ch\u1EC9nh Li\u1EC1u Theo Th\u1EADn",
      shortDesc: "H\u1EC7 th\u1ED1ng 2 ph\xE2n h\u1EC7 ho\xE0n ch\u1EC9nh: (1) \u0110\xE1nh gi\xE1 nhi\u1EC5m tr\xF9ng NHSN-CDC, ph\xE2n t\u1EA7ng nguy c\u01A1 vi khu\u1EA9n \u0111a kh\xE1ng v\xE0 ph\xE1c \u0111\u1ED3 kh\u1EDFi \u0111\u1EA7u; (2) C\xE1 th\u1EC3 h\xF3a t\xEDnh li\u1EC1u 43 kh\xE1ng sinh, hi\u1EC7u ch\u1EC9nh CrCl/eGFR, l\u1ECDc m\xE1u HD/CRRT v\xE0 t\u01B0\u01A1ng t\xE1c DDI.",
      category: "pharmacology",
      categoryName: "Kh\xE1ng Sinh & D\u01B0\u1EE3c L\xFD",
      version: "3.0.0 (BVBND 2026 & NHSN)",
      updatedAt: "2026-10-10",
      author: "CliniPortal CDSS Squad & BV B\u1EC7nh Nhi\u1EC7t \u0110\u1EDBi & Sanford/Stanford",
      guidelineSource: "BV B\u1EC7nh Nhi\u1EC7t \u0110\u1EDBi (eMed 2026) & Q\u0110 5631/Q\u0110-BYT 2020",
      icd10: ["A41", "A49", "Z16", "N18"],
      icon: "fa-solid fa-viruses",
      badge: "BVBND 2026 + 43 KS",
      features: ["\u0110\xE1nh gi\xE1 nhi\u1EC5m tr\xF9ng NHSN-CDC", "Ph\xE2n t\u1EA7ng nguy c\u01A1 vi khu\u1EA9n MDR", "T\xEDnh li\u1EC1u 43 kh\xE1ng sinh", "Hi\u1EC7u ch\u1EC9nh CrCl & L\u1ECDc m\xE1u HD/CRRT"],
      isStandalone: true,
      standaloneUrl: "antibiotic/index.html"
    },
    {
      id: "cdss-vancomycin-pk",
      slug: "vancomycin",
      title: "Qu\u1EA3n L\xFD Li\u1EC1u & D\u01B0\u1EE3c \u0110\u1ED9ng H\u1ECDc Vancomycin (ASHP/IDSA 2020)",
      titleEn: "Vancomycin Precision Dosing & TDM AUC/MIC CDSS",
      shortTitle: "Vancomycin PK",
      brandCode: "VANCO-PK",
      department: "D\u01B0\u1EE3c L\xE2m S\xE0ng \u2022 ICU",
      urgency: "urgent",
      statTrigger: "T\xEDnh Li\u1EC1u N\u1EA1p 25-35 mg/kg \u2022 M\u1EE5c Ti\xEAu AUC 400-600 \u2022 L\u1ECDc M\xE1u",
      shortDesc: "H\u1ED7 tr\u1EE3 ra quy\u1EBFt \u0111\u1ECBnh l\xE2m s\xE0ng t\xEDnh to\xE1n li\u1EC1u n\u1EA1p, li\u1EC1u duy tr\xEC, ch\u1EC9nh li\u1EC1u theo CrCl/eGFR, b\xE9o ph\xEC (Zhang 2024), l\u1ECDc m\xE1u IHD, gi\xE1m s\xE1t n\u1ED3ng \u0111\u1ED9 \u0111\xE1y Trough v\xE0 TDM AUC24/MIC m\u1EE5c ti\xEAu 400-600.",
      category: "pharmacology",
      categoryName: "Kh\xE1ng Sinh & D\u01B0\u1EE3c L\xFD",
      version: "2.0.0 (ASHP 2020 & TDM)",
      updatedAt: "2026-09-22",
      author: "CliniPortal Pharmacology Squad & H\u01B0\u1EDBng d\u1EABn ASHP/IDSA 2020 & BV\u0110K C\xE0 Mau",
      guidelineSource: "ASHP/IDSA/PIDS/SIDP 2020 & H\u01B0\u1EDBng D\u1EABn BV\u0110K C\xE0 Mau",
      icd10: ["Z16", "N18", "A41", "B95.6"],
      icon: "fa-solid fa-syringe",
      badge: "ASHP 2020 + TDM AUC/MIC",
      features: ["T\xEDnh li\u1EC1u n\u1EA1p 25-35 mg/kg", "Li\u1EC1u duy tr\xEC theo thanh th\u1EA3i CrCl", "M\u1EE5c ti\xEAu AUC24/MIC 400-600 mg\xB7h/L", "Hi\u1EC7u ch\u1EC9nh b\u1EC7nh nh\xE2n b\xE9o ph\xEC (Zhang 2024)"],
      isStandalone: true,
      standaloneUrl: "vancomycin/index.html"
    },
    {
      id: "cdss-hepa-biochem",
      slug: "hepa",
      title: "Ph\xE2n T\xEDch Sinh H\xF3a Gan & Quy\u1EBFt \u0110\u1ECBnh L\xE2m S\xE0ng (HepaCDSS)",
      titleEn: "Liver Biochemistry & Clinical Decision Support System",
      shortTitle: "HepaCDSS",
      brandCode: "HEPACDSS",
      department: "Ti\xEAu H\xF3a \u2022 Gan M\u1EADt",
      urgency: "routine",
      statTrigger: "V\xE0ng Da \u1EE8 M\u1EADt \u2022 Men Gan T\u0103ng V\u1ECDt \u2022 T\u1EF7 S\u1ED1 R-ratio \u2022 X\u01A1 H\xF3a",
      shortDesc: "Ph\xE2n t\xEDch sinh h\xF3a gan chu\u1EA9n ACG, WHO: l\u01B0u \u0111\u1ED3 ti\u1EBFp c\u1EADn, t\xEDnh t\u1EF7 s\u1ED1 R-ratio, De Ritis, FIB-4, APRI, ph\xE2n t\u1EA7ng vi\xEAm gan virus, x\u01A1 gan Child-Pugh, MELD-Na v\xE0 t\u1ED5n th\u01B0\u01A1ng gan do thu\u1ED1c (DILI).",
      category: "gastroenterology",
      categoryName: "Ti\xEAu H\xF3a & Gan M\u1EADt",
      version: "2.0.0 (Chu\u1EA9n ACG & WHO)",
      updatedAt: "2026-09-08",
      author: "CliniPortal HepaCDSS Squad & ACG Guidelines",
      guidelineSource: "ACG Clinical Guideline (Am J Gastroenterol 2017) & WHO",
      icd10: ["K71", "K72", "K73", "K74"],
      icon: "fa-solid fa-virus",
      badge: "ACG & WHO Standard",
      features: ["T\u1EF7 s\u1ED1 R (R-ratio) t\u1ED5n th\u01B0\u01A1ng gan", "T\u1EF7 s\u1ED1 De Ritis (AST/ALT)", "X\u01A1 h\xF3a FIB-4 & APRI", "Child-Pugh & MELD-Na"],
      isStandalone: true,
      standaloneUrl: "hepa/index.html"
    },
    {
      id: "cdss-diacare-insulin",
      slug: "diacare",
      title: "Qu\u1EA3n L\xFD Insulin & \u0110\u01B0\u1EDDng Huy\u1EBFt N\u1ED9i Vi\u1EC7n (DiaCare CDSS)",
      titleEn: "DiaCare Inpatient Glycemic & Insulin Management CDSS",
      shortTitle: "DiaCare Insulin",
      brandCode: "DIACARE",
      department: "N\u1ED9i Ti\u1EBFt \u2022 N\u1ED9i T\u1ED5ng Qu\xE1t",
      urgency: "urgent",
      statTrigger: "C\u1EA5p C\u1EE9u Toan Ceton DKA / HHS \u2022 Ph\xE1c \u0110\u1ED3 Basal-Bolus & Tr\u01B0\u1EE3t SSI",
      shortDesc: "H\u1EC7 th\u1ED1ng qu\u1EA3n l\xFD \u0111\xE1i th\xE1o \u0111\u01B0\u1EDDng n\u1ED9i vi\u1EC7n, t\u1EF1 \u0111\u1ED9ng t\xEDnh to\xE1n li\u1EC1u insulin ph\xE1c \u0111\u1ED3 Basal-Bolus, hi\u1EC7u ch\u1EC9nh suy th\u1EADn/suy gan/b\xE9o ph\xEC, ph\xE1c \u0111\u1ED3 tr\u01B0\u1EE3t SSI, x\u1EED tr\xED c\u1EA5p c\u1EE9u DKA/HHS v\xE0 t\xECnh hu\u1ED1ng \u0111\u1EB7c th\xF9 (chu ph\u1EABu, corticoid, l\u1ECDc m\xE1u, sonde).",
      category: "endocrinology",
      categoryName: "N\u1ED9i Ti\u1EBFt & Chuy\u1EC3n H\xF3a",
      version: "2.0.0 (ADA 2026 & JBDS)",
      updatedAt: "2026-09-28",
      author: "CliniPortal CDSS Squad & ADA 2026 / JBDS-IP",
      guidelineSource: "ADA Standards of Care 2026 (Hospital Care) & JBDS-IP",
      icd10: ["E10", "E11", "E14", "E87.2"],
      icon: "fa-solid fa-vial-circle-check",
      badge: "ADA 2026 + Basal-Bolus",
      features: ["Ph\xE1c \u0111\u1ED3 Basal-Bolus c\xE1 th\u1EC3 h\xF3a", "Ph\xE1c \u0111\u1ED3 tr\u01B0\u1EE3t hi\u1EC7u ch\u1EC9nh SSI", "C\u1EA5p c\u1EE9u toan ceton DKA & HHS", "T\xECnh hu\u1ED1ng chu ph\u1EABu, corticoid, sonde"],
      isStandalone: true,
      standaloneUrl: "diacare/index.html"
    },
    {
      id: "cdss-csf-analysis",
      slug: "csf",
      title: "Ph\xE2n T\xEDch D\u1ECBch N\xE3o T\u1EE7y & H\u1ED7 Tr\u1EE3 Quy\u1EBFt \u0110\u1ECBnh L\xE2m S\xE0ng (CSF CDSS)",
      titleEn: "Cerebrospinal Fluid Analysis & Diagnostic Decision Support CDSS",
      shortTitle: "D\u1ECBch N\xE3o T\u1EE7y CSF",
      brandCode: "CSF-CDSS",
      department: "Th\u1EA7n Kinh \u2022 Truy\u1EC1n Nhi\u1EC5m",
      urgency: "stat",
      statTrigger: "S\u1ED1t, \u0110au \u0110\u1EA7u S\xE9t \u0110\xE1nh, C\u1ED5 C\u1EE9ng \u2022 Ph\xE2n T\u1EA7ng Vi\xEAm M\xE0ng N\xE3o",
      shortDesc: "Bi\u1EC7n gi\u1EA3i d\u1ECBch n\xE3o t\u1EE7y to\xE0n di\u1EC7n: ph\xE2n t\u1EA7ng ch\u1EA9n \u0111o\xE1n vi\xEAm m\xE0ng n\xE3o vi khu\u1EA9n, virus, lao, n\u1EA5m Cryptococcus, xu\u1EA5t huy\u1EBFt d\u01B0\u1EDBi nh\u1EC7n (SAH) vs ch\u1EA1m m\u1EA1ch (3-tube test), t\u1EF7 s\u1ED1 Glucose DNT/m\xE1u v\xE0 c\u1EA9m nang ch\u1ECDc d\xF2 LP.",
      category: "neurology",
      categoryName: "Th\u1EA7n Kinh & Truy\u1EC1n Nhi\u1EC5m",
      version: "2.5.0 (EFNS & EBM)",
      updatedAt: "2026-10-22",
      author: "CliniPortal Neurology Squad & EFNS Guidelines",
      guidelineSource: "EFNS Guidelines on routine cerebrospinal fluid analysis & EBM",
      icd10: ["G00", "G03", "G04", "A17.0"],
      icon: "fa-solid fa-brain",
      badge: "EFNS 2006 + 7 Ca M\u1EABu",
      features: ["Ph\xE2n t\u1EA7ng Vi khu\u1EA9n / Virus / Lao / N\u1EA5m", "Ph\xE2n bi\u1EC7t Ch\u1EA1m m\u1EA1ch vs SAH", "T\u1EF7 s\u1ED1 Glucose & Lactate DNT", "C\u1EA9m nang k\u1EF9 thu\u1EADt ch\u1ECDc d\xF2 DNT (LP)"],
      isStandalone: true,
      standaloneUrl: "csf/index.html"
    },
    {
      id: "cdss-inpatient-exam",
      slug: "inpatient",
      title: "Ti\u1EBFp C\u1EADn L\xE2m S\xE0ng & Kh\xE1m B\u1EC7nh N\u1ED9i Tr\xFA (Bates & Macleod)",
      titleEn: "Inpatient Clinical Examination & Diagnostic Approach CDSS",
      shortTitle: "Kh\xE1m B\u1EC7nh Bates",
      brandCode: "BATES-CLINIC",
      department: "N\u1ED9i Khoa & Kh\xE1m B\u1EC7nh",
      urgency: "routine",
      statTrigger: "H\u1ECFi B\u1EC7nh S\u1EED 7 Thu\u1ED9c T\xEDnh (OPQRST) \u2022 Kh\xE1m H\u1EC7 C\u01A1 Quan Bates",
      shortDesc: "C\u1EA9m nang kh\xE1m l\xE2m s\xE0ng c\xF3 h\u1EC7 th\u1ED1ng, ti\u1EBFp c\u1EADn c\xE1c h\u1ED9i ch\u1EE9ng v\xE0 tri\u1EC7u ch\u1EE9ng b\u1EC7nh n\u1ED9i tr\xFA kinh \u0111i\u1EC3n, b\u1ED9 c\xF4ng c\u1EE5 h\u1ECFi b\u1EC7nh s\u1EED 7 thu\u1ED9c t\xEDnh, tra c\u1EE9u nhanh v\xE0 ghi ch\xFA m\u1EE5c ti\xEAu l\xE2m s\xE0ng.",
      category: "internal",
      categoryName: "N\u1ED9i Khoa & L\xE2m S\xE0ng",
      version: "1.0.0 (Bates & Macleod)",
      updatedAt: "2026-09-28",
      author: "CliniPortal CDSS Squad & Bates / Macleod",
      guidelineSource: "Bates\u2019 Pocket Guide to Physical Examination & Macleod's Clinical Examination",
      icd10: ["R00-R99", "Z00.0"],
      icon: "fa-solid fa-stethoscope",
      badge: "Bates & Macleod",
      features: ["H\u1ECFi b\u1EC7nh s\u1EED 7 thu\u1ED9c t\xEDnh (OPQRST)", "Kh\xE1m h\u1EC7 c\u01A1 quan to\xE0n di\u1EC7n Bates", "Ti\u1EBFp c\u1EADn 30+ h\u1ED9i ch\u1EE9ng & tri\u1EC7u ch\u1EE9ng", "Ch\u1EA9n \u0111o\xE1n ph\xE2n bi\u1EC7t & B\u1EABy l\xE2m s\xE0ng"],
      isStandalone: true,
      standaloneUrl: "inpatient/index.html"
    }
  ];
  function getCDSSModuleById(id) {
    return CDSS_MODULES.find((m) => m.id === id);
  }
  function getCDSSModuleBySlug(slug) {
    return CDSS_MODULES.find((m) => m.slug === slug);
  }

  // src/index.ts
  var STAT_TRIAGE_ITEMS = [
    { slug: "dengue", label: "S\u1ED1c SXHD Dengue", trigger: "Hct cao, c\xF4 \u0111\u1EB7c m\xE1u, s\u1ED1c t\u1EE5t HA", icon: "fa-solid fa-droplet" },
    { slug: "sepsis", label: "Sepsis & S\u1ED1c Nhi\u1EC5m Khu\u1EA9n", trigger: "S\u1ED1t cao, t\u1EE5t HA, Lactate > 2, SOFA", icon: "fa-solid fa-biohazard" },
    { slug: "abg", label: "Kh\xED M\xE1u ABG & Toan Ki\u1EC1m", trigger: "Toan chuy\u1EC3n h\xF3a, PaO2/PaCO2, Anion Gap", icon: "fa-solid fa-lungs" },
    { slug: "ecg", label: "STEMI ECG 12 Chuy\u1EC3n \u0110\u1EA1o", trigger: "\u0110au ng\u1EF1c, STEMI \u0111\u1ECBnh khu, QTc, Caliper", icon: "fa-solid fa-heart-pulse" },
    { slug: "csf", label: "D\u1ECBch N\xE3o T\u1EE7y CSF", trigger: "S\u1ED1t, \u0111au \u0111\u1EA7u, vi\xEAm m\xE0ng n\xE3o, SAH", icon: "fa-solid fa-brain" }
  ];
  var PINNED_STORAGE_KEY = "cdss_pinned_module_slugs";
  var VIEW_MODE_STORAGE_KEY = "cdss_preferred_view_mode";
  function getPinnedSlugs() {
    try {
      const raw = localStorage.getItem(PINNED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function setPinnedSlugs(slugs) {
    try {
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(slugs));
    } catch (e) {
    }
  }
  function getStoredViewMode() {
    try {
      const mode = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      return mode === "grid" || mode === "table" || mode === "grouped" ? mode : "grid";
    } catch (e) {
      return "grid";
    }
  }
  function setStoredViewMode(mode) {
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch (e) {
    }
  }
  function initCDSSHub(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let activeCategory = "all";
    let searchQuery = "";
    let viewMode = getStoredViewMode();
    let pinnedSlugs = getPinnedSlugs();
    const categories = [
      { id: "all", label: "T\u1EA5t c\u1EA3 (10)", icon: "fa-solid fa-shapes" },
      { id: "stat", label: "\u{1F6A8} C\u1EA5p c\u1EE9u STAT (5)", icon: "fa-solid fa-bolt-lightning", isStat: true },
      { id: "resus", label: "H\u1ED3i s\u1EE9c & C\u1EA5p c\u1EE9u", icon: "fa-solid fa-truck-medical" },
      { id: "cardio-resp", label: "Tim m\u1EA1ch & H\xF4 h\u1EA5p", icon: "fa-solid fa-heart-pulse" },
      { id: "pharma", label: "Kh\xE1ng sinh & D\u01B0\u1EE3c", icon: "fa-solid fa-pills" },
      { id: "internal", label: "N\u1ED9i khoa & Th\u1EA7n kinh", icon: "fa-solid fa-hospital-user" }
    ];
    const specialtyGroups = [
      {
        id: "group-resus",
        title: "H\u1ED3i S\u1EE9c C\u1EA5p C\u1EE9u & Nhi\u1EC5m Tr\xF9ng Nguy K\u1ECBch",
        desc: "Ph\xE1c \u0111\u1ED3 b\xF9 d\u1ECBch ch\u1ED1ng s\u1ED1c SXHD Dengue, ph\xE2n t\u1EA7ng nhi\u1EC5m khu\u1EA9n huy\u1EBFt v\xE0 toan ki\u1EC1m c\u01A1 th\u1EC3",
        icon: "fa-solid fa-truck-medical",
        slugs: ["dengue", "sepsis", "abg"]
      },
      {
        id: "group-cardio-resp",
        title: "Tim M\u1EA1ch, H\xF4 H\u1EA5p & \u0110i\u1EC7n Tim Chuy\xEAn S\xE2u",
        desc: "Ph\xE2n t\xEDch \u0111i\u1EC7n t\xE2m \u0111\u1ED3 12 \u0111\u1EA1o tr\xECnh tr\u1EF1c quan tr\xEAn canvas v\xE0 th\u0103ng b\u1EB1ng toan ki\u1EC1m kh\xED m\xE1u",
        icon: "fa-solid fa-heart-pulse",
        slugs: ["ecg", "abg"]
      },
      {
        id: "group-pharma",
        title: "D\u01B0\u1EE3c \u0110\u1ED9ng H\u1ECDc Kh\xE1ng Sinh & T\u1ED1i \u01AFu H\xF3a Li\u1EC1u",
        desc: "C\xE1 th\u1EC3 h\xF3a li\u1EC1u 43 kh\xE1ng sinh theo \u0111\u1ED9 thanh th\u1EA3i th\u1EADn l\u1ECDc m\xE1u v\xE0 TDM Vancomycin AUC/MIC",
        icon: "fa-solid fa-pills",
        slugs: ["antibiotic", "vancomycin"]
      },
      {
        id: "group-internal",
        title: "Ti\xEAu H\xF3a - Gan M\u1EADt, Chuy\u1EC3n H\xF3a & Th\u1EA7n Kinh",
        desc: "Bi\u1EC7n gi\u1EA3i sinh h\xF3a gan ACG, qu\u1EA3n l\xFD insulin n\u1ED9i vi\u1EC7n, ch\u1ECDc d\xF2 d\u1ECBch n\xE3o t\u1EE7y v\xE0 k\u1EF9 n\u0103ng kh\xE1m Bates",
        icon: "fa-solid fa-hospital-user",
        slugs: ["hepa", "diacare", "csf", "inpatient"]
      }
    ];
    function filterModules(modules) {
      const q = searchQuery.toLowerCase().trim();
      return modules.filter((m) => {
        let matchCat = false;
        if (activeCategory === "all") {
          matchCat = true;
        } else if (activeCategory === "stat") {
          matchCat = m.urgency === "stat";
        } else if (activeCategory === "resus") {
          matchCat = m.category === "resuscitation";
        } else if (activeCategory === "cardio-resp") {
          matchCat = m.category === "cardiology" || m.category === "respiratory";
        } else if (activeCategory === "pharma") {
          matchCat = m.category === "pharmacology";
        } else if (activeCategory === "internal") {
          matchCat = m.category === "gastroenterology" || m.category === "endocrinology" || m.category === "neurology" || m.category === "internal";
        } else {
          matchCat = m.category === activeCategory;
        }
        const matchSearch = !q || m.title.toLowerCase().includes(q) || m.titleEn && m.titleEn.toLowerCase().includes(q) || m.shortTitle && m.shortTitle.toLowerCase().includes(q) || m.brandCode && m.brandCode.toLowerCase().includes(q) || m.department && m.department.toLowerCase().includes(q) || m.statTrigger && m.statTrigger.toLowerCase().includes(q) || m.shortDesc.toLowerCase().includes(q) || m.guidelineSource.toLowerCase().includes(q) || m.features && m.features.some((f) => f.toLowerCase().includes(q)) || m.icd10 && m.icd10.some((c) => c.toLowerCase().includes(q));
        return matchCat && matchSearch;
      });
    }
    function render() {
      const filtered = filterModules(CDSS_MODULES);
      const pinnedModules = CDSS_MODULES.filter((m) => pinnedSlugs.includes(m.slug));
      const activeCatObj = categories.find((c) => c.id === activeCategory);
      container.innerHTML = `
      <div class="cdss-hub-workspace">

        <!-- ================================================================
             1. REFINED BEDSIDE HERO (Minimalist, Professional, High Clarity)
             ================================================================ -->
        <header class="cdss-hero">
          <div class="cdss-hero-badge">
            <span class="cdss-badge-dot"></span>
            <span>H\u1EC6 TH\u1ED0NG CDSS \u0110\u1ED8C L\u1EACP \xB7 BEDSIDE READY</span>
            <span class="cdss-hero-version">v2.5</span>
          </div>
          <h1 class="cdss-hero-title">Trung T\xE2m H\u1ED7 Tr\u1EE3 Quy\u1EBFt \u0110\u1ECBnh L\xE2m S\xE0ng</h1>
          <p class="cdss-hero-subtitle">
            H\u1EE3p nh\u1EA5t 10 c\xF4ng c\u1EE5 l\xE2m s\xE0ng chuy\xEAn s\xE2u t\u1EA1i gi\u01B0\u1EDDng b\u1EC7nh chu\u1EA9n B\u1ED9 Y T\u1EBF &amp; Y h\u1ECDc ch\u1EE9ng c\u1EE9 (EBM).
            T\xEDnh to\xE1n li\u1EC1u, ph\xE2n t\u1EA7ng nguy c\u01A1 v\xE0 ph\xE1c \u0111\u1ED3 x\u1EED tr\xED 100% Client-side ngo\u1EA1i tuy\u1EBFn.
          </p>
        </header>

        <!-- ================================================================
             2. COMMAND LAUNCHER BAR (Search, STAT Quick Strip, Filters)
             ================================================================ -->
        <section class="cdss-command-bar">
          <!-- Main Search Box -->
          <div class="cdss-search-wrap">
            <i class="fa-solid fa-magnifying-glass cdss-search-icon"></i>
            <input 
              id="cdss-search-input" 
              type="text" 
              class="cdss-search-input"
              placeholder="Tra c\u1EE9u nhanh theo t\xEAn CDSS, thu\u1ED1c, b\u1EC7nh l\xFD, ch\u1EC9 \u0111\u1ECBnh, m\xE3 ICD-10 (nh\u1EA5n / \u0111\u1EC3 t\xECm)..." 
              value="${searchQuery}"
              autocomplete="off"
              spellcheck="false"
            />
            ${searchQuery ? `
              <button id="cdss-clear-search" class="cdss-search-clear" title="X\xF3a t\u1EEB kh\xF3a t\xECm ki\u1EBFm" aria-label="X\xF3a t\xECm ki\u1EBFm">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : `
              <span class="cdss-search-kbd" title="Nh\u1EA5n / \u0111\u1EC3 tra c\u1EE9u nhanh">/</span>
            `}
          </div>

          <!-- Rapid STAT Shortcuts Strip -->
          <div class="cdss-stat-strip" id="cdss-rapid-bar">
            <span class="cdss-stat-strip-label">
              <i class="fa-solid fa-bolt-lightning text-amber-500"></i> STAT C\u1EA5p C\u1EE9u:
            </span>
            <div class="cdss-stat-strip-items">
              ${STAT_TRIAGE_ITEMS.map((item) => `
                <button 
                  type="button" 
                  class="cdss-stat-quick-link" 
                  data-quick-slug="${item.slug}"
                  title="${item.label} \u2014 ${item.trigger}"
                >
                  <i class="${item.icon}"></i>
                  <span>${item.label}</span>
                </button>
              `).join("")}
            </div>
          </div>

          <!-- Pinned Favorites Strip (Rendered only if pinned tools exist) -->
          ${pinnedModules.length > 0 ? `
            <div class="cdss-pinned-bar">
              <div class="cdss-pinned-head">
                <i class="fa-solid fa-star text-amber-500"></i>
                <span>\u0110\xE3 ghim (${pinnedModules.length}):</span>
              </div>
              <div class="cdss-pinned-items">
                ${pinnedModules.map((m) => `
                  <div class="cdss-pinned-chip">
                    <a href="${m.standaloneUrl}" class="cdss-pinned-link">
                      <i class="${m.icon}"></i>
                      <span>${m.shortTitle || m.title}</span>
                    </a>
                    <button type="button" class="cdss-pinned-remove" data-unpin-slug="${m.slug}" title="B\u1ECF ghim">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                `).join("")}
                <button type="button" id="cdss-clear-all-pinned" class="cdss-pinned-clear-btn" title="X\xF3a t\u1EA5t c\u1EA3 m\u1EE5c \u0111\xE3 ghim">
                  X\xF3a h\u1EBFt
                </button>
              </div>
            </div>
          ` : ""}

          <!-- Filters Row: Category Tabs + View Switcher -->
          <div class="cdss-filter-row">
            <div class="cdss-category-tabs">
              ${categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return `
                  <button 
                    type="button" 
                    class="cdss-cat-tab ${isActive ? "active" : ""} ${cat.isStat ? "is-stat" : ""}" 
                    data-cat="${cat.id}"
                  >
                    <i class="${cat.icon}"></i>
                    <span>${cat.label}</span>
                  </button>
                `;
      }).join("")}
            </div>

            <div class="cdss-view-toggle">
              <button 
                type="button" 
                class="cdss-view-btn ${viewMode === "grid" ? "active" : ""}" 
                data-mode="grid"
                title="Xem d\u1EA1ng L\u01B0\u1EDBi Th\u1EBB Chuy\xEAn Khoa"
              >
                <i class="fa-solid fa-table-cells-large"></i>
                <span>L\u01B0\u1EDBi</span>
              </button>
              <button 
                type="button" 
                class="cdss-view-btn ${viewMode === "table" ? "active" : ""}" 
                data-mode="table"
                title="Xem d\u1EA1ng B\u1EA3ng G\u1ECDn Gi\u01B0\u1EDDng B\u1EC7nh"
              >
                <i class="fa-solid fa-table-list"></i>
                <span>B\u1EA3ng g\u1ECDn</span>
              </button>
              <button 
                type="button" 
                class="cdss-view-btn ${viewMode === "grouped" ? "active" : ""}" 
                data-mode="grouped"
                title="Xem theo Kh\u1ED1i Khoa L\xE2m S\xE0ng"
              >
                <i class="fa-solid fa-layer-group"></i>
                <span>Nh\xF3m khoa</span>
              </button>
            </div>
          </div>
        </section>

        <!-- ================================================================
             3. RESULTS STATUS & RESET CONTROLS
             ================================================================ -->
        <div class="cdss-status-row">
          <div class="cdss-status-left">
            <span>Hi\u1EC3n th\u1ECB <strong>${filtered.length}</strong> / <strong>${CDSS_MODULES.length}</strong> c\xF4ng c\u1EE5 CDSS</span>
            ${activeCategory !== "all" ? `
              <span class="cdss-active-filter-tag">
                ${activeCatObj?.label}
                <button type="button" data-reset="category" class="cdss-tag-close" title="B\u1ECF l\u1ECDc chuy\xEAn khoa">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </span>
            ` : ""}
            ${searchQuery ? `
              <span class="cdss-active-filter-tag">
                "${searchQuery}"
                <button type="button" data-reset="search" class="cdss-tag-close" title="X\xF3a t\u1EEB kh\xF3a t\xECm ki\u1EBFm">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </span>
            ` : ""}
          </div>

          ${activeCategory !== "all" || searchQuery ? `
            <button type="button" id="cdss-reset-filters-btn" class="cdss-reset-btn">
              <i class="fa-solid fa-rotate-left"></i> \u0110\u1EB7t l\u1EA1i b\u1ED9 l\u1ECDc
            </button>
          ` : ""}
        </div>

        <!-- Empty State -->
        ${filtered.length === 0 ? `
          <div class="cdss-empty-box">
            <i class="fa-solid fa-magnifying-glass cdss-empty-icon"></i>
            <h3 class="cdss-empty-title">Kh\xF4ng t\xECm th\u1EA5y c\xF4ng c\u1EE5 CDSS ph\xF9 h\u1EE3p</h3>
            <p class="cdss-empty-desc">
              Kh\xF4ng c\xF3 c\xF4ng c\u1EE5 n\xE0o kh\u1EDBp v\u1EDBi t\u1EEB kh\xF3a "<strong>${searchQuery}</strong>". Th\u1EED t\xECm ki\u1EBFm v\u1EDBi t\u1EEB kh\xF3a kh\xE1c nh\u01B0 <em>Dengue, Sepsis, ABG, ECG, Vancomycin, Insulin, DNT</em> ho\u1EB7c ch\u1ECDn chuy\xEAn khoa b\xEAn tr\xEAn.
            </p>
            <button type="button" id="cdss-empty-reset" class="cdss-empty-btn">
              <i class="fa-solid fa-arrows-rotate"></i> Xem t\u1EA5t c\u1EA3 10 c\xF4ng c\u1EE5 CDSS
            </button>
          </div>
        ` : ""}

        <!-- ================================================================
             4. VIEW MODES (GRID, TABLE, GROUPED)
             ================================================================ -->

        <!-- VIEW MODE 1: MINIMALIST PROFESSIONAL CARDS GRID (DEFAULT) -->
        ${viewMode === "grid" && filtered.length > 0 ? `
          <div class="cdss-grid">
            ${filtered.map((m) => renderCard(m)).join("")}
          </div>
        ` : ""}

        <!-- VIEW MODE 2: COMPACT TABLE (BEDSIDE ROUNDS) -->
        ${viewMode === "table" && filtered.length > 0 ? `
          <div class="cdss-table-container">
            <table class="cdss-table">
              <thead>
                <tr>
                  <th style="width: 44px; text-align: center;">\u2605</th>
                  <th style="width: 28%;">C\xF4ng c\u1EE5 CDSS</th>
                  <th style="width: 16%;">Chuy\xEAn khoa &amp; M\u1EE9c</th>
                  <th style="width: 32%;">Ch\u1EC9 \u0111\u1ECBnh &amp; Ph\u1EA1m vi t\xEDnh to\xE1n</th>
                  <th style="width: 14%;">C\u01A1 s\u1EDF h\u01B0\u1EDBng d\u1EABn</th>
                  <th style="width: 10%; text-align: right;">Thao t\xE1c</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map((m) => {
        const isPinned = pinnedSlugs.includes(m.slug);
        const isStat = m.urgency === "stat";
        return `
                    <tr class="cdss-table-row" id="cdss-row-${m.slug}">
                      <td style="text-align: center;">
                        <button 
                          type="button" 
                          class="cdss-star-btn ${isPinned ? "pinned" : ""}" 
                          data-pin-slug="${m.slug}" 
                          title="${isPinned ? "B\u1ECF ghim" : "Ghim y\xEAu th\xEDch"}"
                          aria-label="${isPinned ? "B\u1ECF ghim" : "Ghim"}"
                        >
                          <i class="${isPinned ? "fa-solid" : "fa-regular"} fa-star"></i>
                        </button>
                      </td>
                      <td>
                        <div class="cdss-table-cell-title">
                          <a href="${m.standaloneUrl}" class="cdss-table-link">
                            ${m.title}
                          </a>
                          <div class="cdss-table-sub">
                            <span class="cdss-table-code">${m.brandCode}</span>
                            ${m.titleEn ? `<span>${m.titleEn}</span>` : ""}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="cdss-table-dept">${m.department || m.categoryName}</div>
                        ${isStat ? `<span class="cdss-stat-tag">\u{1F6A8} STAT C\u1EA5p c\u1EE9u</span>` : `<span class="cdss-routine-tag">Th\u01B0\u1EDDng quy</span>`}
                      </td>
                      <td>
                        <p class="cdss-table-desc">${m.shortDesc}</p>
                        ${m.features ? `
                          <div class="cdss-table-features">
                            ${m.features.slice(0, 3).join(" \xB7 ")}
                          </div>
                        ` : ""}
                      </td>
                      <td>
                        <div class="cdss-table-guide">${m.badge || m.guidelineSource}</div>
                      </td>
                      <td style="text-align: right;">
                        <a href="${m.standaloneUrl}" class="cdss-table-action-btn">
                          <span>M\u1EDF</span>
                          <i class="fa-solid fa-arrow-right"></i>
                        </a>
                      </td>
                    </tr>
                  `;
      }).join("")}
              </tbody>
            </table>
          </div>
        ` : ""}

        <!-- VIEW MODE 3: SPECIALTY CLINICAL GROUPS -->
        ${viewMode === "grouped" && filtered.length > 0 ? `
          <div class="cdss-groups-container">
            ${specialtyGroups.map((grp) => {
        const groupModules = filtered.filter((m) => grp.slugs.includes(m.slug));
        if (groupModules.length === 0) return "";
        return `
                <div class="cdss-group-card">
                  <div class="cdss-group-header-row">
                    <div class="cdss-group-title-wrap">
                      <div class="cdss-group-icon">
                        <i class="${grp.icon}"></i>
                      </div>
                      <div>
                        <h3 class="cdss-group-title">${grp.title}</h3>
                        <p class="cdss-group-desc">${grp.desc}</p>
                      </div>
                    </div>
                    <span class="cdss-group-counter">${groupModules.length} Modules</span>
                  </div>

                  <div class="cdss-grid" style="margin-bottom:0;">
                    ${groupModules.map((m) => renderCard(m)).join("")}
                  </div>
                </div>
              `;
      }).join("")}
          </div>
        ` : ""}

        <!-- ================================================================
             5. REFINED EBM LEGAL & CLINICAL STANDARDS FOOTER
             ================================================================ -->
        <footer class="cdss-bottom-info">
          <div class="cdss-bottom-info-inner">
            <div class="cdss-info-col">
              <div class="cdss-info-title">
                <i class="fa-solid fa-circle-check text-teal-600"></i>
                <span>B\u1ED9 Y T\u1EBF Vi\u1EC7t Nam</span>
              </div>
              <p>Tu\xE2n th\u1EE7 Quy\u1EBFt \u0111\u1ECBnh 2760/Q\u0110-BYT (SXHD Dengue), 5631/Q\u0110-BYT (S\u1EED d\u1EE5ng kh\xE1ng sinh), H\u01B0\u1EDBng d\u1EABn BV B\u1EC7nh Nhi\u1EC7t \u0110\u1EDBi eMed 2026 v\xE0 BV\u0110K C\xE0 Mau.</p>
            </div>
            <div class="cdss-info-col">
              <div class="cdss-info-title">
                <i class="fa-solid fa-shield-halved text-teal-600"></i>
                <span>Y H\u1ECDc Ch\u1EE9ng C\u1EE9 Qu\u1ED1c T\u1EBF</span>
              </div>
              <p>C\u1EADp nh\u1EADt theo NICE NG253 (2024/2026), Surviving Sepsis Campaign, Phoenix 2024, ASHP/IDSA 2020 (Vancomycin AUC/MIC), ADA 2026, EFNS v\xE0 ACG 2017.</p>
            </div>
            <div class="cdss-info-col">
              <div class="cdss-info-title">
                <i class="fa-solid fa-lock text-teal-600"></i>
                <span>B\u1EA3o M\u1EADt Y Khoa &amp; Ngo\u1EA1i Tuy\u1EBFn</span>
              </div>
              <p>To\xE0n b\u1ED9 thu\u1EADt to\xE1n ch\u1EA1y 100% t\u1EA1i tr\xECnh duy\u1EC7t b\xE1c s\u0129 (Client-side), kh\xF4ng truy\u1EC1n d\u1EEF li\u1EC7u \u0111\u1ECBnh danh b\u1EC7nh nh\xE2n (No PII), ho\u1EA1t \u0111\u1ED9ng m\u01B0\u1EE3t m\xE0 ngo\u1EA1i tuy\u1EBFn (Offline Ready).</p>
            </div>
          </div>
        </footer>

      </div>
    `;
      function renderCard(m) {
        const isPinned = pinnedSlugs.includes(m.slug);
        const isStat = m.urgency === "stat";
        return `
        <article class="cdss-card ${isStat ? "is-stat-card" : ""}" id="cdss-card-${m.slug}" data-slug="${m.slug}">
          <!-- Top Row: Icon + Meta + Pin -->
          <div class="cdss-card-header">
            <div class="cdss-card-header-left">
              <div class="cdss-card-emblem cdss-emblem--${m.category}">
                <i class="${m.icon}"></i>
              </div>
              <div class="cdss-card-meta">
                <span class="cdss-card-dept">${m.department || m.categoryName}</span>
                ${isStat ? `<span class="cdss-card-stat"><i class="fa-solid fa-bolt-lightning"></i> STAT</span>` : ""}
              </div>
            </div>

            <button 
              type="button" 
              class="cdss-star-btn ${isPinned ? "pinned" : ""}" 
              data-pin-slug="${m.slug}"
              title="${isPinned ? "B\u1ECF ghim" : "Ghim y\xEAu th\xEDch"}"
              aria-label="${isPinned ? "B\u1ECF ghim" : "Ghim"}"
            >
              <i class="${isPinned ? "fa-solid" : "fa-regular"} fa-star"></i>
            </button>
          </div>

          <!-- Title & Guideline Reference -->
          <div class="cdss-card-body">
            <h3 class="cdss-card-title">
              <a href="${m.standaloneUrl}">${m.title}</a>
            </h3>
            <div class="cdss-card-guideline">
              <span>${m.badge || m.guidelineSource}</span>
            </div>

            ${m.statTrigger ? `
              <div class="cdss-trigger-row">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${m.statTrigger}</span>
              </div>
            ` : ""}

            <!-- Clinical Description -->
            <p class="cdss-card-desc">${m.shortDesc}</p>

            <!-- Key Features / Formulas (Clean unboxed text) -->
            ${m.features && m.features.length > 0 ? `
              <div class="cdss-card-features">
                ${m.features.slice(0, 3).join(" \xB7 ")}
              </div>
            ` : ""}
          </div>

          <!-- Bottom Row: Code/Version + Open Action Link -->
          <div class="cdss-card-footer">
            <span class="cdss-card-code">${m.brandCode} \xB7 v${m.version.split(" ")[0]}</span>
            <a href="${m.standaloneUrl}" class="cdss-card-launch">
              <span>M\u1EDF c\xF4ng c\u1EE5</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </article>
      `;
      }
      attachEvents();
    }
    function attachEvents() {
      const searchInput = document.getElementById("cdss-search-input");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          searchQuery = e.target.value;
          render();
          const updatedInput = document.getElementById("cdss-search-input");
          if (updatedInput) {
            updatedInput.focus();
            updatedInput.selectionStart = updatedInput.selectionEnd = updatedInput.value.length;
          }
        });
      }
      const clearBtn = document.getElementById("cdss-clear-search");
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          searchQuery = "";
          render();
        });
      }
      const catTabs = container.querySelectorAll(".cdss-cat-tab");
      catTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const cat = tab.getAttribute("data-cat") || "all";
          activeCategory = cat;
          render();
        });
      });
      const viewBtns = container.querySelectorAll(".cdss-view-btn");
      viewBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const mode = btn.getAttribute("data-mode");
          if (mode && mode !== viewMode) {
            viewMode = mode;
            setStoredViewMode(mode);
            render();
          }
        });
      });
      const quickLinks = container.querySelectorAll(".cdss-stat-quick-link");
      quickLinks.forEach((link) => {
        link.addEventListener("click", () => {
          const targetSlug = link.getAttribute("data-quick-slug");
          if (!targetSlug) return;
          if (activeCategory !== "all" || searchQuery) {
            activeCategory = "all";
            searchQuery = "";
            render();
          }
          setTimeout(() => {
            const targetEl = document.getElementById(`cdss-card-${targetSlug}`) || document.getElementById(`cdss-row-${targetSlug}`);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
              targetEl.classList.add("cdss-highlight-pulse");
              setTimeout(() => targetEl.classList.remove("cdss-highlight-pulse"), 1800);
            }
          }, 60);
        });
      });
      const pinBtns = container.querySelectorAll(".cdss-star-btn");
      pinBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          const slug = btn.getAttribute("data-pin-slug");
          if (!slug) return;
          if (pinnedSlugs.includes(slug)) {
            pinnedSlugs = pinnedSlugs.filter((s) => s !== slug);
          } else {
            pinnedSlugs = [...pinnedSlugs, slug];
          }
          setPinnedSlugs(pinnedSlugs);
          render();
        });
      });
      const unpinBtns = container.querySelectorAll(".cdss-pinned-remove");
      unpinBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const slug = btn.getAttribute("data-unpin-slug");
          if (slug) {
            pinnedSlugs = pinnedSlugs.filter((s) => s !== slug);
            setPinnedSlugs(pinnedSlugs);
            render();
          }
        });
      });
      const clearPinnedBtn = document.getElementById("cdss-clear-all-pinned");
      if (clearPinnedBtn) {
        clearPinnedBtn.addEventListener("click", () => {
          pinnedSlugs = [];
          setPinnedSlugs([]);
          render();
        });
      }
      const tagCloseBtns = container.querySelectorAll(".cdss-tag-close");
      tagCloseBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const resetTarget = btn.getAttribute("data-reset");
          if (resetTarget === "category") activeCategory = "all";
          if (resetTarget === "search") searchQuery = "";
          render();
        });
      });
      const resetFiltersBtn = document.getElementById("cdss-reset-filters-btn");
      if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", () => {
          activeCategory = "all";
          searchQuery = "";
          render();
        });
      }
      const emptyResetBtn = document.getElementById("cdss-empty-reset");
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener("click", () => {
          activeCategory = "all";
          searchQuery = "";
          render();
        });
      }
      const cards = container.querySelectorAll(".cdss-card");
      cards.forEach((card) => {
        card.addEventListener("click", (e) => {
          const target = e.target;
          if (target.closest(".cdss-star-btn") || target.closest("a")) return;
          const slug = card.getAttribute("data-slug");
          const meta = CDSS_MODULES.find((m) => m.slug === slug);
          if (meta && meta.standaloneUrl) {
            window.location.href = meta.standaloneUrl;
          }
        });
      });
    }
    document.addEventListener("keydown", (e) => {
      if ((e.key === "/" || (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        const input = document.getElementById("cdss-search-input");
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
    render();
  }
  if (typeof window !== "undefined") {
    window.initCDSSHub = initCDSSHub;
    window.CDSS_MODULES = CDSS_MODULES;
    window.getCDSSModuleById = getCDSSModuleById;
    window.getCDSSModuleBySlug = getCDSSModuleBySlug;
    const runInit = () => {
      if (document.getElementById("cdss-hub-app")) {
        initCDSSHub("cdss-hub-app");
      }
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", runInit);
    } else {
      runInit();
    }
  }
})();
