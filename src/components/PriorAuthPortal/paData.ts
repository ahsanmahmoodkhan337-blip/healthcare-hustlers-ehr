// ──────────────────────────────────────────────────────────────────────
// Prior Auth Portal — paData.ts
// Insurance criteria, step therapy, documentation requirements per procedure
// Inspired by: DrChrono Prior Auth workflows + Epic PA Hub
// ──────────────────────────────────────────────────────────────────────

export interface PACriterion {
  id: string;
  text: string;
  required: boolean;
  typicalEvidence: string;
}

export interface PAStepTherapy {
  step: number;
  requirement: string;
  typicalDuration: string;
  alternatives: string[];
}

export interface PAProcedureData {
  /** Display name */
  label: string;
  /** Associated CPT codes */
  cptCodes: string[];
  /** Associated ICD-10 ranges */
  icdRanges: string[];
  /** Criteria checklist items */
  criteria: PACriterion[];
  /** Step therapy requirements (if applicable) */
  stepTherapy?: PAStepTherapy[];
  /** Documentation the provider should attach */
  requiredDocs: string[];
  /** Typical turnaround time */
  typicalTimeline: string;
  /** Auto-auth threshold (some payers auto-approve under this $) */
  autoAuthThreshold?: number;
  /** Common denial reasons for this procedure */
  commonDenialReasons: string[];
  /** Medical necessity letter template sections */
  letterTemplateSections: string[];
}

export type ProcedureKey = "mri" | "ct" | "knee-replacement" | "cardiac-cath" | "infusion-therapy" | "sleep-study" | "biologic";

