/**
 * RightPaneleCW — Patient Summary Side Panel
 *
 * Inspiration: eClinicalWorks (eCW) right-side summary panel.
 * eCW is known for its compact, always-visible patient summary
 * panel that shows key clinical data (allergies, meds, problems,
 * vitals) without navigating away from the main chart. This
 * component replicates that "at-a-glance" sidebar experience
 * for quick clinical decision support.
 */

import { Activity, AlertTriangle, Pill, Stethoscope } from "lucide-react";
import type { Patient } from "../../store/patientStore";

interface RightPaneleCWProps {
  patient: Patient | null;
}

export function RightPaneleCW({ patient }: RightPaneleCWProps) {
  if (!patient) {
    return (
      <aside className="w-72 shrink-0 border-l border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-400 italic">No patient selected</p>
      </aside>
    );
  }

  return (
    <aside className="w-72 shrink-0 border-l border-slate-200 bg-slate-50 overflow-y-auto">
      {/* Patient Demographics Header */}
      <div className="border-b border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold text-slate-800">
          {patient.firstName} {patient.lastName}
        </h2>
        <p className="text-sm text-slate-500">
          {patient.gender} | {patient.age} yrs | DOB:{" "}
          {new Date(patient.dateOfBirth).toLocaleDateString()}
        </p>
        <p className="text-xs text-slate-400">MRN: {patient.mrn}</p>
        {patient.preferredName && (
          <p className="text-xs text-blue-600">
            Also known as: {patient.preferredName}
          </p>
        )}
      </div>

      {/* Chief Complaint */}
      <div className="border-b border-slate-200 bg-amber-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
          Chief Complaint
        </p>
        <p className="text-sm font-medium text-amber-900">
          {patient.chiefComplaint}
        </p>
      </div>

      {/* Vitals Snapshot */}
      <div className="border-b border-slate-200 p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Latest Vitals
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
          <span className="text-slate-500">BP:</span>
          <span className="font-medium text-slate-800">
            {patient.vitals.bloodPressure}
          </span>
          <span className="text-slate-500">HR:</span>
          <span className="font-medium text-slate-800">
            {patient.vitals.heartRate} bpm
          </span>
          <span className="text-slate-500">Temp:</span>
          <span className="font-medium text-slate-800">
            {patient.vitals.temperature}°F
          </span>
          <span className="text-slate-500">RR:</span>
          <span className="font-medium text-slate-800">
            {patient.vitals.respiratoryRate}
          </span>
          <span className="text-slate-500">SpO2:</span>
          <span className="font-medium text-slate-800">
            {patient.vitals.oxygenSaturation}%
          </span>
        </div>
      </div>

      {/* Active Problems */}
      <div className="border-b border-slate-200 p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <Stethoscope className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Problems
          </span>
        </div>
        <ul className="space-y-1">
          {patient.problems.map((problem, i) => (
            <li
              key={i}
              className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-800"
            >
              {problem}
            </li>
          ))}
        </ul>
      </div>

      {/* Medication Alerts */}
      <div className="border-b border-slate-200 p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <Pill className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Medications ({patient.medications.filter((m) => m.status === "active").length})
          </span>
        </div>
        <ul className="space-y-1">
          {patient.medications
            .filter((m) => m.status === "active")
            .slice(0, 5)
            .map((med) => (
              <li
                key={med.id}
                className="flex items-start gap-1 text-xs text-slate-700"
              >
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                <span>
                  {med.name} {med.dosage}, {med.frequency}
                </span>
              </li>
            ))}
        </ul>
      </div>

      {/* Allergies */}
      <div className="border-b border-slate-200 p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Allergies
          </span>
        </div>
        {patient.allergies.length > 0 ? (
          <ul className="space-y-1">
            {patient.allergies.map((alg) => (
              <li key={alg.id}>
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                    alg.severity === "severe"
                      ? "bg-red-100 text-red-800"
                      : alg.severity === "moderate"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {alg.allergen} ({alg.severity})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-green-600">No known allergies</p>
        )}
      </div>

      {/* Insurance & PCP Footer */}
      <div className="border-t border-slate-200 bg-white p-3 text-xs text-slate-500">
        <p>
          <span className="font-medium text-slate-600">PCP:</span>{" "}
          {patient.primaryCareProvider}
        </p>
        <p>
          <span className="font-medium text-slate-600">Insurance:</span>{" "}
          {patient.insurance}
        </p>
      </div>
    </aside>
  );
}