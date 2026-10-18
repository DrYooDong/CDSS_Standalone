(() => {
  // src/cdss-registry.ts
  var CDSS_MODULES = [
    {
      id: "cdss-dengue-fluid",
      slug: "dengue",
      title: "Ph\xE1c \u0110\u1ED3 D\u1ECBch Truy\u1EC1n & Ch\u1ED1ng S\u1ED1c SXHD Dengue (B\u1ED9 Y T\u1EBF 2023)",
      titleEn: "Dengue Fluid Resuscitation & Shock Management CDSS",
      shortDesc: "T\u1EF1 \u0111\u1ED9ng t\xEDnh c\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh CDC 2014, b\u1EA3ng k\u1EBF ho\u1EA1ch c\u1ECDc d\u1ECBch 4 c\u1ED9t \u0111\u1ED9ng h\u1ECDc v\xE0 li\u1EC1u v\u1EADn m\u1EA1ch Dopamin/Noradrenalin b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml.",
      category: "infectious",
      categoryName: "Truy\u1EC1n nhi\u1EC5m & C\u1EA5p c\u1EE9u",
      version: "2.0.0 (BYT 2023)",
      updatedAt: "2026-09-08",
      author: "CliniPortal CDSS Squad & BYT Q\u0110 2760/Q\u0110-BYT",
      guidelineSource: "Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 2760/Q\u0110-BYT ng\xE0y 04/07/2023 c\u1EE7a B\u1ED9 Y t\u1EBF Vi\u1EC7t Nam",
      icd10: ["A97", "A97.0", "A97.1", "A97.2", "A97.9"],
      icon: "fa-solid fa-droplet",
      badge: "B\u1ED9 Y T\u1EBF 2023",
      features: ["C\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh CDC 2014", "C\u1ECDc d\u1ECBch 4 c\u1ED9t \u0111\u1ED9ng h\u1ECDc", "B\u01A1m ti\xEAm \u0111i\u1EC7n Dopamin/Noradrenalin", "S\u1ED1c tr\u01A1 & Cao ph\xE2n t\u1EED Dextran 40", "Gi\xE1m s\xE1t Hct & CVP"],
      isStandalone: true,
      standaloneUrl: "dengue/index.html"
    },
    {
      id: "cdss-ecg-analysis",
      slug: "ecg",
      title: "Ph\xE2n T\xEDch \u0110i\u1EC7n T\xE2m \u0110\u1ED3 12 Chuy\u1EC3n \u0110\u1EA1o & AI Ch\u1EA9n \u0110o\xE1n (ECG Master)",
      titleEn: "12-Lead ECG Waveform Analysis & Diagnostic Assistant CDSS",
      shortDesc: "B\u1ED9 ph\xE2n t\xEDch \u0111i\u1EC7n t\xE2m \u0111\u1ED3 12 \u0111\u1EA1o tr\xECnh tr\u1EF1c quan tr\xEAn canvas \u0111\u1ED9 ph\xE2n gi\u1EA3i cao: 21 ca b\u1EC7nh l\xE2m s\xE0ng \u0111i\u1EC3n h\xECnh, \u0111o \u0111\u1EA1c th\u01B0\u1EDBc Caliper \u0111i\u1EC7n t\u1EED, c\u1EA9m nang 10 b\u01B0\u1EDBc BS Nguy\u1EC5n T\xF4n Kinh Thi & ECG Made Easy, \u0111o tr\u1EE5c \u0111i\u1EC7n tim, QT/QTc, STEMI \u0111\u1ECBnh khu v\xE0 thu\u1EADt to\xE1n Brugada.",
      category: "cardiology",
      categoryName: "Tim m\u1EA1ch",
      version: "2.5.0 (21 Ca L\xE2m S\xE0ng)",
      updatedAt: "2026-09-09",
      author: "CliniPortal ECG Master Squad & Dr. Atul Luthra",
      guidelineSource: "AHA/ACC/HRS Guidelines for the Interpretation of the 12-Lead Electrocardiogram & BS Nguy\u1EC5n T\xF4n Kinh Thi",
      icd10: ["I21", "I47", "I48", "I49", "R94.3"],
      icon: "fa-solid fa-heart-pulse",
      badge: "21 Ca L\xE2m S\xE0ng + Caliper",
      features: ["21 Ca l\xE2m s\xE0ng m\u1EABu", "Th\u01B0\u1EDBc Caliper \u0111o \u0111\u1EA1c miligi\xE2y", "10 B\u01B0\u1EDBc \u0111\u1ECDc BS Kinh Thi", "\u0110\u1ECBnh khu nh\u1ED3i m\xE1u STEMI", "Thu\u1EADt to\xE1n Brugada & QT/QTc"],
      isStandalone: true,
      standaloneUrl: "ecg/index.html"
    },
    {
      id: "cdss-abg-pro",
      slug: "abg",
      title: "Ph\xE2n T\xEDch Kh\xED M\xE1u \u0110\u1ED9ng M\u1EA1ch & X\u1EED Tr\xED L\xE2m S\xE0ng (ABG Pro)",
      titleEn: "Arterial Blood Gas Analysis & Acid-Base Clinical Decision Support",
      shortDesc: "\u0110\xE1nh gi\xE1 6 b\u01B0\u1EDBc r\u1ED1i lo\u1EA1n toan ki\u1EC1m, 24 ca l\xE2m s\xE0ng chuy\xEAn s\xE2u, Nomogram Siggaard-Andersen t\u01B0\u01A1ng t\xE1c, 3 c\xE2y quy\u1EBFt \u0111\u1ECBnh trao \u0111\u1ED5i kh\xED & GOLDMARK, c\u1EA9m nang Test Allen v\xE0 k\u1EF9 thu\u1EADt l\u1EA5y m\xE1u \u0111\u1ED9ng m\u1EA1ch.",
      category: "respiratory",
      categoryName: "H\xF4 h\u1EA5p & C\u1EA5p c\u1EE9u",
      version: "2.5.0 (24 Ca L\xE2m S\xE0ng + Nomogram)",
      updatedAt: "2026-09-09",
      author: "CliniPortal Critical Care Squad & EBM Guidelines",
      guidelineSource: "Hennessey & Japp / Pierre & Ranson ABG Interpretation Guidelines / Arterial Blood Gases Made Easy",
      icd10: ["E87.2", "E87.3", "J96", "E10.1", "R06.0"],
      icon: "fa-solid fa-lungs",
      badge: "24 Ca + Nomogram + C\xE2y Quy\u1EBFt \u0110\u1ECBnh",
      features: ["L\u01B0u \u0111\u1ED3 6 b\u01B0\u1EDBc toan ki\u1EC1m", "Nomogram Siggaard-Andersen", "24 Ca b\u1EC7nh k\xE8m gi\u1EA3i th\xEDch", "Anion Gap & Delta Gap", "C\u0103n nguy\xEAn GOLDMARK & A-a gradient"],
      isStandalone: true,
      standaloneUrl: "abg/index.html"
    },
    {
      id: "cdss-hepa-biochem",
      slug: "hepa",
      title: "Ph\xE2n T\xEDch Sinh H\xF3a Gan & Quy\u1EBFt \u0110\u1ECBnh L\xE2m S\xE0ng (HepaCDSS)",
      titleEn: "Liver Biochemistry & Clinical Decision Support System",
      shortDesc: "Ph\xE2n t\xEDch sinh h\xF3a gan chu\u1EA9n ACG, WHO: l\u01B0u \u0111\u1ED3 ti\u1EBFp c\u1EADn, t\xEDnh t\u1EF7 s\u1ED1 R-ratio, De Ritis, FIB-4, APRI, ph\xE2n t\u1EA7ng vi\xEAm gan virus, x\u01A1 gan Child-Pugh, MELD-Na v\xE0 t\u1ED5n th\u01B0\u01A1ng gan do thu\u1ED1c (DILI).",
      category: "gastroenterology",
      categoryName: "Ti\xEAu h\xF3a & Gan m\u1EADt",
      version: "2.0.0 (Chu\u1EA9n ACG 2017 & WHO)",
      updatedAt: "2026-09-08",
      author: "CliniPortal HepaCDSS Squad & ACG Guidelines",
      guidelineSource: "ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries (Am J Gastroenterol 2017)",
      icd10: ["K71", "K72", "K73", "K74", "K76", "B18"],
      icon: "fa-solid fa-virus",
      badge: "ACG & WHO Standard",
      features: ["T\u1EF7 s\u1ED1 R (R-ratio) t\u1ED5n th\u01B0\u01A1ng gan", "T\u1EF7 s\u1ED1 De Ritis (AST/ALT)", "X\u01A1 h\xF3a FIB-4 & APRI", "Child-Pugh & MELD-Na", "T\u1ED5n th\u01B0\u01A1ng gan do thu\u1ED1c DILI"],
      isStandalone: true,
      standaloneUrl: "hepa/index.html"
    },
    {
      id: "cdss-sepsis-risk",
      slug: "sepsis",
      title: "Ph\xE2n T\u1EA7ng Nguy C\u01A1 Nhi\u1EC5m Tr\xF9ng & S\u1ED1c Nhi\u1EC5m Khu\u1EA9n (SepsisCDSS)",
      titleEn: "Sepsis & Septic Shock Clinical Decision Support System",
      shortDesc: "S\xE0ng l\u1ECDc \u0111a ph\u01B0\u01A1ng th\u1EE9c, nh\u1EADn di\u1EC7n v\xE0 ph\xE2n t\u1EA7ng nguy c\u01A1 nhi\u1EC5m tr\xF9ng, nhi\u1EC5m khu\u1EA9n huy\u1EBFt (Sepsis) v\xE0 s\u1ED1c nhi\u1EC5m khu\u1EA9n theo NICE 2024/2026, Sepsis-3 (SOFA/qSOFA), Phoenix 2024 (Nhi khoa), Obstetric SOFA, LP-NEWS v\xE0 t\u1EF7 s\u1ED1 NLR.",
      category: "resuscitation",
      categoryName: "H\u1ED3i s\u1EE9c C\u1EA5p c\u1EE9u",
      version: "2.0.0 (NICE & Sepsis-3 & Phoenix)",
      updatedAt: "2026-09-23",
      author: "CliniPortal Critical Care Squad & NICE NG253 / SSC 2024",
      guidelineSource: "NICE NG253 (2024/2026 update), Surviving Sepsis Campaign (SSC) & Phoenix Sepsis Criteria 2024",
      icd10: ["A41.9", "R65.2", "R65.21", "A40", "A41"],
      icon: "fa-solid fa-biohazard",
      badge: "NICE 2024 + Phoenix 2024 + Sepsis-3",
      features: ["Thang \u0111i\u1EC3m SOFA & qSOFA", "Phoenix 2024 (Sepsis Nhi khoa)", "NICE NG253 Ph\xE2n t\u1EA7ng nguy c\u01A1", "Obstetric SOFA (S\u1EA3n khoa)", "T\u1EF7 s\u1ED1 NLR & G\xF3i 1 gi\u1EDD SSC"],
      isStandalone: true,
      standaloneUrl: "sepsis/index.html"
    },
    {
      id: "cdss-antibiotic-dosing",
      slug: "antibiotic",
      title: "\u0110\xE1nh Gi\xE1 Nhi\u1EC5m Tr\xF9ng & Ph\xE1c \u0110\u1ED3, Li\u1EC1u Kh\xE1ng Sinh (InfectoDose CDSS)",
      titleEn: "Infection Assessment, MDR Risk Stratification & Precision Antibiotic Dosing CDSS",
      shortDesc: "H\u1EC7 th\u1ED1ng h\u1ED7 tr\u1EE3 ra quy\u1EBFt \u0111\u1ECBnh l\xE2m s\xE0ng 2 ph\xE2n h\u1EC7 ho\xE0n ch\u1EC9nh: (1) \u0110\xE1nh gi\xE1 nhi\u1EC5m tr\xF9ng NHSN-CDC, ph\xE2n t\u1EA7ng nguy c\u01A1 vi khu\u1EA9n \u0111a kh\xE1ng (SOFA/CLIF-SOFA) v\xE0 ph\xE1c \u0111\u1ED3 kh\xE1ng sinh kh\u1EDFi \u0111\u1EA7u theo BV B\u1EC7nh Nhi\u1EC7t \u0110\u1EDBi & B\u1ED9 Y T\u1EBF; (2) C\xE1 th\u1EC3 h\xF3a t\xEDnh li\u1EC1u 43 kh\xE1ng sinh, hi\u1EC7u ch\u1EC9nh ch\u1EE9c n\u0103ng th\u1EADn (CrCl/eGFR), l\u1ECDc m\xE1u chu k\u1EF3 HD/CRRT/CAPD, t\u01B0\u01A1ng t\xE1c thu\u1ED1c DDI v\xE0 t\xE1i \u0111\xE1nh gi\xE1 xu\u1ED1ng thang 48-72h.",
      category: "pharmacology",
      categoryName: "Truy\u1EC1n nhi\u1EC5m & Kh\xE1ng sinh",
      version: "3.0.0 (BVBND 2026 & NHSN)",
      updatedAt: "2026-10-10",
      author: "CliniPortal CDSS Squad & BV B\u1EC7nh Nhi\u1EC7t \u0110\u1EDBi & Sanford/Stanford",
      guidelineSource: "BV B\u1EC7nh Nhi\u1EC7t \u0110\u1EDBi (eMed 2026), Q\u0110 5631/Q\u0110-BYT 2020 & Stanford/Sanford Antimicrobial Guide",
      icd10: ["A41", "A49", "Z16", "N18", "J18", "K65"],
      icon: "fa-solid fa-viruses",
      badge: "BVBND 2026 + NHSN + 43 KS + HD/CRRT",
      features: ["\u0110\xE1nh gi\xE1 nhi\u1EC5m tr\xF9ng NHSN-CDC", "Ph\xE2n t\u1EA7ng nguy c\u01A1 vi khu\u1EA9n MDR", "T\xEDnh li\u1EC1u 43 kh\xE1ng sinh", "Hi\u1EC7u ch\u1EC9nh CrCl & L\u1ECDc m\xE1u HD/CRRT", "T\u01B0\u01A1ng t\xE1c thu\u1ED1c DDI & Xu\u1ED1ng thang"],
      isStandalone: true,
      standaloneUrl: "antibiotic/index.html"
    },
    {
      id: "cdss-vancomycin-pk",
      slug: "vancomycin",
      title: "Qu\u1EA3n L\xFD Li\u1EC1u & D\u01B0\u1EE3c \u0110\u1ED9ng H\u1ECDc Vancomycin (ASHP/IDSA 2020)",
      titleEn: "Vancomycin Precision Dosing & TDM AUC/MIC CDSS",
      shortDesc: "H\u1ED7 tr\u1EE3 ra quy\u1EBFt \u0111\u1ECBnh l\xE2m s\xE0ng t\xEDnh to\xE1n li\u1EC1u n\u1EA1p, li\u1EC1u duy tr\xEC, ch\u1EC9nh li\u1EC1u theo CrCl/eGFR, b\xE9o ph\xEC (Zhang 2024), l\u1ECDc m\xE1u IHD, gi\xE1m s\xE1t n\u1ED3ng \u0111\u1ED9 \u0111\xE1y Trough v\xE0 TDM AUC24/MIC m\u1EE5c ti\xEAu 400-600 theo h\u01B0\u1EDBng d\u1EABn ASHP/IDSA 2020 v\xE0 BV\u0110K C\xE0 Mau.",
      category: "pharmacology",
      categoryName: "D\u01B0\u1EE3c l\xFD & Kh\xE1ng sinh",
      version: "2.0.0 (ASHP 2020 & BV C\xE0 Mau)",
      updatedAt: "2026-09-22",
      author: "CliniPortal Pharmacology Squad & H\u01B0\u1EDBng d\u1EABn ASHP/IDSA/PIDS/SIDP 2020 & BV\u0110K C\xE0 Mau",
      guidelineSource: "ASHP/IDSA/PIDS/SIDP 2020 Therapeutic Monitoring of Vancomycin & H\u01B0\u1EDBng D\u1EABn S\u1EED D\u1EE5ng Vancomycin BV\u0110K C\xE0 Mau",
      icd10: ["Z16", "N18", "A41", "A49", "B95.6"],
      icon: "fa-solid fa-syringe",
      badge: "ASHP 2020 + TDM AUC/MIC + B\xE9o Ph\xEC",
      features: ["T\xEDnh li\u1EC1u n\u1EA1p 25-35 mg/kg", "Li\u1EC1u duy tr\xEC theo \u0111\u1ED9 thanh th\u1EA3i CrCl", "M\u1EE5c ti\xEAu AUC24/MIC 400-600 mg\xB7h/L", "Hi\u1EC7u ch\u1EC9nh b\u1EC7nh nh\xE2n b\xE9o ph\xEC (Zhang 2024)", "Ph\xE1c \u0111\u1ED3 l\u1ECDc m\xE1u IHD & N\u1ED3ng \u0111\u1ED9 \u0111\xE1y Trough"],
      isStandalone: true,
      standaloneUrl: "vancomycin/index.html"
    },
    {
      id: "cdss-diacare-insulin",
      slug: "diacare",
      title: "Qu\u1EA3n L\xFD Insulin & \u0110\u01B0\u1EDDng Huy\u1EBFt N\u1ED9i Vi\u1EC7n (DiaCare CDSS)",
      titleEn: "DiaCare Inpatient Glycemic & Insulin Management CDSS",
      shortDesc: "H\u1EC7 th\u1ED1ng h\u1ED7 tr\u1EE3 ra quy\u1EBFt \u0111\u1ECBnh l\xE2m s\xE0ng qu\u1EA3n l\xFD \u0111\xE1i th\xE1o \u0111\u01B0\u1EDDng n\u1ED9i vi\u1EC7n, t\u1EF1 \u0111\u1ED9ng t\xEDnh to\xE1n li\u1EC1u insulin ph\xE1c \u0111\u1ED3 Basal-Bolus, hi\u1EC7u ch\u1EC9nh suy th\u1EADn/suy gan/b\xE9o ph\xEC, ph\xE1c \u0111\u1ED3 tr\u01B0\u1EE3t SSI, x\u1EED tr\xED c\u1EA5p c\u1EE9u DKA/HHS v\xE0 t\xECnh hu\u1ED1ng l\xE2m s\xE0ng \u0111\u1EB7c th\xF9 (chu ph\u1EABu, corticoid, l\u1ECDc m\xE1u, nu\xF4i \u0103n sonde) theo ADA 2026 v\xE0 JBDS-IP.",
      category: "endocrinology",
      categoryName: "N\u1ED9i ti\u1EBFt & Chuy\u1EC3n h\xF3a",
      version: "2.0.0 (ADA 2026 & JBDS-IP)",
      updatedAt: "2026-09-28",
      author: "CliniPortal CDSS Squad & ADA 2026 / JBDS-IP",
      guidelineSource: "ADA Standards of Care 2026 (Hospital Care) & JBDS-IP Inpatient Glycemic Guidelines",
      icd10: ["E10", "E11", "E14", "E87.2", "R73.9"],
      icon: "fa-solid fa-syringe",
      badge: "ADA 2026 + JBDS-IP + Basal-Bolus",
      features: ["Ph\xE1c \u0111\u1ED3 Basal-Bolus c\xE1 th\u1EC3 h\xF3a", "Ph\xE1c \u0111\u1ED3 tr\u01B0\u1EE3t hi\u1EC7u ch\u1EC9nh SSI", "C\u1EA5p c\u1EE9u toan ceton DKA & HHS", "T\xECnh hu\u1ED1ng chu ph\u1EABu, corticoid, sonde", "Hi\u1EC7u ch\u1EC9nh suy gan, suy th\u1EADn (eGFR)"],
      isStandalone: true,
      standaloneUrl: "diacare/index.html"
    },
    {
      id: "cdss-inpatient-exam",
      slug: "inpatient",
      title: "Ti\u1EBFp C\u1EADn L\xE2m S\xE0ng & Kh\xE1m B\u1EC7nh N\u1ED9i Tr\xFA (Bates & Macleod)",
      titleEn: "Inpatient Clinical Examination & Diagnostic Approach CDSS",
      shortDesc: "C\u1EA9m nang kh\xE1m l\xE2m s\xE0ng c\xF3 h\u1EC7 th\u1ED1ng, ti\u1EBFp c\u1EADn c\xE1c h\u1ED9i ch\u1EE9ng v\xE0 tri\u1EC7u ch\u1EE9ng b\u1EC7nh n\u1ED9i tr\xFA kinh \u0111i\u1EC3n, b\u1ED9 c\xF4ng c\u1EE5 h\u1ECFi b\u1EC7nh s\u1EED 7 thu\u1ED9c t\xEDnh, tra c\u1EE9u nhanh v\xE0 ghi ch\xFA m\u1EE5c ti\xEAu l\xE2m s\xE0ng.",
      category: "internal",
      categoryName: "N\u1ED9i khoa & L\xE2m s\xE0ng",
      version: "1.0.0 (Bates & Macleod)",
      updatedAt: "2026-09-28",
      author: "CliniPortal CDSS Squad & Bates / Macleod",
      guidelineSource: "Bates\u2019 Pocket Guide to Physical Examination & Macleod's Clinical Examination",
      icd10: ["R00-R99", "Z00.0"],
      icon: "fa-solid fa-stethoscope",
      badge: "Bates & Macleod + 7 Thu\u1ED9c T\xEDnh",
      features: ["H\u1ECFi b\u1EC7nh s\u1EED 7 thu\u1ED9c t\xEDnh (OPQRST)", "Kh\xE1m h\u1EC7 c\u01A1 quan to\xE0n di\u1EC7n Bates", "Ti\u1EBFp c\u1EADn 30+ h\u1ED9i ch\u1EE9ng & tri\u1EC7u ch\u1EE9ng", "Ch\u1EA9n \u0111o\xE1n ph\xE2n bi\u1EC7t & B\u1EABy l\xE2m s\xE0ng", "Ghi ch\xFA m\u1EE5c ti\xEAu \u0111i\u1EC1u tr\u1ECB n\u1ED9i tr\xFA"],
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
  var CLINICAL_SCENARIOS = [
    {
      id: "sepsis-shock",
      icon: "fa-solid fa-biohazard",
      label: "Nhi\u1EC5m Khu\u1EA9n Huy\u1EBFt & S\u1ED1c",
      trigger: "S\u1ED1t cao, t\u1EE5t huy\u1EBFt \xE1p, lactate > 2 mmol/L, SOFA/Phoenix t\u0103ng",
      targetSlug: "sepsis",
      colorClass: "cdss-emblem--resuscitation"
    },
    {
      id: "abg-acidbase",
      icon: "fa-solid fa-lungs",
      label: "Kh\xED M\xE1u \u0110\u1ED9ng M\u1EA1ch & Toan Ki\u1EC1m",
      trigger: "Kh\xF3 th\u1EDF, PaO2/PaCO2 bi\u1EBFn thi\xEAn, toan chuy\u1EC3n h\xF3a Anion Gap",
      targetSlug: "abg",
      colorClass: "cdss-emblem--respiratory"
    },
    {
      id: "hepa-biochem",
      icon: "fa-solid fa-virus",
      label: "Sinh H\xF3a Gan & V\xE0ng Da \u1EE8 M\u1EADt",
      trigger: "ALT/AST t\u0103ng v\u1ECDt, De Ritis, t\xEDnh t\u1EF7 s\u1ED1 R-ratio, x\u01A1 h\xF3a FIB-4/APRI",
      targetSlug: "hepa",
      colorClass: "cdss-emblem--gastroenterology"
    },
    {
      id: "abx-renal",
      icon: "fa-solid fa-viruses",
      label: "Kh\xE1ng Sinh & Ch\u1EC9nh Li\u1EC1u Th\u1EADn",
      trigger: "Ti\xEAu chu\u1EA9n NHSN, vi khu\u1EA9n \u0111a kh\xE1ng MDR & ch\u1EC9nh 43 KS theo CrCl",
      targetSlug: "antibiotic",
      colorClass: "cdss-emblem--pharmacology"
    },
    {
      id: "vancomycin-tdm",
      icon: "fa-solid fa-syringe",
      label: "Vancomycin PK & Gi\xE1m S\xE1t TDM",
      trigger: "Li\u1EC1u n\u1EA1p 25-35 mg/kg, m\u1EE5c ti\xEAu AUC24/MIC 400-600, l\u1ECDc m\xE1u IHD",
      targetSlug: "vancomycin",
      colorClass: "cdss-emblem--pharmacology"
    },
    {
      id: "diacare-insulin",
      icon: "fa-solid fa-syringe",
      label: "\u0110\u01B0\u1EDDng Huy\u1EBFt & Insulin N\u1ED9i Vi\u1EC7n",
      trigger: "Ph\xE1c \u0111\u1ED3 Basal-Bolus, ph\xE1c \u0111\u1ED3 tr\u01B0\u1EE3t SSI, c\u1EA5p c\u1EE9u toan ceton DKA/HHS",
      targetSlug: "diacare",
      colorClass: "cdss-emblem--endocrinology"
    },
    {
      id: "dengue-shock",
      icon: "fa-solid fa-droplet",
      label: "SXHD Dengue & Ch\u1ED1ng S\u1ED1c",
      trigger: "SXHD ng\xE0y 4-6, c\xF4 \u0111\u1EB7c m\xE1u Hct cao, c\u1ECDc d\u1ECBch 4 c\u1ED9t \u0111\u1ED9ng h\u1ECDc BYT",
      targetSlug: "dengue",
      colorClass: "cdss-emblem--cardiology"
    },
    {
      id: "ecg-stemi",
      icon: "fa-solid fa-heart-pulse",
      label: "\u0110i\u1EC7n Tim 12 \u0110\u1EA1o Tr\xECnh & STEMI",
      trigger: "\u0110o tr\u1EE5c \u0111i\u1EC7n tim, QT/QTc, th\u01B0\u1EDBc Caliper, \u0111\u1ECBnh khu nh\u1ED3i m\xE1u & Brugada",
      targetSlug: "ecg",
      colorClass: "cdss-emblem--cardiology"
    },
    {
      id: "inpatient-exam",
      icon: "fa-solid fa-stethoscope",
      label: "Kh\xE1m L\xE2m S\xE0ng & B\u1EC7nh S\u1EED N\u1ED9i Tr\xFA",
      trigger: "H\u1ECFi b\u1EC7nh 7 thu\u1ED9c t\xEDnh (OPQRST), kh\xE1m h\u1EC7 c\u01A1 quan Bates & Macleod",
      targetSlug: "inpatient",
      colorClass: "cdss-emblem--internal"
    }
  ];
  function initCDSSHub(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let activeCategory = "all";
    let searchQuery = "";
    let viewMode = "grid";
    const categories = [
      { id: "all", name: "T\u1EA5t C\u1EA3 (9 CDSS)", icon: "fa-solid fa-shapes" },
      { id: "resuscitation", name: "H\u1ED3i S\u1EE9c C\u1EA5p C\u1EE9u", icon: "fa-solid fa-biohazard" },
      { id: "cardiology", name: "Tim M\u1EA1ch & \u0110i\u1EC7n Tim", icon: "fa-solid fa-heart-pulse" },
      { id: "respiratory", name: "H\xF4 H\u1EA5p & Kh\xED M\xE1u", icon: "fa-solid fa-lungs" },
      { id: "pharmacology", name: "Kh\xE1ng Sinh & D\u01B0\u1EE3c L\xFD", icon: "fa-solid fa-viruses" },
      { id: "gastroenterology", name: "Ti\xEAu H\xF3a & Gan M\u1EADt", icon: "fa-solid fa-virus" },
      { id: "endocrinology", name: "N\u1ED9i Ti\u1EBFt & \u0110\u01B0\u1EDDng Huy\u1EBFt", icon: "fa-solid fa-syringe" },
      { id: "internal", name: "Kh\xE1m B\u1EC7nh N\u1ED9i Khoa", icon: "fa-solid fa-stethoscope" }
    ];
    const specialtyGroups = [
      {
        id: "resus-emer",
        title: "H\u1ED3i S\u1EE9c C\u1EA5p C\u1EE9u & B\u1EC7nh Nhi\u1EC5m Tr\xF9ng Nguy K\u1ECBch",
        desc: "Ph\xE1c \u0111\u1ED3 h\u1ED3i s\u1EE9c ch\u1ED1ng s\u1ED1c SXHD, ph\xE2n t\u1EA7ng nhi\u1EC5m khu\u1EA9n huy\u1EBFt v\xE0 h\u01B0\u1EDBng d\u1EABn kh\xE1ng sinh ban \u0111\u1EA7u",
        icon: "fa-solid fa-truck-medical",
        slugs: ["sepsis", "dengue", "antibiotic"]
      },
      {
        id: "cardio-resp",
        title: "Tim M\u1EA1ch, H\xF4 H\u1EA5p & C\xE2n B\u1EB1ng N\u1ED9i M\xF4i",
        desc: "Ph\xE2n t\xEDch \u0111i\u1EC7n t\xE2m \u0111\u1ED3 12 chuy\u1EC3n \u0111\u1EA1o, kh\xED m\xE1u \u0111\u1ED9ng m\u1EA1ch v\xE0 th\u0103ng b\u1EB1ng toan ki\u1EC1m",
        icon: "fa-solid fa-heart-pulse",
        slugs: ["ecg", "abg"]
      },
      {
        id: "hepato-endocrine",
        title: "Ti\xEAu H\xF3a - Gan M\u1EADt & Chuy\u1EC3n H\xF3a N\u1ED9i Ti\u1EBFt",
        desc: "Ti\u1EBFp c\u1EADn sinh h\xF3a gan theo ACG, \u0111\u1ECBnh l\u01B0\u1EE3ng R-ratio v\xE0 ki\u1EC3m so\xE1t insulin n\u1ED9i vi\u1EC7n",
        icon: "fa-solid fa-virus",
        slugs: ["hepa", "diacare"]
      },
      {
        id: "pharma-internal",
        title: "D\u01B0\u1EE3c \u0110\u1ED9ng H\u1ECDc Kh\xE1ng Sinh & Kh\xE1m B\u1EC7nh N\u1ED9i Khoa",
        desc: "C\xE1 th\u1EC3 h\xF3a li\u1EC1u Vancomycin TDM v\xE0 k\u1EF9 n\u0103ng ti\u1EBFp c\u1EADn tri\u1EC7u ch\u1EE9ng l\xE2m s\xE0ng n\u1ED9i tr\xFA Bates",
        icon: "fa-solid fa-stethoscope",
        slugs: ["vancomycin", "inpatient"]
      }
    ];
    function render() {
      const q = searchQuery.toLowerCase().trim();
      const filtered = CDSS_MODULES.filter((m) => {
        const matchCat = activeCategory === "all" || m.category === activeCategory;
        const matchSearch = !q || m.title.toLowerCase().includes(q) || m.titleEn && m.titleEn.toLowerCase().includes(q) || m.shortDesc.toLowerCase().includes(q) || m.guidelineSource.toLowerCase().includes(q) || m.features && m.features.some((f) => f.toLowerCase().includes(q)) || m.icd10 && m.icd10.some((c) => c.toLowerCase().includes(q));
        return matchCat && matchSearch;
      });
      container.innerHTML = `
      <div class="cdss-hub-workspace">
        
        <!-- ================================================================
             1. HERO COMMAND CENTER (HepaCDSS Light Medical Aesthetics)
             ================================================================ -->
        <section class="cdss-hero-container">
          <div class="cdss-hero-top">
            <div class="cdss-hero-pill">
              <span class="cdss-hero-pulse-dot"></span>
              <span>H\u1EC6 TH\u1ED0NG CDSS BEDSIDE \u2022 CHU\u1EA8N Y H\u1ECCC CH\u1EE8NG C\u1EE8 (EBM)</span>
            </div>

            <div class="cdss-hero-meta-badge">
              <i class="fa-solid fa-shield-halved"></i>
              <span>100% X\u1EED L\xFD Tr\u1EF1c Ti\u1EBFp T\u1EA1i Tr\xECnh Duy\u1EC7t \u2022 Kh\xF4ng L\u01B0u Tr\u1EEF PII</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin: 1rem auto 0.5rem auto;">
            <img src="./shared/cdss-logo.svg" alt="CDSS Logo" style="width: 52px; height: 52px; filter: drop-shadow(0 4px 12px rgba(13, 148, 136, 0.4));" />
            <div style="text-align: left;">
              <div style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-primary, #0d9488);">
                CDSS Platform Suite
              </div>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-text-muted, #64748b);">
                H\u1EC7 Th\u1ED1ng H\u1ED7 Tr\u1EE3 Quy\u1EBFt \u0110\u1ECBnh L\xE2m S\xE0ng \u0110\u1ED9c L\u1EADp
              </div>
            </div>
          </div>

          <h1 class="cdss-hero-title">
            H\u1EC7 Sinh Th\xE1i Quy\u1EBFt \u0110\u1ECBnh L\xE2m S\xE0ng <span class="highlight">Chu\u1EA9n H\xF3a Y Khoa</span>
          </h1>

          <p class="cdss-hero-desc">
            N\u1EC1n t\u1EA3ng t\xEDch h\u1EE3p 9 module CDSS \u0111\u1ED9c l\u1EADp chuy\xEAn s\xE2u v\u1EDBi giao di\u1EC7n chu\u1EA9n h\xF3a: t\xEDnh to\xE1n li\u1EC1u 43 kh\xE1ng sinh, ph\xE1c \u0111\u1ED3 d\u1ECBch truy\u1EC1n ch\u1ED1ng s\u1ED1c SXHD Dengue, ph\xE2n t\xEDch kh\xED m\xE1u ABG 6 b\u01B0\u1EDBc, \u0111\xE1nh gi\xE1 sinh h\xF3a gan theo ACG, ph\xE2n t\u1EA7ng Sepsis, qu\u1EA3n l\xFD Vancomycin AUC/MIC, ki\u1EC3m so\xE1t insulin n\u1ED9i vi\u1EC7n v\xE0 kh\xE1m b\u1EC7nh n\u1ED9i tr\xFA Bates &amp; Macleod.
          </p>

          <!-- Suite Bedside Metrics Strip -->
          <div class="cdss-metrics-strip">
            <div class="cdss-metric-card">
              <div class="cdss-metric-icon cdss-metric-icon--teal">
                <i class="fa-solid fa-shapes"></i>
              </div>
              <div>
                <div class="cdss-metric-num">9</div>
                <div class="cdss-metric-label">Module Chuy\xEAn Khoa</div>
              </div>
            </div>

            <div class="cdss-metric-card">
              <div class="cdss-metric-icon cdss-metric-icon--emerald">
                <i class="fa-solid fa-pills"></i>
              </div>
              <div>
                <div class="cdss-metric-num">43</div>
                <div class="cdss-metric-label">Kh\xE1ng Sinh Ch\u1EC9nh Li\u1EC1u</div>
              </div>
            </div>

            <div class="cdss-metric-card">
              <div class="cdss-metric-icon cdss-metric-icon--cyan">
                <i class="fa-solid fa-book-medical"></i>
              </div>
              <div>
                <div class="cdss-metric-num">45+</div>
                <div class="cdss-metric-label">Ca L\xE2m S\xE0ng M\u1EABu</div>
              </div>
            </div>

            <div class="cdss-metric-card">
              <div class="cdss-metric-icon cdss-metric-icon--amber">
                <i class="fa-solid fa-hospital-user"></i>
              </div>
              <div>
                <div class="cdss-metric-num">100%</div>
                <div class="cdss-metric-label">B\u1EA3o M\u1EADt Ng\u01B0\u1EDDi B\u1EC7nh</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================================================================
             2. CLINICAL EMERGENCY & TRIAGE SCENARIOS (Quick Bedside Launcher)
             ================================================================ -->
        <section class="cdss-triage-panel" id="cdss-clinical-scenarios">
          <div class="cdss-triage-top">
            <div class="cdss-triage-heading">
              <i class="fa-solid fa-bolt-lightning"></i>
              <span>Tra C\u1EE9u Nhanh Theo T\xECnh Hu\u1ED1ng L\xE2m S\xE0ng Kh\u1EA9n C\u1EA5p</span>
            </div>
            <span class="cdss-triage-tag">9 T\xECnh Hu\u1ED1ng Ph\u1ED5 Bi\u1EBFn</span>
          </div>

          <div class="cdss-scenarios-grid">
            ${CLINICAL_SCENARIOS.map((sc) => `
              <a href="${sc.targetSlug}/index.html" class="cdss-scenario-card" title="M\u1EDF module ${sc.label}">
                <div class="cdss-scenario-icon ${sc.colorClass}">
                  <i class="${sc.icon}"></i>
                </div>
                <div class="cdss-scenario-content">
                  <div class="cdss-scenario-title">${sc.label}</div>
                  <div class="cdss-scenario-desc">${sc.trigger}</div>
                </div>
                <i class="fa-solid fa-arrow-right cdss-scenario-arrow"></i>
              </a>
            `).join("")}
          </div>
        </section>

        <!-- ================================================================
             3. SEARCH & CATEGORY FILTER TOOLBAR
             ================================================================ -->
        <section class="cdss-toolbar">
          <!-- Search Box -->
          <div class="cdss-search-wrap">
            <i class="fa-solid fa-magnifying-glass cdss-search-icon"></i>
            <input 
              id="cdss-search-input" 
              type="text" 
              class="cdss-search-input"
              placeholder="Tra c\u1EE9u theo t\xEAn CDSS, thu\u1ED1c, b\u1EC7nh l\xFD, ph\xE1c \u0111\u1ED3, ICD-10 (nh\u1EA5n / \u0111\u1EC3 t\xECm nhanh)..." 
              value="${searchQuery}"
              autocomplete="off"
            />
            ${searchQuery ? `
              <button id="cdss-clear-search" class="cdss-search-clear" title="X\xF3a t\xECm ki\u1EBFm">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : `
              <span class="cdss-search-hint">/</span>
            `}
          </div>

          <!-- Controls Row: Category Tabs & View Switcher -->
          <div class="cdss-controls-row">
            <div class="cdss-cat-tabs">
              ${categories.map((cat) => `
                <button 
                  class="cdss-cat-btn ${activeCategory === cat.id ? "active" : ""}" 
                  data-cat="${cat.id}"
                >
                  <i class="${cat.icon}"></i>
                  <span>${cat.name}</span>
                  ${cat.id === "all" ? `<span class="cdss-cat-badge">${CDSS_MODULES.length}</span>` : ""}
                </button>
              `).join("")}
            </div>

            <div class="cdss-view-switcher">
              <button 
                class="cdss-view-btn ${viewMode === "grid" ? "active" : ""}" 
                data-mode="grid"
                title="Xem d\u1EA1ng L\u01B0\u1EDBi Th\u1EBB Chu\u1EA9n HepaCDSS"
                aria-label="Xem d\u1EA1ng L\u01B0\u1EDBi"
              >
                <i class="fa-solid fa-table-cells-large"></i>
              </button>

              <button 
                class="cdss-view-btn ${viewMode === "grouped" ? "active" : ""}" 
                data-mode="grouped"
                title="Xem theo Kh\u1ED1i Chuy\xEAn Khoa \u0110i\u1EC1u Tr\u1ECB"
                aria-label="Xem theo Ph\xE2n Khoa"
              >
                <i class="fa-solid fa-layer-group"></i>
              </button>

              <button 
                class="cdss-view-btn ${viewMode === "matrix" ? "active" : ""}" 
                data-mode="matrix"
                title="Xem B\u1EA3ng Ma Tr\u1EADn L\xE2m S\xE0ng & ICD-10"
                aria-label="Xem B\u1EA3ng Ma Tr\u1EADn"
              >
                <i class="fa-solid fa-table-list"></i>
              </button>
            </div>
          </div>
        </section>

        <!-- Results Counter & Reset Action -->
        <div class="cdss-results-strip">
          <div>
            Hi\u1EC3n th\u1ECB <strong>${filtered.length}</strong> / <strong>${CDSS_MODULES.length}</strong> c\xF4ng c\u1EE5 h\u1ED7 tr\u1EE3 quy\u1EBFt \u0111\u1ECBnh
            ${activeCategory !== "all" ? ` \u2022 Chuy\xEAn khoa: <em>${categories.find((c) => c.id === activeCategory)?.name}</em>` : ""}
            ${q ? ` \u2022 T\u1EEB kh\xF3a: "<em>${q}</em>"` : ""}
          </div>
          ${activeCategory !== "all" || q ? `
            <button id="cdss-reset-filters" class="cdss-reset-btn" title="\u0110\u1EB7t l\u1EA1i b\u1ED9 l\u1ECDc (Hi\u1EC3n th\u1ECB t\u1EA5t c\u1EA3)" aria-label="\u0110\u1EB7t l\u1EA1i b\u1ED9 l\u1ECDc">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
          ` : ""}
        </div>

        <!-- ================================================================
             4. MAIN WORKSPACE CONTENT (CARD GRID / GROUPED / MATRIX)
             ================================================================ -->
        ${filtered.length === 0 ? `
          <div style="text-align:center; padding: 4rem 1rem; background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: 20px;">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 2.5rem; color: var(--color-text-muted); opacity: 0.5; margin-bottom: 1rem;"></i>
            <h3 style="font-family: var(--cdss-font-display); font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">Kh\xF4ng t\xECm th\u1EA5y c\xF4ng c\u1EE5 CDSS ph\xF9 h\u1EE3p</h3>
            <p style="color: var(--color-text-muted); max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.9rem;">
              Th\u1EED t\xECm ki\u1EBFm v\u1EDBi t\xEAn thu\u1ED1c (Vancomycin, Meropenem), ch\u1EC9 s\u1ED1 l\xE2m s\xE0ng (R-ratio, FIB-4, SOFA, PaO2) ho\u1EB7c m\xE3 ICD-10.
            </p>
            <button id="cdss-empty-reset-btn" class="cdss-btn-teal">
              <i class="fa-solid fa-arrows-rotate"></i> Xem l\u1EA1i t\u1EA5t c\u1EA3 9 CDSS
            </button>
          </div>
        ` : ""}

        <!-- VIEW 1: MODERN GRID VIEW (DEFAULT - HepaCDSS Standard) -->
        ${viewMode === "grid" && filtered.length > 0 ? `
          <div class="cdss-cards-grid">
            ${filtered.map((m) => renderModuleCard(m)).join("")}
          </div>
        ` : ""}

        <!-- VIEW 2: GROUPED SPECIALTY VIEW -->
        ${viewMode === "grouped" && filtered.length > 0 ? `
          <div>
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
                    <span class="cdss-badge cdss-badge--teal">${groupModules.length} Modules</span>
                  </div>

                  <div class="cdss-cards-grid" style="margin-bottom:0;">
                    ${groupModules.map((m) => renderModuleCard(m)).join("")}
                  </div>
                </div>
              `;
      }).join("")}
          </div>
        ` : ""}

        <!-- VIEW 3: CLINICAL MATRIX TABLE VIEW -->
        ${viewMode === "matrix" && filtered.length > 0 ? `
          <div class="cdss-matrix-wrapper">
            <table class="cdss-matrix-table">
              <thead>
                <tr>
                  <th style="width: 25%;">C\xF4ng C\u1EE5 CDSS</th>
                  <th style="width: 14%;">Chuy\xEAn Khoa</th>
                  <th style="width: 32%;">N\u0103ng L\u1EF1c T\xEDnh To\xE1n &amp; Thu\u1EADt To\xE1n</th>
                  <th style="width: 17%;">C\u01A1 S\u1EDF Ph\xE1p L\xFD &amp; EBM</th>
                  <th style="width: 12%; text-align: right;">Kh\u1EDFi Ch\u1EA1y</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map((m) => `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:0.75rem;">
                        <div class="cdss-card-emblem cdss-emblem--${m.category}" style="width:36px; height:36px; font-size:1rem; border-radius:8px;">
                          <i class="${m.icon}"></i>
                        </div>
                        <div>
                          <a href="${m.standaloneUrl}" style="font-weight:700; color:var(--color-text); text-decoration:none;">
                            ${m.title}
                          </a>
                          ${m.titleEn ? `<div style="font-size:0.75rem; color:var(--color-text-muted); font-style:italic;">${m.titleEn}</div>` : ""}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="cdss-badge cdss-badge--teal">${m.categoryName}</span>
                    </td>
                    <td>
                      <p style="margin:0 0 0.5rem; font-size:0.82rem; color:var(--color-text-muted); line-height:1.5;">${m.shortDesc}</p>
                      ${m.features ? `
                        <div style="display:flex; flex-wrap:wrap; gap:0.3rem;">
                          ${m.features.slice(0, 3).map((f) => `<span class="cdss-feature-chip">${f}</span>`).join("")}
                        </div>
                      ` : ""}
                    </td>
                    <td>
                      <div style="font-size:0.78rem; color:var(--color-text-muted); line-height:1.5;">
                        <i class="fa-solid fa-book-medical text-teal-600"></i> ${m.guidelineSource}
                      </div>
                      ${m.icd10 && m.icd10.length > 0 ? `
                        <div style="margin-top:0.35rem; font-size:0.72rem; color:var(--color-text-muted);">
                          ICD-10: ${m.icd10.slice(0, 3).map((c) => `<span class="cdss-icd-pill">${c}</span>`).join("")}
                        </div>
                      ` : ""}
                    </td>
                    <td style="text-align: right;">
                      <a href="${m.standaloneUrl}" class="cdss-launch-link" style="padding:0.35rem 0.75rem; font-size:0.78rem;">
                        <span>M\u1EDF</span> <i class="fa-solid fa-arrow-right"></i>
                      </a>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : ""}

        <!-- ================================================================
             5. CLINICAL PRACTICE STANDARDS ACCORDION & EBM FOOTER
             ================================================================ -->
        <section class="cdss-ebm-footer-card">
          <div class="cdss-ebm-top-row">
            <div class="cdss-ebm-head">
              <i class="fa-solid fa-shield-halved"></i>
              <span>Ti\xEAu Chu\u1EA9n Th\u1EF1c H\xE0nh L\xE2m S\xE0ng &amp; C\u01A1 S\u1EDF Ph\xE1p L\xFD Y Khoa</span>
            </div>
            <span class="cdss-badge cdss-badge--emerald">
              <i class="fa-solid fa-check"></i> Tu\xE2n th\u1EE7 H\u01B0\u1EDBng D\u1EABn B\u1ED9 Y T\u1EBF &amp; Qu\u1ED1c T\u1EBF
            </span>
          </div>

          <div class="cdss-ebm-columns">
            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-certificate"></i>
                <span>B\u1ED9 Y T\u1EBF Vi\u1EC7t Nam</span>
              </h4>
              <p>
                Tu\xE2n th\u1EE7 Quy\u1EBFt \u0111\u1ECBnh 2760/Q\u0110-BYT (Ph\xE1c \u0111\u1ED3 SXHD Dengue), Quy\u1EBFt \u0111\u1ECBnh 5631/Q\u0110-BYT (S\u1EED d\u1EE5ng kh\xE1ng sinh), H\u01B0\u1EDBng d\u1EABn B\u1EC7nh vi\u1EC7n B\u1EC7nh Nhi\u1EC7t \u0110\u1EDBi eMed 2026 v\xE0 BV\u0110K C\xE0 Mau.
              </p>
            </div>

            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-globe"></i>
                <span>Khuy\u1EBFn C\xE1o Qu\u1ED1c T\u1EBF (EBM)</span>
              </h4>
              <p>
                NICE NG253 (2024/2026), Surviving Sepsis Campaign (SSC), Phoenix Sepsis Criteria 2024, ASHP/IDSA 2020 (Vancomycin AUC/MIC), ADA Standards of Care 2026 v\xE0 ACG 2017 (Men gan).
              </p>
            </div>

            <div class="cdss-ebm-col">
              <h4 class="cdss-ebm-col-title">
                <i class="fa-solid fa-laptop-medical"></i>
                <span>\u0110\u1ED9c L\u1EADp &amp; An To\xE0n D\u1EEF Li\u1EC7u</span>
              </h4>
              <p>
                To\xE0n b\u1ED9 thu\u1EADt to\xE1n ch\u1EA1y client-side 100% kh\xF4ng g\u1EEDi d\u1EEF li\u1EC7u ng\u01B0\u1EDDi b\u1EC7nh l\xEAn m\xE1y ch\u1EE7 b\xEAn ngo\xE0i, \u0111\u1EA3m b\u1EA3o an to\xE0n b\xED m\u1EADt y khoa v\xE0 s\u1EB5n s\xE0ng s\u1EED d\u1EE5ng t\u1EA1i bu\u1ED3ng b\u1EC7nh n\u1ED9i tr\xFA ho\u1EB7c khoa ICU.
              </p>
            </div>
          </div>
        </section>

      </div>
    `;
      function renderModuleCard(m) {
        return `
        <article class="cdss-module-card" data-slug="${m.slug}">
          <!-- Top Row: Badges & Emblem -->
          <div class="cdss-card-top-row">
            <div class="cdss-card-badges-wrap">
              <span class="cdss-badge cdss-badge--teal">${m.categoryName}</span>
              ${m.badge ? `<span class="cdss-badge cdss-badge--emerald">${m.badge}</span>` : ""}
            </div>

            <div class="cdss-card-emblem cdss-emblem--${m.category}">
              <i class="${m.icon}"></i>
            </div>
          </div>

          <!-- Title & Subtitle -->
          <div class="cdss-card-title-group">
            <h3 class="cdss-card-title">
              <a href="${m.standaloneUrl}">${m.title}</a>
            </h3>
            ${m.titleEn ? `<p class="cdss-card-title-en">${m.titleEn}</p>` : ""}
          </div>

          <!-- Description -->
          <p class="cdss-card-desc">${m.shortDesc}</p>

          <!-- Core Clinical Features Chips (HepaCDSS Style) -->
          ${m.features && m.features.length > 0 ? `
            <div class="cdss-feature-chips">
              ${m.features.map((f) => `<span class="cdss-feature-chip">${f}</span>`).join("")}
            </div>
          ` : ""}

          <!-- Evidence & ICD-10 Metadata Box -->
          <div class="cdss-evidence-box">
            <div class="cdss-evidence-row">
              <i class="fa-solid fa-book-medical"></i>
              <span title="${m.guidelineSource}">${m.guidelineSource}</span>
            </div>
            ${m.icd10 && m.icd10.length > 0 ? `
              <div class="cdss-evidence-row">
                <i class="fa-solid fa-barcode" style="color:var(--color-text-muted);"></i>
                <span>M\xE3 ICD-10: ${m.icd10.slice(0, 4).map((c) => `<span class="cdss-icd-pill">${c}</span>`).join("")}</span>
              </div>
            ` : ""}
          </div>

          <!-- Action Footer -->
          <div class="cdss-card-footer">
            <span class="cdss-card-version">${m.version}</span>
            <a href="${m.standaloneUrl}" class="cdss-launch-link">
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
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        const input = document.getElementById("cdss-search-input");
        if (input) {
          input.focus();
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
