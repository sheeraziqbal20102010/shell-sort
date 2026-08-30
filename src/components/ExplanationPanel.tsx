import React from 'react';
import { SortStep } from '../types';
import { Info, Layers, ArrowLeftRight, Activity, CheckCircle, Sparkles } from 'lucide-react';

interface ExplanationPanelProps {
  currentStep: SortStep;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ currentStep }) => {
  const getStepIcon = () => {
    switch (currentStep.type) {
      case 'gap_change':
        return <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'outer_loop':
        return <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'pick_temp':
        return <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'compare':
        return <ArrowLeftRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'shift':
        return <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'insert':
        return <CheckCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Info className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getStepBadge = () => {
    switch (currentStep.type) {
      case 'gap_change':
        return { label: 'Gap Reduced', bg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/60' };
      case 'outer_loop':
        return { label: 'Sub-array Pass', bg: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/60' };
      case 'pick_temp':
        return { label: 'Hold Temp', bg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700/60' };
      case 'compare':
        return { label: 'Gapped Comparison', bg: 'bg-orange-50 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700/60' };
      case 'shift':
        return { label: 'Shift Element', bg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700/60' };
      case 'insert':
        return { label: 'Insert Element', bg: 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/60' };
      case 'completed':
        return { label: 'Sorted!', bg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/60' };
      default:
        return { label: 'Initialization', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const badge = getStepBadge();

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs mb-4 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {getStepIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                {badge.label}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Line {currentStep.cppLine}
              </span>
            </div>
          </div>
        </div>

        {/* Condition Check Pill if in comparison step */}
        {currentStep.comparisonResult && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs">
            <span className="text-slate-500 dark:text-slate-400">arr[{currentStep.comparisonResult.leftIdx}] &gt; temp:</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {currentStep.comparisonResult.leftVal} &gt; {currentStep.comparisonResult.tempVal}
            </span>
            <span
              className={`font-black px-1.5 py-0.2 rounded text-[11px] ${
                currentStep.comparisonResult.conditionMet
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                  : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
              }`}
            >
              {currentStep.comparisonResult.conditionMet ? 'TRUE (Shift)' : 'FALSE (Stop)'}
            </span>
          </div>
        )}
      </div>

      {/* Main explanation content */}
      <div className="space-y-2">
        <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
          {currentStep.explanation}
        </p>

        {currentStep.subExplanation && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            💡 {currentStep.subExplanation}
          </p>
        )}
      </div>
    </div>
  );
};
