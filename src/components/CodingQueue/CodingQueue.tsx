/**
 * CodingQueue — Enhanced Medical Coder Workspace
 *
 * Major upgrade with:
 * - ICD-10 priority ordering (1st, 2nd, 3rd diagnosis) with up/down reorder
 * - Per-CPT data: modifiers, ICD linking, units, charges
 * - ICD ↔ CPT linking dropdown per CPT row
 * - Full charge capture per claim
 *
 * Inspiration: Epic Cogito / 3M 360 Encompass / AAPC CPC curriculum
 */

import { useState, useMemo } from "react";
import { Search, Code, BookOpen, ArrowRight, CheckCircle2, AlertCircle, FileText, Info, ArrowUp, ArrowDown, Link2, DollarSign, Hash } from "lucide-react";
import { usePipeline } from "../../store/pipelineStore";
import { ICD10_CODES, searchICD10, type ICD10Code } from "./icd10Data";
import { CPT_CODES, searchCPT, type CPTCode } from "./cptData";

// ─── Types ────────────────────────────────────────────────────────

interface CPTCodeData {
  cpt: CPTCode;
  linkedICDs: string[]; // ICD-10 code strings
  modifiers: string[];
  units: number;
  charges: number;
}

const MODIFIERS = [
  { code: "25", description: "Significant, separately identifiable E/M service by same physician on same day" },
  { code: "59", description: "Distinct procedural service — not normally reported together" },
  { code: "27", description: "Multiple outpatient hospital encounters on same date" },
  { code: "50", description: "Bilateral procedure performed on both sides" },
  { code: "51", description: "Multiple procedures performed at same session" },
  { code: "52", description: "Reduced services — procedure partially reduced" },
  { code: "76", description: "Repeat procedure by same physician" },
];

const E_M_LEVELS = [
  { code: "99202", name: "New Patient — Low", problems: 1, data: 1, risk: "Low" },
  { code: "99203", name: "New Patient — Moderate", problems: 2, data: 2, risk: "Moderate" },
  { code: "99204", name: "New Patient — High", problems: 3, data: 3, risk: "Moderate" },
  { code: "99212", name: "Established — Low", problems: 1, data: 1, risk: "Low" },
  { code: "99213", name: "Established — Moderate", problems: 2, data: 2, risk: "Low" },
  { code: "99214", name: "Established — High", problems: 3, data: 2, risk: "Moderate" },
];

