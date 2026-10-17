var DengueBundle = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // dengue/dengue-ui.ts
  var dengue_ui_exports = {};
  __export(dengue_ui_exports, {
    DengueCDSSController: () => DengueCDSSController
  });

  // dengue/dengue-data.ts
  var CDC_STANDARD_WEIGHT = {
    2: { male: 13, female: 12 },
    3: { male: 14, female: 14 },
    4: { male: 16, female: 16 },
    5: { male: 18, female: 18 },
    6: { male: 21, female: 20 },
    7: { male: 23, female: 23 },
    8: { male: 26, female: 26 },
    9: { male: 29, female: 29 },
    10: { male: 32, female: 33 },
    11: { male: 36, female: 37 },
    12: { male: 40, female: 42 },
    13: { male: 45, female: 46 },
    14: { male: 51, female: 49 },
    15: { male: 56, female: 52 },
    16: { male: 61, female: 54 }
  };
  function getCDCStandardWeight(age, gender) {
    if (age < 2) {
      return gender === "male" ? 10 : 9.5;
    }
    if (age > 16) {
      return gender === "male" ? 60 : 50;
    }
    const entry = CDC_STANDARD_WEIGHT[Math.round(age)];
    return entry ? entry[gender] : gender === "male" ? 30 : 30;
  }
  var ADULT_SHOCK_HEIGHTS = [
    145,
    147,
    149,
    151,
    153,
    155,
    157,
    159,
    161,
    163,
    165,
    167,
    169,
    171,
    173,
    175,
    177,
    179,
    181,
    183,
    185,
    187
  ];
  var ADULT_SHOCK_WEIGHTS = [
    45,
    47,
    49,
    51,
    53,
    55,
    57,
    59,
    61,
    63,
    65,
    67,
    69,
    71,
    73,
    75,
    77,
    79,
    81,
    83,
    85,
    87,
    89,
    91,
    93,
    95,
    97,
    99,
    101
  ];
  function getAdultShockCell(heightCm, weightKg, gender) {
    const heightM = heightCm / 100;
    const bmi = Math.round(weightKg / (heightM * heightM) * 10) / 10;
    const isAdjusted = bmi >= 25;
    const ibwRaw = gender === "male" ? 50 + 0.91 * (heightCm - 152.4) : 45.5 + 0.91 * (heightCm - 152.4);
    const ibw = Math.round(ibwRaw * 10) / 10;
    const adjBwRaw = ibwRaw + 0.4 * (weightKg - ibwRaw);
    const adjBw = Math.round(adjBwRaw * 10) / 10;
    const tableWeight = isAdjusted ? Math.round(Math.round(adjBwRaw * 10) / 10) : weightKg;
    return {
      bmi,
      isAdjusted,
      ibw,
      adjBw,
      tableWeight
    };
  }
  var DENGUE_FLUID_TEMPLATES = {
    // 1. Dấu hiệu cảnh báo
    warning_signs: {
      child: [
        {
          stageName: "C\u1EEF 1: B\xF9 d\u1ECBch ban \u0111\u1EA7u (Tr\u1EBB em)",
          defaultRateMlKgH: 6,
          rateOptions: [6, 7],
          defaultDurationHours: 2,
          durationOptions: [1, 2, 3],
          hctCheckRequired: true,
          notes: "\u0110o l\u1EA1i Hct sau 2 gi\u1EDD. N\u1EBFu Hct gi\u1EA3m v\xE0 l\xE2m s\xE0ng c\u1EA3i thi\u1EC7n -> chuy\u1EC3n C\u1EEF 2."
        },
        {
          stageName: "C\u1EEF 2: Gi\u1EA3m t\u1ED1c \u0111\u1ED9 b\u1EADc 1",
          defaultRateMlKgH: 5,
          rateOptions: [5],
          defaultDurationHours: 3,
          durationOptions: [2, 3, 4],
          hctCheckRequired: true,
          notes: "\u0110\xE1nh gi\xE1 sinh hi\u1EC7u, l\u01B0\u1EE3ng n\u01B0\u1EDBc ti\u1EC3u v\xE0 Hct tr\u01B0\u1EDBc khi quy\u1EBFt \u0111\u1ECBnh gi\u1EA3m ti\u1EBFp."
        },
        {
          stageName: "C\u1EEF 3: Gi\u1EA3m t\u1ED1c \u0111\u1ED9 b\u1EADc 2",
          defaultRateMlKgH: 3,
          rateOptions: [3],
          defaultDurationHours: 4,
          durationOptions: [3, 4, 5, 6],
          hctCheckRequired: false,
          notes: "Duy tr\xEC n\u01B0\u1EDBc ti\u1EC3u \u2265 1 ml/kg/h. Theo d\xF5i s\xE1t tri gi\xE1c."
        },
        {
          stageName: "C\u1EEF 4: Gi\u1EA3m t\u1ED1c \u0111\u1ED9 duy tr\xEC & Cai d\u1ECBch",
          defaultRateMlKgH: 1.5,
          rateOptions: [1.5],
          defaultDurationHours: 6,
          durationOptions: [4, 6, 8, 12, 18],
          hctCheckRequired: true,
          notes: "C\xE2n nh\u1EAFc ng\u01B0ng d\u1ECBch khi b\u1EC7nh nh\xE2n \u0103n u\u1ED1ng \u0111\u01B0\u1EE3c, m\u1EA1ch HA \u1ED5n \u0111\u1ECBnh, h\u1EBFt s\u1ED1t \u2265 48h."
        }
      ],
      adolescent: [
        {
          stageName: "C\u1EEF 1: Kh\u1EDFi \u0111\u1EA7u (Thi\u1EBFu ni\xEAn 13-15 tu\u1ED5i)",
          defaultRateMlKgH: 6,
          rateOptions: [6, 7],
          defaultDurationHours: 1,
          durationOptions: [1, 1.5, 2],
          hctCheckRequired: true,
          notes: "Th\u1EDDi gian m\u1ED7i n\u1EA5c t\u1ED1c \u0111\u1ED9 b\u1EB1ng 1/2 tr\u1EBB em nh\u1EB1m tr\xE1nh th\u1EEBa d\u1ECBch qu\xE1 t\u1EA3i."
        },
        {
          stageName: "C\u1EEF 2: Gi\u1EA3m t\u1ED1c \u0111\u1ED9 n\u1EA5c 1",
          defaultRateMlKgH: 5,
          rateOptions: [5],
          defaultDurationHours: 1.5,
          durationOptions: [1, 1.5, 2],
          hctCheckRequired: true,
          notes: "Ki\u1EC3m tra m\u1EA1ch, HA v\xE0 SpO2."
        },
        {
          stageName: "C\u1EEF 3: Gi\u1EA3m t\u1ED1c \u0111\u1ED9 n\u1EA5c 2",
          defaultRateMlKgH: 3,
          rateOptions: [3],
          defaultDurationHours: 2,
          durationOptions: [2, 3],
          hctCheckRequired: false,
          notes: "Theo d\xF5i n\u01B0\u1EDBc ti\u1EC3u, ph\xE1t hi\u1EC7n s\u1EDBm d\u1EA5u hi\u1EC7u t\xE1i s\u1ED1c."
        },
        {
          stageName: "C\u1EEF 4: Duy tr\xEC & Ng\u01B0ng d\u1ECBch",
          defaultRateMlKgH: 1.5,
          rateOptions: [1.5],
          defaultDurationHours: 4,
          durationOptions: [2, 4, 6],
          hctCheckRequired: true,
          notes: "H\u1EBFt s\u1ED1t, h\u1ED3i ph\u1EE5c th\u1EC3 t\xEDch n\u1ED9i m\u1EA1ch, cai truy\u1EC1n t\u0129nh m\u1EA1ch s\u1EDBm."
        }
      ],
      adult: [
        {
          stageName: "C\u1EEF 1: B\xF9 ban \u0111\u1EA7u (Ng\u01B0\u1EDDi l\u1EDBn \u2265 16 tu\u1ED5i)",
          defaultRateMlKgH: 6,
          rateOptions: [6],
          defaultDurationHours: 2,
          durationOptions: [1, 2, 3],
          hctCheckRequired: true,
          notes: "Theo d\xF5i Hct, SpO2 v\xE0 ti\u1EBFng th\u1EDF \u1EDF ph\u1ED5i (ran \u1EA9m \u0111\xE1y ph\u1ED5i)."
        },
        {
          stageName: "C\u1EEF 2: Gi\u1EA3m t\u1ED1c \u0111\u1ED9 b\u1EADc 1",
          defaultRateMlKgH: 3,
          rateOptions: [3],
          defaultDurationHours: 3,
          durationOptions: [2, 3, 4],
          hctCheckRequired: true,
          notes: "Theo d\xF5i \u0111\xE1p \u1EE9ng tri gi\xE1c v\xE0 n\u01B0\u1EDBc ti\u1EC3u."
        },
        {
          stageName: "C\u1EEF 3: Duy tr\xEC & Cai d\u1ECBch",
          defaultRateMlKgH: 1.5,
          rateOptions: [1.5],
          defaultDurationHours: 6,
          durationOptions: [6, 8, 12, 18],
          hctCheckRequired: true,
          notes: "Duy tr\xEC 1.5 ml/kg/h trong 6 - 18 gi\u1EDD (Ph\u1EE5 l\u1EE5c 6). Ng\u01B0ng d\u1ECBch sau 12 - 24 gi\u1EDD khi l\xE2m s\xE0ng \u1ED5n \u0111\u1ECBnh."
        }
      ]
    },
    // 2. Sốc SXHD (Còn bù)
    shock: {
      child: [
        {
          stageName: "C\u1EEF 1: T\u1EA3i d\u1ECBch ch\u1ED1ng s\u1ED1c gi\u1EDD \u0111\u1EA7u (20 ml/kg/h)",
          defaultRateMlKgH: 20,
          rateOptions: [15, 20],
          defaultDurationHours: 1,
          durationOptions: [1],
          hctCheckRequired: true,
          notes: "D\u1ECBch tinh th\u1EC3 Ringer Lactate/NaCl 0.9%. \u0110\xE1nh gi\xE1 l\u1EA1i m\u1EA1ch, HA v\xE0 Hct ngay sau 1 gi\u1EDD."
        },
        {
          stageName: "C\u1EEF 2: Ra s\u1ED1c - Gi\u1EA3m xu\u1ED1ng 10 ml/kg/h",
          defaultRateMlKgH: 10,
          rateOptions: [10],
          defaultDurationHours: 1,
          durationOptions: [1, 2],
          hctCheckRequired: true,
          notes: "N\u1EBFu kh\xF4ng ra s\u1ED1c ho\u1EB7c Hct t\u0103ng cao -> h\u1ED9i ch\u1EA9n \u0111\u1ED5i Cao ph\xE2n t\u1EED."
        },
        {
          stageName: "C\u1EEF 3: Ti\u1EBFp t\u1EE5c gi\u1EA3m xu\u1ED1ng 7.5 ml/kg/h",
          defaultRateMlKgH: 7.5,
          rateOptions: [7.5],
          defaultDurationHours: 2,
          durationOptions: [1, 2],
          hctCheckRequired: false,
          notes: "Duy tr\xEC t\u01B0 th\u1EBF n\u1EB1m ngang, \u1EE7 \u1EA5m."
        },
        {
          stageName: "C\u1EEF 4: Gi\u1EA3m xu\u1ED1ng 5 ml/kg/h",
          defaultRateMlKgH: 5,
          rateOptions: [5],
          defaultDurationHours: 4,
          durationOptions: [2, 4],
          hctCheckRequired: true,
          notes: "Ki\u1EC3m tra Hct m\u1ED7i 2-4h."
        },
        {
          stageName: "C\u1EEF 5: Gi\u1EA3m xu\u1ED1ng 3 ml/kg/h",
          defaultRateMlKgH: 3,
          rateOptions: [3],
          defaultDurationHours: 4,
          durationOptions: [3, 4, 6],
          hctCheckRequired: false,
          notes: "Duy tr\xEC n\u01B0\u1EDBc ti\u1EC3u \u2265 0.5 - 1 ml/kg/h."
        },
        {
          stageName: "C\u1EEF 6: Duy tr\xEC 1.5 ml/kg/h & Cai d\u1ECBch",
          defaultRateMlKgH: 1.5,
          rateOptions: [1.5],
          defaultDurationHours: 6,
          durationOptions: [4, 6, 8, 12],
          hctCheckRequired: true,
          notes: "T\u1ED5ng th\u1EDDi gian truy\u1EC1n d\u1ECBch ch\u1ED1ng s\u1ED1c th\u01B0\u1EDDng kh\xF4ng qu\xE1 24 - 48 gi\u1EDD."
        }
      ],
      adolescent: [
        {
          stageName: "C\u1EEF 1: T\u1EA3i nhanh ch\u1ED1ng s\u1ED1c gi\u1EDD \u0111\u1EA7u (20 ml/kg/h)",
          defaultRateMlKgH: 20,
          rateOptions: [20],
          defaultDurationHours: 1,
          durationOptions: [1],
          hctCheckRequired: true,
          notes: "D\u1ECBch tinh th\u1EC3 RL ho\u1EB7c NaCl 0.9% 20 ml/kg/h trong 1 gi\u1EDD (Ph\u1EE5 l\u1EE5c 11). \u0110\xE1nh gi\xE1 l\u1EA1i m\u1EA1ch, HA v\xE0 Hct."
        },
        {
          stageName: "C\u1EEF 2: Ra s\u1ED1c - Gi\u1EA3m xu\u1ED1ng 10 ml/kg/h",
          defaultRateMlKgH: 10,
          rateOptions: [10],
          defaultDurationHours: 1,
          durationOptions: [1],
          hctCheckRequired: true,
          notes: "Th\u1EDDi gian gi\u1EA3m n\u1EA5c b\u1EB1ng 1/2 tr\u1EBB nh\u1ECF nh\u1EB1m tr\xE1nh qu\xE1 t\u1EA3i d\u1ECBch. N\u1EBFu \u1ED5n \u0111\u1ECBnh chuy\u1EC3n C\u1EEF 3."
        },
        {
          stageName: "C\u1EEF 3: Gi\u1EA3m xu\u1ED1ng 7.5 ml/kg/h",
          defaultRateMlKgH: 7.5,
          rateOptions: [7.5],
          defaultDurationHours: 1,
          durationOptions: [1],
          hctCheckRequired: false,
          notes: "Truy\u1EC1n 7.5 ml/kg/h trong 1 gi\u1EDD theo Ph\u1EE5 l\u1EE5c 11 Q\u0110 2760/BYT."
        },
        {
          stageName: "C\u1EEF 4: Gi\u1EA3m xu\u1ED1ng 5 ml/kg/h",
          defaultRateMlKgH: 5,
          rateOptions: [5],
          defaultDurationHours: 1,
          durationOptions: [1, 2],
          hctCheckRequired: true,
          notes: "\u0110o l\u1EA1i Hct v\xE0 ki\u1EC3m tra sinh hi\u1EC7u tr\u01B0\u1EDBc khi gi\u1EA3m ti\u1EBFp."
        },
        {
          stageName: "C\u1EEF 5: Gi\u1EA3m xu\u1ED1ng 3 ml/kg/h",
          defaultRateMlKgH: 3,
          rateOptions: [3],
          defaultDurationHours: 4,
          durationOptions: [4, 5, 6],
          hctCheckRequired: false,
          notes: "Duy tr\xEC n\u01B0\u1EDBc ti\u1EC3u \u2265 0.5 ml/kg/h trong 4 - 6 gi\u1EDD."
        },
        {
          stageName: "C\u1EEF 6: Duy tr\xEC 1.5 ml/kg/h & Cai d\u1ECBch",
          defaultRateMlKgH: 1.5,
          rateOptions: [1.5],
          defaultDurationHours: 12,
          durationOptions: [12, 14, 18],
          hctCheckRequired: true,
          notes: "Duy tr\xEC 1.5 ml/kg/h trong 12 - 18 gi\u1EDD. Ng\u01B0ng d\u1ECBch sau 24 gi\u1EDD khi ra s\u1ED1c ho\xE0n to\xE0n."
        }
      ],
      adult: [
        {
          stageName: "C\u1EEF 1: T\u1EA3i d\u1ECBch ch\u1ED1ng s\u1ED1c ng\u01B0\u1EDDi l\u1EDBn (15 ml/kg/h)",
          defaultRateMlKgH: 15,
          rateOptions: [15],
          defaultDurationHours: 1,
          durationOptions: [1],
          hctCheckRequired: true,
          notes: "B\xF9 d\u1ECBch tinh th\u1EC3 RL/NaCl 0.9% 15 ml/kg/h x 1h. \u0110o Hct v\xE0 sinh hi\u1EC7u ngay k\u1EBFt th\xFAc 1 gi\u1EDD (Ph\u1EE5 l\u1EE5c 16.1)."
        },
        {
          stageName: "C\u1EEF 2: Ra s\u1ED1c - Ti\u1EBFp t\u1EE5c 10 ml/kg/h trong 2 gi\u1EDD",
          defaultRateMlKgH: 10,
          rateOptions: [10],
          defaultDurationHours: 2,
          durationOptions: [1, 2],
          hctCheckRequired: true,
          notes: "Truy\u1EC1n 10 ml/kg/h trong 2 gi\u1EDD (Ph\u1EE5 l\u1EE5c 16.1). N\u1EBFu kh\xF4ng c\u1EA3i thi\u1EC7n ho\u1EB7c Hct t\u0103ng: \u0111\u1ED5i Cao ph\xE2n t\u1EED 10 - 15 ml/kg/h."
        },
        {
          stageName: "C\u1EEF 3: Gi\u1EA3m xu\u1ED1ng 6 ml/kg/h trong 2 gi\u1EDD",
          defaultRateMlKgH: 6,
          rateOptions: [6],
          defaultDurationHours: 2,
          durationOptions: [2, 3],
          hctCheckRequired: false,
          notes: "Chu\u1EA9n Q\u0110 2760/BYT: B\u1EADc gi\u1EA3m \u1EDF ng\u01B0\u1EDDi l\u1EDBn l\xE0 6 ml/kg/h x 2h (kh\xF4ng d\xF9ng n\u1EA5c 5 ml/kg/h). L\u1EAFng nghe ran \u0111\xE1y ph\u1ED5i."
        },
        {
          stageName: "C\u1EEF 4: Gi\u1EA3m xu\u1ED1ng 3 ml/kg/h trong 5 - 7 gi\u1EDD",
          defaultRateMlKgH: 3,
          rateOptions: [3],
          defaultDurationHours: 5,
          durationOptions: [5, 6, 7],
          hctCheckRequired: true,
          notes: "Truy\u1EC1n 3 ml/kg/h trong 5 - 7 gi\u1EDD. Ki\u1EC3m tra Hct v\xE0 n\u01B0\u1EDBc ti\u1EC3u (\u0111\xEDch \u2265 0.5 ml/kg/h)."
        },
        {
          stageName: "C\u1EEF 5: Duy tr\xEC 1.5 ml/kg/h trong 12 gi\u1EDD & Cai d\u1ECBch",
          defaultRateMlKgH: 1.5,
          rateOptions: [1.5],
          defaultDurationHours: 12,
          durationOptions: [6, 12, 18],
          hctCheckRequired: true,
          notes: "Duy tr\xEC 1.5 ml/kg/h trong 12 gi\u1EDD. Xem x\xE9t ng\u01B0ng d\u1ECBch sau 24 - 48 gi\u1EDD khi l\xE2m s\xE0ng \u1ED5n \u0111\u1ECBnh."
        }
      ]
    },
    // 3. Sốc SXHD Nặng / Nguy kịch (Mạch 0, HA 0)
    severe_shock: {
      child: [
        {
          stageName: "C\u1EEF 1: B\u01A1m tr\u1EF1c ti\u1EBFp t\u0129nh m\u1EA1ch 15-20 ml/kg trong 15 ph\xFAt",
          defaultRateMlKgH: 60,
          // Tương đương 15ml/kg trong 15 phút (0.25h)
          rateOptions: [60, 80],
          defaultDurationHours: 0.25,
          durationOptions: [0.25],
          hctCheckRequired: true,
          notes: "D\xF9ng b\u01A1m ti\xEAm ho\u1EB7c t\xFAi \xE9p truy\u1EC1n nhanh tr\u1EF1c ti\u1EBFp. L\u1EADp 2 \u0111\u01B0\u1EDDng truy\u1EC1n t\u0129nh m\u1EA1ch l\u1EDBn."
        },
        {
          stageName: "C\u1EEF 2: N\u1EBFu ra s\u1ED1c -> Gi\u1EA3m xu\u1ED1ng 10 ml/kg/h",
          defaultRateMlKgH: 10,
          rateOptions: [10],
          defaultDurationHours: 1,
          durationOptions: [1, 2],
          hctCheckRequired: true,
          notes: "N\u1EBFu KH\xD4NG ra s\u1ED1c ho\u1EB7c Hct t\u0103ng: \u0111\u1ED5i ngay sang D\u1ECBch Cao Ph\xE2n T\u1EED (Dextran 40/HES 200) 10-15 ml/kg/h."
        },
        {
          stageName: "C\u1EEF 3: Gi\u1EA3m xu\u1ED1ng 7.5 ml/kg/h",
          defaultRateMlKgH: 7.5,
          rateOptions: [7.5],
          defaultDurationHours: 2,
          durationOptions: [1, 2],
          hctCheckRequired: false,
          notes: "Theo d\xF5i li\xEAn t\u1EE5c SpO2, ECG, CVP n\u1EBFu c\xF3 ch\u1EC9 \u0111\u1ECBnh."
        },
        {
          stageName: "C\u1EEF 4: Gi\u1EA3m xu\u1ED1ng 5 ml/kg/h",
          defaultRateMlKgH: 5,
          rateOptions: [5],
          defaultDurationHours: 3,
          durationOptions: [2, 3, 4],
          hctCheckRequired: true,
          notes: "\u0110\xE1nh gi\xE1 d\u1EA5u hi\u1EC7u h\u1ED3i ph\u1EE5c t\u01B0\u1EDBi m\xE1u m\xF4."
        },
        {
          stageName: "C\u1EEF 5: Gi\u1EA3m 3 -> 1.5 ml/kg/h & Cai d\u1ECBch",
          defaultRateMlKgH: 3,
          rateOptions: [3],
          defaultDurationHours: 4,
          durationOptions: [3, 4],
          hctCheckRequired: true,
          notes: "Chuy\u1EC3n d\u1EA7n sang duy tr\xEC 1.5 ml/kg/h khi huy\u1EBFt \u0111\u1ED9ng ho\xE0n to\xE0n \u1ED5n \u0111\u1ECBnh."
        }
      ],
      adolescent: [
        {
          stageName: "C\u1EEF 1: B\u01A1m tr\u1EF1c ti\u1EBFp t\u0129nh m\u1EA1ch 15-20 ml/kg trong 15 ph\xFAt",
          defaultRateMlKgH: 60,
          rateOptions: [60, 80],
          defaultDurationHours: 0.25,
          durationOptions: [0.25],
          hctCheckRequired: true,
          notes: "Kh\u1EA9n tr\u01B0\u01A1ng l\u1EADp \u0111\u01B0\u1EDDng truy\u1EC1n l\u1EDBn, \u0111o Hct t\u1EA1i gi\u01B0\u1EDDng."
        },
        {
          stageName: "C\u1EEF 2: D\u1ECBch tinh th\u1EC3 ho\u1EB7c Cao ph\xE2n t\u1EED 10 ml/kg/h",
          defaultRateMlKgH: 10,
          rateOptions: [10],
          defaultDurationHours: 1,
          durationOptions: [1],
          hctCheckRequired: true,
          notes: "\u0110\xE1nh gi\xE1 \u0111\xE1p \u1EE9ng sau 1 gi\u1EDD."
        },
        {
          stageName: "C\u1EEF 3: Gi\u1EA3m xu\u1ED1ng 5 ml/kg/h",
          defaultRateMlKgH: 5,
          rateOptions: [5],
          defaultDurationHours: 2,
          durationOptions: [1, 2],
          hctCheckRequired: false,
          notes: "Theo d\xF5i s\xE1t n\u01B0\u1EDBc ti\u1EC3u v\xE0 \xE1p l\u1EF1c t\u0129nh m\u1EA1ch trung t\xE2m."
        },
        {
          stageName: "C\u1EEF 4: Duy tr\xEC 3 -> 1.5 ml/kg/h",
          defaultRateMlKgH: 3,
          rateOptions: [3],
          defaultDurationHours: 3,
          durationOptions: [2, 3],
          hctCheckRequired: true,
          notes: "Cai d\u1ECBch s\u1EDBm, tr\xE1nh qu\xE1 t\u1EA3i t\xE1i h\u1EA5p thu."
        }
      ],
      adult: [
        {
          stageName: "C\u1EEF 1: B\u01A1m tr\u1EF1c ti\u1EBFp 15 ml/kg trong 15 ph\xFAt",
          defaultRateMlKgH: 60,
          rateOptions: [60],
          defaultDurationHours: 0.25,
          durationOptions: [0.25],
          hctCheckRequired: true,
          notes: "Kh\u1EA9n tr\u01B0\u01A1ng truy\u1EC1n nhanh RL ho\u1EB7c NaCl 0.9% 15 ml/kg trong 15 ph\xFAt qua kim l\u1EDBn 18G ho\u1EB7c t\xFAi \xE9p (Ph\u1EE5 l\u1EE5c 16.2)."
        },
        {
          stageName: "C\u1EEF 2: Ti\u1EBFp n\u1ED1i ngay Cao Ph\xE2n T\u1EED 15 ml/kg/h trong 1 gi\u1EDD",
          defaultRateMlKgH: 15,
          rateOptions: [15],
          defaultDurationHours: 1,
          durationOptions: [1],
          hctCheckRequired: true,
          notes: "Chu\u1EA9n Q\u0110 2760: B\u1EAFt bu\u1ED9c chuy\u1EC3n sang CPT (Dextran 40 / HES 200) 15 ml/kg/h x 1h ngay sau c\u1EEF b\u01A1m. \u0110o l\u1EA1i Hct v\xE0 sinh hi\u1EC7u."
        },
        {
          stageName: "C\u1EEF 3: Ra s\u1ED1c -> Chuy\u1EC3n \u0111i\u1EC7n gi\u1EA3i 15 ml/kg/h trong 1 gi\u1EDD",
          defaultRateMlKgH: 15,
          rateOptions: [15],
          defaultDurationHours: 1,
          durationOptions: [1],
          hctCheckRequired: true,
          notes: "N\u1EBFu c\u1EA3i thi\u1EC7n l\xE2m s\xE0ng (m\u1EA1ch r\xF5, HA b\xECnh th\u01B0\u1EDDng): chuy\u1EC3n RL/NaCl 0.9% 15 ml/kg/h x 1h. N\u1EBFu kh\xF4ng c\u1EA3i thi\u1EC7n: ti\u1EBFp t\u1EE5c CPT 15 ml/kg/h x 1h."
        },
        {
          stageName: "C\u1EEF 4: Gi\u1EA3m xu\u1ED1ng \u0111i\u1EC7n gi\u1EA3i 10 ml/kg/h trong 2 gi\u1EDD",
          defaultRateMlKgH: 10,
          rateOptions: [10],
          defaultDurationHours: 2,
          durationOptions: [1, 2],
          hctCheckRequired: true,
          notes: "\u0110\xE1nh gi\xE1 m\u1EA1ch, huy\u1EBFt \xE1p, n\u01B0\u1EDBc ti\u1EC3u v\xE0 ran ph\u1ED5i."
        },
        {
          stageName: "C\u1EEF 5: Gi\u1EA3m xu\u1ED1ng 6 ml/kg/h trong 2 gi\u1EDD",
          defaultRateMlKgH: 6,
          rateOptions: [6],
          defaultDurationHours: 2,
          durationOptions: [2],
          hctCheckRequired: false,
          notes: "Kh\xE1m \u0111\xE1y ph\u1ED5i, \u0111\u1EC1 ph\xF2ng ph\xF9 ph\u1ED5i c\u1EA5p."
        },
        {
          stageName: "C\u1EEF 6: Gi\u1EA3m xu\u1ED1ng 3 ml/kg/h trong 5 - 7 gi\u1EDD",
          defaultRateMlKgH: 3,
          rateOptions: [3],
          defaultDurationHours: 5,
          durationOptions: [5, 6, 7],
          hctCheckRequired: true,
          notes: "Ki\u1EC3m tra Hct v\xE0 b\xE0i ti\u1EBFt n\u01B0\u1EDBc ti\u1EC3u."
        },
        {
          stageName: "C\u1EEF 7: Duy tr\xEC 1.5 ml/kg/h trong 12 gi\u1EDD & Cai d\u1ECBch",
          defaultRateMlKgH: 1.5,
          rateOptions: [1.5],
          defaultDurationHours: 12,
          durationOptions: [6, 12, 18],
          hctCheckRequired: true,
          notes: "Duy tr\xEC v\xE0 chu\u1EA9n b\u1ECB ng\u01B0ng d\u1ECBch an to\xE0n sau 24 - 48 gi\u1EDD."
        }
      ]
    }
  };
  var DENGUE_NURSING_CHECKLIST = [
    "\u0110o sinh hi\u1EC7u (M\u1EA1ch, HA, Nh\u1ECBp th\u1EDF, SpO2) v\xE0 ki\u1EC3m tra tri gi\xE1c tr\u01B0\u1EDBc m\u1ED7i l\u1EA7n gi\u1EA3m t\u1ED1c \u0111\u1ED9 truy\u1EC1n.",
    "\u0110o Hct t\u1EA1i gi\u01B0\u1EDDng tr\u01B0\u1EDBc v\xE0 sau m\u1ED7i \u0111\u1EE3t t\u0103ng/gi\u1EA3m t\u1ED1c \u0111\u1ED9 d\u1ECBch ho\u1EB7c khi b\u1EC7nh nh\xE2n b\u1EE9t r\u1EE9t, v\xE3 m\u1ED3 h\xF4i, chi l\u1EA1nh.",
    "\u0110\u1EB7t sonde ti\u1EC3u theo d\xF5i l\u01B0\u1EE3ng n\u01B0\u1EDBc ti\u1EC3u m\u1ED7i gi\u1EDD \u1EDF b\u1EC7nh nh\xE2n s\u1ED1c; b\xE1o b\xE1c s\u0129 ngay n\u1EBFu n\u01B0\u1EDBc ti\u1EC3u < 0.5 ml/kg/h.",
    "Ki\u1EC3m tra \u0111\u1ECBnh k\u1EF3 d\u1ECBch d\u01B0 trong chai tr\u01B0\u1EDBc khi treo th\xEAm chai m\u1EDBi; ghi r\xF5 s\u1ED1 ml d\u1ECBch hi\u1EC7n t\u1EA1i v\xE0o h\u1ED3 s\u01A1.",
    "L\u1EAFng nghe ph\u1ED5i t\xECm ran \u1EA9m, ph\xE1t hi\u1EC7n s\u1EDBm ph\xF9 ph\u1ED5i c\u1EA5p (kh\xF3 th\u1EDF, b\u1ECDt h\u1ED3ng, SpO2 t\u1EE5t, gan to nhanh \u0111au t\u1EE9c).",
    "Tuy\u1EC7t \u0111\u1ED1i c\u1EA5m ti\xEAm b\u1EAFp, d\xF9ng Aspirin, Ibuprofen v\xE0 c\xE1c thu\u1ED1c NSAIDs.",
    'B\xE0n giao c\u1EEF r\xF5 r\xE0ng: D\xF9ng n\xFAt "Sao Ch\xE9p B\u1EA3ng B\xE0n Giao C\u1EEF" tr\xEAn CDSS \u0111\u1EC3 d\xE1n v\xE0o phi\u1EBFu theo d\xF5i giao ban.'
  ];
  var DENGUE_REFRACTORY_SCENARIOS = {
    // 1. Không đáp ứng + Hct cao ≥ 40% (Thất thoát huyết tương ồ ạt)
    hct_high_cpt: {
      id: "hct_high_cpt",
      code: "CPT_ESCALATION",
      name: "Kh\xF4ng \u0110\xE1p \u1EE8ng + Hct C\xF2n Cao \u2265 40% (Th\u1EA5t Tho\xE1t Huy\u1EBFt T\u01B0\u01A1ng Ti\u1EBFn Tri\u1EC3n)",
      tag: "Chuy\u1EC3n Cao Ph\xE2n T\u1EED",
      badgeClass: "danger",
      triggerCriteria: "Sau b\xF9 d\u1ECBch tinh th\u1EC3 gi\u1EDD \u0111\u1EA7u nh\u01B0ng m\u1EA1ch c\xF2n nhanh nh\u1ECF, HA c\xF2n k\u1EB9t \u2264 20 mmHg ho\u1EB7c t\u1EE5t, Hct \u2265 40% ho\u1EB7c kh\xF4ng gi\u1EA3m.",
      mechanism: "Th\u1EA5t tho\xE1t huy\u1EBFt t\u01B0\u01A1ng n\u1EB7ng qua h\xE0ng r\xE0o n\u1ED9i m\xF4 mao m\u1EA1ch; d\u1ECBch tinh th\u1EC3 nhanh ch\xF3ng tho\xE1t ra khoang th\u1EE9 ba g\xE2y \u1EE9 d\u1ECBch m\xE0ng b\u1EE5ng/m\xE0ng ph\u1ED5i m\xE0 kh\xF4ng gi\u1EEF \u0111\u01B0\u1EE3c th\u1EC3 t\xEDch n\u1ED9i m\u1EA1ch.",
      primaryAction: "Chuy\u1EC3n sang dung d\u1ECBch Cao Ph\xE2n T\u1EED (Dextran 40, Dextran 70 ho\u1EB7c 6% HES 200). Tr\u1EBB em: 10 - 20 ml/kg/h x 1h; Ng\u01B0\u1EDDi l\u1EDBn: 10 - 15 ml/kg/h x 1h.",
      keyOrders: [
        "Tr\u1EBB em: Cao ph\xE2n t\u1EED (Dextran 40 / 6% HES 200) 10 - 20 ml/kg/h truy\u1EC1n t\u0129nh m\u1EA1ch trong 1 gi\u1EDD. N\u1EBFu c\u1EA3i thi\u1EC7n -> gi\u1EA3m d\u1EA7n 10 -> 7.5 -> 5 ml/kg/h.",
        "Ng\u01B0\u1EDDi l\u1EDBn: Cao ph\xE2n t\u1EED 10 - 15 ml/kg/h truy\u1EC1n t\u0129nh m\u1EA1ch trong 1 gi\u1EDD. N\u1EBFu c\u1EA3i thi\u1EC7n -> chuy\u1EC3n \u0111i\u1EC7n gi\u1EA3i RL/NaCl 0.9% 10 -> 6 -> 3 -> 1.5 ml/kg/h.",
        "N\u1EBFu kh\xF4ng c\u1EA3i thi\u1EC7n l\xE2m s\xE0ng sau CPT l\u1EA7n 1: L\u1EB7p l\u1EA1i CPT 10 - 20 ml/kg/h (tr\u1EBB em) ho\u1EB7c 10 ml/kg/h (ng\u01B0\u1EDDi l\u1EDBn) trong 1 gi\u1EDD.",
        "N\u1EBFu v\u1EABn kh\xF4ng ra s\u1ED1c sau 2 l\u1EA7n CPT: K\xEDch ho\u1EA1t ngay L\u01B0u \u0111\u1ED3 S\u1ED1c Th\u1EA5t B\u1EA1i B\xF9 D\u1ECBch (Ph\u1EE5 l\u1EE5c 18)."
      ],
      monitoringSteps: [
        "\u0110o l\u1EA1i Hct t\u1EA1i gi\u01B0\u1EDDng sau m\u1ED7i gi\u1EDD truy\u1EC1n CPT.",
        "Theo d\xF5i sinh hi\u1EC7u (M\u1EA1ch, HA, SpO2) m\u1ED7i 15 - 30 ph\xFAt.",
        "Ghi nh\u1EADn l\u01B0\u1EE3ng n\u01B0\u1EDBc ti\u1EC3u m\u1ED7i gi\u1EDD (\u0111\xEDch \u2265 0.5 - 1 ml/kg/h).",
        "C\u1EA3nh b\xE1o gi\u1EDBi h\u1EA1n t\u1ED5ng li\u1EC1u CPT: Kh\xF4ng v\u01B0\u1EE3t qu\xE1 60 ml/kg \u0111\u1EC3 tr\xE1nh suy th\u1EADn c\u1EA5p v\xE0 r\u1ED1i lo\u1EA1n \u0111\xF4ng m\xE1u."
      ],
      precautions: [
        "Khi t\u1ED5ng li\u1EC1u CPT \u2265 60 ml/kg m\xE0 c\xF2n s\u1ED1c: H\u1ED9i ch\u1EA9n chuy\u1EC3n sang truy\u1EC1n Albumin 5% ho\u1EB7c 10% (trang 20 Q\u0110 2760).",
        "N\u1EBFu kh\xF4ng c\xF3 Dextran 40/HES 200, c\xF3 th\u1EC3 thay b\u1EB1ng HES 130 ho\u1EB7c Gelatin nh\u01B0ng kh\u1EA3 n\u0103ng gi\u1EEF th\u1EC3 t\xEDch k\xE9m h\u01A1n, c\u1EA7n theo d\xF5i s\xE1t."
      ],
      appendixRef: "Ph\u1EE5 l\u1EE5c 8, 11, 12, 16.1, 16.2 & Trang 15, 28 Q\u0110 2760"
    },
    // 2. Không đáp ứng + Hct giảm nhanh > 20% hoặc Hct ≤ 35% (Xuất huyết nội ẩn)
    occult_bleeding: {
      id: "occult_bleeding",
      code: "OCCULT_BLEEDING",
      name: "Kh\xF4ng \u0110\xE1p \u1EE8ng + Hct Gi\u1EA3m Nhanh > 20% ho\u1EB7c Hct \u2264 35% (Nghi Xu\u1EA5t Huy\u1EBFt N\u1ED9i \u1EA8n)",
      tag: "Truy\u1EC1n M\xE1u Kh\u1EA9n C\u1EA5p",
      badgeClass: "danger",
      triggerCriteria: "S\u1ED1c th\u1EA5t b\u1EA1i b\xF9 d\u1ECBch \u2265 40-60 ml/kg k\xE8m Hct gi\u1EA3m \u0111\u1ED9t ng\u1ED9t > 20% so v\u1EDBi ban \u0111\u1EA7u ho\u1EB7c Hct \u2264 35% (\u1EDF ng\u01B0\u1EDDi l\u1EDBn Hct < 35%), ho\u1EB7c \u0111ang c\xF3 xu\u1EA5t huy\u1EBFt \u1ED3 \u1EA1t.",
      mechanism: "M\u1EA5t m\xE1u c\u1EA5p do xu\u1EA5t huy\u1EBFt ti\xEAu h\xF3a \u1EA9n (d\u1EA1 d\xE0y, ru\u1ED9t non), xu\u1EA5t huy\u1EBFt ph\u1EE7 t\u1EA1ng ho\u1EB7c t\u1EE5 m\xE1u c\u01A1 sau m\u1EA1c treo k\u1EBFt h\u1EE3p gi\u1EA3m ti\u1EC3u c\u1EA7u n\u1EB7ng v\xE0 r\u1ED1i lo\u1EA1n \u0111\xF4ng m\xE1u ti\xEAu th\u1EE5.",
      primaryAction: "Th\u0103m kh\xE1m t\xECm \u1ED5 xu\u1EA5t huy\u1EBFt n\u1ED9i, truy\u1EC1n H\u1ED3ng C\u1EA7u L\u1EAFng kh\u1EA9n c\u1EA5p, song song duy tr\xEC CPT 10 ml/kg/h trong l\xFAc ch\u1EDD m\xE1u.",
      keyOrders: [
        "H\u1ED3ng c\u1EA7u l\u1EAFng 5 - 10 ml/kg (ho\u1EB7c M\xE1u to\xE0n ph\u1EA7n 10 - 20 ml/kg l\u1EA5y < 7 ng\xE0y) truy\u1EC1n t\u0129nh m\u1EA1ch trong 1 - 2 gi\u1EDD. M\u1EE5c ti\xEAu Hct duy tr\xEC 35 - 40%.",
        "Song song: Truy\u1EC1n Cao ph\xE2n t\u1EED 10 ml/kg/h \u0111\u1EC3 n\xE2ng huy\u1EBFt \xE1p ch\u1ED1ng s\u1ED1c trong khi ch\u1EDD l\u0129nh m\xE1u.",
        "Huy\u1EBFt t\u01B0\u01A1ng t\u01B0\u01A1i \u0111\xF4ng l\u1EA1nh (HT\u0110L) 10 - 20 ml/kg/2-4h: Khi PT ho\u1EB7c aPTT > 1.5 l\u1EA7n ch\u1EE9ng k\xE8m xu\u1EA5t huy\u1EBFt n\u1EB7ng ho\u1EB7c chu\u1EA9n b\u1ECB th\u1EE7 thu\u1EADt.",
        "K\u1EBFt t\u1EE7a l\u1EA1nh 1 t\xFAi / 6 kg (ch\u1EE9a 150mg Fibrinogen): Khi xu\u1EA5t huy\u1EBFt n\u1EB7ng k\xE8m Fibrinogen < 1 g/L.",
        "Ti\u1EC3u c\u1EA7u \u0111\u1EADm \u0111\u1EB7c: 1 \u0111\u01A1n v\u1ECB / 5 kg (ho\u1EB7c 1 \u0111v g\u1EA1n t\xE1ch / 10 kg) khi TC < 50.000/mm\xB3 k\xE8m xu\u1EA5t huy\u1EBFt n\u1EB7ng ho\u1EB7c TC < 5.000/mm\xB3.",
        "Omeprazole 1 mg/kg IV ch\u1EADm (ng\u01B0\u1EDDi l\u1EDBn: Bolus 80mg TM, sau \u0111\xF3 40mg m\u1ED7i 12h) n\u1EBFu nghi ng\u1EDD lo\xE9t d\u1EA1 d\xE0y - t\xE1 tr\xE0ng.",
        "Vitamin K1 1 mg/kg t\u0129nh m\u1EA1ch ch\u1EADm (t\u1ED1i \u0111a 20 mg/ng\xE0y) n\u1EBFu c\xF3 t\u1ED5n th\u01B0\u01A1ng gan n\u1EB7ng."
      ],
      monitoringSteps: [
        "Th\u0103m tr\u1EF1c tr\xE0ng t\xECm ph\xE2n \u0111en / m\xE1u; \u0111\u1EB7t sonde d\u1EA1 d\xE0y qua \u0111\u01B0\u1EDDng MI\u1EC6NG (kh\xF4ng \u0111\u1EB7t \u0111\u01B0\u1EDDng m\u0169i do d\u1EC5 ch\u1EA3y m\xE1u cu\u1ED1ng m\u0169i).",
        "\u0110o l\u1EA1i Hct sau 1 gi\u1EDD truy\u1EC1n m\xE1u v\xE0 CPT.",
        "Theo d\xF5i s\xE1t d\u1EA5u hi\u1EC7u sinh t\u1ED3n 15 ph\xFAt/l\u1EA7n cho \u0111\u1EBFn khi huy\u1EBFt \xE1p \u1ED5n \u0111\u1ECBnh.",
        "B\u0103ng \xE9p t\u1EA1i ch\u1ED7 m\u1ECDi v\u1ECB tr\xED ch\u1EA3y m\xE1u ti\xEAm ch\xEDch; nh\xE9t b\u1EA5c m\u0169i t\u1EA9m Adrenalin n\u1EBFu ch\u1EA3y m\xE1u m\u0169i n\u1EB7ng."
      ],
      precautions: [
        "Tuy\u1EC7t \u0111\u1ED1i kh\xF4ng ch\u1ECDc t\u0129nh m\u1EA1ch c\u1ED5 hay t\u0129nh m\u1EA1ch d\u01B0\u1EDBi \u0111\xF2n (nguy c\u01A1 t\u1EE5 m\xE1u trung th\u1EA5t t\u1EED vong).",
        "H\u1EA1n ch\u1EBF t\u1ED1i \u0111a ti\xEAm b\u1EAFp; l\u1EA5y m\xE1u x\xE9t nghi\u1EC7m t\u1EA1i t\u0129nh m\u1EA1ch chi v\xE0 \xE9p ch\u1EB7t \u0111i\u1EC3m ti\xEAm 1-2 ph\xFAt."
      ],
      appendixRef: "Ph\u1EE5 l\u1EE5c 17 & Trang 16, 22-23, 29-30 Q\u0110 2760"
    },
    // 3. Sốc thất bại bù dịch / Sốc kéo dài / Tái sốc ≥ 2 lần (Lưu đồ Phụ lục 18)
    refractory_shock: {
      id: "refractory_shock",
      code: "REFRACTORY_SHOCK",
      name: "S\u1ED1c Th\u1EA5t B\u1EA1i B\xF9 D\u1ECBch / S\u1ED1c K\xE9o D\xE0i / T\xE1i S\u1ED1c \u2265 2 L\u1EA7n (L\u01B0u \u0110\u1ED3 Ph\u1EE5 L\u1EE5c 18)",
      tag: "\u0110o CVP & V\u1EADn M\u1EA1ch",
      badgeClass: "danger",
      triggerCriteria: "B\xF9 d\u1ECBch CPT \u2265 60-100 ml/kg nh\u01B0ng huy\u1EBFt \u0111\u1ED9ng v\u1EABn kh\xF4ng \u1ED5n \u0111\u1ECBnh, t\xE1i s\u1ED1c nhi\u1EC1u l\u1EA7n, toan chuy\u1EC3n h\xF3a ti\u1EBFn tri\u1EC3n.",
      mechanism: "Suy tu\u1EA7n ho\xE0n ph\u1EE9c t\u1EA1p k\u1EBFt h\u1EE3p: s\u1ED1c gi\u1EA3m th\u1EC3 t\xEDch k\xE9o d\xE0i, toan m\xE1u n\u1EB7ng \u1EE9c ch\u1EBF c\u01A1 tim, suy ch\u1EE9c n\u0103ng co b\xF3p c\u01A1 tim do vi\xEAm c\u01A1 tim Dengue v\xE0 gi\u1EA3m kh\xE1ng l\u1EF1c m\u1EA1ch h\u1EC7 th\u1ED1ng.",
      primaryAction: "H\u1ED9i ch\u1EA9n kh\u1EA9n c\u1EA5p chuy\xEAn gia SXHD. \u0110\u1EB7t catheter \u0111o CVP qua t\u0129nh m\u1EA1ch n\u1EC1n khu\u1EF7u tay (Seldinger c\u1EA3i ti\u1EBFn), \u0111o HA\u0110MXL, l\xE0m kh\xED m\xE1u \u0111\u1ED9ng m\u1EA1ch, \u0111i\u1EC1u tr\u1ECB g\xF3i ABCS v\xE0 x\u1EED tr\xED theo m\u1EE9c CVP.",
      keyOrders: [
        "\u0110o CVP & HA\u0110MXL: \u0110\u1EB7t t\u0129nh m\u1EA1ch n\u1EC1n khu\u1EF7u tay (kh\xF4ng d\xF9ng TM c\u1EA3nh/d\u01B0\u1EDBi \u0111\xF2n). Si\xEAu \xE2m IVC \u0111\xE1nh gi\xE1 x\u1EB9p/c\u0103ng.",
        "Test d\u1ECBch: Truy\u1EC1n Cao ph\xE2n t\u1EED 5 ml/kg trong 30 ph\xFAt.",
        "N\u1EBFu CVP \u2264 15 cmH2O (ho\u1EB7c IVC x\u1EB9p): Ti\u1EBFp t\u1EE5c truy\u1EC1n CPT 10 - 20 ml/kg/h. N\u1EBFu t\u1ED5ng CPT \u2265 60 ml/kg k\xE8m Albumin < 2.5 g/dL -> Ch\u1EC9 \u0111\u1ECBnh b\xF9 Albumin 5% ho\u1EB7c 10%.",
        "N\u1EBFu CVP > 15 cmH2O (ho\u1EB7c IVC c\u0103ng to su\u1ED1t chu k\u1EF3 th\u1EDF):",
        "  \u2022 Co b\xF3p c\u01A1 tim b\xECnh th\u01B0\u1EDDng: Ng\u01B0ng d\u1ECBch n\u1EBFu qu\xE1 t\u1EA3i, d\xF9ng Dobutamin 3 - 10 \xB5g/kg/ph\xFAt.",
        "  \u2022 Co b\xF3p c\u01A1 tim gi\u1EA3m: Truy\u1EC1n Dopamin 5 - 10 \xB5g/kg/ph\xFAt; n\u1EBFu qu\xE1 t\u1EA3i ng\u01B0ng d\u1ECBch + Dobutamin 3 - 10 \xB5g/kg/ph\xFAt.",
        "  \u2022 N\u1EBFu c\xF2n s\u1ED1c k\xE8m gi\u1EA3m co b\xF3p c\u01A1 tim: Ph\u1ED1i h\u1EE3p Adrenalin 0.05 - 0.3 \xB5g/kg/ph\xFAt.",
        "  \u2022 N\u1EBFu gi\u1EA3m kh\xE1ng l\u1EF1c m\u1EA1ch h\u1EC7 th\u1ED1ng (HA t\xE2m tr\u01B0\u01A1ng t\u1EE5t, s\u1ED1c \u1EA5m): Ph\u1ED1i h\u1EE3p Noradrenalin 0.05 - 1 \xB5g/kg/ph\xFAt.",
        "G\xF3i h\u1ED3i s\u1EE9c ABCS b\u1EAFt bu\u1ED9c: A (Bicarbonate 4.2% n\u1EBFu pH < 7.35), B (M\xE1u & ch\u1EBF ph\u1EA9m), C (Calci clorua 10% n\u1EBFu Ca++ < 1.0 mmol/L), S (Dextrose 30% n\u1EBFu Glucose < 40 mg/dL)."
      ],
      monitoringSteps: [
        "Theo d\xF5i li\xEAn t\u1EE5c monitor: ECG, SpO2, HA\u0110MXL, CVP.",
        "\u0110o ScvO2 (kh\xED m\xE1u t\u0129nh m\u1EA1ch trung t\xE2m): M\u1EE5c ti\xEAu duy tr\xEC ScvO2 \u2265 70%.",
        "Lactate m\xE1u \u0111\u1ED9ng m\u1EA1ch m\u1ED7i 2 - 4 gi\u1EDD (m\u1EE5c ti\xEAu gi\u1EA3m < 2 mmol/L).",
        "Ki\u1EC3m tra men tim Troponin I, CK-MB, si\xEAu \xE2m tim t\u1EA1i gi\u01B0\u1EDDng t\xECm tr\xE0n d\u1ECBch m\xE0ng tim / vi\xEAm c\u01A1 tim."
      ],
      precautions: [
        "C\xF4ng th\u1EE9c t\xEDnh li\u1EC1u Albumin (g): [N\u1ED3ng \u0111\u1ED9 Albumin c\u1EA7n \u0111\u1EA1t (g/dL) - N\u1ED3ng \u0111\u1ED9 hi\u1EC7n t\u1EA1i (g/dL)] \xD7 0.8 \xD7 C\xE2n n\u1EB7ng (kg).",
        "C\xE1ch pha Albumin 5%: 1 l\u1ECD 20% 50ml + 150ml NaCl 0.9% = 200ml Albumin 5%.",
        "C\xE1ch pha Albumin 10%: 1 l\u1ECD 20% 50ml + 50ml NaCl 0.9% = 100ml Albumin 10%."
      ],
      appendixRef: "Ph\u1EE5 l\u1EE5c 12, 13, 15, 18 & Trang 16, 20-21, 28-29 Q\u0110 2760"
    },
    // 4. Biến chứng Dư dịch / Quá tải tuần hoàn / Phù phổi cấp
    fluid_overload: {
      id: "fluid_overload",
      code: "FLUID_OVERLOAD",
      name: "Bi\u1EBFn Ch\u1EE9ng D\u01B0 D\u1ECBch / Qu\xE1 T\u1EA3i Tu\u1EA7n Ho\xE0n / Ph\xF9 Ph\u1ED5i C\u1EA5p",
      tag: "Ng\u01B0ng D\u1ECBch & L\u1EE3i Ti\u1EC3u",
      badgeClass: "warning",
      triggerCriteria: "\u0110\u1ED9t ng\u1ED9t ho, kh\xF3 th\u1EDF, th\u1EDF nhanh, co k\xE9o, SpO2 < 92%, ran \u1EA9m n\u1ED5 d\xE2ng nhanh \u1EDF hai \u0111\xE1y ph\u1ED5i, kh\u1EA1c b\u1ECDt h\u1ED3ng, t\u0129nh m\u1EA1ch c\u1ED5 n\u1ED5i, gan to \u0111au, CVP > 15 cmH2O.",
      mechanism: "Qu\xE1 t\u1EA3i th\u1EC3 t\xEDch tu\u1EA7n ho\xE0n do b\xF9 d\u1ECBch t\u1ED1c \u0111\u1ED9 cao k\xE9o d\xE0i k\u1EBFt h\u1EE3p hi\u1EC7n t\u01B0\u1EE3ng t\xE1i h\u1EA5p thu d\u1ECBch t\u1EEB khoang k\u1EBD v\xE0o l\xF2ng m\u1EA1ch \u1EDF ng\xE0y th\u1EE9 6 - 7 c\u1EE7a b\u1EC7nh.",
      primaryAction: "NG\u01AFNG NGAY D\u1ECACH TRUY\u1EC0N T\u0128NH M\u1EA0CH. Cho b\u1EC7nh nh\xE2n n\u1EB1m \u0111\u1EA7u cao 30 - 45\xB0, th\u1EDF oxy g\u1ECDng k\xEDnh -> th\u1EDF NCPAP ho\u1EB7c th\u1EDF m\xE1y, d\xF9ng Furosemide v\xE0 Dobutamin.",
      keyOrders: [
        "NG\u01AFNG TRUY\u1EC0N D\u1ECACH T\u0128NH M\u1EA0CH NGAY L\u1EACP T\u1EE8C.",
        "T\u01B0 th\u1EBF: N\u1EB1m \u0111\u1EA7u cao 30 - 45\xB0.",
        "H\u1ED7 tr\u1EE3 h\xF4 h\u1EA5p: Th\u1EDF oxy qua canulla 2 - 5 L/ph\xFAt -> Th\u1EDF NCPAP \xE1p l\u1EF1c 4 - 6 cmH2O, FiO2 40-60%, t\u0103ng d\u1EA7n \u0111\u1EBFn 10 cmH2O v\xE0 FiO2 80-100% n\u1EBFu kh\xF4ng c\u1EA3i thi\u1EC7n.",
        "Furosemide 0.5 - 1 mg/kg ti\xEAm t\u0129nh m\u1EA1ch ch\u1EADm, c\xF3 th\u1EC3 l\u1EB7p l\u1EA1i sau 1 gi\u1EDD n\u1EBFu t\xECnh tr\u1EA1ng huy\u1EBFt \u0111\u1ED9ng cho ph\xE9p (Huy\u1EBFt \xE1p \u1ED5n \u0111\u1ECBnh).",
        "Dobutamin 5 - 10 \xB5g/kg/ph\xFAt truy\u1EC1n t\u0129nh m\u1EA1ch \u0111\u1EC3 t\u0103ng co b\xF3p c\u01A1 tim, gi\u1EA3m \xE1p l\u1EF1c mao m\u1EA1ch ph\u1ED5i b\xEDt.",
        "Ch\u1ECDc h\xFAt - d\u1EABn l\u01B0u m\xE0ng b\u1EE5ng gi\u1EA3i \xE1p khi: Suy h\xF4 h\u1EA5p th\u1EA5t b\u1EA1i v\u1EDBi NCPAP + tr\xE0n d\u1ECBch m\xE0ng b\u1EE5ng l\u01B0\u1EE3ng nhi\u1EC1u ch\xE8n \xE9p c\u01A1 ho\xE0nh v\xE0 \xE1p l\u1EF1c \u1ED5 b\u1EE5ng (\xE1p l\u1EF1c b\xE0ng quang) > 27 cmH2O.",
        "Ch\u1ECDc h\xFAt m\xE0ng ph\u1ED5i gi\u1EA3i \xE1p: Khi tr\xE0n d\u1ECBch m\xE0ng ph\u1ED5i l\u01B0\u1EE3ng nhi\u1EC1u m\u1EDD > 1/2 ph\u1EBF tr\u01B0\u1EDDng ch\xE8n \xE9p ph\u1ED5i g\xE2y suy h\xF4 h\u1EA5p n\u1EB7ng (l\u01B0u \xFD ch\u1EC9nh \u0111\xF4ng m\xE1u tr\u01B0\u1EDBc ch\u1ECDc)."
      ],
      monitoringSteps: [
        "SpO2 li\xEAn t\u1EE5c, kh\xED m\xE1u \u0111\u1ED9ng m\u1EA1ch \u0111\xE1nh gi\xE1 PaO2/FiO2 (ARDS).",
        "X-quang ng\u1EF1c th\u1EB3ng t\u1EA1i gi\u01B0\u1EDDng \u0111\xE1nh gi\xE1 ph\xF9 ph\u1ED5i m\u1EDD h\xECnh c\xE1nh b\u01B0\u1EDBm / tr\xE0n d\u1ECBch m\xE0ng ph\u1ED5i.",
        "Theo d\xF5i l\u01B0\u1EE3ng n\u01B0\u1EDBc ti\u1EC3u m\u1ED7i 30 - 60 ph\xFAt sau d\xF9ng Furosemide.",
        "\u0110o \xE1p l\u1EF1c b\xE0ng quang qua sonde ti\u1EC3u gi\xE1n ti\u1EBFp \u0111o \xE1p l\u1EF1c \u1ED5 b\u1EE5ng."
      ],
      precautions: [
        "Kh\xF4ng d\xF9ng Furosemide khi huy\u1EBFt \xE1p c\xF2n t\u1EE5t ho\u1EB7c b\u1EC7nh nh\xE2n c\xF2n \u0111ang s\u1ED1c gi\u1EA3m th\u1EC3 t\xEDch ch\u01B0a ra s\u1ED1c.",
        "Trong giai \u0111o\u1EA1n t\xE1i h\u1EA5p thu (N6 - N7), Hct th\u01B0\u1EDDng b\u1ECB pha lo\xE3ng gi\u1EA3m sinh l\xFD; kh\xF4ng nh\u1EA7m l\u1EABn v\u1EDBi m\u1EA5t m\xE1u n\u1EBFu chi \u1EA5m, m\u1EA1ch ch\u1EADm r\xF5, HA b\xECnh th\u01B0\u1EDDng."
      ],
      appendixRef: "Ph\u1EE5 l\u1EE5c 7, 20 & Trang 21, 26-28 Q\u0110 2760"
    },
    // 5. Biến chứng Tổn thương gan nặng & Suy gan cấp (Phụ lục 26)
    acute_liver_failure: {
      id: "acute_liver_failure",
      code: "ACUTE_LIVER_FAILURE",
      name: "Bi\u1EBFn Ch\u1EE9ng T\u1ED5n Th\u01B0\u01A1ng Gan N\u1EB7ng & Suy Gan C\u1EA5p (Ph\u1EE5 L\u1EE5c 26)",
      tag: "Ph\xE1c \u0110\u1ED3 NAC & L\u1ECDc M\xE1u",
      badgeClass: "danger",
      triggerCriteria: "AST ho\u1EB7c ALT \u2265 1000 U/L, ho\u1EB7c k\xE8m b\u1EC7nh n\xE3o gan \u0111\u1ED9 I-IV, INR \u2265 1.5, ho\u1EB7c MELD score \u2265 15.",
      mechanism: "Vi r\xFAt Dengue t\u1EA5n c\xF4ng tr\u1EF1c ti\u1EBFp t\u1EBF b\xE0o gan v\xE0 ph\u1EA3n \u1EE9ng mi\u1EC5n d\u1ECBch vi\xEAm cytokine b\xE3o h\xF2a g\xE2y ho\u1EA1i t\u1EED nhu m\xF4 gan di\u1EC7n r\u1ED9ng, k\xE8m thi\u1EBFu m\xE1u c\u1EE5c b\u1ED9 trong s\u1ED1c k\xE9o d\xE0i.",
      primaryAction: "TUY\u1EC6T \u0110\u1ED0I TR\xC1NH D\xD9NG RINGER LACTATE V\xC0 PARACETAMOL. D\xF9ng dung d\u1ECBch NaCl 0.9% ho\u1EB7c Ringer Acetate. Kh\u1EDFi \u0111\u1ED9ng ph\xE1c \u0111\u1ED3 truy\u1EC1n N-Acetylcysteine (NAC) 4 pha.",
      keyOrders: [
        "Ch\u1ED1ng ch\u1EC9 \u0111\u1ECBnh tuy\u1EC7t \u0111\u1ED1i: Ringer Lactate (gan suy kh\xF4ng chuy\u1EC3n h\xF3a \u0111\u01B0\u1EE3c lactate g\xE2y toan lactic n\u1EB7ng) v\xE0 Paracetamol.",
        "D\u1ECBch thay th\u1EBF: NaCl 0.9% ho\u1EB7c Ringer Acetate, Dextrosaline. H\u1EA1n ch\u1EBF t\u1ED1i \u0111a d\xF9ng HES.",
        "Ph\xE1c \u0111\u1ED3 N-Acetylcysteine (NAC) truy\u1EC1n t\u0129nh m\u1EA1ch:",
        "  \u2022 Pha 1 (T\u1EA5n c\xF4ng): 150 mg/kg truy\u1EC1n trong 1 gi\u1EDD (pha Glucose 5% 200ml).",
        "  \u2022 Pha 2: 50 mg/kg truy\u1EC1n trong 4 gi\u1EDD ti\u1EBFp theo (pha Glucose 5% 500ml).",
        "  \u2022 Pha 3: 100 mg/kg truy\u1EC1n trong 16 gi\u1EDD ti\u1EBFp theo (pha Glucose 5% 1000ml).",
        "  \u2022 Pha 4: Duy tr\xEC 6.25 mg/kg/gi\u1EDD li\xEAn t\u1EE5c trong 48 - 72 gi\u1EDD.",
        "\u0110i\u1EC1u tr\u1ECB b\u1EC7nh n\xE3o gan: Lactulose 15 - 30ml u\u1ED1ng ho\u1EB7c th\u1EE5t th\xE1o; Kh\xE1ng sinh Metronidazol 500mg q8h ho\u1EB7c Rifaximin.",
        "Vitamin K1 1 mg/kg TM ch\u1EADm (t\u1ED1i \u0111a 20 mg/ng\xE0y). Truy\u1EC1n huy\u1EBFt t\u01B0\u01A1ng \u0111\xF4ng l\u1EA1nh n\u1EBFu c\xF3 r\u1ED1i lo\u1EA1n \u0111\xF4ng m\xE1u / ch\u1EA3y m\xE1u.",
        "Xem x\xE9t Thay huy\u1EBFt t\u01B0\u01A1ng (TPE) th\u1EC3 t\xEDch cao v\xE0 L\u1ECDc m\xE1u li\xEAn t\u1EE5c (CVVHDF) khi th\u1EA5t b\u1EA1i \u0111i\u1EC1u tr\u1ECB n\u1ED9i sau 24 - 48 gi\u1EDD ho\u1EB7c c\xF3 k\xE8m t\u1ED5n th\u01B0\u01A1ng th\u1EADn c\u1EA5p, Bilirubin \u2265 200 \xB5mol/L, INR \u2265 2.5, NH3 \u2265 150 mmol/L, Lactate \u2265 5."
      ],
      monitoringSteps: [
        "\u0110\xF4ng m\xE1u to\xE0n b\u1ED9 (PT, INR, aPTT, Fibrinogen), men gan, Bilirubin, Amoniac m\xE1u (NH3), Lactate m\u1ED7i 6 - 12 gi\u1EDD.",
        "\u0110\u01B0\u1EDDng huy\u1EBFt mao m\u1EA1ch m\u1ED7i 2 - 4 gi\u1EDD (nguy c\u01A1 h\u1EA1 \u0111\u01B0\u1EDDng huy\u1EBFt nghi\xEAm tr\u1ECDng do m\u1EA5t d\u1EF1 tr\u1EEF glycogen).",
        "Kh\xE1m tri gi\xE1c \u0111\u1ECBnh k\u1EF3 ph\xE1t hi\u1EC7n d\u1EA5u hi\u1EC7u ph\xF9 n\xE3o v\xE0 t\u0103ng \xE1p l\u1EF1c n\u1ED9i s\u1ECD."
      ],
      precautions: [
        "L\u01B0u \xFD nguy c\u01A1 ph\u1EA3n \u1EE9ng ph\u1EA3n v\u1EC7 khi ti\xEAm truy\u1EC1n N-Acetylcysteine; kh\xF4ng d\xF9ng cho b\u1EC7nh nh\xE2n thi\u1EBFu men G6PD.",
        "H\u1EA1n ch\u1EBF d\u1ECBch truy\u1EC1n 2/3 - 3/4 nhu c\u1EA7u c\u01A1 b\u1EA3n khi kh\xF4ng c\xF2n s\u1ED1c \u0111\u1EC3 tr\xE1nh ph\xF9 n\xE3o v\xE0 suy tim."
      ],
      appendixRef: "Ph\u1EE5 l\u1EE5c 26 & Trang 24-25, 30-31 Q\u0110 2760"
    },
    // 6. Sốt xuất huyết Thể Não & Tăng Áp Lực Nội Sọ
    encephalopathy_icp: {
      id: "encephalopathy_icp",
      code: "ENCEPHALOPATHY_ICP",
      name: "S\u1ED1t Xu\u1EA5t Huy\u1EBFt Th\u1EC3 N\xE3o & T\u0103ng \xC1p L\u1EF1c N\u1ED9i S\u1ECD",
      tag: "Ch\u1ED1ng Ph\xF9 N\xE3o & Co Gi\u1EADt",
      badgeClass: "danger",
      triggerCriteria: "R\u1ED1i lo\u1EA1n tri gi\xE1c (GCS gi\u1EA3m), co gi\u1EADt, d\u1EA5u th\u1EA7n kinh khu tr\xFA, tam ch\u1EE9ng Cushing (m\u1EA1ch ch\u1EADm, HA cao, th\u1EDF b\u1EA5t th\u01B0\u1EDDng), ph\xF9 gai th\u1ECB.",
      mechanism: "Ph\xF9 n\xE3o th\u1EE9 ph\xE1t do t\u0103ng t\xEDnh th\u1EA5m th\xE0nh m\u1EA1ch n\xE3o, \u0111\u1ED9c t\u1ED1 th\u1EA7n kinh c\u1EE7a suy gan, toan chuy\u1EC3n h\xF3a n\u1EB7ng, xu\u1EA5t huy\u1EBFt vi m\u1EA1ch n\xE3o ho\u1EB7c vi\xEAm n\xE3o Dengue.",
      primaryAction: "N\u1EB1m \u0111\u1EA7u cao 30\xB0, th\u1EDF oxy ho\u1EB7c \u0111\u1EB7t n\u1ED9i kh\xED qu\u1EA3n th\u1EDF m\xE1y t\u0103ng th\xF4ng kh\xED (m\u1EE5c ti\xEAu PaCO2 30-35 mmHg), ch\u1ED1ng ph\xF9 n\xE3o b\u1EB1ng Mannitol 20% v\xE0 NaCl 3%, c\u1EAFt c\u01A1n co gi\u1EADt.",
      keyOrders: [
        "T\u01B0 th\u1EBF: N\u1EB1m \u0111\u1EA7u cao 30\xB0 ch\xEDnh gi\u1EEFa c\u1ED5 (kh\xF4ng g\u1EADp ho\u1EB7c nghi\xEAng c\u1ED5 l\xE0m ngh\u1EBDn h\u1ED3i l\u01B0u t\u0129nh m\u1EA1ch c\u1EA3nh).",
        "Ch\u1ED1ng ph\xF9 n\xE3o: Mannitol 20% li\u1EC1u 0.5 g/kg truy\u1EC1n t\u0129nh m\u1EA1ch nhanh trong 30 ph\xFAt, l\u1EB7p l\u1EA1i m\u1ED7i 8 gi\u1EDD.",
        "C\xF3 th\u1EC3 ph\u1ED1i h\u1EE3p xen k\u1EBD Natri Clorua 3% li\u1EC1u 4 ml/kg truy\u1EC1n nhanh 30 ph\xFAt, l\u1EB7p l\u1EA1i m\u1ED7i 8 gi\u1EDD.",
        "C\u1EAFt c\u01A1n co gi\u1EADt: Diazepam 0.2 mg/kg ti\xEAm t\u0129nh m\u1EA1ch ch\u1EADm (ho\u1EB7c b\u01A1m h\u1EADu m\xF4n 0.5 mg/kg). L\u1EB7p l\u1EA1i li\u1EC1u 2 sau 10 ph\xFAt (t\u1ED1i \u0111a 3 li\u1EC1u). N\u1EBFu th\u1EA5t b\u1EA1i: Phenobarbital 10 - 20 mg/kg truy\u1EC1n TM trong 15 - 30 ph\xFAt.",
        "\u0110\u1EB7t n\u1ED9i kh\xED qu\u1EA3n b\u1EA3o v\u1EC7 \u0111\u01B0\u1EDDng th\u1EDF v\xE0 th\u1EDF m\xE1y ki\u1EC3m so\xE1t \xE1p l\u1EF1c: T\u0103ng th\xF4ng kh\xED gi\u1EEF PaCO2 t\u1EEB 30 - 35 mmHg.",
        "\u0110i\u1EC1u tr\u1ECB h\u1EA1 \u0111\u01B0\u1EDDng huy\u1EBFt kh\u1EA9n c\u1EA5p: Dextrose 30% 1 - 2 ml/kg TM ch\u1EADm (tr\u1EBB < 1 tu\u1ED5i: Dextrose 10% 2 ml/kg)."
      ],
      monitoringSteps: [
        "\u0110\xE1nh gi\xE1 ph\u1EA3n x\u1EA1 \u0111\u1ED3ng t\u1EED, thang \u0111i\u1EC3m Glasgow (ho\u1EB7c thang \u0111i\u1EC3m AVPU) m\u1ED7i 1 - 2 gi\u1EDD.",
        "Kh\xED m\xE1u \u0111\u1ED9ng m\u1EA1ch ki\u1EC3m so\xE1t PaCO2 v\xE0 th\u0103ng b\u1EB1ng ki\u1EC1m toan.",
        "Theo d\xF5i \u0111i\u1EC7n gi\u1EA3i \u0111\u1ED3 m\xE1u (Na+, K+, Cl-) v\xE0 \xE1p l\u1EF1c th\u1EA9m th\u1EA5u m\xE1u (Osmolality)."
      ],
      precautions: [
        "Kh\xF4ng d\xF9ng Mannitol khi b\u1EC7nh nh\xE2n \u0111ang t\u1EE5t huy\u1EBFt \xE1p ho\u1EB7c s\u1ED1c ch\u01B0a \u1ED5n \u0111\u1ECBnh.",
        "Tr\xE1nh h\u1EA1 \u0111\u01B0\u1EDDng huy\u1EBFt v\xE0 h\u1EA1 Natri m\xE1u v\xEC l\xE0m n\u1EB7ng th\xEAm t\xECnh tr\u1EA1ng ph\xF9 n\xE3o."
      ],
      appendixRef: "Trang 25-26, 31-32 Q\u0110 2760"
    }
  };
  var DENGUE_NON_RESPONSE_SCENARIOS = {
    ...DENGUE_REFRACTORY_SCENARIOS,
    cpt_escalation: DENGUE_REFRACTORY_SCENARIOS.hct_high_cpt
  };
  var DENGUE_COLLOID_METADATA = {
    dextran40: {
      name: "Dextran 40 10% trong NaCl 0.9%",
      shortName: "Dextran 40",
      oncoticPower: "R\u1EA5t cao (~40 mmHg, g\u1EA5p \u0111\xF4i \xE1p l\u1EF1c keo huy\u1EBFt t\u01B0\u01A1ng)",
      volumeExpansionRatio: "1 : 1.8 - 2.0 (K\xE9o d\u1ECBch k\u1EBD v\xE0o l\xF2ng m\u1EA1ch m\u1EA1nh nh\u1EA5t)",
      intravascularHalfLife: "3 - 6 gi\u1EDD (Th\u1EA3i tr\u1EEB ch\u1EE7 y\u1EBFu qua th\u1EADn)",
      contraindications: "D\u1ECB \u1EE9ng Dextran, suy th\u1EADn thi\u1EC3u ni\u1EC7u kh\xF4ng do s\u1ED1c, suy tim \u1EE9 huy\u1EBFt n\u1EB7ng",
      maxTotalDose: "60 ml/kg (Khuy\u1EBFn c\xE1o tr\u1EA7n BYT 2023)",
      bytrank: "priority",
      notes: "Thu\u1ED1c ch\u1ECDn l\u1EF1a \u01B0u ti\xEAn h\xE0ng \u0111\u1EA7u theo Q\u0110 2760/BYT. C\u1EA7n theo d\xF5i ph\u1EA3n \u1EE9ng qu\xE1 m\u1EABn m\u0169i \u0111\u1EA7u."
    },
    hes200: {
      name: "6% Hydroxyethyl Starch 200/0.5 (HES 200.000 Dalton)",
      shortName: "6% HES 200",
      oncoticPower: "Cao (~30 - 36 mmHg)",
      volumeExpansionRatio: "1 : 1.0 - 1.3",
      intravascularHalfLife: "4 - 8 gi\u1EDD (L\u01B0u gi\u1EEF l\xF2ng m\u1EA1ch l\xE2u nh\u1EA5t)",
      contraindications: "Suy th\u1EADn c\u1EA5p c\xF3 v\xF4 ni\u1EC7u, r\u1ED1i lo\u1EA1n \u0111\xF4ng m\xE1u n\u1EB7ng (gi\u1EA3m von Willebrand / VIII)",
      maxTotalDose: "60 ml/kg (T\xE1c d\u1EE5ng ph\u1EE5 t\u0103ng khi t\u1ED5ng li\u1EC1u > 60 ml/kg)",
      bytrank: "priority",
      notes: "Thu\u1ED1c ch\u1ECDn l\u1EF1a t\u01B0\u01A1ng \u0111\u01B0\u01A1ng Dextran 40 trong Q\u0110 2760/BYT. Th\u1EADn tr\u1ECDng v\u1EDBi \u0111\u1ED9c t\xEDnh tr\xEAn th\u1EADn khi d\xF9ng qu\xE1 li\u1EC1u."
    },
    dextran70: {
      name: "Dextran 70 6% trong NaCl 0.9%",
      shortName: "Dextran 70",
      oncoticPower: "Cao (~25 - 30 mmHg)",
      volumeExpansionRatio: "1 : 1.2",
      intravascularHalfLife: "6 - 12 gi\u1EDD",
      contraindications: "Qu\xE1 m\u1EABn, suy tim n\u1EB7ng, r\u1ED1i lo\u1EA1n \u0111\xF4ng m\xE1u n\u1EB7ng",
      maxTotalDose: "60 ml/kg",
      bytrank: "priority",
      notes: "Dung d\u1ECBch cao ph\xE2n t\u1EED \u01B0u ti\xEAn theo Q\u0110 2760/BYT; ph\xE2n t\u1EED l\u01B0\u1EE3ng l\u1EDBn h\u01A1n Dextran 40 n\xEAn gi\u1EEF trong m\u1EA1ch l\xE2u h\u01A1n."
    },
    hes130: {
      name: "6% Hydroxyethyl Starch 130/0.4 (HES 130.000 Dalton - Voluven / Tetraspan)",
      shortName: "6% HES 130",
      oncoticPower: "Trung b\xECnh (~25 - 28 mmHg)",
      volumeExpansionRatio: "1 : 1.0",
      intravascularHalfLife: "2 - 4 gi\u1EDD (Chuy\u1EC3n h\xF3a v\xE0 \u0111\xE0o th\u1EA3i nhanh h\u01A1n HES 200)",
      contraindications: "Nhi\u1EC5m tr\xF9ng huy\u1EBFt, suy th\u1EADn c\u1EA5p, t\u1ED5n th\u01B0\u01A1ng gan n\u1EB7ng",
      maxTotalDose: "50 ml/kg",
      bytrank: "alternative",
      notes: "Dung d\u1ECBch thay th\u1EBF khi kh\xF4ng c\xF3 s\u1EB5n Dextran 40 ho\u1EB7c HES 200. Kh\u1EA3 n\u0103ng t\u0103ng th\u1EC3 t\xEDch v\xE0 th\u1EDDi gian l\u01B0u ng\u1EAFn h\u01A1n, c\u1EA7n theo d\xF5i s\xE1t Hct."
    },
    gelatin: {
      name: "Dung d\u1ECBch Gelatin 4% (Gelafundin / Succinylated Gelatin)",
      shortName: "Gelatin 4%",
      oncoticPower: "Trung b\xECnh (~24 - 26 mmHg)",
      volumeExpansionRatio: "1 : 1.0",
      intravascularHalfLife: "1.5 - 3 gi\u1EDD",
      contraindications: "D\u1ECB \u1EE9ng Gelatin, t\u0103ng calci m\xE1u, t\u0103ng kali m\xE1u",
      maxTotalDose: "kh\xF4ng t\xEDch l\u0169y trong m\xF4 nh\u01B0ng t\u1ED1i \u0111a ~30 - 40 ml/kg/ng\xE0y",
      bytrank: "alternative",
      notes: "Dung d\u1ECBch thay th\u1EBF. \xCDt \u1EA3nh h\u01B0\u1EDFng ch\u1EE9c n\u0103ng \u0111\xF4ng m\xE1u v\xE0 ch\u1EE9c n\u0103ng th\u1EADn h\u01A1n HES, nh\u01B0ng th\u1EDDi gian duy tr\xEC th\u1EC3 t\xEDch ng\u1EAFn."
    }
  };
  var DENGUE_COLLOID_TEMPLATES = {
    child: [
      {
        stageName: "C\u1EEF 1: CPT T\u1EA3i li\u1EC1u n\u1EA5c 1 (15 ml/kg/h)",
        fluidKind: "colloid",
        defaultRateMlKgH: 15,
        rateOptions: [10, 15, 20],
        defaultDurationHours: 1,
        durationOptions: [1],
        hctCheckRequired: true,
        notes: "B\xF9 Cao Ph\xE2n T\u1EED trong 1 gi\u1EDD. \u0110\xE1nh gi\xE1 l\u1EA1i m\u1EA1ch, HA v\xE0 Hct ngay sau 1 gi\u1EDD. N\u1EBFu th\u1EA5t b\u1EA1i l\u1EA7n 1: l\u1EB7p l\u1EA1i 10-20 ml/kg/h."
      },
      {
        stageName: "C\u1EEF 2: Ra s\u1ED1c - Gi\u1EA3m CPT xu\u1ED1ng 10 ml/kg/h",
        fluidKind: "colloid",
        defaultRateMlKgH: 10,
        rateOptions: [10],
        defaultDurationHours: 1,
        durationOptions: [1, 2],
        hctCheckRequired: true,
        notes: "\u0110\xE1nh gi\xE1 c\u1EA3i thi\u1EC7n l\xE2m s\xE0ng (m\u1EA1ch r\xF5, HA b\xECnh th\u01B0\u1EDDng, chi \u1EA5m)."
      },
      {
        stageName: "C\u1EEF 3: Gi\u1EA3m CPT xu\u1ED1ng 7.5 ml/kg/h",
        fluidKind: "colloid",
        defaultRateMlKgH: 7.5,
        rateOptions: [7.5],
        defaultDurationHours: 2,
        durationOptions: [1, 2],
        hctCheckRequired: false,
        notes: "Gi\xE1m s\xE1t d\u1EA5u hi\u1EC7u qu\xE1 t\u1EA3i tu\u1EA7n ho\xE0n."
      },
      {
        stageName: "C\u1EEF 4: Gi\u1EA3m CPT xu\u1ED1ng 5 ml/kg/h",
        fluidKind: "colloid",
        defaultRateMlKgH: 5,
        rateOptions: [5],
        defaultDurationHours: 2,
        durationOptions: [1, 2],
        hctCheckRequired: true,
        notes: "Ki\u1EC3m tra 7 ti\xEAu chu\u1EA9n Ph\u1EE5 l\u1EE5c 10 tr\u01B0\u1EDBc khi chuy\u1EC3n sang dung d\u1ECBch \u0111i\u1EC7n gi\u1EA3i."
      },
      {
        stageName: "C\u1EEF 5: Chuy\u1EC3n \u0111i\u1EC7n gi\u1EA3i RL/NaCl 0.9% 5 ml/kg/h (Ph\u1EE5 l\u1EE5c 10)",
        fluidKind: "crystalloid",
        defaultRateMlKgH: 5,
        rateOptions: [5],
        defaultDurationHours: 3,
        durationOptions: [3, 4],
        hctCheckRequired: true,
        notes: "Truy\u1EC1n \u0111i\u1EC7n gi\u1EA3i v\u1EDBi t\u1ED1c \u0111\u1ED9 \xEDt nh\u1EA5t b\u1EB1ng t\u1ED1c \u0111\u1ED9 CPT tr\u01B0\u1EDBc \u0111\xF3 trong 2-4 gi\u1EDD (Ph\u1EE5 l\u1EE5c 10)."
      },
      {
        stageName: "C\u1EEF 6: Gi\u1EA3m \u0111i\u1EC7n gi\u1EA3i xu\u1ED1ng 3 ml/kg/h & Cai d\u1ECBch",
        fluidKind: "crystalloid",
        defaultRateMlKgH: 3,
        rateOptions: [3],
        defaultDurationHours: 4,
        durationOptions: [4, 5, 6],
        hctCheckRequired: true,
        notes: "Duy tr\xEC n\u01B0\u1EDBc ti\u1EC3u \u2265 0.5 - 1 ml/kg/h. Xem x\xE9t ng\u01B0ng d\u1ECBch sau 24 - 48 gi\u1EDD."
      }
    ],
    adolescent: [
      {
        stageName: "C\u1EEF 1: CPT T\u1EA3i li\u1EC1u n\u1EA5c 1 (15 ml/kg/h)",
        fluidKind: "colloid",
        defaultRateMlKgH: 15,
        rateOptions: [10, 15, 20],
        defaultDurationHours: 1,
        durationOptions: [1],
        hctCheckRequired: true,
        notes: "Truy\u1EC1n CPT trong 1 gi\u1EDD. Theo d\xF5i m\u1EA1ch, HA v\xE0 Hct."
      },
      {
        stageName: "C\u1EEF 2: Ra s\u1ED1c - Gi\u1EA3m CPT xu\u1ED1ng 10 ml/kg/h",
        fluidKind: "colloid",
        defaultRateMlKgH: 10,
        rateOptions: [10],
        defaultDurationHours: 1,
        durationOptions: [1],
        hctCheckRequired: true,
        notes: "Th\u1EDDi gian gi\u1EA3m n\u1EA5c b\u1EB1ng 1/2 tr\u1EBB nh\u1ECF nh\u1EB1m tr\xE1nh qu\xE1 t\u1EA3i d\u1ECBch (Ph\u1EE5 l\u1EE5c 11)."
      },
      {
        stageName: "C\u1EEF 3: Gi\u1EA3m CPT xu\u1ED1ng 7.5 ml/kg/h",
        fluidKind: "colloid",
        defaultRateMlKgH: 7.5,
        rateOptions: [7.5],
        defaultDurationHours: 1,
        durationOptions: [1],
        hctCheckRequired: false,
        notes: "Truy\u1EC1n 7.5 ml/kg/h trong 1 gi\u1EDD."
      },
      {
        stageName: "C\u1EEF 4: Gi\u1EA3m CPT xu\u1ED1ng 5 ml/kg/h",
        fluidKind: "colloid",
        defaultRateMlKgH: 5,
        rateOptions: [5],
        defaultDurationHours: 1,
        durationOptions: [1],
        hctCheckRequired: true,
        notes: "\u0110\xE1nh gi\xE1 ti\xEAu chu\u1EA9n chuy\u1EC3n \u0111i\u1EC7n gi\u1EA3i Ph\u1EE5 l\u1EE5c 10."
      },
      {
        stageName: "C\u1EEF 5: Chuy\u1EC3n \u0111i\u1EC7n gi\u1EA3i RL/NaCl 0.9% 5 ml/kg/h",
        fluidKind: "crystalloid",
        defaultRateMlKgH: 5,
        rateOptions: [5],
        defaultDurationHours: 2,
        durationOptions: [2, 3],
        hctCheckRequired: false,
        notes: "Chuy\u1EC3n sang dung d\u1ECBch \u0111i\u1EC7n gi\u1EA3i an to\xE0n."
      },
      {
        stageName: "C\u1EEF 6: Gi\u1EA3m \u0111i\u1EC7n gi\u1EA3i 3 ml/kg/h",
        fluidKind: "crystalloid",
        defaultRateMlKgH: 3,
        rateOptions: [3],
        defaultDurationHours: 3,
        durationOptions: [2, 3],
        hctCheckRequired: true,
        notes: "\u0110\xE1nh gi\xE1 n\u01B0\u1EDBc ti\u1EC3u v\xE0 tri gi\xE1c."
      },
      {
        stageName: "C\u1EEF 7: Duy tr\xEC 1.5 ml/kg/h & Cai d\u1ECBch",
        fluidKind: "crystalloid",
        defaultRateMlKgH: 1.5,
        rateOptions: [1.5],
        defaultDurationHours: 12,
        durationOptions: [6, 12, 18],
        hctCheckRequired: true,
        notes: "Duy tr\xEC v\xE0 chu\u1EA9n b\u1ECB ng\u01B0ng d\u1ECBch sau 24 gi\u1EDD."
      }
    ],
    adult: [
      {
        stageName: "C\u1EEF 1: CPT T\u1EA3i li\u1EC1u ng\u01B0\u1EDDi l\u1EDBn (10 - 15 ml/kg/h)",
        fluidKind: "colloid",
        defaultRateMlKgH: 15,
        rateOptions: [10, 15],
        defaultDurationHours: 1,
        durationOptions: [1],
        hctCheckRequired: true,
        notes: "B\xF9 CPT 10 - 15 ml/kg/h trong 1 gi\u1EDD (Ph\u1EE5 l\u1EE5c 16.1). N\u1EBFu kh\xF4ng c\u1EA3i thi\u1EC7n: l\u1EB7p l\u1EA1i l\u1EA7n 2 li\u1EC1u 10 ml/kg/h."
      },
      {
        stageName: "C\u1EEF 2: Ra s\u1ED1c -> Chuy\u1EC3n \u0111i\u1EC7n gi\u1EA3i RL/NaCl 10 ml/kg/h trong 2 gi\u1EDD",
        fluidKind: "crystalloid",
        defaultRateMlKgH: 10,
        rateOptions: [10],
        defaultDurationHours: 2,
        durationOptions: [1, 2],
        hctCheckRequired: true,
        notes: "Chu\u1EA9n Ph\u1EE5 l\u1EE5c 16.1: Ra s\u1ED1c chuy\u1EC3n ngay \u0111i\u1EC7n gi\u1EA3i 10 ml/kg/h trong 2 gi\u1EDD (h\u1EA1n ch\u1EBF t\u1ED1i \u0111a d\xF9ng CPT k\xE9o d\xE0i \u1EDF ng\u01B0\u1EDDi l\u1EDBn)."
      },
      {
        stageName: "C\u1EEF 3: Gi\u1EA3m \u0111i\u1EC7n gi\u1EA3i xu\u1ED1ng 6 ml/kg/h trong 2 gi\u1EDD",
        fluidKind: "crystalloid",
        defaultRateMlKgH: 6,
        rateOptions: [6],
        defaultDurationHours: 2,
        durationOptions: [2],
        hctCheckRequired: false,
        notes: "L\u1EAFng nghe ran \u1EA9m \u0111\xE1y ph\u1ED5i."
      },
      {
        stageName: "C\u1EEF 4: Gi\u1EA3m \u0111i\u1EC7n gi\u1EA3i xu\u1ED1ng 3 ml/kg/h trong 5 - 7 gi\u1EDD",
        fluidKind: "crystalloid",
        defaultRateMlKgH: 3,
        rateOptions: [3],
        defaultDurationHours: 5,
        durationOptions: [5, 6, 7],
        hctCheckRequired: true,
        notes: "Ki\u1EC3m tra Hct v\xE0 n\u01B0\u1EDBc ti\u1EC3u."
      },
      {
        stageName: "C\u1EEF 5: Duy tr\xEC 1.5 ml/kg/h trong 12 gi\u1EDD & Cai d\u1ECBch",
        fluidKind: "crystalloid",
        defaultRateMlKgH: 1.5,
        rateOptions: [1.5],
        defaultDurationHours: 12,
        durationOptions: [6, 12, 18],
        hctCheckRequired: true,
        notes: "Ng\u01B0ng d\u1ECBch an to\xE0n khi l\xE2m s\xE0ng v\xE0 Hct \u1ED5n \u0111\u1ECBnh."
      }
    ]
  };
  var DENGUE_DE_ESCALATION_CHECKLIST = [
    "B\u1EC7nh nh\xE2n t\u1EC9nh t\xE1o, ti\u1EBFp x\xFAc t\u1ED1t",
    "Chi \u1EA5m, th\u1EDDi gian \u0111\u1ED5 \u0111\u1EA7y mao m\u1EA1ch (CRT) b\xECnh th\u01B0\u1EDDng < 2 gi\xE2y",
    "M\u1EA1ch r\xF5 v\xE0 huy\u1EBFt \xE1p b\xECnh th\u01B0\u1EDDng theo tu\u1ED5i (MAP: \u22641T \u226550, \u226410T \u226560, >10T \u226565 mmHg)",
    "L\u01B0u l\u01B0\u1EE3ng n\u01B0\u1EDBc ti\u1EC3u > 0.5 ml/kg/gi\u1EDD",
    "Hct gi\u1EA3m v\u1EC1 b\xECnh th\u01B0\u1EDDng ho\u1EB7c h\u1EBFt c\xF4 \u0111\u1EB7c m\xE1u",
    "\xC1p l\u1EF1c t\u0129nh m\u1EA1ch trung t\xE2m (CVP) trong kho\u1EA3ng 10 - 15 cmH2O (n\u1EBFu c\xF3 \u0111o CVP)",
    "ScvO2 \u2265 70% ho\u1EB7c Lactate m\xE1u b\xECnh th\u01B0\u1EDDng < 2.0 mmol/L (n\u1EBFu c\xF3 x\xE9t nghi\u1EC7m)"
  ];

  // dengue/dengue-engine.ts
  function classifyAgeGroup(ageYears) {
    if (ageYears >= 16) return "adult";
    if (ageYears >= 13) return "adolescent";
    return "child";
  }
  function calculateWeightAdjustment(ageYears, gender, actualWeightKg, heightCm) {
    const isAdult = ageYears >= 16;
    const stdWeight = getCDCStandardWeight(Math.min(16, ageYears), gender);
    if (isAdult) {
      if (heightCm && heightCm >= 100) {
        const heightM = heightCm / 100;
        const bmi = Math.round(actualWeightKg / (heightM * heightM) * 10) / 10;
        const isBmiOverweight = bmi >= 25;
        const ibwRaw = gender === "male" ? 50 + 0.91 * (heightCm - 152.4) : 45.5 + 0.91 * (heightCm - 152.4);
        const ibw = Math.round(ibwRaw * 10) / 10;
        if (!isBmiOverweight) {
          return {
            actualWeightKg,
            standardWeightKg: ibw,
            isObese: false,
            ratioToStandard: Math.round(actualWeightKg / ibw * 100) / 100,
            adjustedWeightKg: actualWeightKg,
            bmi,
            idealWeightKg: ibw,
            isAdultMethod: true,
            tableRoundedWeightKg: actualWeightKg,
            formulaNote: `Ng\u01B0\u1EDDi l\u1EDBn BMI = ${bmi} kg/m\xB2 (< 25): S\u1EED d\u1EE5ng c\xE2n n\u1EB7ng th\u1EF1c t\u1EBF ${actualWeightKg} kg theo Ph\u1EE5 l\u1EE5c 9 Q\u0110 2760/BYT.`
          };
        } else {
          const adjBwRaw = ibwRaw + 0.4 * (actualWeightKg - ibwRaw);
          const adjBw = Math.round(adjBwRaw * 10) / 10;
          const tableRounded = Math.round(Math.round(adjBwRaw * 10) / 10);
          const adjustedWeightKg2 = Math.max(ibw, Math.min(actualWeightKg, adjBw));
          return {
            actualWeightKg,
            standardWeightKg: ibw,
            isObese: true,
            ratioToStandard: Math.round(actualWeightKg / ibw * 100) / 100,
            adjustedWeightKg: adjustedWeightKg2,
            bmi,
            idealWeightKg: ibw,
            isAdultMethod: true,
            tableRoundedWeightKg: tableRounded,
            formulaNote: `Ng\u01B0\u1EDDi l\u1EDBn BMI = ${bmi} kg/m\xB2 (\u2265 25: Th\u1EEBa c\xE2n/B\xE9o ph\xEC) \u279C D\xF9ng CN hi\u1EC7u ch\u1EC9nh Ph\u1EE5 l\u1EE5c 9 BYT: IBW = ${ibw} kg; CN hi\u1EC7u ch\u1EC9nh = ${adjustedWeightKg2} kg (B\u1EA3ng tra l\xE0m tr\xF2n: ${tableRounded} kg).`,
            warningText: `Ng\u01B0\u1EDDi l\u1EDBn th\u1EC3 tr\u1ECDng l\u1EDBn (BMI ${bmi} kg/m\xB2 \u2265 25): B\u1EAFt bu\u1ED9c d\xF9ng C\xE2n N\u1EB7ng Hi\u1EC7u Ch\u1EC9nh ${adjustedWeightKg2} kg (B\u1EA3ng tra l\xE0m tr\xF2n: ${tableRounded} kg) \u0111\u1EC3 t\xEDnh d\u1ECBch b\xF9 ch\u1ED1ng s\u1ED1c. Ph\u1EA3i gi\xE1m s\xE1t ch\u1EB7t ch\u1EBD CVP, SpO2 v\xE0 ran \u0111\xE1y ph\u1ED5i khi b\xF9 d\u1ECBch.`
          };
        }
      } else {
        return {
          actualWeightKg,
          standardWeightKg: stdWeight,
          isObese: false,
          ratioToStandard: Math.round(actualWeightKg / stdWeight * 100) / 100,
          adjustedWeightKg: actualWeightKg,
          formulaNote: `Ng\u01B0\u1EDDi l\u1EDBn (\u2265 16T): Ch\u01B0a nh\u1EADp chi\u1EC1u cao \u0111\u1EC3 t\xEDnh BMI. T\u1EA1m d\xF9ng C\xE2n n\u1EB7ng th\u1EF1c t\u1EBF ${actualWeightKg} kg (Khuy\u1EBFn c\xE1o nh\u1EADp chi\u1EC1u cao \u0111\u1EC3 CDSS t\xEDnh ch\xEDnh x\xE1c theo Ph\u1EE5 l\u1EE5c 9).`,
          warningText: `Khuy\u1EBFn c\xE1o: Ng\u01B0\u1EDDi l\u1EDBn c\u1EA7n nh\u1EADp Chi\u1EC1u cao (cm) \u0111\u1EC3 x\xE1c \u0111\u1ECBnh ch\u1EC9 s\u1ED1 BMI v\xE0 t\xEDnh C\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh ch\xEDnh x\xE1c theo Ph\u1EE5 l\u1EE5c 9 Q\u0110 2760/BYT.`,
          isAdultMethod: true,
          tableRoundedWeightKg: actualWeightKg
        };
      }
    }
    const ratio = actualWeightKg / stdWeight;
    const isObese = ratio > 1.2;
    let adjustedWeightKg = actualWeightKg;
    let formulaNote = `Tr\u1EBB em: C\xE2n n\u1EB7ng th\u1EF1c t\u1EBF ${actualWeightKg} kg (${Math.round(ratio * 100)}% so v\u1EDBi chu\u1EA9n tu\u1ED5i CDC 2014: ${stdWeight} kg, th\u1EC3 tr\u1EA1ng b\xECnh th\u01B0\u1EDDng).`;
    let warningText = void 0;
    if (isObese) {
      adjustedWeightKg = stdWeight;
      formulaNote = `Tr\u1EBB em d\u01B0 c\xE2n/b\xE9o ph\xEC (${Math.round(ratio * 100)}% chu\u1EA9n tu\u1ED5i): \xC1p d\u1EE5ng C\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh theo B\u1EA3ng CDC 2014 (${stdWeight} kg) cho nh\u1EEFng gi\u1EDD \u0111\u1EA7u (Ph\u1EE5 l\u1EE5c 9 - Q\u0110 2760/Q\u0110-BYT).`;
      warningText = `C\u1EA3nh b\xE1o: Tr\u1EBB th\u1EEBa c\xE2n / b\xE9o ph\xEC (${actualWeightKg} kg = ${Math.round(ratio * 100)}% so v\u1EDBi chu\u1EA9n CDC 2014 ${stdWeight} kg). Khuy\u1EBFn c\xE1o \xE1p d\u1EE5ng t\xEDnh c\xE2n n\u1EB7ng b\xF9 d\u1ECBch cho tr\u1EBB em d\u01B0 c\xE2n, b\xE9o ph\xEC n\xE0y ch\u1EC9 \u01B0\u1EDBc t\xEDnh cho nh\u1EEFng gi\u1EDD \u0111\u1EA7u v\xE0 n\xEAn \u0111o \xE1p l\u1EF1c t\u0129nh m\u1EA1ch trung t\xE2m (CVP) \u0111\u1EC3 theo d\xF5i trong khi b\xF9 d\u1ECBch.`;
    }
    return {
      actualWeightKg,
      standardWeightKg: stdWeight,
      isObese,
      ratioToStandard: Math.round(ratio * 100) / 100,
      adjustedWeightKg,
      formulaNote,
      warningText,
      isAdultMethod: false,
      tableRoundedWeightKg: adjustedWeightKg
    };
  }
  function addHoursToTime(startTimeStr, hoursToAdd) {
    const [hStr, mStr] = startTimeStr.split(":");
    let totalMinutes = parseInt(hStr || "8", 10) * 60 + parseInt(mStr || "0", 10) + Math.round(hoursToAdd * 60);
    totalMinutes = (totalMinutes % (24 * 60) + 24 * 60) % (24 * 60);
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
  }
  function calculateFluidSchedule(patient, effectiveWeightKg, customDurations) {
    const ageGroup = classifyAgeGroup(patient.ageYears);
    const templates = DENGUE_FLUID_TEMPLATES[patient.severity][ageGroup];
    let currentClock = patient.startTime || "08:00";
    let carryingFluidMl = 0;
    let totalVolumeMl = 0;
    let totalDurationHours = 0;
    const rows = [];
    templates.forEach((tpl, idx) => {
      const duration = customDurations?.[idx] !== void 0 ? customDurations[idx] : tpl.defaultDurationHours;
      const rate = tpl.defaultRateMlKgH;
      const neededMl = Math.round(rate * effectiveWeightKg * duration);
      totalVolumeMl += neededMl;
      totalDurationHours += duration;
      const isPediatric = ageGroup === "child";
      const dropsPerMin = isPediatric ? Math.round(rate * effectiveWeightKg) : Math.round(rate * effectiveWeightKg / 3);
      const endClock = addHoursToTime(currentClock, duration);
      const timeWindow = `${currentClock} - ${endClock} (${duration}h)`;
      const existingFluidMl = carryingFluidMl;
      const deficitMl = Math.max(0, neededMl - existingFluidMl);
      const bottlesToHang = Math.ceil(deficitMl / 500);
      const addedFluidMl = bottlesToHang * 500;
      const totalAtPoleMl = existingFluidMl + addedFluidMl;
      carryingFluidMl = Math.max(0, totalAtPoleMl - neededMl);
      rows.push({
        stepIndex: idx + 1,
        stageName: tpl.stageName,
        durationHours: duration,
        rateMlKgH: rate,
        dropsPerMin,
        totalMl: neededMl,
        timeWindow,
        existingFluidMl,
        bottlesToHang,
        bottleType: "500ml",
        totalAtPoleMl,
        monitoringNotes: tpl.notes,
        hctCheckRequired: tpl.hctCheckRequired
      });
      currentClock = endClock;
    });
    return { rows, totalVolumeMl, totalDurationHours };
  }
  function calculateColloidSchedule(patient, effectiveWeightKg, selectedColloid = "dextran40", customDurations) {
    const ageGroup = classifyAgeGroup(patient.ageYears);
    const templates = DENGUE_COLLOID_TEMPLATES[ageGroup];
    const meta = DENGUE_COLLOID_METADATA[selectedColloid] || DENGUE_COLLOID_METADATA.dextran40;
    let currentClock = patient.startTime || "08:00";
    let carryingFluidMl = 0;
    let cumulativeColloidMl = 0;
    const safeLimitVolumeMl = Math.round(60 * effectiveWeightKg);
    const rows = [];
    templates.forEach((tpl, idx) => {
      const duration = customDurations?.[idx] !== void 0 ? customDurations[idx] : tpl.defaultDurationHours;
      const rate = tpl.defaultRateMlKgH;
      const stepVolumeMl = Math.round(rate * effectiveWeightKg * duration);
      if (tpl.fluidKind === "colloid") {
        cumulativeColloidMl += stepVolumeMl;
      }
      const cumulativeColloidMlPerKg = Math.round(cumulativeColloidMl / effectiveWeightKg * 10) / 10;
      const exceedsThreshold = cumulativeColloidMlPerKg >= 60;
      const isPediatric = ageGroup === "child";
      const dropsPerMin = isPediatric ? Math.round(rate * effectiveWeightKg) : Math.round(rate * effectiveWeightKg / 3);
      const endClock = addHoursToTime(currentClock, duration);
      const timeWindow = `${currentClock} - ${endClock} (${duration}h)`;
      const existingFluidMl = carryingFluidMl;
      const deficitMl = Math.max(0, stepVolumeMl - existingFluidMl);
      const bottlesToHang = Math.ceil(deficitMl / 500);
      const addedFluidMl = bottlesToHang * 500;
      const totalAtPoleMl = existingFluidMl + addedFluidMl;
      carryingFluidMl = Math.max(0, totalAtPoleMl - stepVolumeMl);
      rows.push({
        stepIndex: idx + 1,
        stageName: tpl.stageName,
        fluidKind: tpl.fluidKind,
        fluidName: tpl.fluidKind === "colloid" ? meta.shortName : "Ringer Lactate / NaCl 0.9%",
        durationHours: duration,
        rateMlKgH: rate,
        dropsPerMin,
        stepVolumeMl,
        cumulativeColloidMl,
        cumulativeColloidMlPerKg,
        timeWindow,
        bottlesToHang,
        totalAtPoleMl,
        monitoringNotes: tpl.notes,
        hctCheckRequired: tpl.hctCheckRequired,
        exceedsThreshold
      });
      currentClock = endClock;
    });
    const totalColloidMlPerKg = Math.round(cumulativeColloidMl / effectiveWeightKg * 10) / 10;
    const isOverLimit = totalColloidMlPerKg >= 60;
    const remainingSafeMl = Math.max(0, safeLimitVolumeMl - cumulativeColloidMl);
    return {
      colloidType: selectedColloid,
      colloidName: meta.name,
      rows,
      totalColloidVolumeMl: cumulativeColloidMl,
      totalColloidMlPerKg,
      safeLimitVolumeMl,
      remainingSafeMl,
      isOverLimit,
      albuminRecommended: isOverLimit,
      deEscalationCriteria: DENGUE_DE_ESCALATION_CHECKLIST
    };
  }
  function evaluateVasopressorAlgorithm(profile, effectiveWeightKg, ageYears) {
    const isAdult = ageYears >= 16;
    const fluidTestMl = Math.round(5 * effectiveWeightKg);
    if (profile.cvpLevel === "low_normal") {
      return {
        primaryDrug: "Ch\u01B0a \u01B0u ti\xEAn v\u1EADn m\u1EA1ch \u2014 C\u1EA7n Test d\u1ECBch CPT tr\u01B0\u1EDBc",
        primaryDose: "Test d\u1ECBch CPT: 5 ml/kg trong 30 ph\xFAt",
        primaryPumpRateMlH: `${Math.round(10 * effectiveWeightKg)} ml/h trong 30 ph\xFAt`,
        secondaryDrug: "Cao Ph\xE2n T\u1EED 10 - 20 ml/kg/h",
        fluidAction: `B\u01A1m Test D\u1ECBch Cao Ph\xE2n T\u1EED ${fluidTestMl} ml (5 ml/kg) truy\u1EC1n t\u0129nh m\u1EA1ch nhanh trong 30 ph\xFAt. Theo d\xF5i s\xE1t \u0394CVP v\xE0 huy\u1EBFt \xE1p.`,
        clinicalRationale: "CVP \u2264 15 cmH2O ch\u1EE9ng t\u1ECF th\u1EC3 t\xEDch l\xF2ng m\u1EA1ch c\xF2n thi\u1EBFu h\u1EE5t do th\u1EA5t tho\xE1t huy\u1EBFt t\u01B0\u01A1ng li\xEAn t\u1EE5c. D\xF9ng v\u1EADn m\u1EA1ch \u0111\u01A1n thu\u1EA7n khi ch\u01B0a b\xF9 \u0111\u1EE7 d\u1ECBch s\u1EBD g\xE2y co m\u1EA1ch ngo\u1EA1i bi\xEAn n\u1EB7ng, ho\u1EA1i t\u1EED chi v\xE0 suy th\u1EADn.",
        fluidTestMl,
        monitoringDirectives: [
          `Truy\u1EC1n test Cao ph\xE2n t\u1EED ${fluidTestMl} ml trong 30 ph\xFAt.`,
          "N\u1EBFu \u0394CVP t\u0103ng \u2265 5 cmH2O ho\u1EB7c huy\u1EBFt \xE1p c\u1EA3i thi\u1EC7n: ti\u1EBFp t\u1EE5c truy\u1EC1n CPT 10 - 20 ml/kg/h.",
          "N\u1EBFu t\u1ED5ng li\u1EC1u CPT \u2265 60 ml/kg m\xE0 c\xF2n s\u1ED1c: xem x\xE9t b\xF9 Albumin 5% ho\u1EB7c 10% (Trang 20 Q\u0110 2760).",
          "N\u1EBFu \u0394CVP t\u0103ng nhanh m\xE0 kh\xF4ng c\u1EA3i thi\u1EC7n huy\u1EBFt \xE1p: chuy\u1EC3n sang nh\xE1nh \u0111\xE1nh gi\xE1 suy tim / d\u1ECDa ph\xF9 ph\u1ED5i."
        ]
      };
    }
    if (profile.isOverloaded) {
      return {
        primaryDrug: "Dobutamin",
        primaryDose: "3 - 10 \xB5g/kg/ph\xFAt",
        primaryPumpRateMlH: "3 - 10 ml/gi\u1EDD tr\xEAn b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml",
        secondaryDrug: "Furosemide 0.5 - 1 mg/kg TM ch\u1EADm",
        fluidAction: "NG\u01AFNG D\u1ECACH TRUY\u1EC0N T\u0128NH M\u1EA0CH NGAY L\u1EACP T\u1EE8C. N\u1EB1m \u0111\u1EA7u cao 30 - 45\xB0, th\u1EDF NCPAP.",
        clinicalRationale: "CVP > 15 cmH2O k\xE8m d\u1EA5u hi\u1EC7u qu\xE1 t\u1EA3i tu\u1EA7n ho\xE0n / ph\xF9 ph\u1ED5i c\u1EA5p. B\u1EAFt bu\u1ED9c ng\u01B0ng n\u1EA1p d\u1ECBch v\xE0 d\xF9ng Dobutamin \u0111\u1EC3 t\u0103ng co b\xF3p c\u01A1 tim, gi\u1EA3m \xE1p l\u1EF1c mao m\u1EA1ch ph\u1ED5i b\xEDt k\u1EBFt h\u1EE3p l\u1EE3i ti\u1EC3u Furosemide.",
        fluidTestMl: 0,
        monitoringDirectives: [
          "Ng\u01B0ng ho\xE0n to\xE0n d\u1ECBch truy\u1EC1n t\u0129nh m\u1EA1ch.",
          "B\u01A1m ti\xEAm \u0111i\u1EC7n Dobutamin kh\u1EDFi \u0111\u1EA7u 3 - 5 ml/h, ch\u1EC9nh li\u1EC1u m\u1ED7i 15 ph\xFAt theo SpO2 v\xE0 ran ph\u1ED5i.",
          `Furosemide ${Math.round(0.5 * effectiveWeightKg)} - ${Math.round(1 * effectiveWeightKg)} mg TM ch\u1EADm khi huy\u1EBFt \xE1p t\xE2m thu \u1ED5n \u0111\u1ECBnh.`,
          "\u0110o \xE1p l\u1EF1c b\xE0ng quang gi\xE1n ti\u1EBFp \u0111o \xE1p l\u1EF1c \u1ED5 b\u1EE5ng; xem x\xE9t ch\u1ECDc gi\u1EA3i \xE1p m\xE0ng b\u1EE5ng n\u1EBFu \xE1p l\u1EF1c > 27 cmH2O."
        ]
      };
    }
    if (profile.cardiacContractility === "reduced") {
      return {
        primaryDrug: isAdult ? "Dobutamin ho\u1EB7c Noradrenalin" : "Dopamin",
        primaryDose: isAdult ? "Dobutamin 5 - 10 \xB5g/kg/ph\xFAt" : "Dopamin 5 - 10 \xB5g/kg/ph\xFAt",
        primaryPumpRateMlH: "5 - 10 ml/gi\u1EDD tr\xEAn b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml",
        secondaryDrug: "Dobutamin 3 - 10 \xB5g/kg/ph\xFAt",
        secondaryDose: "3 - 10 \xB5g/kg/ph\xFAt (ph\u1ED1i h\u1EE3p)",
        secondaryPumpRateMlH: "3 - 10 ml/gi\u1EDD",
        rescueDrug: "Adrenalin 0.05 - 0.3 \xB5g/kg/ph\xFAt (0.5 - 3 ml/gi\u1EDD)",
        fluidAction: "H\u1EA1n ch\u1EBF d\u1ECBch truy\u1EC1n t\u1ED1i \u0111a. Kh\xF4ng bolus d\u1ECBch nhanh khi CVP > 15 cmH2O.",
        clinicalRationale: "Suy ch\u1EE9c n\u0103ng co b\xF3p c\u01A1 tim trong s\u1ED1c Dengue k\xE9o d\xE0i ho\u1EB7c vi\xEAm c\u01A1 tim Dengue. \u01AFu ti\xEAn Dopamin/Dobutamin \u0111\u1EC3 c\u1EA3i thi\u1EC7n cung l\u01B0\u1EE3ng tim. N\u1EBFu v\u1EABn tr\u01A1 ph\u1ED1i h\u1EE3p Adrenalin c\u1EE9u nguy.",
        fluidTestMl: 0,
        monitoringDirectives: [
          "Theo d\xF5i li\xEAn t\u1EE5c monitor ECG t\xECm r\u1ED1i lo\u1EA1n nh\u1ECBp nhanh ho\u1EB7c nh\u1ECBp ch\u1EADm.",
          "Si\xEAu \xE2m tim t\u1EA1i gi\u01B0\u1EDDng \u0111\xE1nh gi\xE1 EF, \u0111\u01B0\u1EDDng k\xEDnh th\u1EA5t tr\xE1i v\xE0 tr\xE0n d\u1ECBch m\xE0ng ngo\xE0i tim.",
          "N\u1EBFu huy\u1EBFt \xE1p v\u1EABn k\u1EB9t sau khi t\u0103ng Dopamin \u0111\u1EBFn 10 \xB5g/kg/ph\xFAt: ph\u1ED1i h\u1EE3p Adrenalin 0.05 - 0.3 \xB5g/kg/ph\xFAt."
        ]
      };
    }
    if (profile.vascularTone === "low_warm_shock") {
      const noraMaxMlH = isAdult ? 10 : 3;
      return {
        primaryDrug: "Noradrenalin",
        primaryDose: isAdult ? "0.05 - 1.0 \xB5g/kg/ph\xFAt" : "0.05 - 0.3 \xB5g/kg/ph\xFAt",
        primaryPumpRateMlH: `0.5 - ${noraMaxMlH} ml/gi\u1EDD tr\xEAn b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml`,
        secondaryDrug: "Dobutamin 3 - 10 \xB5g/kg/ph\xFAt (n\u1EBFu k\xE8m gi\u1EA3m co b\xF3p c\u01A1 tim)",
        fluidAction: "Duy tr\xEC d\u1ECBch truy\u1EC1n t\u1ED1c \u0111\u1ED9 an to\xE0n theo d\xF5i s\xE1t CVP v\xE0 ScvO2.",
        clinicalRationale: "S\u1ED1c c\xF3 bi\u1EC3u hi\u1EC7n gi\u1EA3m kh\xE1ng l\u1EF1c m\u1EA1ch h\u1EC7 th\u1ED1ng (HA t\xE2m tr\u01B0\u01A1ng t\u1EE5t s\xE2u, hi\u1EC7u \xE1p r\u1ED9ng, chi \u1EA5m). Noradrenalin l\xE0 thu\u1ED1c co m\u1EA1ch m\u1EA1nh ch\u1ECDn l\u1EF1a h\xE0ng \u0111\u1EA7u \u0111\u1EC3 ph\u1EE5c h\u1ED3i tr\u01B0\u01A1ng l\u1EF1c m\u1EA1ch v\xE0 n\xE2ng MAP.",
        fluidTestMl: 0,
        monitoringDirectives: [
          "B\u1EAFt bu\u1ED9c truy\u1EC1n qua t\u0129nh m\u1EA1ch l\u1EDBn ho\u1EB7c catheter t\u0129nh m\u1EA1ch trung t\xE2m tr\xE1nh ho\u1EA1i t\u1EED m\xF4 do tho\xE1t m\u1EA1ch.",
          "M\u1EE5c ti\xEAu MAP: Tr\u1EBB \u2264 1T \u2265 50, \u2264 10T \u2265 60, > 10T & Ng\u01B0\u1EDDi l\u1EDBn \u2265 65 mmHg.",
          "\u0110i\u1EC1u ch\u1EC9nh t\u1ED1c \u0111\u1ED9 b\u01A1m m\u1ED7i 5 - 10 ph\xFAt \u0111\u1EC3 \u0111\u1EA1t MAP \u0111\xEDch."
        ]
      };
    }
    return {
      primaryDrug: isAdult ? "Noradrenalin" : "Dopamin",
      primaryDose: isAdult ? "0.05 - 0.3 \xB5g/kg/ph\xFAt" : "5 - 10 \xB5g/kg/ph\xFAt",
      primaryPumpRateMlH: isAdult ? "0.5 - 3 ml/gi\u1EDD" : "5 - 10 ml/gi\u1EDD",
      secondaryDrug: "Dobutamin 3 - 10 \xB5g/kg/ph\xFAt",
      fluidAction: "Ng\u01B0ng d\u1ECBch n\u1EBFu CVP ti\u1EBFp t\u1EE5c t\u0103ng; \u0111\xE1nh gi\xE1 l\u1EA1i ch\u1EE9c n\u0103ng tim ph\u1ED5i.",
      clinicalRationale: "CVP > 15 cmH2O cho th\u1EA5y ti\u1EC1n t\u1EA3i \u0111\xE3 \u0111\u1EA7y. C\u1EA7n h\u1ED7 tr\u1EE3 co b\xF3p v\xE0 tr\u01B0\u01A1ng l\u1EF1c m\u1EA1ch b\u1EB1ng v\u1EADn m\u1EA1ch.",
      fluidTestMl: 0,
      monitoringDirectives: [
        "\u0110o CVP m\u1ED7i 1 - 2 gi\u1EDD.",
        "Kh\xED m\xE1u \u0111\u1ED9ng m\u1EA1ch ki\u1EC3m tra Lactate v\xE0 th\u0103ng b\u1EB1ng toan ki\u1EC1m.",
        "Duy tr\xEC l\u01B0\u1EE3ng n\u01B0\u1EDBc ti\u1EC3u \u2265 0.5 - 1 ml/kg/h."
      ]
    };
  }
  function calculatePumpRateFromDose(drugName, doseMcgKgMin) {
    const drug = drugName.toLowerCase();
    if (drug.includes("noradrenalin") || drug.includes("adrenalin")) {
      return Math.round(doseMcgKgMin / 0.1 * 10) / 10;
    }
    return Math.round(doseMcgKgMin * 10) / 10;
  }
  function calculateDoseFromPumpRate(drugName, rateMlH) {
    const drug = drugName.toLowerCase();
    if (drug.includes("noradrenalin") || drug.includes("adrenalin")) {
      return Math.round(rateMlH * 0.1 * 100) / 100;
    }
    return Math.round(rateMlH * 10) / 10;
  }
  function calculateVasopressorDoses(effectiveWeightKg) {
    const dopaminTotalMg = Math.round(3 * effectiveWeightKg * 10) / 10;
    const dopamin = {
      drugName: "Dopamin",
      patientWeightKg: effectiveWeightKg,
      calculationFormula: "T\u1ED5ng li\u1EC1u Dopamin (mg) = 3 \xD7 C\xE2n n\u1EB7ng (kg) pha \u0111\u1EE7 50ml G5%",
      totalMg: dopaminTotalMg,
      diluentSolution: "Glucose 5% ho\u1EB7c NaCl 0.9%",
      syringeVolumeMl: 50,
      infusionEquivalent: "T\u1ED1c \u0111\u1ED9 1 ml/gi\u1EDD = Li\u1EC1u 1 \xB5g/kg/ph\xFAt",
      standardDoseRange: "5 - 10 \xB5g/kg/ph\xFAt (t\u1ED1i \u0111a 20 \xB5g/kg/ph\xFAt)",
      recommendedPumpRateMlH: "5 - 10 ml/gi\u1EDD tr\xEAn b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml",
      clinicalIndications: "Thu\u1ED1c v\u1EADn m\u1EA1ch ch\u1ECDn l\u1EF1a \u0111\u1EA7u ti\xEAn khi s\u1ED1c k\xE9o d\xE0i, s\u1ED1c tr\u01A1 d\u1ECBch k\xE8m CVP > 10 cmH2O ho\u1EB7c %PPV/SVV < 15%.",
      precautions: "Kh\xF4ng pha chung v\u1EDBi dung d\u1ECBch ki\u1EC1m (Natri Bicarbonat). Theo d\xF5i li\xEAn t\u1EE5c nh\u1ECBp tim tr\xEAn monitor, gi\u1EA3m li\u1EC1u khi lo\u1EA1n nh\u1ECBp nhanh."
    };
    const noradrenalinTotalMg = Math.round(0.3 * effectiveWeightKg * 100) / 100;
    const noradrenalin = {
      drugName: "Noradrenalin",
      patientWeightKg: effectiveWeightKg,
      calculationFormula: "T\u1ED5ng li\u1EC1u Noradrenalin (mg) = 0.3 \xD7 C\xE2n n\u1EB7ng (kg) pha \u0111\u1EE7 50ml G5%",
      totalMg: noradrenalinTotalMg,
      diluentSolution: "Glucose 5% v\u1EEBa \u0111\u1EE7 50ml",
      syringeVolumeMl: 50,
      infusionEquivalent: "T\u1ED1c \u0111\u1ED9 1 ml/gi\u1EDD = Li\u1EC1u 0.1 \xB5g/kg/ph\xFAt",
      standardDoseRange: "0.05 - 1.0 \xB5g/kg/ph\xFAt (tr\u1EBB em: 0.05 - 0.3 \xB5g/kg/ph\xFAt)",
      recommendedPumpRateMlH: "0.5 - 5 ml/gi\u1EDD tr\xEAn b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml (ch\u1EC9nh theo MAP \u0111\xEDch)",
      clinicalIndications: "Ch\u1EC9 \u0111\u1ECBnh khi s\u1ED1c SXHD c\xF3 gi\u1EA3m kh\xE1ng l\u1EF1c m\u1EA1ch h\u1EC7 th\u1ED1ng (HA t\xE2m tr\u01B0\u01A1ng t\u1EE5t, s\u1ED1c \u1EA5m) ho\u1EB7c th\u1EA5t b\u1EA1i v\u1EDBi Dopamin.",
      precautions: "B\u1EAFt bu\u1ED9c truy\u1EC1n qua t\u0129nh m\u1EA1ch l\u1EDBn ho\u1EB7c catheter t\u0129nh m\u1EA1ch trung t\xE2m. Nguy c\u01A1 ho\u1EA1i t\u1EED m\xF4 n\u1EBFu tho\xE1t m\u1EA1ch."
    };
    const dobutaminTotalMg = Math.round(3 * effectiveWeightKg * 10) / 10;
    const dobutamin = {
      drugName: "Dobutamin",
      patientWeightKg: effectiveWeightKg,
      calculationFormula: "T\u1ED5ng li\u1EC1u Dobutamin (mg) = 3 \xD7 C\xE2n n\u1EB7ng (kg) pha \u0111\u1EE7 50ml G5%",
      totalMg: dobutaminTotalMg,
      diluentSolution: "Glucose 5% ho\u1EB7c NaCl 0.9%",
      syringeVolumeMl: 50,
      infusionEquivalent: "T\u1ED1c \u0111\u1ED9 1 ml/gi\u1EDD = Li\u1EC1u 1 \xB5g/kg/ph\xFAt",
      standardDoseRange: "3 - 10 \xB5g/kg/ph\xFAt (t\u1ED1i \u0111a 15 \xB5g/kg/ph\xFAt)",
      recommendedPumpRateMlH: "3 - 10 ml/gi\u1EDD tr\xEAn b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml",
      clinicalIndications: "Ch\u1EC9 \u0111\u1ECBnh khi suy tim c\u1EA5p do qu\xE1 t\u1EA3i d\u1ECBch, ph\xF9 ph\u1ED5i c\u1EA5p ho\u1EB7c s\u1ED1c tim tr\u01A1 Dopamin k\xE8m CVP > 15 cmH2O.",
      precautions: "C\xF3 th\u1EC3 g\xE2y t\u1EE5t huy\u1EBFt \xE1p n\u1EBFu ch\u01B0a b\xF9 \u0111\u1EE7 th\u1EC3 t\xEDch tu\u1EA7n ho\xE0n. Theo d\xF5i SpO2 v\xE0 nghe tim ph\u1ED5i."
    };
    const adrenalinTotalMg = Math.round(0.3 * effectiveWeightKg * 100) / 100;
    const adrenalin = {
      drugName: "Adrenalin",
      patientWeightKg: effectiveWeightKg,
      calculationFormula: "T\u1ED5ng li\u1EC1u Adrenalin (mg) = 0.3 \xD7 C\xE2n n\u1EB7ng (kg) pha \u0111\u1EE7 50ml G5%",
      totalMg: adrenalinTotalMg,
      diluentSolution: "Glucose 5% v\u1EEBa \u0111\u1EE7 50ml",
      syringeVolumeMl: 50,
      infusionEquivalent: "T\u1ED1c \u0111\u1ED9 1 ml/gi\u1EDD = Li\u1EC1u 0.1 \xB5g/kg/ph\xFAt",
      standardDoseRange: "0.05 - 0.3 \xB5g/kg/ph\xFAt",
      recommendedPumpRateMlH: "0.5 - 3 ml/gi\u1EDD tr\xEAn b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml",
      clinicalIndications: "Ch\u1EC9 \u0111\u1ECBnh khi s\u1ED1c SXHD tr\u01A1 Dopamin v\xE0 Dobutamin k\xE8m gi\u1EA3m s\u1EE9c co b\xF3p c\u01A1 tim, nh\u1ECBp ch\u1EADm ho\u1EB7c ng\u1EEBng tu\u1EA7n ho\xE0n.",
      precautions: "Theo d\xF5i monitor li\xEAn t\u1EE5c; nguy c\u01A1 t\u0103ng \u0111\u01B0\u1EDDng huy\u1EBFt, toan lactic v\xE0 lo\u1EA1n nh\u1ECBp nhanh th\u1EA5t."
    };
    return { dopamin, noradrenalin, dobutamin, adrenalin };
  }
  function calculateBloodProducts(patient, effectiveWeightKg) {
    const isAdult = patient.ageYears >= 16;
    const hclMinMl = Math.round(5 * effectiveWeightKg);
    const hclMaxMl = Math.round(10 * effectiveWeightKg);
    const wbMinMl = Math.round(10 * effectiveWeightKg);
    const wbMaxMl = Math.round(20 * effectiveWeightKg);
    const ffpMinMl = Math.round(10 * effectiveWeightKg);
    const ffpMaxMl = Math.round(20 * effectiveWeightKg);
    const cryoBags = Math.max(1, Math.ceil(effectiveWeightKg / 6));
    const pltPacks = Math.max(1, Math.ceil(effectiveWeightKg / 5));
    const pltApheresis = Math.max(1, Math.ceil(effectiveWeightKg / 10));
    const items = [
      {
        id: "hcl",
        productName: "Kh\u1ED1i H\u1ED3ng C\u1EA7u L\u1EAFng (HCL)",
        indication: "S\u1ED1c kh\xF4ng c\u1EA3i thi\u1EC7n sau b\xF9 d\u1ECBch 40-60 ml/kg k\xE8m Hct < 35% ho\u1EB7c Hct gi\u1EA3m nhanh > 20% so v\u1EDBi ban \u0111\u1EA7u, ho\u1EB7c xu\u1EA5t huy\u1EBFt ti\xEAu h\xF3a / ph\u1EE7 t\u1EA1ng \u1ED3 \u1EA1t.",
        calculatedDose: isAdult ? `${hclMinMl} - ${hclMaxMl} ml (~${Math.max(1, Math.round(hclMinMl / 250))} - ${Math.max(1, Math.ceil(hclMaxMl / 250))} t\xFAi 250ml)` : `${hclMinMl} - ${hclMaxMl} ml (truy\u1EC1n m\xE1y / b\u01A1m ti\xEAm \u0111i\u1EC7n)`,
        thresholdMet: !!(patient.currentHctPercent && patient.currentHctPercent <= 35) || !!patient.massiveBleeding,
        targetClinical: "Duy tr\xEC Hct m\u1EE5c ti\xEAu t\u1EEB 35% \u0111\u1EBFn 40%, c\u1EA3i thi\u1EC7n huy\u1EBFt \u0111\u1ED9ng, chi \u1EA5m, m\u1EA1ch ch\u1EADm l\u1EA1i.",
        precautions: "Song song truy\u1EC1n Cao ph\xE2n t\u1EED 10 ml/kg/h \u0111\u1EC3 n\xE2ng huy\u1EBFt \xE1p trong l\xFAc ch\u1EDD m\xE1u. L\xE0m ph\u1EA3n \u1EE9ng ch\xE9o t\u1EA1i gi\u01B0\u1EDDng."
      },
      {
        id: "whole_blood",
        productName: "M\xE1u To\xE0n Ph\u1EA7n (L\u1EA5y < 7 ng\xE0y)",
        indication: "Ch\u1EC9 \u0111\u1ECBnh khi m\u1EA5t m\xE1u c\u1EA5p kh\u1ED1i l\u01B0\u1EE3ng l\u1EDBn ho\u1EB7c khi kh\xF4ng c\xF3 s\u1EB5n h\u1ED3ng c\u1EA7u l\u1EAFng.",
        doseFormula: "10 - 20 ml/kg truy\u1EC1n t\u0129nh m\u1EA1ch trong 1 - 2 gi\u1EDD",
        calculatedDose: `${wbMinMl} - ${wbMaxMl} ml`,
        thresholdMet: !!patient.massiveBleeding,
        targetClinical: "B\xF9 th\u1EC3 t\xEDch tu\u1EA7n ho\xE0n v\xE0 ph\u1EE5c h\u1ED3i kh\u1EA3 n\u0103ng mang oxy.",
        precautions: "\u01AFu ti\xEAn d\xF9ng h\u1ED3ng c\u1EA7u l\u1EAFng k\u1EBFt h\u1EE3p d\u1ECBch tinh th\u1EC3/cao ph\xE2n t\u1EED \u0111\u1EC3 tr\xE1nh qu\xE1 t\u1EA3i tu\u1EA7n ho\xE0n."
      },
      {
        id: "ffp",
        productName: "Huy\u1EBFt T\u01B0\u01A1ng T\u01B0\u01A1i \u0110\xF4ng L\u1EA1nh (FFP)",
        indication: "R\u1ED1i lo\u1EA1n \u0111\xF4ng m\xE1u n\u1EB7ng (PT hay aPTT > 1.5 l\u1EA7n ch\u1EE9ng ho\u1EB7c INR > 1.5) k\xE8m xu\u1EA5t huy\u1EBFt n\u1EB7ng, ho\u1EB7c chu\u1EA9n b\u1ECB th\u1EE7 thu\u1EADt x\xE2m l\u1EA5n, ho\u1EB7c truy\u1EC1n m\xE1u kh\u1ED1i l\u01B0\u1EE3ng l\u1EDBn.",
        doseFormula: "10 - 20 ml/kg truy\u1EC1n t\u0129nh m\u1EA1ch trong 2 - 4 gi\u1EDD",
        calculatedDose: `${ffpMinMl} - ${ffpMaxMl} ml (kho\u1EA3ng ${Math.ceil(ffpMinMl / 200)} - ${Math.ceil(ffpMaxMl / 200)} t\xFAi 200ml)`,
        thresholdMet: !!(patient.inrValue && patient.inrValue > 1.5),
        targetClinical: "M\u1EE5c ti\xEAu \u0111\u1EA1t PT/PTc < 1.5, ph\u1EE5c h\u1ED3i c\xE1c y\u1EBFu t\u1ED1 \u0111\xF4ng m\xE1u huy\u1EBFt t\u01B0\u01A1ng.",
        precautions: "R\xE3 \u0111\xF4ng \u0111\xFAng k\u1EF9 thu\u1EADt \u1EDF 37\xB0C v\xE0 d\xF9ng ngay trong v\xF2ng 4 gi\u1EDD."
      },
      {
        id: "cryo",
        productName: "K\u1EBFt T\u1EE7a L\u1EA1nh (Cryoprecipitate)",
        indication: "Xu\u1EA5t huy\u1EBFt n\u1EB7ng k\xE8m Fibrinogen m\xE1u < 1.0 g/L.",
        doseFormula: "1 t\xFAi / 6 kg c\xE2n n\u1EB7ng (m\u1ED7i t\xFAi ch\u1EE9a ~150 mg Fibrinogen)",
        calculatedDose: `${cryoBags} t\xFAi k\u1EBFt t\u1EE7a l\u1EA1nh`,
        thresholdMet: !!(patient.fibrinogenGL && patient.fibrinogenGL < 1),
        targetClinical: "M\u1EE5c ti\xEAu \u0111\u1EA1t Fibrinogen > 1.0 g/L.",
        precautions: "Truy\u1EC1n nhanh ngay sau khi r\xE3 \u0111\xF4ng."
      },
      {
        id: "platelets",
        productName: "Kh\u1ED1i Ti\u1EC3u C\u1EA7u (Ti\u1EC3u c\u1EA7u \u0111\u1EADm \u0111\u1EB7c / G\u1EA1n t\xE1ch)",
        indication: "Ti\u1EC3u c\u1EA7u < 50.000/mm\xB3 k\xE8m xu\u1EA5t huy\u1EBFt n\u1EB7ng ho\u1EB7c chu\u1EA9n b\u1ECB ch\u1ECDc m\xE0ng ph\u1ED5i/b\u1EE5ng; ho\u1EB7c Ti\u1EC3u c\u1EA7u < 5.000/mm\xB3 d\xF9 ch\u01B0a ch\u1EA3y m\xE1u.",
        doseFormula: "1 \u0111\u01A1n v\u1ECB \u0111\u1EADm \u0111\u1EB7c / 5 kg ho\u1EB7c 1 \u0111\u01A1n v\u1ECB g\u1EA1n t\xE1ch (chi\u1EBFt t\xE1ch) / 10 kg",
        calculatedDose: `${pltPacks} \u0111\u01A1n v\u1ECB \u0111\u1EADm \u0111\u1EB7c (ho\u1EB7c ${pltApheresis} kh\u1ED1i ti\u1EC3u c\u1EA7u chi\u1EBFt t\xE1ch)`,
        thresholdMet: !!(patient.plateletsCount && (patient.plateletsCount < 5e3 || patient.massiveBleeding && patient.plateletsCount < 5e4)),
        targetClinical: "M\u1EE5c ti\xEAu TC > 50.000/mm\xB3 khi \u0111ang xu\u1EA5t huy\u1EBFt n\u1EB7ng; TC > 30.000/mm\xB3 khi l\xE0m th\u1EE7 thu\u1EADt.",
        precautions: "Kh\xF4ng truy\u1EC1n ti\u1EC3u c\u1EA7u d\u1EF1 ph\xF2ng khi ch\u01B0a c\xF3 xu\u1EA5t huy\u1EBFt n\u1EB7ng (tr\u1EEB khi TC < 5.000/mm\xB3). Kh\xF4ng d\xF9ng m\xE0ng l\u1ECDc b\u1EA1ch c\u1EA7u chu\u1EA9n cho ti\u1EC3u c\u1EA7u."
      },
      {
        id: "ppi_omeprazole",
        productName: "Thu\u1ED1c \u1EE8c Ch\u1EBF B\u01A1m Proton (Omeprazole / Pantoprazole)",
        indication: "Nghi ng\u1EDD ho\u1EB7c c\xF3 xu\u1EA5t huy\u1EBFt ti\xEAu h\xF3a tr\xEAn, lo\xE9t d\u1EA1 d\xE0y - t\xE1 tr\xE0ng ho\u1EB7c s\u1ED1c SXHD k\xE9o d\xE0i.",
        doseFormula: isAdult ? "Bolus 80 mg TM, sau \u0111\xF3 40 mg m\u1ED7i 12 gi\u1EDD x 3 ng\xE0y" : "1 mg/kg/ng\xE0y ti\xEAm t\u0129nh m\u1EA1ch ch\u1EADm",
        calculatedDose: isAdult ? "80 mg TM bolus, sau \u0111\xF3 40 mg q12h" : `${Math.round(1 * effectiveWeightKg)} mg ti\xEAm t\u0129nh m\u1EA1ch ch\u1EADm`,
        thresholdMet: true,
        targetClinical: "N\xE2ng pH d\u1EA1 d\xE0y > 6.0 gi\xFAp \u1ED5n \u0111\u1ECBnh c\u1EE5c m\xE1u \u0111\xF4ng.",
        precautions: "Kh\xF4ng \u0111\u1EB7t sonde d\u1EA1 d\xE0y qua \u0111\u01B0\u1EDDng m\u0169i; n\u1EBFu c\u1EA7n ch\u1EC9 \u0111\u1EB7t qua \u0111\u01B0\u1EDDng MI\u1EC6NG."
      },
      {
        id: "vitamin_k1",
        productName: "Vitamin K1 (Phytomenadione)",
        indication: "S\u1ED1t xu\u1EA5t huy\u1EBFt Dengue c\xF3 t\u1ED5n th\u01B0\u01A1ng gan n\u1EB7ng, suy gan c\u1EA5p ho\u1EB7c k\xE9o d\xE0i th\u1EDDi gian \u0111\xF4ng m\xE1u.",
        doseFormula: "1 mg/kg ti\xEAm t\u0129nh m\u1EA1ch ch\u1EADm, t\u1ED1i \u0111a 20 mg/ng\xE0y",
        calculatedDose: `${Math.min(20, Math.round(1 * effectiveWeightKg))} mg t\u0129nh m\u1EA1ch ch\u1EADm`,
        thresholdMet: !!(patient.liverEnzymesAST_ALT && patient.liverEnzymesAST_ALT >= 400),
        targetClinical: "H\u1ED7 tr\u1EE3 t\u1ED5ng h\u1EE3p c\xE1c y\u1EBFu t\u1ED1 \u0111\xF4ng m\xE1u ph\u1EE5 thu\u1ED9c vitamin K t\u1EA1i gan (II, VII, IX, X).",
        precautions: "Ti\xEAm t\u0129nh m\u1EA1ch th\u1EADt ch\u1EADm; tr\xE1nh ti\xEAm b\u1EAFp do nguy c\u01A1 t\u1EE5 m\xE1u l\u1EDBn."
      }
    ];
    return items;
  }
  function calculateAlbuminDose(effectiveWeightKg, currentAlbuminGDl = 2, targetAlbuminGDl = 3.5) {
    const diff = Math.max(0, targetAlbuminGDl - currentAlbuminGDl);
    const albuminGrams = diff > 0 ? Math.round(diff * 0.8 * effectiveWeightKg * 10) / 10 : 0;
    const vials20Percent50ml = diff > 0 ? Math.max(1, Math.ceil(albuminGrams / 10)) : 0;
    const minRateMlH = Math.round(5 * effectiveWeightKg);
    const maxRateMlH = Math.round(20 * effectiveWeightKg);
    return {
      albuminGrams,
      vials20Percent50ml,
      preparation5Percent: `Pha Albumin 5%: 1 l\u1ECD Albumin 20% 50ml + 150ml NaCl 0.9% = 200ml Albumin 5% (C\u1EA7n ${vials20Percent50ml} l\u1ECD)`,
      preparation10Percent: `Pha Albumin 10%: 1 l\u1ECD Albumin 20% 50ml + 50ml NaCl 0.9% = 100ml Albumin 10% (C\u1EA7n ${vials20Percent50ml} l\u1ECD)`,
      infusionRateMlH: `${minRateMlH} - ${maxRateMlH} ml/gi\u1EDD (T\u1ED5ng t\u1ED1c \u0111\u1ED9 d\u1ECBch g\u1ED3m CPT v\xE0 Albumin \u2264 20 ml/kg/h)`,
      indicationNotes: "Ch\u1EC9 \u0111\u1ECBnh khi t\u1ED5ng CPT \u2265 60 ml/kg v\xE0 \u0111ang ch\u1ED1ng s\u1ED1c CPT \u2265 5-10 ml/kg/h k\xE8m Albumin < 2.5 g/dL ho\u1EB7c b\u1EC7nh nh\xE2n suy gan, suy th\u1EADn, ARDS. \u1EDE ng\u01B0\u1EDDi l\u1EDBn: Ch\u1EC9 \u0111\u1ECBnh li\u1EC1u Albumin 1 g/kg truy\u1EC1n t\u0129nh m\u1EA1ch trong 4 - 6 gi\u1EDD (Ph\u1EE5 l\u1EE5c 18 - Q\u0110 2760/BYT)."
    };
  }
  function calculateNACProtocol(patient, effectiveWeightKg) {
    const astAlt = patient.liverEnzymesAST_ALT || 0;
    const isSevere = astAlt >= 1e3;
    const isModerate = astAlt >= 400 && astAlt < 1e3;
    const p1Mg = Math.round(150 * effectiveWeightKg);
    const p2Mg = Math.round(50 * effectiveWeightKg);
    const p3Mg = Math.round(100 * effectiveWeightKg);
    const p4MgH = Math.round(6.25 * effectiveWeightKg * 10) / 10;
    const phases = [
      {
        phase: 1,
        phaseName: "Pha 1: Li\u1EC1u T\u1EA5n C\xF4ng (Gi\u1EDD 1)",
        doseMgKg: 150,
        infusionTimeHours: 1,
        diluent: "Glucose 5% ho\u1EB7c NaCl 0.9% 200ml",
        totalMg: p1Mg,
        pumpRateMlH: "200 ml/h trong 1 gi\u1EDD"
      },
      {
        phase: 2,
        phaseName: "Pha 2: Duy tr\xEC b\u01B0\u1EDBc 1 (4 gi\u1EDD ti\u1EBFp theo)",
        doseMgKg: 50,
        infusionTimeHours: 4,
        diluent: "Glucose 5% ho\u1EB7c NaCl 0.9% 500ml",
        totalMg: p2Mg,
        pumpRateMlH: "125 ml/h trong 4 gi\u1EDD"
      },
      {
        phase: 3,
        phaseName: "Pha 3: Duy tr\xEC b\u01B0\u1EDBc 2 (16 gi\u1EDD ti\u1EBFp theo)",
        doseMgKg: 100,
        infusionTimeHours: 16,
        diluent: "Glucose 5% ho\u1EB7c NaCl 0.9% 1000ml",
        totalMg: p3Mg,
        pumpRateMlH: "62.5 ml/h trong 16 gi\u1EDD"
      },
      {
        phase: 4,
        phaseName: "Pha 4: Duy tr\xEC li\xEAn t\u1EE5c (48 - 72 gi\u1EDD)",
        doseMgKg: 6.25,
        // mg/kg/h
        infusionTimeHours: 48,
        diluent: "B\u01A1m ti\xEAm \u0111i\u1EC7n ho\u1EB7c chai truy\u1EC1n li\xEAn t\u1EE5c",
        totalMg: Math.round(p4MgH * 48),
        pumpRateMlH: `${p4MgH} mg/gi\u1EDD (ch\u1EC9nh theo n\u1ED3ng \u0111\u1ED9 pha)`
      }
    ];
    return {
      indicated: isSevere || isModerate,
      severityLevel: isSevere ? "acute_liver_failure" : isModerate ? "severe_hepatitis" : "normal",
      astAltVal: astAlt,
      summary: isSevere ? `AST/ALT ${astAlt} U/L: T\u1ED5n th\u01B0\u01A1ng gan c\u1EA5p m\u1EE9c \u0111\u1ED9 N\u1EB7ng / Suy gan c\u1EA5p. B\u1EAFt bu\u1ED9c k\xEDch ho\u1EA1t ph\xE1c \u0111\u1ED3 N-Acetylcysteine t\u0129nh m\u1EA1ch 4 pha v\xE0 TUY\u1EC6T \u0110\u1ED0I TR\xC1NH Ringer Lactate & Paracetamol.` : isModerate ? `AST/ALT ${astAlt} U/L: T\u1ED5n th\u01B0\u01A1ng gan trung b\xECnh. D\xF9ng NaCl 0.9% ho\u1EB7c Ringer Acetate, tr\xE1nh thu\u1ED1c \u0111\u1ED9c gan.` : "Men gan trong gi\u1EDBi h\u1EA1n theo d\xF5i.",
      phases,
      precautions: [
        "Ch\u1ED1ng ch\u1EC9 \u0111\u1ECBnh tuy\u1EC7t \u0111\u1ED1i Ringer Lactate: Gan suy kh\xF4ng chuy\u1EC3n h\xF3a \u0111\u01B0\u1EE3c lactate d\u1EABn \u0111\u1EBFn toan lactic m\u1EA5t b\xF9.",
        "C\u1EA5m d\xF9ng Paracetamol; h\u1EA1 nhi\u1EC7t b\u1EB1ng lau m\xE1t n\u01B0\u1EDBc \u1EA5m.",
        "C\u1EA3nh b\xE1o ph\u1EA3n \u1EE9ng ph\u1EA3n v\u1EC7 v\u1EDBi N-Acetylcysteine; ch\u1ED1ng ch\u1EC9 \u0111\u1ECBnh \u1EDF b\u1EC7nh nh\xE2n thi\u1EBFu men G6PD.",
        "Xem x\xE9t L\u1ECDc m\xE1u li\xEAn t\u1EE5c (CVVHDF) v\xE0 Thay huy\u1EBFt t\u01B0\u01A1ng (TPE) n\u1EBFu kh\xF4ng c\u1EA3i thi\u1EC7n sau 24 - 48 gi\u1EDD."
      ]
    };
  }
  function calculateABCSChecklist(patient, effectiveWeightKg) {
    const bicarbMl = Math.round(2 * effectiveWeightKg);
    const hclDose = `${Math.round(5 * effectiveWeightKg)} - ${Math.round(10 * effectiveWeightKg)} ml`;
    const calciumMl = Math.min(10, Math.max(0.5, Math.round(0.15 * effectiveWeightKg * 10) / 10));
    const dextroseMl = Math.round(1.5 * effectiveWeightKg);
    return {
      acidosis: {
        title: "A \u2014 Acidosis (Toan H\xF3a M\xE1u Chuy\u1EC3n H\xF3a)",
        criteria: "pH < 7.35 v\xE0/ho\u1EB7c HCO3\u207B < 17 mEq/L (ho\u1EB7c BE < -5)",
        action: `Natri Bicarbonate 4.2% li\u1EC1u 2 ml/kg t\u0129nh m\u1EA1ch ch\u1EADm: Ti\xEAm ${bicarbMl} ml TM ch\u1EADm trong 10-15 ph\xFAt. Kh\xF4ng ti\xEAm c\xF9ng \u0111\u01B0\u1EDDng truy\u1EC1n v\u1EDBi Calci hay Dopamin.`
      },
      bleeding: {
        title: "B \u2014 Bleeding (Xu\u1EA5t Huy\u1EBFt N\u1EB7ng & \u1EA8n)",
        criteria: "Hct < 35% ho\u1EB7c gi\u1EA3m nhanh > 20% k\xE8m s\u1ED1c, ho\u1EB7c xu\u1EA5t huy\u1EBFt ti\xEAu h\xF3a / ph\u1EE7 t\u1EA1ng",
        action: `Truy\u1EC1n H\u1ED3ng c\u1EA7u l\u1EAFng 5 - 10 ml/kg (${hclDose}) trong 1-2 gi\u1EDD. Song song truy\u1EC1n CPT 10 ml/kg/h. B\xF9 HT\u0110L n\u1EBFu INR > 1.5, K\u1EBFt t\u1EE7a l\u1EA1nh n\u1EBFu Fibrinogen < 1 g/L.`
      },
      calcium: {
        title: "C \u2014 Calcium (H\u1EA1 Canxi M\xE1u)",
        criteria: "Canxi ion h\xF3a (Ca++) < 1.0 mmol/L",
        action: `Calci Clorua 10% 0.1 - 0.2 ml/kg: L\u1EA5y ${calciumMl} ml Calci Clorua 10% pha lo\xE3ng trong 15 ml Glucose 5% ti\xEAm t\u0129nh m\u1EA1ch ch\u1EADm trong 5 - 10 ph\xFAt tr\xEAn monitor.`
      },
      sugar: {
        title: "S \u2014 Sugar (H\u1EA1 \u0110\u01B0\u1EDDng Huy\u1EBFt)",
        criteria: "Glucose m\xE1u < 40 mg/dL (ho\u1EB7c < 2.2 mmol/L)",
        action: patient.ageYears < 1 ? `Dextrose 10% li\u1EC1u 2 ml/kg: Ti\xEAm ${Math.round(2 * effectiveWeightKg)} ml Dextrose 10% TM ch\u1EADm.` : `Dextrose 30% li\u1EC1u 1 - 2 ml/kg: Ti\xEAm ${dextroseMl} ml Dextrose 30% TM ch\u1EADm, sau \u0111\xF3 duy tr\xEC truy\u1EC1n Glucose 5-10%.`
      }
    };
  }
  function calculateBranchDecision(patient, effectiveWeightKg) {
    const isAdult = patient.ageYears >= 16;
    const currentHct = patient.currentHctPercent;
    const baselineHct = patient.baselineHctPercent || (isAdult ? patient.gender === "male" ? 43 : 38 : 38);
    const response = patient.clinicalResponse || "good";
    const isBleedingSuspicion = patient.massiveBleeding || currentHct !== void 0 && (currentHct <= 35 || (baselineHct - currentHct) / baselineHct > 0.2);
    if (isBleedingSuspicion && (patient.severity === "shock" || patient.severity === "severe_shock" || response === "refractory" || response === "worsened")) {
      return {
        branchType: "blood",
        title: "NH\xC1NH X\u1EEC TR\xCD XU\u1EA4T HUY\u1EBET N\u1EB6NG & M\u1EA4T M\xC1U C\u1EA4P (Ph\u1EE5 L\u1EE5c 17)",
        recommendedFluid: "H\u1ED3ng C\u1EA7u L\u1EAFng (5 - 10 ml/kg) + Song song Cao Ph\xE2n T\u1EED 10 ml/kg/h",
        rateMlKgH: 10,
        durationHours: 2,
        reasoning: `B\u1EC7nh nh\xE2n s\u1ED1c kh\xF4ng c\u1EA3i thi\u1EC7n v\u1EDBi Hct t\u1EE5t (${currentHct || "< 35"}%), nghi ng\u1EDD xu\u1EA5t huy\u1EBFt ti\xEAu h\xF3a ho\u1EB7c xu\u1EA5t huy\u1EBFt ph\u1EE7 t\u1EA1ng \u1EA9n. Kh\xF4ng th\u1EC3 b\xF9 b\u1EB1ng d\u1ECBch tinh th\u1EC3 \u0111\u01A1n thu\u1EA7n.`,
        warnings: [
          "B\u1EAFt bu\u1ED9c th\u0103m d\xF2 tr\u1EF1c tr\xE0ng, ki\u1EC3m tra d\u1ECBch h\xFAt d\u1EA1 d\xE0y qua \u0111\u01B0\u1EDDng MI\u1EC6NG.",
          "Truy\u1EC1n HCL 5-10 ml/kg k\u1EBFt h\u1EE3p CPT 10 ml/kg/h trong l\xFAc ch\u1EDD m\xE1u.",
          "B\u1ED5 sung Omeprazole 1 mg/kg TM v\xE0 Vitamin K1 n\u1EBFu c\xF3 b\u1EC7nh gan."
        ]
      };
    }
    const isHctHigh = currentHct !== void 0 && currentHct >= 40;
    if ((isHctHigh || response === "refractory") && patient.severity !== "warning_signs") {
      const cptRate = isAdult ? 15 : 20;
      return {
        branchType: "cpt",
        title: "NH\xC1NH CAO PH\xC2N T\u1EEC N\u1EA4C THANG (CPT ESCALATION - Ph\u1EE5 L\u1EE5c 8 & 16)",
        recommendedFluid: "Cao Ph\xE2n T\u1EED: Dextran 40 ho\u1EB7c 6% HES 200 (10 - 20 ml/kg/h)",
        rateMlKgH: cptRate,
        durationHours: 1,
        reasoning: `D\u1ECBch tinh th\u1EC3 kh\xF4ng gi\u1EEF \u0111\u01B0\u1EE3c th\u1EC3 t\xEDch do th\u1EA5t tho\xE1t huy\u1EBFt t\u01B0\u01A1ng li\xEAn t\u1EE5c (Hct ${currentHct || "\u2265 40"}%). C\u1EA7n \xE1p l\u1EF1c keo m\u1EA1nh \u0111\u1EC3 k\xE9o d\u1ECBch v\xE0o l\xF2ng m\u1EA1ch.`,
        warnings: [
          "\u0110o l\u1EA1i Hct t\u1EA1i gi\u01B0\u1EDDng sau 1 gi\u1EDD truy\u1EC1n CPT.",
          "Gi\xE1m s\xE1t t\u1ED5ng li\u1EC1u CPT: T\u1ED1i \u0111a 60 ml/kg (tr\xE1nh t\u1ED5n th\u01B0\u01A1ng th\u1EADn c\u1EA5p).",
          "N\u1EBFu sau 2 \u0111\u1EE3t CPT v\u1EABn kh\xF4ng ra s\u1ED1c -> Chuy\u1EC3n sang L\u01B0u \u0111\u1ED3 S\u1ED1c Th\u1EA5t B\u1EA1i B\xF9 D\u1ECBch (Ph\u1EE5 l\u1EE5c 18)."
        ]
      };
    }
    if (response === "refractory" || response === "worsened") {
      return {
        branchType: "refractory_shock",
        title: "L\u01AFU \u0110\u1ED2 S\u1ED0C SXHD KH\xD4NG \u0110\xC1P \u1EE8NG D\u1ECACH TRUY\u1EC0N (Ph\u1EE5 L\u1EE5c 18)",
        recommendedFluid: "\u0110o CVP & HA\u0110MXL + Test CPT 5 ml/kg/30ph + B\xF9 Albumin & V\u1EADn M\u1EA1ch",
        rateMlKgH: 5,
        durationHours: 0.5,
        reasoning: "S\u1ED1c tr\u01A1 v\u1EDBi b\xF9 d\u1ECBch th\xF4ng th\u01B0\u1EDDng. C\u1EA7n ph\u1ED1i h\u1EE3p \u0111o CVP \u0111\u1EC3 ph\xE2n \u0111\u1ECBnh thi\u1EBFu th\u1EC3 t\xEDch (CVP \u2264 15) hay suy c\u01A1 tim/qu\xE1 t\u1EA3i (CVP > 15) v\xE0 b\xF9 d\u1ECBch Albumin / v\u1EADn m\u1EA1ch t\u01B0\u01A1ng \u1EE9ng.",
        warnings: [
          "H\u1ED9i ch\u1EA9n kh\u1EA9n c\u1EA5p chuy\xEAn gia SXHD.",
          "Ki\u1EC3m tra \u0111\u1EA7y \u0111\u1EE7 g\xF3i ABCS: Kh\xED m\xE1u, \u0111i\u1EC7n gi\u1EA3i, Calci ion, \u0111\u01B0\u1EDDng huy\u1EBFt.",
          "\u0110o CVP qua t\u0129nh m\u1EA1ch n\u1EC1n khu\u1EF7u tay Seldinger c\u1EA3i ti\u1EBFn (c\u1EA5m ch\u1ECDc TM c\u1EA3nh/d\u01B0\u1EDBi \u0111\xF2n)."
        ]
      };
    }
    return {
      branchType: "standard",
      title: "PH\xC1C \u0110\u1ED2 B\xD9 D\u1ECACH CHU\u1EA8N THEO PH\xC2N \u0110\u1ED8 B\u1ED8 Y T\u1EBE 2023",
      recommendedFluid: "Ringer Lactate ho\u1EB7c NaCl 0.9%",
      rateMlKgH: patient.severity === "warning_signs" ? 6 : 15,
      durationHours: 2,
      reasoning: "B\xF9 d\u1ECBch tinh th\u1EC3 theo ti\u1EBFn tr\xECnh n\u1EA5c thang gi\u1EA3m d\u1EA7n t\u1ED1c \u0111\u1ED9 k\u1EBFt h\u1EE3p theo d\xF5i s\xE1t sinh hi\u1EC7u v\xE0 Hct.",
      warnings: [
        "\u0110o l\u1EA1i Hct v\xE0 sinh hi\u1EC7u tr\u01B0\u1EDBc m\u1ED7i l\u1EA7n gi\u1EA3m t\u1ED1c \u0111\u1ED9.",
        "Duy tr\xEC n\u01B0\u1EDBc ti\u1EC3u \u2265 0.5 - 1 ml/kg/h."
      ]
    };
  }
  function generateDengueCDSSPlan(patient, customDurations) {
    const ageGroup = classifyAgeGroup(patient.ageYears);
    const weightResult = calculateWeightAdjustment(patient.ageYears, patient.gender, patient.actualWeightKg, patient.heightCm);
    const effectiveWeight = weightResult.adjustedWeightKg;
    const { rows, totalVolumeMl, totalDurationHours } = calculateFluidSchedule(
      patient,
      effectiveWeight,
      customDurations
    );
    const colloidPlan = calculateColloidSchedule(patient, effectiveWeight, "dextran_40");
    const defaultHemodynamic = {
      cvpLevel: "low_normal",
      cardiacContractility: "normal",
      vascularTone: "normal",
      isOverloaded: false
    };
    const vasopressorDecision = evaluateVasopressorAlgorithm(defaultHemodynamic, effectiveWeight, patient.ageYears);
    const { dopamin, noradrenalin, dobutamin, adrenalin } = calculateVasopressorDoses(effectiveWeight);
    const bloodProducts = calculateBloodProducts(patient, effectiveWeight);
    const nacProtocol = calculateNACProtocol(patient, effectiveWeight);
    const abcsChecklist = calculateABCSChecklist(patient, effectiveWeight);
    const branchDecision = calculateBranchDecision(patient, effectiveWeight);
    const alerts = [];
    if (weightResult.isObese) {
      alerts.push({
        id: "alert_obese",
        level: "danger",
        title: patient.ageYears >= 16 ? "C\u1EA2NH B\xC1O QU\xC1 T\u1EA2I D\u1ECACH \u1EDE NG\u01AF\u1EDCI L\u1EDAN TH\u1EEAA C\xC2N / B\xC9O PH\xCC" : "C\u1EA2NH B\xC1O QU\xC1 T\u1EA2I D\u1ECACH \u1EDE TR\u1EBA TH\u1EEAA C\xC2N / B\xC9O PH\xCC",
        message: weightResult.warningText || (patient.ageYears >= 16 ? "B\u1EC7nh nh\xE2n th\u1EEBa c\xE2n. D\xF9ng c\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh AdjBW." : "B\u1EC7nh nh\xE2n th\u1EEBa c\xE2n. B\u1EAFt bu\u1ED9c d\xF9ng c\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh CDC 2014."),
        ruleCode: patient.ageYears >= 16 ? "ADULT_OBESE_RULE" : "CDC_2014_OBESE_RULE"
      });
    }
    if (patient.severity === "severe_shock") {
      alerts.push({
        id: "alert_severe_shock",
        level: "danger",
        title: "S\u1ED0C SXHD NGUY K\u1ECACH (M\u1EA0CH = 0, HUY\u1EBET \xC1P = 0)",
        message: "B\u01A1m tr\u1EF1c ti\u1EBFp t\u0129nh m\u1EA1ch 15-20 ml/kg trong 15 ph\xFAt. L\u1EADp ngay 2 \u0111\u01B0\u1EDDng truy\u1EC1n kim l\u1EDBn. Chu\u1EA9n b\u1ECB s\u1EB5n D\u1ECBch Cao Ph\xE2n T\u1EED (Dextran 40 / HES 200) v\xE0 thu\u1ED1c v\u1EADn m\u1EA1ch.",
        ruleCode: "SEVERE_SHOCK_EMERGENCY"
      });
    } else if (patient.severity === "shock") {
      alerts.push({
        id: "alert_shock",
        level: "warning",
        title: "S\u1ED0C SXHD (C\xD2N B\xD9) \u2014 C\u1EA6N \u0110O L\u1EA0I HCT SAU 1 GI\u1EDC",
        message: "T\u1EA3i nhanh 15-20 ml/kg/h trong gi\u1EDD \u0111\u1EA7u. B\u1EAFt bu\u1ED9c \u0111o l\u1EA1i Hct t\u1EA1i gi\u01B0\u1EDDng tr\u01B0\u1EDBc khi chuy\u1EC3n c\u1EEF truy\u1EC1n.",
        ruleCode: "SHOCK_RESUS_1H"
      });
    }
    if (colloidPlan.isOverLimit) {
      alerts.push({
        id: "alert_colloid_limit",
        level: "danger",
        title: "C\u1EA2NH B\xC1O TR\u1EA6N CAO PH\xC2N T\u1EEC: T\u1ED4NG LI\u1EC0U \u0110\u1EA0T \u2265 60 ML/KG",
        message: `T\u1ED5ng l\u01B0\u1EE3ng CPT \u0111\xE3 \u0111\u1EA1t ${colloidPlan.totalColloidMlPerKg} ml/kg (ng\u01B0\u1EE1ng tr\u1EA7n an to\xE0n: 60 ml/kg). Nguy c\u01A1 t\u1ED5n th\u01B0\u01A1ng th\u1EADn c\u1EA5p v\xE0 r\u1ED1i lo\u1EA1n \u0111\xF4ng m\xE1u. N\u1EBFu v\u1EABn c\xF2n s\u1ED1c: \u0110o CVP, c\xE2n nh\u1EAFc b\xF9 Albumin 5% ho\u1EB7c 10% (Trang 20 Q\u0110 2760/BYT) v\xE0 v\u1EADn m\u1EA1ch.`,
        ruleCode: "COLLOID_SAFETY_LIMIT_60"
      });
    }
    if (branchDecision.branchType === "blood") {
      alerts.push({
        id: "alert_bleeding",
        level: "danger",
        title: "B\xC1O \u0110\u1ED8NG \u0110\u1ECE: XU\u1EA4T HUY\u1EBET N\u1ED8I \u1EA8N / M\u1EA4T M\xC1U C\u1EA4P",
        message: "Hct gi\u1EA3m th\u1EA5p ho\u1EB7c gi\u1EA3m nhanh k\u1EBFt h\u1EE3p s\u1ED1c kh\xF4ng c\u1EA3i thi\u1EC7n. Ch\u1EC9 \u0111\u1ECBnh truy\u1EC1n H\u1ED3ng C\u1EA7u L\u1EAFng kh\u1EA9n c\u1EA5p v\xE0 CPT song song!",
        ruleCode: "OCCULT_BLEEDING_ALERT"
      });
    } else if (branchDecision.branchType === "cpt") {
      alerts.push({
        id: "alert_cpt_escalation",
        level: "danger",
        title: "B\xC1O \u0110\u1ED8NG: TH\u1EA4T THO\xC1T HUY\u1EBET T\u01AF\u01A0NG TR\u01A0 D\u1ECACH TINH TH\u1EC2",
        message: "Hct c\xF2n cao \u2265 40%. Chuy\u1EC3n ngay sang Cao Ph\xE2n T\u1EED (Dextran 40 / 6% HES 200) 10-20 ml/kg/h trong 1 gi\u1EDD!",
        ruleCode: "CPT_ESCALATION_ALERT"
      });
    }
    if (nacProtocol.indicated && nacProtocol.severityLevel === "acute_liver_failure") {
      alerts.push({
        id: "alert_liver_failure",
        level: "danger",
        title: "C\u1EA2NH B\xC1O SUY GAN C\u1EA4P: TUY\u1EC6T \u0110\u1ED0I TR\xC1NH RINGER LACTATE & PARACETAMOL",
        message: "Men gan AST/ALT \u2265 1000 U/L. Kh\u1EDFi \u0111\u1ED9ng ph\xE1c \u0111\u1ED3 N-Acetylcysteine (NAC) 4 pha, d\xF9ng NaCl 0.9% ho\u1EB7c Ringer Acetate.",
        ruleCode: "ACUTE_LIVER_FAILURE_ALERT"
      });
    }
    if (totalDurationHours > 24) {
      alerts.push({
        id: "alert_prolonged_fluid",
        level: "warning",
        title: "T\u1ED4NG TH\u1EDCI GIAN TRUY\u1EC0N D\u1ECACH > 24 GI\u1EDC",
        message: "Nguy c\u01A1 t\xE1i h\u1EA5p thu d\u1ECBch l\xF2ng m\u1EA1ch g\xE2y ph\xF9 ph\u1ED5i c\u1EA5p ho\u1EB7c suy h\xF4 h\u1EA5p do tr\xE0n d\u1ECBch m\xE0ng ph\u1ED5i/m\xE0ng b\u1EE5ng. R\xE0 so\xE1t gi\u1EA3m t\u1ED1c \u0111\u1ED9 v\xE0 cai d\u1ECBch s\u1EDBm.",
        ruleCode: "FLUID_OVERLOAD_RISK"
      });
    }
    const dateStr = (/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN");
    const soapLines = [
      `--- K\u1EBE HO\u1EA0CH \u0110I\u1EC0U TR\u1ECA & CH\u1ED0NG S\u1ED0C SXHD DENGUE (CDSS BYT 2023) [${dateStr}] ---`,
      `B\u1EC7nh nh\xE2n: ${patient.ageYears} tu\u1ED5i, Gi\u1EDBi t\xEDnh: ${patient.gender === "male" ? "Nam" : "N\u1EEF"}`,
      `Ph\xE2n \u0111\u1ED9: ${patient.severity === "warning_signs" ? "SXHD c\xF3 D\u1EA5u hi\u1EC7u c\u1EA3nh b\xE1o" : patient.severity === "shock" ? "S\u1ED1c SXHD" : "S\u1ED1c SXHD n\u1EB7ng nguy k\u1ECBch"}`,
      `C\xE2n n\u1EB7ng th\u1EF1c: ${patient.actualWeightKg} kg | C\xE2n n\u1EB7ng chu\u1EA9n/IBW: ${weightResult.standardWeightKg} kg | C\xE2n n\u1EB7ng t\xEDnh d\u1ECBch: ${effectiveWeight} kg`,
      ...weightResult.isObese ? [
        patient.ageYears >= 16 ? `[L\u01AFU \xDD HI\u1EC6U CH\u1EC8NH NG\u01AF\u1EDCI L\u1EDAN]: \u0110\xE3 hi\u1EC7u ch\u1EC9nh theo Ph\u1EE5 l\u1EE5c 9 BYT (BMI ${weightResult.bmi ?? ""} kg/m\xB2 \u2265 25: IBW = ${weightResult.idealWeightKg} kg, CN hi\u1EC7u ch\u1EC9nh = ${effectiveWeight} kg) \u0111\u1EC3 tr\xE1nh qu\xE1 t\u1EA3i tu\u1EA7n ho\xE0n.` : `[L\u01AFU \xDD HI\u1EC6U CH\u1EC8NH TR\u1EBA EM]: \u0110\xE3 hi\u1EC7u ch\u1EC9nh theo B\u1EA3ng CDC 2014 (${effectiveWeight} kg) cho tr\u1EBB d\u01B0 c\xE2n/b\xE9o ph\xEC. C\u1EA7n theo d\xF5i s\xE1t CVP.`
      ] : [],
      ...patient.currentHctPercent ? [`Hct hi\u1EC7n t\u1EA1i: ${patient.currentHctPercent}% | \u0110\xE1nh gi\xE1 \u0111\xE1p \u1EE9ng: ${patient.clinicalResponse || "Theo d\xF5i"}`] : [],
      `
1. NH\xC1NH X\u1EEC TR\xCD L\xC2M S\xC0NG: ${branchDecision.title}`,
      `  \u2022 H\u01B0\u1EDBng x\u1EED tr\xED: ${branchDecision.recommendedFluid}`,
      `  \u2022 L\xFD lu\u1EADn l\xE2m s\xE0ng: ${branchDecision.reasoning}`,
      `
2. B\u1EA2NG C\u1ECCC D\u1ECACH \u0110I\u1EC0U TR\u1ECA BAN \u0110\u1EA6U:`,
      ...rows.map((r) => `  \u2022 C\u1EEF ${r.stepIndex}: ${r.timeWindow} | T\u1ED1c \u0111\u1ED9 ${r.rateMlKgH} ml/kg/h (${r.dropsPerMin} gi\u1ECDt/ph\xFAt) | C\u1EA7n ${r.totalMl} ml (Treo th\xEAm ${r.bottlesToHang} chai 500ml) | T\u1EA1i c\u1ECDc: ${r.totalAtPoleMl} ml`),
      `
3. PH\xC1C \u0110\u1ED2 CAO PH\xC2N T\u1EEC (CPT) & GI\u1EA2M LI\u1EC0U (PH\u1EE4 L\u1EE4C 10):`,
      `  \u2022 Lo\u1EA1i d\u1ECBch khuy\u1EBFn c\xE1o: ${colloidPlan.colloidName}`,
      `  \u2022 Gi\u1EDBi h\u1EA1n an to\xE0n CPT: ${colloidPlan.safeLimitVolumeMl} ml (t\u01B0\u01A1ng \u0111\u01B0\u01A1ng 60 ml/kg)`,
      `  \u2022 B\u1EA3ng c\u1ECDc d\u1ECBch CPT n\u1EA5c thang:`,
      ...colloidPlan.rows.map((r) => `    - C\u1EEF ${r.stepIndex} (${r.fluidName}): ${r.timeWindow} | T\u1ED1c \u0111\u1ED9 ${r.rateMlKgH} ml/kg/h (${r.dropsPerMin} gi\u1ECDt/ph\xFAt) | ${r.stepVolumeMl} ml (T\xEDch l\u0169y CPT: ${r.cumulativeColloidMlPerKg} ml/kg)`),
      `  \u2022 7 Ti\xEAu chu\u1EA9n chuy\u1EC3n t\u1EEB CPT sang \u0110i\u1EC7n gi\u1EA3i (Ph\u1EE5 l\u1EE5c 10): M\u1EA1ch r\xF5, HA b\xECnh th\u01B0\u1EDDng, Chi \u1EA5m CRT < 2s, Hct gi\u1EA3m d\u1EA7n, N\u01B0\u1EDBc ti\u1EC3u \u2265 0.5-1 ml/kg/h, Gan thu nh\u1ECF, CVP \u1ED5n \u0111\u1ECBnh.`,
      `
4. L\u01AFU \u0110\u1ED2 V\u1EACN M\u1EA0CH & B\u01A0M TI\xCAM \u0110I\u1EC6N 50ML (PH\u1EE4 L\u1EE4C 15 & 18):`,
      `  \u2022 Test D\u1ECBch CPT (khi CVP \u2264 15 cmH2O): B\u01A1m 5 ml/kg trong 30 ph\xFAt (${vasopressorDecision.fluidTestMl} ml).`,
      `  \u2022 Dopamin: Pha ${dopamin.totalMg} mg trong 50ml G5%. T\u1ED1c \u0111\u1ED9 1 ml/h = 1 \xB5g/kg/ph\xFAt (Kh\u1EDFi \u0111\u1EA7u 5-10 ml/h).`,
      `  \u2022 Noradrenalin: Pha ${noradrenalin.totalMg} mg trong 50ml G5%. T\u1ED1c \u0111\u1ED9 1 ml/h = 0.1 \xB5g/kg/ph\xFAt (Kh\u1EDFi \u0111\u1EA7u 0.5-2 ml/h; \u01B0u ti\xEAn khi HA t\xE2m tr\u01B0\u01A1ng th\u1EA5p / s\u1ED1c \u1EA5m).`,
      `  \u2022 Dobutamin: Pha ${dobutamin.totalMg} mg trong 50ml G5%. T\u1ED1c \u0111\u1ED9 1 ml/h = 1 \xB5g/kg/ph\xFAt (Kh\u1EDFi \u0111\u1EA7u 3-10 ml/h khi CVP > 15 cmH2O ho\u1EB7c suy tim/d\u1ECDa ph\xF9 ph\u1ED5i).`,
      `  \u2022 Adrenalin: Pha ${adrenalin.totalMg} mg trong 50ml G5%. T\u1ED1c \u0111\u1ED9 1 ml/h = 0.1 \xB5g/kg/ph\xFAt (C\u1EE9u nguy khi tr\u01A1 Dopamin + Dobutamin).`,
      `
5. XU\u1EA4T HUY\u1EBET N\u1EB6NG & CH\u1EBE PH\u1EA8M M\xC1U (PH\u1EE4 L\u1EE4C 17):`,
      `  \u2022 HCL (khi Hct < 35%): Truy\u1EC1n ${Math.round(5 * effectiveWeight)} - ${Math.round(10 * effectiveWeight)} ml trong 1-2h song song CPT 10 ml/kg/h.`,
      `  \u2022 G\xF3i ABCS: Acidosis (Bicarbonate 4.2% ${Math.round(2 * effectiveWeight)} ml); Calcium (Calci clorua 10% 2-5ml); Sugar (Dextrose 30% ${Math.round(1.5 * effectiveWeight)} ml).`,
      ...nacProtocol.indicated ? [`  \u2022 Ph\xE1c \u0111\u1ED3 NAC Suy gan: T\u1EA5n c\xF4ng 150mg/kg (1h) -> 50mg/kg (4h) -> 100mg/kg (16h) -> Duy tr\xEC 6.25mg/kg/h. Tuy\u1EC7t \u0111\u1ED1i TR\xC1NH Ringer Lactate & Paracetamol.`] : [],
      `
6. \u0110I\u1EC0U D\u01AF\u1EE0NG AN TO\xC0N: \u0110o Hct tr\u01B0\u1EDBc m\u1ED7i l\u1EA7n gi\u1EA3m t\u1ED1c \u0111\u1ED9; Duy tr\xEC n\u01B0\u1EDBc ti\u1EC3u \u2265 0.5 - 1.0 ml/kg/h; B\xE1o BS ngay n\u1EBFu n\u01B0\u1EDBc ti\u1EC3u < 0.5 ml/kg/h ho\u1EB7c ran \u1EA9m ph\u1ED5i.`
    ];
    return {
      patient,
      ageGroup,
      weightResult,
      fluidRows: rows,
      totalVolumeMl,
      totalDurationHours,
      colloidPlan,
      vasopressorDopamin: dopamin,
      vasopressorNoradrenalin: noradrenalin,
      vasopressorDobutamin: dobutamin,
      vasopressorAdrenalin: adrenalin,
      vasopressorDecision,
      bloodProducts,
      nacProtocol,
      branchDecision,
      abcsChecklist,
      alerts,
      nursingInstructions: DENGUE_NURSING_CHECKLIST,
      soapExportText: soapLines.join("\n"),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }

  // dengue/dengue-ui.ts
  var CLINICAL_SAMPLE_CASES = [
    // 1. Nhóm Bù Dịch Ban Đầu & Phân Tầng Thể Trạng
    {
      id: "child-obese",
      category: "initial",
      icon: "fa-solid fa-child",
      label: "B\xE9 8T B\xE9o Ph\xEC (38kg)",
      tag: "CDC 2014",
      input: {
        ageYears: 8,
        gender: "male",
        actualWeightKg: 38,
        severity: "warning_signs",
        clinicalResponse: "good",
        currentHctPercent: 42,
        baselineHctPercent: 36
      },
      clinicalHighlight: "Tr\u1EBB b\xE9o ph\xEC > 120% chu\u1EA9n: T\u1EF1 \u0111\u1ED9ng d\xF9ng c\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh CDC 2014 (26kg) tr\xE1nh ph\xF9 ph\u1ED5i c\u1EA5p."
    },
    {
      id: "adult-obese-shock",
      category: "initial",
      icon: "fa-solid fa-weight-scale",
      label: "Nam 35T B\xE9o Ph\xEC (75kg)",
      tag: "Ph\u1EE5 L\u1EE5c 9 BYT",
      input: {
        ageYears: 35,
        gender: "male",
        actualWeightKg: 75,
        heightCm: 165,
        severity: "shock",
        clinicalResponse: "good",
        currentHctPercent: 47,
        baselineHctPercent: 39
      },
      clinicalHighlight: "Nam 35T b\xE9o ph\xEC (165cm, 75kg, BMI 27.5 \u2265 25): B\u1EAFt bu\u1ED9c d\xF9ng C\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh Ph\u1EE5 l\u1EE5c 9 BYT (67kg thay v\xEC 75kg) \u0111\u1EC3 ph\xF2ng ng\u1EEBa ph\xF9 ph\u1ED5i c\u1EA5p."
    },
    {
      id: "child-shock",
      category: "initial",
      icon: "fa-solid fa-heart-pulse",
      label: "B\xE9 G\xE1i 5T S\u1ED1c (16kg)",
      tag: "S\u1ED1c C\xF2n B\xF9",
      input: {
        ageYears: 5,
        gender: "female",
        actualWeightKg: 16,
        severity: "shock",
        clinicalResponse: "good",
        currentHctPercent: 41,
        baselineHctPercent: 35
      },
      clinicalHighlight: "Tr\u1EBB nh\u1ECF s\u1ED1c c\xF2n b\xF9: Ch\u1ED1ng s\u1ED1c 15 ml/kg/h c\u1EEF 1, theo d\xF5i s\xE1t sinh hi\u1EC7u v\xE0 Hct."
    },
    {
      id: "adult-severe-shock",
      category: "initial",
      icon: "fa-solid fa-bolt",
      label: "N\u1EEF 35T S\u1ED1c Nguy K\u1ECBch (62kg)",
      tag: "M\u1EA1ch 0 - HA 0",
      isDanger: true,
      input: {
        ageYears: 35,
        gender: "female",
        actualWeightKg: 62,
        heightCm: 155,
        severity: "severe_shock",
        clinicalResponse: "good",
        currentHctPercent: 49,
        baselineHctPercent: 38
      },
      clinicalHighlight: "N\u1EEF 35T s\u1ED1c nguy k\u1ECBch 62kg (155cm, BMI 25.8 \u2265 25, hi\u1EC7u ch\u1EC9nh 54kg): B\u01A1m d\u1ECBch 20 ml/kg/h si\xEAu t\u1ED1c + chu\u1EA9n b\u1ECB Noradrenalin b\u01A1m ti\xEAm \u0111i\u1EC7n."
    },
    {
      id: "adult-shock-compensated",
      category: "initial",
      icon: "fa-solid fa-person",
      label: "Nam 30T S\u1ED1c C\xF2n B\xF9 (70kg)",
      tag: "\u0110\xE1p \u1EE8ng T\u1ED1t",
      input: {
        ageYears: 30,
        gender: "male",
        actualWeightKg: 70,
        heightCm: 170,
        severity: "shock",
        clinicalResponse: "good",
        currentHctPercent: 46,
        baselineHctPercent: 38
      },
      clinicalHighlight: "Nam 30T s\u1ED1c c\xF2n b\xF9 (170cm, 70kg, BMI 24.2 < 25): D\xF9ng c\xE2n n\u1EB7ng th\u1EF1c 70kg theo Ph\u1EE5 l\u1EE5c 9, b\xF9 d\u1ECBch n\u1EA5c thang 15 -> 10 -> 6 -> 3 -> 1.5 ml/kg/h."
    },
    // 2. Nhóm Sốc Trơ & Xử Trí Không Đáp Ứng
    {
      id: "child-refractory-cpt",
      category: "refractory",
      icon: "fa-solid fa-arrow-trend-up",
      label: "Tr\u1EBB 7T Tr\u01A1 D\u1ECBch (23kg)",
      tag: "Hct 48% \xB7 \u0110\u1ED5i CPT",
      isDanger: true,
      input: {
        ageYears: 7,
        gender: "male",
        actualWeightKg: 23,
        severity: "shock",
        clinicalResponse: "refractory_hct_high",
        currentHctPercent: 48,
        baselineHctPercent: 37
      },
      clinicalHighlight: "S\u1ED1c tr\u01A1 d\u1ECBch tinh th\u1EC3, Hct 48%: Tho\xE1t huy\u1EBFt t\u01B0\u01A1ng n\u1EB7ng -> \u0110\u1ED5i ngay Cao ph\xE2n t\u1EED Dextran 40 10-20 ml/kg/h."
    },
    {
      id: "adult-bleeding",
      category: "refractory",
      icon: "fa-solid fa-droplet",
      label: "Nam 32T S\u1ED1c K\xE9o D\xE0i (58kg)",
      tag: "Hct 26% \xB7 M\u1EA5t M\xE1u \u1EA8n",
      isDanger: true,
      input: {
        ageYears: 32,
        gender: "male",
        actualWeightKg: 58,
        severity: "shock",
        clinicalResponse: "refractory_bleeding",
        currentHctPercent: 26,
        baselineHctPercent: 44,
        massiveBleeding: true
      },
      clinicalHighlight: "S\u1ED1c k\xE9o d\xE0i k\xE8m Hct t\u1EE5t s\xE2u 26%: B\xE1o \u0111\u1ED9ng \u0111\u1ECF Xu\u1EA5t huy\u1EBFt n\u1ED9i t\u1EA1ng \u1EA9n -> Truy\u1EC1n H\u1ED3ng C\u1EA7u L\u1EAFng & CPT song song."
    },
    {
      id: "refractory-cvp",
      category: "refractory",
      icon: "fa-solid fa-gauge-high",
      label: "N\u1EEF 26T S\u1ED1c Tr\u01A1 D\u1ECBch (48kg)",
      tag: "CVP > 15 \xB7 V\u1EADn M\u1EA1ch",
      isDanger: true,
      input: {
        ageYears: 26,
        gender: "female",
        actualWeightKg: 48,
        severity: "shock",
        clinicalResponse: "refractory_shock_cvp",
        currentHctPercent: 39,
        baselineHctPercent: 38,
        cvpValue: 17
      },
      clinicalHighlight: "B\xF9 CPT \u2265 60ml/kg nh\u01B0ng v\u1EABn s\u1ED1c: \u0110\u1EB7t catheter \u0111o CVP t\u0129nh m\u1EA1ch n\u1EC1n, test d\u1ECBch & Dobutamin / B\xF9 Albumin."
    },
    {
      id: "acute-liver",
      category: "refractory",
      icon: "fa-solid fa-triangle-exclamation",
      label: "Nam 42T Suy Gan C\u1EA5p (64kg)",
      tag: "AST 1650 \xB7 Ph\xE1c \u0110\u1ED3 NAC",
      isDanger: true,
      input: {
        ageYears: 42,
        gender: "male",
        actualWeightKg: 64,
        severity: "warning_signs",
        clinicalResponse: "liver_failure",
        liverEnzymesAST_ALT: 1650,
        currentHctPercent: 40
      },
      clinicalHighlight: "AST 1650 U/L t\u1ED5n th\u01B0\u01A1ng gan c\u1EA5p: Ph\xE1c \u0111\u1ED3 NAC 4 pha, TUY\u1EC6T \u0110\u1ED0I C\u1EA4M Ringer Lactate & Paracetamol."
    }
  ];
  var DengueCDSSController = class {
    container;
    currentPlan = null;
    customDurations = {};
    activeCaseId = "child-obese";
    activeWorkspaceMode = "fluid_schedule";
    activeRefractorySubTab = "tab-cpt";
    includeVasopressorInPrint = false;
    selectedColloidType = "dextran_40";
    currentHemodynamic = {
      cvpLevel: "low_normal",
      cardiacContractility: "normal",
      vascularTone: "normal",
      isOverloaded: false
    };
    interactiveDrugName = "Dopamin";
    interactiveDose = 5;
    interactivePumpRate = 5;
    deEscalationChecked = {};
    constructor(containerId) {
      const el = document.getElementById(containerId);
      if (!el) {
        throw new Error(`Container #${containerId} not found`);
      }
      this.container = el;
      this.init();
    }
    init() {
      this.renderInitialLayout();
      this.attachEventListeners();
      this.recalculate();
    }
    renderInitialLayout() {
      const now = /* @__PURE__ */ new Date();
      const curTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      this.container.innerHTML = `
      <!-- DEDICATED MEDICAL PRINT SHEET (Ch\u1EC9 hi\u1EC3n th\u1ECB khi in phi\u1EBFu y l\u1EC7nh) -->
      <div id="cdss-print-sheet" class="cdss-print-sheet"></div>

      <div class="dengue-cdss-app">
        <!-- TOP CLINICAL WORKSTATION TOOLBAR -->
        <header class="cdss-top-bar">
          <div class="cdss-bar-branding">
            <div class="cdss-icon-badge">
              <i class="fa-solid fa-droplet"></i>
            </div>
            <div class="cdss-brand-titles">
              <h1 class="cdss-brand-title">
                CDSS \u0110i\u1EC1u Tr\u1ECB SXHD Dengue &amp; Ch\u1ED1ng S\u1ED1c Ph\u1EE9c T\u1EA1p
              </h1>
              <div class="cdss-brand-subtitle">
                <span>B\u1ED9 Y T\u1EBF 2023</span>
                <span aria-hidden="true">\xB7</span>
                <span>Q\u0110 2760/Q\u0110-BYT</span>
                <span aria-hidden="true">\xB7</span>
                <span>Ph\u1EE5 l\u1EE5c 6, 8, 16, 17, 18 &amp; 26</span>
              </div>
            </div>
          </div>

          <div class="cdss-toolbar-actions">
            <button id="btn-copy-soap" class="cdss-action-btn cdss-action-btn--primary cdss-action-btn--icon-only" title="Sao ch\xE9p K\u1EBF ho\u1EA1ch SOAP v\xE0o B\u1EC7nh \xE1n / DocSpace" aria-label="Sao ch\xE9p SOAP">
              <i class="fa-solid fa-notes-medical"></i>
            </button>
            <button id="btn-copy-handover" class="cdss-action-btn cdss-action-btn--icon-only" title="Sao ch\xE9p b\xE1o c\xE1o giao ban c\u1ECDc d\u1ECBch" aria-label="B\xE0n Giao Ca">
              <i class="fa-solid fa-clipboard-check"></i>
            </button>
            <label class="cdss-print-vaso-checkbox" title="T\xF9y ch\u1ECDn in k\xE8m ph\xE1c \u0111\u1ED3 thu\u1ED1c v\u1EADn m\u1EA1ch b\u01A1m ti\xEAm \u0111i\u1EC7n (khi c\xF3 s\u1ED1c tr\u01A1)">
              <input type="checkbox" id="chk-include-vaso" />
              <span>In k\xE8m V\u1EADn m\u1EA1ch</span>
            </label>
            <button id="btn-print" class="cdss-action-btn cdss-action-btn--icon-only" title="In phi\u1EBFu y l\u1EC7nh c\u1ECDc d\u1ECBch chu\u1EA9n A4">
              <i class="fa-solid fa-print"></i>
            </button>
            <button id="btn-reset-durations" class="cdss-action-btn cdss-action-btn--icon-only" title="Kh\xF4i ph\u1EE5c th\u1EDDi l\u01B0\u1EE3ng chu\u1EA9n B\u1ED9 Y T\u1EBF">
              <i class="fa-solid fa-clock-rotate-left"></i>
            </button>
          </div>
        </header>

        <!-- CA L\xC2M S\xC0NG PH\xC2N T\u1EA6NG (CLINICAL CASES BAR) -->
        <div class="cdss-cases-bar">
          <!-- Nh\xF3m 1: B\xF9 d\u1ECBch ban \u0111\u1EA7u -->
          <div class="cdss-cases-group">
            <div class="cdss-cases-group-title">
              <i class="fa-solid fa-hand-holding-droplet text-primary"></i> B\xF9 D\u1ECBch Ban \u0110\u1EA7u:
            </div>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
              ${CLINICAL_SAMPLE_CASES.filter((c) => c.category === "initial").map((c) => `
                <button type="button" 
                  class="cdss-case-pill ${c.isDanger ? "cdss-case-pill--danger" : ""} ${c.id === this.activeCaseId ? "active" : ""}" 
                  data-case-id="${c.id}"
                  title="${c.clinicalHighlight}">
                  <i class="${c.icon} cdss-case-pill-icon"></i>
                  <span>${c.label}</span>
                  <span class="cdss-case-pill-tag">${c.tag}</span>
                </button>
              `).join("")}
            </div>
          </div>

          <!-- Nh\xF3m 2: S\u1ED1c tr\u01A1 & Kh\xF4ng \u0111\xE1p \u1EE9ng -->
          <div class="cdss-cases-group" style="padding-top:0.4rem; border-top:1px dashed var(--cdss-border-subtle);">
            <div class="cdss-cases-group-title" style="color:var(--cdss-danger);">
              <i class="fa-solid fa-shield-virus text-danger"></i> S\u1ED1c Tr\u01A1 &amp; Bi\u1EBFn Ch\u1EE9ng:
            </div>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
              ${CLINICAL_SAMPLE_CASES.filter((c) => c.category === "refractory").map((c) => `
                <button type="button" 
                  class="cdss-case-pill cdss-case-pill--danger ${c.id === this.activeCaseId ? "active" : ""}" 
                  data-case-id="${c.id}"
                  title="${c.clinicalHighlight}">
                  <i class="${c.icon} cdss-case-pill-icon"></i>
                  <span>${c.label}</span>
                  <span class="cdss-case-pill-tag">${c.tag}</span>
                </button>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- MAIN GRID LAYOUT -->
        <div class="cdss-main-grid">
          <!-- LEFT COLUMN: TR\u1EA0M \u0110\xC1NH GI\xC1 NG\u01AF\u1EDCI B\u1EC6NH UNIFIED PATIENT STATION -->
          <aside class="cdss-left-col">
            <div class="cdss-card" style="padding:0; overflow:hidden;">
              <div class="cdss-card-header" style="padding:0.85rem 1rem;">
                <h2 class="cdss-card-title">
                  <i class="fa-solid fa-user-injured text-primary"></i> Tr\u1EA1m \u0110\xE1nh Gi\xE1 Ng\u01B0\u1EDDi B\u1EC7nh
                </h2>
                <span id="case-status-indicator" class="cdss-brand-badge" style="display:none;"></span>
              </div>

              <!-- KH\u1ED0I 1: D\u1EEE KI\u1EC6N BAN \u0110\u1EA6U & TH\u1EC2 TR\u1EA0NG -->
              <div class="cdss-station-section">
                <div class="cdss-station-title">
                  <span>01. Th\u1EC3 Tr\u1EA1ng &amp; Ph\xE2n T\u1EA7ng Ban \u0110\u1EA7u</span>
                  <span style="font-size:0.7rem; font-weight:600; text-transform:none; color:var(--cdss-text-muted);">CDC 2014</span>
                </div>

                <form id="dengue-input-form" style="display:flex; flex-direction:column; gap:0.75rem;">
                  <!-- Tu\u1ED5i & Gi\u1EDBi t\xEDnh -->
                  <div class="cdss-form-row">
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-age">Tu\u1ED5i (N\u0103m)</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-age" min="1" max="100" value="8" step="1" required class="cdss-input" />
                        <span class="cdss-input-suffix">tu\u1ED5i</span>
                      </div>
                    </div>

                    <div class="cdss-form-group">
                      <label class="cdss-form-label">Gi\u1EDBi T\xEDnh</label>
                      <div class="cdss-segmented" id="gender-segmented">
                        <button type="button" class="cdss-segmented-btn active" data-gender="male">
                          <i class="fa-solid fa-mars"></i> Nam
                        </button>
                        <button type="button" class="cdss-segmented-btn" data-gender="female">
                          <i class="fa-solid fa-venus"></i> N\u1EEF
                        </button>
                      </div>
                      <input type="hidden" id="input-gender" value="male" />
                    </div>
                  </div>

                  <!-- C\xE2n n\u1EB7ng th\u1EF1c t\u1EBF & Chi\u1EC1u cao -->
                  <div class="cdss-form-row">
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-weight">
                        <span>C\xE2n N\u1EB7ng Th\u1EF1c T\u1EBF</span>
                      </label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-weight" min="5" max="180" value="38" step="0.5" required class="cdss-input" />
                        <span class="cdss-input-suffix">kg</span>
                      </div>
                    </div>

                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-height">
                        <span>Chi\u1EC1u Cao</span>
                        <small style="color:var(--cdss-text-muted);">T\xF9y ch\u1ECDn</small>
                      </label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-height" min="50" max="220" placeholder="165" step="1" class="cdss-input" />
                        <span class="cdss-input-suffix">cm</span>
                      </div>
                    </div>
                  </div>

                  <!-- Ph\xE2n \u0111\u1ED9 l\xE2m s\xE0ng ban \u0111\u1EA7u -->
                  <div class="cdss-form-group">
                    <label class="cdss-form-label" for="input-severity">Ph\xE2n \u0110\u1ED9 L\xE2m S\xE0ng Ban \u0110\u1EA7u</label>
                    <select id="input-severity" class="cdss-select">
                      <option value="warning_signs" selected>1. C\xF3 D\u1EA5u Hi\u1EC7u C\u1EA3nh B\xE1o (DHCB)</option>
                      <option value="shock">2. S\u1ED1c SXHD (C\xF2n B\xF9)</option>
                      <option value="severe_shock">3. S\u1ED1c Nguy K\u1ECBch (M\u1EA1ch 0, HA 0)</option>
                    </select>
                  </div>

                  <!-- Gi\u1EDD b\u1EAFt \u0111\u1EA7u truy\u1EC1n -->
                  <div class="cdss-form-group">
                    <label class="cdss-form-label" for="input-starttime">M\u1ED1c Gi\u1EDD B\u1EAFt \u0110\u1EA7u Truy\u1EC1n</label>
                    <input type="time" id="input-starttime" value="${curTime}" class="cdss-input" />
                  </div>
                </form>
              </div>

              <!-- KH\u1ED0I 2: T\xC1I \u0110\xC1NH GI\xC1 & C\u1EACN L\xC2M S\xC0NG (\u0110\u1ED8NG H\u1ECCC) -->
              <div class="cdss-station-section" style="background: rgba(239, 68, 68, 0.02);">
                <div class="cdss-station-title" style="color:var(--cdss-danger);">
                  <span>02. T\xE1i \u0110\xE1nh Gi\xE1 &amp; C\u1EADn L\xE2m S\xE0ng</span>
                  <span style="font-size:0.7rem; font-weight:700; text-transform:none; color:var(--cdss-danger);">Q\u0110 2760</span>
                </div>

                <div style="display:flex; flex-direction:column; gap:0.75rem;">
                  <!-- Dropdown \u0110\xE1p \u1EE8ng L\xE2m S\xE0ng L\u1EDBn -->
                  <div class="cdss-form-group">
                    <label class="cdss-form-label" for="input-response">
                      <span>T\xECnh Tr\u1EA1ng \u0110\xE1p \u1EE8ng Sau B\xF9 D\u1ECBch Ban \u0110\u1EA7u</span>
                    </label>
                    <select id="input-response" class="cdss-select" style="font-weight:700; border-color:rgba(239,68,68,0.3);">
                      <option value="good">\u{1F7E2} \u0110\xE1p \u1EE9ng t\u1ED1t, ra s\u1ED1c (B\xF9 d\u1ECBch n\u1EA5c thang chu\u1EA9n)</option>
                      <option value="refractory_hct_high">\u{1F7E0} Kh\xF4ng \u0111\xE1p \u1EE9ng + Hct c\xF2n cao \u2265 40% (\u0110\u1ED5i CPT n\u1EA5c thang)</option>
                      <option value="refractory_bleeding">\u{1F534} Kh\xF4ng \u0111\xE1p \u1EE9ng + Hct t\u1EE5t ho\u1EB7c Xu\u1EA5t huy\u1EBFt \u1EA9n (Truy\u1EC1n M\xE1u HCL)</option>
                      <option value="refractory_shock_cvp">\u{1F7E3} S\u1ED1c th\u1EA5t b\u1EA1i b\xF9 d\u1ECBch / T\xE1i s\u1ED1c \u2265 2 l\u1EA7n (\u0110o CVP & V\u1EADn M\u1EA1ch)</option>
                      <option value="fluid_overload">\u26A0\uFE0F Bi\u1EBFn ch\u1EE9ng D\u01B0 d\u1ECBch / Qu\xE1 t\u1EA3i tu\u1EA7n ho\xE0n / Ph\xF9 ph\u1ED5i c\u1EA5p</option>
                      <option value="liver_failure">\u{1F7E4} Bi\u1EBFn ch\u1EE9ng Suy gan c\u1EA5p / AST-ALT \u2265 1000 U/L (Ph\xE1c \u0111\u1ED3 NAC)</option>
                    </select>
                  </div>

                  <!-- Hct Hi\u1EC7n T\u1EA1i & Hct N\u1EC1n -->
                  <div class="cdss-form-row">
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-current-hct">Hct Hi\u1EC7n T\u1EA1i (%)</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-current-hct" min="15" max="65" value="42" step="0.5" class="cdss-input" />
                        <span class="cdss-input-suffix">%</span>
                      </div>
                    </div>
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-baseline-hct">Hct N\u1EC1n (%)</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-baseline-hct" min="20" max="55" value="36" step="0.5" class="cdss-input" />
                        <span class="cdss-input-suffix">%</span>
                      </div>
                    </div>
                  </div>

                  <!-- CVP & Men Gan AST/ALT -->
                  <div class="cdss-form-row">
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-cvp">CVP \u0110o \u0110\u01B0\u1EE3c</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-cvp" min="0" max="30" placeholder="Ch\u01B0a \u0111o" step="1" class="cdss-input" />
                        <span class="cdss-input-suffix">cmH2O</span>
                      </div>
                    </div>
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-ast-alt">Men Gan AST/ALT</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-ast-alt" min="10" max="10000" placeholder="U/L" step="10" class="cdss-input" />
                        <span class="cdss-input-suffix">U/L</span>
                      </div>
                    </div>
                  </div>

                  <!-- Ti\u1EC3u C\u1EA7u & Xu\u1EA5t Huy\u1EBFt \u1EA8n -->
                  <div class="cdss-form-row">
                    <div class="cdss-form-group">
                      <label class="cdss-form-label" for="input-platelets">S\u1ED1 L\u01B0\u1EE3ng Ti\u1EC3u C\u1EA7u</label>
                      <div class="cdss-input-group">
                        <input type="number" id="input-platelets" min="1000" max="500000" placeholder="/mm\xB3" step="1000" class="cdss-input" />
                        <span class="cdss-input-suffix">/mm\xB3</span>
                      </div>
                    </div>
                    <div class="cdss-form-group" style="display:flex; align-items:flex-end;">
                      <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.76rem; font-weight:700; color:var(--cdss-danger); cursor:pointer; padding-bottom:0.6rem;">
                        <input type="checkbox" id="input-bleeding" style="width:16px; height:16px; accent-color:var(--cdss-danger);" />
                        <span>C\xF3 Xu\u1EA5t Huy\u1EBFt \u1EA8n / Ti\xEAu H\xF3a</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- KH\u1ED0I 3: PH\xC2N T\xCDCH C\xC2N N\u1EB6NG CDC 2014 & C\xC2N T\xCDNH D\u1ECACH (INLINE METRIC) -->
              <div id="weight-analysis-box" class="cdss-station-section">
                <!-- Dynamically populated via renderWeightAnalysis -->
              </div>
            </div>
          </aside>

          <!-- RIGHT COLUMN: CDSS DIRECTIVE & WORKSPACE MODES -->
          <main class="cdss-right-col">
            <!-- Dynamic Alert Banners -->
            <div id="cdss-alerts-wrap" class="cdss-alerts-container"></div>

            <!-- CLINICAL DIRECTIVE EXECUTIVE CARD (CH\u1EC8 \u0110\u1EA0O L\xC2M S\xC0NG \u0110\u1ED8NG H\u1ECCC) -->
            <div id="cdss-directive-wrap"></div>

            <!-- WORKSPACE MODE SWITCHER TABS -->
            <div class="cdss-mode-switcher-wrap">
              <div class="cdss-mode-tabs" id="cdss-mode-tabs">
                <button type="button" class="cdss-mode-btn active" data-mode="fluid_schedule">
                  <i class="fa-solid fa-table-list"></i>
                  <span>1. C\u1ECDc \u0110i\u1EC7n Gi\u1EA3i</span>
                </button>
                <button type="button" class="cdss-mode-btn" data-mode="colloid_schedule" id="btn-mode-colloid">
                  <i class="fa-solid fa-flask-vial"></i>
                  <span>2. C\u1ECDc Cao Ph\xE2n T\u1EED (CPT)</span>
                  <span id="colloid-alert-dot" style="display:none; width:8px; height:8px; border-radius:50%; background:#ef4444;"></span>
                </button>
                <button type="button" class="cdss-mode-btn" data-mode="refractory_suite" id="btn-mode-refractory">
                  <i class="fa-solid fa-shield-virus"></i>
                  <span>3. S\u1ED1c Tr\u01A1 &amp; Kh\xF4ng \u0110\xE1p \u1EE8ng</span>
                  <span id="refractory-alert-dot" style="display:none; width:8px; height:8px; border-radius:50%; background:#ef4444;"></span>
                </button>
                <button type="button" class="cdss-mode-btn" data-mode="vasopressors">
                  <i class="fa-solid fa-syringe"></i>
                  <span>4. V\u1EADn M\u1EA1ch 50ml (Ph\u1EE5 L\u1EE5c 15 &amp; 18)</span>
                </button>
                <button type="button" class="cdss-mode-btn" data-mode="nursing_checklist">
                  <i class="fa-solid fa-user-nurse"></i>
                  <span>5. \u0110i\u1EC1u D\u01B0\u1EE1ng An To\xE0n</span>
                </button>
              </div>

              <div class="cdss-mode-hint" id="cdss-mode-hint">
                <i class="fa-solid fa-circle-info text-primary"></i>
                <span id="cdss-mode-hint-text">\u0110ang hi\u1EC3n th\u1ECB ph\xE1c \u0111\u1ED3 b\xF9 d\u1ECBch n\u1EA5c thang</span>
              </div>
            </div>

            <!-- WORKSPACE CONTENT CONTAINER (DYNAMIC VIEWS) -->
            <div id="cdss-workspace-content">
              <!-- Dynamically populated via renderWorkspaceContent -->
            </div>
          </main>
        </div>

        <!-- STICKY MOBILE BOTTOM BAR -->
        <div class="cdss-mobile-sticky-bar">
          <div class="cdss-mobile-bar-inner">
            <div class="cdss-mbar-summary">
              <div class="cdss-mbar-main">
                <span id="mbar-weight">26 kg</span>
                <span class="cdss-brand-badge" id="mbar-severity-badge">DHCB</span>
              </div>
              <div class="cdss-mbar-sub" id="mbar-volume-sub">T\u1ED5ng: 2.340 ml / 24h</div>
            </div>
            <div class="cdss-mbar-actions">
              <button type="button" id="btn-open-drawer" class="cdss-action-btn cdss-action-btn--primary cdss-action-btn--icon-only" title="Ch\u1EC9nh th\xF4ng s\u1ED1 ca b\u1EC7nh" aria-label="Ch\u1EC9nh Ca">
                <i class="fa-solid fa-sliders"></i>
              </button>
              <button type="button" id="btn-mbar-soap" class="cdss-action-btn cdss-action-btn--icon-only" title="Ch\xE9p B\u1EC7nh \xC1n" aria-label="Ch\xE9p B\u1EC7nh \xC1n">
                <i class="fa-solid fa-notes-medical"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- MOBILE DRAWER OVERLAY & PANEL -->
        <div class="cdss-drawer-overlay" id="cdss-drawer-overlay"></div>
        <div class="cdss-mobile-drawer" id="cdss-mobile-drawer">
          <div class="cdss-drawer-handle"></div>
          <div class="cdss-drawer-header">
            <h3 class="cdss-drawer-title">
              <i class="fa-solid fa-sliders"></i> Ch\u1EC9nh Th\xF4ng S\u1ED1 Ca B\u1EC7nh
            </h3>
            <button type="button" class="cdss-action-btn cdss-action-btn--icon-only" id="btn-close-drawer">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div id="drawer-form-container">
            <!-- Mirrored controls for phone -->
          </div>
        </div>

        <!-- TOAST NOTIFICATION -->
        <div id="cdss-toast" class="cdss-toast">
          <i class="fa-solid fa-circle-check"></i>
          <span id="cdss-toast-text">Th\xF4ng b\xE1o</span>
        </div>
      </div>
    `;
    }
    attachEventListeners() {
      const form = document.getElementById("dengue-input-form");
      if (form) {
        form.addEventListener("input", () => {
          this.clearActivePreset();
          this.recalculate();
        });
        form.addEventListener("change", () => {
          this.clearActivePreset();
          this.recalculate();
        });
      }
      const responseSelect = document.getElementById("input-response");
      if (responseSelect) {
        responseSelect.addEventListener("change", () => {
          this.clearActivePreset();
          const val = responseSelect.value;
          if (val !== "good") {
            this.activeWorkspaceMode = "refractory_suite";
          }
          const chkVaso2 = document.getElementById("chk-include-vaso");
          if (val === "refractory_shock_cvp") {
            this.includeVasopressorInPrint = true;
            if (chkVaso2) chkVaso2.checked = true;
          } else {
            this.includeVasopressorInPrint = false;
            if (chkVaso2) chkVaso2.checked = false;
          }
          this.recalculate();
        });
      }
      const labInputs = ["input-current-hct", "input-baseline-hct", "input-cvp", "input-ast-alt", "input-platelets", "input-bleeding"];
      labInputs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener("input", () => {
            this.clearActivePreset();
            this.recalculate();
          });
          el.addEventListener("change", () => {
            this.clearActivePreset();
            this.recalculate();
          });
        }
      });
      const genderBtns = document.querySelectorAll("#gender-segmented .cdss-segmented-btn");
      genderBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const gender = target.getAttribute("data-gender");
          genderBtns.forEach((b) => b.classList.remove("active"));
          target.classList.add("active");
          const inputGender = document.getElementById("input-gender");
          if (inputGender) inputGender.value = gender;
          this.clearActivePreset();
          this.recalculate();
        });
      });
      const casePills = document.querySelectorAll(".cdss-case-pill");
      casePills.forEach((pill) => {
        pill.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const caseId = target.getAttribute("data-case-id");
          if (caseId) {
            this.applySampleCase(caseId);
          }
        });
      });
      const modeBtns = document.querySelectorAll(".cdss-mode-btn");
      modeBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const mode = target.getAttribute("data-mode");
          if (mode) {
            modeBtns.forEach((b) => b.classList.remove("active"));
            target.classList.add("active");
            this.activeWorkspaceMode = mode;
            this.renderWorkspaceContent();
          }
        });
      });
      const btnReset1 = document.getElementById("btn-reset-durations");
      const handleReset = () => {
        this.customDurations = {};
        this.recalculate();
        this.showToast("\u0110\xE3 kh\xF4i ph\u1EE5c th\u1EDDi l\u01B0\u1EE3ng c\u1EEF chu\u1EA9n theo B\u1ED9 Y T\u1EBF!");
      };
      if (btnReset1) btnReset1.addEventListener("click", handleReset);
      const btnSoap = document.getElementById("btn-copy-soap");
      const btnMbarSoap = document.getElementById("btn-mbar-soap");
      if (btnSoap) btnSoap.addEventListener("click", () => this.copySoapPlan());
      if (btnMbarSoap) btnMbarSoap.addEventListener("click", () => this.copySoapPlan());
      const btnHandover = document.getElementById("btn-copy-handover");
      if (btnHandover) btnHandover.addEventListener("click", () => this.copyHandoverReport());
      const chkVaso = document.getElementById("chk-include-vaso");
      if (chkVaso) {
        chkVaso.addEventListener("change", () => {
          this.includeVasopressorInPrint = chkVaso.checked;
          if (this.currentPlan) this.renderPrintSheet(this.currentPlan);
        });
      }
      const btnPrint = document.getElementById("btn-print");
      if (btnPrint) btnPrint.addEventListener("click", () => window.print());
      const btnOpenDrawer = document.getElementById("btn-open-drawer");
      const btnCloseDrawer = document.getElementById("btn-close-drawer");
      const drawerOverlay = document.getElementById("cdss-drawer-overlay");
      const drawer = document.getElementById("cdss-mobile-drawer");
      const openDrawer = () => {
        if (drawer && drawerOverlay) {
          drawer.classList.add("active");
          drawerOverlay.classList.add("active");
        }
      };
      const closeDrawer = () => {
        if (drawer && drawerOverlay) {
          drawer.classList.remove("active");
          drawerOverlay.classList.remove("active");
        }
      };
      if (btnOpenDrawer) btnOpenDrawer.addEventListener("click", openDrawer);
      if (btnCloseDrawer) btnCloseDrawer.addEventListener("click", closeDrawer);
      if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);
    }
    clearActivePreset() {
      this.activeCaseId = "";
      const pills = document.querySelectorAll(".cdss-case-pill");
      pills.forEach((p) => p.classList.remove("active"));
      const ind = document.getElementById("case-status-indicator");
      if (ind) ind.style.display = "none";
    }
    applySampleCase(caseId) {
      const sample = CLINICAL_SAMPLE_CASES.find((c) => c.id === caseId);
      if (!sample) return;
      this.activeCaseId = caseId;
      this.customDurations = {};
      const pills = document.querySelectorAll(".cdss-case-pill");
      pills.forEach((p) => {
        if (p.getAttribute("data-case-id") === caseId) {
          p.classList.add("active");
        } else {
          p.classList.remove("active");
        }
      });
      this.setInputValue("input-age", sample.input.ageYears.toString());
      this.setInputValue("input-weight", sample.input.actualWeightKg.toString());
      if (sample.input.heightCm !== void 0) {
        this.setInputValue("input-height", sample.input.heightCm.toString());
      } else {
        this.setInputValue("input-height", "");
      }
      this.setInputValue("input-severity", sample.input.severity);
      this.setGender(sample.input.gender);
      if (sample.input.clinicalResponse) {
        this.setInputValue("input-response", sample.input.clinicalResponse);
      }
      if (sample.input.currentHctPercent !== void 0) {
        this.setInputValue("input-current-hct", sample.input.currentHctPercent.toString());
      }
      if (sample.input.baselineHctPercent !== void 0) {
        this.setInputValue("input-baseline-hct", sample.input.baselineHctPercent.toString());
      }
      if (sample.input.liverEnzymesAST_ALT !== void 0) {
        this.setInputValue("input-ast-alt", sample.input.liverEnzymesAST_ALT.toString());
      } else {
        this.setInputValue("input-ast-alt", "");
      }
      if (sample.input.cvpValue !== void 0) {
        this.setInputValue("input-cvp", sample.input.cvpValue.toString());
      } else {
        this.setInputValue("input-cvp", "");
      }
      const bleedCheckbox = document.getElementById("input-bleeding");
      if (bleedCheckbox) {
        bleedCheckbox.checked = !!sample.input.massiveBleeding;
      }
      if (sample.category === "refractory") {
        this.activeWorkspaceMode = "refractory_suite";
        if (sample.input.clinicalResponse === "refractory_hct_high") {
          this.activeRefractorySubTab = "tab-cpt";
        } else if (sample.input.clinicalResponse === "refractory_bleeding" || sample.input.massiveBleeding) {
          this.activeRefractorySubTab = "tab-blood";
        } else if (sample.input.clinicalResponse === "refractory_shock_cvp") {
          this.activeRefractorySubTab = "tab-cvp";
        } else if (sample.input.clinicalResponse === "liver_failure") {
          this.activeRefractorySubTab = "tab-liver";
        }
      } else {
        this.activeWorkspaceMode = "fluid_schedule";
      }
      const chkVaso = document.getElementById("chk-include-vaso");
      if (sample.input.clinicalResponse === "refractory_shock_cvp") {
        this.includeVasopressorInPrint = true;
        if (chkVaso) chkVaso.checked = true;
      } else {
        this.includeVasopressorInPrint = false;
        if (chkVaso) chkVaso.checked = false;
      }
      const ind = document.getElementById("case-status-indicator");
      if (ind) {
        ind.textContent = sample.label;
        ind.style.display = "inline-block";
      }
      this.recalculate();
      this.showToast(`\u0110\xE3 \xE1p d\u1EE5ng ca l\xE2m s\xE0ng: ${sample.label}`);
    }
    setInputValue(id, val) {
      const el = document.getElementById(id);
      if (el) el.value = val;
    }
    setGender(val) {
      const hidden = document.getElementById("input-gender");
      if (hidden) hidden.value = val;
      const btns = document.querySelectorAll("#gender-segmented .cdss-segmented-btn");
      btns.forEach((btn) => {
        if (btn.getAttribute("data-gender") === val) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
    getFormData() {
      const age = parseFloat(document.getElementById("input-age")?.value) || 8;
      const gender = document.getElementById("input-gender")?.value || "male";
      const weight = parseFloat(document.getElementById("input-weight")?.value) || 30;
      const height = parseFloat(document.getElementById("input-height")?.value) || void 0;
      const severity = document.getElementById("input-severity")?.value || "warning_signs";
      const startTime = document.getElementById("input-starttime")?.value || "08:00";
      const response = document.getElementById("input-response")?.value || "good";
      const currentHct = parseFloat(document.getElementById("input-current-hct")?.value) || void 0;
      const baselineHct = parseFloat(document.getElementById("input-baseline-hct")?.value) || void 0;
      const massiveBleeding = document.getElementById("input-bleeding")?.checked || false;
      const liverEnzymesAST_ALT = parseFloat(document.getElementById("input-ast-alt")?.value) || void 0;
      const plateletsCount = parseFloat(document.getElementById("input-platelets")?.value) || void 0;
      return {
        ageYears: age,
        gender,
        actualWeightKg: weight,
        heightCm: height,
        severity,
        startTime,
        clinicalResponse: response,
        currentHctPercent: currentHct,
        baselineHctPercent: baselineHct,
        massiveBleeding,
        liverEnzymesAST_ALT,
        plateletsCount
      };
    }
    recalculate() {
      const input = this.getFormData();
      this.currentPlan = generateDengueCDSSPlan(input, this.customDurations);
      this.renderPlan(this.currentPlan);
    }
    renderPlan(plan) {
      this.renderWeightAnalysis(plan);
      this.renderAlerts(plan);
      this.renderDirective(plan);
      this.updateWorkspaceModeSwitcher(plan);
      this.renderWorkspaceContent();
      this.updateMobileStickyBar(plan);
      this.renderPrintSheet(plan);
    }
    activeModalTab = "male_table";
    renderWeightAnalysis(plan) {
      const box = document.getElementById("weight-analysis-box");
      if (!box) return;
      const { weightResult, patient } = plan;
      const isAdult = patient.ageYears >= 16;
      const isObese = weightResult.isObese;
      if (isAdult) {
        const hasHeight = patient.heightCm && patient.heightCm >= 100;
        const bmiStr = weightResult.bmi !== void 0 ? `${weightResult.bmi} kg/m\xB2` : "Ch\u01B0a c\xF3";
        const bmiStatusText = !hasHeight ? "C\u1EA7n nh\u1EADp Chi\u1EC1u cao" : isObese ? `BMI ${weightResult.bmi} (\u2265 25: Th\u1EEBa C\xE2n / B\xE9o Ph\xEC)` : `BMI ${weightResult.bmi} (< 25: Th\u1EC3 Tr\u1EA1ng Chu\u1EA9n)`;
        const bmiBadgeClass = !hasHeight ? "cdss-weight-status-badge--warning" : isObese ? "cdss-weight-status-badge--obese" : "cdss-weight-status-badge--normal";
        box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:4px;">
          <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); display:flex; align-items:center; gap:4px;">
            <i class="fa-solid fa-scale-balanced text-primary"></i> C\xE2n N\u1EB7ng T\xEDnh D\u1ECBch (Ph\u1EE5 L\u1EE5c 9 BYT)
          </span>
          <span class="cdss-weight-status-badge ${bmiBadgeClass}" style="font-size:0.7rem; font-weight:700;">
            ${bmiStatusText}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1.25fr; gap:0.35rem; background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.5rem; text-align:center;">
          <div>
            <div style="font-size:0.65rem; color:var(--cdss-text-muted); text-transform:uppercase;">Th\u1EF1c t\u1EBF</div>
            <strong style="font-size:0.9rem; font-family:var(--cdss-font-mono);">${weightResult.actualWeightKg} kg</strong>
          </div>
          <div style="border-left:1px solid var(--cdss-border-subtle);">
            <div style="font-size:0.65rem; color:var(--cdss-text-muted); text-transform:uppercase;">BMI</div>
            <strong style="font-size:0.9rem; font-family:var(--cdss-font-mono); color:${isObese ? "var(--cdss-danger)" : "var(--cdss-text)"};">${hasHeight ? weightResult.bmi : "---"}</strong>
          </div>
          <div style="border-left:1px solid var(--cdss-border-subtle);">
            <div style="font-size:0.65rem; color:var(--cdss-text-muted); text-transform:uppercase;">L\xFD t\u01B0\u1EDFng (IBW)</div>
            <strong style="font-size:0.9rem; font-family:var(--cdss-font-mono); color:var(--cdss-text-muted);">${weightResult.idealWeightKg ? weightResult.idealWeightKg + " kg" : "---"}</strong>
          </div>
          <div style="border-left:1px solid var(--cdss-border-subtle); background:var(--cdss-surface); border-radius:6px; padding:2px 0;">
            <div style="font-size:0.65rem; color:var(--cdss-primary); font-weight:700; text-transform:uppercase;">T\xEDnh d\u1ECBch</div>
            <strong style="font-size:1.05rem; font-family:var(--cdss-font-mono); color:var(--cdss-primary);">${weightResult.adjustedWeightKg} kg</strong>
            ${isObese && weightResult.tableRoundedWeightKg ? `<div style="font-size:0.62rem; color:var(--cdss-text-muted);">(B\u1EA3ng tra: ${weightResult.tableRoundedWeightKg}kg)</div>` : ""}
          </div>
        </div>

        <div style="font-size:0.72rem; color:var(--cdss-text-muted); line-height:1.4; margin-top:0.45rem;">
          <i class="fa-solid fa-circle-info text-primary"></i> ${weightResult.formulaNote}
        </div>

        <button type="button" id="btn-open-weight-modal" class="cdss-btn-lookup-weight" style="margin-top:0.5rem; width:100%; display:flex; align-items:center; justify-content:center; gap:0.4rem; padding:0.45rem 0.6rem; font-size:0.75rem; font-weight:700; background:rgba(13,148,136,0.08); color:var(--cdss-primary); border:1px solid rgba(13,148,136,0.25); border-radius:6px; cursor:pointer;">
          <i class="fa-solid fa-table-cells"></i> <span>Tra C\u1EE9u 02 B\u1EA3ng SXH Nam/N\u1EEF &amp; CDC 2014</span>
        </button>
      `;
      } else {
        const ratioPct = Math.round((weightResult.ratioToStandard || weightResult.actualWeightKg / weightResult.standardWeightKg) * 100);
        const badgeClass = isObese ? "cdss-weight-status-badge--obese" : "cdss-weight-status-badge--normal";
        const badgeText = isObese ? `D\u01B0 C\xE2n / B\xE9o Ph\xEC (${ratioPct}% Chu\u1EA9n)` : `Th\u1EC3 Tr\u1EA1ng Chu\u1EA9n (${ratioPct}%)`;
        box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:4px;">
          <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); display:flex; align-items:center; gap:4px;">
            <i class="fa-solid fa-child text-primary"></i> C\xE2n N\u1EB7ng T\xEDnh D\u1ECBch (CDC 2014)
          </span>
          <span class="cdss-weight-status-badge ${badgeClass}" style="font-size:0.7rem; font-weight:700;">
            ${badgeText}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1.3fr; gap:0.4rem; background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.5rem; text-align:center;">
          <div>
            <div style="font-size:0.68rem; color:var(--cdss-text-muted);">Th\u1EF1c t\u1EBF</div>
            <strong style="font-size:0.95rem; font-family:var(--cdss-font-mono);">${weightResult.actualWeightKg} kg</strong>
          </div>
          <div style="border-left:1px solid var(--cdss-border-subtle); border-right:1px solid var(--cdss-border-subtle);">
            <div style="font-size:0.68rem; color:var(--cdss-text-muted);">CDC 2014</div>
            <strong style="font-size:0.95rem; font-family:var(--cdss-font-mono); color:var(--cdss-text-muted);">${weightResult.standardWeightKg} kg</strong>
          </div>
          <div style="background:var(--cdss-surface); border-radius:6px; padding:2px 0;">
            <div style="font-size:0.68rem; color:var(--cdss-primary); font-weight:700;">T\xEDnh d\u1ECBch</div>
            <strong style="font-size:1.05rem; font-family:var(--cdss-font-mono); color:var(--cdss-primary);">${weightResult.adjustedWeightKg} kg</strong>
          </div>
        </div>

        <div style="font-size:0.72rem; color:var(--cdss-text-muted); line-height:1.4; margin-top:0.45rem;">
          <i class="fa-solid fa-circle-info text-primary"></i> ${weightResult.formulaNote}
        </div>

        <button type="button" id="btn-open-weight-modal" class="cdss-btn-lookup-weight" style="margin-top:0.5rem; width:100%; display:flex; align-items:center; justify-content:center; gap:0.4rem; padding:0.45rem 0.6rem; font-size:0.75rem; font-weight:700; background:rgba(13,148,136,0.08); color:var(--cdss-primary); border:1px solid rgba(13,148,136,0.25); border-radius:6px; cursor:pointer;">
          <i class="fa-solid fa-table-cells"></i> <span>Tra C\u1EE9u B\u1EA3ng CDC 2014 &amp; Ph\u1EE5 L\u1EE5c 9</span>
        </button>
      `;
      }
      const btnModal = document.getElementById("btn-open-weight-modal");
      if (btnModal) {
        btnModal.onclick = () => this.openWeightLookupModal();
      }
    }
    openWeightLookupModal() {
      let modal = document.getElementById("cdss-weight-modal-overlay");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "cdss-weight-modal-overlay";
        modal.className = "cdss-weight-modal-overlay";
        document.body.appendChild(modal);
      }
      if (this.currentPlan) {
        if (this.currentPlan.patient.ageYears < 16) {
          this.activeModalTab = "cdc_table";
        } else {
          this.activeModalTab = this.currentPlan.patient.gender === "female" ? "female_table" : "male_table";
        }
      }
      this.renderWeightLookupModalContent();
      modal.classList.add("active");
    }
    closeWeightLookupModal() {
      const modal = document.getElementById("cdss-weight-modal-overlay");
      if (modal) {
        modal.classList.remove("active");
      }
    }
    renderWeightLookupModalContent() {
      const modal = document.getElementById("cdss-weight-modal-overlay");
      if (!modal) return;
      modal.innerHTML = `
      <div class="cdss-weight-modal-dialog" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="cdss-weight-modal-header">
          <div>
            <h3 class="cdss-weight-modal-title">
              <i class="fa-solid fa-table-cells text-primary"></i>
              <span>Tra C\u1EE9u B\u1EA3ng C\xE2n N\u1EB7ng Ch\u1ED1ng S\u1ED1c SXHD &amp; CDC 2014</span>
            </h3>
            <div style="font-size:0.75rem; color:var(--cdss-text-muted); margin-top:2px;">
              Ph\u1EE5 l\u1EE5c 9 \u2014 H\u01B0\u1EDBng d\u1EABn ch\u1EA9n \u0111o\xE1n, \u0111i\u1EC1u tr\u1ECB SXHD (Ban h\xE0nh k\xE8m Quy\u1EBFt \u0111\u1ECBnh 2760/Q\u0110-BYT ng\xE0y 04/07/2023)
            </div>
          </div>
          <button type="button" class="cdss-weight-modal-close" id="btn-close-weight-modal" title="\u0110\xF3ng">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Tabs -->
        <div class="cdss-weight-modal-tabs">
          <button type="button" class="cdss-weight-modal-tab-btn ${this.activeModalTab === "male_table" ? "active" : ""}" data-tab="male_table">
            <i class="fa-solid fa-mars"></i> <span>1. B\u1EA3ng Ch\u1ED1ng S\u1ED1c SXH - NAM</span>
          </button>
          <button type="button" class="cdss-weight-modal-tab-btn ${this.activeModalTab === "female_table" ? "active" : ""}" data-tab="female_table">
            <i class="fa-solid fa-venus"></i> <span>2. B\u1EA3ng Ch\u1ED1ng S\u1ED1c SXH - N\u1EEE</span>
          </button>
          <button type="button" class="cdss-weight-modal-tab-btn ${this.activeModalTab === "cdc_table" ? "active" : ""}" data-tab="cdc_table">
            <i class="fa-solid fa-child"></i> <span>3. B\u1EA3ng CDC 2014 (Tr\u1EBB Em)</span>
          </button>
          <button type="button" class="cdss-weight-modal-tab-btn ${this.activeModalTab === "formula_guide" ? "active" : ""}" data-tab="formula_guide">
            <i class="fa-solid fa-square-root-variable"></i> <span>4. C\xF4ng Th\u1EE9c &amp; Nguy\xEAn T\u1EAFc Ph\u1EE5 L\u1EE5c 9</span>
          </button>
        </div>

        <!-- Body Content -->
        <div class="cdss-weight-modal-body">
          ${this.getWeightModalTabHtml()}
        </div>
      </div>
    `;
      modal.onclick = (e) => {
        if (e.target === modal) this.closeWeightLookupModal();
      };
      const btnClose = document.getElementById("btn-close-weight-modal");
      if (btnClose) btnClose.onclick = () => this.closeWeightLookupModal();
      const tabBtns = modal.querySelectorAll(".cdss-weight-modal-tab-btn");
      tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const tab = btn.getAttribute("data-tab");
          if (tab) {
            this.activeModalTab = tab;
            this.renderWeightLookupModalContent();
          }
        });
      });
      const cells = modal.querySelectorAll(".cdss-matrix-cell[data-h][data-w]");
      cells.forEach((c) => {
        c.addEventListener("click", () => {
          const h = c.getAttribute("data-h");
          const w = c.getAttribute("data-w");
          const eff = c.getAttribute("data-eff");
          if (h && w) {
            this.setInputValue("input-height", h);
            this.setInputValue("input-weight", w);
            this.recalculate();
            this.showToast(`\u0110\xE3 \xE1p d\u1EE5ng: Chi\u1EC1u cao ${h} cm, C\xE2n n\u1EB7ng th\u1EF1c ${w} kg \u279C C\xE2n ch\u1ED1ng s\u1ED1c: ${eff} kg`);
            this.closeWeightLookupModal();
          }
        });
      });
      const cdcRows = modal.querySelectorAll(".cdss-cdc-row[data-age][data-weight]");
      cdcRows.forEach((r) => {
        r.addEventListener("click", () => {
          const age = r.getAttribute("data-age");
          const weight = r.getAttribute("data-weight");
          if (age && weight) {
            this.setInputValue("input-age", age);
            this.setInputValue("input-weight", weight);
            this.recalculate();
            this.showToast(`\u0110\xE3 \xE1p d\u1EE5ng tr\u1EBB ${age} tu\u1ED5i \u279C C\xE2n n\u1EB7ng CDC 2014: ${weight} kg`);
            this.closeWeightLookupModal();
          }
        });
      });
    }
    getWeightModalTabHtml() {
      switch (this.activeModalTab) {
        case "male_table":
          return this.renderMatrixTableHtml("male");
        case "female_table":
          return this.renderMatrixTableHtml("female");
        case "cdc_table":
          return this.renderCDCTableHtml();
        case "formula_guide":
          return this.renderFormulaGuideHtml();
        default:
          return "";
      }
    }
    renderMatrixTableHtml(gender) {
      const isMale = gender === "male";
      const patient = this.currentPlan?.patient;
      const curHeight = patient?.heightCm ? Math.round(patient.heightCm) : void 0;
      const curWeight = patient?.actualWeightKg ? Math.round(patient.actualWeightKg) : void 0;
      const curGender = patient?.gender;
      let matchedH = void 0;
      let matchedW = void 0;
      if (curHeight && curWeight && curGender === gender && patient.ageYears >= 16) {
        matchedH = ADULT_SHOCK_HEIGHTS.reduce((prev, curr) => Math.abs(curr - curHeight) < Math.abs(prev - curHeight) ? curr : prev);
        matchedW = ADULT_SHOCK_WEIGHTS.reduce((prev, curr) => Math.abs(curr - curWeight) < Math.abs(prev - curWeight) ? curr : prev);
      }
      const rowsHtml = ADULT_SHOCK_HEIGHTS.map((h) => {
        const isRowHighlight = matchedH === h;
        const cellsHtml = ADULT_SHOCK_WEIGHTS.map((w) => {
          const cell = getAdultShockCell(h, w, gender);
          const isCurrent = matchedH === h && matchedW === w;
          const cellClass = isCurrent ? "cdss-matrix-cell cdss-matrix-cell--current" : cell.isAdjusted ? "cdss-matrix-cell cdss-matrix-cell--adjusted" : "cdss-matrix-cell cdss-matrix-cell--real";
          const tooltip = `Cao ${h}cm, N\u1EB7ng ${w}kg \u279C BMI ${cell.bmi} kg/m\xB2 ${cell.isAdjusted ? "(\u226525: B\xE9o ph\xEC)" : "(<25: Chu\u1EA9n)"} \u279C C\xE2n ch\u1ED1ng s\u1ED1c: ${cell.tableWeight}kg (Click \u0111\u1EC3 \xE1p d\u1EE5ng)`;
          return `
          <td class="${cellClass}" data-h="${h}" data-w="${w}" data-eff="${cell.tableWeight}" title="${tooltip}">
            ${cell.isAdjusted ? cell.tableWeight : '<span style="opacity:0.4; font-size:0.6rem;">BN</span>'}
          </td>
        `;
        }).join("");
        return `
        <tr class="${isRowHighlight ? "cdss-matrix-row--highlight" : ""}">
          <th class="cdss-matrix-th-left">${h}</th>
          ${cellsHtml}
          <th class="cdss-matrix-th-right">${h}</th>
        </tr>
      `;
      }).join("");
      return `
      <div>
        <div class="cdss-matrix-guide-bar">
          <div>
            <strong style="color:${isMale ? "#0284c7" : "#ec4899"}; font-size:0.85rem;">
              <i class="fa-solid ${isMale ? "fa-mars" : "fa-venus"}"></i>
              B\u1EA2NG C\xC2N N\u1EB6NG CH\u1ED0NG S\u1ED0C SXH \u2014 ${isMale ? "NAM" : "N\u1EEE"} (PH\u1EE4 L\u1EE4C 9)
            </strong>
            <div style="color:var(--cdss-text-muted); margin-top:2px;">
              Chi\u1EC1u cao: 145 \u2013 187 cm &bull; C\xE2n n\u1EB7ng th\u1EF1c t\u1EBF: 45 \u2013 101 kg. Click v\xE0o \xF4 b\u1EA5t k\u1EF3 \u0111\u1EC3 \u0111i\u1EC1n nhanh v\xE0o form t\xEDnh d\u1ECBch.
            </div>
          </div>
          <div class="cdss-matrix-legend">
            <div class="cdss-matrix-legend-item">
              <span class="cdss-matrix-legend-box" style="background:#e0f2fe;"></span>
              <span><strong>BMI &lt; 25:</strong> S\u1EED d\u1EE5ng c\xE2n n\u1EB7ng th\u1EF1c BN</span>
            </div>
            <div class="cdss-matrix-legend-item">
              <span class="cdss-matrix-legend-box" style="background:#ffffff; border:1px solid #cbd5e1;"></span>
              <span><strong>BMI &ge; 25:</strong> C\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh (AdjBW)</span>
            </div>
            ${matchedH && matchedW ? `
              <div class="cdss-matrix-legend-item" style="color:var(--cdss-danger); font-weight:700;">
                <span class="cdss-matrix-legend-box" style="background:#ef4444; border-color:#facc15;"></span>
                <span>BN hi\u1EC7n t\u1EA1i: Cao ${matchedH}cm, N\u1EB7ng ${matchedW}kg</span>
              </div>
            ` : ""}
          </div>
        </div>

        <div class="cdss-matrix-wrapper">
          <table class="cdss-matrix-table">
            <thead>
              <tr>
                <th class="cdss-matrix-corner">Cao (cm)</th>
                ${ADULT_SHOCK_WEIGHTS.map((w) => `<th class="cdss-matrix-th-top">${w}</th>`).join("")}
                <th class="cdss-matrix-corner">Cao (cm)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
    }
    renderCDCTableHtml() {
      const patient = this.currentPlan?.patient;
      const curAge = patient?.ageYears;
      const curGender = patient?.gender || "male";
      const ages = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      const rowsHtml = ages.map((age) => {
        const entry = CDC_STANDARD_WEIGHT[age];
        const isCurrentAge = curAge !== void 0 && Math.round(curAge) === age;
        const targetWeight = curGender === "male" ? entry.male : entry.female;
        return `
        <tr class="cdss-cdc-row ${isCurrentAge ? "current-age-row" : ""}" data-age="${age}" data-weight="${targetWeight}" style="cursor:pointer;" title="Click \u0111\u1EC3 \xE1p d\u1EE5ng cho tr\u1EBB ${age} tu\u1ED5i">
          <td style="font-weight:700;">${age} tu\u1ED5i ${isCurrentAge ? '<span style="font-size:0.7rem; color:var(--cdss-primary); font-weight:800;">(BN Hi\u1EC7n T\u1EA1i)</span>' : ""}</td>
          <td style="color:${curGender === "male" && isCurrentAge ? "var(--cdss-primary)" : "inherit"}; font-weight:${curGender === "male" && isCurrentAge ? "900" : "600"};">${entry.male} kg</td>
          <td style="color:${curGender === "female" && isCurrentAge ? "var(--cdss-primary)" : "inherit"}; font-weight:${curGender === "female" && isCurrentAge ? "900" : "600"};">${entry.female} kg</td>
        </tr>
      `;
      }).join("");
      return `
      <div style="max-width:760px; margin:0 auto;">
        <div style="background:var(--cdss-surface); border:1px solid var(--cdss-border); border-radius:8px; padding:0.85rem 1.1rem; margin-bottom:1rem;">
          <h4 style="margin:0 0 0.4rem 0; font-size:0.92rem; font-weight:800; color:var(--cdss-text); display:flex; align-items:center; gap:0.4rem;">
            <i class="fa-solid fa-child text-primary"></i>
            <span>1. C\xC2N N\u1EB6NG HI\u1EC6U CH\u1EC8NH \u1EDE TR\u1EBA EM D\u01AF C\xC2N HO\u1EB6C B\xC9O PH\xCC</span>
          </h4>
          <div style="font-size:0.78rem; color:var(--cdss-text-muted); font-style:italic; margin-bottom:0.5rem;">
            (D\u1EF1a theo h\u01B0\u1EDBng d\u1EABn c\u1EE7a CDC 2014 \u2014 Tr\xEDch Ph\u1EE5 l\u1EE5c 9 Quy\u1EBFt \u0111\u1ECBnh s\u1ED1 2760/Q\u0110-BYT)
          </div>
          <div style="font-size:0.75rem; color:var(--cdss-danger); background:rgba(239,68,68,0.06); border-left:3px solid var(--cdss-danger); padding:0.5rem 0.75rem; border-radius:4px; line-height:1.45;">
            <strong>Khuy\u1EBFn c\xE1o BYT:</strong> \xC1p d\u1EE5ng t\xEDnh c\xE2n n\u1EB7ng b\xF9 d\u1ECBch cho tr\u1EBB em d\u01B0 c\xE2n, b\xE9o ph\xEC n\xE0y ch\u1EC9 \u01B0\u1EDBc t\xEDnh cho nh\u1EEFng gi\u1EDD \u0111\u1EA7u v\xE0 <u>n\xEAn \u0111o \xE1p l\u1EF1c t\u0129nh m\u1EA1ch trung t\xE2m (CVP)</u> \u0111\u1EC3 theo d\xF5i trong khi b\xF9 d\u1ECBch.
          </div>
        </div>

        <div class="cdss-cdc-table-wrap">
          <table class="cdss-cdc-table">
            <thead>
              <tr>
                <th>Tu\u1ED5i (n\u0103m)</th>
                <th><i class="fa-solid fa-mars" style="color:#0284c7;"></i> Nam (kg)</th>
                <th><i class="fa-solid fa-venus" style="color:#ec4899;"></i> N\u1EEF (kg)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
    }
    renderFormulaGuideHtml() {
      return `
      <div class="cdss-formula-card">
        <h4 style="margin:0 0 0.75rem 0; font-size:1rem; font-weight:800; color:var(--cdss-text); border-bottom:1px solid var(--cdss-border-subtle); padding-bottom:0.5rem;">
          <i class="fa-solid fa-book-medical text-primary"></i>
          H\u01AF\u1EDANG D\u1EAAN T\xCDNH C\xC2N N\u1EB6NG B\xD9 D\u1ECACH CH\u1ED0NG S\u1ED0C SXHD (PH\u1EE4 L\u1EE4C 9 - BYT 2023)
        </h4>

        <!-- Ph\u1EA7n Ng\u01B0\u1EDDi L\u1EDBn -->
        <div style="margin-bottom:1.25rem;">
          <h5 style="font-size:0.88rem; font-weight:800; color:var(--cdss-primary); margin:0 0 0.5rem 0;">
            - C\xE2n n\u1EB7ng (CN) ch\u1ED1ng s\u1ED1c \u1EDF ng\u01B0\u1EDDi l\u1EDBn: xem Ph\u1EE5 l\u1EE5c 9
          </h5>
          <div style="font-size:0.8rem; line-height:1.6; color:var(--cdss-text); padding-left:0.5rem;">
            <div><strong>a) BMI &lt; 25 kg/m\xB2:</strong> s\u1EED d\u1EE5ng <u>C\xE2n n\u1EB7ng th\u1EF1c t\u1EBF</u>.</div>
            <div><strong>b) BMI &ge; 25 kg/m\xB2:</strong> s\u1EED d\u1EE5ng <u>C\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh</u>.</div>
            
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border); border-radius:8px; padding:0.75rem 1rem; margin:0.6rem 0;">
              <div style="font-weight:700; color:var(--cdss-text); margin-bottom:0.35rem;">+ CN l\xFD t\u01B0\u1EDFng (IBW - kg):</div>
              <div style="font-family:var(--cdss-font-mono); font-size:0.82rem; color:var(--cdss-text); padding-left:0.75rem;">
                &bull; <strong>N\u1EEF:</strong> 45,5 + 0,91 &times; (chi\u1EC1u cao (cm) - 152,4)<br/>
                &bull; <strong>Nam:</strong> 50,0 + 0,91 &times; (chi\u1EC1u cao (cm) - 152,4)
              </div>
              <div style="font-weight:700; color:var(--cdss-primary); margin-top:0.6rem; margin-bottom:0.35rem;">+ CN hi\u1EC7u ch\u1EC9nh (AdjBW - kg):</div>
              <div style="font-family:var(--cdss-font-mono); font-size:0.85rem; font-weight:800; color:var(--cdss-primary); padding-left:0.75rem;">
                CN hi\u1EC7u ch\u1EC9nh = CN l\xFD t\u01B0\u1EDFng + 0,4 &times; (CN th\u1EF1c - CN l\xFD t\u01B0\u1EDFng)
              </div>
            </div>
          </div>
        </div>

        <!-- Ph\u1EA7n Tr\u1EBB Em -->
        <div>
          <h5 style="font-size:0.88rem; font-weight:800; color:#0284c7; margin:0 0 0.5rem 0;">
            - C\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh \u1EDF tr\u1EBB em d\u01B0 c\xE2n ho\u1EB7c b\xE9o ph\xEC: d\u1EF1a theo CDC 2014
          </h5>
          <div style="font-size:0.8rem; line-height:1.6; color:var(--cdss-text); padding-left:0.5rem;">
            <div>&bull; Khi c\xE2n n\u1EB7ng th\u1EF1c c\u1EE7a tr\u1EBB v\u01B0\u1EE3t qu\xE1 ng\u01B0\u1EE1ng th\u1EEBa c\xE2n (&gt; 120% so v\u1EDBi c\xE2n n\u1EB7ng chu\u1EA9n theo tu\u1ED5i CDC 2014): <strong>B\u1EAFt bu\u1ED9c d\xF9ng C\xE2n n\u1EB7ng hi\u1EC7u ch\u1EC9nh CDC 2014</strong> t\u01B0\u01A1ng \u1EE9ng v\u1EDBi \u0111\u1ED9 tu\u1ED5i \u0111\u1EC3 t\xEDnh l\u01B0\u1EE3ng d\u1ECBch b\xF9.</div>
            <div>&bull; <em>Khuy\u1EBFn c\xE1o \xE1p d\u1EE5ng t\xEDnh c\xE2n n\u1EB7ng b\xF9 d\u1ECBch cho tr\u1EBB em d\u01B0 c\xE2n, b\xE9o ph\xEC n\xE0y ch\u1EC9 \u01B0\u1EDBc t\xEDnh cho nh\u1EEFng gi\u1EDD \u0111\u1EA7u v\xE0 n\xEAn \u0111o \xE1p l\u1EF1c t\u0129nh m\u1EA1ch trung t\xE2m (CVP) \u0111\u1EC3 theo d\xF5i trong khi b\xF9 d\u1ECBch.</em></div>
          </div>
        </div>
      </div>
    `;
    }
    renderAlerts(plan) {
      const wrap = document.getElementById("cdss-alerts-wrap");
      if (!wrap) return;
      if (plan.alerts.length === 0) {
        wrap.innerHTML = "";
        return;
      }
      wrap.innerHTML = plan.alerts.map((a) => `
      <div class="cdss-alert-box cdss-alert-box--${a.level}">
        <i class="fa-solid ${a.level === "danger" ? "fa-triangle-exclamation" : a.level === "warning" ? "fa-circle-exclamation" : "fa-circle-info"}"></i>
        <div class="cdss-alert-body">
          <strong>${a.title}</strong>
          <div>${a.message}</div>
        </div>
      </div>
    `).join("");
    }
    renderDirective(plan) {
      const wrap = document.getElementById("cdss-directive-wrap");
      if (!wrap) return;
      const { branchDecision, patient } = plan;
      const isDanger = branchDecision.branchType === "blood" || branchDecision.branchType === "refractory_shock";
      const isWarning = branchDecision.branchType === "cpt";
      const isStandard = branchDecision.branchType === "standard";
      wrap.innerHTML = `
      <div class="cdss-directive-card ${isDanger ? "directive--danger" : isWarning ? "directive--warning" : ""}">
        <div class="cdss-directive-header">
          <h2 class="cdss-directive-title">
            <i class="fa-solid ${isDanger ? "fa-triangle-exclamation text-danger" : isWarning ? "fa-arrow-trend-up text-warning" : "fa-circle-check text-primary"}"></i>
            <span>${branchDecision.title}</span>
          </h2>
          <span class="cdss-directive-tag" style="background:${isDanger ? "rgba(239,68,68,0.1)" : isWarning ? "rgba(245,158,11,0.1)" : "rgba(2,132,199,0.1)"}; color:${isDanger ? "var(--cdss-danger)" : isWarning ? "var(--cdss-warning)" : "var(--cdss-primary)"};">
            ${branchDecision.branchType === "blood" ? "M\u1EA4T M\xC1U C\u1EA4P" : branchDecision.branchType === "cpt" ? "THO\xC1T HUY\u1EBET T\u01AF\u01A0NG TR\u01A0" : branchDecision.branchType === "refractory_shock" ? "S\u1ED0C KH\xC1NG TR\u1ECA" : "\u0110\xC1P \u1EE8NG CHU\u1EA8N"}
          </span>
        </div>

        <div class="cdss-directive-action-banner ${isDanger ? "action--danger" : isWarning ? "action--warning" : "action--primary"}">
          <i class="fa-solid fa-arrow-right-arrow-left" style="font-size:1.1rem;"></i>
          <div>
            <div style="font-size:0.72rem; text-transform:uppercase; letter-spacing:0.04em; font-weight:800; opacity:0.85;">Khuy\u1EBFn C\xE1o X\u1EED Tr\xED \u01AFu Ti\xEAn:</div>
            <strong style="font-size:0.95rem;">${branchDecision.recommendedFluid}</strong>
          </div>
        </div>

        <div class="cdss-directive-reasoning">
          <strong>L\xFD lu\u1EADn l\xE2m s\xE0ng:</strong> ${branchDecision.reasoning}
        </div>

        <!-- Thanh Th\u1EED Nghi\u1EC7m K\u1ECBch B\u1EA3n L\xE2m S\xE0ng 1 Ch\u1EA1m -->
        <div class="cdss-scenario-bar">
          <span style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); margin-right:4px;">
            Th\u1EED nghi\u1EC7m k\u1ECBch b\u1EA3n:
          </span>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === "good" ? "active" : ""}" onclick="window.__dengueSetScenario('good');">
            \u{1F7E2} \u1ED4n \u0111\u1ECBnh
          </button>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === "refractory_hct_high" ? "active" : ""}" onclick="window.__dengueSetScenario('refractory_hct_high');">
            \u{1F7E0} Hct cao \u226540% (\u0110\u1ED5i CPT)
          </button>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === "refractory_bleeding" ? "active" : ""}" onclick="window.__dengueSetScenario('refractory_bleeding');">
            \u{1F534} Xu\u1EA5t huy\u1EBFt (Truy\u1EC1n M\xE1u)
          </button>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === "refractory_shock_cvp" ? "active" : ""}" onclick="window.__dengueSetScenario('refractory_shock_cvp');">
            \u{1F7E3} \u0110o CVP &amp; V\u1EADn M\u1EA1ch
          </button>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === "liver_failure" ? "active" : ""}" onclick="window.__dengueSetScenario('liver_failure');">
            \u{1F7E4} Suy Gan (NAC)
          </button>
          <button type="button" class="cdss-scenario-btn ${patient.clinicalResponse === "fluid_overload" ? "active" : ""}" onclick="window.__dengueSetScenario('fluid_overload');">
            \u26A0\uFE0F D\u01B0 D\u1ECBch / Ph\xF9 Ph\u1ED5i
          </button>
        </div>
      </div>
    `;
      window.__dengueSetScenario = (scenario) => {
        const respEl = document.getElementById("input-response");
        if (respEl) {
          respEl.value = scenario;
        }
        if (scenario === "refractory_bleeding") {
          const bl = document.getElementById("input-bleeding");
          if (bl) bl.checked = true;
        } else if (scenario === "liver_failure") {
          const ast = document.getElementById("input-ast-alt");
          if (ast && !ast.value) ast.value = "1500";
        }
        if (scenario !== "good") {
          this.activeWorkspaceMode = "refractory_suite";
          if (scenario === "refractory_hct_high") this.activeRefractorySubTab = "tab-cpt";
          else if (scenario === "refractory_bleeding") this.activeRefractorySubTab = "tab-blood";
          else if (scenario === "refractory_shock_cvp") this.activeRefractorySubTab = "tab-cvp";
          else if (scenario === "liver_failure") this.activeRefractorySubTab = "tab-liver";
          else if (scenario === "fluid_overload") this.activeRefractorySubTab = "tab-overload";
        }
        this.recalculate();
      };
    }
    updateWorkspaceModeSwitcher(plan) {
      const modeBtns = document.querySelectorAll(".cdss-mode-btn");
      modeBtns.forEach((btn) => {
        const m = btn.getAttribute("data-mode");
        if (m === this.activeWorkspaceMode) {
          btn.classList.add("active");
          if (m === "refractory_suite" && plan.patient.clinicalResponse !== "good") {
            btn.classList.add("mode-danger");
          } else {
            btn.classList.remove("mode-danger");
          }
        } else {
          btn.classList.remove("active", "mode-danger");
        }
      });
      const dot = document.getElementById("refractory-alert-dot");
      if (dot) {
        dot.style.display = plan.patient.clinicalResponse !== "good" ? "inline-block" : "none";
      }
      const colloidDot = document.getElementById("colloid-alert-dot");
      if (colloidDot) {
        colloidDot.style.display = plan.colloidPlan.isOverLimit ? "inline-block" : "none";
      }
      const hintText = document.getElementById("cdss-mode-hint-text");
      if (hintText) {
        if (this.activeWorkspaceMode === "fluid_schedule") {
          hintText.textContent = "B\u1EA3ng \u0111i\u1EC1u ph\u1ED1i c\u1ECDc d\u1ECBch \u0111i\u1EC7n gi\u1EA3i n\u1EA5c thang chu\u1EA9n h\xF3a (BYT 2023)";
        } else if (this.activeWorkspaceMode === "colloid_schedule") {
          hintText.textContent = "Ph\xE1c \u0111\u1ED3 c\u1ECDc d\u1ECBch Cao Ph\xE2n T\u1EED & gi\xE1m s\xE1t tr\u1EA7n an to\xE0n 60 ml/kg (Ph\u1EE5 l\u1EE5c 10)";
        } else if (this.activeWorkspaceMode === "refractory_suite") {
          hintText.textContent = "Ph\xE1c \u0111\u1ED3 6 ph\xE2n nh\xE1nh khi b\u1EC7nh nh\xE2n kh\xF4ng \u0111\xE1p \u1EE9ng b\xF9 d\u1ECBch";
        } else if (this.activeWorkspaceMode === "vasopressors") {
          hintText.textContent = "L\u01B0u \u0111\u1ED3 ch\u1ECDn v\u1EADn m\u1EA1ch theo CVP & B\u1ED9 t\xEDnh b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml 2 chi\u1EC1u";
        } else {
          hintText.textContent = "Quy tr\xECnh ki\u1EC3m so\xE1t an to\xE0n \u0111i\u1EC1u d\u01B0\u1EE1ng t\u1EA1i gi\u01B0\u1EDDng";
        }
      }
    }
    renderWorkspaceContent() {
      const container = document.getElementById("cdss-workspace-content");
      if (!container || !this.currentPlan) return;
      const plan = this.currentPlan;
      switch (this.activeWorkspaceMode) {
        case "fluid_schedule":
          this.renderFluidScheduleView(container, plan);
          break;
        case "colloid_schedule":
          this.renderColloidScheduleView(container, plan);
          break;
        case "refractory_suite":
          this.renderRefractorySuiteView(container, plan);
          break;
        case "vasopressors":
          this.renderVasopressorsView(container, plan);
          break;
        case "nursing_checklist":
          this.renderNursingChecklistView(container, plan);
          break;
      }
    }
    // VIEW 1: BẢNG CỌC DỊCH BAN ĐẦU (INITIAL FLUID VIEW)
    renderFluidScheduleView(container, plan) {
      const mlPerKg = Math.round(plan.totalVolumeMl / plan.weightResult.adjustedWeightKg);
      const bottles500 = Math.ceil(plan.totalVolumeMl / 500);
      const ageGroup = plan.ageGroup;
      const tpls = DENGUE_FLUID_TEMPLATES[plan.patient.severity][ageGroup];
      container.innerHTML = `
      <!-- Summary Bento Stats -->
      <div class="cdss-kpi-grid" style="margin-bottom: 1.25rem;">
        <div class="cdss-kpi-card">
          <div class="cdss-kpi-icon cdss-kpi-icon--blue">
            <i class="fa-solid fa-fill-drip"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">T\u1ED5ng D\u1ECBch Ban \u0110\u1EA7u</span>
            <span class="cdss-kpi-value">${plan.totalVolumeMl.toLocaleString("vi-VN")} <small>ml</small></span>
            <span class="cdss-kpi-sub">~ ${mlPerKg} ml/kg c\xE2n t\xEDnh d\u1ECBch</span>
          </div>
        </div>

        <div class="cdss-kpi-card">
          <div class="cdss-kpi-icon cdss-kpi-icon--purple">
            <i class="fa-solid fa-hourglass-half"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">Th\u1EDDi L\u01B0\u1EE3ng D\u1EF1 Ki\u1EBFn</span>
            <span class="cdss-kpi-value">${plan.totalDurationHours} <small>gi\u1EDD</small></span>
            <span class="cdss-kpi-sub">${plan.fluidRows.length} b\u1EADc t\u1ED1c \u0111\u1ED9 gi\u1EA3m d\u1EA7n</span>
          </div>
        </div>

        <div class="cdss-kpi-card">
          <div class="cdss-kpi-icon cdss-kpi-icon--teal">
            <i class="fa-solid fa-bottle-water"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">\u01AF\u1EDBc T\xEDnh S\u1ED1 Chai 500ml</span>
            <span class="cdss-kpi-value">${bottles500} <small>chai</small></span>
            <span class="cdss-kpi-sub">Ringer Lactate / NaCl 0.9%</span>
          </div>
        </div>
      </div>

      <!-- VISUAL FLUID TIMELINE -->
      <div class="cdss-timeline-card">
        <div class="cdss-timeline-header">
          <span class="cdss-timeline-title">
            <i class="fa-solid fa-chart-gantt"></i> Ti\u1EBFn Tr\xECnh B\u1EADc D\u1ECBch Truy\u1EC1n Ban \u0110\u1EA7u Theo Gi\u1EDD
          </span>
          <span class="cdss-brand-badge" style="background:var(--cdss-primary-light); color:var(--cdss-primary); border-color:var(--cdss-primary);">
            ${plan.totalDurationHours} Gi\u1EDD Truy\u1EC1n
          </span>
        </div>
        <div class="cdss-timeline-track" id="cdss-timeline-track">
          ${plan.fluidRows.map((r, idx) => {
        const colors = ["cdss-seg-1", "cdss-seg-2", "cdss-seg-3", "cdss-seg-4", "cdss-seg-5"];
        const colClass = colors[idx % colors.length];
        return `
              <div class="cdss-timeline-segment ${colClass}" style="flex: ${r.durationHours};" title="C\u1EEF ${r.stepIndex}: ${r.rateMlKgH} ml/kg/h (${r.durationHours}h) - C\u1EA7n ${r.totalMl} ml">
                <span>${r.rateMlKgH} ml/kg/h</span>
                <small>C\u1EEF ${r.stepIndex} (${r.durationHours}h)</small>
              </div>
            `;
      }).join("")}
        </div>
        <div class="cdss-timeline-ticks">
          <span><i class="fa-regular fa-clock"></i> Kh\u1EDFi \u0111\u1EA7u: <strong>${plan.fluidRows[0]?.timeWindow.split(" - ")[0] || "08:00"}</strong></span>
          <span>${plan.fluidRows.length} giai \u0111o\u1EA1n b\xF9 d\u1ECBch li\xEAn t\u1EE5c</span>
          <span>K\u1EBFt th\xFAc: <strong>${plan.fluidRows[plan.fluidRows.length - 1]?.timeWindow.split(" - ")[1]?.split(" ")[0] || "24h"}</strong></span>
        </div>
      </div>

      <!-- B\u1EA2NG \u0110I\u1EC0U PH\u1ED0I C\u1ECCC D\u1ECACH 4 C\u1ED8T -->
      <section class="cdss-table-card">
        <div class="cdss-table-header-wrap">
          <div class="cdss-table-title-area">
            <h2 class="cdss-table-title">
              <i class="fa-solid fa-table-list"></i> B\u1EA3ng \u0110i\u1EC1u Ph\u1ED1i C\u1ECDc D\u1ECBch 4 C\u1ED9t Chu\u1EA9n H\xF3a
            </h2>
            <p class="cdss-table-desc">
              T\u1EF1 \u0111\u1ED9ng g\u1ED9p th\u1EC3 t\xEDch, t\xEDnh gi\u1ECDt/ph\xFAt (d\xE2y 20g/ml), chuy\u1EC3n d\u1ECBch d\u01B0 v\xE0 t\xEDnh s\u1ED1 chai 500ml treo th\xEAm t\u1EA1i c\u1ECDc.
            </p>
          </div>
          <button id="btn-reset-durations-sub" class="cdss-action-btn cdss-action-btn--icon-only" title="Kh\xF4i ph\u1EE5c th\u1EDDi l\u01B0\u1EE3ng chu\u1EA9n B\u1ED9 Y T\u1EBF" aria-label="\u0110\u1EB7t L\u1EA1i Gi\u1EDD Chu\u1EA9n">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </button>
        </div>

        <!-- Desktop / Tablet Table -->
        <div class="cdss-table-scroll">
          <table class="cdss-table">
            <thead>
              <tr>
                <th style="width: 22%;">C\u1ED9t 1: M\u1ED1c Gi\u1EDD &amp; Th\u1EDDi L\u01B0\u1EE3ng</th>
                <th style="width: 28%;">C\u1ED9t 2: T\u1ED1c \u0110\u1ED9 &amp; L\u01B0\u1EE3ng D\u1ECBch C\u1EA7n</th>
                <th style="width: 26%;">C\u1ED9t 3: D\u1ECBch C\xF3 S\u1EB4N / Treo Th\xEAm</th>
                <th style="width: 24%;">C\u1ED9t 4: T\u1ED5ng C\u1ECDc &amp; Gi\xE1m S\xE1t</th>
              </tr>
            </thead>
            <tbody>
              ${plan.fluidRows.map((r, idx) => {
        const tpl = tpls[idx];
        const durationOptions = tpl?.durationOptions || [r.durationHours];
        const optionsHtml = durationOptions.map((dur) => `
                  <option value="${dur}" ${dur === r.durationHours ? "selected" : ""}>${dur} gi\u1EDD</option>
                `).join("");
        return `
                  <tr>
                    <td>
                      <div class="cdss-step-badge">C\u1EEF ${r.stepIndex}</div>
                      <div class="cdss-time-window">${r.timeWindow}</div>
                      <div class="cdss-duration-picker">
                        <label><i class="fa-regular fa-clock"></i> Th\u1EDDi l\u01B0\u1EE3ng:</label>
                        <select class="cdss-duration-select" data-row-idx="${idx}">
                          ${optionsHtml}
                        </select>
                      </div>
                      <div class="cdss-stage-title">${r.stageName}</div>
                    </td>
                    <td>
                      <div class="cdss-rate-display">
                        <span class="cdss-rate-number">${r.rateMlKgH}</span>
                        <span class="cdss-rate-unit">ml/kg/gi\u1EDD</span>
                      </div>
                      <div class="cdss-drops-box">
                        <i class="fa-solid fa-water" style="color:var(--cdss-info);"></i> 
                        <strong>${r.dropsPerMin}</strong> gi\u1ECDt/ph\xFAt
                        <small style="color:var(--cdss-text-muted);">${ageGroup === "child" ? "(D\xE2y vi gi\u1ECDt 60 g/ml)" : "(D\xE2y chu\u1EA9n 20 g/ml)"}</small>
                      </div>
                      <div class="cdss-volume-calc">
                        Th\u1EC3 t\xEDch c\u1EA7n: <strong>${r.totalMl.toLocaleString("vi-VN")} ml</strong>
                        <div style="font-size:0.7rem; color:var(--cdss-text-muted);">
                          (${r.rateMlKgH} \xD7 ${plan.weightResult.adjustedWeightKg}kg \xD7 ${r.durationHours}h)
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="cdss-carry-over">
                        D\u1ECBch s\u1EB5n t\u1EEB c\u1EEF tr\u01B0\u1EDBc: <strong>${r.existingFluidMl} ml</strong>
                      </div>
                      <div>
                        <span class="cdss-hang-badge ${r.bottlesToHang > 0 ? "cdss-hang-badge--active" : ""}">
                          <i class="fa-solid fa-plus"></i> Treo th\xEAm: <strong>${r.bottlesToHang}</strong> chai 500ml
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="cdss-pole-metric">
                        T\u1ED5ng c\xF3 tr\xEAn c\u1ECDc: <strong>${r.totalAtPoleMl.toLocaleString("vi-VN")} ml</strong>
                      </div>
                      ${r.hctCheckRequired ? `
                        <div class="cdss-hct-pill">
                          <i class="fa-solid fa-vial"></i> <strong>\u0110o l\u1EA1i Hct t\u1EA1i gi\u01B0\u1EDDng</strong>
                        </div>
                      ` : ""}
                      <div class="cdss-monitor-tip">
                        ${r.monitoringNotes}
                      </div>
                    </td>
                  </tr>
                `;
      }).join("")}
            </tbody>
          </table>
        </div>

        <!-- Mobile Adaptive Fluid Cards Stack (< 768px) -->
        <div class="cdss-fluid-cards-stack">
          ${plan.fluidRows.map((r, idx) => {
        const tpl = tpls[idx];
        const durationOptions = tpl?.durationOptions || [r.durationHours];
        const optionsHtml = durationOptions.map((dur) => `
              <option value="${dur}" ${dur === r.durationHours ? "selected" : ""}>${dur} gi\u1EDD</option>
            `).join("");
        return `
              <div class="cdss-mfluid-card ${r.hctCheckRequired ? "cdss-mfluid-card--hct" : ""}">
                <div class="cdss-mfluid-card-header">
                  <div class="cdss-step-badge">C\u1EEF ${r.stepIndex}</div>
                  <div class="cdss-mfluid-timewindow">${r.timeWindow}</div>
                  <div class="cdss-duration-picker" style="margin-left:auto;">
                    <select class="cdss-duration-select" data-row-idx="${idx}" aria-label="Th\u1EDDi l\u01B0\u1EE3ng c\u1EEF ${r.stepIndex}">
                      ${optionsHtml}
                    </select>
                  </div>
                </div>

                <div class="cdss-mfluid-stage-title">${r.stageName}</div>

                <div class="cdss-mfluid-stats-grid">
                  <div class="cdss-mfluid-stat">
                    <span class="cdss-mfluid-stat-label">T\u1ED1c \u0110\u1ED9</span>
                    <strong class="cdss-mfluid-stat-val text-primary">${r.rateMlKgH} <small>ml/kg/h</small></strong>
                    <span class="cdss-mfluid-stat-sub"><i class="fa-solid fa-water text-info"></i> ${r.dropsPerMin} gi\u1ECDt/ph (${ageGroup === "child" ? "D\xE2y 60g" : "D\xE2y 20g"})</span>
                  </div>
                  <div class="cdss-mfluid-stat">
                    <span class="cdss-mfluid-stat-label">L\u01B0\u1EE3ng D\u1ECBch C\u1EA7n</span>
                    <strong class="cdss-mfluid-stat-val">${r.totalMl.toLocaleString("vi-VN")} <small>ml</small></strong>
                    <span class="cdss-mfluid-stat-sub">${r.durationHours}h \xD7 ${plan.weightResult.adjustedWeightKg}kg</span>
                  </div>
                  <div class="cdss-mfluid-stat">
                    <span class="cdss-mfluid-stat-label">Treo Th\xEAm</span>
                    <strong class="cdss-mfluid-stat-val ${r.bottlesToHang > 0 ? "text-danger" : ""}">
                      ${r.bottlesToHang > 0 ? `+${r.bottlesToHang} chai 500ml` : "0 (D\xF9ng s\u1EB5n)"}
                    </strong>
                    <span class="cdss-mfluid-stat-sub">C\xF3 s\u1EB5n: ${r.existingFluidMl} ml</span>
                  </div>
                  <div class="cdss-mfluid-stat">
                    <span class="cdss-mfluid-stat-label">T\u1EA1i C\u1ECDc</span>
                    <strong class="cdss-mfluid-stat-val text-teal-600">${r.totalAtPoleMl.toLocaleString("vi-VN")} <small>ml</small></strong>
                    <span class="cdss-mfluid-stat-sub">D\u01B0 sau c\u1EEF: ${Math.max(0, r.totalAtPoleMl - r.totalMl)} ml</span>
                  </div>
                </div>

                ${r.hctCheckRequired ? `
                  <div class="cdss-hct-pill" style="margin-top:0.4rem; width:100%; justify-content:center;">
                    <i class="fa-solid fa-vial"></i> <strong>B\u1EAET BU\u1ED8C \u0110O L\u1EA0I HCT SAU C\u1EEE N\xC0Y (${r.durationHours}h)</strong>
                  </div>
                ` : ""}

                <div class="cdss-monitor-tip" style="margin-top:0.4rem;">
                  ${r.monitoringNotes}
                </div>
              </div>
            `;
      }).join("")}
        </div>
      </section>
    `;
      const selects = container.querySelectorAll(".cdss-duration-select");
      selects.forEach((sel) => {
        sel.addEventListener("change", (e) => {
          const target = e.target;
          const rowIdx = parseInt(target.getAttribute("data-row-idx") || "0", 10);
          const newDur = parseFloat(target.value);
          this.customDurations[rowIdx] = newDur;
          this.recalculate();
        });
      });
      const btnSub = container.querySelector("#btn-reset-durations-sub");
      if (btnSub) {
        btnSub.addEventListener("click", () => {
          this.customDurations = {};
          this.recalculate();
          this.showToast("\u0110\xE3 kh\xF4i ph\u1EE5c th\u1EDDi l\u01B0\u1EE3ng c\u1EEF chu\u1EA9n theo B\u1ED9 Y T\u1EBF!");
        });
      }
    }
    // VIEW 2: BẢNG CỌC DỊCH CAO PHÂN TỬ (COLLOID VIEW - PHỤ LỤC 10)
    renderColloidScheduleView(container, plan) {
      const colloidPlan = calculateColloidSchedule(
        plan.patient,
        plan.weightResult.adjustedWeightKg,
        this.selectedColloidType
      );
      plan.colloidPlan = colloidPlan;
      const meta = DENGUE_COLLOID_METADATA[this.selectedColloidType];
      const pctOfSafeLimit = Math.min(100, Math.round(colloidPlan.totalColloidMlPerKg / 60 * 100));
      const isOverLimit = colloidPlan.isOverLimit;
      const isNearLimit = !isOverLimit && colloidPlan.totalColloidMlPerKg >= 45;
      const albResult = calculateAlbuminDose(plan.weightResult.adjustedWeightKg, 2, 3.5);
      container.innerHTML = `
      <!-- Bento Stats & C\u1EA3nh B\xE1o Tr\u1EA7n 60 ml/kg -->
      <div class="cdss-kpi-grid" style="margin-bottom: 1.25rem;">
        <div class="cdss-kpi-card ${isOverLimit ? "cdss-kpi-card--danger" : isNearLimit ? "cdss-kpi-card--warning" : ""}">
          <div class="cdss-kpi-icon ${isOverLimit ? "cdss-kpi-icon--red" : isNearLimit ? "cdss-kpi-icon--amber" : "cdss-kpi-icon--teal"}">
            <i class="fa-solid fa-flask-vial"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">T\u1ED5ng Li\u1EC1u CPT T\xEDch L\u0169y</span>
            <span class="cdss-kpi-value ${isOverLimit ? "text-danger" : ""}">${colloidPlan.totalColloidMlPerKg} <small>ml/kg</small></span>
            <span class="cdss-kpi-sub">
              ${isOverLimit ? "\u26A0\uFE0F V\u01AF\u1EE2T TR\u1EA6N 60 ml/kg" : isNearLimit ? "\u26A0\uFE0F C\u1EACN TR\u1EA6N 60 ml/kg" : "\u2713 Trong ng\u01B0\u1EE1ng an to\xE0n"}
            </span>
          </div>
        </div>

        <div class="cdss-kpi-card">
          <div class="cdss-kpi-icon cdss-kpi-icon--blue">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">Tr\u1EA7n An To\xE0n T\u1ED1i \u0110a (60 ml/kg)</span>
            <span class="cdss-kpi-value">${colloidPlan.safeLimitVolumeMl.toLocaleString("vi-VN")} <small>ml</small></span>
            <span class="cdss-kpi-sub">${plan.weightResult.adjustedWeightKg} kg \xD7 60 ml/kg</span>
          </div>
        </div>

        <div class="cdss-kpi-card">
          <div class="cdss-kpi-icon cdss-kpi-icon--purple">
            <i class="fa-solid fa-gauge"></i>
          </div>
          <div class="cdss-kpi-content">
            <span class="cdss-kpi-label">L\u01B0\u1EE3ng CPT C\xF2n Ph\xE9p D\xF9ng</span>
            <span class="cdss-kpi-value ${colloidPlan.remainingSafeMl <= 0 ? "text-danger" : "text-primary"}">
              ${colloidPlan.remainingSafeMl.toLocaleString("vi-VN")} <small>ml</small>
            </span>
            <span class="cdss-kpi-sub">
              ${colloidPlan.remainingSafeMl <= 0 ? "\u0110\xE3 h\u1EBFt quota an to\xE0n" : `~ ${Math.round(colloidPlan.remainingSafeMl / plan.weightResult.adjustedWeightKg)} ml/kg c\xF2n l\u1EA1i`}
            </span>
          </div>
        </div>
      </div>

      <!-- THANH \u0110O T\xCDCH L\u0168Y CPT SO V\u1EDAI TR\u1EA6N AN TO\xC0N 60 ML/KG -->
      <div class="cdss-timeline-card" style="margin-bottom:1.25rem;">
        <div class="cdss-timeline-header">
          <span class="cdss-timeline-title">
            <i class="fa-solid fa-chart-simple text-primary"></i> M\u1EE9c \u0110\u1ED9 S\u1EED D\u1EE5ng Dung L\u01B0\u1EE3ng D\u1ECBch Cao Ph\xE2n T\u1EED T\u1ED1i \u0110a
          </span>
          <span class="cdss-brand-badge ${isOverLimit ? "cdss-brand-badge--danger" : ""}">
            ${colloidPlan.totalColloidMlPerKg} / 60 ml/kg (${pctOfSafeLimit}%)
          </span>
        </div>
        <div style="background:var(--cdss-surface-alt); border-radius:8px; height:18px; width:100%; overflow:hidden; position:relative; border:1px solid var(--cdss-border-subtle); margin:0.6rem 0;">
          <div style="height:100%; width:${pctOfSafeLimit}%; background:${isOverLimit ? "#ef4444" : isNearLimit ? "#f59e0b" : "var(--cdss-primary)"}; transition:width 0.4s ease;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--cdss-text-muted);">
          <span>0 ml/kg (B\u1EAFt \u0111\u1EA7u)</span>
          <span style="color:#f59e0b; font-weight:700;">45 ml/kg (Ng\u01B0\u1EE1ng c\u1EA3nh b\xE1o)</span>
          <span style="color:#ef4444; font-weight:800;">60 ml/kg (Tr\u1EA7n an to\xE0n tuy\u1EC7t \u0111\u1ED1i)</span>
        </div>
        ${isOverLimit ? `
          <div style="margin-top:0.75rem; background:rgba(239, 68, 68, 0.08); border:1.5px solid var(--cdss-danger); border-radius:8px; padding:0.85rem 1rem;">
            <div style="font-size:0.88rem; font-weight:800; color:var(--cdss-danger); margin-bottom:0.25rem;">
              <i class="fa-solid fa-triangle-exclamation"></i> C\u1EA2NH B\xC1O TR\u1EA6N CAO PH\xC2N T\u1EEC: \u0110\xC3 D\xD9NG ${colloidPlan.totalColloidMlPerKg} ML/KG (\u2265 60 ML/KG)
            </div>
            <div style="font-size:0.78rem; line-height:1.45; color:var(--cdss-text);">
              Theo Quy\u1EBFt \u0111\u1ECBnh 2760/Q\u0110-BYT, t\u1ED5ng li\u1EC1u d\u1ECBch cao ph\xE2n t\u1EED kh\xF4ng qu\xE1 60 ml/kg \u0111\u1EC3 tr\xE1nh t\u1ED5n th\u01B0\u01A1ng th\u1EADn c\u1EA5p v\xE0 r\u1ED1i lo\u1EA1n \u0111\xF4ng m\xE1u.
              <strong>N\u1EBFu b\u1EC7nh nh\xE2n v\u1EABn c\xF2n s\u1ED1c:</strong> B\u1EAFt bu\u1ED9c \u0111o CVP, kh\xF4ng t\u0103ng th\xEAm CPT, chuy\u1EC3n sang b\xF9 <strong>Albumin 5% ho\u1EB7c 10%</strong> (Trang 20 Q\u0110 2760) k\u1EBFt h\u1EE3p ph\u1ED1i h\u1EE3p thu\u1ED1c v\u1EADn m\u1EA1ch (Noradrenalin / Dopamin / Dobutamin).
            </div>
          </div>
        ` : ""}
      </div>

      <!-- SELECTOR CH\u1ECCN LO\u1EA0I D\u1ECACH CAO PH\xC2N T\u1EEC & TH\xD4NG TIN D\u01AF\u1EE2C L\xDD H\u1ECCC -->
      <section class="cdss-table-card" style="margin-bottom:1.25rem;">
        <div class="cdss-table-header-wrap">
          <div class="cdss-table-title-area">
            <h2 class="cdss-table-title">
              <i class="fa-solid fa-vial-circle-check"></i> L\u1EF1a Ch\u1ECDn Lo\u1EA1i Dung D\u1ECBch Cao Ph\xE2n T\u1EED (B\u1ED9 Y T\u1EBF 2023)
            </h2>
            <p class="cdss-table-desc">
              \u01AFu ti\xEAn Dextran 40 trong NaCl 0.9% ho\u1EB7c Hydroxyethyl Starch (6% HES 200/0.5). Kh\xF4ng d\xF9ng HES cho b\u1EC7nh nh\xE2n \u0111\xE3 c\xF3 t\u1ED5n th\u01B0\u01A1ng th\u1EADn tr\u01B0\u1EDBc \u0111\xF3.
            </p>
          </div>
        </div>

        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;" id="colloid-type-selector">
          ${Object.keys(DENGUE_COLLOID_METADATA).map((key) => {
        const cMeta = DENGUE_COLLOID_METADATA[key];
        const isSel = key === this.selectedColloidType;
        return `
              <button type="button" class="cdss-case-pill ${isSel ? "active" : ""}" data-colloid-type="${key}" style="font-size:0.8rem; padding:0.5rem 0.85rem;">
                <i class="fa-solid fa-droplet text-primary"></i>
                <strong>${cMeta.shortName}</strong>
                <span style="font-size:0.68rem; opacity:0.8;">(${cMeta.brandNames[0]})</span>
              </button>
            `;
      }).join("")}
        </div>

        <!-- TH\u1EBA D\u01AF\u1EE2C L\xDD L\xC2M S\xC0NG C\u1EE6A D\u1ECACH CPT \u0110ANG CH\u1ECCN -->
        <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:10px; padding:0.85rem 1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; flex-wrap:wrap; gap:6px;">
            <strong style="font-size:0.95rem; color:var(--cdss-primary);">
              <i class="fa-solid fa-info-circle"></i> ${meta.name}
            </strong>
            <span class="cdss-brand-badge">${meta.shortName}</span>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:0.6rem; margin-bottom:0.75rem;">
            <div style="background:var(--cdss-surface); border-radius:6px; padding:0.5rem; border:1px solid var(--cdss-border-subtle);">
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); text-transform:uppercase;">Tr\u1ECDng L\u01B0\u1EE3ng Ph\xE2n T\u1EED</div>
              <strong style="font-size:0.85rem;">${meta.molecularWeight}</strong>
            </div>
            <div style="background:var(--cdss-surface); border-radius:6px; padding:0.5rem; border:1px solid var(--cdss-border-subtle);">
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); text-transform:uppercase;">Th\u1EDDi Gian L\u01B0u L\xF2ng M\u1EA1ch</div>
              <strong style="font-size:0.85rem; color:var(--cdss-primary);">${meta.intravascularPersistence}</strong>
            </div>
            <div style="background:var(--cdss-surface); border-radius:6px; padding:0.5rem; border:1px solid var(--cdss-border-subtle);">
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); text-transform:uppercase;">T\u0103ng Th\u1EC3 T\xEDch L\xF2ng M\u1EA1ch</div>
              <strong style="font-size:0.85rem; color:var(--cdss-success);">${meta.plasmaExpansion}</strong>
            </div>
            <div style="background:var(--cdss-surface); border-radius:6px; padding:0.5rem; border:1px solid var(--cdss-border-subtle);">
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); text-transform:uppercase;">Gi\u1EDBi H\u1EA1n T\u1ED1i \u0110a Li\u1EC1u</div>
              <strong style="font-size:0.85rem; color:var(--cdss-danger);">${meta.maxSafeDose}</strong>
            </div>
          </div>

          <div style="font-size:0.78rem; line-height:1.45; color:var(--cdss-text-muted);">
            <div><strong style="color:var(--cdss-text);">\u01AFu \u0111i\u1EC3m & Ch\u1EC9 \u0111\u1ECBnh:</strong> ${meta.pros}</div>
            <div style="margin-top:2px;"><strong style="color:var(--cdss-danger);">C\u1EA3nh b\xE1o an to\xE0n:</strong> ${meta.cons}</div>
          </div>
        </div>
      </section>

      <!-- B\u1EA2NG C\u1ECCC D\u1ECACH CAO PH\xC2N T\u1EEC 4 C\u1ED8T -->
      <section class="cdss-table-card" style="margin-bottom:1.25rem;">
        <div class="cdss-table-header-wrap">
          <div class="cdss-table-title-area">
            <h2 class="cdss-table-title">
              <i class="fa-solid fa-table-list"></i> B\u1EA3ng C\u1ECDc D\u1ECBch Cao Ph\xE2n T\u1EED N\u1EA5c Thang &amp; Chuy\u1EC3n \u0110i\u1EC7n Gi\u1EA3i (Ph\u1EE5 L\u1EE5c 10)
            </h2>
            <p class="cdss-table-desc">
              Ti\u1EBFn tr\xECnh gi\u1EA3m li\u1EC1u t\u1EEB 15-20 ml/kg/h \u279C 10 ml/kg/h \u279C 7.5-5 ml/kg/h \u279C 3 ml/kg/h \u279C Chuy\u1EC3n \u0111i\u1EC7n gi\u1EA3i (Ringer Lactate / NaCl 0.9%).
            </p>
          </div>
        </div>

        <div class="cdss-table-scroll">
          <table class="cdss-table">
            <thead>
              <tr>
                <th style="width: 24%;">C\u1ED9t 1: M\u1ED1c Gi\u1EDD &amp; Giai \u0110o\u1EA1n</th>
                <th style="width: 26%;">C\u1ED9t 2: T\u1ED1c \u0110\u1ED9 &amp; L\u01B0\u1EE3ng C\u1EA7n</th>
                <th style="width: 26%;">C\u1ED9t 3: T\xEDch L\u0169y CPT &amp; Ng\u01B0\u1EE1ng 60ml/kg</th>
                <th style="width: 24%;">C\u1ED9t 4: Y\xEAu C\u1EA7u \u0110o Hct &amp; Gi\xE1m S\xE1t</th>
              </tr>
            </thead>
            <tbody>
              ${colloidPlan.rows.map((r) => {
        const rowPct = Math.round(r.cumulativeColloidMlPerKg / 60 * 100);
        const isStepOver = r.exceedsThreshold;
        return `
                  <tr class="${isStepOver ? "cdss-row--danger" : ""}">
                    <td>
                      <div class="cdss-step-badge">C\u1EEF ${r.stepIndex}</div>
                      <div class="cdss-time-window">${r.timeWindow}</div>
                      <div class="cdss-stage-title" style="margin-top:2px; font-weight:700; color:${r.fluidKind === "colloid" ? "var(--cdss-primary)" : "var(--cdss-teal)"};">
                        ${r.stageName}
                      </div>
                      <div style="font-size:0.72rem; color:var(--cdss-text-muted);">
                        <i class="fa-solid fa-flask"></i> ${r.fluidName}
                      </div>
                    </td>
                    <td>
                      <div class="cdss-rate-display">
                        <span class="cdss-rate-number">${r.rateMlKgH}</span>
                        <span class="cdss-rate-unit">ml/kg/gi\u1EDD</span>
                      </div>
                      <div class="cdss-drops-box">
                        <i class="fa-solid fa-water" style="color:var(--cdss-info);"></i>
                        <strong>${r.dropsPerMin}</strong> gi\u1ECDt/ph\xFAt
                        <small style="color:var(--cdss-text-muted);">${plan.ageGroup === "child" ? "(D\xE2y vi gi\u1ECDt)" : "(D\xE2y 20 g/ml)"}</small>
                      </div>
                      <div class="cdss-volume-calc">
                        C\u1EA7n: <strong>${r.stepVolumeMl.toLocaleString("vi-VN")} ml</strong> (${r.durationHours}h)
                      </div>
                    </td>
                    <td>
                      <div style="font-size:0.82rem; font-weight:800; color:${isStepOver ? "var(--cdss-danger)" : "var(--cdss-text)"};">
                        T\xEDch l\u0169y: ${r.cumulativeColloidMlPerKg} ml/kg
                      </div>
                      <div style="font-size:0.72rem; color:var(--cdss-text-muted);">
                        T\u1ED5ng th\u1EC3 t\xEDch: ${r.cumulativeColloidMl.toLocaleString("vi-VN")} ml
                      </div>
                      <div style="margin-top:4px; height:8px; width:100%; background:var(--cdss-surface-alt); border-radius:4px; overflow:hidden; border:1px solid var(--cdss-border-subtle);">
                        <div style="height:100%; width:${Math.min(100, rowPct)}%; background:${isStepOver ? "#ef4444" : rowPct >= 75 ? "#f59e0b" : "var(--cdss-primary)"};"></div>
                      </div>
                      <div style="font-size:0.68rem; margin-top:2px; color:${isStepOver ? "var(--cdss-danger)" : "var(--cdss-text-muted)"};">
                        ${isStepOver ? "\u26A0\uFE0F \u0110\xE3 v\u01B0\u1EE3t 60 ml/kg" : `${rowPct}% tr\u1EA7n an to\xE0n`}
                      </div>
                    </td>
                    <td>
                      ${r.hctCheckRequired ? `
                        <div class="cdss-hct-pill" style="margin-bottom:4px;">
                          <i class="fa-solid fa-vial"></i> <strong>\u0110o l\u1EA1i Hct sau c\u1EEF n\xE0y</strong>
                        </div>
                      ` : ""}
                      <div class="cdss-monitor-tip">
                        ${r.monitoringNotes}
                      </div>
                    </td>
                  </tr>
                `;
      }).join("")}
            </tbody>
          </table>
        </div>
      </section>

      <!-- 7 TI\xCAU CHU\u1EA8N DE-ESCALATION CHUY\u1EC2N CPT SANG \u0110I\u1EC6N GI\u1EA2I (PH\u1EE4 L\u1EE4C 10) -->
      <section class="cdss-card" style="margin-bottom:1.25rem;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-list-check text-success"></i> 7 Ti\xEAu Chu\u1EA9n Gi\u1EA3m Li\u1EC1u &amp; Chuy\u1EC3n T\u1EEB CPT Sang \u0110i\u1EC7n Gi\u1EA3i (Ph\u1EE5 L\u1EE5c 10 - Q\u0110 2760)
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              B\xE1c s\u0129 ki\u1EC3m tra t\u1EA1i gi\u01B0\u1EDDng tr\u01B0\u1EDBc khi quy\u1EBFt \u0111\u1ECBnh h\u1EA1 b\u1EADc t\u1ED1c \u0111\u1ED9 ho\u1EB7c chuy\u1EC3n sang Ringer Lactate / NaCl 0.9%.
            </div>
          </div>
          <button type="button" id="btn-check-all-de-escalation" class="cdss-action-btn cdss-action-btn--icon-only" title="\u0110\xE1nh d\u1EA5u ch\u1ECDn t\u1EA5t c\u1EA3 ti\xEAu chu\u1EA9n h\u1EA1 b\u1EADc" aria-label="Ch\u1ECDn T\u1EA5t C\u1EA3">
            <i class="fa-solid fa-check-double"></i>
          </button>
        </div>

        <div style="padding:1rem;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:0.65rem;">
            ${DENGUE_DE_ESCALATION_CHECKLIST.map((crit, idx) => {
        const isChecked = !!this.deEscalationChecked[idx];
        return `
                <label style="display:flex; align-items:flex-start; gap:0.65rem; padding:0.65rem 0.8rem; background:var(--cdss-surface-alt); border:1px solid ${isChecked ? "var(--cdss-success)" : "var(--cdss-border-subtle)"}; border-radius:8px; cursor:pointer; transition:all 0.2s ease;">
                  <input type="checkbox" class="cdss-de-esc-cb" data-crit-idx="${idx}" ${isChecked ? "checked" : ""} style="margin-top:3px; width:16px; height:16px; accent-color:var(--cdss-success);" />
                  <span style="font-size:0.8rem; line-height:1.4; color:var(--cdss-text);">
                    ${crit}
                  </span>
                </label>
              `;
      }).join("")}
          </div>

          <div id="de-escalation-verdict" style="margin-top:0.85rem;">
            <!-- Dynamically populated verdict badge -->
          </div>
        </div>
      </section>

      <!-- WIDGET B\xD9 ALBUMIN KHI CPT \u0110\u1EA0T TR\u1EA6N HO\u1EB6C GI\u1EA2M ALBUMIN M\xC1U (TRANG 20 - Q\u0110 2760) -->
      <section class="cdss-card" style="margin-bottom:0;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-droplet text-purple-600" style="color:var(--cdss-purple);"></i> Ph\xE1c \u0110\u1ED3 B\xF9 Albumin T\u0129nh M\u1EA1ch (B\u1ED9 Y T\u1EBF - Trang 20 Q\u0110 2760)
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              Ch\u1EC9 \u0111\u1ECBnh khi t\u1ED5ng li\u1EC1u CPT \u2265 60 ml/kg m\xE0 c\xF2n s\u1ED1c, ho\u1EB7c s\u1ED1c tr\u01A1 k\xE8m Albumin m\xE1u < 2.5 - 3.0 g/dL.
            </div>
          </div>
          <span class="cdss-brand-badge" style="background:var(--cdss-purple-light); color:var(--cdss-purple); border-color:var(--cdss-purple);">Albumin 5% / 10% / 20%</span>
        </div>

        <div style="padding:1rem;">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
            <div class="cdss-recipe-box">
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">T\u1ED5ng l\u01B0\u1EE3ng Albumin c\u1EA7n b\xF9:</span>
                <strong>${albResult.albuminGrams} gam</strong>
              </div>
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">T\u01B0\u01A1ng \u0111\u01B0\u01A1ng l\u1ECD 20% 50ml:</span>
                <strong style="color:var(--cdss-purple);">${albResult.vials20Percent50ml} l\u1ECD (50ml/l\u1ECD)</strong>
              </div>
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">T\u1ED1c \u0111\u1ED9 truy\u1EC1n g\u1EE3i \xFD:</span>
                <span>${albResult.infusionRateMlH}</span>
              </div>
            </div>

            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.75rem;">
              <div style="font-size:0.8rem; font-weight:800; color:var(--cdss-purple); margin-bottom:0.35rem;">
                <i class="fa-solid fa-mortar-pestle"></i> H\u01B0\u1EDBng D\u1EABn Pha Dung D\u1ECBch Albumin (Ph\u1EE5 l\u1EE5c 18):
              </div>
              <div style="font-size:0.76rem; line-height:1.45; color:var(--cdss-text);">
                \u2022 <strong>Pha Albumin 5%:</strong> ${albResult.preparation5Percent}<br>
                \u2022 <strong>Pha Albumin 10%:</strong> ${albResult.preparation10Percent}<br>
                \u2022 <strong>D\xF9ng Albumin 20% nguy\xEAn ch\u1EA5t:</strong> Truy\u1EC1n qua b\u01A1m ti\xEAm \u0111i\u1EC7n 2 - 5 ml/kg khi c\xF3 qu\xE1 t\u1EA3i tu\u1EA7n ho\xE0n n\u1EB7ng ho\u1EB7c ph\xF9 ph\u1ED5i c\u1EA5p.
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
      const colloidBtns = container.querySelectorAll("#colloid-type-selector button");
      colloidBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const cType = target.getAttribute("data-colloid-type");
          if (cType) {
            this.selectedColloidType = cType;
            this.renderColloidScheduleView(container, plan);
            this.showToast(`\u0110\xE3 chuy\u1EC3n lo\u1EA1i CPT: ${DENGUE_COLLOID_METADATA[cType].shortName}`);
          }
        });
      });
      const cbList = container.querySelectorAll(".cdss-de-esc-cb");
      const updateVerdict = () => {
        const checkedCount = Object.values(this.deEscalationChecked).filter(Boolean).length;
        const totalCount = DENGUE_DE_ESCALATION_CHECKLIST.length;
        const verdictEl = container.querySelector("#de-escalation-verdict");
        if (verdictEl) {
          if (checkedCount >= 5) {
            verdictEl.innerHTML = `
            <div style="background:rgba(16, 185, 129, 0.1); border:1.5px solid var(--cdss-success); border-radius:8px; padding:0.75rem 1rem; display:flex; align-items:center; gap:0.6rem;">
              <i class="fa-solid fa-circle-check text-success" style="font-size:1.25rem;"></i>
              <div>
                <strong style="color:var(--cdss-success); font-size:0.88rem;">\u0110\xC3 \u0110\u1EA0T ${checkedCount}/${totalCount} TI\xCAU CHU\u1EA8N DE-ESCALATION (PH\u1EE4 L\u1EE4C 10)</strong>
                <div style="font-size:0.76rem; color:var(--cdss-text);">B\u1EC7nh nh\xE2n c\u1EA3i thi\u1EC7n t\u1ED1t. \u0110\u1EE7 \u0111i\u1EC1u ki\u1EC7n h\u1EA1 b\u1EADc t\u1ED1c \u0111\u1ED9 CPT ho\u1EB7c chuy\u1EC3n sang b\xF9 d\u1ECBch tinh th\u1EC3 \u0111i\u1EC7n gi\u1EA3i (Ringer Lactate / NaCl 0.9%).</div>
              </div>
            </div>
          `;
          } else {
            verdictEl.innerHTML = `
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.6rem 0.85rem; font-size:0.76rem; color:var(--cdss-text-muted);">
              \u0110\xE3 \u0111\u1EA1t <strong>${checkedCount}/${totalCount}</strong> ti\xEAu chu\u1EA9n. Ti\u1EBFp t\u1EE5c duy tr\xEC ph\xE1c \u0111\u1ED3 CPT hi\u1EC7n t\u1EA1i v\xE0 \u0111\xE1nh gi\xE1 l\u1EA1i sau 1 gi\u1EDD.
            </div>
          `;
          }
        }
      };
      cbList.forEach((cb) => {
        cb.addEventListener("change", (e) => {
          const target = e.target;
          const idx = parseInt(target.getAttribute("data-crit-idx") || "0", 10);
          this.deEscalationChecked[idx] = target.checked;
          const label = target.closest("label");
          if (label) {
            label.style.borderColor = target.checked ? "var(--cdss-success)" : "var(--cdss-border-subtle)";
          }
          updateVerdict();
        });
      });
      const btnCheckAll = container.querySelector("#btn-check-all-de-escalation");
      if (btnCheckAll) {
        btnCheckAll.addEventListener("click", () => {
          DENGUE_DE_ESCALATION_CHECKLIST.forEach((_, idx) => {
            this.deEscalationChecked[idx] = true;
          });
          cbList.forEach((cb) => {
            cb.checked = true;
            const label = cb.closest("label");
            if (label) label.style.borderColor = "var(--cdss-success)";
          });
          updateVerdict();
          this.showToast("\u0110\xE3 \u0111\xE1nh d\u1EA5u \u0111\u1EA1t 7/7 ti\xEAu chu\u1EA9n chuy\u1EC3n \u0111i\u1EC7n gi\u1EA3i!");
        });
      }
      updateVerdict();
    }
    // VIEW 3: PHÁC ĐỒ XỬ TRÍ KHI KHÔNG ĐÁP ỨNG & SỐC TRƠ
    renderRefractorySuiteView(container, plan) {
      const effectiveWeight = plan.weightResult.adjustedWeightKg;
      const albuminCalc = calculateAlbuminDose(effectiveWeight, 2, 3.5);
      container.innerHTML = `
      <section class="cdss-refractory-card" style="margin-top:0;">
        <div class="cdss-refractory-header">
          <h2 class="cdss-refractory-title">
            <i class="fa-solid fa-shield-virus"></i> Ph\xE1c \u0110\u1ED3 X\u1EED Tr\xED Khi Kh\xF4ng \u0110\xE1p \u1EE8ng &amp; S\u1ED1c Tr\u01A1 (B\u1ED9 Y T\u1EBF 2023)
          </h2>
          <span class="cdss-brand-badge" style="background:rgba(239, 68, 68, 0.1); color:var(--cdss-danger); border-color:rgba(239,68,68,0.3);">
            Ph\u1EE5 l\u1EE5c 8, 16, 17, 18 &amp; 26
          </span>
        </div>

        <!-- Refractory Sub-Tabs Nav -->
        <div class="cdss-refractory-nav" id="cdss-ref-subtabs">
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === "tab-cpt" ? "active" : ""}" data-subtab="tab-cpt">
            <i class="fa-solid fa-arrow-trend-up text-warning"></i>
            <span>1. \u0110\u1ED5i CPT N\u1EA5c Thang</span>
          </button>
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === "tab-blood" ? "active" : ""}" data-subtab="tab-blood">
            <i class="fa-solid fa-droplet text-danger"></i>
            <span>2. M\xE1u &amp; Albumin (PL 17)</span>
          </button>
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === "tab-cvp" ? "active" : ""}" data-subtab="tab-cvp">
            <i class="fa-solid fa-gauge-high text-primary"></i>
            <span>3. \u0110o CVP &amp; V\u1EADn M\u1EA1ch (PL 18)</span>
          </button>
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === "tab-abcs" ? "active" : ""}" data-subtab="tab-abcs">
            <i class="fa-solid fa-kit-medical text-purple"></i>
            <span>4. G\xF3i H\u1ED3i S\u1EE9c ABCS</span>
          </button>
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === "tab-liver" ? "active" : ""}" data-subtab="tab-liver">
            <i class="fa-solid fa-triangle-exclamation text-danger"></i>
            <span>5. Suy Gan C\u1EA5p (NAC - PL 26)</span>
          </button>
          <button type="button" class="cdss-ref-tab-btn ${this.activeRefractorySubTab === "tab-overload" ? "active" : ""}" data-subtab="tab-overload">
            <i class="fa-solid fa-water text-info"></i>
            <span>6. Qu\xE1 T\u1EA3i / Ph\xF9 Ph\u1ED5i C\u1EA5p</span>
          </button>
        </div>

        <div class="cdss-refractory-body" id="cdss-ref-subtab-content">
          <!-- Dynamic Content -->
        </div>
      </section>
    `;
      this.renderSubTabContent(plan);
      const subTabBtns = container.querySelectorAll(".cdss-ref-tab-btn");
      subTabBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const sub = target.getAttribute("data-subtab");
          if (sub) {
            subTabBtns.forEach((b) => b.classList.remove("active"));
            target.classList.add("active");
            this.activeRefractorySubTab = sub;
            this.renderSubTabContent(plan);
          }
        });
      });
    }
    renderSubTabContent(plan) {
      const body = document.getElementById("cdss-ref-subtab-content");
      if (!body) return;
      const effectiveWeight = plan.weightResult.adjustedWeightKg;
      const albuminCalc = calculateAlbuminDose(effectiveWeight, 2, 3.5);
      switch (this.activeRefractorySubTab) {
        case "tab-cpt": {
          const cptScen = DENGUE_NON_RESPONSE_SCENARIOS.cpt_escalation;
          const rateAdult = Math.round(15 * effectiveWeight);
          const rateChild = Math.round(20 * effectiveWeight);
          body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-text); margin:0;">
                  ${cptScen.name}
                </h3>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:2px;">
                  ${cptScen.triggerCriteria}
                </div>
              </div>
              <span class="cdss-dose-badge">${cptScen.tag}</span>
            </div>

            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border); border-radius:8px; padding:0.85rem 1rem; margin-bottom:1rem;">
              <div style="font-size:0.82rem; line-height:1.45; margin-bottom:0.6rem;">
                <strong>C\u01A1 ch\u1EBF sinh l\xFD b\u1EC7nh:</strong> ${cptScen.mechanism}
              </div>
              <div style="font-size:0.85rem; font-weight:700; color:var(--cdss-primary);">
                <strong>X\u1EED tr\xED t\u1EE9c th\xEC:</strong> ${cptScen.primaryAction}
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-bottom:1rem;">
              <div class="cdss-card" style="padding:0.85rem; border-top:3px solid var(--cdss-warning);">
                <div style="font-size:0.85rem; font-weight:800; margin-bottom:0.4rem; color:var(--cdss-text);">
                  <i class="fa-solid fa-child text-warning"></i> Li\u1EC1u Tr\u1EBB Em (< 16 Tu\u1ED5i)
                </div>
                <div style="font-size:1.15rem; font-weight:800; color:var(--cdss-warning); font-family:var(--cdss-font-mono);">
                  10 - 20 ml/kg/gi\u1EDD
                </div>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:4px;">
                  B\u1EC7nh nh\xE2n (${effectiveWeight}kg): <strong>${Math.round(10 * effectiveWeight)} - ${rateChild} ml/gi\u1EDD</strong>
                </div>
                <div style="font-size:0.75rem; color:var(--cdss-text-muted); margin-top:6px;">
                  Truy\u1EC1n trong 1 gi\u1EDD. N\u1EBFu ra s\u1ED1c: gi\u1EA3m b\u1EADc 10 ml/kg/h (1-2h) -> 7.5 -> 5 -> 3 ml/kg/h.
                </div>
              </div>

              <div class="cdss-card" style="padding:0.85rem; border-top:3px solid var(--cdss-primary);">
                <div style="font-size:0.85rem; font-weight:800; margin-bottom:0.4rem; color:var(--cdss-text);">
                  <i class="fa-solid fa-user-doctor text-primary"></i> Li\u1EC1u Ng\u01B0\u1EDDi L\u1EDBn (\u2265 16 Tu\u1ED5i)
                </div>
                <div style="font-size:1.15rem; font-weight:800; color:var(--cdss-primary); font-family:var(--cdss-font-mono);">
                  10 - 15 ml/kg/gi\u1EDD
                </div>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:4px;">
                  B\u1EC7nh nh\xE2n (${effectiveWeight}kg): <strong>${Math.round(10 * effectiveWeight)} - ${rateAdult} ml/gi\u1EDD</strong>
                </div>
                <div style="font-size:0.75rem; color:var(--cdss-text-muted); margin-top:6px;">
                  Truy\u1EC1n trong 1 gi\u1EDD. N\u1EBFu ra s\u1ED1c: chuy\u1EC3n \u0111i\u1EC7n gi\u1EA3i 10 (2h) -> 6 (2h) -> 3 (5-7h) -> 1.5 ml/kg/h (12h).
                </div>
              </div>
            </div>

            <div style="font-size:0.8rem; background:var(--cdss-surface); border:1px solid var(--cdss-border); border-radius:6px; padding:0.75rem 1rem;">
              <strong style="color:var(--cdss-text);"><i class="fa-solid fa-list-check text-primary"></i> Y l\u1EC7nh c\u1EE5 th\u1EC3 &amp; Gi\xE1m s\xE1t:</strong>
              <ul style="margin:0.4rem 0 0 1.2rem; padding:0; line-height:1.45;">
                ${cptScen.keyOrders.map((o) => `<li>${o}</li>`).join("")}
              </ul>
              <div style="margin-top:0.6rem; padding-top:0.4rem; border-top:1px dashed var(--cdss-border); color:var(--cdss-danger); font-size:0.76rem; font-weight:600;">
                <i class="fa-solid fa-triangle-exclamation"></i> Gi\u1EDBi h\u1EA1n t\u1ED5ng li\u1EC1u CPT: T\u1ED1i \u0111a 60 ml/kg. N\u1EBFu t\u1ED5ng CPT \u2265 60 ml/kg m\xE0 c\xF2n s\u1ED1c -> B\u1EAFt bu\u1ED9c \u0111o CVP v\xE0 xem x\xE9t b\xF9 Albumin 5%!
              </div>
            </div>
          </div>
        `;
          break;
        }
        case "tab-blood": {
          const bloodScen = DENGUE_NON_RESPONSE_SCENARIOS.occult_bleeding;
          const products = plan.bloodProducts;
          body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-danger); margin:0;">
                  <i class="fa-solid fa-droplet"></i> ${bloodScen.name}
                </h3>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:2px;">
                  ${bloodScen.triggerCriteria}
                </div>
              </div>
              <span class="cdss-dose-badge cdss-dose-badge--danger">${bloodScen.tag}</span>
            </div>

            <!-- B\u1EA3ng T\xEDnh Ch\u1EBF Ph\u1EA9m M\xE1u Theo C\xE2n N\u1EB7ng B\u1EC7nh Nh\xE2n -->
            <table class="cdss-ref-table">
              <thead>
                <tr>
                  <th style="width: 25%;">Ch\u1EBF Ph\u1EA9m M\xE1u / Thu\u1ED1c</th>
                  <th style="width: 25%;">Li\u1EC1u T\xEDnh Ra (${effectiveWeight}kg)</th>
                  <th style="width: 28%;">Ch\u1EC9 \u0110\u1ECBnh &amp; Ng\u01B0\u1EE1ng Truy\u1EC1n (BYT 2023)</th>
                  <th style="width: 22%;">L\u01B0u \xDD An To\xE0n</th>
                </tr>
              </thead>
              <tbody>
                ${products.map((p) => `
                  <tr>
                    <td>
                      <div style="font-weight:700; color:var(--cdss-text);">${p.productName}</div>
                      <div style="font-size:0.72rem; color:var(--cdss-text-muted);">${p.doseFormula}</div>
                    </td>
                    <td>
                      <span class="cdss-dose-badge ${p.thresholdMet ? "cdss-dose-badge--danger" : ""}">${p.calculatedDose}</span>
                    </td>
                    <td style="font-size:0.76rem;">${p.indication}</td>
                    <td style="font-size:0.74rem; color:var(--cdss-text-muted);">${p.precautions}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <!-- B\u1EA3ng T\xEDnh B\xF9 Albumin Theo C\xF4ng Th\u1EE9c Q\u0110 2760 -->
            <div class="cdss-albumin-calc-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <div style="font-size:0.9rem; font-weight:800; color:var(--cdss-primary);">
                  <i class="fa-solid fa-flask-vial"></i> B\u1EA3ng T\xEDnh B\xF9 Albumin (B\u1ED9 Y T\u1EBF Trang 20 - Q\u0110 2760)
                </div>
                <span class="cdss-brand-badge">\xC1p l\u1EF1c keo</span>
              </div>
              <div style="font-size:0.8rem; color:var(--cdss-text); margin-bottom:0.6rem;">
                ${albuminCalc.indicationNotes}
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.6rem; background:var(--cdss-surface); border-radius:6px; padding:0.6rem; border:1px solid var(--cdss-border);">
                <div>
                  <div style="font-size:0.72rem; color:var(--cdss-text-muted);">Li\u1EC1u Albumin nguy\xEAn ch\u1EA5t</div>
                  <strong style="font-size:1.05rem; color:var(--cdss-primary); font-family:var(--cdss-font-mono);">${albuminCalc.albuminGrams} g</strong>
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted);">C\u1EA7n ${albuminCalc.vials20Percent50ml} l\u1ECD Albumin 20% 50ml</div>
                </div>
                <div>
                  <div style="font-size:0.72rem; color:var(--cdss-text-muted);">C\xE1ch pha 5% (chu\u1EA9n)</div>
                  <div style="font-size:0.76rem; font-weight:600;">${albuminCalc.preparation5Percent}</div>
                </div>
                <div>
                  <div style="font-size:0.72rem; color:var(--cdss-text-muted);">T\u1ED1c \u0111\u1ED9 truy\u1EC1n khuy\u1EBFn c\xE1o</div>
                  <div style="font-size:0.76rem; font-weight:700; color:var(--cdss-primary);">${albuminCalc.infusionRateMlH}</div>
                </div>
              </div>
            </div>
          </div>
        `;
          break;
        }
        case "tab-cvp": {
          const cvpScen = DENGUE_NON_RESPONSE_SCENARIOS.refractory_shock_cvp;
          const testDose = Math.round(5 * effectiveWeight);
          body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-purple); margin:0;">
                  <i class="fa-solid fa-gauge-high"></i> ${cvpScen.name}
                </h3>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:2px;">
                  ${cvpScen.triggerCriteria}
                </div>
              </div>
              <span class="cdss-dose-badge" style="background:var(--cdss-purple-light); color:var(--cdss-purple); border-color:var(--cdss-purple);">
                ${cvpScen.tag}
              </span>
            </div>

            <!-- Khuy\u1EBFn c\xE1o \u0111\u1EB7t Catheter T\u0129nh M\u1EA1ch N\u1EC1n Khu\u1EF7u Tay -->
            <div style="background:rgba(139, 92, 246, 0.05); border:1px solid rgba(139, 92, 246, 0.2); border-radius:8px; padding:0.85rem 1rem; margin-bottom:1rem;">
              <div style="font-size:0.85rem; font-weight:700; color:var(--cdss-purple); margin-bottom:0.35rem;">
                <i class="fa-solid fa-triangle-exclamation"></i> K\u1EF8 THU\u1EACT \u0110\u1EB6T CVP B\u1EAET BU\u1ED8C: QUA T\u0128NH M\u1EA0CH N\u1EC0N KHU\u1EF6U TAY (SELDINGER C\u1EA2I TI\u1EBEN)
              </div>
              <div style="font-size:0.78rem; line-height:1.45; color:var(--cdss-text);">
                <strong>Tuy\u1EC7t \u0111\u1ED1i KH\xD4NG ch\u1ECDc t\u0129nh m\u1EA1ch c\u1EA3nh trong ho\u1EB7c d\u01B0\u1EDBi \u0111\xF2n:</strong> B\u1EC7nh nh\xE2n SXHD n\u1EB7ng c\xF3 r\u1ED1i lo\u1EA1n \u0111\xF4ng m\xE1u v\xE0 gi\u1EA3m ti\u1EC3u c\u1EA7u s\xE2u; nguy c\u01A1 t\u1EE5 m\xE1u ch\xE8n \xE9p kh\xED qu\u1EA3n v\xE0 tr\xE0n m\xE1u m\xE0ng ph\u1ED5i t\u1EED vong kh\xF4ng th\u1EC3 \xE9p c\u1EA7m m\xE1u \u0111\u01B0\u1EE3c. \u0110\u1EB7t TM n\u1EC1n khu\u1EF7u tay \xE9p c\u1EA7m m\xE1u d\u1EC5 d\xE0ng v\xE0 an to\xE0n 100%.
              </div>
            </div>

            <!-- Test D\u1ECBch & Ph\xE2n Nh\xE1nh CVP -->
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border); border-radius:8px; padding:0.85rem; margin-bottom:1rem;">
              <div style="font-size:0.85rem; font-weight:800; margin-bottom:0.4rem; color:var(--cdss-text);">
                <i class="fa-solid fa-vial"></i> Test D\u1ECBch \u0110o CVP: Cao Ph\xE2n T\u1EED 5 ml/kg trong 30 ph\xFAt (${testDose} ml)
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:0.75rem; margin-top:0.6rem;">
                <div style="background:var(--cdss-surface); border:1px solid rgba(2, 132, 199, 0.3); border-radius:6px; padding:0.75rem; border-top:3px solid var(--cdss-primary);">
                  <div style="font-weight:800; color:var(--cdss-primary); font-size:0.88rem; margin-bottom:0.25rem;">
                    1. N\u1EBFu CVP \u2264 15 cmH2O (IVC x\u1EB9p)
                  </div>
                  <div style="font-size:0.78rem; line-height:1.4; color:var(--cdss-text-muted);">
                    \u2022 V\u1EABn c\xF2n thi\u1EBFu th\u1EC3 t\xEDch tu\u1EA7n ho\xE0n h\u1EEFu hi\u1EC7u.<br>
                    \u2022 Ti\u1EBFp t\u1EE5c truy\u1EC1n Cao Ph\xE2n T\u1EED 10 - 20 ml/kg/h.<br>
                    \u2022 N\u1EBFu t\u1ED5ng CPT \u2265 60 ml/kg k\xE8m Albumin < 2.5 g/dL: B\xF9 Albumin 5% ho\u1EB7c 10%.
                  </div>
                </div>

                <div style="background:var(--cdss-surface); border:1px solid rgba(239, 68, 68, 0.3); border-radius:6px; padding:0.75rem; border-top:3px solid var(--cdss-danger);">
                  <div style="font-weight:800; color:var(--cdss-danger); font-size:0.88rem; margin-bottom:0.25rem;">
                    2. N\u1EBFu CVP > 15 cmH2O (IVC c\u0103ng to)
                  </div>
                  <div style="font-size:0.78rem; line-height:1.4; color:var(--cdss-text-muted);">
                    \u2022 Qu\xE1 t\u1EA3i th\u1EC3 t\xEDch ho\u1EB7c suy co b\xF3p tim.<br>
                    \u2022 Ng\u01B0ng d\u1ECBch n\u1EBFu c\xF3 d\u1EA5u hi\u1EC7u qu\xE1 t\u1EA3i.<br>
                    \u2022 <strong>Dobutamin 3 - 10 \xB5g/kg/ph\xFAt</strong> t\u0103ng co b\xF3p c\u01A1 tim.<br>
                    \u2022 Ph\u1ED1i h\u1EE3p <strong>Noradrenalin</strong> n\u1EBFu HA t\xE2m tr\u01B0\u01A1ng t\u1EE5t (s\u1ED1c \u1EA5m).<br>
                    \u2022 Ph\u1ED1i h\u1EE3p <strong>Adrenalin</strong> n\u1EBFu s\u1ED1c kh\xE1ng tr\u1ECB co b\xF3p tim suy gi\u1EA3m.
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
          break;
        }
        case "tab-abcs": {
          const abcs = plan.abcsChecklist;
          body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-text); margin:0;">
                <i class="fa-solid fa-kit-medical text-primary"></i> G\xF3i H\u1ED3i S\u1EE9c To\xE0n Di\u1EC7n ABCS (Ph\u1EE5 L\u1EE5c 16.2 &amp; 18)
              </h3>
              <span class="cdss-brand-badge">B\u1EAFt bu\u1ED9c khi s\u1ED1c tr\u01A1</span>
            </div>
            <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-bottom:0.85rem;">
              \u1EDE m\u1ECDi b\u1EC7nh nh\xE2n s\u1ED1c SXHD kh\xF4ng \u0111\xE1p \u1EE9ng b\xF9 d\u1ECBch ho\u1EB7c t\xE1i s\u1ED1c nhi\u1EC1u l\u1EA7n, b\u1EAFt bu\u1ED9c r\xE0 so\xE1t \u0111\u1ED3ng th\u1EDDi 4 y\u1EBFu t\u1ED1 c\u01A1 b\u1EA3n ABCS \u0111\u1EC3 \u0111\u1EA3o ng\u01B0\u1EE3c toan ki\u1EC1m, h\u1EA1 canxi v\xE0 suy t\u1EA1ng:
            </div>

            <div class="cdss-abcs-grid">
              <div class="cdss-abcs-card cdss-abcs-card--acidosis">
                <div class="cdss-abcs-card-title">
                  <i class="fa-solid fa-vial-virus text-danger"></i> ${abcs.acidosis.title}
                </div>
                <div class="cdss-abcs-criteria">Ng\u01B0\u1EE1ng: ${abcs.acidosis.criteria}</div>
                <div class="cdss-abcs-action">${abcs.acidosis.action}</div>
              </div>

              <div class="cdss-abcs-card cdss-abcs-card--bleeding">
                <div class="cdss-abcs-card-title">
                  <i class="fa-solid fa-droplet text-danger"></i> ${abcs.bleeding.title}
                </div>
                <div class="cdss-abcs-criteria">Ng\u01B0\u1EE1ng: ${abcs.bleeding.criteria}</div>
                <div class="cdss-abcs-action">${abcs.bleeding.action}</div>
              </div>

              <div class="cdss-abcs-card cdss-abcs-card--calcium">
                <div class="cdss-abcs-card-title">
                  <i class="fa-solid fa-bone text-warning"></i> ${abcs.calcium.title}
                </div>
                <div class="cdss-abcs-criteria">Ng\u01B0\u1EE1ng: ${abcs.calcium.criteria}</div>
                <div class="cdss-abcs-action">${abcs.calcium.action}</div>
              </div>

              <div class="cdss-abcs-card cdss-abcs-card--sugar">
                <div class="cdss-abcs-card-title">
                  <i class="fa-solid fa-cubes-stacked text-success"></i> ${abcs.sugar.title}
                </div>
                <div class="cdss-abcs-criteria">Ng\u01B0\u1EE1ng: ${abcs.sugar.criteria}</div>
                <div class="cdss-abcs-action">${abcs.sugar.action}</div>
              </div>
            </div>
          </div>
        `;
          break;
        }
        case "tab-liver": {
          const nac = plan.nacProtocol;
          const liverScen = DENGUE_NON_RESPONSE_SCENARIOS.acute_liver_failure;
          body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-danger); margin:0;">
                  <i class="fa-solid fa-triangle-exclamation"></i> ${liverScen.name}
                </h3>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:2px;">
                  ${liverScen.triggerCriteria}
                </div>
              </div>
              <span class="cdss-dose-badge cdss-dose-badge--danger">${liverScen.tag}</span>
            </div>

            <!-- C\u1EA3nh B\xE1o Ch\u1ED1ng Ch\u1EC9 \u0110\u1ECBnh Tuy\u1EC7t \u0110\u1ED1i Ringer Lactate & Paracetamol -->
            <div style="background:rgba(239, 68, 68, 0.08); border:1.5px solid var(--cdss-danger); border-radius:8px; padding:0.85rem 1rem; margin-bottom:1rem;">
              <div style="font-size:0.9rem; font-weight:800; color:var(--cdss-danger); margin-bottom:0.35rem;">
                <i class="fa-solid fa-ban"></i> CH\u1ED0NG CH\u1EC8 \u0110\u1ECANH TUY\u1EC6T \u0110\u1ED0I RINGER LACTATE &amp; PARACETAMOL!
              </div>
              <div style="font-size:0.78rem; line-height:1.45; color:var(--cdss-text);">
                Khi gan t\u1ED5n th\u01B0\u01A1ng n\u1EB7ng ho\u1EB7c suy gan c\u1EA5p (AST/ALT \u2265 1000 U/L), gan kh\xF4ng chuy\u1EC3n h\xF3a \u0111\u01B0\u1EE3c lactate d\u1EABn \u0111\u1EBFn b\xF9ng ph\xE1t toan lactic t\u1EED vong. D\u1ECBch thay th\u1EBF b\u1EAFt bu\u1ED9c: <strong>NaCl 0.9% ho\u1EB7c Ringer Acetate, Dextrosaline</strong>. H\u1EA1 s\u1ED1t b\u1EB1ng lau m\xE1t n\u01B0\u1EDBc \u1EA5m.
              </div>
            </div>

            <!-- B\u1EA3ng Ph\xE1c \u0110\u1ED3 N-Acetylcysteine 4 Pha -->
            <div style="font-size:0.85rem; font-weight:800; color:var(--cdss-text); margin-bottom:0.4rem;">
              Ph\xE1c \u0110\u1ED3 Truy\u1EC1n N-Acetylcysteine (NAC) T\u0129nh M\u1EA1ch 4 Pha (Ph\u1EE5 L\u1EE5c 26 - Q\u0110 2760)
            </div>
            <table class="cdss-ref-table">
              <thead>
                <tr>
                  <th style="width: 25%;">Giai \u0110o\u1EA1n</th>
                  <th style="width: 20%;">Li\u1EC1u mg/kg</th>
                  <th style="width: 25%;">T\u1ED5ng L\u01B0\u1EE3ng (${effectiveWeight}kg)</th>
                  <th style="width: 30%;">Dung M\xF4i &amp; T\u1ED1c \u0110\u1ED9 B\u01A1m Ti\xEAm</th>
                </tr>
              </thead>
              <tbody>
                ${nac.phases.map((p) => `
                  <tr>
                    <td><strong>${p.phaseName}</strong></td>
                    <td><span class="cdss-dose-badge">${p.doseMgKg} mg/kg</span></td>
                    <td><strong>${p.totalMg.toLocaleString("vi-VN")} mg</strong></td>
                    <td style="font-size:0.78rem;">
                      <div>${p.diluent}</div>
                      <div style="color:var(--cdss-primary); font-weight:700;">T\u1ED1c \u0111\u1ED9: ${p.pumpRateMlH}</div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `;
          break;
        }
        case "tab-overload": {
          const overScen = DENGUE_NON_RESPONSE_SCENARIOS.fluid_overload;
          const furoDose = Math.round(0.75 * effectiveWeight * 10) / 10;
          body.innerHTML = `
          <div class="cdss-tab-pane active">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <div>
                <h3 style="font-size:1.05rem; font-weight:800; color:var(--cdss-warning); margin:0;">
                  <i class="fa-solid fa-water"></i> ${overScen.name}
                </h3>
                <div style="font-size:0.8rem; color:var(--cdss-text-muted); margin-top:2px;">
                  ${overScen.triggerCriteria}
                </div>
              </div>
              <span class="cdss-dose-badge" style="background:var(--cdss-warning-light); color:var(--cdss-warning); border-color:var(--cdss-warning);">
                ${overScen.tag}
              </span>
            </div>

            <!-- X\u1EED Tr\xED Kh\u1EA9n C\u1EA5p -->
            <div style="background:rgba(245, 158, 11, 0.08); border:1.5px solid var(--cdss-warning); border-radius:8px; padding:0.85rem 1rem; margin-bottom:1rem;">
              <div style="font-size:0.9rem; font-weight:800; color:var(--cdss-warning); margin-bottom:0.35rem;">
                <i class="fa-solid fa-stop-circle"></i> NG\u01AFNG NGAY D\u1ECACH TRUY\u1EC0N T\u0128NH M\u1EA0CH!
              </div>
              <div style="font-size:0.8rem; line-height:1.45; color:var(--cdss-text);">
                (1) N\u1EB1m \u0111\u1EA7u cao 30 - 45\xB0.<br>
                (2) Th\u1EDF oxy qua canulla 2 - 5 L/p -> Th\u1EDF NCPAP \xE1p l\u1EF1c 4 - 6 cmH2O n\u1EBFu SpO2 < 92%.<br>
                (3) <strong>Furosemide:</strong> 0.5 - 1 mg/kg ti\xEAm TM ch\u1EADm (B\u1EC7nh nh\xE2n ${effectiveWeight}kg: <strong>${furoDose} mg</strong> TM). <em>Ch\u1EC9 d\xF9ng khi huy\u1EBFt \xE1p \u1ED5n \u0111\u1ECBnh</em>.<br>
                (4) <strong>Dobutamin:</strong> 5 - 10 \xB5g/kg/ph\xFAt \u0111\u1EC3 t\u0103ng co b\xF3p c\u01A1 tim, gi\u1EA3m \xE1p l\u1EF1c mao m\u1EA1ch ph\u1ED5i b\xEDt.<br>
                (5) Ch\u1ECDc h\xFAt gi\u1EA3i \xE1p m\xE0ng b\u1EE5ng/m\xE0ng ph\u1ED5i khi suy h\xF4 h\u1EA5p n\u1EB7ng v\xE0 \xE1p l\u1EF1c b\xE0ng quang > 27 cmH2O.
              </div>
            </div>
          </div>
        `;
          break;
        }
      }
    }
    // VIEW 4: THUỐC VẬN MẠCH & LƯU ĐỒ HUYẾT ĐỘNG CVP BƠM TIÊM ĐIỆN 50ML (PHỤ LỤC 15 & 18)
    renderVasopressorsView(container, plan) {
      const effectiveWeight = plan.weightResult.adjustedWeightKg;
      const {
        vasopressorDopamin: d,
        vasopressorNoradrenalin: n,
        vasopressorDobutamin: dob,
        vasopressorAdrenalin: adr
      } = plan;
      const decision = evaluateVasopressorAlgorithm(
        this.currentHemodynamic,
        effectiveWeight,
        plan.patient.ageYears
      );
      plan.vasopressorDecision = decision;
      const cptTestMl = Math.round(5 * effectiveWeight);
      const cptTestPumpRate = Math.round(10 * effectiveWeight);
      const curDrug = this.interactiveDrugName;
      const isNoraOrAdr = curDrug.toLowerCase().includes("noradrenalin") || curDrug.toLowerCase().includes("adrenalin");
      const calcRecipeTotalMg = isNoraOrAdr ? Math.round(0.3 * effectiveWeight * 100) / 100 : Math.round(3 * effectiveWeight * 10) / 10;
      const calcEquivText = isNoraOrAdr ? "1 ml/gi\u1EDD = 0.1 \xB5g/kg/ph\xFAt" : "1 ml/gi\u1EDD = 1 \xB5g/kg/ph\xFAt";
      container.innerHTML = `
      <!-- KH\u1ED0I 1: L\u01AFU \u0110\u1ED2 CH\u1ECCN THU\u1ED0C V\u1EACN M\u1EA0CH THEO CVP & HUY\u1EBET \u0110\u1ED8NG (PH\u1EE4 L\u1EE4C 15 & 18) -->
      <section class="cdss-card" style="margin-top:0; margin-bottom:1.25rem;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-diagram-project text-primary"></i> L\u01B0u \u0110\u1ED3 Ch\u1ECDn Thu\u1ED1c V\u1EADn M\u1EA1ch &amp; Inotrope Theo CVP &amp; Huy\u1EBFt \u0110\u1ED9ng (Ph\u1EE5 L\u1EE5c 15 &amp; 18)
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              Ph\xE2n t\u1EA7ng theo \xC1p l\u1EF1c t\u0129nh m\u1EA1ch trung t\xE2m (CVP), Co b\xF3p c\u01A1 tim v\xE0 Tr\u01B0\u01A1ng l\u1EF1c m\u1EA1ch (Q\u0110 2760/Q\u0110-BYT)
            </div>
          </div>
          <span class="cdss-brand-badge">Ph\u1EE5 l\u1EE5c 15 &amp; 18</span>
        </div>

        <div style="padding:1rem;">
          <!-- B\u1ED8 CH\u1ECCN 4 TR\u1EE4C HUY\u1EBET \u0110\u1ED8NG H\u1ECCC -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
            <!-- 1. M\u1EE9c CVP -->
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.65rem 0.8rem;">
              <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); margin-bottom:0.4rem;">
                <i class="fa-solid fa-gauge-high text-primary"></i> 1. M\u1EE9c CVP \u0110o \u0110\u01B0\u1EE3c:
              </div>
              <div style="display:flex; flex-direction:column; gap:0.35rem;">
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.cvpLevel === "low_normal" ? "active" : ""}" data-hemo-prop="cvpLevel" data-hemo-val="low_normal" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>CVP \u2264 15 cmH2O</strong> (Ch\u01B0a \u0111\u1EE7 ti\u1EC1n t\u1EA3i / Test CPT)
                </button>
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.cvpLevel === "high" ? "active" : ""}" data-hemo-prop="cvpLevel" data-hemo-val="high" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>CVP > 15 cmH2O</strong> (\u0110\u1EE7 ti\u1EC1n t\u1EA3i / Nguy c\u01A1 qu\xE1 t\u1EA3i)
                </button>
              </div>
            </div>

            <!-- 2. S\u1EE9c co b\xF3p c\u01A1 tim -->
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.65rem 0.8rem;">
              <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); margin-bottom:0.4rem;">
                <i class="fa-solid fa-heart-pulse text-danger"></i> 2. Co B\xF3p C\u01A1 Tim:
              </div>
              <div style="display:flex; flex-direction:column; gap:0.35rem;">
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.cardiacContractility === "normal" ? "active" : ""}" data-hemo-prop="cardiacContractility" data-hemo-val="normal" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>B\xECnh th\u01B0\u1EDDng</strong>
                </button>
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.cardiacContractility === "reduced" ? "active" : ""}" data-hemo-prop="cardiacContractility" data-hemo-val="reduced" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>Gi\u1EA3m co b\xF3p</strong> (Vi\xEAm c\u01A1 tim / S\u1ED1c tim Dengue)
                </button>
              </div>
            </div>

            <!-- 3. Tr\u01B0\u01A1ng l\u1EF1c m\u1EA1ch & Huy\u1EBFt \xE1p -->
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.65rem 0.8rem;">
              <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); margin-bottom:0.4rem;">
                <i class="fa-solid fa-bolt text-warning"></i> 3. Tr\u01B0\u01A1ng L\u1EF1c M\u1EA1ch &amp; HA:
              </div>
              <div style="display:flex; flex-direction:column; gap:0.35rem;">
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.vascularTone === "normal" ? "active" : ""}" data-hemo-prop="vascularTone" data-hemo-val="normal" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>B\xECnh th\u01B0\u1EDDng</strong>
                </button>
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.vascularTone === "low_warm_shock" ? "active" : ""}" data-hemo-prop="vascularTone" data-hemo-val="low_warm_shock" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>T\u1EE5t HA t\xE2m tr\u01B0\u01A1ng / S\u1ED1c \u1EA5m</strong> (Gi\u1EA3m kh\xE1ng l\u1EF1c)
                </button>
              </div>
            </div>

            <!-- 4. Qu\xE1 t\u1EA3i tu\u1EA7n ho\xE0n -->
            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.65rem 0.8rem;">
              <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; color:var(--cdss-text-muted); margin-bottom:0.4rem;">
                <i class="fa-solid fa-water text-teal-600"></i> 4. Qu\xE1 T\u1EA3i Tu\u1EA7n Ho\xE0n:
              </div>
              <div style="display:flex; flex-direction:column; gap:0.35rem;">
                <button type="button" class="cdss-segmented-btn ${!this.currentHemodynamic.isOverloaded ? "active" : ""}" data-hemo-prop="isOverloaded" data-hemo-val="false" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>Kh\xF4ng qu\xE1 t\u1EA3i</strong>
                </button>
                <button type="button" class="cdss-segmented-btn ${this.currentHemodynamic.isOverloaded ? "active" : ""}" data-hemo-prop="isOverloaded" data-hemo-val="true" style="font-size:0.75rem; text-align:left; padding:0.35rem 0.6rem;">
                  <strong>C\xF3 qu\xE1 t\u1EA3i / D\u1ECDa ph\xF9 ph\u1ED5i c\u1EA5p</strong>
                </button>
              </div>
            </div>
          </div>

          <!-- K\u1EBET QU\u1EA2 CH\u1EC8 \u0110\u1EA0O L\xC2M S\xC0NG THEO THU\u1EACT TO\xC1N B\u1ED8 Y T\u1EBE -->
          <div style="background:var(--cdss-surface-alt); border:1.5px solid var(--cdss-primary); border-radius:10px; padding:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; gap:8px;">
              <div>
                <span style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:var(--cdss-primary); letter-spacing:0.5px;">
                  Ch\u1EC9 \u0110\u1ECBnh Thu\u1ED1c &amp; H\xE0nh \u0110\u1ED9ng Khuy\u1EBFn C\xE1o:
                </span>
                <div style="font-size:1.15rem; font-weight:800; color:var(--cdss-text); margin-top:2px;">
                  ${decision.primaryDrug}
                </div>
              </div>
              <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                <span class="cdss-dose-badge cdss-dose-badge--danger" style="font-size:0.8rem;">Li\u1EC1u: ${decision.primaryDose}</span>
                <span class="cdss-dose-badge" style="font-size:0.8rem; background:rgba(13,148,136,0.12); color:var(--cdss-primary); border-color:var(--cdss-primary);">
                  B\u01A1m \u0111i\u1EC7n: ${decision.primaryPumpRateMlH}
                </span>
              </div>
            </div>

            <!-- H\xE0nh \u0110\u1ED9ng V\u1EDBi D\u1ECBch Truy\u1EC1n -->
            <div style="background:var(--cdss-surface); border:1px solid var(--cdss-border-subtle); border-radius:6px; padding:0.65rem 0.85rem; margin-bottom:0.65rem;">
              <strong style="color:var(--cdss-danger); font-size:0.82rem;">
                <i class="fa-solid fa-hand-holding-droplet"></i> H\xE0nh \u0111\u1ED9ng d\u1ECBch truy\u1EC1n:
              </strong>
              <span style="font-size:0.8rem; color:var(--cdss-text); margin-left:4px;">
                ${decision.fluidAction}
              </span>
            </div>

            <!-- Thu\u1ED1c Ph\u1ED1i H\u1EE3p / C\u1EE9u Nguy n\u1EBFu c\xF3 -->
            ${decision.secondaryDrug || decision.rescueDrug ? `
              <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:0.65rem; font-size:0.78rem;">
                ${decision.secondaryDrug ? `
                  <div style="background:var(--cdss-surface); border:1px solid var(--cdss-border-subtle); border-radius:6px; padding:0.45rem 0.75rem;">
                    <strong>Ph\u1ED1i h\u1EE3p:</strong> <span style="color:var(--cdss-purple); font-weight:700;">${decision.secondaryDrug}</span> ${decision.secondaryDose ? `(${decision.secondaryDose})` : ""}
                  </div>
                ` : ""}
                ${decision.rescueDrug ? `
                  <div style="background:var(--cdss-surface); border:1px solid var(--cdss-danger); border-radius:6px; padding:0.45rem 0.75rem; color:var(--cdss-danger);">
                    <strong>C\u1EE9u nguy:</strong> <span style="font-weight:800;">${decision.rescueDrug}</span>
                  </div>
                ` : ""}
              </div>
            ` : ""}

            <!-- L\xFD lu\u1EADn l\xE2m s\xE0ng & Ch\u1EC9 d\u1EABn theo d\xF5i -->
            <div style="font-size:0.78rem; line-height:1.45; color:var(--cdss-text-muted);">
              <div><strong>L\xFD lu\u1EADn l\xE2m s\xE0ng:</strong> ${decision.clinicalRationale}</div>
              <ul style="margin:0.4rem 0 0 1.2rem; padding:0;">
                ${decision.monitoringDirectives.map((dir) => `<li>${dir}</li>`).join("")}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- KH\u1ED0I 2: \xD4 TEST D\u1ECACH CAO PH\xC2N T\u1EEC 5 ML/KG TRONG 30 PH\xDAT (PH\u1EE4 L\u1EE4C 18) -->
      <section class="cdss-card" style="margin-bottom:1.25rem;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-stopwatch text-teal-600"></i> Quy Tr\xECnh Test D\u1ECBch Cao Ph\xE2n T\u1EED 5 ml/kg Trong 30 Ph\xFAt (Ph\u1EE5 L\u1EE5c 18 - Q\u0110 2760)
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              B\u1EAFt bu\u1ED9c th\u1EF1c hi\u1EC7n khi CVP \u2264 15 cmH2O nh\u1EB1m \u0111\xE1nh gi\xE1 m\u1EE9c \u0111\xE1p \u1EE9ng th\u1EC3 t\xEDch tr\u01B0\u1EDBc khi n\xE2ng v\u1EADn m\u1EA1ch.
            </div>
          </div>
          <span class="cdss-brand-badge" style="background:var(--cdss-primary-light); color:var(--cdss-primary); border-color:var(--cdss-primary);">5 ml/kg / 30 ph\xFAt</span>
        </div>

        <div style="padding:1rem;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin-bottom:0.85rem;">
            <div class="cdss-recipe-box">
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">C\xE2n n\u1EB7ng t\xEDnh d\u1ECBch:</span>
                <strong>${effectiveWeight} kg</strong>
              </div>
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">Th\u1EC3 t\xEDch Test CPT (5 ml/kg):</span>
                <strong style="color:var(--cdss-primary); font-size:1.05rem;">${cptTestMl} ml</strong>
              </div>
              <div class="cdss-recipe-row">
                <span class="cdss-recipe-key">Th\u1EDDi gian truy\u1EC1n:</span>
                <span>Ch\xEDnh x\xE1c <strong>30 ph\xFAt</strong></span>
              </div>
              <div class="cdss-recipe-row cdss-recipe-highlight text-primary">
                <span>T\u1ED1c \u0111\u1ED9 b\u01A1m m\xE1y:</span>
                <span><strong>${cptTestPumpRate} ml/gi\u1EDD</strong> trong 30 ph\xFAt</span>
              </div>
            </div>

            <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.75rem; font-size:0.78rem; line-height:1.45;">
              <strong style="color:var(--cdss-primary); font-size:0.82rem; display:block; margin-bottom:0.35rem;">
                <i class="fa-solid fa-stethoscope"></i> \u0110\xE1nh Gi\xE1 \u0110\xE1p \u1EE8ng Sau 30 Ph\xFAt Test CPT:
              </strong>
              \u2022 <strong>\u0394CVP t\u0103ng \u2265 5 cmH2O ho\u1EB7c Huy\u1EBFt \xE1p l\xEAn:</strong> Th\u1EC3 t\xEDch l\xF2ng m\u1EA1ch thi\u1EBFu h\u1EE5t \u279C Ti\u1EBFp t\u1EE5c truy\u1EC1n CPT t\u1ED1c \u0111\u1ED9 10 - 20 ml/kg/h.<br>
              \u2022 <strong>CVP t\u0103ng v\u1ECDt > 15 cmH2O m\xE0 HA kh\xF4ng l\xEAn:</strong> Ti\u1EC1n t\u1EA3i \u0111\xE3 \u0111\u1EA7y, nguy c\u01A1 suy tim/qu\xE1 t\u1EA3i \u279C Ng\u01B0ng d\u1ECBch, d\xF9ng ngay <strong>Dobutamin</strong> ho\u1EB7c <strong>Noradrenalin</strong>.<br>
              \u2022 <strong>\u0394CVP < 5 cmH2O & HA kh\xF4ng c\u1EA3i thi\u1EC7n:</strong> Th\u1EA5t tho\xE1t huy\u1EBFt t\u01B0\u01A1ng c\u1EF1c nhanh ho\u1EB7c m\u1EA5t m\xE1u \u1EA9n \u279C \u0110o l\u1EA1i Hct t\u1EA1i gi\u01B0\u1EDDng, si\xEAu \xE2m tim/b\u1EE5ng kh\u1EA9n.
            </div>
          </div>
        </div>
      </section>

      <!-- KH\u1ED0I 3: B\u1ED8 T\xCDNH LI\u1EC0U & T\u1ED0C \u0110\u1ED8 B\u01A0M TI\xCAM \u0110I\u1EC6N 50ML HAI CHI\u1EC0U TH\u1EDCI GIAN TH\u1EF0C -->
      <section class="cdss-card" style="margin-bottom:1.25rem;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-calculator text-primary"></i> B\u1ED9 T\xEDnh Li\u1EC1u &amp; T\u1ED1c \u0110\u1ED9 B\u01A1m Ti\xEAm \u0110i\u1EC7n 50ml Hai Chi\u1EC1u T\u01B0\u01A1ng T\xE1c
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              Nh\u1EADp Li\u1EC1u (\xB5g/kg/ph\xFAt) \u279C T\u1EF1 t\xEDnh T\u1ED1c \u0111\u1ED9 b\u01A1m (ml/h) HO\u1EB6C Nh\u1EADp T\u1ED1c \u0111\u1ED9 b\u01A1m (ml/h) \u279C T\u1EF1 t\xEDnh Li\u1EC1u
            </div>
          </div>
          <span class="cdss-brand-badge">Realtime 2-Way</span>
        </div>

        <div style="padding:1rem;">
          <!-- N\xFAt ch\u1ECDn 4 lo\u1EA1i thu\u1ED1c v\u1EADn m\u1EA1ch -->
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:1rem;" id="calc-drug-selector">
            ${["Dopamin", "Noradrenalin", "Dobutamin", "Adrenalin"].map((dr) => `
              <button type="button" class="cdss-case-pill ${dr === this.interactiveDrugName ? "active" : ""}" data-calc-drug="${dr}" style="font-size:0.8rem; padding:0.45rem 0.85rem;">
                <i class="fa-solid fa-syringe ${dr.includes("Noradrenalin") || dr.includes("Adrenalin") ? "text-danger" : "text-primary"}"></i>
                <span>${dr}</span>
              </button>
            `).join("")}
          </div>

          <!-- Card c\xF4ng th\u1EE9c pha c\u1EE7a thu\u1ED1c \u0111ang ch\u1ECDn -->
          <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.75rem 1rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              <span style="font-size:0.72rem; color:var(--cdss-text-muted); text-transform:uppercase;">C\xF4ng Th\u1EE9c Pha B\u01A1m Ti\xEAm \u0110i\u1EC7n 50ml (BYT):</span>
              <div style="font-size:0.95rem; font-weight:800; color:var(--cdss-text); margin-top:2px;">
                ${curDrug}: Pha <strong>${calcRecipeTotalMg} mg</strong> trong 50ml Glucose 5%
              </div>
            </div>
            <div class="cdss-brand-badge" style="font-size:0.8rem; background:rgba(13,148,136,0.12); color:var(--cdss-primary); border-color:var(--cdss-primary);">
              Quy \u0111\u1ED5i: ${calcEquivText}
            </div>
          </div>

          <!-- B\u1EA3ng 2 input song song + Slider -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <!-- Input 1: Li\u1EC1u (\xB5g/kg/ph\xFAt) -->
            <div style="background:var(--cdss-surface); border:1.5px solid var(--cdss-primary); border-radius:8px; padding:0.85rem;">
              <label class="cdss-form-label" style="font-size:0.78rem; font-weight:800; color:var(--cdss-primary);">
                <i class="fa-solid fa-weight-hanging"></i> Li\u1EC1u Thu\u1ED1c (\xB5g/kg/ph\xFAt):
              </label>
              <div class="cdss-input-group" style="margin-top:4px;">
                <input type="number" id="calc-input-dose" min="0" max="30" step="${isNoraOrAdr ? "0.01" : "0.5"}" value="${this.interactiveDose}" class="cdss-input" style="font-size:1.15rem; font-weight:800; font-family:var(--cdss-font-mono);" />
                <span class="cdss-input-suffix">\xB5g/kg/p</span>
              </div>
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); margin-top:4px;">
                Li\u1EC1u chu\u1EA9n: ${curDrug.toLowerCase().includes("dopamin") ? "5 - 10 \xB5g/kg/p" : curDrug.toLowerCase().includes("noradrenalin") ? "0.05 - 1.0 \xB5g/kg/p" : curDrug.toLowerCase().includes("dobutamin") ? "3 - 10 \xB5g/kg/p" : "0.05 - 0.3 \xB5g/kg/p"}
              </div>
            </div>

            <!-- Input 2: T\u1ED1c \u0111\u1ED9 b\u01A1m ti\xEAm \u0111i\u1EC7n (ml/gi\u1EDD) -->
            <div style="background:var(--cdss-surface); border:1.5px solid var(--cdss-teal); border-radius:8px; padding:0.85rem;">
              <label class="cdss-form-label" style="font-size:0.78rem; font-weight:800; color:var(--cdss-teal);">
                <i class="fa-solid fa-sliders"></i> T\u1ED1c \u0110\u1ED9 B\u01A1m Ti\xEAm \u0110i\u1EC7n 50ml (ml/gi\u1EDD):
              </label>
              <div class="cdss-input-group" style="margin-top:4px;">
                <input type="number" id="calc-input-rate" min="0" max="50" step="0.1" value="${this.interactivePumpRate}" class="cdss-input" style="font-size:1.15rem; font-weight:800; font-family:var(--cdss-font-mono); color:var(--cdss-teal);" />
                <span class="cdss-input-suffix">ml/gi\u1EDD</span>
              </div>
              <div style="font-size:0.68rem; color:var(--cdss-text-muted); margin-top:4px;">
                C\xE0i \u0111\u1EB7t tr\u1EF1c ti\u1EBFp tr\xEAn m\xE1y b\u01A1m ti\xEAm \u0111i\u1EC7n 50ml
              </div>
            </div>
          </div>

          <!-- Slider k\xE9o t\u1ED1c \u0111\u1ED9 -->
          <div style="background:var(--cdss-surface-alt); border:1px solid var(--cdss-border-subtle); border-radius:8px; padding:0.75rem 1rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
              <span>K\xE9o ch\u1EC9nh t\u1ED1c \u0111\u1ED9 b\u01A1m nhanh:</span>
              <strong id="slider-rate-label" style="color:var(--cdss-primary); font-family:var(--cdss-font-mono);">${this.interactivePumpRate} ml/gi\u1EDD (${this.interactiveDose} \xB5g/kg/p)</strong>
            </div>
            <input type="range" id="calc-slider-rate" min="0" max="${isNoraOrAdr ? "15" : "30"}" step="${isNoraOrAdr ? "0.1" : "0.5"}" value="${this.interactivePumpRate}" style="width:100%; height:6px; accent-color:var(--cdss-primary); cursor:pointer;" />
          </div>
        </div>
      </section>

      <!-- KH\u1ED0I 4: 4 TH\u1EBA THU\u1ED0C V\u1EACN M\u1EA0CH CHU\u1EA8N B\u01A0M TI\xCAM \u0110I\u1EC6N 50ML -->
      <div class="cdss-card" style="margin-top:0;">
        <div class="cdss-card-header">
          <div>
            <h2 class="cdss-card-title">
              <i class="fa-solid fa-pills text-primary"></i> Tra C\u1EE9u 4 Thu\u1ED1c V\u1EADn M\u1EA1ch Chu\u1EA9n B\u01A1m Ti\xEAm \u0110i\u1EC7n 50ml
            </h2>
            <div style="font-size:0.78rem; color:var(--cdss-text-muted); margin-top:2px;">
              C\xF4ng th\u1EE9c pha, ch\u1EC9 \u0111\u1ECBnh, dung m\xF4i v\xE0 li\u1EC1u d\xF9ng chu\u1EA9n B\u1ED9 Y T\u1EBF (T\xEDnh theo ${effectiveWeight} kg)
            </div>
          </div>
          <span class="cdss-brand-badge">B\u01A1m Ti\xEAm 50ml</span>
        </div>

        <div style="padding:1rem;">
          <div class="cdss-vaso-quad-grid">
            <!-- 1. Dopamin -->
            <div class="cdss-vaso-card">
              <div class="cdss-vaso-card-header">
                <div>
                  <div class="cdss-drug-name cdss-drug-name--primary">1. Dopamin</div>
                  <div class="cdss-drug-indication">L\u1EF1a ch\u1ECDn \u0111\u1EA7u tay \u1EDF tr\u1EBB em</div>
                </div>
                <span class="cdss-brand-badge" style="background:var(--cdss-primary-light); color:var(--cdss-primary); border-color:var(--cdss-primary);">1 ml/h = 1 \xB5g</span>
              </div>
              <div class="cdss-recipe-box">
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">C\xF4ng th\u1EE9c pha:</span>
                  <span><strong>${d.totalMg} mg</strong> Dopamin (3 \xD7 ${d.patientWeightKg} kg)</span>
                </div>
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Dung m\xF4i:</span>
                  <span>Glucose 5% v\u1EEBa \u0111\u1EE7 <strong>50 ml</strong></span>
                </div>
                <div class="cdss-recipe-row cdss-recipe-highlight text-primary">
                  <span>Quy \u0111\u1ED5i li\u1EC1u:</span>
                  <span>T\u1ED1c \u0111\u1ED9 1 ml/gi\u1EDD = 1 \xB5g/kg/ph\xFAt</span>
                </div>
              </div>
              <div class="cdss-dosing-strip">
                <div>
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Li\u1EC1u Khuy\u1EBFn C\xE1o</div>
                  <strong>${d.standardDoseRange}</strong>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">T\u1ED1c \u0110\u1ED9 B\u01A1m</div>
                  <strong style="color:var(--cdss-primary); font-size:1.05rem;">${d.recommendedPumpRateMlH}</strong>
                </div>
              </div>
              <p class="cdss-vaso-warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${d.precautions}</span>
              </p>
            </div>

            <!-- 2. Noradrenalin -->
            <div class="cdss-vaso-card">
              <div class="cdss-vaso-card-header">
                <div>
                  <div class="cdss-drug-name cdss-drug-name--danger">2. Noradrenalin</div>
                  <div class="cdss-drug-indication">S\u1ED1c gi\xE3n m\u1EA1ch / T\u1EE5t HA t\xE2m tr\u01B0\u01A1ng / Ng\u01B0\u1EDDi l\u1EDBn</div>
                </div>
                <span class="cdss-brand-badge cdss-brand-badge--danger">High Alert</span>
              </div>
              <div class="cdss-recipe-box">
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">C\xF4ng th\u1EE9c pha:</span>
                  <span><strong>${n.totalMg} mg</strong> Noradrenalin (0.3 \xD7 ${n.patientWeightKg} kg)</span>
                </div>
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Dung m\xF4i:</span>
                  <span>Glucose 5% v\u1EEBa \u0111\u1EE7 <strong>50 ml</strong></span>
                </div>
                <div class="cdss-recipe-row cdss-recipe-highlight text-danger">
                  <span>Quy \u0111\u1ED5i li\u1EC1u:</span>
                  <span>T\u1ED1c \u0111\u1ED9 1 ml/gi\u1EDD = 0.1 \xB5g/kg/ph\xFAt</span>
                </div>
              </div>
              <div class="cdss-dosing-strip">
                <div>
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Li\u1EC1u Kh\u1EDFi \u0110\u1EA7u</div>
                  <strong>${n.standardDoseRange}</strong>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">T\u1ED1c \u0110\u1ED9 B\u01A1m</div>
                  <strong style="color:var(--cdss-danger); font-size:1.05rem;">${n.recommendedPumpRateMlH}</strong>
                </div>
              </div>
              <p class="cdss-vaso-warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${n.precautions}</span>
              </p>
            </div>

            <!-- 3. Dobutamin -->
            <div class="cdss-vaso-card">
              <div class="cdss-vaso-card-header">
                <div>
                  <div class="cdss-drug-name" style="color:var(--cdss-purple);">3. Dobutamin</div>
                  <div class="cdss-drug-indication">CVP > 15 cmH2O / Gi\u1EA3m co b\xF3p c\u01A1 tim</div>
                </div>
                <span class="cdss-brand-badge" style="background:var(--cdss-purple-light); color:var(--cdss-purple); border-color:var(--cdss-purple);">Inotrope</span>
              </div>
              <div class="cdss-recipe-box">
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">C\xF4ng th\u1EE9c pha:</span>
                  <span><strong>${dob.totalMg} mg</strong> Dobutamin (3 \xD7 ${dob.patientWeightKg} kg)</span>
                </div>
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Dung m\xF4i:</span>
                  <span>Glucose 5% v\u1EEBa \u0111\u1EE7 <strong>50 ml</strong></span>
                </div>
                <div class="cdss-recipe-row cdss-recipe-highlight" style="color:var(--cdss-purple);">
                  <span>Quy \u0111\u1ED5i li\u1EC1u:</span>
                  <span>T\u1ED1c \u0111\u1ED9 1 ml/gi\u1EDD = 1 \xB5g/kg/ph\xFAt</span>
                </div>
              </div>
              <div class="cdss-dosing-strip">
                <div>
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Li\u1EC1u Kh\u1EDFi \u0110\u1EA7u</div>
                  <strong>${dob.standardDoseRange}</strong>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">T\u1ED1c \u0110\u1ED9 B\u01A1m</div>
                  <strong style="color:var(--cdss-purple); font-size:1.05rem;">${dob.recommendedPumpRateMlH}</strong>
                </div>
              </div>
              <p class="cdss-vaso-warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${dob.precautions}</span>
              </p>
            </div>

            <!-- 4. Adrenalin -->
            <div class="cdss-vaso-card">
              <div class="cdss-vaso-card-header">
                <div>
                  <div class="cdss-drug-name text-danger">4. Adrenalin</div>
                  <div class="cdss-drug-indication">S\u1ED1c kh\xE1ng tr\u1ECB / M\u1EA1ch r\u1EDDi r\u1EA1c / Ng\u1EEBng tu\u1EA7n ho\xE0n</div>
                </div>
                <span class="cdss-brand-badge cdss-brand-badge--danger">C\u1EA5p c\u1EE9u t\u1ED1i kh\u1EA9n</span>
              </div>
              <div class="cdss-recipe-box">
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">C\xF4ng th\u1EE9c pha:</span>
                  <span><strong>${adr.totalMg} mg</strong> Adrenalin (0.3 \xD7 ${adr.patientWeightKg} kg)</span>
                </div>
                <div class="cdss-recipe-row">
                  <span class="cdss-recipe-key">Dung m\xF4i:</span>
                  <span>Glucose 5% v\u1EEBa \u0111\u1EE7 <strong>50 ml</strong></span>
                </div>
                <div class="cdss-recipe-row cdss-recipe-highlight text-danger">
                  <span>Quy \u0111\u1ED5i li\u1EC1u:</span>
                  <span>T\u1ED1c \u0111\u1ED9 1 ml/gi\u1EDD = 0.1 \xB5g/kg/ph\xFAt</span>
                </div>
              </div>
              <div class="cdss-dosing-strip">
                <div>
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">Li\u1EC1u C\u1EE9u Nguy</div>
                  <strong>${adr.standardDoseRange}</strong>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.7rem; color:var(--cdss-text-muted); text-transform:uppercase;">T\u1ED1c \u0110\u1ED9 B\u01A1m</div>
                  <strong style="color:var(--cdss-danger); font-size:1.05rem;">${adr.recommendedPumpRateMlH}</strong>
                </div>
              </div>
              <p class="cdss-vaso-warning">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${adr.precautions}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
      const hemoBtns = container.querySelectorAll(".cdss-segmented-btn[data-hemo-prop]");
      hemoBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const prop = target.getAttribute("data-hemo-prop");
          const val = target.getAttribute("data-hemo-val");
          if (prop && val !== null) {
            if (prop === "isOverloaded") {
              this.currentHemodynamic.isOverloaded = val === "true";
            } else {
              this.currentHemodynamic[prop] = val;
            }
            this.renderVasopressorsView(container, plan);
            this.showToast("\u0110\xE3 c\u1EADp nh\u1EADt l\u01B0u \u0111\u1ED3 huy\u1EBFt \u0111\u1ED9ng h\u1ECDc!");
          }
        });
      });
      const calcDrugBtns = container.querySelectorAll("#calc-drug-selector button");
      calcDrugBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget;
          const drug = target.getAttribute("data-calc-drug");
          if (drug) {
            this.interactiveDrugName = drug;
            if (drug.toLowerCase().includes("noradrenalin") || drug.toLowerCase().includes("adrenalin")) {
              this.interactiveDose = 0.1;
              this.interactivePumpRate = 1;
            } else {
              this.interactiveDose = 5;
              this.interactivePumpRate = 5;
            }
            this.renderVasopressorsView(container, plan);
          }
        });
      });
      const inputDose = container.querySelector("#calc-input-dose");
      const inputRate = container.querySelector("#calc-input-rate");
      const sliderRate = container.querySelector("#calc-slider-rate");
      const sliderLabel = container.querySelector("#slider-rate-label");
      const syncFromDose = (dose) => {
        this.interactiveDose = dose;
        const rate = calculatePumpRateFromDose(this.interactiveDrugName, dose);
        this.interactivePumpRate = rate;
        if (inputRate) inputRate.value = rate.toString();
        if (sliderRate) sliderRate.value = rate.toString();
        if (sliderLabel) sliderLabel.textContent = `${rate} ml/gi\u1EDD (${dose} \xB5g/kg/p)`;
      };
      const syncFromRate = (rate) => {
        this.interactivePumpRate = rate;
        const dose = calculateDoseFromPumpRate(this.interactiveDrugName, rate);
        this.interactiveDose = dose;
        if (inputDose) inputDose.value = dose.toString();
        if (sliderRate) sliderRate.value = rate.toString();
        if (sliderLabel) sliderLabel.textContent = `${rate} ml/gi\u1EDD (${dose} \xB5g/kg/p)`;
      };
      if (inputDose) {
        inputDose.addEventListener("input", () => {
          const dose = parseFloat(inputDose.value) || 0;
          syncFromDose(dose);
        });
      }
      if (inputRate) {
        inputRate.addEventListener("input", () => {
          const rate = parseFloat(inputRate.value) || 0;
          syncFromRate(rate);
        });
      }
      if (sliderRate) {
        sliderRate.addEventListener("input", () => {
          const rate = parseFloat(sliderRate.value) || 0;
          syncFromRate(rate);
        });
      }
    }
    // VIEW 4: ĐIỀU DƯỠNG AN TOÀN & BẢNG KIỂM
    renderNursingChecklistView(container, plan) {
      container.innerHTML = `
      <div class="cdss-card" style="margin-top:0;">
        <div class="cdss-card-header">
          <h2 class="cdss-card-title">
            <i class="fa-solid fa-user-nurse text-success"></i> Quy Tr\xECnh \u0110i\u1EC1u D\u01B0\u1EE1ng An To\xE0n &amp; B\u1EA3ng Ki\u1EC3m T\u1EA1i Gi\u01B0\u1EDDng
          </h2>
          <span class="cdss-brand-badge">HKKK Chu\u1EA9n BYT</span>
        </div>
        <div style="padding:1rem;">
          <ul class="cdss-nursing-list" style="margin:0;">
            ${plan.nursingInstructions.map((item) => `
              <li class="cdss-nursing-item">
                <i class="fa-solid fa-circle-check"></i>
                <span>${item}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      </div>
    `;
    }
    updateMobileStickyBar(plan) {
      const elWeight = document.getElementById("mbar-weight");
      const elSeverity = document.getElementById("mbar-severity-badge");
      const elVolume = document.getElementById("mbar-volume-sub");
      if (elWeight) {
        elWeight.textContent = `${plan.weightResult.adjustedWeightKg} kg`;
      }
      if (elSeverity) {
        const sevMap = {
          warning_signs: "D\u1EA5u Hi\u1EC7u C\u1EA3nh B\xE1o",
          shock: "S\u1ED1c SXHD",
          severe_shock: "S\u1ED1c Nguy K\u1ECBch"
        };
        elSeverity.textContent = sevMap[plan.patient.severity];
      }
      if (elVolume) {
        elVolume.textContent = `T\u1ED5ng: ${plan.totalVolumeMl.toLocaleString("vi-VN")} ml (${plan.totalDurationHours}h)`;
      }
    }
    renderPrintSheet(plan) {
      const el = document.getElementById("cdss-print-sheet");
      if (!el) return;
      const {
        patient,
        weightResult,
        fluidRows,
        totalVolumeMl,
        totalDurationHours,
        vasopressorDopamin: d,
        vasopressorNoradrenalin: n,
        branchDecision
      } = plan;
      const now = /* @__PURE__ */ new Date();
      const dateFormatted = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const severityText = patient.severity === "warning_signs" ? "C\xF3 D\u1EA5u Hi\u1EC7u C\u1EA3nh B\xE1o (DHCB)" : patient.severity === "shock" ? "S\u1ED1c SXHD (C\xF2n B\xF9)" : "S\u1ED1c SXHD Nguy K\u1ECBch (M\u1EA1ch 0, HA 0)";
      const genderText = patient.gender === "male" ? "Nam" : "N\u1EEF";
      const mlPerKg = Math.round(totalVolumeMl / weightResult.adjustedWeightKg);
      const bottles500 = Math.ceil(totalVolumeMl / 500);
      const indicatedFluid = branchDecision.branchType === "cpt" ? "Cao Ph\xE2n T\u1EED: Dextran 40 ho\u1EB7c 6% HES 200" : branchDecision.branchType === "blood" ? "H\u1ED3ng C\u1EA7u L\u1EAFng (5-10 ml/kg) + Cao Ph\xE2n T\u1EED" : "Ringer Lactate ho\u1EB7c NaCl 0.9%";
      const isVasopressorNeeded = this.includeVasopressorInPrint || patient.clinicalResponse === "refractory_shock_cvp" || branchDecision.branchType === "refractory_shock";
      el.innerHTML = `
      <div class="cdss-print-page">
        <!-- HEADER C\u01A0 QUAN & TI\xCAU \u0110\u1EC0 PHI\u1EBEU IN -->
        <div class="cdss-print-meta-top">
          <div class="cdss-print-left-org">
            <div style="font-weight:700; text-transform:uppercase;">KHOA C\u1EA4P C\u1EE8U / H\u1ED2I S\u1EE8C</div>
            <div>Ph\xF2ng/Gi\u01B0\u1EDDng: ................ | BA s\u1ED1: ................</div>
          </div>
          <div class="cdss-print-right-org">
            <div style="font-weight:600;">C\u1ED8NG H\xD2A X\xC3 H\u1ED8I CH\u1EE6 NGH\u0128A VI\u1EC6T NAM</div>
            <div style="font-style:italic; font-size:0.85em;">\u0110\u1ED9c l\u1EADp - T\u1EF1 do - H\u1EA1nh ph\xFAc</div>
            <div style="font-size:0.85em; margin-top:2px;">Th\u1EDDi \u0111i\u1EC3m l\u1EADp phi\u1EBFu: <strong>${dateFormatted}</strong></div>
          </div>
        </div>

        <div class="cdss-print-title-area">
          <h1 class="cdss-print-main-title">PHI\u1EBEU THEO D\xD5I TRUY\u1EC0N D\u1ECACH SXHD DENGUE</h1>
          <div class="cdss-print-sub-title">(Theo H\u01B0\u1EDBng d\u1EABn Ch\u1EA9n \u0111o\xE1n &amp; \u0110i\u1EC1u tr\u1ECB SXHD \u2014 Quy\u1EBFt \u0111\u1ECBnh 2760/Q\u0110-BYT 2023)</div>
        </div>

        <!-- TH\xD4NG TIN B\u1EC6NH NH\xC2N TINH G\u1ECCN CHU\u1EA8N L\xC2M S\xC0NG -->
        <div class="cdss-print-patient-box">
          <div class="cdss-print-row">
            <span>H\u1ECD v\xE0 t\xEAn ng\u01B0\u1EDDi b\u1EC7nh: <strong>...........................................................................</strong></span>
            <span>Tu\u1ED5i: <strong>${patient.ageYears} tu\u1ED5i</strong></span>
            <span>Gi\u1EDBi t\xEDnh: <strong>${genderText}</strong></span>
            <span class="cdss-print-weight-highlight">
              C\xC2N T\xCDNH D\u1ECACH (CDSS): <strong>${weightResult.adjustedWeightKg} kg</strong>
              ${weightResult.isObese ? patient.ageYears >= 16 ? '<em style="font-size:0.8em; color:#b91c1c;">(B\xC9O PH\xCC - PH\u1EE4 L\u1EE4C 9 BYT)</em>' : '<em style="font-size:0.8em; color:#b91c1c;">(B\xC9O PH\xCC - HI\u1EC6U CH\u1EC8NH CDC)</em>' : `<span style="font-size:0.82em; color:#555;">(Th\u1EF1c t\u1EBF: ${weightResult.actualWeightKg}kg)</span>`}
            </span>
          </div>

          <div class="cdss-print-row" style="margin-top: 5px;">
            <span>Ch\u1EA9n \u0111o\xE1n: <strong style="text-transform:uppercase;">${severityText}</strong></span>
            <span>D\u1ECBch ch\u1EC9 \u0111\u1ECBnh: <strong style="color:#0369a1;">${indicatedFluid}</strong></span>
          </div>

          ${branchDecision.branchType !== "standard" ? `
            <div style="margin-top: 5px; padding: 3px 8px; border: 1px dashed #c2410c; background: #fff7ed; font-size: 8.5pt;">
              <strong style="color:#c2410c;">[!] H\u01B0\u1EDBng x\u1EED tr\xED:</strong> ${branchDecision.recommendedFluid} (${branchDecision.title})
            </div>
          ` : ""}
        </div>

        <!-- B\u1EA2NG \u0110I\u1EC0U PH\u1ED0I C\u1ECCC D\u1ECACH CHU\u1EA8N \u0110I\u1EC0U D\u01AF\u1EE0NG (T\u1EACP TRUNG - R\xD5 R\xC0NG) -->
        <table class="cdss-print-table">
          <thead>
            <tr>
              <th style="width: 17%;">C\u1EEE TRUY\u1EC0N &amp; GI\u1EDC</th>
              <th style="width: 25%;">T\u1ED0C \u0110\u1ED8 &amp; L\u01AF\u1EE2NG D\u1ECACH</th>
              <th style="width: 24%;">CHU\u1EA8N B\u1ECA T\u1EA0I C\u1ECCC</th>
              <th style="width: 22%;">THEO D\xD5I &amp; HCT</th>
              <th style="width: 12%;">\u0110D K\xDD</th>
            </tr>
          </thead>
          <tbody>
            ${fluidRows.map((r) => {
        const stageShort = r.stageName.replace(/^Cữ\s*\d+\s*:\s*/i, "").trim();
        let monitorShort = r.monitoringNotes.replace(/Bù dịch tinh thể đẳng trương\.?\s*/gi, "").replace(/Bù dịch cao phân tử đẳng trương\.?\s*/gi, "").replace(/Đo Hct ngay kết thúc/gi, "\u0110o Hct sau").trim();
        if (!monitorShort) {
          monitorShort = "Theo d\xF5i M, HA, NT, l\u01B0\u1EE3ng n\u01B0\u1EDBc ti\u1EC3u";
        }
        return `
              <tr>
                <td style="text-align: center;">
                  <div style="font-weight: 800; font-size: 1.05em;">C\u1EEF ${r.stepIndex} <span style="font-size:0.85em; font-weight:600;">(${r.durationHours}h)</span></div>
                  <div style="font-weight: 700; margin: 2px 0; font-size: 0.95em;">${r.timeWindow}</div>
                  <div style="font-size: 0.8em; color: #444;">${stageShort}</div>
                </td>
                <td>
                  <div>T\u1ED1c \u0111\u1ED9: <strong style="font-size: 1.15em;">${r.rateMlKgH} ml/kg/h</strong></div>
                  <div style="font-size: 0.9em; margin-top: 1px;">S\u1ED1 gi\u1ECDt: <strong>${r.dropsPerMin} gi\u1ECDt/ph\xFAt</strong></div>
                  <div style="font-size: 0.88em; margin-top: 1px;">L\u01B0\u1EE3ng d\u1ECBch: <strong>${r.totalMl.toLocaleString("vi-VN")} ml</strong></div>
                </td>
                <td>
                  <div style="font-weight: 700; font-size: 0.95em;">
                    ${r.bottlesToHang > 0 ? `Treo th\xEAm: +${r.bottlesToHang} chai (500ml)` : "D\xF9ng d\u1ECBch s\u1EB5n c\xF3"}
                  </div>
                  <div style="font-size: 0.85em; margin-top: 2px;">
                    T\u1ED5ng t\u1EA1i c\u1ECDc: <strong>${r.totalAtPoleMl.toLocaleString("vi-VN")} ml</strong>
                  </div>
                  ${r.existingFluidMl > 0 ? `
                    <div style="font-size: 0.76em; color: #555;">(D\u01B0 c\u1EEF tr\u01B0\u1EDBc: ${r.existingFluidMl} ml)</div>
                  ` : ""}
                </td>
                <td>
                  ${r.hctCheckRequired ? `
                    <div style="font-weight: 800; color: #b91c1c; font-size: 0.86em; margin-bottom: 2px;">
                      [!] \u0110O L\u1EA0I HCT (${r.durationHours}h)
                    </div>
                  ` : ""}
                  <div style="font-size: 0.82em; line-height: 1.3;">${monitorShort}</div>
                </td>
                <td style="text-align: center; vertical-align: middle;">
                  <div style="font-size: 0.78em; color: #555;">Gi\u1EDD: ...h...</div>
                  <div style="font-size: 0.78em; margin-top: 14px;">K\xFD: .........</div>
                </td>
              </tr>
            `;
      }).join("")}
          </tbody>
        </table>

        <!-- T\u1ED4NG K\u1EBET D\u1ECACH TRUY\u1EC0N D\u1EF0 KI\u1EBEN -->
        <div class="cdss-print-summary-strip">
          <span>T\u1ED5ng d\u1ECBch b\xF9: <strong>${totalVolumeMl.toLocaleString("vi-VN")} ml</strong> (~<strong>${mlPerKg} ml/kg</strong>)</span>
          <span>Th\u1EDDi gian d\u1EF1 ki\u1EBFn: <strong>${totalDurationHours} gi\u1EDD</strong> (${fluidRows.length} c\u1EEF)</span>
          <span>\u01AF\u1EDBc t\xEDnh: <strong>${bottles500} chai 500ml</strong> (${branchDecision.branchType === "cpt" ? "Cao Ph\xE2n T\u1EED" : "Ringer Lactate / NaCl 0.9%"})</span>
        </div>

        <!-- PH\xC1C \u0110\u1ED2 V\u1EACN M\u1EA0CH B\u01A0M TI\xCAM \u0110I\u1EC6N (CH\u1EC8 HI\u1EC2N TH\u1ECA KHI C\xD3 CH\u1EC8 \u0110\u1ECANH HO\u1EB6C CH\u1ECCN IN K\xC8M) -->
        ${isVasopressorNeeded ? `
          <div class="cdss-print-vaso-box">
            <div style="font-weight: bold; text-transform: uppercase; font-size: 0.85em; margin-bottom: 2px; border-bottom: 1px dotted #666; padding-bottom: 2px;">
              PH\xC1C \u0110\u1ED2 THU\u1ED0C V\u1EACN M\u1EA0CH B\u01A0M TI\xCAM \u0110I\u1EC6N 50ML (\xC1P D\u1EE4NG KHI T\xC1I S\u1ED0C HO\u1EB6C S\u1ED0C TR\u01A0 D\u1ECACH TRUY\u1EC0N)
            </div>
            <div style="font-size: 8.5pt; line-height: 1.35; margin-top: 3px;">
              ${plan.ageGroup === "child" ? `
                <div><strong>\u2022 Dopamin (L\u1EF1a ch\u1ECDn \u0111\u1EA7u tay \u1EDF tr\u1EBB em):</strong> Pha <strong>${d.totalMg} mg</strong> (3 \xD7 ${d.patientWeightKg}kg) v\u1EEBa \u0111\u1EE7 50ml Glucose 5%. T\u1ED1c \u0111\u1ED9 b\u01A1m: <strong>${d.recommendedPumpRateMlH}</strong> (Li\u1EC1u khuy\u1EBFn c\xE1o: ${d.standardDoseRange}; Quy \u0111\u1ED5i: 1 ml/h = 1 \xB5g/kg/ph\xFAt).</div>
              ` : `
                <div><strong>\u2022 Noradrenalin (S\u1ED1c gi\xE3n m\u1EA1ch / ng\u01B0\u1EDDi l\u1EDBn):</strong> Pha <strong>${n.totalMg} mg</strong> (0.3 \xD7 ${n.patientWeightKg}kg) v\u1EEBa \u0111\u1EE7 50ml Glucose 5%. T\u1ED1c \u0111\u1ED9 b\u01A1m: <strong>${n.recommendedPumpRateMlH}</strong> (Li\u1EC1u khuy\u1EBFn c\xE1o: ${n.standardDoseRange}; Quy \u0111\u1ED5i: 1 ml/h = 0.1 \xB5g/kg/ph\xFAt).</div>
              `}
              <div style="font-size: 8pt; color: #444; margin-top: 2px;">
                <em>* Ch\u1EC9 d\xF9ng khi CVP &gt; 10 cmH2O ho\u1EB7c s\u1ED1c th\u1EA5t b\u1EA1i b\xF9 d\u1ECBch. Gi\xE1m s\xE1t HA m\u1ED7i 15-30 ph\xFAt.</em>
              </div>
            </div>
          </div>
        ` : ""}

        <!-- L\u01AFU \xDD \u0110I\u1EC0U D\u01AF\u1EE0NG AN TO\xC0N -->
        <div class="cdss-print-safety-notes">
          <strong>L\u01B0u \xFD \u0111i\u1EC1u d\u01B0\u1EE1ng an to\xE0n:</strong>
          (1) Lu\xF4n \u0111o l\u1EA1i Hct t\u1EA1i gi\u01B0\u1EDDng tr\u01B0\u1EDBc khi quy\u1EBFt \u0111\u1ECBnh gi\u1EA3m b\u1EADc d\u1ECBch theo y l\u1EC7nh.
          (2) \u0110\xEDch n\u01B0\u1EDBc ti\u1EC3u &ge; 0.5 - 1 ml/kg/gi\u1EDD. B\xE1o B\xE1c s\u0129 ngay n\u1EBFu c\xF3 d\u1EA5u hi\u1EC7u ph\xF9 mi m\u1EAFt, th\u1EDF nhanh kh\xF3 th\u1EDF, ran \u1EA9m \u0111\xE1y ph\u1ED5i ho\u1EB7c t\xE1i s\u1ED1c.
          (3) Ng\u01B0ng truy\u1EC1n d\u1ECBch khi m\u1EA1ch, huy\u1EBFt \xE1p \u1ED5n \u0111\u1ECBnh, tho\xE1t s\u1ED1c sau 24-48 gi\u1EDD giai \u0111o\u1EA1n h\u1ED3i ph\u1EE5c.
        </div>

        <!-- CH\u1EEE K\xDD X\xC1C NH\u1EACN Y L\u1EC6NH -->
        <div class="cdss-print-signatures">
          <div class="cdss-print-sign-col">
            <div style="font-weight: bold;">\u0110I\u1EC0U D\u01AF\u1EE0NG THEO D\xD5I</div>
            <div style="font-style: italic; font-size: 0.85em;">(K\xFD v\xE0 ghi r\xF5 h\u1ECD t\xEAn)</div>
            <div style="margin-top: 36px; font-weight: bold;">............................................................</div>
          </div>
          <div class="cdss-print-sign-col">
            <div style="font-weight: bold;">B\xC1C S\u0128 CH\u1EC8 \u0110\u1ECANH Y L\u1EC6NH</div>
            <div style="font-style: italic; font-size: 0.85em;">(K\xFD v\xE0 ghi r\xF5 h\u1ECD t\xEAn)</div>
            <div style="margin-top: 36px; font-weight: bold;">............................................................</div>
          </div>
        </div>
      </div>
    `;
    }
    copyHandoverReport() {
      if (!this.currentPlan) return;
      const p = this.currentPlan;
      const text = [
        `\u{1F4CB} B\xC1O C\xC1O GIAO BAN D\u1ECACH TRUY\u1EC0N SXHD DENGUE (Q\u0110 2760/Q\u0110-BYT)`,
        `\u2022 B\u1EC7nh nh\xE2n: ${p.patient.ageYears} tu\u1ED5i (${p.patient.gender === "male" ? "Nam" : "N\u1EEF"}) | N\u1EB7ng th\u1EF1c t\u1EBF: ${p.weightResult.actualWeightKg} kg`,
        p.patient.ageYears >= 16 ? `\u2022 C\xE2n t\xEDnh d\u1ECBch Ph\u1EE5 l\u1EE5c 9 BYT (AdjBW): ${p.weightResult.adjustedWeightKg} kg ${p.weightResult.isObese ? "(\u0110\xC3 HI\u1EC6U CH\u1EC8NH NG\u01AF\u1EDCI L\u1EDAN B\xC9O PH\xCC)" : ""}` : `\u2022 C\xE2n t\xEDnh d\u1ECBch CDC 2014: ${p.weightResult.adjustedWeightKg} kg ${p.weightResult.isObese ? "(\u0110\xC3 HI\u1EC6U CH\u1EC8NH TR\u1EBA TH\u1EEAA C\xC2N)" : ""}`,
        `\u2022 Ph\xE2n \u0111\u1ED9: ${p.patient.severity === "warning_signs" ? "D\u1EA5u hi\u1EC7u c\u1EA3nh b\xE1o" : p.patient.severity === "shock" ? "S\u1ED1c SXHD" : "S\u1ED1c nguy k\u1ECBch"}`,
        `\u2022 \u0110\xE1nh gi\xE1 \u0111\xE1p \u1EE9ng: ${p.branchDecision.title}`,
        `\u2022 H\u01B0\u1EDBng x\u1EED tr\xED: ${p.branchDecision.recommendedFluid}`,
        `\u2022 K\u1EBF ho\u1EA1ch c\u1ECDc d\u1ECBch:`,
        ...p.fluidRows.map((r) => `  - C\u1EEF ${r.stepIndex} (${r.timeWindow}): ${r.rateMlKgH} ml/kg/h (${r.dropsPerMin} gi\u1ECDt/ph\xFAt) | C\u1EA7n ${r.totalMl} ml | Treo th\xEAm: ${r.bottlesToHang} chai | T\u1EA1i c\u1ECDc: ${r.totalAtPoleMl} ml`),
        `\u2022 T\u1ED5ng d\u1ECBch: ${p.totalVolumeMl} ml trong ${p.totalDurationHours} gi\u1EDD.`,
        `\u2022 \u0110i\u1EC1u d\u01B0\u1EE1ng l\u01B0u \xFD: Theo d\xF5i n\u01B0\u1EDBc ti\u1EC3u m\u1ED7i gi\u1EDD (\u0111\xEDch \u2265 0.5-1 ml/kg/h), \u0111o l\u1EA1i Hct tr\u01B0\u1EDBc khi gi\u1EA3m c\u1EEF d\u1ECBch.`
      ].join("\n");
      navigator.clipboard.writeText(text).then(() => {
        this.showToast("\u0110\xE3 sao ch\xE9p b\u1EA3ng b\xE0n giao c\u1ECDc d\u1ECBch v\xE0o b\u1ED9 nh\u1EDB t\u1EA1m!");
      });
    }
    copySoapPlan() {
      if (!this.currentPlan) return;
      navigator.clipboard.writeText(this.currentPlan.soapExportText).then(() => {
        this.showToast("\u0110\xE3 sao ch\xE9p K\u1EBF ho\u1EA1ch SOAP Plan (B\u1EC7nh \xC1n / DocSpace)!");
      });
    }
    showToast(msg) {
      const toast = document.getElementById("cdss-toast");
      const toastText = document.getElementById("cdss-toast-text");
      if (!toast || !toastText) return;
      toastText.textContent = msg;
      toast.classList.add("visible");
      setTimeout(() => {
        toast.classList.remove("visible");
      }, 3200);
    }
  };
  if (typeof window !== "undefined") {
    window.DengueCDSSController = DengueCDSSController;
  }
  return __toCommonJS(dengue_ui_exports);
})();
