/**
 * ActiveProgressNote — Placeholder Progress Note Editor
 *
 * Inspiration: Epic Hyperspace progress note editor.
 * Epic's note editor allows clinicians to write structured
 * clinical notes (SOAP, H&P, Progress Note) directly within
 * the chart. This placeholder provides a basic text area and
 * note structure that will be expanded with interactive SOAP
 * note templates, auto-population, and structured data entry
 * in a later task.
 */

import { FileEdit, Save, Eye, History } from "lucide-react";

interface ActiveProgressNoteProps {
  patientName?: string;
}

export function ActiveProgressNote({ patientName }: ActiveProgressNoteProps) {
  return (
    <div className="flex flex-1 flex-col p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileEdit className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-800">Active Progress Note</h2>
            <p className="text-sm text-slate-500">
              {patientName ? `Encounter note for ${patientName}` : "No patient selected"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50">
            <History className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">History</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50">
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-500">
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Note Editor */}
      <div className="clinical-card flex flex-1 flex-col">
        {/* Note metadata bar */}
        <div className="mb-3 flex flex-wrap gap-4 border-b border-slate-100 pb-3 text-xs text-slate-500">
          <div>
            <span className="font-medium text-slate-600">Date:</span>{" "}
            {new Date().toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium text-slate-600">Author:</span> Dr. Resident
          </div>
          <div>
            <span className="font-medium text-slate-600">Type:</span> Progress Note
          </div>
          <div>
            <span className="font-medium text-slate-600">Status:</span>{" "}
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">
              Draft
            </span>
          </div>
        </div>

        {/* SOAP Note Template */}
        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Subjective */}
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
              Subjective (S)
            </p>
            <textarea
              placeholder="Patient's chief complaint, history of present illness, review of systems..."
              className="min-h-[100px] w-full resize-none rounded border-0 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
            />
          </div>

          {/* Objective */}
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-600">
              Objective (O)
            </p>
            <textarea
              placeholder="Vital signs, physical exam findings, lab/imaging results..."
              className="min-h-[100px] w-full resize-none rounded border-0 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
            />
          </div>

          {/* Assessment */}
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-600">
              Assessment (A)
            </p>
            <textarea
              placeholder="Diagnoses, differentials, clinical impression..."
              className="min-h-[100px] w-full resize-none rounded border-0 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
            />
          </div>

          {/* Plan */}
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-purple-600">
              Plan (P)
            </p>
            <textarea
              placeholder="Medication changes, orders, referrals, follow-up plan..."
              className="min-h-[100px] w-full resize-none rounded border-0 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
            />
          </div>
        </div>

        {/* Full text area */}
        <div className="flex-1 rounded-lg border border-slate-200 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Free-Text Notes
          </p>
          <textarea
            placeholder="Additional notes, instructions, follow-up details..."
            className="min-h-[120px] w-full resize-none rounded border-0 bg-transparent text-sm text-slate-700 placeholder-slate-300 outline-none"
          />
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-400">
          Full interactive SOAP note editor coming soon — structured templates,
          smart auto-population, SMART phrases, and note signing workflow.
        </div>
      </div>
    </div>
  );
}