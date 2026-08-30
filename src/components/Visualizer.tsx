import React, { useRef, useEffect, useState } from 'react';
import { SortStep, BarState } from '../types';
import { Sparkles, ArrowDown, HelpCircle, Layers, CheckCircle } from 'lucide-react';

interface VisualizerProps {
  currentStep: SortStep;
  maxVal: number;
}

const COLOR_MAP: Record<BarState, { bg: string; border: string; label: string; text: string }> = {
  default: {
    bg: '#4A90D9',
    border: '#3A70B9',
    label: 'Default / Untouched',
    text: '#FFFFFF',
  },
  thread: {
    bg: '#B39DDB',
    border: '#9575CD',
    label: 'Current Gap Thread (mod gap)',
    text: '#2A1B4E',
  },
  comparing: {
    bg: '#FF7F50',
    border: '#E65100',
    label: 'Actively Comparing',
    text: '#FFFFFF',
  },
  shifting: {
    bg: '#F5A623',
    border: '#D48806',
    label: 'Temp Held / Shifting Right',
    text: '#1C160C',
  },
  inserted: {
    bg: '#E74C3C',
    border: '#C0392B',
    label: 'Just Placed / Inserted',
    text: '#FFFFFF',
  },
  sorted: {
    bg: '#2ECC71',
    border: '#27AE60',
    label: 'Fully Sorted',
    text: '#FFFFFF',
  },
};

