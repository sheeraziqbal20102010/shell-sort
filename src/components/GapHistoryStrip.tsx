import React from 'react';
import { ArrowRight, CheckCircle2, CircleDot, Clock } from 'lucide-react';
import { getGapSequence } from '../utils/shellSortGenerator';

interface GapHistoryStripProps {
  arrayLength: number;
  currentGap: number;
  isComplete: boolean;
}

export const GapHistoryStrip: React.FC<GapHistoryStripProps> = ({
  arrayLength,
  currentGap,
  isComplete,
}) => {
  const gapSequence = getGapSequence(arrayLength);

  return (
    <div className="w-full flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mb-4 text-xs transition-colors shadow-xs">
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Gap Progression:
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline font-mono">
          (floor(n/2) → ... → 1)
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {gapSequence.map((gapVal, index) => {
          let status: 'completed' | 'active' | 'upcoming' = 'upcoming';

          if (isComplete) {
            status = 'completed';
          } else if (gapVal > currentGap) {
            status = 'completed';
          } else if (gapVal === currentGap) {
            status = 'active';
          } else {
            status = 'upcoming';
          }

          return (
            <React.Fragment key={gapVal}>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono font-semibold transition-all ${
                  status === 'active'
                    ? 'bg-blue-600 text-white shadow-xs border border-blue-500 ring-2 ring-blue-500/20'
                    : status === 'completed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                {status === 'active' && <CircleDot className="w-3.5 h-3.5 text-white animate-pulse" />}
                {status === 'upcoming' && <Clock className="w-3 h-3 text-slate-400" />}
                <span>Gap {gapVal}</span>
                {status === 'active' && (
                  <span className="text-[10px] uppercase font-sans font-bold tracking-wider px-1 bg-blue-800/80 text-white rounded">
                    Active
                  </span>
                )}
              </div>

              {index < gapSequence.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
