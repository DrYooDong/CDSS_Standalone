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
    { slug: "dengue", label: "Dengue S\u1ED1c", trigger: "Hct cao, c\xF4 \u0111\u1EB7c m\xE1u, s\u1ED1c t\u1EE5t HA", icon: "fa-solid fa-droplet", color: "#e11d48" },
    { slug: "sepsis", label: "Sepsis-3", trigger: "S\u1ED1t cao, t\u1EE5t HA, Lactate > 2, SOFA", icon: "fa-solid fa-biohazard", color: "#dc2626" },
    { slug: "ecg", label: "ECG STEMI", trigger: "\u0110au ng\u1EF1c, STEMI \u0111\u1ECBnh khu, QTc, Caliper", icon: "fa-solid fa-heart-pulse", color: "#f43f5e" },
    { slug: "abg", label: "Kh\xED M\xE1u ABG", trigger: "Toan ki\u1EC1m, PaO2/PaCO2, Anion Gap", icon: "fa-solid fa-lungs", color: "#0d9488" },
    { slug: "csf", label: "D\u1ECBch N\xE3o T\u1EE7y", trigger: "S\u1ED1t, \u0111au \u0111\u1EA7u, vi\xEAm m\xE0ng n\xE3o, SAH", icon: "fa-solid fa-brain", color: "#9333ea" }
  ];
  var PINNED_STORAGE_KEY = "cdss_pinned_module_slugs";
  var RECENT_STORAGE_KEY = "cdss_recent_module_slugs";
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
  function getRecentSlugs() {
    try {
      const raw = localStorage.getItem(RECENT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function recordRecentSlug(slug) {
    try {
      let recent = getRecentSlugs().filter((s) => s !== slug);
      recent.unshift(slug);
      recent = recent.slice(0, 5);
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recent));
    } catch (e) {
    }
  }
  function getStoredViewMode() {
    try {
      const mode = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      return mode === "grid" || mode === "tiles" || mode === "list" ? mode : "grid";
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
    let recentSlugs = getRecentSlugs();
    let infoModalSlug = null;
    let isCalculatorOpen = false;
    let isShortcutsOpen = false;
    let calcTab = "renal";
    let calcData = {
      age: 60,
      sex: "male",
      weight: 65,
      height: 165,
      scr: 90,
      // umol/L
      sbp: 120,
      dbp: 80,
      pao2: 85,
      fio2: 21
      // %
    };
    const categories = [
      { id: "all", label: "T\u1EA5t c\u1EA3 (10)", icon: "fa-solid fa-shapes" },
      { id: "stat", label: "C\u1EA5p c\u1EE9u STAT (5)", icon: "fa-solid fa-bolt-lightning", isStat: true },
      { id: "resus", label: "H\u1ED3i s\u1EE9c", icon: "fa-solid fa-truck-medical" },
      { id: "cardio-resp", label: "Tim - H\xF4 h\u1EA5p", icon: "fa-solid fa-heart-pulse" },
      { id: "pharma", label: "Kh\xE1ng sinh & D\u01B0\u1EE3c", icon: "fa-solid fa-pills" },
      { id: "internal", label: "N\u1ED9i khoa & Th\u1EA7n kinh", icon: "fa-solid fa-hospital-user" }
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
        const matchSearch = !q || m.title.toLowerCase().includes(q) || m.titleEn && m.titleEn.toLowerCase().includes(q) || m.shortTitle && m.shortTitle.toLowerCase().includes(q) || m.brandCode && m.brandCode.toLowerCase().includes(q) || m.department && m.department.toLowerCase().includes(q) || m.statTrigger && m.statTrigger.toLowerCase().includes(q) || m.shortDesc.toLowerCase().includes(q) || m.guidelineSource.toLowerCase().includes(q);
        return matchCat && matchSearch;
      });
    }
    function calculateCrCl() {
      const age = Number(calcData.age) || 60;
      const wt = Number(calcData.weight) || 60;
      const scrMgDl = (Number(calcData.scr) || 90) / 88.4;
      if (scrMgDl <= 0) return 0;
      let crcl = (140 - age) * wt / (72 * scrMgDl);
      if (calcData.sex === "female") crcl *= 0.85;
      return Math.round(crcl * 10) / 10;
    }
    function calculateCKDEPI() {
      const age = Number(calcData.age) || 60;
      const scrMgDl = (Number(calcData.scr) || 90) / 88.4;
      if (scrMgDl <= 0) return 0;
      const isFemale = calcData.sex === "female";
      const kappa = isFemale ? 0.7 : 0.9;
      const alpha = isFemale ? -0.241 : -0.302;
      const minVal = Math.min(scrMgDl / kappa, 1);
      const maxVal = Math.max(scrMgDl / kappa, 1);
      let egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.2) * Math.pow(0.9938, age);
      if (isFemale) egfr *= 1.012;
      return Math.round(egfr * 10) / 10;
    }
    function calculateBMI() {
      const wt = Number(calcData.weight) || 60;
      const htCm = Number(calcData.height) || 165;
      const htM = htCm / 100;
      const bmi = htM > 0 ? Math.round(wt / (htM * htM) * 10) / 10 : 0;
      const htInches = htCm / 2.54;
      const inchesOver5Ft = Math.max(0, htInches - 60);
      const baseIbw = calcData.sex === "female" ? 45.5 : 50;
      const ibw = Math.round((baseIbw + 2.3 * inchesOver5Ft) * 10) / 10;
      let adjbw = wt;
      if (wt > 1.2 * ibw) {
        adjbw = Math.round((ibw + 0.4 * (wt - ibw)) * 10) / 10;
      }
      let cat = "B\xECnh th\u01B0\u1EDDng";
      if (bmi < 18.5) cat = "Thi\u1EBFu c\xE2n";
      else if (bmi < 23) cat = "B\xECnh th\u01B0\u1EDDng (Ch\xE2u \xC1)";
      else if (bmi < 25) cat = "Th\u1EEBa c\xE2n (Ch\xE2u \xC1)";
      else if (bmi < 30) cat = "B\xE9o ph\xEC \u0111\u1ED9 I";
      else cat = "B\xE9o ph\xEC \u0111\u1ED9 II+";
      return { bmi, ibw, adjbw, cat };
    }
    function calculateMAP() {
      const sbp = Number(calcData.sbp) || 120;
      const dbp = Number(calcData.dbp) || 80;
      const map = Math.round((sbp + 2 * dbp) / 3 * 10) / 10;
      return { map, isHypotension: map < 65 };
    }
    function calculatePF() {
      const pao2 = Number(calcData.pao2) || 85;
      const fio2Percent = Number(calcData.fio2) || 21;
      const fio2 = fio2Percent / 100;
      const pf = fio2 > 0 ? Math.round(pao2 / fio2) : 0;
      let ards = "B\xECnh th\u01B0\u1EDDng";
      let color = "#059669";
      if (pf < 100) {
        ards = "ARDS N\u1EB7ng (Berlin: P/F < 100)";
        color = "#dc2626";
      } else if (pf <= 200) {
        ards = "ARDS Trung b\xECnh (Berlin: 100-200)";
        color = "#ea580c";
      } else if (pf <= 300) {
        ards = "ARDS Nh\u1EB9 (Berlin: 200-300)";
        color = "#d97706";
      }
      return { pf, ards, color };
    }
    function render() {
      const filtered = filterModules(CDSS_MODULES);
      const pinnedModules = CDSS_MODULES.filter((m) => pinnedSlugs.includes(m.slug));
      const recentModules = recentSlugs.map((s) => CDSS_MODULES.find((m) => m.slug === s)).filter(Boolean);
      const modalModule = infoModalSlug ? CDSS_MODULES.find((m) => m.slug === infoModalSlug) : null;
      container.innerHTML = `
      <div class="cdss-hub-workspace">

        <!-- ================================================================
             1. STAT RAPID EMERGENCY STRIP (1-Tap Immediate Jump)
             ================================================================ -->
        <div class="cdss-stat-rapid-strip" id="cdss-rapid-bar">
          <div class="cdss-stat-strip-lead">
            <i class="fa-solid fa-bolt-lightning text-rose-500"></i>
            <span>C\u1EA5p C\u1EE9u STAT:</span>
          </div>
          <div class="cdss-stat-buttons-track">
            ${STAT_TRIAGE_ITEMS.map((item) => `
              <a 
                href="${item.slug}/index.html" 
                class="cdss-stat-pill-btn" 
                data-slug="${item.slug}"
                title="${item.label}: ${item.trigger}"
              >
                <i class="${item.icon}" style="color: ${item.color};"></i>
                <span class="cdss-stat-btn-title">${item.label}</span>
                <i class="fa-solid fa-arrow-right cdss-stat-arrow"></i>
              </a>
            `).join("")}
          </div>
        </div>

        <!-- ================================================================
             2. SEARCH, CATEGORIES & VIEW SWITCHER
             ================================================================ -->
        <section class="cdss-control-deck">
          <!-- Search & View Mode Switcher Row -->
          <div class="cdss-search-row">
            <div class="cdss-search-wrap">
              <i class="fa-solid fa-magnifying-glass cdss-search-icon"></i>
              <input 
                id="cdss-search-input" 
                type="text" 
                class="cdss-search-input"
                placeholder="Tra c\u1EE9u nhanh CDSS, thu\u1ED1c, b\u1EC7nh l\xFD, x\xE9t nghi\u1EC7m (Nh\u1EA5n / \u0111\u1EC3 t\xECm)..." 
                value="${searchQuery}"
                autocomplete="off"
                spellcheck="false"
              />
              ${searchQuery ? `
                <button id="cdss-clear-search" class="cdss-search-clear" title="X\xF3a t\xECm ki\u1EBFm" aria-label="X\xF3a">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              ` : `
                <span class="cdss-search-kbd">/</span>
              `}
            </div>

            <!-- View Mode Switcher (Icon Buttons Only) -->
            <div class="cdss-view-switch-group">
              <button 
                type="button" 
                class="cdss-view-icon-btn ${viewMode === "grid" ? "active" : ""}" 
                data-mode="grid"
                title="D\u1EA1ng Th\u1EBB G\u1ECDn (Grid)"
                aria-label="Th\u1EBB g\u1ECDn"
              >
                <i class="fa-solid fa-table-cells-large"></i>
              </button>
              <button 
                type="button" 
                class="cdss-view-icon-btn ${viewMode === "tiles" ? "active" : ""}" 
                data-mode="tiles"
                title="D\u1EA1ng Ma Tr\u1EADn Bi\u1EC3u T\u01B0\u1EE3ng (Tiles)"
                aria-label="Ma tr\u1EADn bi\u1EC3u t\u01B0\u1EE3ng"
              >
                <i class="fa-solid fa-grip"></i>
              </button>
              <button 
                type="button" 
                class="cdss-view-icon-btn ${viewMode === "list" ? "active" : ""}" 
                data-mode="list"
                title="D\u1EA1ng Danh S\xE1ch Tr\u1EF1c \u0110i Bu\u1ED3ng (List)"
                aria-label="Danh s\xE1ch tr\u1EF1c"
              >
                <i class="fa-solid fa-list-ul"></i>
              </button>
            </div>
          </div>

          <!-- Category Filter Buttons -->
          <div class="cdss-categories-bar">
            ${categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return `
                <button 
                  type="button" 
                  class="cdss-cat-btn ${isActive ? "active" : ""} ${cat.isStat ? "stat-cat" : ""}" 
                  data-cat="${cat.id}"
                >
                  <i class="${cat.icon}"></i>
                  <span>${cat.label}</span>
                </button>
              `;
      }).join("")}
          </div>
        </section>

        <!-- ================================================================
             3. PINNED & RECENT QUICK ACCESS CHIPS
             ================================================================ -->
        ${pinnedModules.length > 0 || recentModules.length > 0 ? `
          <div class="cdss-access-row">
            ${pinnedModules.length > 0 ? `
              <div class="cdss-chips-group">
                <span class="cdss-chips-label"><i class="fa-solid fa-star text-amber-500"></i> \u0110\xE3 ghim:</span>
                <div class="cdss-chips-list">
                  ${pinnedModules.map((m) => `
                    <div class="cdss-chip">
                      <a href="${m.standaloneUrl}" class="cdss-chip-link" data-slug="${m.slug}">
                        <i class="${m.icon}"></i>
                        <span>${m.shortTitle || m.title}</span>
                      </a>
                      <button type="button" class="cdss-chip-unpin" data-unpin-slug="${m.slug}" title="B\u1ECF ghim">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            ${recentModules.length > 0 ? `
              <div class="cdss-chips-group">
                <span class="cdss-chips-label"><i class="fa-solid fa-clock-rotate-left text-slate-400"></i> M\u1EDBi m\u1EDF:</span>
                <div class="cdss-chips-list">
                  ${recentModules.map((m) => `
                    <a href="${m.standaloneUrl}" class="cdss-recent-chip" data-slug="${m.slug}" title="${m.title}">
                      <i class="${m.icon}"></i>
                      <span>${m.shortTitle || m.title}</span>
                    </a>
                  `).join("")}
                </div>
              </div>
            ` : ""}
          </div>
        ` : ""}

        <!-- Active Results / Status Strip -->
        <div class="cdss-results-bar">
          <div class="cdss-results-text">
            <span>Hi\u1EC3n th\u1ECB <strong>${filtered.length}</strong> / ${CDSS_MODULES.length} c\xF4ng c\u1EE5</span>
            ${activeCategory !== "all" ? `
              <span class="cdss-active-tag">
                ${categories.find((c) => c.id === activeCategory)?.label}
                <button type="button" data-reset="category" title="B\u1ECF l\u1ECDc">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </span>
            ` : ""}
            ${searchQuery ? `
              <span class="cdss-active-tag">
                "${searchQuery}"
                <button type="button" data-reset="search" title="X\xF3a t\xECm ki\u1EBFm">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </span>
            ` : ""}
          </div>

          ${activeCategory !== "all" || searchQuery ? `
            <button type="button" id="cdss-reset-filters-btn" class="cdss-reset-btn">
              <i class="fa-solid fa-rotate-left"></i> \u0110\u1EB7t l\u1EA1i
            </button>
          ` : ""}
        </div>

        <!-- Empty State -->
        ${filtered.length === 0 ? `
          <div class="cdss-empty-box">
            <i class="fa-solid fa-magnifying-glass cdss-empty-icon"></i>
            <h3 class="cdss-empty-title">Kh\xF4ng t\xECm th\u1EA5y c\xF4ng c\u1EE5 ph\xF9 h\u1EE3p</h3>
            <p class="cdss-empty-desc">
              Kh\xF4ng c\xF3 c\xF4ng c\u1EE5 n\xE0o kh\u1EDBp v\u1EDBi t\u1EEB kh\xF3a "<strong>${searchQuery}</strong>". Th\u1EED t\xECm ki\u1EBFm v\u1EDBi t\u1EEB kh\xF3a kh\xE1c nh\u01B0 <em>Dengue, Sepsis, ABG, ECG, Vancomycin, Insulin, DNT</em>.
            </p>
            <button type="button" id="cdss-empty-reset" class="cdss-empty-btn">
              <i class="fa-solid fa-arrows-rotate"></i> Xem t\u1EA5t c\u1EA3 10 c\xF4ng c\u1EE5 CDSS
            </button>
          </div>
        ` : ""}

        <!-- ================================================================
             4. VIEW MODES: CLEAN CARDS (NO LENGTHY TEXT), TILES MATRIX, COMPACT LIST
             ================================================================ -->

        <!-- VIEW MODE 1: CLEAN CARDS GRID (DEFAULT) -->
        ${viewMode === "grid" && filtered.length > 0 ? `
          <div class="cdss-grid-clean">
            ${filtered.map((m) => renderCleanCard(m)).join("")}
          </div>
        ` : ""}

        <!-- VIEW MODE 2: HIGH-DENSITY ICON TILES MATRIX -->
        ${viewMode === "tiles" && filtered.length > 0 ? `
          <div class="cdss-tiles-matrix">
            ${filtered.map((m) => renderCompactTile(m)).join("")}
          </div>
        ` : ""}

        <!-- VIEW MODE 3: BEDSIDE COMPACT LIST -->
        ${viewMode === "list" && filtered.length > 0 ? `
          <div class="cdss-compact-list">
            ${filtered.map((m) => renderCompactRow(m)).join("")}
          </div>
        ` : ""}

        <!-- Minimal Footnote -->
        <footer class="cdss-minimal-footnote">
          <div>
            <span>CDSS Platform Suite</span>
            <span aria-hidden="true">\xB7</span>
            <span>B\u1ED9 Y T\u1EBF Vi\u1EC7t Nam &amp; EBM Qu\u1ED1c T\u1EBF</span>
            <span aria-hidden="true">\xB7</span>
            <span>100% Client-side Offline</span>
          </div>
        </footer>

      </div>

      <!-- ================================================================
           5. MODAL 1: BEDSIDE RAPID CALCULATOR (Alt+C)
           ================================================================ -->
      ${isCalculatorOpen ? `
        <div class="cdss-modal-overlay" id="cdss-calc-overlay">
          <div class="cdss-modal-container" role="dialog" aria-modal="true" aria-labelledby="calc-title">
            <div class="cdss-modal-header">
              <div class="cdss-modal-title-wrap">
                <div class="cdss-modal-icon-badge">
                  <i class="fa-solid fa-calculator"></i>
                </div>
                <div>
                  <h3 id="calc-title" class="cdss-modal-title">M\xE1y T\xEDnh L\xE2m S\xE0ng C\u1EA5p T\u1ED1c T\u1EA1i Gi\u01B0\u1EDDng</h3>
                  <p class="cdss-modal-subtitle">Thanh th\u1EA3i th\u1EADn, Th\u1EC3 tr\u1EA1ng dinh d\u01B0\u1EE1ng, Huy\u1EBFt \u0111\u1ED9ng MAP v\xE0 Trao \u0111\u1ED5i kh\xED P/F</p>
                </div>
              </div>
              <button type="button" id="cdss-close-calc" class="cdss-modal-close-btn" title="\u0110\xF3ng (Esc)">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Calculator Segmented Tabs -->
            <div class="cdss-calc-tabs">
              <button type="button" class="cdss-calc-tab ${calcTab === "renal" ? "active" : ""}" data-calc-tab="renal">
                <i class="fa-solid fa-droplet"></i>
                <span>Thanh Th\u1EA3i Th\u1EADn (CrCl / eGFR)</span>
              </button>
              <button type="button" class="cdss-calc-tab ${calcTab === "body" ? "active" : ""}" data-calc-tab="body">
                <i class="fa-solid fa-weight-scale"></i>
                <span>Th\u1EC3 Tr\u1EA1ng (BMI / IBW / AdjBW)</span>
              </button>
              <button type="button" class="cdss-calc-tab ${calcTab === "map" ? "active" : ""}" data-calc-tab="map">
                <i class="fa-solid fa-heart-pulse"></i>
                <span>Huy\u1EBFt \u0110\u1ED9ng (Huy\u1EBFt \xC1p MAP)</span>
              </button>
              <button type="button" class="cdss-calc-tab ${calcTab === "pf" ? "active" : ""}" data-calc-tab="pf">
                <i class="fa-solid fa-lungs"></i>
                <span>Trao \u0110\u1ED5i Kh\xED (T\u1EF7 s\u1ED1 P/F)</span>
              </button>
            </div>

            <div class="cdss-modal-body" id="cdss-calc-modal-body">
              ${renderCalculatorContent()}
            </div>
          </div>
        </div>
      ` : ""}

      <!-- ================================================================
           6. MODAL 2: CLINICAL GUIDELINE & PROTOCOL QUICK SHEET
           ================================================================ -->
      ${modalModule ? `
        <div class="cdss-modal-overlay" id="cdss-info-overlay">
          <div class="cdss-modal-container" role="dialog" aria-modal="true" aria-labelledby="info-title">
            <div class="cdss-modal-header">
              <div class="cdss-modal-title-wrap">
                <div class="cdss-modal-icon-badge cdss-icon--${modalModule.category}">
                  <i class="${modalModule.icon}"></i>
                </div>
                <div>
                  <h3 id="info-title" class="cdss-modal-title">${modalModule.title}</h3>
                  <div class="cdss-modal-sub-meta">
                    <span>${modalModule.department || modalModule.categoryName}</span>
                    <span aria-hidden="true">\xB7</span>
                    <span>${modalModule.brandCode}</span>
                    ${modalModule.urgency === "stat" ? '<span class="cdss-stat-tag">\u{1F6A8} C\u1EA5p c\u1EE9u STAT</span>' : ""}
                  </div>
                </div>
              </div>
              <button type="button" id="cdss-close-info" class="cdss-modal-close-btn" title="\u0110\xF3ng (Esc)">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="cdss-modal-body">
              <div class="cdss-info-section">
                <h4 class="cdss-info-head"><i class="fa-solid fa-file-medical"></i> Ch\u1EC9 \u0111\u1ECBnh &amp; T\xECnh hu\u1ED1ng l\xE2m s\xE0ng</h4>
                <p class="cdss-info-text">${modalModule.shortDesc}</p>
                ${modalModule.statTrigger ? `
                  <div class="cdss-info-alert">
                    <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
                    <span><strong>T\xECnh hu\u1ED1ng k\xEDch ho\u1EA1t:</strong> ${modalModule.statTrigger}</span>
                  </div>
                ` : ""}
              </div>

              <div class="cdss-info-section">
                <h4 class="cdss-info-head"><i class="fa-solid fa-book-medical"></i> C\u0103n c\u1EE9 h\u01B0\u1EDBng d\u1EABn y khoa (EBM)</h4>
                <p class="cdss-info-guide-text">${modalModule.guidelineSource}</p>
              </div>

              ${modalModule.features && modalModule.features.length > 0 ? `
                <div class="cdss-info-section">
                  <h4 class="cdss-info-head"><i class="fa-solid fa-square-check"></i> T\xEDnh n\u0103ng &amp; Ph\xE1c \u0111\u1ED3 t\xEDch h\u1EE3p</h4>
                  <div class="cdss-info-features-grid">
                    ${modalModule.features.map((f) => `
                      <div class="cdss-info-feat-item">
                        <i class="fa-solid fa-check text-teal-600"></i>
                        <span>${f}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
              ` : ""}

              <div class="cdss-info-actions">
                <a href="${modalModule.standaloneUrl}" class="cdss-info-launch-btn" data-slug="${modalModule.slug}">
                  <span>M\u1EDF Tr\u1EF1c Ti\u1EBFp C\xF4ng C\u1EE5 N\xE0y</span>
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ` : ""}

      <!-- ================================================================
           7. MODAL 3: KEYBOARD SHORTCUTS
           ================================================================ -->
      ${isShortcutsOpen ? `
        <div class="cdss-modal-overlay" id="cdss-shortcuts-overlay">
          <div class="cdss-modal-container cdss-modal-sm" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
            <div class="cdss-modal-header">
              <div class="cdss-modal-title-wrap">
                <div class="cdss-modal-icon-badge">
                  <i class="fa-solid fa-keyboard"></i>
                </div>
                <div>
                  <h3 id="shortcuts-title" class="cdss-modal-title">Ph\xEDm T\u1EAFt Thao T\xE1c Nhanh</h3>
                  <p class="cdss-modal-subtitle">T\u1ED1i \u01B0u t\u1ED1c \u0111\u1ED9 kh\xE1m &amp; tra c\u1EE9u t\u1EA1i gi\u01B0\u1EDDng b\u1EC7nh</p>
                </div>
              </div>
              <button type="button" id="cdss-close-shortcuts" class="cdss-modal-close-btn" title="\u0110\xF3ng (Esc)">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="cdss-modal-body">
              <div class="cdss-shortcuts-list">
                <div class="cdss-shortcut-item">
                  <kbd>/</kbd>
                  <span>T\xECm ki\u1EBFm nhanh c\xF4ng c\u1EE5 / ch\u1EC9 \u0111\u1ECBnh l\xE2m s\xE0ng</span>
                </div>
                <div class="cdss-shortcut-item">
                  <kbd>Alt</kbd> + <kbd>C</kbd>
                  <span>M\u1EDF M\xE1y t\xEDnh l\xE2m s\xE0ng c\u1EA5p t\u1ED1c (CrCl, eGFR, BMI, MAP, P/F)</span>
                </div>
                <div class="cdss-shortcut-item">
                  <kbd>Alt</kbd> + <kbd>S</kbd>
                  <span>B\u1EADt / T\u1EAFt l\u1ECDc c\xE1c c\xF4ng c\u1EE5 C\u1EA5p C\u1EE9u STAT</span>
                </div>
                <div class="cdss-shortcut-item">
                  <kbd>?</kbd>
                  <span>M\u1EDF b\u1EA3ng h\u01B0\u1EDBng d\u1EABn ph\xEDm t\u1EAFt n\xE0y</span>
                </div>
                <div class="cdss-shortcut-item">
                  <kbd>Esc</kbd>
                  <span>\u0110\xF3ng t\u1EA5t c\u1EA3 c\u1EEDa s\u1ED5 b\u1EADt l\xEAn / X\xF3a t\xECm ki\u1EBFm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : ""}
    `;
      attachEvents();
    }
    function renderCleanCard(m) {
      const isPinned = pinnedSlugs.includes(m.slug);
      const isStat = m.urgency === "stat";
      return `
      <article class="cdss-card-clean ${isStat ? "is-stat-card" : ""}" data-slug="${m.slug}">
        <div class="cdss-card-clean-top">
          <!-- Icon Container -->
          <div class="cdss-icon-box cdss-icon--${m.category}">
            <i class="${m.icon}"></i>
          </div>

          <!-- Title & Department -->
          <div class="cdss-card-title-col">
            <div class="cdss-card-dept-row">
              <span class="cdss-card-dept-label">${m.department || m.categoryName}</span>
              ${isStat ? `<span class="cdss-stat-micro-badge"><i class="fa-solid fa-bolt-lightning"></i> STAT</span>` : ""}
            </div>
            <h3 class="cdss-card-clean-title">
              <a href="${m.standaloneUrl}" class="cdss-card-link-title" data-slug="${m.slug}">
                ${m.shortTitle || m.title}
              </a>
            </h3>
          </div>
        </div>

        <!-- Bottom Action Buttons Strip (Icon-optimized for rapid clinician interaction) -->
        <div class="cdss-card-action-strip">
          <div class="cdss-action-left-icons">
            <!-- Pin Favorite Button -->
            <button 
              type="button" 
              class="cdss-tool-icon-btn ${isPinned ? "is-pinned" : ""}" 
              data-pin-slug="${m.slug}" 
              title="${isPinned ? "B\u1ECF ghim kh\u1ECFi \u0111\u1EA7u trang" : "Ghim c\xF4ng c\u1EE5 y\xEAu th\xEDch"}"
              aria-label="${isPinned ? "B\u1ECF ghim" : "Ghim"}"
            >
              <i class="${isPinned ? "fa-solid" : "fa-regular"} fa-star"></i>
            </button>

            <!-- Quick Info / Guideline Modal Button -->
            <button 
              type="button" 
              class="cdss-tool-icon-btn cdss-info-trigger-btn" 
              data-info-slug="${m.slug}" 
              title="Xem nhanh ch\u1EC9 \u0111\u1ECBnh, h\u01B0\u1EDBng d\u1EABn EBM &amp; ph\xE1c \u0111\u1ED3"
              aria-label="Th\xF4ng tin l\xE2m s\xE0ng"
            >
              <i class="fa-solid fa-circle-info"></i>
            </button>
          </div>

          <!-- Primary Launch Button -->
          <a 
            href="${m.standaloneUrl}" 
            class="cdss-launch-btn-clean" 
            data-slug="${m.slug}"
            title="M\u1EDF c\xF4ng c\u1EE5 ${m.shortTitle || m.title}"
          >
            <span>M\u1EDF</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </article>
    `;
    }
    function renderCompactTile(m) {
      const isPinned = pinnedSlugs.includes(m.slug);
      const isStat = m.urgency === "stat";
      return `
      <div class="cdss-tile-item ${isStat ? "is-stat-tile" : ""}" data-slug="${m.slug}">
        <div class="cdss-tile-header">
          <div class="cdss-icon-box-sm cdss-icon--${m.category}">
            <i class="${m.icon}"></i>
          </div>
          <div class="cdss-tile-badges">
            ${isStat ? `<span class="cdss-stat-dot" title="STAT C\u1EA5p C\u1EE9u"></span>` : ""}
            <button 
              type="button" 
              class="cdss-tile-pin ${isPinned ? "is-pinned" : ""}" 
              data-pin-slug="${m.slug}"
              title="${isPinned ? "B\u1ECF ghim" : "Ghim"}"
            >
              <i class="${isPinned ? "fa-solid" : "fa-regular"} fa-star"></i>
            </button>
          </div>
        </div>

        <a href="${m.standaloneUrl}" class="cdss-tile-link" data-slug="${m.slug}">
          <h4 class="cdss-tile-title">${m.shortTitle || m.title}</h4>
          <span class="cdss-tile-sub">${m.department || m.categoryName}</span>
        </a>

        <div class="cdss-tile-footer">
          <button type="button" class="cdss-tile-info-btn" data-info-slug="${m.slug}" title="Th\xF4ng tin h\u01B0\u1EDBng d\u1EABn">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <a href="${m.standaloneUrl}" class="cdss-tile-go" data-slug="${m.slug}" title="M\u1EDF">
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
    }
    function renderCompactRow(m) {
      const isPinned = pinnedSlugs.includes(m.slug);
      const isStat = m.urgency === "stat";
      return `
      <div class="cdss-row-item ${isStat ? "is-stat-row" : ""}" data-slug="${m.slug}">
        <div class="cdss-row-left">
          <button 
            type="button" 
            class="cdss-tool-icon-btn ${isPinned ? "is-pinned" : ""}" 
            data-pin-slug="${m.slug}" 
            title="${isPinned ? "B\u1ECF ghim" : "Ghim"}"
          >
            <i class="${isPinned ? "fa-solid" : "fa-regular"} fa-star"></i>
          </button>

          <div class="cdss-icon-box-xs cdss-icon--${m.category}">
            <i class="${m.icon}"></i>
          </div>

          <div class="cdss-row-title-wrap">
            <a href="${m.standaloneUrl}" class="cdss-row-link" data-slug="${m.slug}">
              ${m.shortTitle || m.title}
            </a>
            <span class="cdss-row-dept">${m.department || m.categoryName}</span>
          </div>
        </div>

        <div class="cdss-row-right">
          ${isStat ? `<span class="cdss-stat-micro-badge"><i class="fa-solid fa-bolt-lightning"></i> STAT</span>` : ""}

          <button 
            type="button" 
            class="cdss-tool-icon-btn cdss-info-trigger-btn" 
            data-info-slug="${m.slug}" 
            title="Xem th\xF4ng tin"
          >
            <i class="fa-solid fa-circle-info"></i>
          </button>

          <a href="${m.standaloneUrl}" class="cdss-row-launch-btn" data-slug="${m.slug}">
            <span>M\u1EDF</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
    }
    function renderCalculatorContent() {
      if (calcTab === "renal") {
        const crcl = calculateCrCl();
        const egfr = calculateCKDEPI();
        return `
        <div class="cdss-calc-grid">
          <div class="cdss-calc-inputs">
            <div class="cdss-calc-form-group">
              <label>Tu\u1ED5i (n\u0103m):</label>
              <input type="number" id="calc-age" class="cdss-calc-input" value="${calcData.age}" min="1" max="120" />
            </div>
            <div class="cdss-calc-form-group">
              <label>Gi\u1EDBi t\xEDnh:</label>
              <div class="cdss-calc-radio-group">
                <label><input type="radio" name="calc-sex" value="male" ${calcData.sex === "male" ? "checked" : ""} /> Nam</label>
                <label><input type="radio" name="calc-sex" value="female" ${calcData.sex === "female" ? "checked" : ""} /> N\u1EEF</label>
              </div>
            </div>
            <div class="cdss-calc-form-group">
              <label>C\xE2n n\u1EB7ng (kg):</label>
              <input type="number" id="calc-weight" class="cdss-calc-input" value="${calcData.weight}" min="10" max="300" />
            </div>
            <div class="cdss-calc-form-group">
              <label>Serum Creatinine (\xB5mol/L):</label>
              <input type="number" id="calc-scr" class="cdss-calc-input" value="${calcData.scr}" min="10" max="2000" />
            </div>
          </div>

          <div class="cdss-calc-results-card" id="calc-results-panel">
            <h5 class="cdss-calc-res-title">K\u1EBFt Qu\u1EA3 Ch\u1EE9c N\u0103ng Th\u1EADn</h5>
            <div class="cdss-calc-metrics">
              <div class="cdss-metric-box">
                <span class="cdss-metric-label">Cockcroft-Gault (CrCl)</span>
                <span class="cdss-metric-val ${crcl < 30 ? "text-red-500" : crcl < 60 ? "text-amber-500" : "text-teal-600"}">
                  ${crcl} <small>mL/ph\xFAt</small>
                </span>
                <span class="cdss-metric-sub">D\xF9ng hi\u1EC7u ch\u1EC9nh li\u1EC1u kh\xE1ng sinh &amp; Vancomycin</span>
              </div>

              <div class="cdss-metric-box">
                <span class="cdss-metric-label">CKD-EPI 2021 (eGFR)</span>
                <span class="cdss-metric-val ${egfr < 30 ? "text-red-500" : egfr < 60 ? "text-amber-500" : "text-teal-600"}">
                  ${egfr} <small>mL/ph\xFAt/1.73m\xB2</small>
                </span>
                <span class="cdss-metric-sub">Ph\xE2n giai \u0111o\u1EA1n b\u1EC7nh th\u1EADn m\u1EA1n (KDIGO)</span>
              </div>
            </div>

            <div class="cdss-calc-nav-hint">
              <i class="fa-solid fa-arrow-right text-teal-600"></i>
              <a href="antibiotic/index.html" class="cdss-calc-link">Chuy\u1EC3n sang ph\xE2n h\u1EC7 InfectoDose 43 Kh\xE1ng Sinh &gt;</a>
            </div>
          </div>
        </div>
      `;
      }
      if (calcTab === "body") {
        const { bmi, ibw, adjbw, cat } = calculateBMI();
        return `
        <div class="cdss-calc-grid">
          <div class="cdss-calc-inputs">
            <div class="cdss-calc-form-group">
              <label>Chi\u1EC1u cao (cm):</label>
              <input type="number" id="calc-height" class="cdss-calc-input" value="${calcData.height}" min="50" max="250" />
            </div>
            <div class="cdss-calc-form-group">
              <label>C\xE2n n\u1EB7ng th\u1EF1c t\u1EBF (kg):</label>
              <input type="number" id="calc-weight-body" class="cdss-calc-input" value="${calcData.weight}" min="10" max="300" />
            </div>
            <div class="cdss-calc-form-group">
              <label>Gi\u1EDBi t\xEDnh:</label>
              <div class="cdss-calc-radio-group">
                <label><input type="radio" name="calc-sex-body" value="male" ${calcData.sex === "male" ? "checked" : ""} /> Nam</label>
                <label><input type="radio" name="calc-sex-body" value="female" ${calcData.sex === "female" ? "checked" : ""} /> N\u1EEF</label>
              </div>
            </div>
          </div>

          <div class="cdss-calc-results-card" id="calc-results-panel">
            <h5 class="cdss-calc-res-title">Ch\u1EC9 S\u1ED1 Nh\xE2n Tr\u1EAFc &amp; Li\u1EC1u D\xF9ng</h5>
            <div class="cdss-calc-metrics">
              <div class="cdss-metric-box">
                <span class="cdss-metric-label">BMI Th\u1EC3 Tr\u1EA1ng: <strong>${cat}</strong></span>
                <span class="cdss-metric-val ${bmi >= 30 ? "text-red-500" : bmi >= 25 ? "text-amber-500" : "text-teal-600"}">
                  ${bmi} <small>kg/m\xB2</small>
                </span>
              </div>

              <div class="cdss-metric-box">
                <span class="cdss-metric-label">C\xE2n N\u1EB7ng L\xFD T\u01B0\u1EDFng (IBW Devine)</span>
                <span class="cdss-metric-val">${ibw} <small>kg</small></span>
              </div>

              <div class="cdss-metric-box">
                <span class="cdss-metric-label">C\xE2n N\u1EB7ng Hi\u1EC7u Ch\u1EC9nh (AdjBW 40%)</span>
                <span class="cdss-metric-val">${adjbw} <small>kg</small></span>
                <span class="cdss-metric-sub">S\u1EED d\u1EE5ng khi b\u1EC7nh nh\xE2n b\xE9o ph\xEC (TBW &gt; 120% IBW)</span>
              </div>
            </div>
          </div>
        </div>
      `;
      }
      if (calcTab === "map") {
        const { map, isHypotension } = calculateMAP();
        return `
        <div class="cdss-calc-grid">
          <div class="cdss-calc-inputs">
            <div class="cdss-calc-form-group">
              <label>Huy\u1EBFt \xE1p t\xE2m thu (SBP mmHg):</label>
              <input type="number" id="calc-sbp" class="cdss-calc-input" value="${calcData.sbp}" min="40" max="300" />
            </div>
            <div class="cdss-calc-form-group">
              <label>Huy\u1EBFt \xE1p t\xE2m tr\u01B0\u01A1ng (DBP mmHg):</label>
              <input type="number" id="calc-dbp" class="cdss-calc-input" value="${calcData.dbp}" min="20" max="200" />
            </div>
          </div>

          <div class="cdss-calc-results-card" id="calc-results-panel">
            <h5 class="cdss-calc-res-title">Huy\u1EBFt \xC1p \u0110\u1ED9ng M\u1EA1ch Trung B\xECnh (MAP)</h5>
            <div class="cdss-calc-metrics">
              <div class="cdss-metric-box">
                <span class="cdss-metric-label">C\xF4ng th\u1EE9c: MAP = [SBP + (2 \xD7 DBP)] / 3</span>
                <span class="cdss-metric-val ${isHypotension ? "text-red-500" : "text-teal-600"}">
                  ${map} <small>mmHg</small>
                </span>
                ${isHypotension ? `
                  <div class="cdss-alert-strip-red">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span><strong>C\u1EA2NH B\xC1O T\u1EE4T HUY\u1EBET \xC1P (MAP &lt; 65 mmHg):</strong> Nguy c\u01A1 gi\u1EA3m t\u01B0\u1EDBi m\xE1u t\u1EA1ng, k\xEDch ho\u1EA1t h\u1ED3i s\u1EE9c d\u1ECBch Sepsis / V\u1EADn m\u1EA1ch!</span>
                  </div>
                ` : `
                  <span class="cdss-metric-sub text-emerald-600">\u2713 \u0110\u1EA1t \u0111\xEDch t\u01B0\u1EDBi m\xE1u m\xF4 t\u1ED1i thi\u1EC3u (MAP \u2265 65 mmHg)</span>
                `}
              </div>
            </div>

            <div class="cdss-calc-nav-hint">
              <i class="fa-solid fa-arrow-right text-teal-600"></i>
              <a href="sepsis/index.html" class="cdss-calc-link">Chuy\u1EC3n sang CDSS Sepsis &amp; S\u1ED1c Nhi\u1EC5m Khu\u1EA9n &gt;</a>
            </div>
          </div>
        </div>
      `;
      }
      const { pf, ards, color } = calculatePF();
      return `
      <div class="cdss-calc-grid">
        <div class="cdss-calc-inputs">
          <div class="cdss-calc-form-group">
            <label>PaO2 (mmHg - t\u1EEB kh\xED m\xE1u \u0111\u1ED9ng m\u1EA1ch):</label>
            <input type="number" id="calc-pao2" class="cdss-calc-input" value="${calcData.pao2}" min="20" max="600" />
          </div>
          <div class="cdss-calc-form-group">
            <label>FiO2 (% - n\u1ED3ng \u0111\u1ED9 oxy h\xEDt v\xE0o):</label>
            <input type="number" id="calc-fio2" class="cdss-calc-input" value="${calcData.fio2}" min="21" max="100" />
            <span class="cdss-input-subtext">Kh\xED ph\xF2ng: 21%, Canula 1-6L: 24-44%, Mask: 40-100%</span>
          </div>
        </div>

        <div class="cdss-calc-results-card" id="calc-results-panel">
          <h5 class="cdss-calc-res-title">Ch\u1EC9 S\u1ED1 Oxy H\xF3a M\xE1u (Horowitz P/F Ratio)</h5>
          <div class="cdss-calc-metrics">
            <div class="cdss-metric-box">
              <span class="cdss-metric-label">T\u1EF7 S\u1ED1 PaO2 / FiO2</span>
              <span class="cdss-metric-val" style="color: ${color};">
                ${pf} <small>mmHg</small>
              </span>
              <div class="cdss-metric-sub" style="font-weight: 700; color: ${color};">
                ${ards}
              </div>
            </div>
          </div>

          <div class="cdss-calc-nav-hint">
            <i class="fa-solid fa-arrow-right text-teal-600"></i>
            <a href="abg/index.html" class="cdss-calc-link">Ph\xE2n t\xEDch chuy\xEAn s\xE2u t\u1EA1i Kh\xED M\xE1u \u0110\u1ED9ng M\u1EA1ch ABG Pro &gt;</a>
          </div>
        </div>
      </div>
    `;
    }
    function updateCalculatorView() {
      const modalBody = document.getElementById("cdss-calc-modal-body");
      if (!modalBody) return;
      const calcTabBtns = container.querySelectorAll(".cdss-calc-tab");
      calcTabBtns.forEach((btn) => {
        const t = btn.getAttribute("data-calc-tab");
        if (t === calcTab) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
      modalBody.innerHTML = renderCalculatorContent();
      bindCalculatorInputs();
    }
    function bindCalculatorInputs() {
      const bindLive = (id, key) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener("input", () => {
            calcData[key] = Number(el.value);
            const panel = document.getElementById("calc-results-panel");
            if (panel) {
              if (calcTab === "renal") {
                const crcl = calculateCrCl();
                const egfr = calculateCKDEPI();
                panel.innerHTML = `
                <h5 class="cdss-calc-res-title">K\u1EBFt Qu\u1EA3 Ch\u1EE9c N\u0103ng Th\u1EADn</h5>
                <div class="cdss-calc-metrics">
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">Cockcroft-Gault (CrCl)</span>
                    <span class="cdss-metric-val ${crcl < 30 ? "text-red-500" : crcl < 60 ? "text-amber-500" : "text-teal-600"}">
                      ${crcl} <small>mL/ph\xFAt</small>
                    </span>
                    <span class="cdss-metric-sub">D\xF9ng hi\u1EC7u ch\u1EC9nh li\u1EC1u kh\xE1ng sinh &amp; Vancomycin</span>
                  </div>
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">CKD-EPI 2021 (eGFR)</span>
                    <span class="cdss-metric-val ${egfr < 30 ? "text-red-500" : egfr < 60 ? "text-amber-500" : "text-teal-600"}">
                      ${egfr} <small>mL/ph\xFAt/1.73m\xB2</small>
                    </span>
                    <span class="cdss-metric-sub">Ph\xE2n giai \u0111o\u1EA1n b\u1EC7nh th\u1EADn m\u1EA1n (KDIGO)</span>
                  </div>
                </div>
                <div class="cdss-calc-nav-hint">
                  <i class="fa-solid fa-arrow-right text-teal-600"></i>
                  <a href="antibiotic/index.html" class="cdss-calc-link">Chuy\u1EC3n sang ph\xE2n h\u1EC7 InfectoDose 43 Kh\xE1ng Sinh &gt;</a>
                </div>
              `;
              } else if (calcTab === "body") {
                const { bmi, ibw, adjbw, cat } = calculateBMI();
                panel.innerHTML = `
                <h5 class="cdss-calc-res-title">Ch\u1EC9 S\u1ED1 Nh\xE2n Tr\u1EAFc &amp; Li\u1EC1u D\xF9ng</h5>
                <div class="cdss-calc-metrics">
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">BMI Th\u1EC3 Tr\u1EA1ng: <strong>${cat}</strong></span>
                    <span class="cdss-metric-val ${bmi >= 30 ? "text-red-500" : bmi >= 25 ? "text-amber-500" : "text-teal-600"}">
                      ${bmi} <small>kg/m\xB2</small>
                    </span>
                  </div>
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">C\xE2n N\u1EB7ng L\xFD T\u01B0\u1EDFng (IBW Devine)</span>
                    <span class="cdss-metric-val">${ibw} <small>kg</small></span>
                  </div>
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">C\xE2n N\u1EB7ng Hi\u1EC7u Ch\u1EC9nh (AdjBW 40%)</span>
                    <span class="cdss-metric-val">${adjbw} <small>kg</small></span>
                    <span class="cdss-metric-sub">S\u1EED d\u1EE5ng khi b\u1EC7nh nh\xE2n b\xE9o ph\xEC (TBW &gt; 120% IBW)</span>
                  </div>
                </div>
              `;
              } else if (calcTab === "map") {
                const { map, isHypotension } = calculateMAP();
                panel.innerHTML = `
                <h5 class="cdss-calc-res-title">Huy\u1EBFt \xC1p \u0110\u1ED9ng M\u1EA1ch Trung B\xECnh (MAP)</h5>
                <div class="cdss-calc-metrics">
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">C\xF4ng th\u1EE9c: MAP = [SBP + (2 \xD7 DBP)] / 3</span>
                    <span class="cdss-metric-val ${isHypotension ? "text-red-500" : "text-teal-600"}">
                      ${map} <small>mmHg</small>
                    </span>
                    ${isHypotension ? `
                      <div class="cdss-alert-strip-red">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span><strong>C\u1EA2NH B\xC1O T\u1EE4T HUY\u1EBET \xC1P (MAP &lt; 65 mmHg):</strong> Nguy c\u01A1 gi\u1EA3m t\u01B0\u1EDBi m\xE1u t\u1EA1ng, k\xEDch ho\u1EA1t h\u1ED3i s\u1EE9c d\u1ECBch Sepsis / V\u1EADn m\u1EA1ch!</span>
                      </div>
                    ` : `
                      <span class="cdss-metric-sub text-emerald-600">\u2713 \u0110\u1EA1t \u0111\xEDch t\u01B0\u1EDBi m\xE1u m\xF4 t\u1ED1i thi\u1EC3u (MAP \u2265 65 mmHg)</span>
                    `}
                  </div>
                </div>
                <div class="cdss-calc-nav-hint">
                  <i class="fa-solid fa-arrow-right text-teal-600"></i>
                  <a href="sepsis/index.html" class="cdss-calc-link">Chuy\u1EC3n sang CDSS Sepsis &amp; S\u1ED1c Nhi\u1EC5m Khu\u1EA9n &gt;</a>
                </div>
              `;
              } else if (calcTab === "pf") {
                const { pf, ards, color } = calculatePF();
                panel.innerHTML = `
                <h5 class="cdss-calc-res-title">Ch\u1EC9 S\u1ED1 Oxy H\xF3a M\xE1u (Horowitz P/F Ratio)</h5>
                <div class="cdss-calc-metrics">
                  <div class="cdss-metric-box">
                    <span class="cdss-metric-label">T\u1EF7 S\u1ED1 PaO2 / FiO2</span>
                    <span class="cdss-metric-val" style="color: ${color};">
                      ${pf} <small>mmHg</small>
                    </span>
                    <div class="cdss-metric-sub" style="font-weight: 700; color: ${color};">
                      ${ards}
                    </div>
                  </div>
                </div>
                <div class="cdss-calc-nav-hint">
                  <i class="fa-solid fa-arrow-right text-teal-600"></i>
                  <a href="abg/index.html" class="cdss-calc-link">Ph\xE2n t\xEDch chuy\xEAn s\xE2u t\u1EA1i Kh\xED M\xE1u \u0110\u1ED9ng M\u1EA1ch ABG Pro &gt;</a>
                </div>
              `;
              }
            }
          });
        }
      };
      bindLive("calc-age", "age");
      bindLive("calc-weight", "weight");
      bindLive("calc-weight-body", "weight");
      bindLive("calc-height", "height");
      bindLive("calc-scr", "scr");
      bindLive("calc-sbp", "sbp");
      bindLive("calc-dbp", "dbp");
      bindLive("calc-pao2", "pao2");
      bindLive("calc-fio2", "fio2");
      const sexRadios = container.querySelectorAll('input[name="calc-sex"], input[name="calc-sex-body"]');
      sexRadios.forEach((radio) => {
        radio.addEventListener("change", (e) => {
          calcData.sex = e.target.value;
          updateCalculatorView();
        });
      });
    }
    function attachEvents() {
      const searchInput = document.getElementById("cdss-search-input");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          const target = e.target;
          searchQuery = target.value;
          const cursor = target.selectionStart;
          render();
          const updated = document.getElementById("cdss-search-input");
          if (updated) {
            updated.focus();
            if (cursor !== null) updated.setSelectionRange(cursor, cursor);
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
      const catBtns = container.querySelectorAll(".cdss-cat-btn");
      catBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const cat = btn.getAttribute("data-cat") || "all";
          activeCategory = cat;
          render();
        });
      });
      const viewBtns = container.querySelectorAll(".cdss-view-icon-btn");
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
      const closeCalcBtn = document.getElementById("cdss-close-calc");
      if (closeCalcBtn) {
        closeCalcBtn.addEventListener("click", () => {
          isCalculatorOpen = false;
          render();
        });
      }
      const calcOverlay = document.getElementById("cdss-calc-overlay");
      if (calcOverlay) {
        calcOverlay.addEventListener("click", (e) => {
          if (e.target === calcOverlay) {
            isCalculatorOpen = false;
            render();
          }
        });
      }
      const calcTabBtns = container.querySelectorAll(".cdss-calc-tab");
      calcTabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const t = btn.getAttribute("data-calc-tab");
          if (t) {
            calcTab = t;
            updateCalculatorView();
          }
        });
      });
      bindCalculatorInputs();
      const closeShortcutsBtn = document.getElementById("cdss-close-shortcuts");
      if (closeShortcutsBtn) {
        closeShortcutsBtn.addEventListener("click", () => {
          isShortcutsOpen = false;
          render();
        });
      }
      const shortcutsOverlay = document.getElementById("cdss-shortcuts-overlay");
      if (shortcutsOverlay) {
        shortcutsOverlay.addEventListener("click", (e) => {
          if (e.target === shortcutsOverlay) {
            isShortcutsOpen = false;
            render();
          }
        });
      }
      const infoBtns = container.querySelectorAll(".cdss-info-trigger-btn, .cdss-tile-info-btn, [data-info-slug]");
      infoBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          const slug = btn.getAttribute("data-info-slug");
          if (slug) {
            infoModalSlug = slug;
            render();
          }
        });
      });
      const closeInfoBtn = document.getElementById("cdss-close-info");
      if (closeInfoBtn) {
        closeInfoBtn.addEventListener("click", () => {
          infoModalSlug = null;
          render();
        });
      }
      const infoOverlay = document.getElementById("cdss-info-overlay");
      if (infoOverlay) {
        infoOverlay.addEventListener("click", (e) => {
          if (e.target === infoOverlay) {
            infoModalSlug = null;
            render();
          }
        });
      }
      const pinBtns = container.querySelectorAll("[data-pin-slug]");
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
      const unpinBtns = container.querySelectorAll("[data-unpin-slug]");
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
      const toolLinks = container.querySelectorAll("a[data-slug]");
      toolLinks.forEach((link) => {
        link.addEventListener("click", () => {
          const slug = link.getAttribute("data-slug");
          if (slug) {
            recordRecentSlug(slug);
          }
        });
      });
      const resetTagBtns = container.querySelectorAll("[data-reset]");
      resetTagBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const target = btn.getAttribute("data-reset");
          if (target === "category") activeCategory = "all";
          if (target === "search") searchQuery = "";
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
      const cards = container.querySelectorAll(".cdss-card-clean");
      cards.forEach((card) => {
        card.addEventListener("click", (e) => {
          const target = e.target;
          if (target.closest("button") || target.closest("a")) return;
          const slug = card.getAttribute("data-slug");
          const meta = CDSS_MODULES.find((m) => m.slug === slug);
          if (meta && meta.standaloneUrl) {
            recordRecentSlug(meta.slug);
            window.location.href = meta.standaloneUrl;
          }
        });
      });
    }
    const navCalcBtn = document.getElementById("nav-calc-btn");
    if (navCalcBtn) {
      navCalcBtn.addEventListener("click", (e) => {
        e.preventDefault();
        isCalculatorOpen = !isCalculatorOpen;
        render();
      });
    }
    const navStatBtn = document.getElementById("nav-stat-btn");
    if (navStatBtn) {
      navStatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        activeCategory = activeCategory === "stat" ? "all" : "stat";
        render();
      });
    }
    const navShortcutsBtn = document.getElementById("nav-shortcuts-btn");
    if (navShortcutsBtn) {
      navShortcutsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        isShortcutsOpen = true;
        render();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        const input = document.getElementById("cdss-search-input");
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        isCalculatorOpen = !isCalculatorOpen;
        render();
      }
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        activeCategory = activeCategory === "stat" ? "all" : "stat";
        render();
      }
      if (e.key === "?" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        isShortcutsOpen = true;
        render();
      }
      if (e.key === "Escape") {
        if (isCalculatorOpen || isShortcutsOpen || infoModalSlug) {
          isCalculatorOpen = false;
          isShortcutsOpen = false;
          infoModalSlug = null;
          render();
        } else if (searchQuery) {
          searchQuery = "";
          render();
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
