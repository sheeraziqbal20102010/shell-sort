import React from 'react';
import { Activity, ArrowLeftRight, GitCommit, Layers, Variable } from 'lucide-react';
import { SortStep } from '../types';

interface StatsBarProps {
  currentStep: SortStep;
  totalSteps: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercent = totalSteps > 1 ? (currentStep.stepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 mb-4 shadow-xs space-y-4 transition-colors">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Gap Badge */}
        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl p-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider font-bold text-blue-700 dark:text-blue-300 truncate">Current Gap</div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono flex items-center gap-1.5 flex-wrap">
              <span>{currentStep.gap > 0 ? `Gap = ${currentStep.gap}` : 'Sorted'}</span>
              {currentStep.gap > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-sans font-bold">
                  {currentStep.gap} apart
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Comparisons */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 truncate">Comparisons</div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {currentStep.stats.comparisons}
            </div>
          </div>
        </div>

        {/* Shifts */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 truncate">Shifts</div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {currentStep.stats.shifts}
            </div>
          </div>
        </div>

        {/* Step Counter */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <GitCommit className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 truncate">Algorithm Step</div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {currentStep.stepIndex + 1} <span className="text-xs text-slate-400 font-normal">/ {totalSteps}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Active State Variables */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Variable className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              {currentStep.gap > 0 ? `gap: ${currentStep.gap}` : 'gap: 0'} | {currentStep.i !== null ? `i: ${currentStep.i}` : 'i: -'} | {currentStep.j !== null ? `j: ${currentStep.j}` : 'j: -'} | {currentStep.temp !== null ? `temp: ${currentStep.temp}` : 'temp: -'}
            </span>
          </span>
          <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
