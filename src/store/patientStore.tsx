/**
 * Global Mock Patient Database — React Context Provider
 *
 * Inspiration: This store is designed to simulate the patient chart
 * experience found across Epic, eClinicalWorks (eCW), Athenahealth,
 * and DrChrono. The data model combines:
 *   - Epic's comprehensive chart review structure (problems, meds, allergies, vitals, labs)
 *   - eCW's right-panel summary layout (concise patient snapshot)
 *   - Athenahealth's workflow-oriented encounter tracking
 *   - DrChrono's appointment-based chronology
 */

import { createContext, useContext, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────

export interface VitalSigns {
  bloodPressure: string; // e.g. "120/80"
  heartRate: number; // bpm
  temperature: number; // °F
  respiratoryRate: number; // breaths/min
  oxygenSaturation: number; // %
  recordedAt: string; // ISO date
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  status: "active" | "discontinued" | "on-hold";
  prescribedDate: string;
  prescribedBy: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: "mild" | "moderate" | "severe";
  reaction: string;
  recordedDate: string;
}

export interface LabResult {
  id: string;
  testName: string;
  value: string;
  referenceRange: string;
  unit: string;
  status: "normal" | "abnormal" | "critical" | "pending";
  date: string;
}

export interface Encounter {
  id: string;
  date: string;
  type: string;
  provider: string;
  diagnosis: string;
  notes: string;
  department: string;
}

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  preferredName?: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: { name: string; phone: string; relation: string };
  primaryCareProvider: string;
  insurance: string;
  chiefComplaint: string;
  vitals: VitalSigns;
  medications: Medication[];
  allergies: Allergy[];
  labResults: LabResult[];
  encounters: Encounter[];
  problems: string[]; // active problem list
}

// ─── Mock Data ─────────────────────────────────────────────────────