export const PA_PROCEDURES: Record<ProcedureKey, PAProcedureData> = {
  "mri": {
    label: "MRI (Lumbar / Cervical / Knee)",
    cptCodes: ["72141", "72142", "72146", "72147", "72148", "72149", "72156", "72157", "72158", "73721"],
    icdRanges: ["M51.1–M51.9 (Lumbar disc)", "M54.3–M54.5 (Sciatica)", "M17.0–M17.9 (Knee OA)"],
    criteria: [
      { id: "mri-1", text: "Conservative treatment failed (6+ weeks of PT / NSAIDs)", required: true, typicalEvidence: "PT notes, prescription history" },
      { id: "mri-2", text: "Pain scale documented >4/10 on multiple visits", required: true, typicalEvidence: "Progress notes with pain scores" },
      { id: "mri-3", text: "No red flags (cauda equina, malignancy, fracture)", required: true, typicalEvidence: "Physical exam documentation" },
      { id: "mri-4", text: "Focal neurologic deficit on exam", required: false, typicalEvidence: "Sensorimotor exam findings" },
      { id: "mri-5", text: "Failed prior imaging (X-ray / CT inconclusive)", required: false, typicalEvidence: "Prior imaging reports" },
    ],
    requiredDocs: [
      "History & Physical (H&P) note",
      "Progress notes documenting failed conservative therapy",
      "Prior imaging reports (X-ray / CT)",
      "Pain assessment scale documentation",
      "Physical exam findings"
    ],
    typicalTimeline: "5–10 business days",
    autoAuthThreshold: 1500,
    commonDenialReasons: [
      "CO-50: No prior conservative treatment documented",
      "CO-180: Pain scale not documented",
      "CO-119: Non-formulary imaging (prefer CT first)"
    ],
    letterTemplateSections: [
      "Patient demographics and insurance information",
      "Diagnosis and ICD-10 code",
      "Clinical history: onset, duration, prior treatments tried",
      "Physical exam findings relevant to the study",
      "Why this imaging modality is necessary (vs alternatives)",
      "Risk of not performing the study (delayed diagnosis, progression)"
    ]
  },
  "ct": {
    label: "CT Chest / Abdomen / Pelvis",
    cptCodes: ["71250", "71260", "71275", "74176", "74177", "74178"],
    icdRanges: ["R91.1 (Solitary pulmonary nodule)", "R93.3 (Abnormal abdominal findings)", "C78.0–C78.9 (Metastatic disease)"],
    criteria: [
      { id: "ct-1", text: "Abnormal X-ray or ultrasound findings", required: true, typicalEvidence: "Prior imaging reports" },
      { id: "ct-2", text: "Hemoptysis / unexplained cough > 4 weeks", required: false, typicalEvidence: "Progress notes" },
      { id: "ct-3", text: "Unexplained weight loss (>5% in 3 months)", required: false, typicalEvidence: "Weight tracking in chart" },
      { id: "ct-4", text: "Suspected malignancy based on labs or exam", required: false, typicalEvidence: "Lab results, exam findings" },
      { id: "ct-5", text: "Follow-up of known lesion (size/stability check)", required: true, typicalEvidence: "Prior CT report for comparison" },
    ],
    requiredDocs: [
      "Ordering physician note with indication",
      "Prior imaging reports (X-ray, US, or prior CT)",
      "Relevant lab values (CBC, LFTs, tumor markers)",
      "Progress notes with symptom duration",
      "If follow-up: comparison report"
    ],
    typicalTimeline: "3–7 business days",
    commonDenialReasons: [
      "CO-16: Lack of prior imaging to justify CT",
      "CO-97: Routine screening without specific indication",
      "CO-119: Prefer lower-dose imaging (X-ray/US first)"
    ],
    letterTemplateSections: [
      "Patient demographics and insurance information",
      "Specific clinical indication for the study",
      "Prior imaging results and why they are inconclusive",
      "Signs/symptoms documented (hemoptysis, weight loss, etc.)",
      "Relevant lab values supporting the need",
      "Differential diagnosis being investigated"
    ]
  },
  "knee-replacement": {
    label: "Total Knee Arthroplasty (TKA)",
    cptCodes: ["27447"],
    icdRanges: ["M17.0–M17.9 (OA of knee)", "M16.0 (Rheumatoid)"],
    criteria: [
      { id: "tka-1", text: "X-ray confirmed OA grade 3-4 (Kellgren-Lawrence)", required: true, typicalEvidence: "X-ray report with grading" },
      { id: "tka-2", text: "BMI < 40 (most payers)", required: true, typicalEvidence: "Anthropometric measurements in chart" },
      { id: "tka-3", text: "Non-smoker for 6+ months (or nicotine-free)", required: true, typicalEvidence: "Social history, cotinine test" },
      { id: "tka-4", text: "Failed conservative therapy (PT, injections, braces)", required: true, typicalEvidence: "PT notes, injection records" },
      { id: "tka-5", text: "Functional limitation documented (stairs, walking)", required: true, typicalEvidence: "Functional assessment scores" },
      { id: "tka-6", text: "No active infection or uncontrolled DM", required: true, typicalEvidence: "PCP clearance, HbA1c < 8.0" },
    ],
    stepTherapy: [
      { step: 1, requirement: "Conservative management: PT 2x/week for 6 weeks", typicalDuration: "6–8 weeks", alternatives: ["Home exercise program"] },
      { step: 2, requirement: "NSAIDs / pain management trial", typicalDuration: "4–8 weeks", alternatives: ["Topical analgesics"] },
      { step: 3, requirement: "Intra-articular steroid or viscosupplementation injection", typicalDuration: "1–3 injections", alternatives: ["Gel injections (Synvisc, Euflexxa)"] },
    ],
    requiredDocs: [
      "X-ray report with Kellgren-Lawrence grade",
      "Surgical clearance from PCP / cardiologist",
      "PT notes documenting failed conservative therapy",
      "Injection records (dates, type, response)",
      "Functional assessment questionnaire (KOOS / WOMAC)",
      "HbA1c (if diabetic), nicotine screen"
    ],
    typicalTimeline: "2–6 weeks (often requires step therapy completion)",
    autoAuthThreshold: 50000,
    commonDenialReasons: [
      "CO-50: Conservative therapy not documented",
      "CO-180: BMI criteria not met",
      "PR-2: Smoking cessation not documented (nicotine-positive)"
    ],
    letterTemplateSections: [
      "Patient demographics, insurance, and surgeon details",
      "Diagnosis and severity (OA grade, functional limitation)",
      "Documentation of failed conservative management (PT, injections)",
      "Comorbidities and surgical risk assessment",
      "BMI, smoking status, and optimization steps taken",
      "Expected outcome: pain relief, functional improvement, QoL gain"
    ]
  },
  "cardiac-cath": {
    label: "Cardiac Catheterization / Coronary Angiogram",
    cptCodes: ["93458", "93460", "93461", "93593"],
    icdRanges: ["I20.0–I25.9 (CAD)", "I50.2–I50.9 (HF)", "R94.3 (Abnormal stress test)"],
    criteria: [
      { id: "cath-1", text: "Positive stress test (Echo, Nuclear, or Stress ECG)", required: true, typicalEvidence: "Stress test report" },
      { id: "cath-2", text: "Chest pain with high-risk features (unstable angina)", required: false, typicalEvidence: "ED notes, cardiology consult" },
      { id: "cath-3", text: "Abnormal echocardiogram (wall motion, low EF)", required: true, typicalEvidence: "Echo report with measurements" },
      { id: "cath-4", text: "Elevated troponin / biomarkers", required: false, typicalEvidence: "Lab results" },
      { id: "cath-5", text: "Failed medical management (anti-anginal therapy)", required: false, typicalEvidence: "Medication list, cardiology notes" },
      { id: "cath-6", text: "High-risk CAD based on risk calculators (ASCVD >20%)", required: false, typicalEvidence: "Risk assessment in chart" },
    ],
    requiredDocs: [
      "Cardiology consultation note",
      "Stress test report (with METs, Duke treadmill score)",
      "Echocardiogram report (EF, wall motion)",
      "ECG showing ischemia or prior MI",
      "Troponin / cardiac enzyme results",
      "Medication list (anti-anginal, antiplatelet)",
      "ASCVD risk score calculation"
    ],
    typicalTimeline: "3–10 business days (urgent cases expedited)",
    autoAuthThreshold: 30000,
    commonDenialReasons: [
      "CO-16: Abnormal cardiac imaging not documented",
      "CO-50: Medical management not attempted first",
      "CO-119: Prefer CT coronary angiography (non-invasive first)"
    ],
    letterTemplateSections: [
      "Patient demographics and insurance information",
      "Cardiac diagnosis and symptoms (CCS class, angina type)",
      "Non-invasive test results (stress test, echo, ECG) with details",
      "Risk calculation (ASCVD, TIMI, GRACE scores)",
      "Medications tried and response",
      "Justification for invasive vs. non-invasive approach"
    ]
  },
  "infusion-therapy": {
    label: "Infusion Therapy (Remicade / Entyvio / Ocrevus)",
    cptCodes: ["96413", "96415", "96417", "96365"],
    icdRanges: ["K50.0–K52.9 (IBD)", "M05.0–M06.9 (RA)", "G35.0–G35.9 (MS)"],
    criteria: [
      { id: "inf-1", text: "FDA-approved indication for the biologic", required: true, typicalEvidence: "Diagnosis confirmed in chart" },
      { id: "inf-2", text: "Failed or intolerant to conventional therapy (e.g., DMARDs, steroids)", required: true, typicalEvidence: "Treatment history, medication list" },
      { id: "inf-3", text: "Disease activity severity documented (DAS28, HBI, EDSS)", required: true, typicalEvidence: "Activity scores in progress notes" },
      { id: "inf-4", text: "TB screening completed (Quantiferon / PPD)", required: true, typicalEvidence: "Lab report in chart" },
      { id: "inf-5", text: "Hepatitis B / C screening completed", required: true, typicalEvidence: "Serology lab report" },
      { id: "inf-6", text: "No active infections or contraindications", required: true, typicalEvidence: "PCP clearance, infection screen" },
    ],
    stepTherapy: [
      { step: 1, requirement: "Trial of conventional DMARD (methotrexate, sulfasalazine, hydroxychloroquine)", typicalDuration: "3–6 months", alternatives: ["Leflunomide", "Azathioprine"] },
      { step: 2, requirement: "Trial of steroids (if appropriate for disease)", typicalDuration: "4–8 weeks", alternatives: ["Budesonide (for Crohn's)", "IV methylprednisolone (for MS)"] },
      { step: 3, requirement: "Consider preferred biologic on formulary first (if applicable)", typicalDuration: "N/A — formulary check", alternatives: ["Humira", "Enbrel", "Tysabri"] },
    ],
    requiredDocs: [
      "Specialist consultation note (GI, Rheum, Neuro)",
      "Disease activity scores (DAS28, HBI, EDSS, etc.)",
      "Treatment history: DMARDs, steroids, other biologics tried",
      "TB screening (Quantiferon Gold / PPD) with date",
      "Hepatitis B/C serology",
      "Infection screen: CBC, LFTs, renal function",
      "Medication list with dosing history"
    ],
    typicalTimeline: "7–14 business days (first dose); 3–5 days (reauthorization)",
    commonDenialReasons: [
      "CO-50: Conventional DMARDs not tried first",
      "CO-180: Disease activity not documented",
      "PR-1: TB/HepB screening missing"
    ],
    letterTemplateSections: [
      "Patient demographics, insurance, and prescribing specialist",
      "Diagnosis and disease duration",
      "Previous therapies tried (conventional DMARDs, steroids) and why they failed",
      "Disease activity scores with dates",
      "Screening results (TB, HepB, HepC) — negative status confirmed",
      "Why this specific biologic is indicated (vs. alternatives on formulary)",
      "Infusion schedule and monitoring plan"
    ]
  },
  "sleep-study": {
    label: "Sleep Study (Polysomnography / Home Sleep Test)",
    cptCodes: ["95800", "95801", "95806", "95810", "95811"],
    icdRanges: ["G47.30–G47.39 (Sleep apnea)", "R06.83 (Snoring)", "G47.0 (Insomnia)"],
    criteria: [
      { id: "sleep-1", text: "High STOP-BANG score (≥3) or Epworth Sleepiness Scale >10", required: true, typicalEvidence: "Screening questionnaire results" },
      { id: "sleep-2", text: "Witnessed apneas or gasping during sleep (bed partner report)", required: true, typicalEvidence: "Sleep history in progress notes" },
      { id: "sleep-3", text: "Daytime somnolence affecting work/driving", required: false, typicalEvidence: "ESS score, patient-reported impact" },
      { id: "sleep-4", text: "BMI > 30 with snoring and fatigue", required: false, typicalEvidence: "Anthropometrics, sleep questionnaire" },
      { id: "sleep-5", text: "Hypertension (HTN) resistant to treatment", required: false, typicalEvidence: "BP logs, medication list" },
    ],
    requiredDocs: [
      "Sleep history questionnaire (STOP-BANG / Epworth)",
      "Progress notes documenting sleep symptoms",
      "BMI / neck circumference measurement",
      "Bed partner report of apneas (if available)",
      "BP readings (if HTN present)",
      "Medication list (especially sedatives, stimulants)"
    ],
    typicalTimeline: "2–4 weeks (home test); 4–8 weeks (in-lab PSG)",
    autoAuthThreshold: 2000,
    commonDenialReasons: [
      "CO-50: Screening questionnaire not documented",
      "CO-180: Prefer home sleep test over in-lab study",
      "CO-119: Mild OSA — lifestyle modification recommended first"
    ],
    letterTemplateSections: [
      "Patient demographics and insurance information",
      "Sleep-related symptoms and duration",
      "STOP-BANG and Epworth Sleepiness Scale scores",
      "Comorbidities (HTN, obesity, diabetes) and their relationship to sleep",
      "Why this specific sleep study type is appropriate",
      "Risk of untreated sleep apnea (cardiovascular, accident risk)"
    ]
  },
  "biologic": {
    label: "Biologic Therapy (Humira / Enbrel / Stelara)",
    cptCodes: ["96413", "96365", "J0135", "J1438", "J1745"],
    icdRanges: ["L40.0–L40.9 (Psoriasis)", "M05.0–M06.9 (RA)", "K50.0–K50.9 (Crohn's)"],
    criteria: [
      { id: "bio-1", text: "Diagnosis confirmed by biopsy / imaging / lab criteria", required: true, typicalEvidence: "Pathology report, diagnostic criteria met" },
      { id: "bio-2", text: "Failed or intolerant to 2+ conventional therapies", required: true, typicalEvidence: "Treatment history with dates and outcomes" },
      { id: "bio-3", text: "Moderate to severe disease activity (PASI >10, DAS28 >3.2)", required: true, typicalEvidence: "Activity scores documented" },
      { id: "bio-4", text: "TB / HepB screening completed and negative", required: true, typicalEvidence: "Screening lab reports (within 1 year)" },
      { id: "bio-5", text: "No prior serious infection on biologics", required: true, typicalEvidence: "Prior biologic history if applicable" },
      { id: "bio-6", text: "CBC, LFTs, renal function checked within 30 days", required: false, typicalEvidence: "Recent lab results" },
    ],
    stepTherapy: [
      { step: 1, requirement: "Trial of topical therapy (for psoriasis) or conventional DMARD (for RA/IBD)", typicalDuration: "3–6 months", alternatives: ["Phototherapy (psoriasis)", "5-ASA (IBD)"] },
      { step: 2, requirement: "Trial of preferred biologic on formulary", typicalDuration: "3–6 months", alternatives: ["Adalimumab biosimilar", "Infliximab"] },
    ],
    requiredDocs: [
      "Specialist consultation note",
      "Diagnostic report (biopsy, imaging, endoscopy)",
      "Treatment history — all prior therapies with dates and outcomes",
      "Disease activity scores (PASI, DAS28, CDAI, etc.)",
      "TB screening (Quantiferon Gold) — negative result",
      "Hepatitis B/C serology — negative",
      "Recent labs (CBC, CMP, CRP/ESR)",
      "Prior authorization history (if reauthorization)"
    ],
    typicalTimeline: "7–14 business days (new); 5–7 days (reauthorization)",
    commonDenialReasons: [
      "CO-50: Step therapy not completed",
      "CO-180: Disease severity not documented with validated score",
      "PR-1: TB / HepB screening missing or outdated (>1 year)",
      "CO-119: Prefer biosimilar over brand biologic"
    ],
    letterTemplateSections: [
      "Patient demographics, insurance, prescribing specialist",
      "Confirmed diagnosis with supporting evidence (biopsy, imaging)",
      "Complete treatment history: topicals → DMARDs → prior biologics",
      "Disease activity scores (PASI, DAS28, CDAI) with dates",
      "Screening results: TB negative, HepB/C negative",
      "Why this biologic is medically necessary (vs. alternatives)",
      "Monitoring plan (labs, follow-up schedule, infection surveillance)"
    ]
  }
};

