/**
 * InBasket — Placeholder Alert Center / InBasket View
 *
 * Inspiration: Epic Hyperspace InBasket.
 * Epic's InBasket is the central messaging and alert hub where
 * clinicians receive lab results, referrals, patient messages,
 * and task assignments. This placeholder will be expanded with
 * full interactive functionality in a later task.
 */

import { Inbox, AlertTriangle, FileText, MessageSquare, Pill, Beaker } from "lucide-react";

// Placeholder alert data
const PLACEHOLDER_ALERTS = [
  {
    id: "alert-1",
    type: "lab",
    icon: <Beaker className="h-4 w-4" />,
    title: "Critical Lab Result",
    patient: "Robert Johnson",
    detail: "BNP: 850 pg/mL — Elevated",
    priority: "critical",
    time: "2 min ago",
  },
  {
    id: "alert-2",
    type: "medication",
    icon: <Pill className="h-4 w-4" />,
    title: "Medication Renewal Request",
    patient: "Jane Doe",
    detail: "Lisinopril 10 mg — renewal due in 3 days",
    priority: "high",
    time: "15 min ago",
  },
  {
    id: "alert-3",
    type: "message",
    icon: <MessageSquare className="h-4 w-4" />,
    title: "New Message from Dr. Chen",
    patient: "Emily Chen",
    detail: "Requesting specialist referral for asthma management",
    priority: "medium",
    time: "1 hour ago",
  },
  {
    id: "alert-4",
    type: "result",
    icon: <FileText className="h-4 w-4" />,
    title: "Lab Results Available",
    patient: "Maria Garcia",
    detail: "CBC and Ferritin results ready for review",
    priority: "medium",
    time: "2 hours ago",
  },
  {
    id: "alert-5",
    type: "alert",
    icon: <AlertTriangle className="h-4 w-4" />,
    title: "Allergy Warning",
    patient: "John Smith",
    detail: "Flagged: Codeine allergy — use alternative analgesia",
    priority: "high",
    time: "3 hours ago",
  },
  {
    id: "alert-6",
    type: "message",
    icon: <MessageSquare className="h-4 w-4" />,
    title: "Patient Portal Message",
    patient: "David Kim",
    detail: "Question about recent medication change",
    priority: "low",
    time: "Yesterday",
  },
];

export function InBasket() {
  const priorityColors: Record<string, string> = {
    critical: "border-l-red-500 bg-red-50",
    high: "border-l-amber-500 bg-amber-50",
    medium: "border-l-blue-500 bg-blue-50",
    low: "border-l-slate-300 bg-white",
  };

  const priorityBadge: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    high: "bg-amber-100 text-amber-700",
    medium: "bg-blue-100 text-blue-700",
    low: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="flex flex-1 flex-col p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Inbox className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-800">InBasket / Alert Center</h2>
            <p className="text-sm text-slate-500">
              {PLACEHOLDER_ALERTS.filter((a) => a.priority === "critical" || a.priority === "high").length} items requiring attention
            </p>
          </div>
        </div>
      </div>

      {/* Alert list */}
      <div className="clinical-card flex-1">
        <div className="space-y-2">
          {PLACEHOLDER_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-lg border-l-4 p-3 transition-colors hover:shadow-sm ${priorityColors[alert.priority]}`}
            >
              <div className="mt-0.5 text-slate-400">{alert.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">
                    {alert.title}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${
                      priorityBadge[alert.priority]
                    }`}
                  >
                    {alert.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-600">{alert.patient}</span> —{" "}
                  {alert.detail}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-400">
          Full InBasket coming soon — message threading, result tracking,
          task management, and alert acknowledgment workflow.
        </div>
      </div>
    </div>
  );
}