export const Visualizer: React.FC<VisualizerProps> = ({ currentStep, maxVal }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barPositions, setBarPositions] = useState<{ x: number; y: number; width: number; height: number }[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const array = currentStep.array;
  const n = array.length;
  const barStates = currentStep.barStates;
  const isSorted = currentStep.type === 'completed';

  // Measure bar centers for SVG connector arc
  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      const parentRect = containerRef.current?.getBoundingClientRect();
      if (!parentRect) return;

      const barElements = containerRef.current?.querySelectorAll('.array-bar-column');
      if (!barElements) return;

      const positions: { x: number; y: number; width: number; height: number }[] = [];
      barElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        positions.push({
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top,
          width: rect.width,
          height: rect.height,
        });
      });
      setBarPositions(positions);
    };

    measure();
    window.addEventListener('resize', measure);
    const timeout = setTimeout(measure, 50);

    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(timeout);
    };
  }, [array, currentStep.stepIndex]);

  // Compute SVG dashed connector path between compared bars
  const renderConnectorArc = () => {
    if (!currentStep.comparedIndices || barPositions.length < n) return null;
    const [leftIdx, rightIdx] = currentStep.comparedIndices;
    if (leftIdx < 0 || leftIdx >= barPositions.length || rightIdx < 0 || rightIdx >= barPositions.length) return null;

    const p1 = barPositions[leftIdx];
    const p2 = barPositions[rightIdx];
    if (!p1 || !p2) return null;

    const startX = p1.x;
    const endX = p2.x;
    const distance = Math.abs(endX - startX);
    const arcHeight = Math.min(80, Math.max(35, distance * 0.35));
    const baselineY = 40; // top margin area

    // Quadratic curve control point
    const midX = (startX + endX) / 2;
    const ctrlY = Math.max(8, baselineY - arcHeight);

    const pathData = `M ${startX} ${baselineY + 10} Q ${midX} ${ctrlY} ${endX} ${baselineY + 10}`;

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
        {/* Shadow glow line */}
        <path
          d={pathData}
          fill="none"
          stroke="#FF7F50"
          strokeWidth="6"
          strokeOpacity="0.25"
        />
        {/* Main dashed connector */}
        <path
          d={pathData}
          fill="none"
          stroke="#FF7F50"
          strokeWidth="2.5"
          strokeDasharray="5,4"
          className="animate-pulse"
        />
        {/* End dots */}
        <circle cx={startX} cy={baselineY + 10} r="4.5" fill="#FF7F50" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx={endX} cy={baselineY + 10} r="4.5" fill="#FF7F50" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Center distance badge */}
        <g transform={`translate(${midX}, ${ctrlY - 4})`}>
          <rect
            x="-44"
            y="-14"
            width="88"
            height="22"
            rx="11"
            fill="#1E1B4B"
            stroke="#9B59B6"
            strokeWidth="1.5"
            className="shadow-lg"
          />
          <text
            x="0"
            y="1"
            textAnchor="middle"
            fill="#E9D5FF"
            fontSize="10.5"
            fontWeight="bold"
            fontFamily="monospace"
          >
            Gap = {currentStep.gap} ({rightIdx - leftIdx} apart)
          </text>
        </g>
      </svg>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col justify-between transition-colors">
      {/* Top Banner / Temp Status Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Demonstration
              {isSorted && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5" /> Sorted!
                </span>
              )}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Heights represent element magnitude. Colors indicate algorithm activity.
            </span>
          </div>
        </div>

        {/* Floating Temp Register Card */}
        {currentStep.temp !== null ? (
          <div className="flex items-center gap-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 px-3 py-1.5 rounded-xl shadow-2xs">
            <div className="text-[11px] uppercase tracking-wider font-bold text-amber-800 dark:text-amber-300">
              Temp Value (arr[{currentStep.i}]):
            </div>
            <div className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-mono font-black text-sm rounded-md shadow-2xs">
              {currentStep.temp}
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            temp = null (waiting for next pass)
          </div>
        )}
      </div>

      {/* Main Bar Chart Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-64 sm:h-72 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 pt-12 flex items-end justify-center gap-2 sm:gap-3 select-none"
      >
        {/* SVG Connector Arc */}
        {renderConnectorArc()}

        {/* Array Bars */}
        {array.map((val, idx) => {
          const state: BarState = barStates[idx] || 'default';
          const color = COLOR_MAP[state];
          const heightPercent = Math.max(16, (val / Math.max(maxVal, 10)) * 82);
          const isCurrentI = currentStep.i === idx;
          const isCurrentJ = currentStep.j === idx;
          const isInThread = currentStep.threadIndices.includes(idx);
          const isComparing = currentStep.comparedIndices?.includes(idx);

          return (
            <div
              key={idx}
              className="array-bar-column flex-1 max-w-[56px] min-w-[28px] h-full flex flex-col items-center justify-end relative group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Pointer indicator above bar (i or j) */}
              <div className="absolute -top-7 flex flex-col items-center transition-all">
                {isCurrentJ && isCurrentI ? (
                  <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 shadow-md">
                    i,j
                  </span>
                ) : isCurrentI ? (
                  <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-indigo-500 text-white shadow-md">
                    i={idx}
                  </span>
                ) : isCurrentJ ? (
                  <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 shadow-md animate-bounce">
                    j={idx}
                  </span>
                ) : isComparing ? (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-orange-500 text-white shadow-md">
                    cmp
                  </span>
                ) : null}
              </div>

              {/* Value label on/above bar */}
              <div
                className="text-xs font-mono font-bold mb-1 transition-all"
                style={{
                  color: state === 'comparing' ? '#FF7F50' : state === 'inserted' ? '#E74C3C' : '#E2E8F0',
                  transform: isComparing || state === 'inserted' ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {val}
              </div>

              {/* The Visual Bar */}
              <div
                className={`w-full rounded-t-xl transition-all duration-300 relative shadow-md ${
                  state === 'inserted' ? 'animate-insert-pulse' : ''
                }`}
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: color.bg,
                  borderTop: `3px solid ${color.border}`,
                  borderLeft: `1px solid ${color.border}`,
                  borderRight: `1px solid ${color.border}`,
                  boxShadow:
                    state === 'comparing'
                      ? '0 0 16px rgba(255, 127, 80, 0.6)'
                      : state === 'inserted'
                      ? '0 0 16px rgba(231, 76, 60, 0.7)'
                      : state === 'shifting'
                      ? '0 0 14px rgba(245, 166, 35, 0.5)'
                      : 'none',
                }}
              >
                {/* Thread band marker */}
                {isInThread && !isSorted && currentStep.gap > 0 && (
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white/40 rounded-full" />
                )}
              </div>

              {/* Index label below bar */}
              <div className="mt-2 text-[11px] font-mono text-slate-400 font-semibold flex flex-col items-center">
                <span>[{idx}]</span>
                {isInThread && currentStep.gap > 0 && !isSorted && (
                  <span className="text-[9px] text-purple-300 font-sans">
                    t{idx % currentStep.gap}
                  </span>
                )}
              </div>

              {/* Interactive Tooltip on hover */}
              {hoveredIdx === idx && (
                <div className="absolute bottom-full mb-8 left-1/2 -translate-x-1/2 z-40 w-44 bg-slate-900 dark:bg-slate-950 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1 animate-in fade-in zoom-in-95 pointer-events-none text-white">
                  <div className="font-bold text-slate-100 flex items-center justify-between">
                    <span>Index: {idx}</span>
                    <span className="text-blue-400 font-mono text-sm">Val: {val}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    State: <span className="font-semibold text-slate-200">{color.label}</span>
                  </div>
                  {currentStep.gap > 0 && (
                    <div className="text-[10px] text-blue-400 font-mono">
                      Gap Group: mod {currentStep.gap} = {idx % currentStep.gap}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Color Legend Key (Mandatory exact colors from spec) */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          Color Legend & Algorithm State
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="w-3.5 h-3.5 rounded shrink-0 shadow-2xs" style={{ backgroundColor: '#4A90D9' }} />
            <span className="text-slate-700 dark:text-slate-300 truncate text-[11px] font-medium">Default / Untouched</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="w-3.5 h-3.5 rounded shrink-0 shadow-2xs" style={{ backgroundColor: '#B39DDB' }} />
            <span className="text-slate-700 dark:text-slate-300 truncate text-[11px] font-medium">Gap Thread</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="w-3.5 h-3.5 rounded shrink-0 shadow-2xs" style={{ backgroundColor: '#FF7F50' }} />
            <span className="text-slate-700 dark:text-slate-300 truncate text-[11px] font-medium">Comparing</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="w-3.5 h-3.5 rounded shrink-0 shadow-2xs" style={{ backgroundColor: '#F5A623' }} />
            <span className="text-slate-700 dark:text-slate-300 truncate text-[11px] font-medium">Temp / Shift</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="w-3.5 h-3.5 rounded shrink-0 shadow-2xs" style={{ backgroundColor: '#E74C3C' }} />
            <span className="text-slate-700 dark:text-slate-300 truncate text-[11px] font-medium">Just Inserted</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="w-3.5 h-3.5 rounded shrink-0 shadow-2xs" style={{ backgroundColor: '#2ECC71' }} />
            <span className="text-slate-700 dark:text-slate-300 truncate text-[11px] font-medium">Fully Sorted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
