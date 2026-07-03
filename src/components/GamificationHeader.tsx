/**
 * GamificationHeader — XP Meter, Streak & Badges
 *
 * Shows student level, XP bar, consecutive error-free
 * action counter, and expandable achievement badges.
 */

import { useState } from "react";
import { Zap, Star, Award, Medal, Trophy, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

const BADGES = [
  { id: "modifier-master", label: "Modifier Master", icon: <Award className="h-3.5 w-3.5" />, unlocked: false },
  { id: "prior-auth-expert", label: "Prior-Auth Expert", icon: <Medal className="h-3.5 w-3.5" />, unlocked: false },
  { id: "zero-balance", label: "Zero-Balance Closer", icon: <Trophy className="h-3.5 w-3.5" />, unlocked: false },
];

interface GamificationHeaderProps {
  xp: number;
  streak: number;
  level: number;
}

export function GamificationHeader({ xp = 0, streak = 0, level = 1 }: GamificationHeaderProps) {
  const [showBadges, setShowBadges] = useState(false);
  const xpForNextLevel = level * 100;
  const xpPercent = Math.min(100, Math.round((xp / xpForNextLevel) * 100));

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-gradient-to-r from-indigo-50/50 to-white px-3 py-2 shadow-sm">
      {/* Level */}
      <div className="flex items-center gap-1.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
          {level}
        </div>
        <span className="text-[10px] font-medium text-slate-500">Lvl</span>
      </div>

      {/* XP Bar */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-400">XP</span>
          <span className="text-[9px] font-medium text-slate-500">{xp}/{xpForNextLevel}</span>
        </div>
        <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${xpPercent}%` }} />
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
          <Zap className="h-3 w-3 text-amber-500" />
          <span className="text-[10px] font-bold text-amber-700">{streak}</span>
        </div>
      )}

      {/* Badges Toggle */}
      <div className="relative">
        <button onClick={() => setShowBadges(!showBadges)}
          className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[10px] text-slate-500 hover:bg-slate-100 transition-colors">
          <Star className="h-3 w-3" /> Badges {showBadges ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        {showBadges && (
          <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-slate-200/80 bg-white p-2 shadow-lg">
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500">Achievement Badges</p>
            <div className="space-y-1">
              {BADGES.map(b => (
                <div key={b.id} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] ${
                  b.unlocked ? "bg-amber-50 text-amber-800" : "bg-slate-50 text-slate-400"
                }`}>
                  <span className={b.unlocked ? "text-amber-600" : "text-slate-300"}>{b.icon}</span>
                  {b.label}
                  {!b.unlocked && <span className="ml-auto text-[8px] text-slate-400">🔒</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}