/** Payer-specific criteria variations */
export interface PayerCriteriaOverride {
  payerName: string;
  additionalCriteria: Partial<PACriterion>[];
  autoAuthThresholdModifier: number; // multiplier
  notes: string;
}

export const PAYER_OVERRIDES: Record<string, PayerCriteriaOverride> = {
  "medicare": {
    payerName: "Medicare",
    additionalCriteria: [
      { id: "mc-1", text: "Medicare LCD (Local Coverage Determination) criteria met", required: true, typicalEvidence: "LCD checklist in chart" }
    ],
    autoAuthThresholdModifier: 1.2,
    notes: "Medicare does NOT require prior auth for most imaging but does for biologics and TKA"
  },
  "medicaid": {
    payerName: "Medicaid",
    additionalCriteria: [
      { id: "md-1", text: "State-specific prior auth form completed", required: true, typicalEvidence: "State PA form" },
      { id: "md-2", text: "Preferred drug list (PDL) followed for biologics", required: true, typicalEvidence: "PDL check" }
    ],
    autoAuthThresholdModifier: 0.8,
    notes: "Medicaid often requires step therapy and has stricter criteria"
  },
  "bcbs": {
    payerName: "Blue Cross Blue Shield",
    additionalCriteria: [
      { id: "bc-1", text: "BCBS medical policy criteria met", required: true, typicalEvidence: "Medical policy number referenced" }
    ],
    autoAuthThresholdModifier: 1.0,
    notes: "BCBS plans vary by state — check local medical policy"
  }
};

