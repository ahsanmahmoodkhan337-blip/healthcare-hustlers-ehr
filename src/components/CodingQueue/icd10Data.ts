/**
 * ICD-10-CM Code Repository — Medical Coding Educational Content
 *
 * 30+ common diagnosis codes organized by chapter for the CodingQueue.
 * Students can search, filter, and select codes for their encounters.
 *
 * Inspiration: AAPC / ICD-10-CM Official Guidelines
 */

export interface ICD10Code {
  code: string;
  description: string;
  chapter: string;
  category: string;
  notes?: string;
}

export const ICD10_CODES: ICD10Code[] = [
  // ─── Endocrine ──────────────────────────────────────────────────
  { code: "E11.9", description: "Type 2 diabetes mellitus without complications", chapter: "Endocrine", category: "Diabetes" },
  { code: "E10.9", description: "Type 1 diabetes mellitus without complications", chapter: "Endocrine", category: "Diabetes" },
  { code: "E78.5", description: "Hyperlipidemia, unspecified", chapter: "Endocrine", category: "Lipid disorders" },
  { code: "E66.9", description: "Obesity, unspecified", chapter: "Endocrine", category: "Obesity" },
  { code: "E03.9", description: "Hypothyroidism, unspecified", chapter: "Endocrine", category: "Thyroid" },

  // ─── Circulatory ────────────────────────────────────────────────
  { code: "I10", description: "Essential (primary) hypertension", chapter: "Circulatory", category: "Hypertension" },
  { code: "I50.9", description: "Heart failure, unspecified", chapter: "Circulatory", category: "Heart failure" },
  { code: "I25.10", description: "Atherosclerotic heart disease of native coronary artery", chapter: "Circulatory", category: "CAD" },
  { code: "I48.91", description: "Unspecified atrial fibrillation", chapter: "Circulatory", category: "Arrhythmia" },
  { code: "I48.20", description: "Chronic atrial fibrillation", chapter: "Circulatory", category: "Arrhythmia" },
  { code: "I25.2", description: "Old myocardial infarction", chapter: "Circulatory", category: "CAD" },

  // ─── Respiratory ────────────────────────────────────────────────
  { code: "J45.909", description: "Unspecified asthma, uncomplicated", chapter: "Respiratory", category: "Asthma" },
  { code: "J44.9", description: "Chronic obstructive pulmonary disease, unspecified", chapter: "Respiratory", category: "COPD" },
  { code: "J15.9", description: "Unspecified bacterial pneumonia", chapter: "Respiratory", category: "Pneumonia" },
  { code: "J20.9", description: "Acute bronchitis, unspecified", chapter: "Respiratory", category: "Bronchitis" },
  { code: "J06.9", description: "Acute upper respiratory infection, unspecified", chapter: "Respiratory", category: "URI" },

  // ─── Digestive ──────────────────────────────────────────────────
  { code: "K21.9", description: "Gastro-esophageal reflux disease without esophagitis", chapter: "Digestive", category: "GERD" },
  { code: "K57.30", description: "Diverticulosis of large intestine without perforation", chapter: "Digestive", category: "Diverticulosis" },
  { code: "K59.00", description: "Constipation, unspecified", chapter: "Digestive", category: "Constipation" },
  { code: "K29.50", description: "Chronic gastritis, unspecified", chapter: "Digestive", category: "Gastritis" },

  // ─── Musculoskeletal ────────────────────────────────────────────
  { code: "M54.5", description: "Low back pain", chapter: "Musculoskeletal", category: "Back pain" },
  { code: "M17.9", description: "Osteoarthritis of knee, unspecified", chapter: "Musculoskeletal", category: "Osteoarthritis" },
  { code: "M19.90", description: "Osteoarthritis of unspecified site", chapter: "Musculoskeletal", category: "Osteoarthritis" },
  { code: "M79.1", description: "Myalgia", chapter: "Musculoskeletal", category: "Pain" },

  // ─── Other ──────────────────────────────────────────────────────
  { code: "N18.3", description: "Chronic kidney disease, stage 3 (moderate)", chapter: "Genitourinary", category: "CKD" },
  { code: "N18.4", description: "Chronic kidney disease, stage 4 (severe)", chapter: "Genitourinary", category: "CKD" },
  { code: "D50.9", description: "Iron deficiency anemia, unspecified", chapter: "Blood", category: "Anemia" },
  { code: "Z23", description: "Encounter for immunization", chapter: "Z Codes", category: "Preventive" },
  { code: "Z34.90", description: "Encounter for supervision of normal pregnancy", chapter: "Z Codes", category: "Pregnancy" },
  { code: "R51", description: "Headache", chapter: "Symptoms", category: "Pain" },
  { code: "R10.9", description: "Unspecified abdominal pain", chapter: "Symptoms", category: "Pain" },
  { code: "R05", description: "Cough", chapter: "Symptoms", category: "Respiratory" },
  { code: "F41.9", description: "Anxiety disorder, unspecified", chapter: "Mental", category: "Anxiety" },
  { code: "F32.9", description: "Major depressive disorder, single episode, unspecified", chapter: "Mental", category: "Depression" },
];

export function searchICD10(query: string): ICD10Code[] {
  if (!query || query.length < 1) return ICD10_CODES.slice(0, 10);
  const q = query.toLowerCase();
  return ICD10_CODES.filter(
    (c) =>
      c.code.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.chapter.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );
}