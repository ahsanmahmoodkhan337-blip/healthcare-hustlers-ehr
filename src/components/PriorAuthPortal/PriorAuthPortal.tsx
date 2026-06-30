// ──────────────────────────────────────────────────────────────────────
// PriorAuthPortal.tsx — Prior Authorization Hub (Stage 4)
// Complete PA workflow: queue dashboard, form, criteria checklists,
// documentation mapper, step therapy tracker, medical necessity letter,
// and status timeline.
// Inspired by: Epic PA Hub + DrChrono Prior Auth workflows
// ──────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import {
  Shield,
  ClipboardList,
  FileCheck,
  FileX,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Building2,
  FileText,
  Search,
  ArrowRight,
  ListChecks,
  Stethoscope,
  BookOpen,
  FlaskConical,
} from "lucide-react";
import { usePipeline } from "../../store/pipelineStore";
import {
  PA_PROCEDURES,
  PA_COMMON_ERRORS,
  PA_STATUS_LABELS,
  PA_TIMELINE_STEPS,
  SAMPLE_PA_QUEUE,
  ProcedureKey,
  type PAQueueItem,
} from "./paData";

type TabView = "queue" | "form" | "criteria" | "docs" | "step-therapy" | "letter" | "errors";

export default function PriorAuthPortal() {
  const { state, submitPA } = usePipeline();

  // Active tab
  const [activeTab, setActiveTab] = useState<TabView>("queue");

  // Form state
  const [procedure, setProcedure] = useState<ProcedureKey | "">("");
  const [payer, setPayer] = useState("Medicare");
  const [clinicalJustification, setClinicalJustification] = useState("");
  const [icdCodes, setIcdCodes] = useState("");
  const [cptCodes, setCptCodes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Criteria checkboxes
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});
  // Step therapy checkboxes
  const [stepTherapyComplete, setStepTherapyComplete] = useState<Record<string, boolean>>({});

  // Queue filter
  const [queueFilter, setQueueFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Letter state
  const [letterPatientName, setLetterPatientName] = useState("");
  const [letterDiagnosis, setLetterDiagnosis] = useState("");

  // Current PA timeline simulation
  const [timelineStep, setTimelineStep] = useState(0);

  const isLocked = state.status !== "billed" && !submitted;

  // Get procedure data
  const procedureData = procedure ? PA_PROCEDURES[procedure as ProcedureKey] : null;

  // Toggle criteria checkbox
  const toggleCriterion = (id: string) => {
    setCheckedCriteria((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle step therapy checkbox
  const toggleStepTherapy = (index: number) => {
    setStepTherapyComplete((prev) => ({ ...prev, [String(index)]: !prev[String(index)] }));
  };

  // Criteria met percentage
  const criteriaMet = useMemo(() => {
    if (!procedureData) return { met: 0, total: 0, pct: 0 };
    const total = procedureData.criteria.length;
    const met = procedureData.criteria.filter((c) => checkedCriteria[c.id]).length;
    return { met, total, pct: total > 0 ? Math.round((met / total) * 100) : 0 };
  }, [procedureData, checkedCriteria]);

  // Handle submit
  const handleSubmit = () => {
    submitPA({
      procedure: procedure ? PA_PROCEDURES[procedure as ProcedureKey]?.label || procedure : "General consultation",
      payer,
      submittedAt: new Date().toISOString(),
      justification: clinicalJustification,
      icdCodes,
      cptCodes,
    });
    setSubmitted(true);
  };

  // Filtered queue
  const filteredQueue = useMemo(() => {
    return SAMPLE_PA_QUEUE.filter((item) => {
      const matchesFilter = queueFilter === "all" || item.status === queueFilter;
      const matchesSearch =
        !searchTerm ||
        item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [queueFilter, searchTerm]);

  // ─── Tabs ─────────────────────────────────────────────────────────
  const tabs: { key: TabView; label: string; icon: React.ReactNode }[] = [
    { key: "queue", label: "Queue", icon: <ClipboardList className="h-3.5 w-3.5" /> },
    { key: "form", label: "PA Form", icon: <FileText className="h-3.5 w-3.5" /> },
    { key: "criteria", label: "Criteria", icon: <ListChecks className="h-3.5 w-3.5" /> },
    { key: "docs", label: "Docs Needed", icon: <Stethoscope className="h-3.5 w-3.5" /> },
    { key: "step-therapy", label: "Step Therapy", icon: <ArrowRight className="h-3.5 w-3.5" /> },
    { key: "letter", label: "Med. Necessity Letter", icon: <BookOpen className="h-3.5 w-3.5" /> },
    { key: "errors", label: "Common Errors", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  ];

  // ════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════
  if (isLocked) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center p-6">
        <Shield className="mb-2 h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-400">Prior Authorization Portal</p>
        <p className="mt-1 text-xs text-slate-300">Complete billing first to unlock this stage</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-white">
        <Shield className="h-4 w-4 text-purple-600" />
        <h2 className="text-sm font-bold text-slate-800">Prior Authorization Hub</h2>
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700 ml-1">
          Stage 4
        </span>
        {submitted && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 ml-auto flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Submitted
          </span>
        )}
      </div>

      {/* ── Sub-Tabs ── */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-2 gap-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[10px] font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-purple-600 text-purple-700 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Active Tab Content ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ─── TAB: QUEUE DASHBOARD ─── */}
        {activeTab === "queue" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-700">Prior Authorization Queue</p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-32 rounded-md border border-slate-200 pl-6 pr-2 py-1 text-[10px] outline-none focus:border-purple-300"
                  />
                </div>
                <select
                  value={queueFilter}
                  onChange={(e) => setQueueFilter(e.target.value)}
                  className="rounded-md border border-slate-200 px-2 py-1 text-[10px] outline-none focus:border-purple-300"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="under-review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                </select>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[{ status: "draft", label: "Drafts" }, { status: "submitted", label: "Submitted" }, { status: "under-review", label: "In Review" }, { status: "approved", label: "Approved" }, { status: "denied", label: "Denied" }].map(
                (s) => {
                  const count = SAMPLE_PA_QUEUE.filter((i) => i.status === s.status).length;
                  const colorMap: Record<string, string> = {
                    draft: "text-slate-600 bg-slate-50 border-slate-200",
                    submitted: "text-amber-600 bg-amber-50 border-amber-200",
                    "under-review": "text-purple-600 bg-purple-50 border-purple-200",
                    approved: "text-green-600 bg-green-50 border-green-200",
                    denied: "text-red-600 bg-red-50 border-red-200",
                  };
                  return (
                    <div
                      key={s.status}
                      className={`rounded-lg border p-2.5 text-center ${colorMap[s.status] || ""}`}
                    >
                      <p className="text-lg font-bold">{count}</p>
                      <p className="text-[10px] font-medium">{s.label}</p>
                    </div>
                  );
                }
              )}
            </div>

            {/* Queue table */}
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <div className="grid grid-cols-7 gap-2 bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-500 border-b border-slate-200">
                <span>ID</span>
                <span className="col-span-2">Patient</span>
                <span className="col-span-2">Procedure</span>
                <span>Payer</span>
                <span>Status</span>
              </div>
              {filteredQueue.length === 0 ? (
                <div className="px-3 py-6 text-center text-[11px] text-slate-400">
                  No matching PA requests found
                </div>
              ) : (
                filteredQueue.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-7 gap-2 px-3 py-2 text-[10px] text-slate-700 border-b border-slate-100 last:border-0 hover:bg-slate-50 items-center"
                  >
                    <span className="font-mono text-purple-600">{item.id}</span>
                    <span className="col-span-2 flex items-center gap-1">
                      <User className="h-2.5 w-2.5 text-slate-400" />
                      {item.patientName}
                    </span>
                    <span className="col-span-2 truncate">{item.procedure}</span>
                    <span className="truncate">{item.payer}</span>
                    <span>
                      <span
                        className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                          PA_STATUS_LABELS[item.status]?.bgColor || "bg-slate-100"
                        } ${PA_STATUS_LABELS[item.status]?.color || "text-slate-600"}`}
                      >
                        {PA_STATUS_LABELS[item.status]?.label || item.status}
                      </span>
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Educational note */}
            <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">
              <p className="text-[10px] font-medium text-purple-700">
                <ClipboardList className="mr-1 inline h-3 w-3" />
                Practice Tip
              </p>
              <p className="mt-1 text-[10px] text-purple-600">
                The queue dashboard shows real-time status of all prior authorization requests. In practice, you'd
                monitor this daily to identify stalled, denied, or expiring authorizations. Check urgent cases first.
              </p>
            </div>
          </div>
        )}

        {/* ─── TAB: PA FORM ─── */}
        {activeTab === "form" && (
          <div className="space-y-4">
            {!submitted ? (
              <>
                <div className="rounded-xl border border-purple-200 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-xs font-semibold text-purple-700">
                    New Prior Authorization Request
                  </p>
                  <div className="space-y-3">
                    {/* Procedure */}
                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-slate-500">
                        Procedure / Service <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={procedure}
                        onChange={(e) => setProcedure(e.target.value as ProcedureKey | "")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-purple-400"
                        required
                      >
                        <option value="">Select a procedure...</option>
                        {Object.entries(PA_PROCEDURES).map(([key, data]) => (
                          <option key={key} value={key}>
                            {data.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Payer */}
                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-slate-500">
                        Payer <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={payer}
                        onChange={(e) => setPayer(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-purple-400"
                      >
                        {["Medicare", "Medicaid", "Blue Cross Blue Shield", "United Healthcare", "Aetna", "Cigna"].map(
                          (p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Auto-pulled ICD / CPT */}
                    {procedureData && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[10px] font-medium text-slate-500">
                            ICD-10 Codes (auto-pulled)
                          </label>
                          <input
                            type="text"
                            value={icdCodes || procedureData.icdRanges.join(", ")}
                            onChange={(e) => setIcdCodes(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] outline-none focus:border-purple-400 text-slate-600"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-medium text-slate-500">
                            CPT Codes (auto-pulled)
                          </label>
                          <input
                            type="text"
                            value={cptCodes || procedureData.cptCodes.join(", ")}
                            onChange={(e) => setCptCodes(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] outline-none focus:border-purple-400 text-slate-600"
                          />
                        </div>
                      </div>
                    )}

                    {/* Clinical justification */}
                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-slate-500">
                        Clinical Justification
                      </label>
                      <textarea
                        value={clinicalJustification}
                        onChange={(e) => setClinicalJustification(e.target.value)}
                        placeholder="Describe why this procedure is medically necessary..."
                        rows={3}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] outline-none focus:border-purple-400 resize-none"
                      />
                    </div>

                    {/* Estimated auto-auth */}
                    {procedureData?.autoAuthThreshold && procedureData.autoAuthThreshold > 0 && (
                      <div className="rounded-lg bg-blue-50 p-2.5">
                        <p className="text-[10px] text-blue-700">
                          <CheckCircle2 className="mr-1 inline h-3 w-3" />
                          Estimated auto-auth threshold:{" "}
                          <span className="font-semibold">${procedureData.autoAuthThreshold.toLocaleString()}</span>{" "}
                          — procedures under this amount may be auto-approved by {payer}.
                        </p>
                      </div>
                    )}

                    {/* Patient demographics */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-[10px] font-medium text-slate-500">Patient Name</label>
                        <input
                          type="text"
                          defaultValue="[From Chart]"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] outline-none focus:border-purple-400 text-slate-400"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-medium text-slate-500">DOB</label>
                        <input
                          type="text"
                          defaultValue="[From Chart]"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] outline-none focus:border-purple-400 text-slate-400"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Ordering provider */}
                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-slate-500">Ordering Provider</label>
                      <input
                        type="text"
                        defaultValue="[From Chart]"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] outline-none focus:border-purple-400 text-slate-400"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!procedure}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-purple-500 disabled:bg-slate-300"
                >
                  Submit PA Request <ArrowRight className="h-3.5 w-3.5" />
                </button>

                {/* Pre-submit checklist */}
                {procedure && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-[10px] font-medium text-amber-700">
                      <AlertTriangle className="mr-1 inline h-3 w-3" />
                      Pre-submit Checklist
                    </p>
                    <ul className="mt-1.5 space-y-1 text-[10px] text-amber-600">
                      <li className="flex items-center gap-1.5">
                        {checkedCriteria[procedureData?.criteria[0]?.id || ""] ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-amber-400" />
                        )}
                        Switch to "Criteria" tab and verify all required criteria are met
                      </li>
                      <li className="flex items-center gap-1.5">
                        {procedureData?.stepTherapy ? (
                          stepTherapyComplete["0"] || Object.keys(stepTherapyComplete).length > 0 ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-amber-400" />
                          )
                        ) : (
                          <CheckCircle2 className="h-3 w-3 text-slate-400" />
                        )}
                        Check step therapy requirements in "Step Therapy" tab
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-slate-400" />
                        Review documentation list in "Docs Needed" tab
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-slate-400" />
                        Draft medical necessity letter in "Med. Necessity Letter" tab
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3">
                  <FileCheck className="h-8 w-8 text-green-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-green-700">Prior Authorization Submitted!</p>
                <p className="mt-1 text-xs text-slate-500">
                  {procedure ? PA_PROCEDURES[procedure as ProcedureKey]?.label || procedure : "Procedure"} — {payer}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Submitted at {new Date().toLocaleTimeString()}
                </p>

                {/* Timeline preview */}
                <div className="mt-6 w-full max-w-md rounded-lg border border-slate-200 bg-white p-4">
                  <p className="mb-3 text-[10px] font-semibold text-slate-600">What happens next?</p>
                  <div className="space-y-2">
                    {PA_TIMELINE_STEPS.map((step, i) => (
                      <div
                        key={step.key}
                        className={`flex items-center gap-2 ${
                          i <= timelineStep ? "text-purple-600" : "text-slate-300"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                            i <= timelineStep ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-300"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <div>
                          <p className={`text-[10px] font-medium ${i <= timelineStep ? "" : "text-slate-400"}`}>
                            {step.label}
                          </p>
                          <p className="text-[9px] text-slate-400">{step.description}</p>
                        </div>
                        {i < PA_TIMELINE_STEPS.length - 1 && (
                          <ChevronRight className="h-3 w-3 flex-shrink-0 text-slate-200" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-center gap-1">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <button
                        key={s}
                        onClick={() => setTimelineStep(s)}
                        className={`rounded px-2 py-0.5 text-[9px] border ${
                          timelineStep === s
                            ? "border-purple-300 bg-purple-50 text-purple-600"
                            : "border-slate-200 text-slate-400"
                        }`}
                      >
                        Step {s + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: CRITERIA CHECKLIST ─── */}
        {activeTab === "criteria" && (
          <div className="space-y-4">
            {procedure ? (
              <>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-700">
                      Insurance Criteria Checklist — {PA_PROCEDURES[procedure]?.label}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        criteriaMet.pct >= 80
                          ? "bg-green-100 text-green-700"
                          : criteriaMet.pct >= 50
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {criteriaMet.met}/{criteriaMet.total} criteria met
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3 h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        criteriaMet.pct >= 80
                          ? "bg-green-500"
                          : criteriaMet.pct >= 50
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${criteriaMet.pct}%` }}
                    />
                  </div>

                  {/* Criteria list */}
                  <div className="space-y-2">
                    {PA_PROCEDURES[procedure]?.criteria.map((criterion) => (
                      <label
                        key={criterion.id}
                        className={`flex items-start gap-2 rounded-lg border p-2.5 cursor-pointer transition-colors ${
                          checkedCriteria[criterion.id]
                            ? "border-green-200 bg-green-50"
                            : "border-slate-200 hover:border-purple-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!checkedCriteria[criterion.id]}
                          onChange={() => toggleCriterion(criterion.id)}
                          className="mt-0.5 h-3 w-3 accent-purple-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-medium text-slate-700">{criterion.text}</span>
                            {criterion.required && (
                              <span className="rounded bg-red-100 px-1 py-0.5 text-[8px] font-medium text-red-600">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[9px] text-slate-400">
                            Typical evidence: <span className="text-slate-500">{criterion.typicalEvidence}</span>
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">
                  <p className="text-[10px] font-medium text-purple-700">
                    <ClipboardList className="mr-1 inline h-3 w-3" />
                    Practice Tip
                  </p>
                  <p className="mt-1 text-[10px] text-purple-600">
                    Insurers use published criteria (CMS NCD/LCD, MCG, InterQual) to evaluate PA requests. Check
                    each criterion against the patient's chart BEFORE submitting. Missing even one required criterion
                    can result in a denial. Completing &gt;80% of criteria significantly improves approval odds.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ListChecks className="mb-2 h-8 w-8 text-slate-300" />
                <p className="text-xs text-slate-400">Select a procedure in the PA Form tab first</p>
                <p className="text-[10px] text-slate-300">Each procedure has unique criteria requirements</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: CLINICAL DOCS MAPPER ─── */}
        {activeTab === "docs" && (
          <div className="space-y-4">
            {procedure ? (
              <>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Stethoscope className="h-4 w-4 text-purple-600" />
                    <p className="text-xs font-semibold text-slate-700">
                      Required Documentation — {PA_PROCEDURES[procedure]?.label}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {PA_PROCEDURES[procedure]?.requiredDocs.map((doc, i) => {
                      const icons = [
                        <FileText key="ft" className="h-3.5 w-3.5 text-blue-500" />,
                        <FileCheck key="fc" className="h-3.5 w-3.5 text-green-500" />,
                        <ClipboardList key="cl" className="h-3.5 w-3.5 text-amber-500" />,
                        <FlaskConical key="fr" className="h-3.5 w-3.5 text-purple-500" />,
                        <Search key="sr" className="h-3.5 w-3.5 text-cyan-500" />,
                        <User key="ur" className="h-3.5 w-3.5 text-slate-500" />,
                      ];
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2.5"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                            {icons[i % icons.length]}
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-medium text-slate-700">{doc}</p>
                            <p className="text-[9px] text-slate-400">
                              {i === 0
                                ? "Standard clinical summary attached to most PA submissions"
                                : i === 1
                                  ? "Documents failed conservative management"
                                  : i === 2
                                    ? "Objective evidence supporting diagnosis"
                                    : "Lab values validating medical necessity"}
                            </p>
                          </div>
                          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[8px] font-medium text-purple-600">
                            Attach
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Documentation completeness */}
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-[10px] font-semibold text-slate-600">Documentation Checklist</p>
                  <div className="mt-2 space-y-1.5">
                    {["H&P note", "Progress notes (last 3 visits)", "Imaging reports", "Lab results", "Screening results"].map(
                      (item, i) => (
                        <label key={i} className="flex items-center gap-2">
                          <input type="checkbox" className="h-3 w-3 accent-purple-600" />
                          <span className="text-[10px] text-slate-600">{item}</span>
                        </label>
                      )
                    )}
                  </div>
                  <p className="mt-2 text-[9px] text-slate-400">
                    <AlertTriangle className="mr-1 inline h-2.5 w-2.5" />
                    Missing documentation is the #1 reason for PA delays
                  </p>
                </div>

                {/* Education */}
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">
                  <p className="text-[10px] font-medium text-purple-700">
                    <ClipboardList className="mr-1 inline h-3 w-3" />
                    RCM Pro Tip
                  </p>
                  <p className="mt-1 text-[10px] text-purple-600">
                    Attach the RIGHT documentation for the specific procedure — insurers are looking for specific
                    evidence. An MRI for back pain needs physical exam findings and PT records. A TKA needs X-ray
                    reports and conservative therapy documentation. Bundling irrelevant documents wastes time.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Stethoscope className="mb-2 h-8 w-8 text-slate-300" />
                <p className="text-xs text-slate-400">Select a procedure in the PA Form tab first</p>
                <p className="text-[10px] text-slate-300">Each procedure has unique documentation requirements</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: STEP THERAPY TRACKER ─── */}
        {activeTab === "step-therapy" && (
          <div className="space-y-4">
            {procedure && PA_PROCEDURES[procedure]?.stepTherapy ? (
              <>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                    <p className="text-xs font-semibold text-slate-700">
                      Step Therapy Requirements — {PA_PROCEDURES[procedure]?.label}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {PA_PROCEDURES[procedure]?.stepTherapy?.map((step, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border p-3 ${
                          stepTherapyComplete[String(i)]
                            ? "border-green-200 bg-green-50"
                            : "border-amber-200 bg-amber-50"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                              stepTherapyComplete[String(i)]
                                ? "bg-green-200 text-green-700"
                                : "bg-amber-200 text-amber-700"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] font-medium text-slate-700">{step.requirement}</p>
                              <span className="rounded bg-white px-1.5 py-0.5 text-[8px] font-medium text-slate-500">
                                {step.typicalDuration}
                              </span>
                            </div>
                            {step.alternatives.length > 0 && (
                              <p className="mt-0.5 text-[9px] text-slate-500">
                                Alternatives: {step.alternatives.join(", ")}
                              </p>
                            )}
                          </div>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!stepTherapyComplete[String(i)]}
                              onChange={() => toggleStepTherapy(i)}
                              className="h-3 w-3 accent-purple-600"
                            />
                            <span className="text-[9px] text-slate-500">
                              {stepTherapyComplete[String(i)] ? "Complete" : "Mark done"}
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Step therapy progress */}
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 p-2.5">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-medium text-slate-500">Step Therapy Progress</span>
                        <span className="text-[9px] font-medium text-purple-600">
                          {Object.keys(stepTherapyComplete).filter((k) => stepTherapyComplete[k]).length}/
                          {PA_PROCEDURES[procedure]?.stepTherapy?.length || 0}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200">
                        <div
                          className="h-1.5 rounded-full bg-purple-500 transition-all"
                          style={{
                            width: `${((Object.keys(stepTherapyComplete).filter((k) => stepTherapyComplete[k]).length /
                              (PA_PROCEDURES[procedure]?.stepTherapy?.length || 1)) *
                              100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">
                  <p className="text-[10px] font-medium text-purple-700">
                    <ArrowRight className="mr-1 inline h-3 w-3" />
                    What is Step Therapy?
                  </p>
                  <p className="mt-1 text-[10px] text-purple-600">
                    Step therapy requires patients to try lower-cost alternatives before the insurer will cover
                    a more expensive treatment. Failing step therapy is the #1 reason biologics and TKA are
                    denied. Document each step failure thoroughly — including dates, duration, and clinical response
                    — to support an override or appeal.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ArrowRight className="mb-2 h-8 w-8 text-slate-300" />
                {!procedure ? (
                  <>
                    <p className="text-xs text-slate-400">Select a procedure in the PA Form tab first</p>
                    <p className="text-[10px] text-slate-300">Some procedures have step therapy requirements</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-slate-400">No step therapy requirements for this procedure</p>
                    <p className="text-[10px] text-slate-300">
                      {PA_PROCEDURES[procedure]?.label} does not require step therapy
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: MEDICAL NECESSITY LETTER ─── */}
        {activeTab === "letter" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-purple-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <p className="text-xs font-semibold text-slate-700">Medical Necessity Letter Generator</p>
              </div>

              {/* Patient info fields */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-slate-500">Patient Name</label>
                  <input
                    type="text"
                    value={letterPatientName}
                    onChange={(e) => setLetterPatientName(e.target.value)}
                    placeholder="Enter patient name..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-slate-500">Diagnosis</label>
                  <input
                    type="text"
                    value={letterDiagnosis}
                    onChange={(e) => setLetterDiagnosis(e.target.value)}
                    placeholder="Enter diagnosis..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Letter template */}
              {procedure ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold text-slate-600 mb-2">
                    Letter Template — {PA_PROCEDURES[procedure]?.label}
                  </p>
                  <div className="whitespace-pre-wrap text-[10px] text-slate-700 leading-relaxed">
                    <p className="mb-1">
                      <strong>Date:</strong> {new Date().toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <strong>RE:</strong> Prior Authorization Request — {PA_PROCEDURES[procedure]?.label}
                    </p>
                    <p className="mb-1">
                      <strong>Patient:</strong> {letterPatientName || "[Patient Name]"}
                    </p>
                    <p className="mb-1">
                      <strong>Diagnosis:</strong> {letterDiagnosis || "[Diagnosis]"} — {PA_PROCEDURES[procedure]?.icdRanges[0] || ""}
                    </p>
                    <p className="mb-1">
                      <strong>Procedure:</strong> {PA_PROCEDURES[procedure]?.label} —{" "}
                      {PA_PROCEDURES[procedure]?.cptCodes.join(", ")}
                    </p>
                    <p className="mb-1">
                      <strong>Payer:</strong> {payer}
                    </p>
                    <hr className="my-2 border-slate-200" />
                    <p className="mb-1 font-semibold text-purple-700">Sections to Include:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      {PA_PROCEDURES[procedure]?.letterTemplateSections.map((section, i) => (
                        <li key={i} className="text-[10px] text-slate-600">
                          {section}
                        </li>
                      ))}
                    </ol>
                    <hr className="my-2 border-slate-200" />
                    <p className="text-[9px] text-slate-400 italic">
                      Copy this template into your PA letter. Expand each section with patient-specific details
                      from the clinical chart.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-[10px] text-amber-700">
                    <AlertTriangle className="mr-1 inline h-3 w-3" />
                    Select a procedure in the PA Form tab to generate a specific letter template
                  </p>
                </div>
              )}

              {/* Education */}
              <div className="mt-3 rounded-lg border border-purple-100 bg-purple-50 p-3">
                <p className="text-[10px] font-medium text-purple-700">
                  <BookOpen className="mr-1 inline h-3 w-3" />
                  Writing an Effective Medical Necessity Letter
                </p>
                <ul className="mt-1 space-y-0.5 text-[10px] text-purple-600">
                  <li>• Be specific — include dates, scores, measurements</li>
                  <li>• Reference payer-specific medical policy numbers</li>
                  <li>• Explain why alternatives were tried and failed</li>
                  <li>• Describe risk of NOT performing the procedure</li>
                  <li>• Keep it concise — one page is ideal</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: COMMON ERRORS ─── */}
        {activeTab === "errors" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <p className="text-xs font-semibold text-slate-700">Common Prior Auth Errors & Fixes</p>
              </div>
              <div className="space-y-2">
                {PA_COMMON_ERRORS.map((error, i) => (
                  <div key={i} className="rounded-lg border border-red-100 bg-red-50 p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-red-200 px-1.5 py-0.5 text-[9px] font-medium text-red-700">
                        {error.field}
                      </span>
                      <span className="text-[10px] font-medium text-red-700">{error.error}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[9px] text-green-600">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Fix: {error.fix}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Denial prevention */}
            <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">
              <p className="text-[10px] font-medium text-purple-700">
                <ClipboardList className="mr-1 inline h-3 w-3" />
                Denial Prevention Checklist
              </p>
              <ul className="mt-1 space-y-0.5 text-[10px] text-purple-600">
                <li className="flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Verify patient benefits include the requested procedure
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Check payer-specific medical policy before submitting
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Complete step therapy requirements or document exemptions
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Attach ALL required documentation from the Docs Needed tab
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Use the correct ICD-10 codes (payer-specific mappings)
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Submit within the correct timeframe (not retroactive)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

