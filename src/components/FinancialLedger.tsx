/**
 * FinancialLedger — Right Sidebar Financial KPIs
 *
 * Shows billing performance metrics: clean claim rate,
 * total billed, collected, denied, days in A/R.
 * Ring chart/progress bar for Clean Claim Rate.
 */

import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Activity, PiggyBank } from "lucide-react";

interface FinancialLedgerProps {
  totalBilled: number;
  totalCollected: number;
  totalDenied: number;
  daysInAR: number;
}

export function FinancialLedger({ totalBilled, totalCollected, totalDenied, daysInAR }: FinancialLedgerProps) {
  const cleanClaimRate = totalBilled > 0 ? Math.round(((totalBilled - totalDenied) / totalBilled) * 100) : 100;
  const netCollectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const rateColor = cleanClaimRate >= 90 ? "text-emerald-600" : cleanClaimRate >= 75 ? "text-amber-600" : "text-rose-600";
  const barColor = cleanClaimRate >= 90 ? "bg-emerald-500" : cleanClaimRate >= 75 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <PiggyBank className="h-4 w-4 text-indigo-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Financial Ledger</span>
      </div>

      {/* Clean Claim Rate Ring */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase text-slate-500">Clean Claim Rate</span>
          <span className={`text-lg font-bold ${rateColor}`}>{cleanClaimRate}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${cleanClaimRate}%` }} />
        </div>
        {cleanClaimRate < 90 && (
          <p className="mt-1 flex items-center gap-1 text-[10px] text-amber-600">
            <AlertTriangle className="h-3 w-3" /> Below 90% threshold
          </p>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <DollarSign className="h-3 w-3" /> Total Billed
          </div>
          <p className="mt-0.5 text-sm font-bold text-slate-800">${totalBilled.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <TrendingUp className="h-3 w-3 text-emerald-600" /> Collected
          </div>
          <p className="mt-0.5 text-sm font-bold text-emerald-700">${totalCollected.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <TrendingDown className="h-3 w-3 text-rose-600" /> Denied
          </div>
          <p className="mt-0.5 text-sm font-bold text-rose-700">${totalDenied.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Activity className="h-3 w-3 text-indigo-600" /> Days in A/R
          </div>
          <p className="mt-0.5 text-sm font-bold text-indigo-700">{daysInAR}</p>
        </div>
      </div>

      {/* Net Collection Rate */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase text-slate-500">Net Collection Rate</span>
          <span className="text-sm font-bold text-slate-800">{netCollectionRate}%</span>
        </div>
      </div>
    </div>
  );
}