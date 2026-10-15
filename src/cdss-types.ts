/**
 * CDSS Standalone Suite — Type Definitions
 */
export type CDSSCategory = 
  | 'resuscitation' 
  | 'cardiology' 
  | 'respiratory' 
  | 'gastroenterology' 
  | 'infectious' 
  | 'pharmacology' 
  | 'endocrinology' 
  | 'internal';

export interface CDSSModuleMeta {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  shortDesc: string;
  category: CDSSCategory;
  categoryName: string;
  version: string;
  updatedAt: string;
  author: string;
  guidelineSource: string;
  icd10?: string[];
  icon: string;
  badge?: string;
  isStandalone: boolean;
  standaloneUrl: string;
}
