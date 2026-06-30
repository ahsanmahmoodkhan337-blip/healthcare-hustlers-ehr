/**
 * DailySchedule — Placeholder Schedule View
 *
 * Inspiration: Epic Hyperspace schedule view.
 * Epic's schedule module shows today's appointments in a grid/calendar
 * layout with patient names, visit types, and time slots. This
 * placeholder will be replaced with the full interactive version
 * in a later task.
 */

import { CalendarDays, Clock, User } from "lucide-react";

// Placeholder appointment data
const PLACEHOLDER_APPOINTMENTS = [
  { time: "08:00", patient: "Emily Chen", type: "Follow-up", provider: "Dr. Resident", status: "completed" },
  { time: "09:00", patient: "Robert Johnson", type: "COPD Check", provider: "Dr. Resident", status: "in-progress" },
  { time: "09:30", patient: "Maria Garcia", type: "Prenatal 32wk", provider: "Dr. Resident", status: "scheduled" },
  { time: "10:15", patient: "James Wilson", type: "New Patient", provider: "Dr. Resident", status: "scheduled" },
  { time: "11:00", patient: "Sarah Thompson", type: "Medication Review", provider: "Dr. Resident", status: "scheduled" },
  { time: "13:00", patient: "David Kim", type: "Lab Results", provider: "Dr. Resident", status: "scheduled" },
  { time: "14:00", patient: "Lisa Brown", type: "Follow-up", provider: "Dr. Resident", status: "scheduled" },
  { time: "15:30", patient: "Michael Davis", type: "Annual Physical", provider: "Dr. Resident", status: "scheduled" },
];

export function DailySchedule() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-1 flex-col p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Daily Schedule</h2>
          <p className="text-sm text-slate-500">
            <CalendarDays className="mr-1 inline-block h-3.5 w-3.5" />
            {today}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-700">
          <Clock className="h-4 w-4" />
          <span className="font-medium">
            {PLACEHOLDER_APPOINTMENTS.filter((a) => a.status === "scheduled").length} remaining
          </span>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="clinical-card flex-1">
        <table className="clinical-table">
          <thead>
            <tr>
              <th className="w-20">Time</th>
              <th>Patient</th>
              <th className="hidden md:table-cell">Type</th>
              <th className="hidden lg:table-cell">Provider</th>
              <th className="w-28">Status</th>
            </tr>
          </thead>
          <tbody>
            {PLACEHOLDER_APPOINTMENTS.map((apt, i) => (
              <tr key={i} className={apt.status === "in-progress" ? "bg-blue-50/50" : ""}>
                <td className="font-medium text-slate-700">{apt.time}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>{apt.patient}</span>
                  </div>
                </td>
                <td className="hidden text-slate-500 md:table-cell">{apt.type}</td>
                <td className="hidden text-slate-500 lg:table-cell">{apt.provider}</td>
                <td>
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${
                      apt.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : apt.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {apt.status === "completed"
                      ? "Complete"
                      : apt.status === "in-progress"
                        ? "In Progress"
                        : "Scheduled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-400">
          Full interactive schedule view coming soon — calendar grid, drag-and-drop,
          and patient check-in workflow.
        </div>
      </div>
    </div>
  );
}