const mockPatients: Patient[] = [
  {
    id: "P001",
    mrn: "MRN-1001",
    firstName: "Jane",
    lastName: "Doe",
    dateOfBirth: "1979-03-15",
    age: 45,
    gender: "Female",
    preferredName: "Jane",
    phone: "(555) 123-4567",
    email: "jane.doe@email.com",
    address: "123 Main St, Springfield, IL 62701",
    emergencyContact: {
      name: "John Doe",
      phone: "(555) 987-6543",
      relation: "Spouse",
    },
    primaryCareProvider: "Dr. Sarah Chen, MD",
    insurance: "Blue Cross Blue Shield PPO",
    chiefComplaint: "Chest pain and shortness of breath",
    vitals: {
      bloodPressure: "142/92",
      heartRate: 88,
      temperature: 98.6,
      respiratoryRate: 20,
      oxygenSaturation: 96,
      recordedAt: "2026-06-15T09:30:00Z",
    },
    medications: [
      {
        id: "MED001",
        name: "Lisinopril",
        dosage: "10 mg",
        frequency: "Once daily",
        route: "Oral",
        status: "active",
        prescribedDate: "2025-11-01",
        prescribedBy: "Dr. Sarah Chen",
      },
      {
        id: "MED002",
        name: "Metformin",
        dosage: "500 mg",
        frequency: "Twice daily",
        route: "Oral",
        status: "active",
        prescribedDate: "2026-01-15",
        prescribedBy: "Dr. Sarah Chen",
      },
      {
        id: "MED003",
        name: "Atorvastatin",
        dosage: "20 mg",
        frequency: "Once daily at bedtime",
        route: "Oral",
        status: "active",
        prescribedDate: "2025-06-10",
        prescribedBy: "Dr. Sarah Chen",
      },
    ],
    allergies: [
      {
        id: "ALG001",
        allergen: "Penicillin",
        severity: "severe",
        reaction: "Anaphylaxis (hives, swelling, difficulty breathing)",
        recordedDate: "2020-03-22",
      },
      {
        id: "ALG002",
        allergen: "Sulfa Drugs",
        severity: "moderate",
        reaction: "Rash and fever",
        recordedDate: "2021-07-14",
      },
    ],
    labResults: [
      {
        id: "LAB001",
        testName: "Hemoglobin A1C",
        value: "7.2",
        referenceRange: "< 5.7",
        unit: "%",
        status: "abnormal",
        date: "2026-06-01",
      },
      {
        id: "LAB002",
        testName: "LDL Cholesterol",
        value: "130",
        referenceRange: "< 100",
        unit: "mg/dL",
        status: "abnormal",
        date: "2026-06-01",
      },
      {
        id: "LAB003",
        testName: "Comprehensive Metabolic Panel",
        value: "WNR",
        referenceRange: "See components",
        unit: "",
        status: "normal",
        date: "2026-06-01",
      },
      {
        id: "LAB004",
        testName: "Complete Blood Count",
        value: "Within normal limits",
        referenceRange: "",
        unit: "",
        status: "normal",
        date: "2026-05-15",
      },
    ],
    encounters: [
      {
        id: "ENC001",
        date: "2026-06-15",
        type: "Office Visit - Follow Up",
        provider: "Dr. Sarah Chen, MD",
        diagnosis: "Essential hypertension (I10), Type 2 diabetes (E11.9)",
        notes:
          "Patient reports intermittent chest pain over the past week. BP elevated today. Will adjust lisinopril dosage and order cardiac workup.",
        department: "Internal Medicine",
      },
      {
        id: "ENC002",
        date: "2026-04-22",
        type: "Office Visit - Routine",
        provider: "Dr. Sarah Chen, MD",
        diagnosis: "Essential hypertension (I10)",
        notes:
          "Routine follow-up for hypertension. BP well-controlled on current regimen. Encouraged dietary modifications and increased physical activity.",
        department: "Internal Medicine",
      },
      {
        id: "ENC003",
        date: "2026-01-15",
        type: "Office Visit - New Patient",
        provider: "Dr. Sarah Chen, MD",
        diagnosis:
          "Essential hypertension (I10), Type 2 diabetes (E11.9), Mixed hyperlipidemia (E78.2)",
        notes:
          "New patient establishing care. Comprehensive history and physical completed. Started on lisinopril, metformin, and atorvastatin. Lab orders placed.",
        department: "Internal Medicine",
      },
    ],
    problems: [
      "Essential hypertension (I10)",
      "Type 2 diabetes mellitus (E11.9)",
      "Mixed hyperlipidemia (E78.2)",
      "Obesity (E66.9)",
    ],
  },
  {
    id: "P002",
    mrn: "MRN-1002",
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: "1968-09-22",
    age: 58,
    gender: "Male",
    phone: "(555) 234-5678",
    email: "john.smith@email.com",
    address: "456 Oak Ave, Springfield, IL 62702",
    emergencyContact: {
      name: "Mary Smith",
      phone: "(555) 876-5432",
      relation: "Spouse",
    },
    primaryCareProvider: "Dr. Michael Patel, MD",
    insurance: "Medicare Part B",
    chiefComplaint: "Shortness of breath on exertion",
    vitals: {
      bloodPressure: "138/85",
      heartRate: 76,
      temperature: 98.4,
      respiratoryRate: 18,
      oxygenSaturation: 94,
      recordedAt: "2026-06-14T14:00:00Z",
    },
    medications: [
      {
        id: "MED004",
        name: "Aspirin",
        dosage: "81 mg",
        frequency: "Once daily",
        route: "Oral",
        status: "active",
        prescribedDate: "2024-03-01",
        prescribedBy: "Dr. Michael Patel",
      },
      {
        id: "MED005",
        name: "Metoprolol Succinate",
        dosage: "50 mg",
        frequency: "Once daily",
        route: "Oral",
        status: "active",
        prescribedDate: "2025-08-15",
        prescribedBy: "Dr. Michael Patel",
      },
      {
        id: "MED006",
        name: "Furosemide",
        dosage: "40 mg",
        frequency: "Once daily",
        route: "Oral",
        status: "active",
        prescribedDate: "2026-02-10",
        prescribedBy: "Dr. Michael Patel",
      },
    ],
    allergies: [
      {
        id: "ALG003",
        allergen: "Codeine",
        severity: "moderate",
        reaction: "Nausea and vomiting",
        recordedDate: "2019-11-05",
      },
    ],
    labResults: [
      {
        id: "LAB005",
        testName: "BNP",
        value: "450",
        referenceRange: "< 100",
        unit: "pg/mL",
        status: "abnormal",
        date: "2026-06-10",
      },
      {
        id: "LAB006",
        testName: "Troponin I",
        value: "0.02",
        referenceRange: "< 0.04",
        unit: "ng/mL",
        status: "normal",
        date: "2026-06-10",
      },
      {
        id: "LAB007",
        testName: "eGFR",
        value: "62",
        referenceRange: "> 60",
        unit: "mL/min/1.73m²",
        status: "normal",
        date: "2026-06-10",
      },
    ],
    encounters: [
      {
        id: "ENC004",
        date: "2026-06-14",
        type: "Office Visit - Follow Up",
        provider: "Dr. Michael Patel, MD",
        diagnosis: "Congestive heart failure (I50.9), Coronary artery disease (I25.1)",
        notes:
          "Patient reports increased SOB with activity. Mild pedal edema noted. BNP elevated. Will adjust diuretic dose and schedule echocardiogram.",
        department: "Cardiology",
      },
      {
        id: "ENC005",
        date: "2026-03-20",
        type: "Office Visit - Follow Up",
        provider: "Dr. Michael Patel, MD",
        diagnosis: "Congestive heart failure (I50.9)",
        notes:
          "CHF stable. Ejection fraction 40% on last echo. Continue current management.",
        department: "Cardiology",
      },
    ],
    problems: [
      "Congestive heart failure (I50.9)",
      "Coronary artery disease (I25.1)",
      "Chronic kidney disease stage 3 (N18.3)",
    ],
  },
  {
    id: "P003",
    mrn: "MRN-1003",
    firstName: "Emily",
    lastName: "Chen",
    dateOfBirth: "1994-07-08",
    age: 32,
    gender: "Female",
    phone: "(555) 345-6789",
    email: "emily.chen@email.com",
    address: "789 Pine Rd, Springfield, IL 62703",
    emergencyContact: {
      name: "David Chen",
      phone: "(555) 765-4321",
      relation: "Brother",
    },
    primaryCareProvider: "Dr. Lisa Wong, MD",
    insurance: "Aetna HMO",
    chiefComplaint: "Worsening cough and wheezing",
    vitals: {
      bloodPressure: "118/72",
      heartRate: 82,
      temperature: 99.1,
      respiratoryRate: 22,
      oxygenSaturation: 95,
      recordedAt: "2026-06-13T11:00:00Z",
    },
    medications: [
      {
        id: "MED007",
        name: "Albuterol HFA",
        dosage: "90 mcg",
        frequency: "2 puffs q4-6h PRN",
        route: "Inhalation",
        status: "active",
        prescribedDate: "2025-12-01",
        prescribedBy: "Dr. Lisa Wong",
      },
      {
        id: "MED008",
        name: "Fluticasone/Salmeterol",
        dosage: "250/50 mcg",
        frequency: "1 inhalation twice daily",
        route: "Inhalation",
        status: "active",
        prescribedDate: "2026-01-20",
        prescribedBy: "Dr. Lisa Wong",
      },
      {
        id: "MED009",
        name: "Montelukast",
        dosage: "10 mg",
        frequency: "Once daily at bedtime",
        route: "Oral",
        status: "active",
        prescribedDate: "2026-01-20",
        prescribedBy: "Dr. Lisa Wong",
      },
    ],
    allergies: [
      {
        id: "ALG004",
        allergen: "Aspirin",
        severity: "moderate",
        reaction: "Urticaria and bronchospasm",
        recordedDate: "2022-08-12",
      },
      {
        id: "ALG005",
        allergen: "Pollen (Seasonal)",
        severity: "mild",
        reaction: "Sneezing, itchy eyes",
        recordedDate: "2020-04-01",
      },
    ],
    labResults: [
      {
        id: "LAB008",
        testName: "Pulmonary Function Test - FEV1",
        value: "65",
        referenceRange: "> 80",
        unit: "% predicted",
        status: "abnormal",
        date: "2026-05-20",
      },
      {
        id: "LAB009",
        testName: "IgE Level",
        value: "250",
        referenceRange: "< 100",
        unit: "IU/mL",
        status: "abnormal",
        date: "2026-05-20",
      },
    ],
    encounters: [
      {
        id: "ENC006",
        date: "2026-06-13",
        type: "Office Visit - Acute",
        provider: "Dr. Lisa Wong, MD",
        diagnosis: "Acute exacerbation of asthma (J45.901)",
        notes:
          "Patient presents with 3-day history of worsening cough, wheezing, and dyspnea. Peak flow 65% of personal best. Increased maintenance inhaler. Prescribed prednisone burst.",
        department: "Pulmonology",
      },
      {
        id: "ENC007",
        date: "2026-04-10",
        type: "Office Visit - Follow Up",
        provider: "Dr. Lisa Wong, MD",
        diagnosis: "Persistent asthma (J45.40)",
        notes:
          "Asthma well-controlled on current regimen. Peak flow 90% of personal best. Continue current medications.",
        department: "Pulmonology",
      },
    ],
    problems: [
      "Persistent asthma (J45.40)",
      "Allergic rhinitis (J30.9)",
    ],
  },
  {
    id: "P004",
    mrn: "MRN-1004",
    firstName: "Robert",
    lastName: "Johnson",
    dateOfBirth: "1954-11-30",
    age: 72,
    gender: "Male",
    phone: "(555) 456-7890",
    email: "robert.johnson@email.com",
    address: "321 Elm St, Springfield, IL 62704",
    emergencyContact: {
      name: "Patricia Johnson",
      phone: "(555) 654-3210",
      relation: "Daughter",
    },
    primaryCareProvider: "Dr. James Wilson, MD",
    insurance: "Medicare Advantage",
    chiefComplaint: "Increased fatigue and swelling in legs",
    vitals: {
      bloodPressure: "145/90",
      heartRate: 92,
      temperature: 97.8,
      respiratoryRate: 24,
      oxygenSaturation: 90,
      recordedAt: "2026-06-12T10:00:00Z",
    },
    medications: [
      {
        id: "MED010",
        name: "Tiotropium",
        dosage: "18 mcg",
        frequency: "Once daily",
        route: "Inhalation",
        status: "active",
        prescribedDate: "2025-05-01",
        prescribedBy: "Dr. James Wilson",
      },
      {
        id: "MED011",
        name: "Prednisone",
        dosage: "10 mg",
        frequency: "Once daily",
        route: "Oral",
        status: "active",
        prescribedDate: "2026-06-12",
        prescribedBy: "Dr. James Wilson",
      },
      {
        id: "MED012",
        name: "Digoxin",
        dosage: "0.125 mg",
        frequency: "Once daily",
        route: "Oral",
        status: "active",
        prescribedDate: "2025-10-15",
        prescribedBy: "Dr. James Wilson",
      },
    ],
    allergies: [
      {
        id: "ALG006",
        allergen: "Latex",
        severity: "moderate",
        reaction: "Contact dermatitis",
        recordedDate: "2018-06-20",
      },
    ],
    labResults: [
      {
        id: "LAB010",
        testName: "ABG - pO2",
        value: "62",
        referenceRange: "80-100",
        unit: "mmHg",
        status: "abnormal",
        date: "2026-06-12",
      },
      {
        id: "LAB011",
        testName: "ABG - pCO2",
        value: "52",
        referenceRange: "35-45",
        unit: "mmHg",
        status: "abnormal",
        date: "2026-06-12",
      },
      {
        id: "LAB012",
        testName: "Hemoglobin",
        value: "13.2",
        referenceRange: "13.5-17.5",
        unit: "g/dL",
        status: "abnormal",
        date: "2026-06-05",
      },
    ],
    encounters: [
      {
        id: "ENC008",
        date: "2026-06-12",
        type: "Office Visit - Follow Up",
        provider: "Dr. James Wilson, MD",
        diagnosis:
          "COPD exacerbation (J44.1), Chronic systolic heart failure (I50.22)",
        notes:
          "Patient presents with worsening dyspnea, bilateral lower extremity edema, and fatigue. O2 sat 90% on room air. Started prednisone burst. Scheduled pulmonary function tests.",
        department: "Pulmonary/Cardiology",
      },
      {
        id: "ENC009",
        date: "2026-03-05",
        type: "Office Visit - Routine",
        provider: "Dr. James Wilson, MD",
        diagnosis:
          "COPD (J44.9), Chronic diastolic heart failure (I50.32)",
        notes:
          "Stable COPD. Mild edema controlled with diuretics. Continue current regimen.",
        department: "Internal Medicine",
      },
    ],
    problems: [
      "COPD (J44.9)",
      "Chronic systolic heart failure (I50.22)",
      "Anemia of chronic disease (D63.0)",
    ],
  },
  {
    id: "P005",
    mrn: "MRN-1005",
    firstName: "Maria",
    lastName: "Garcia",
    dateOfBirth: "1998-02-14",
    age: 28,
    gender: "Female",
    phone: "(555) 567-8901",
    email: "maria.garcia@email.com",
    address: "654 Maple Dr, Springfield, IL 62705",
    emergencyContact: {
      name: "Carlos Garcia",
      phone: "(555) 543-2109",
      relation: "Father",
    },
    primaryCareProvider: "Dr. Karen Thompson, MD",
    insurance: "United Healthcare",
    chiefComplaint: "Fatigue and dizziness (prenatal visit)",
    vitals: {
      bloodPressure: "110/68",
      heartRate: 78,
      temperature: 98.4,
      respiratoryRate: 16,
      oxygenSaturation: 99,
      recordedAt: "2026-06-10T13:30:00Z",
    },
    medications: [
      {
        id: "MED013",
        name: "Prenatal Vitamin",
        dosage: "1 tablet",
        frequency: "Once daily",
        route: "Oral",
        status: "active",
        prescribedDate: "2026-01-15",
        prescribedBy: "Dr. Karen Thompson",
      },
      {
        id: "MED014",
        name: "Ferrous Sulfate",
        dosage: "325 mg",
        frequency: "Twice daily",
        route: "Oral",
        status: "active",
        prescribedDate: "2026-04-01",
        prescribedBy: "Dr. Karen Thompson",
      },
    ],
    allergies: [
      {
        id: "ALG007",
        allergen: "Peanuts",
        severity: "severe",
        reaction: "Angioedema and anaphylaxis",
        recordedDate: "2010-09-15",
      },
    ],
    labResults: [
      {
        id: "LAB013",
        testName: "Hemoglobin",
        value: "10.2",
        referenceRange: "12.0-15.5",
        unit: "g/dL",
        status: "abnormal",
        date: "2026-06-10",
      },
      {
        id: "LAB014",
        testName: "Hematocrit",
        value: "31",
        referenceRange: "36-46",
        unit: "%",
        status: "abnormal",
        date: "2026-06-10",
      },
      {
        id: "LAB015",
        testName: "Ferritin",
        value: "15",
        referenceRange: "20-200",
        unit: "ng/mL",
        status: "abnormal",
        date: "2026-06-10",
      },
      {
        id: "LAB016",
        testName: "Glucose Tolerance Test (1hr)",
        value: "135",
        referenceRange: "< 140",
        unit: "mg/dL",
        status: "normal",
        date: "2026-06-10",
      },
    ],
    encounters: [
      {
        id: "ENC010",
        date: "2026-06-10",
        type: "Prenatal Visit - 28 weeks",
        provider: "Dr. Karen Thompson, MD",
        diagnosis: "Iron deficiency anemia of pregnancy (O99.01), Normal pregnancy (Z34.90)",
        notes:
          "28-week prenatal visit. Fundal height 28 cm, fetal heart tones 140 bpm. Labs show iron deficiency anemia. Increased ferritin dose. RhoGAM ordered for Rh-negative status.",
        department: "Obstetrics",
      },
      {
        id: "ENC011",
        date: "2026-05-06",
        type: "Prenatal Visit - 24 weeks",
        provider: "Dr. Karen Thompson, MD",
        diagnosis: "Normal pregnancy (Z34.90)",
        notes:
          "24-week prenatal visit. Glucose tolerance test passed. Fundal height 24 cm. Fetal movement reported as normal.",
        department: "Obstetrics",
      },
    ],
    problems: [
      "Normal pregnancy (Z34.90)",
      "Iron deficiency anemia (D50.9)",
      "Rh-negative status (Z16.1)",
    ],
  },
];

// ─── Context ───────────────────────────────────────────────────────

interface PatientContextValue {
  patients: Patient[];
  getPatientById: (id: string) => Patient | undefined;
  getPatientByMrn: (mrn: string) => Patient | undefined;
}

const PatientContext = createContext<PatientContextValue | null>(null);

export function PatientProvider({ children }: { children: ReactNode }) {
  const getPatientById = (id: string) => mockPatients.find((p) => p.id === id);
  const getPatientByMrn = (mrn: string) =>
    mockPatients.find((p) => p.mrn === mrn);

  return (
    <PatientContext.Provider
      value={{ patients: mockPatients, getPatientById, getPatientByMrn }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatientStore(): PatientContextValue {
  const ctx = useContext(PatientContext);
  if (!ctx) {
    throw new Error("usePatientStore must be used within a PatientProvider");
  }
  return ctx;
}