/** Common PA submission errors */
export const PA_COMMON_ERRORS = [
  { field: "ICD-10 Code", error: "Missing or invalid diagnosis code", fix: "Verify ICD-10 matches procedure indication" },
  { field: "CPT Code", error: "CPT not covered by patient's plan", fix: "Check plan benefits / use alternative code" },
  { field: "Clinical Notes", error: "Insufficient documentation of medical necessity", fix: "Add specific symptom details and prior treatment history" },
  { field: "Authorization Number", error: "Missing or expired auth number (re-auth)", fix: "Reference original auth number and reason for renewal" },
  { field: "Timing", error: "Retrospective auth (procedure already done)", fix: "Always submit PA before performing procedure for elective cases" },
  { field: "Payer Policy", error: "Procedure not on payer's approved list", fix: "Request single-case agreement or appeal with medical necessity letter" },
  { field: "Step Therapy", error: "Step therapy not completed before requesting advanced therapy", fix: "Document all prior step therapy attempts and failures" },
  { field: "Supporting Docs", error: "Missing required attachments (lab, imaging, notes)", fix: "Use clinical documentation mapper checklist before submitting" }
];

/** Status labels */
export const PA_STATUS_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
  "draft": { label: "Draft", color: "text-slate-600", bgColor: "bg-slate-100" },
  "initiated": { label: "Initiated", color: "text-blue-600", bgColor: "bg-blue-50" },
  "submitted": { label: "Submitted", color: "text-amber-600", bgColor: "bg-amber-50" },
  "under-review": { label: "Under Review", color: "text-purple-600", bgColor: "bg-purple-50" },
  "decision-pending": { label: "Decision Pending", color: "text-orange-600", bgColor: "bg-orange-50" },
  "approved": { label: "Approved", color: "text-green-600", bgColor: "bg-green-50" },
  "denied": { label: "Denied", color: "text-red-600", bgColor: "bg-red-50" },
};

