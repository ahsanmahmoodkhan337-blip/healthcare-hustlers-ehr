/**
 * CPT Code Repository — Medical Coding Educational Content
 *
 * 25+ common procedure codes organized by category for the CodingQueue.
 * Students can search, filter, and select codes.
 *
 * Inspiration: AMA CPT Professional Edition / AAPC
 */

export interface CPTCode {
  code: string;
  description: string;
  category: string;
  rvu: number;
  notes?: string;
}

export const CPT_CODES: CPTCode[] = [
  // ─── E/M Codes ──────────────────────────────────────────────────
  { code: "99202", description: "Office/outpatient visit new, low MDM", category: "E/M New", rvu: 1.87, notes: "Straightforward MDM" },
  { code: "99203", description: "Office/outpatient visit new, moderate MDM", category: "E/M New", rvu: 2.67, notes: "Low MDM" },
  { code: "99204", description: "Office/outpatient visit new, high MDM", category: "E/M New", rvu: 3.77, notes: "Moderate MDM" },
  { code: "99205", description: "Office/outpatient visit new, high MDM (comprehensive)", category: "E/M New", rvu: 4.92, notes: "High MDM" },
  { code: "99212", description: "Office/outpatient visit established, low MDM", category: "E/M Est", rvu: 1.18, notes: "Straightforward" },
  { code: "99213", description: "Office/outpatient visit established, moderate MDM", category: "E/M Est", rvu: 2.08, notes: "Low MDM — most common code" },
  { code: "99214", description: "Office/outpatient visit established, high MDM", category: "E/M Est", rvu: 3.18, notes: "Moderate MDM" },
  { code: "99215", description: "Office/outpatient visit established, high MDM (comprehensive)", category: "E/M Est", rvu: 4.63, notes: "High MDM" },

  // ─── Medicine ───────────────────────────────────────────────────
  { code: "93000", description: "Electrocardiogram, routine ECG with interpretation and report", category: "Medicine", rvu: 0.59 },
  { code: "93015", description: "Cardiovascular stress test with supervision", category: "Medicine", rvu: 2.15 },
  { code: "94640", description: "Pressurized or nonpressurized inhalation treatment for acute airway obstruction", category: "Medicine", rvu: 0.78 },
  { code: "93306", description: "Echocardiography, transthoracic, complete with spectral Doppler", category: "Medicine", rvu: 3.28 },

  // ─── Surgery ────────────────────────────────────────────────────
  { code: "27130", description: "Total hip arthroplasty (hip replacement)", category: "Surgery", rvu: 20.34 },
  { code: "47562", description: "Laparoscopic cholecystectomy", category: "Surgery", rvu: 14.22 },
  { code: "47563", description: "Lap cholecystectomy with cholangiography", category: "Surgery", rvu: 16.08 },
  { code: "44140", description: "Colectomy, partial; with anastomosis", category: "Surgery", rvu: 26.75 },
  { code: "43239", description: "Upper GI endoscopy with biopsy", category: "Surgery", rvu: 4.81 },

  // ─── Radiology ──────────────────────────────────────────────────
  { code: "71045", description: "Chest X-ray, single view", category: "Radiology", rvu: 0.37 },
  { code: "71046", description: "Chest X-ray, 2 views", category: "Radiology", rvu: 0.55 },
  { code: "74177", description: "CT abdomen and pelvis with contrast", category: "Radiology", rvu: 3.45 },
  { code: "70551", description: "MRI brain without contrast", category: "Radiology", rvu: 4.28 },
  { code: "72125", description: "CT cervical spine without contrast", category: "Radiology", rvu: 2.97 },

  // ─── Pathology / Lab ────────────────────────────────────────────
  { code: "80053", description: "Comprehensive metabolic panel (CMP)", category: "Path/Lab", rvu: 0.38 },
  { code: "85025", description: "Complete blood count (CBC) with differential", category: "Path/Lab", rvu: 0.40 },
  { code: "81001", description: "Urinalysis with microscopy", category: "Path/Lab", rvu: 0.27 },
  { code: "80048", description: "Basic metabolic panel (BMP)", category: "Path/Lab", rvu: 0.31 },
];

export function searchCPT(query: string): CPTCode[] {
  if (!query || query.length < 1) return CPT_CODES.slice(0, 8);
  const q = query.toLowerCase();
  return CPT_CODES.filter(
    (c) =>
      c.code.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );
}