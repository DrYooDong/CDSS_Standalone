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
  var TRIAGE_CHIPS = [
    { id: "triage-dengue", label: "S\u1ED1c SXHD Dengue", slug: "dengue", icon: "fa-solid fa-droplet", urgency: "stat", highlightText: "Hct cao, c\xF4 \u0111\u1EB7c m\xE1u, s\u1ED1c t\u1EE5t HA" },
    { id: "triage-sepsis", label: "Sepsis / S\u1ED1c Nhi\u1EC5m Khu\u1EA9n", slug: "sepsis", icon: "fa-solid fa-biohazard", urgency: "stat", highlightText: "S\u1ED1t cao, t\u1EE5t HA, Lactate > 2, SOFA" },
    { id: "triage-abg", label: "Kh\xED M\xE1u & Toan Ki\u1EC1m ABG", slug: "abg", icon: "fa-solid fa-lungs", urgency: "stat", highlightText: "Toan chuy\u1EC3n h\xF3a, PaO2/PaCO2, Anion Gap" },
    { id: "triage-ecg", label: "STEMI & \u0110o ECG Caliper", slug: "ecg", icon: "fa-solid fa-heart-pulse", urgency: "stat", highlightText: "\u0110au ng\u1EF1c, STEMI \u0111\u1ECBnh khu, QTc, Caliper" },
    { id: "triage-abx", label: "Kh\xE1ng Sinh & L\u1ECDc M\xE1u", slug: "antibiotic", icon: "fa-solid fa-viruses", urgency: "urgent", highlightText: "43 KS, ch\u1EC9nh th\u1EADn CrCl, vi khu\u1EA9n MDR" },
    { id: "triage-vanco", label: "Vancomycin AUC/MIC", slug: "vancomycin", icon: "fa-solid fa-syringe", urgency: "urgent", highlightText: "Li\u1EC1u n\u1EA1p, AUC 400-600, l\u1ECDc m\xE1u IHD" },
    { id: "triage-diacare", label: "C\u1EA5p C\u1EE9u DKA & Insulin", slug: "diacare", icon: "fa-solid fa-vial-circle-check", urgency: "urgent", highlightText: "Basal-Bolus, ph\xE1c \u0111\u1ED3 tr\u01B0\u1EE3t SSI, toan ceton" },
    { id: "triage-hepa", label: "Sinh H\xF3a Gan ACG", slug: "hepa", icon: "fa-solid fa-virus", urgency: "routine", highlightText: "T\u1EF7 s\u1ED1 R-ratio, De Ritis, FIB-4, DILI" },
    { id: "triage-csf", label: "D\u1ECBch N\xE3o T\u1EE7y CSF", slug: "csf", icon: "fa-solid fa-brain", urgency: "stat", highlightText: "Vi\xEAm m\xE0ng n\xE3o, ch\u1EA1m m\u1EA1ch vs SAH, LP" },
    { id: "triage-bates", label: "Kh\xE1m B\u1EC7nh Bates & Macleod", slug: "inpatient", icon: "fa-solid fa-stethoscope", urgency: "routine", highlightText: "H\u1ECFi b\u1EC7nh 7 thu\u1ED9c t\xEDnh OPQRST, 30+ h\u1ED9i ch\u1EE9ng" }
  ];
  var PINNED_STORAGE_KEY = "cdss_pinned_module_slugs";
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
  function initCDSSHub(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let activeCategory = "all";
    let searchQuery = "";
    let viewMode = "grid";
    let pinnedSlugs = getPinnedSlugs();
    const categories = [
      { id: "all", name: "T\u1EA5t C\u1EA3 (10 CDSS)", icon: "fa-solid fa-shapes" },
      { id: "stat", name: "\u{1F6A8} C\u1EA5p C\u1EE9u STAT (5)", icon: "fa-solid fa-bolt-lightning", isStat: true },
      { id: "resuscitation", name: "H\u1ED3i S\u1EE9c C\u1EA5p C\u1EE9u", icon: "fa-solid fa-biohazard" },
      { id: "cardio-resp", name: "Tim M\u1EA1ch & H\xF4 H\u1EA5p", icon: "fa-solid fa-heart-pulse" },
      { id: "pharmacology", name: "Kh\xE1ng Sinh & D\u01B0\u1EE3c L\xFD", icon: "fa-solid fa-viruses" },
      { id: "gastro-endo", name: "Ti\xEAu H\xF3a & N\u1ED9i Ti\u1EBFt", icon: "fa-solid fa-virus" },
      { id: "neuro-internal", name: "Th\u1EA7n Kinh & N\u1ED9i Tr\xFA", icon: "fa-solid fa-brain" }
    ];
    const specialtyGroups = [
      {
        id: "resus-emer",
        title: "H\u1ED3i S\u1EE9c C\u1EA5p C\u1EE9u & Nhi\u1EC5m Tr\xF9ng Nguy K\u1ECBch",
        desc: "Ph\xE1c \u0111\u1ED3 h\u1ED3i s\u1EE9c ch\u1ED1ng s\u1ED1c SXHD Dengue, ph\xE2n t\u1EA7ng nhi\u1EC5m khu\u1EA9n huy\u1EBFt v\xE0 kh\xED m\xE1u \u0111\u1ED9ng m\u1EA1ch",
        icon: "fa-solid fa-truck-medical",
        slugs: ["dengue", "sepsis", "abg"]
      },
      {
        id: "cardio-resp",
        title: "Tim M\u1EA1ch, H\xF4 H\u1EA5p & \u0110i\u1EC7n Tim Chuy\xEAn S\xE2u",
        desc: "Ph\xE2n t\xEDch \u0111i\u1EC7n t\xE2m \u0111\u1ED3 12 \u0111\u1EA1o tr\xECnh tr\u1EF1c quan v\xE0 th\u0103ng b\u1EB1ng toan ki\u1EC1m c\u01A1 th\u1EC3",
        icon: "fa-solid fa-heart-pulse",
        slugs: ["ecg", "abg"]
      },
      {
        id: "pharma-care",
        title: "D\u01B0\u1EE3c \u0110\u1ED9ng H\u1ECDc Kh\xE1ng Sinh & T\u1ED1i \u01AFu H\xF3a Li\u1EC1u",
        desc: "C\xE1 th\u1EC3 h\xF3a li\u1EC1u 43 kh\xE1ng sinh theo ch\u1EE9c n\u0103ng th\u1EADn l\u1ECDc m\xE1u v\xE0 gi\xE1m s\xE1t n\u1ED3ng \u0111\u1ED9 Vancomycin AUC/MIC",
        icon: "fa-solid fa-viruses",
        slugs: ["antibiotic", "vancomycin"]
      },
      {
        id: "internal-specialty",
        title: "Ti\xEAu H\xF3a - Gan M\u1EADt, Chuy\u1EC3n H\xF3a & Th\u1EA7n Kinh",
        desc: "Bi\u1EC7n gi\u1EA3i sinh h\xF3a gan ACG, qu\u1EA3n l\xFD insulin n\u1ED9i vi\u1EC7n, ch\u1ECDc d\xF2 d\u1ECBch n\xE3o t\u1EE7y v\xE0 k\u1EF9 n\u0103ng kh\xE1m l\xE2m s\xE0ng Bates",
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
        } else if (activeCategory === "resuscitation") {
          matchCat = m.category === "resuscitation";
        } else if (activeCategory === "cardio-resp") {
          matchCat = m.category === "cardiology" || m.category === "respiratory";
        } else if (activeCategory === "pharmacology") {
          matchCat = m.category === "pharmacology";
        } else if (activeCategory === "gastro-endo") {
          matchCat = m.category === "gastroenterology" || m.category === "endocrinology";
        } else if (activeCategory === "neuro-internal") {
          matchCat = m.category === "neurology" || m.category === "internal";
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
      const activeCategoryObj = categories.find((c) => c.id === activeCategory);
      container.innerHTML = `
      <div class="cdss-hub-workspace">

        <!-- ================================================================
             1. BEDSIDE CLINICAL COMMAND CENTER (Clean HepaCDSS / Sepsis Style)
             ================================================================ -->
        <header class="cdss-command-header">
          <div class="cdss-command-head-row">
            <div class="cdss-command-brand-block">
              <div class="cdss-command-logo-wrap">
                <img src="./shared/cdss-logo.svg" alt="CDSS Suite Logo" class="cdss-command-logo" />
              </div>
              <div>
                <div class="cdss-command-subtag">
                  <span class="cdss-live-dot"></span>
                  <span>H\u1EC7 Th\u1ED1ng CDSS \u0110\u1ED9c L\u1EADp \u2022 Bedside Ready</span>
                  <span class="cdss-ver-tag">v2.5</span>
                </div>
                <h1 class="cdss-command-title">
                  Trung T\xE2m H\u1ED7 Tr\u1EE3 Quy\u1EBFt \u0110\u1ECBnh L\xE2m S\xE0ng
                </h1>
              </div>
            </div>

            <!-- EBM & Privacy Telemetry Strip -->
            <div class="cdss-command-telemetry">
              <div class="cdss-telemetry-item">
                <i class="fa-solid fa-shapes text-teal-600"></i>
                <div>
                  <div class="cdss-telemetry-val">10 Module</div>
                  <div class="cdss-telemetry-lbl">Chuy\xEAn Khoa S\xE2u</div>
                </div>
              </div>
              <div class="cdss-telemetry-item">
                <i class="fa-solid fa-pills text-emerald-600"></i>
                <div>
                  <div class="cdss-telemetry-val">43 Kh\xE1ng Sinh</div>
                  <div class="cdss-telemetry-lbl">Ch\u1EC9nh Th\u1EADn &amp; L\u1ECDc M\xE1u</div>
                </div>
              </div>
              <div class="cdss-telemetry-item">
                <i class="fa-solid fa-shield-halved text-cyan-600"></i>
                <div>
                  <div class="cdss-telemetry-val">100% Client-Side</div>
                  <div class="cdss-telemetry-lbl">B\u1EA3o M\u1EADt Y Khoa</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Concise Scope Description -->
          <p class="cdss-command-desc">
            B\u1ED9 c\xF4ng c\u1EE5 CDSS h\u1ED7 tr\u1EE3 ch\u1EA9n \u0111o\xE1n v\xE0 \u0111i\u1EC1u tr\u1ECB t\u1EA1i gi\u01B0\u1EDDng b\u1EC7nh chu\u1EA9n Y h\u1ECDc ch\u1EE9ng c\u1EE9 (EBM) v\xE0 B\u1ED9 Y t\u1EBF: 
            ph\xE1c \u0111\u1ED3 d\u1ECBch truy\u1EC1n ch\u1ED1ng s\u1ED1c SXHD Dengue, ph\xE2n t\xEDch kh\xED m\xE1u ABG 6 b\u01B0\u1EDBc, \u0111i\u1EC7n tim 12 chuy\u1EC3n \u0111\u1EA1o STEMI, 
            sinh h\xF3a gan HepaCDSS theo ACG, ph\xE2n t\u1EA7ng Sepsis &amp; s\u1ED1c nhi\u1EC5m khu\u1EA9n NICE/Phoenix, 
            t\xEDnh li\u1EC1u 43 kh\xE1ng sinh InfectoDose, Vancomycin PK AUC/MIC, insulin n\u1ED9i vi\u1EC7n DiaCare, 
            kh\xE1m b\u1EC7nh n\u1ED9i tr\xFA Bates &amp; Macleod v\xE0 bi\u1EC7n gi\u1EA3i d\u1ECBch n\xE3o t\u1EE7y CSF CDSS.
          </p>

          <!-- ================================================================
               2. RAPID STAT / CLINICAL EMERGENCY ACCESS BAR
               ================================================================ -->
          <div class="cdss-rapid-bar" id="cdss-rapid-bar">
            <div class="cdss-rapid-label">
              <i class="fa-solid fa-bolt-lightning text-amber-500"></i>
              <span>Truy C\u1EADp Nhanh Theo T\xECnh Hu\u1ED1ng:</span>
            </div>
            <div class="cdss-rapid-chips">
              ${TRIAGE_CHIPS.map((chip) => `
                <button 
                  class="cdss-rapid-chip cdss-rapid-chip--${chip.urgency}" 
                  data-target-slug="${chip.slug}"
                  title="${chip.label} \u2014 ${chip.highlightText}"
                >
                  <i class="${chip.icon}"></i>
                  <span>${chip.label}</span>
                </button>
              `).join("")}
            </div>
          </div>
        </header>

        <!-- ================================================================
             3. PINNED / FAVORITES SECTION (If user pinned any module)
             ================================================================ -->
        ${pinnedModules.length > 0 ? `
          <section class="cdss-pinned-section">
            <div class="cdss-pinned-head">
              <div class="cdss-pinned-title">
                <i class="fa-solid fa-star text-amber-400"></i>
                <span>C\xF4ng C\u1EE5 Th\u01B0\u1EDDng D\xF9ng \u0110\xE3 Ghim (${pinnedModules.length})</span>
              </div>
              <button id="cdss-clear-pinned-btn" class="cdss-clear-pinned-link" title="B\u1ECF ghim t\u1EA5t c\u1EA3">
                <i class="fa-regular fa-trash-can"></i> B\u1ECF ghim t\u1EA5t c\u1EA3
              </button>
            </div>
            <div class="cdss-cards-grid cdss-cards-grid--pinned">
              ${pinnedModules.map((m) => renderModuleCard(m, true)).join("")}
            </div>
          </section>
        ` : ""}

        <!-- ================================================================
             4. UNIFIED SEARCH & CLINICAL FILTER TOOLBAR
             ================================================================ -->
        <section class="cdss-toolbar">
          <!-- Search Row -->
          <div class="cdss-search-wrap">
            <i class="fa-solid fa-magnifying-glass cdss-search-icon"></i>
            <input 
              id="cdss-search-input" 
              type="text" 
              class="cdss-search-input"
              placeholder="Tra c\u1EE9u nhanh theo t\xEAn CDSS, thu\u1ED1c, b\u1EC7nh l\xFD, tri\u1EC7u ch\u1EE9ng, m\xE3 ICD-10 (nh\u1EA5n / \u0111\u1EC3 t\xECm)..." 
              value="${searchQuery}"
              autocomplete="off"
              spellcheck="false"
            />
            ${searchQuery ? `
              <button id="cdss-clear-search" class="cdss-search-clear" title="X\xF3a t\u1EEB kh\xF3a t\xECm ki\u1EBFm" aria-label="X\xF3a t\xECm ki\u1EBFm">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : `
              <span class="cdss-search-hint" title="Ph\xEDm t\u1EAFt t\xECm ki\u1EBFm">/</span >
            `}
          </div>

          <!-- Controls Bar: Category Segmented Tabs + View Switcher -->
          <div class="cdss-controls-bar">
            <div class="cdss-cat-tabs">
              ${categories.map((cat) => `
                <button 
                  class="cdss-cat-btn ${activeCategory === cat.id ? "active" : ""} ${cat.isStat ? "cdss-cat-btn--stat" : ""}" 
                  data-cat="${cat.id}"
                >
                  <i class="${cat.icon}"></i>
                  <span>${cat.name}</span>
                </button>
              `).join("")}
            </div>

            <div class="cdss-view-switcher">
              <button 
                class="cdss-view-btn ${viewMode === "grid" ? "active" : ""}" 
                data-mode="grid"
                title="Xem d\u1EA1ng L\u01B0\u1EDBi Th\u1EBB Chuy\xEAn Khoa"
                aria-label="Xem d\u1EA1ng L\u01B0\u1EDBi"
              >
                <i class="fa-solid fa-table-cells-large"></i>
                <span class="cdss-view-btn-text">L\u01B0\u1EDBi</span>
              </button>

              <button 
                class="cdss-view-btn ${viewMode === "list" ? "active" : ""}" 
                data-mode="list"
                title="Xem d\u1EA1ng B\u1EA3ng Gi\u01B0\u1EDDng B\u1EC7nh T\u1ED1i Gi\u1EA3n"
                aria-label="Xem d\u1EA1ng B\u1EA3ng"
              >
                <i class="fa-solid fa-table-list"></i>
                <span class="cdss-view-btn-text">B\u1EA3ng G\u1ECDn</span>
              </button>

              <button 
                class="cdss-view-btn ${viewMode === "grouped" ? "active" : ""}" 
                data-mode="grouped"
                title="Xem theo Kh\u1ED1i Khoa L\xE2m S\xE0ng"
                aria-label="Xem theo Kh\u1ED1i Khoa"
              >
                <i class="fa-solid fa-layer-group"></i>
                <span class="cdss-view-btn-text">Nh\xF3m Khoa</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Results Counter & Reset Filter Indicator -->
        <div class="cdss-results-strip">
          <div class="cdss-results-info">
            <span>Hi\u1EC3n th\u1ECB <strong>${filtered.length}</strong> / <strong>${CDSS_MODULES.length}</strong> c\xF4ng c\u1EE5 CDSS</span>
            ${activeCategory !== "all" ? `
              <span class="cdss-filter-tag">
                ${activeCategoryObj?.name}
                <i class="fa-solid fa-xmark cdss-tag-remove" data-reset="category"></i>
              </span>
            ` : ""}
            ${searchQuery ? `
              <span class="cdss-filter-tag">
                "${searchQuery}"
                <i class="fa-solid fa-xmark cdss-tag-remove" data-reset="search"></i>
              </span>
            ` : ""}
          </div>

          ${activeCategory !== "all" || searchQuery ? `
            <button id="cdss-reset-filters" class="cdss-reset-link" title="Xem l\u1EA1i t\u1EA5t c\u1EA3 c\xF4ng c\u1EE5">
              <i class="fa-solid fa-rotate-left"></i> \u0110\u1EB7t l\u1EA1i b\u1ED9 l\u1ECDc
            </button>
          ` : ""}
        </div>

        <!-- ================================================================
             5. MAIN WORKSPACE CONTENT (GRID / LIST / GROUPED)
             ================================================================ -->
        ${filtered.length === 0 ? `
          <div class="cdss-empty-state">
            <div class="cdss-empty-icon">
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3 class="cdss-empty-title">Kh\xF4ng t\xECm th\u1EA5y c\xF4ng c\u1EE5 CDSS ph\xF9 h\u1EE3p</h3>
            <p class="cdss-empty-desc">
              Kh\xF4ng c\xF3 k\u1EBFt qu\u1EA3 n\xE0o kh\u1EDBp v\u1EDBi "<strong>${searchQuery}</strong>". Th\u1EED t\xECm v\u1EDBi t\u1EEB kh\xF3a kh\xE1c nh\u01B0 <em>Dengue, Vancomycin, SOFA, FIB-4, PaO2, Kh\xE1ng sinh</em> ho\u1EB7c ch\u1ECDn chuy\xEAn khoa b\xEAn tr\xEAn.
            </p>
            <button id="cdss-empty-reset-btn" class="cdss-btn-primary">
              <i class="fa-solid fa-arrows-rotate"></i> Xem l\u1EA1i t\u1EA5t c\u1EA3 10 CDSS
            </button>
          </div>
        ` : ""}

        <!-- VIEW 1: MODERN 3-COLUMN CLINICAL GRID (DEFAULT) -->
        ${viewMode === "grid" && filtered.length > 0 ? `
          <div class="cdss-cards-grid">
            ${filtered.map((m) => renderModuleCard(m, false)).join("")}
          </div>
        ` : ""}

        <!-- VIEW 2: BEDSIDE COMPACT LIST / TABLE VIEW -->
        ${viewMode === "list" && filtered.length > 0 ? `
          <div class="cdss-list-wrapper">
            <table class="cdss-list-table">
              <thead>
                <tr>
                  <th style="width: 44px; text-align: center;">\u2605</th>
                  <th style="width: 28%;">C\xF4ng C\u1EE5 CDSS</th>
                  <th style="width: 14%;">Chuy\xEAn Khoa &amp; M\u1EE9c</th>
                  <th style="width: 32%;">Ch\u1EC9 \u0110\u1ECBnh &amp; N\u0103ng L\u1EF1c T\xEDnh To\xE1n</th>
                  <th style="width: 16%;">C\u01A1 S\u1EDF Ph\xE1p L\xFD</th>
                  <th style="width: 10%; text-align: right;">H\xE0nh \u0110\u1ED9ng</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map((m) => {
        const isPinned = pinnedSlugs.includes(m.slug);
        return `
                    <tr class="cdss-list-row" id="cdss-row-${m.slug}">
                      <td style="text-align: center;">
                        <button 
                          class="cdss-pin-btn ${isPinned ? "pinned" : ""}" 
                          data-pin-slug="${m.slug}" 
                          title="${isPinned ? "B\u1ECF ghim" : "Ghim l\xEAn \u0111\u1EA7u"}"
                        >
                          <i class="${isPinned ? "fa-solid" : "fa-regular"} fa-star"></i>
                        </button>
                      </td>
                      <td>
                        <div class="cdss-list-cell-tool">
                          <div class="cdss-card-emblem cdss-emblem--${m.category}" style="width: 38px; height: 38px; font-size: 1.05rem; border-radius: 9px;">
                            <i class="${m.icon}"></i>
                          </div>
                          <div>
                            <a href="${m.standaloneUrl}" class="cdss-list-tool-name">
                              ${m.title}
                            </a>
                            <div class="cdss-list-tool-code">
                              <span class="cdss-code-pill">${m.brandCode || m.slug.toUpperCase()}</span>
                              ${m.titleEn ? `<span class="cdss-list-tool-en">${m.titleEn}</span>` : ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="cdss-list-dept">${m.department || m.categoryName}</div>
                        <span class="cdss-urgency-badge cdss-urgency--${m.urgency}">
                          ${m.urgency === "stat" ? "\u{1F6A8} STAT C\u1EA5p C\u1EE9u" : m.urgency === "urgent" ? "\u26A1 Kh\u1EA9n C\u1EA5p" : "Th\u01B0\u1EDDng Quy"}
                        </span>
                      </td>
                      <td>
                        <div class="cdss-list-desc">${m.shortDesc}</div>
                        ${m.features ? `
                          <div class="cdss-list-features">
                            ${m.features.slice(0, 3).map((f) => `<span class="cdss-feature-chip">${f}</span>`).join("")}
                          </div>
                        ` : ""}
                      </td>
                      <td>
                        <div class="cdss-list-guideline" title="${m.guidelineSource}">
                          <i class="fa-solid fa-book-medical text-teal-600"></i> ${m.badge || m.guidelineSource}
                        </div>
                        ${m.icd10 && m.icd10.length > 0 ? `
                          <div class="cdss-list-icd">
                            ${m.icd10.slice(0, 3).map((c) => `<span class="cdss-icd-pill">${c}</span>`).join("")}
                          </div>
                        ` : ""}
                      </td>
                      <td style="text-align: right;">
                        <a href="${m.standaloneUrl}" class="cdss-list-launch-btn">
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

        <!-- VIEW 3: SPECIALTY DEPARTMENT GROUPS -->
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

                  <div class="cdss-cards-grid" style="margin-bottom:0;">
                    ${groupModules.map((m) => renderModuleCard(m, false)).join("")}
                  </div>
                </div>
              `;
      }).join("")}
          </div>
        ` : ""}

        <!-- ================================================================
             6. CLINICAL PRACTICE STANDARDS ACCORDION & EBM FOOTER
             ================================================================ -->
        <section class="cdss-ebm-footer-card">
          <div class="cdss-ebm-top-row">
            <div class="cdss-ebm-head">
              <i class="fa-solid fa-shield-halved"></i>
              <span>C\u01A1 S\u1EDF Ph\xE1p L\xFD Y Khoa &amp; Chu\u1EA9n M\u1EF1c B\u1EB1ng Ch\u1EE9ng (EBM)</span>
            </div>
            <span class="cdss-ebm-badge-ok">
              <i class="fa-solid fa-circle-check"></i> Tu\xE2n th\u1EE7 H\u01B0\u1EDBng D\u1EABn B\u1ED9 Y T\u1EBF &amp; Qu\u1ED1c T\u1EBF
            </span>
          </div>

          <div class="cdss-ebm-columns">
            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-certificate text-teal-600"></i>
                <span>B\u1ED9 Y T\u1EBF Vi\u1EC7t Nam</span>
              </h4>
              <p>
                Tu\xE2n th\u1EE7 nghi\xEAm ng\u1EB7t Quy\u1EBFt \u0111\u1ECBnh 2760/Q\u0110-BYT (Ph\xE1c \u0111\u1ED3 SXHD Dengue 2023), Quy\u1EBFt \u0111\u1ECBnh 5631/Q\u0110-BYT (S\u1EED d\u1EE5ng kh\xE1ng sinh), H\u01B0\u1EDBng d\u1EABn B\u1EC7nh vi\u1EC7n B\u1EC7nh Nhi\u1EC7t \u0110\u1EDBi eMed 2026 v\xE0 BV\u0110K C\xE0 Mau.
              </p>
            </div>

            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-globe text-cyan-600"></i>
                <span>H\u01B0\u1EDBng D\u1EABn Qu\u1ED1c T\u1EBF (EBM)</span>
              </h4>
              <p>
                C\u1EADp nh\u1EADt chu\u1EA9n NICE NG253 (2024/2026), Surviving Sepsis Campaign (SSC), Phoenix Sepsis Criteria 2024, ASHP/IDSA 2020 (Vancomycin AUC/MIC), ADA Standards of Care 2026, EFNS v\xE0 ACG 2017.
              </p>
            </div>

            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-laptop-medical text-emerald-600"></i>
                <span>\u0110\u1ED9c L\u1EADp &amp; An To\xE0n Tuy\u1EC7t \u0110\u1ED1i</span>
              </h4>
              <p>
                To\xE0n b\u1ED9 thu\u1EADt to\xE1n ch\u1EA1y 100% t\u1EA1i tr\xECnh duy\u1EC7t b\xE1c s\u0129 (Client-side), kh\xF4ng truy\u1EC1n g\u1EEDi th\xF4ng tin nh\u1EADn di\u1EC7n ng\u01B0\u1EDDi b\u1EC7nh (No PII), ho\u1EA1t \u0111\u1ED9ng m\u01B0\u1EE3t m\xE0 ngo\u1EA1i tuy\u1EBFn (Offline Ready) t\u1EA1i khoa c\u1EA5p c\u1EE9u v\xE0 ICU.
              </p>
            </div>
          </div>
        </section>

      </div>
    `;
      function renderModuleCard(m, isPinnedSection = false) {
        const isPinned = pinnedSlugs.includes(m.slug);
        const isStat = m.urgency === "stat";
        return `
        <article class="cdss-module-card ${isStat ? "cdss-module-card--stat" : ""}" id="cdss-card-${m.slug}" data-slug="${m.slug}">
          <!-- Card Top Bar: Urgency/Department + Star Pin + Emblem -->
          <div class="cdss-card-top-bar">
            <div class="cdss-card-badges-group">
              <span class="cdss-urgency-badge cdss-urgency--${m.urgency}">
                ${m.urgency === "stat" ? '<i class="fa-solid fa-bolt-lightning"></i> STAT C\u1EA5p C\u1EE9u' : m.urgency === "urgent" ? '<i class="fa-solid fa-clock-rotate-left"></i> Kh\u1EA9n C\u1EA5p' : '<i class="fa-solid fa-stethoscope"></i> Th\u01B0\u1EDDng Quy'}
              </span>
              <span class="cdss-dept-tag">${m.department || m.categoryName}</span>
            </div>

            <div class="cdss-card-actions-top">
              <button 
                class="cdss-pin-btn ${isPinned ? "pinned" : ""}" 
                data-pin-slug="${m.slug}" 
                title="${isPinned ? "B\u1ECF ghim kh\u1ECFi B\xE0n l\xE0m vi\u1EC7c" : "Ghim l\xEAn \u0111\u1EA7u B\xE0n l\xE0m vi\u1EC7c"}"
                aria-label="${isPinned ? "B\u1ECF ghim" : "Ghim"}"
              >
                <i class="${isPinned ? "fa-solid" : "fa-regular"} fa-star"></i>
              </button>
              
              <div class="cdss-card-emblem cdss-emblem--${m.category}">
                <i class="${m.icon}"></i>
              </div>
            </div>
          </div>

          <!-- Title & Brand Acronym Group -->
          <div class="cdss-card-title-group">
            <div class="cdss-brand-row">
              <span class="cdss-brand-code">${m.brandCode || m.slug.toUpperCase()}</span>
              ${m.badge ? `<span class="cdss-badge-evidence">${m.badge}</span>` : ""}
            </div>
            <h3 class="cdss-card-title">
              <a href="${m.standaloneUrl}">${m.title}</a>
            </h3>
            ${m.titleEn ? `<p class="cdss-card-title-en">${m.titleEn}</p>` : ""}
          </div>

          <!-- STAT Symptom Trigger Bar (For rapid bedside visual identification) -->
          ${m.statTrigger ? `
            <div class="cdss-trigger-box">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span>${m.statTrigger}</span>
            </div>
          ` : ""}

          <!-- Core Clinical Description -->
          <p class="cdss-card-desc">${m.shortDesc}</p>

          <!-- Core Clinical Features Chips -->
          ${m.features && m.features.length > 0 ? `
            <div class="cdss-feature-chips">
              ${m.features.slice(0, 4).map((f) => `<span class="cdss-feature-chip">${f}</span>`).join("")}
            </div>
          ` : ""}

          <!-- Guideline Source & ICD-10 Metadata Strip -->
          <div class="cdss-card-meta-strip">
            <div class="cdss-meta-item" title="${m.guidelineSource}">
              <i class="fa-solid fa-book-medical"></i>
              <span>${m.guidelineSource}</span>
            </div>
            ${m.icd10 && m.icd10.length > 0 ? `
              <div class="cdss-meta-item cdss-meta-icd">
                <i class="fa-solid fa-barcode"></i>
                <span>ICD-10: ${m.icd10.slice(0, 3).map((c) => `<span class="cdss-icd-pill">${c}</span>`).join("")}</span>
              </div>
            ` : ""}
          </div>

          <!-- Action Footer -->
          <div class="cdss-card-footer">
            <div class="cdss-card-ver-wrap">
              <span class="cdss-card-version">${m.version}</span>
            </div>
            <a href="${m.standaloneUrl}" class="cdss-launch-btn">
              <span>M\u1EDF CDSS</span>
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
      const catBtns = container.querySelectorAll(".cdss-cat-btn");
      catBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const cat = btn.getAttribute("data-cat") || "all";
          activeCategory = cat;
          render();
        });
      });
      const modeBtns = container.querySelectorAll(".cdss-view-btn");
      modeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const mode = btn.getAttribute("data-mode");
          if (mode) {
            viewMode = mode;
            render();
          }
        });
      });
      const triageChips = container.querySelectorAll(".cdss-rapid-chip");
      triageChips.forEach((chip) => {
        chip.addEventListener("click", () => {
          const targetSlug = chip.getAttribute("data-target-slug");
          if (!targetSlug) return;
          if (activeCategory !== "all" || searchQuery) {
            activeCategory = "all";
            searchQuery = "";
            render();
          }
          setTimeout(() => {
            const targetCard = document.getElementById(`cdss-card-${targetSlug}`) || document.getElementById(`cdss-row-${targetSlug}`);
            if (targetCard) {
              targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
              targetCard.classList.remove("cdss-pulse-highlight");
              void targetCard.offsetWidth;
              targetCard.classList.add("cdss-pulse-highlight");
            }
          }, 50);
        });
      });
      const pinBtns = container.querySelectorAll(".cdss-pin-btn");
      pinBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
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
      const clearPinnedBtn = document.getElementById("cdss-clear-pinned-btn");
      if (clearPinnedBtn) {
        clearPinnedBtn.addEventListener("click", () => {
          pinnedSlugs = [];
          setPinnedSlugs([]);
          render();
        });
      }
      const resetBtn = document.getElementById("cdss-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          activeCategory = "all";
          searchQuery = "";
          render();
        });
      }
      const emptyResetBtn = document.getElementById("cdss-empty-reset-btn");
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener("click", () => {
          activeCategory = "all";
          searchQuery = "";
          render();
        });
      }
      const tagRemovers = container.querySelectorAll(".cdss-tag-remove");
      tagRemovers.forEach((btn) => {
        btn.addEventListener("click", () => {
          const resetType = btn.getAttribute("data-reset");
          if (resetType === "category") activeCategory = "all";
          if (resetType === "search") searchQuery = "";
          render();
        });
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
