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
  | 'internal'
  | 'neurology';

export interface CDSSModuleMeta {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  shortTitle?: string;
  brandCode?: string;
  department?: string;
  urgency?: 'stat' | 'urgent' | 'routine';
  statTrigger?: string;
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
  features?: string[];
  isStandalone: boolean;
  standaloneUrl: string;
}

