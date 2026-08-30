import React, { useEffect, useRef } from 'react';
import { Code2, Play, Check, Flame } from 'lucide-react';
import { SortStep } from '../types';

interface CodePanelProps {
  currentStep: SortStep;
}

interface CodeLine {
  lineNum: number;
  code: string;
  comment?: string;
  indent: number;
}

const CPP_CODE_LINES: CodeLine[] = [
  { lineNum: 1, code: 'void shellSort(int arr[], int n) {', indent: 0 },
  { lineNum: 2, code: 'for (int gap = n / 2; gap > 0; gap /= 2) {', comment: '// Step: Shrink the gap', indent: 1 },
  { lineNum: 3, code: 'for (int i = gap; i < n; i++) {', comment: '// Step: Start gapped insertion sort', indent: 2 },
  { lineNum: 4, code: 'int temp = arr[i];', comment: '// Step: Hold current value in temp', indent: 3 },
  { lineNum: 5, code: 'int j = i;', comment: '// Step: Initialize pointer j', indent: 3 },
  { lineNum: 6, code: 'while (j >= gap && arr[j - gap] > temp) {', comment: '// Step: Compare elements \'gap\' apart', indent: 3 },
  { lineNum: 7, code: 'arr[j] = arr[j - gap];', comment: '// Step: Shift larger element right', indent: 4 },
  { lineNum: 8, code: 'j -= gap;', comment: '// Step: Move comparison pointer back', indent: 4 },
  { lineNum: 9, code: '}', indent: 3 },
  { lineNum: 10, code: 'arr[j] = temp;', comment: '// Step: Insert temp into correct gapped position', indent: 3 },
  { lineNum: 11, code: '}', indent: 2 },
  { lineNum: 12, code: '}', indent: 1 },
  { lineNum: 13, code: '}', comment: '// Algorithm Finished', indent: 0 },
];

export const CodePanel: React.FC<CodePanelProps> = ({ currentStep }) => {
  const activeLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll highlighted line into view
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentStep.cppLine]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-colors">
      {/* Code Header & Tab */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              C++ Code
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                shell_sort.cpp
              </span>
            </h3>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          <span>Line {currentStep.cppLine}</span>
        </div>
      </div>

      {/* Code Listing Box */}
      <div
        ref={containerRef}
        className="w-full bg-slate-950 rounded-xl p-3 sm:p-4 border border-slate-800 font-mono text-xs sm:text-[13px] overflow-x-auto max-h-72 sm:max-h-80 space-y-0.5"
      >
        {CPP_CODE_LINES.map(line => {
          const isActive = currentStep.cppLine === line.lineNum;
          const isGapLine = line.lineNum === 2 && currentStep.type === 'gap_change';

          return (
            <div
              key={line.lineNum}
              ref={isActive ? activeLineRef : null}
              className={`flex items-center rounded-lg px-2 py-1 transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-900/60 border-l-4 border-blue-500 text-blue-100 shadow-sm'
                  : 'hover:bg-slate-900/60 text-slate-300 border-l-4 border-transparent'
              } ${isGapLine ? 'ring-1 ring-amber-400/60' : ''}`}
            >
              {/* Line number */}
              <span
                className={`w-7 text-right pr-3 select-none text-[11px] ${
                  isActive ? 'text-blue-400 font-bold' : 'text-slate-600'
                }`}
              >
                {line.lineNum}
              </span>

              {/* Active arrow */}
              <span className="w-4 text-blue-400 select-none text-xs font-bold">
                {isActive ? '▶' : ''}
              </span>

              {/* Code text with indentation */}
              <span
                className="whitespace-pre flex-1"
                style={{ paddingLeft: `${line.indent * 14}px` }}
              >
                <span
                  className={
                    isActive
                      ? 'text-blue-200 font-semibold'
                      : line.code.startsWith('//')
                      ? 'text-slate-500'
                      : 'text-slate-200'
                  }
                >
                  {line.code}
                </span>
                {line.comment && (
                  <span className="text-slate-500 text-[11px] ml-2 italic">
                    {line.comment}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Real-time variable inspector */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2">
          Scope Variable Inspector
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">gap:</span>
            <span className="font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
              {currentStep.gap > 0 ? currentStep.gap : 'done'}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">i:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/40">
              {currentStep.i !== null ? currentStep.i : 'null'}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">j:</span>
            <span className="font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/40">
              {currentStep.j !== null ? currentStep.j : 'null'}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">temp:</span>
            <span className="font-bold text-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-800/40">
              {currentStep.temp !== null ? currentStep.temp : 'null'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
