(() => {
  // ../CDSS_Standalone/src/cdss-registry.ts
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
      version: "2.0.0",
      updatedAt: "2026-09-08",
      author: "CliniPortal HepaCDSS Squad & ACG Guidelines",
      guidelineSource: "ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries (Am J Gastroenterol 2017)",
      icd10: ["K71", "K72", "K73", "K74", "K76", "B18"],
      icon: "fa-solid fa-virus",
      badge: "ACG & WHO Standard",
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

  // ../CDSS_Standalone/src/index.ts
  function initCDSSHub(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let activeCategory = "all";
    let searchQuery = "";
    const categories = [
      { id: "all", name: "T\u1EA5t C\u1EA3 9 CDSS", icon: "fa-solid fa-shapes" },
      { id: "resuscitation", name: "H\u1ED3i S\u1EE9c C\u1EA5p C\u1EE9u", icon: "fa-solid fa-biohazard" },
      { id: "cardiology", name: "Tim M\u1EA1ch", icon: "fa-solid fa-heart-pulse" },
      { id: "respiratory", name: "H\xF4 H\u1EA5p (ABG)", icon: "fa-solid fa-lungs" },
      { id: "pharmacology", name: "Kh\xE1ng Sinh & D\u01B0\u1EE3c L\xFD", icon: "fa-solid fa-viruses" },
      { id: "gastroenterology", name: "Ti\xEAu H\xF3a & Gan", icon: "fa-solid fa-virus" },
      { id: "endocrinology", name: "N\u1ED9i Ti\u1EBFt & Insulin", icon: "fa-solid fa-syringe" },
      { id: "internal", name: "N\u1ED9i Khoa Kh\xE1m B\u1EC7nh", icon: "fa-solid fa-stethoscope" }
    ];
    function render() {
      const filtered = CDSS_MODULES.filter((m) => {
        const matchCat = activeCategory === "all" || m.category === activeCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchSearch = !q || m.title.toLowerCase().includes(q) || m.titleEn && m.titleEn.toLowerCase().includes(q) || m.shortDesc.toLowerCase().includes(q) || m.guidelineSource.toLowerCase().includes(q) || m.icd10 && m.icd10.some((c) => c.toLowerCase().includes(q));
        return matchCat && matchSearch;
      });
      container.innerHTML = `
      <div class="cdss-hub-container">
        <!-- Hero Banner -->
        <section class="cdss-hub-hero">
          <div class="cdss-hero-tag">
            <i class="fa-solid fa-microchip"></i> N\u1EC1n T\u1EA3ng H\u1ED7 Tr\u1EE3 Quy\u1EBFt \u0110\u1ECBnh L\xE2m S\xE0ng \u0110\u1ED9c L\u1EADp
          </div>
          <h1 class="cdss-hero-title">
            B\u1ED9 C\xF4ng C\u1EE5 CDSS L\xE2m S\xE0ng Chuy\xEAn S\xE2u
          </h1>
          <p class="cdss-hero-subtitle">
            H\u1EC7 sinh th\xE1i 9 c\xF4ng c\u1EE5 thu\u1EADt to\xE1n t\xEDnh to\xE1n li\u1EC1u l\u01B0\u1EE3ng, ph\xE2n t\u1EA7ng nguy c\u01A1 s\u1ED1c, ph\xE2n t\xEDch \u0111i\u1EC7n tim, kh\xED m\xE1u \u0111\u1ED9ng m\u1EA1ch v\xE0 h\u1ED7 tr\u1EE3 ra quy\u1EBFt \u0111\u1ECBnh \u0111i\u1EC1u tr\u1ECB t\u1EA1i gi\u01B0\u1EDDng b\u1EC7nh (Bedside Clinical Decision Support System).
          </p>

          <!-- Search Bar -->
          <div style="max-width: 640px; margin: 1.75rem auto 0; position: relative;">
            <div style="position: relative; display: flex; align-items: center;">
              <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1.1rem; color: var(--color-text-muted); font-size: 1rem;"></i>
              <input 
                id="cdss-search-input" 
                type="text" 
                placeholder="T\xECm ki\u1EBFm c\xF4ng c\u1EE5 theo t\xEAn, b\u1EC7nh l\xFD, guideline, ICD-10..." 
                value="${searchQuery}"
                style="width: 100%; padding: 0.85rem 1.2rem 0.85rem 2.85rem; border-radius: 9999px; border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); font-size: 0.92rem; outline: none; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: border-color 0.2s;"
              />
              ${searchQuery ? `
                <button id="cdss-clear-search" style="position: absolute; right: 1rem; border: none; background: transparent; color: var(--color-text-muted); cursor: pointer; font-size: 0.9rem;">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              ` : ""}
            </div>
          </div>
        </section>

        <!-- Category Filter Tabs -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin: 1.5rem 0 2.5rem; padding: 0 1rem;">
          ${categories.map((cat) => `
            <button 
              class="cdss-filter-tab ${activeCategory === cat.id ? "active" : ""}" 
              data-cat="${cat.id}"
              style="padding: 0.5rem 1rem; border-radius: 9999px; border: 1px solid ${activeCategory === cat.id ? "var(--color-primary)" : "var(--color-border)"}; background: ${activeCategory === cat.id ? "var(--color-primary)" : "var(--color-surface)"}; color: ${activeCategory === cat.id ? "#fff" : "var(--color-text)"}; font-size: 0.82rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; transition: all 0.2s;"
            >
              <i class="${cat.icon}"></i> ${cat.name}
            </button>
          `).join("")}
        </div>

        <!-- Grid of CDSS Modules -->
        <section class="cdss-hub-modules-section">
          <div class="cdss-modules-header">
            <h2 class="cdss-section-heading">
              <i class="fa-solid fa-shapes"></i> Danh S\xE1ch 9 C\xF4ng C\u1EE5 L\xE2m S\xE0ng
            </h2>
            <span class="cdss-module-count">${filtered.length} / ${CDSS_MODULES.length} modules</span>
          </div>

          ${filtered.length === 0 ? `
            <div style="text-align: center; padding: 4rem 1rem; color: var(--color-text-muted);">
              <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
              <p style="font-size: 1.1rem; font-weight: 600;">Kh\xF4ng t\xECm th\u1EA5y c\xF4ng c\u1EE5 CDSS ph\xF9 h\u1EE3p</p>
              <p style="font-size: 0.9rem;">Th\u1EED t\xECm ki\u1EBFm v\u1EDBi t\u1EEB kh\xF3a kh\xE1c ho\u1EB7c b\u1EA5m n\xFAt "T\u1EA5t C\u1EA3 9 CDSS".</p>
            </div>
          ` : `
            <div class="cdss-modules-grid">
              ${filtered.map((m) => `
                <div class="cdss-module-card cdss-module-card--${m.category}">
                  <div class="cdss-card-top">
                    <div class="cdss-card-icon-wrap">
                      <i class="${m.icon}"></i>
                    </div>
                    <div class="cdss-card-badges">
                      <span class="cdss-badge cdss-badge--category">${m.categoryName}</span>
                      ${m.badge ? `<span class="cdss-badge cdss-badge--highlight">${m.badge}</span>` : ""}
                    </div>
                  </div>

                  <h3 class="cdss-card-title">
                    <a href="${m.standaloneUrl}">${m.title}</a>
                  </h3>
                  ${m.titleEn ? `<p class="cdss-card-title-en">${m.titleEn}</p>` : ""}
                  
                  <p class="cdss-card-desc">${m.shortDesc}</p>

                  <div class="cdss-card-meta">
                    <div class="cdss-meta-item">
                      <i class="fa-solid fa-book-medical"></i> <span>${m.guidelineSource}</span>
                    </div>
                    ${m.icd10 && m.icd10.length > 0 ? `
                      <div class="cdss-meta-item">
                        <i class="fa-solid fa-barcode"></i> <span>ICD-10: ${m.icd10.join(", ")}</span>
                      </div>
                    ` : ""}
                  </div>

                  <div class="cdss-card-footer">
                    <span class="cdss-version-tag">Phi\xEAn b\u1EA3n ${m.version}</span>
                    <a href="${m.standaloneUrl}" class="cdss-open-btn">
                      <span>M\u1EDF CDSS</span> <i class="fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </section>
      </div>
    `;
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
      const tabs = container.querySelectorAll(".cdss-filter-tab");
      tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
          const cat = e.currentTarget.getAttribute("data-cat") || "all";
          activeCategory = cat;
          render();
        });
      });
    }
    render();
  }
  if (typeof window !== "undefined") {
    window.initCDSSHub = initCDSSHub;
    window.CDSS_MODULES = CDSS_MODULES;
    window.getCDSSModuleById = getCDSSModuleById;
    window.getCDSSModuleBySlug = getCDSSModuleBySlug;
  }
})();