/** Timeline steps */
export const PA_TIMELINE_STEPS = [
  { key: "initiated", label: "Initiated", description: "PA request created" },
  { key: "documents-submitted", label: "Documents Submitted", description: "Clinical docs attached and sent" },
  { key: "under-review", label: "Under Review", description: "Payer reviewing submitted documents" },
  { key: "decision-pending", label: "Decision Pending", description: "Final determination in progress" },
  { key: "decision", label: "Approved / Denied", description: "Payer decision rendered" },
];

/** Sample PA queue items */
export interface PAQueueItem {
  id: string;
  patientName: string;
  procedure: string;
  payer: string;
  status: string;
  submittedAt: string;
  urgency: "routine" | "urgent" | "emergent";
  assignedTo?: string;
}

export const SAMPLE_PA_QUEUE: PAQueueItem[] = [
  { id: "PA-001", patientName: "John Smith", procedure: "MRI Lumbar Spine", payer: "Blue Cross", status: "submitted", submittedAt: "2026-06-28", urgency: "routine" },
  { id: "PA-002", patientName: "Sarah Johnson", procedure: "Total Knee Arthroplasty", payer: "Medicare", status: "under-review", submittedAt: "2026-06-25", urgency: "routine" },
  { id: "PA-003", patientName: "Mike Chen", procedure: "Cardiac Catheterization", payer: "United Healthcare", status: "approved", submittedAt: "2026-06-20", urgency: "urgent" },
  { id: "PA-004", patientName: "Emily Davis", procedure: "Remicade Infusion", payer: "Aetna", status: "denied", submittedAt: "2026-06-15", urgency: "routine" },
  { id: "PA-005", patientName: "Robert Wilson", procedure: "Sleep Study (Home)", payer: "Cigna", status: "draft", submittedAt: "2026-06-30", urgency: "routine" },
];