const CONVENTIONS = [
  { title: "Excludes1", desc: "Codes that are mutually exclusive. Both conditions cannot occur together. DO NOT report both.", color: "bg-red-50 border-red-200 text-red-700" },
  { title: "Excludes2", desc: "Codes that represent separate conditions. Both CAN be reported together if both are present.", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { title: "Code First", desc: "Underlying etiology must be coded first (e.g., code DM first for neuropathy).", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { title: "Use Additional Code", desc: "The manifestation or complication should be coded with an additional code.", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { title: "Laterality", desc: "Seventh character extension for side: 1=right, 2=left, 9=unspecified.", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { title: "Unspecified vs Specified", desc: "Use unspecified codes only when the provider has not documented enough detail.", color: "bg-slate-50 border-slate-200 text-slate-700" },
];

// ─── Component ────────────────────────────────────────────────────

export function CodingQueue() {
  const { state, submitToBilling, setRole } = usePipeline();

  // Code search state
  const [icdQuery, setIcdQuery] = useState("");
  const [cptQuery, setCptQuery] = useState("");

  // Ordered ICD-10 list with priority (position = priority)
  const [selectedICDs, setSelectedICDs] = useState<ICD10Code[]>(
    state.icdCodes.length > 0
      ? ICD10_CODES.filter(c => state.icdCodes.includes(c.code))
      : []
  );

  // Per-CPT data: each CPT gets its own modifiers, linked ICDs, units, charges
  const [cptDataMap, setCptDataMap] = useState<Record<string, CPTCodeData>>({});
  // Base CPT list (the codes themselves)
  const [selectedCPTs, setSelectedCPTs] = useState<CPTCode[]>(
    state.cptCodes.length > 0
      ? CPT_CODES.filter(c => state.cptCodes.includes(c.code))
      : []
  );

  // E/M calculator
  const [emProblems, setEmProblems] = useState<number>(1);
  const [emData, setEmData] = useState<number>(1);
  const [emRisk, setEmRisk] = useState<string>("Low");

  // Conventions panel
  const [showConventions, setShowConventions] = useState(false);

  // Quiz
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Submission state
  const [submitted, setSubmitted] = useState(false);

  // Search results
  const icdResults = useMemo(() => searchICD10(icdQuery), [icdQuery]);
  const cptResults = useMemo(() => searchCPT(cptQuery), [cptQuery]);

  // Get or create CPT data for a cpt code
  const getCptData = (code: string): CPTCodeData => {
    if (!cptDataMap[code]) {
      const cpt = selectedCPTs.find(c => c.code === code);
      cptDataMap[code] = {
        cpt: cpt!,
        linkedICDs: [],
        modifiers: [],
        units: 1,
        charges: 0,
      };
    }
    return cptDataMap[code];
  };

  const updateCptData = (code: string, updater: (d: CPTCodeData) => CPTCodeData) => {
    setCptDataMap(prev => ({
      ...prev,
      [code]: updater(prev[code] || getCptData(code)),
    }));
  };

  // ICD reorder
  const moveICD = (idx: number, direction: "up" | "down") => {
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === selectedICDs.length - 1) return;
    const newList = [...selectedICDs];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[targetIdx]] = [newList[targetIdx], newList[idx]];
    setSelectedICDs(newList);
  };

  const addICD = (code: ICD10Code) => {
    if (!selectedICDs.find((c) => c.code === code.code)) {
      setSelectedICDs([...selectedICDs, code]);
      setIcdQuery("");
    }
  };

  const removeICD = (code: string) => {
    setSelectedICDs(selectedICDs.filter((c) => c.code !== code));
    // Also remove this ICD from all CPT links
    setCptDataMap(prev => {
      const next: Record<string, CPTCodeData> = {};
      for (const [k, v] of Object.entries(prev)) {
        next[k] = { ...v, linkedICDs: v.linkedICDs.filter(c => c !== code) };
      }
      return next;
    });
  };

  const addCPT = (code: CPTCode) => {
    if (!selectedCPTs.find((c) => c.code === code.code)) {
      setSelectedCPTs([...selectedCPTs, code]);
      setCptQuery("");
      // Initialize CPT data
      setCptDataMap(prev => ({
        ...prev,
        [code.code]: {
          cpt: code,
          linkedICDs: [],
          modifiers: [],
          units: 1,
          charges: 0,
        },
      }));
    }
  };

  const removeCPT = (code: string) => {
    setSelectedCPTs(selectedCPTs.filter((c) => c.code !== code));
    setCptDataMap(prev => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  };

  const calcEMMLevel = () => {
    const match = E_M_LEVELS.find(
      (l) => l.problems <= emProblems && l.data <= emData && l.risk === emRisk
    );
    return match || E_M_LEVELS[0];
  };

  const handleSubmitToBilling = () => {
    if (selectedICDs.length > 0 && selectedCPTs.length > 0) {
      submitToBilling(
        selectedICDs.map((c) => c.code),
        selectedCPTs.map((c) => c.code)
      );
      setSubmitted(true);
      setRole("prior-auth");
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === "yes") {
      setQuizFeedback("✓ Correct! E11.9 supports a moderate MDM visit like 99214.");
    } else {
      setQuizFeedback("Actually yes — a diabetic patient with medication management can support 99214.");
    }
  };

  const emLevel = calcEMMLevel();

  // Compute total charge
  const totalCharges = useMemo(() => {
    let total = 0;
    selectedCPTs.forEach(cpt => {
      const data = cptDataMap[cpt.code];
      if (data) total += data.charges * data.units;
    });
    return total;
  }, [selectedCPTs, cptDataMap]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">Medical Coding — Enhanced Coding Queue</h2>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">Stage 2</span>
        </div>
      </div>

      {state.status === "charted" || selectedICDs.length > 0 ? (
        <div className="flex flex-1 overflow-hidden">
          {/* ─── Left: Locked SOAP Note ─── */}
          <div className="hidden w-1/3 border-r border-slate-200 bg-slate-50 p-4 lg:block overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Encounter Note (Read Only)</span>
              <Lock className="h-3 w-3 text-slate-300" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="font-medium text-slate-700">Chief Complaint</p>
                <p className="mt-1 text-slate-500">Patient presents with follow-up for hypertension and diabetes management. Reports occasional headache, BP today 148/92.</p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="font-medium text-slate-700">Assessment</p>
                <p className="mt-1 text-slate-500">1. Essential hypertension (I10) — poorly controlled<br />2. Type 2 DM (E11.9) — on Metformin 500mg BID<br />3. Hyperlipidemia (E78.5)</p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="font-medium text-slate-700">Plan</p>
                <p className="mt-1 text-slate-500">Continue Metformin. Start Lisinopril 10mg. Follow up in 3 months. CMP ordered.</p>
              </div>
            </div>
          </div>

          {/* ─── Right: Coding Workspace ─── */}
          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            {/* Tabs: ICD / CPT / Conventions / E/M */}
            <div className="flex gap-1 border-b border-slate-200 pb-2">
              {["icd", "cpt", "conventions", "em"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setShowConventions(tab === "conventions");
                    setIcdQuery(tab === "icd" ? icdQuery : "");
                    setCptQuery(tab === "cpt" ? cptQuery : "");
                  }}
                  className={`px-3 py-1.5 text-[10px] font-medium rounded-t-lg transition-colors ${
                    (tab === "icd" && !showConventions) || (tab === "conventions" && showConventions)
                      ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab === "icd" ? "ICD-10 Codes" : tab === "cpt" ? "CPT Codes" : tab === "conventions" ? "Conventions" : "E/M Level"}
                </button>
              ))}
            </div>

            {/* ICD-10 + CPT Workspace */}
            {!showConventions && (
              <>
                {/* ─── ICD-10 Section with Priority ─── */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                    ICD-10-CM Diagnosis Codes
                    <span className="text-[9px] font-normal text-indigo-400 ml-1">(drag or use arrows to set priority — 1st, 2nd, 3rd)</span>
                  </p>
                  <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={icdQuery}
                      onChange={(e) => setIcdQuery(e.target.value)}
                      placeholder="Search by code, description, or chapter..."
                      className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-xs outline-none focus:border-indigo-400"
                    />
                  </div>
                  {icdQuery && (
                    <div className="mb-2 max-h-32 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                      {icdResults.map((code) => (
                        <button
                          key={code.code}
                          onClick={() => addICD(code)}
                          className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-indigo-50 border-b border-slate-50 last:border-0"
                        >
                          <div>
                            <span className="font-mono font-medium text-indigo-600">{code.code}</span>
                            <span className="ml-2 text-slate-600">{code.description}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{code.chapter}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected ICD-10 codes with priority indicators + reorder arrows */}
                  <div className="space-y-1.5">
                    {selectedICDs.map((c, idx) => (
                      <div key={c.code} className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/50 px-2 py-1.5 text-[10px]">
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => moveICD(idx, "up")} disabled={idx === 0} className={`h-3 w-3 ${idx === 0 ? "text-slate-300" : "text-indigo-500 hover:text-indigo-700"}`}>
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button onClick={() => moveICD(idx, "down")} disabled={idx === selectedICDs.length - 1} className={`h-3 w-3 ${idx === selectedICDs.length - 1 ? "text-slate-300" : "text-indigo-500 hover:text-indigo-700"}`}>
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold text-white ${
                          idx === 0 ? "bg-red-400" : idx === 1 ? "bg-amber-400" : "bg-indigo-400"
                        }`}>
                          {idx === 0 ? "1st" : idx === 1 ? "2nd" : `${idx + 1}th`}
                        </span>
                        <span className="font-mono font-semibold text-indigo-700 shrink-0">{c.code}</span>
                        <span className="flex-1 text-slate-600 truncate">{c.description}</span>
                        <button onClick={() => removeICD(c.code)} className="text-red-400 hover:text-red-600 shrink-0">&times;</button>
                      </div>
                    ))}
                    {selectedICDs.length === 0 && (
                      <p className="text-[10px] text-slate-400 italic">No ICD-10 codes selected. Search and add above.</p>
                    )}
                  </div>
                </div>

                {/* ─── CPT Section with Per-Code Data ─── */}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-violet-700 mb-2">CPT Procedure Codes</p>
                  <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={cptQuery}
                      onChange={(e) => setCptQuery(e.target.value)}
                      placeholder="Search by code, description, or category..."
                      className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-xs outline-none focus:border-violet-400"
                    />
                  </div>
                  {cptQuery && (
                    <div className="mb-2 max-h-32 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                      {cptResults.map((code) => (
                        <button
                          key={code.code}
                          onClick={() => addCPT(code)}
                          className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-violet-50 border-b border-slate-50 last:border-0"
                        >
                          <div>
                            <span className="font-mono font-medium text-violet-600">{code.code}</span>
                            <span className="ml-2 text-slate-600">{code.description}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">RVU: {code.rvu}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Per-CPT detail rows */}
                  {selectedCPTs.length > 0 && (
                    <div className="space-y-2">
                      {selectedCPTs.map((cpt) => {
                        const data = cptDataMap[cpt.code] || getCptData(cpt.code);
                        return (
                          <div key={cpt.code} className="rounded-lg border border-violet-100 bg-white p-2.5 shadow-sm">
                            {/* CPT header row */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono font-semibold text-violet-700 text-xs">{cpt.code}</span>
                              <span className="flex-1 text-[10px] text-slate-600 truncate">{cpt.description}</span>
                              <button onClick={() => removeCPT(cpt.code)} className="text-red-400 hover:text-red-600 text-[10px]">✕</button>
                            </div>

                            {/* ICD-10 linking dropdown */}
                            <div className="mb-1.5">
                              <div className="flex items-center gap-1 mb-1">
                                <Link2 className="h-2.5 w-2.5 text-violet-500" />
                                <span className="text-[9px] font-medium text-slate-500">Link to ICD-10 Codes</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {selectedICDs.map(icd => {
                                  const isLinked = data.linkedICDs.includes(icd.code);
                                  return (
                                    <button
                                      key={icd.code}
                                      onClick={() => updateCptData(cpt.code, d => ({
                                        ...d,
                                        linkedICDs: isLinked
                                          ? d.linkedICDs.filter(c => c !== icd.code)
                                          : [...d.linkedICDs, icd.code],
                                      }))}
                                      className={`rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors ${
                                        isLinked
                                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                          : "bg-slate-50 text-slate-500 border border-slate-200 hover:border-violet-200"
                                      }`}
                                    >
                                      {icd.code} {isLinked ? "✓" : ""}
                                    </button>
                                  );
                                })}
                                {selectedICDs.length === 0 && (
                                  <span className="text-[9px] text-slate-400 italic">Add ICD-10 codes first</span>
                                )}
                              </div>
                            </div>

                            {/* Inline modifiers */}
                            <div className="mb-1.5">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-[9px] font-medium text-slate-500">Modifiers</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {MODIFIERS.map(m => {
                                  const isActive = data.modifiers.includes(m.code);
                                  return (
                                    <button
                                      key={m.code}
                                      onClick={() => updateCptData(cpt.code, d => ({
                                        ...d,
                                        modifiers: isActive
                                          ? d.modifiers.filter(c => c !== m.code)
                                          : [...d.modifiers, m.code],
                                      }))}
                                      title={m.description}
                                      className={`rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors ${
                                        isActive
                                          ? "bg-sky-100 text-sky-700 border border-sky-200"
                                          : "bg-white text-slate-400 border border-slate-200 hover:border-sky-200"
                                      }`}
                                    >
                                      -{m.code}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Units & Charges */}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <Hash className="h-2.5 w-2.5 text-slate-400" />
                                <label className="text-[9px] text-slate-500">Units:</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="99"
                                  value={data.units}
                                  onChange={e => updateCptData(cpt.code, d => ({ ...d, units: Math.max(1, parseInt(e.target.value) || 1) }))}
                                  className="w-12 rounded border border-slate-200 px-1.5 py-0.5 text-[9px] outline-none focus:border-violet-400"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-2.5 w-2.5 text-slate-400" />
                                <label className="text-[9px] text-slate-500">Charge:</label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={data.charges || ""}
                                  onChange={e => updateCptData(cpt.code, d => ({ ...d, charges: parseFloat(e.target.value) || 0 }))}
                                  placeholder="0.00"
                                  className="w-20 rounded border border-slate-200 px-1.5 py-0.5 text-[9px] outline-none focus:border-violet-400"
                                />
                              </div>
                              {data.charges > 0 && (
                                <span className="text-[9px] text-violet-600 font-medium">
                                  = ${(data.charges * data.units).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {selectedCPTs.length === 0 && (
                    <p className="text-[10px] text-slate-400 italic">No CPT codes selected. Search and add above.</p>
                  )}
                </div>

                {/* Total Charges Summary */}
                {selectedCPTs.length > 0 && totalCharges > 0 && (
                  <div className="mt-3 rounded-lg bg-violet-50 border border-violet-200 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-violet-700">Total Charges</span>
                      <span className="text-sm font-bold text-violet-800">${totalCharges.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Coding Quiz */}
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-[10px] font-semibold text-amber-700 mb-2"> Coding Quiz: Does the diagnosis support the procedure?</p>
                  <p className="text-[10px] text-amber-600 mb-2">E11.9 (Diabetes) + 99214 (Established visit) — Are these codes compatible?</p>
                  <div className="flex gap-2">
                    {["yes", "no"].map((ans) => (
                      <button
                        key={ans}
                        onClick={() => setQuizAnswer(ans)}
                        className={`px-3 py-1 rounded text-[10px] font-medium ${
                          quizAnswer === ans ? "bg-amber-600 text-white" : "bg-white text-amber-700 border border-amber-300"
                        }`}
                      >
                        {ans === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                    {quizAnswer && !quizFeedback && (
                      <button onClick={handleQuizSubmit} className="px-3 py-1 rounded text-[10px] font-medium bg-amber-600 text-white">
                        Check
                      </button>
                    )}
                  </div>
                  {quizFeedback && (
                    <p className="mt-2 text-[10px] font-medium">{quizFeedback}</p>
                  )}
                </div>
              </>
            )}

            {/* Conventions Panel */}
            {showConventions && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Coding Conventions — Educational Reference
                </p>
                {CONVENTIONS.map((c) => (
                  <div key={c.title} className={`rounded-lg border p-3 text-xs ${c.color}`}>
                    <p className="font-semibold">{c.title}</p>
                    <p className="mt-0.5 opacity-80">{c.desc}</p>
                  </div>
                ))}
                <div className="mt-3 rounded-lg bg-sky-50 border border-sky-200 p-3">
                  <p className="text-[10px] font-semibold text-sky-700 mb-1"> Coding Tip</p>
                  <p className="text-[10px] text-sky-600">Always code the definitive diagnosis over symptoms. When a definitive diagnosis is established, do not code the symptom that led to it — unless the symptom is a separate condition.</p>
                </div>
              </div>
            )}

            {/* Submit to Billing — or Success View */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-800">Codes Submitted to Billing!</h3>
                <p className="mt-2 text-sm text-slate-500">
                  The coded encounter has been sent to the Medical Biller for claim processing.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 justify-center">
                  <div className="rounded-lg bg-green-50 border border-green-200 p-2">
                    <p className="text-[10px] font-medium text-green-700">ICD-10 Codes ({selectedICDs.length})</p>
                    <p className="text-xs text-green-600">{selectedICDs.map(c => c.code).join(", ")}</p>
                  </div>
                  <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-2">
                    <p className="text-[10px] font-medium text-indigo-700">CPT Codes ({selectedCPTs.length})</p>
                    <p className="text-xs text-indigo-600">{selectedCPTs.map(c => c.code).join(", ")}</p>
                  </div>
                  {totalCharges > 0 && (
                    <div className="rounded-lg bg-violet-50 border border-violet-200 p-2">
                      <p className="text-[10px] font-medium text-violet-700">Total Charges</p>
                      <p className="text-xs text-violet-600">${totalCharges.toFixed(2)}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setRole("biller")}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  Switch to Biller Role
                </button>
              </div>
            ) : (<>
              {selectedICDs.length > 0 && selectedCPTs.length > 0 && (
                <button
                  onClick={handleSubmitToBilling}
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Submit Coded Encounter to Billing ({selectedICDs.length} ICD-10, {selectedCPTs.length} CPT)
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </>)}
          </div>

          {/* ─── Right Sidebar: E/M Calculator ─── */}
          <div className="hidden w-64 border-l border-slate-200 bg-slate-50 p-4 lg:block overflow-y-auto">
            <div className="flex items-center gap-1.5 mb-3">
              <Info className="h-3.5 w-3.5 text-sky-500" />
              <span className="text-[10px] font-semibold text-slate-500">E/M Level Calculator</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500">Problems Addressed</label>
                <input type="range" min="1" max="4" value={emProblems} onChange={(e) => setEmProblems(Number(e.target.value))} className="w-full accent-sky-500" />
                <span className="text-[10px] text-slate-400">{emProblems}</span>
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Data Reviewed</label>
                <input type="range" min="1" max="4" value={emData} onChange={(e) => setEmData(Number(e.target.value))} className="w-full accent-sky-500" />
                <span className="text-[10px] text-slate-400">{emData}</span>
              </div>
              <div>
                <label className="text-[10px] text-slate-500">Risk Level</label>
                <select value={emRisk} onChange={(e) => setEmRisk(e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1 text-[10px]">
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                </select>
              </div>
              <div className="rounded-lg bg-white p-3 text-center shadow-sm">
                <p className="text-[10px] text-slate-400">Recommended Code</p>
                <p className="text-xl font-bold text-sky-600">{emLevel.code}</p>
                <p className="text-[10px] text-slate-500">{emLevel.name}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Search className="mb-2 h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-400">Waiting for charted encounter...</p>
          <p className="text-xs text-slate-300">Complete charting in Scribe role first</p>
        </div>
      )}
    </div>
  );
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}