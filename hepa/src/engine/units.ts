/**
 * HepaCDSS Unit Conversion & Safety Validation Module
 * Chuẩn hóa các đơn vị lâm sàng tại Việt Nam (µmol/L, g/L, G/L) và quốc tế (mg/dL, g/dL).
 * Tích hợp cơ chế phát hiện giá trị phi lý để ngăn ngừa nhầm lẫn tai hại trong tính toán MELD/Child-Pugh.
 */

import { AlbuminUnit, BilirubinUnit, CreatinineUnit, PlateletsUnit } from '../types';

export const BILIRUBIN_CONVERSION_FACTOR = 17.104; // 1 mg/dL = 17.1 µmol/L
export const CREATININE_CONVERSION_FACTOR = 88.4; // 1 mg/dL = 88.4 µmol/L
export const ALBUMIN_CONVERSION_FACTOR = 10; // 1 g/dL = 10 g/L

export interface UnitPlausibilityWarning {
  field: string;
  enteredValue: number;
  enteredUnit: string;
  suggestedUnit: string;
  message: string;
}

export class UnitConverter {
  /**
   * Chuyển Bilirubin về mg/dL (dùng cho công thức MELD, Child-Pugh, Maddrey)
   */
  static bilirubinToMgDl(val: number, unit: BilirubinUnit = 'umol_l'): number {
    if (unit === 'mg_dl') return val;
    return Number((val / BILIRUBIN_CONVERSION_FACTOR).toFixed(2));
  }

  /**
   * Chuyển Bilirubin về µmol/L (chuẩn xét nghiệm Việt Nam)
   */
  static bilirubinToUmolL(val: number, unit: BilirubinUnit = 'umol_l'): number {
    if (unit === 'umol_l') return val;
    return Number((val * BILIRUBIN_CONVERSION_FACTOR).toFixed(1));
  }

  /**
   * Chuyển Albumin về g/dL (dùng cho Child-Pugh gốc, MELD 3.0)
   */
  static albuminToGDl(val: number, unit: AlbuminUnit = 'g_l'): number {
    if (unit === 'g_dl') return val;
    return Number((val / ALBUMIN_CONVERSION_FACTOR).toFixed(2));
  }

  /**
   * Chuyển Albumin về g/L (chuẩn xét nghiệm Việt Nam)
   */
  static albuminToGL(val: number, unit: AlbuminUnit = 'g_l'): number {
    if (unit === 'g_l') return val;
    return Number((val * ALBUMIN_CONVERSION_FACTOR).toFixed(1));
  }

  /**
   * Chuyển Creatinine về mg/dL (dùng cho MELD)
   */
  static creatinineToMgDl(val: number, unit: CreatinineUnit = 'umol_l'): number {
    if (unit === 'mg_dl') return val;
    return Number((val / CREATININE_CONVERSION_FACTOR).toFixed(2));
  }

  /**
   * Chuyển Creatinine về µmol/L (chuẩn xét nghiệm Việt Nam)
   */
  static creatinineToUmolL(val: number, unit: CreatinineUnit = 'umol_l'): number {
    if (unit === 'umol_l') return val;
    return Number((val * CREATININE_CONVERSION_FACTOR).toFixed(1));
  }

  /**
   * Chuẩn hóa Tiểu cầu về 10^9/L (G/L).
   * Nếu người dùng gõ số nguyên lớn dạng 150,000 (hạt/uL), tự động đưa về 150.
   */
  static normalizePlatelets(val: number): number {
    if (val > 2000) {
      return Number((val / 1000).toFixed(0));
    }
    return val;
  }

  /**
   * Kiểm tra các cảnh báo nhầm lẫn đơn vị (Plausibility Safety Check)
   */
  static validatePlausibility(data: {
    bilirubin?: { value: number; unit: BilirubinUnit };
    albumin?: { value: number; unit: AlbuminUnit };
    creatinine?: { value: number; unit: CreatinineUnit };
    platelets?: number;
  }): UnitPlausibilityWarning[] {
    const warnings: UnitPlausibilityWarning[] = [];

    // 1. Kiểm tra Bilirubin
    if (data.bilirubin && data.bilirubin.value > 0) {
      const { value, unit } = data.bilirubin;
      if (unit === 'mg_dl' && value > 40) {
        warnings.push({
          field: 'bilirubin',
          enteredValue: value,
          enteredUnit: 'mg/dL',
          suggestedUnit: 'µmol/L',
          message: `Bilirubin ${value} mg/dL là mức cực cao hiếm gặp. Bác sĩ có đang nhập theo đơn vị Việt Nam (µmol/L) không? (${value} µmol/L = ${(value / BILIRUBIN_CONVERSION_FACTOR).toFixed(2)} mg/dL)`,
        });
      } else if (unit === 'umol_l' && value > 0 && value < 3.0) {
        warnings.push({
          field: 'bilirubin',
          enteredValue: value,
          enteredUnit: 'µmol/L',
          suggestedUnit: 'mg/dL',
          message: `Bilirubin ${value} µmol/L là mức quá thấp bất thường. Bác sĩ có đang nhập theo mg/dL không? (${value} mg/dL = ${(value * BILIRUBIN_CONVERSION_FACTOR).toFixed(1)} µmol/L)`,
        });
      }
    }

    // 2. Kiểm tra Albumin
    if (data.albumin && data.albumin.value > 0) {
      const { value, unit } = data.albumin;
      if (unit === 'g_dl' && value >= 15) {
        warnings.push({
          field: 'albumin',
          enteredValue: value,
          enteredUnit: 'g/dL',
          suggestedUnit: 'g/L',
          message: `Albumin ${value} g/dL là giá trị phi thực tế (bình thường 3.5 - 5.0 g/dL). Có thể Bác sĩ đang nhập đơn vị g/L (${value} g/L = ${(value / 10).toFixed(1)} g/dL).`,
        });
      } else if (unit === 'g_l' && value > 0 && value < 10) {
        warnings.push({
          field: 'albumin',
          enteredValue: value,
          enteredUnit: 'g/L',
          suggestedUnit: 'g/dL',
          message: `Albumin ${value} g/L là mức suy sụp protein cực đoan. Bác sĩ có đang nhập theo đơn vị g/dL không? (${value} g/dL = ${value * 10} g/L).`,
        });
      }
    }

    // 3. Kiểm tra Creatinine
    if (data.creatinine && data.creatinine.value > 0) {
      const { value, unit } = data.creatinine;
      if (unit === 'mg_dl' && value > 30) {
        warnings.push({
          field: 'creatinine',
          enteredValue: value,
          enteredUnit: 'mg/dL',
          suggestedUnit: 'µmol/L',
          message: `Creatinine ${value} mg/dL là giá trị vượt ngưỡng tử vong sinh lý. Có thể Bác sĩ đang nhập theo µmol/L (${value} µmol/L = ${(value / CREATININE_CONVERSION_FACTOR).toFixed(2)} mg/dL).`,
        });
      } else if (unit === 'umol_l' && value > 0 && value < 10) {
        warnings.push({
          field: 'creatinine',
          enteredValue: value,
          enteredUnit: 'µmol/L',
          suggestedUnit: 'mg/dL',
          message: `Creatinine ${value} µmol/L là mức cực thấp phi sinh lý. Có thể Bác sĩ đang nhập theo mg/dL (${value} mg/dL = ${(value * CREATININE_CONVERSION_FACTOR).toFixed(1)} µmol/L).`,
        });
      }
    }

    return warnings;
  }
}
