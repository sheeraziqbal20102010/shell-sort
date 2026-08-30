import React, { useState } from 'react';
import { Dices, Sparkles, Check, AlertCircle, Sliders } from 'lucide-react';

interface InputControlsProps {
  currentArray: number[];
  onSetArray: (newArr: number[]) => void;
  isPlaying: boolean;
}

const PRESETS = [
  { label: 'Tutorial Example', array: [9, 5, 1, 8, 3, 7, 2], desc: '7 elements (4 -> 2 -> 1 gap)' },
  { label: 'Classic 8', array: [62, 83, 18, 53, 7, 17, 95, 22], desc: 'Standard unsorted (4 -> 2 -> 1)' },
  { label: 'Reverse Sorted', array: [85, 72, 63, 50, 38, 27, 14, 6], desc: 'Worst case for regular insertion sort' },
  { label: 'Nearly Sorted', array: [12, 18, 42, 35, 50, 68, 64, 88], desc: 'Shows lightning fast gap convergence' },
  { label: 'Small (5 items)', array: [45, 12, 89, 34, 23], desc: 'Super easy to follow (2 -> 1)' },
];

export const InputControls: React.FC<InputControlsProps> = ({
  currentArray,
  onSetArray,
  isPlaying,
}) => {
  const [inputValue, setInputValue] = useState(currentArray.join(', '));
  const [arraySize, setArraySize] = useState(8);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    parseAndApplyInput(inputValue);
  };

  const parseAndApplyInput = (raw: string) => {
    setErrorMsg(null);
    const parts = raw
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (parts.length < 2) {
      setErrorMsg('Please provide at least 2 numbers for sorting.');
      return;
    }

    if (parts.length > 16) {
      setErrorMsg('For optimal visual clarity, maximum 16 numbers are allowed.');
      return;
    }

    const parsedNumbers: number[] = [];
    for (const part of parts) {
      const num = Number(part);
      if (isNaN(num) || !Number.isInteger(num)) {
        setErrorMsg(`"${part}" is not a valid integer.`);
        return;
      }
      if (num < 1 || num > 99) {
        setErrorMsg(`Numbers must be between 1 and 99 (got ${num}).`);
        return;
      }
      parsedNumbers.push(num);
    }

    onSetArray(parsedNumbers);
    setInputValue(parsedNumbers.join(', '));
  };

  const handleGenerateRandom = () => {
    setErrorMsg(null);
    const newArr: number[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArr.push(Math.floor(Math.random() * 90) + 5);
    }
    onSetArray(newArr);
    setInputValue(newArr.join(', '));
  };

  const handleSelectPreset = (presetArray: number[]) => {
    setErrorMsg(null);
    onSetArray(presetArray);
    setInputValue(presetArray.join(', '));
    setShowPresets(false);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs mb-4 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Manual input form */}
        <form onSubmit={handleManualSubmit} className="flex-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Custom Array (Comma-separated 1–99)
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              Current: [{currentArray.length} items]
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="manual-array-input"
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="e.g. 9, 5, 1, 8, 3, 7, 2"
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 font-mono transition-all outline-none"
              disabled={isPlaying}
            />
            <button
              id="apply-array-btn"
              type="submit"
              disabled={isPlaying}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all shadow-xs active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          </div>
        </form>

        {/* Random Generator & Presets */}
        <div className="flex flex-wrap items-center gap-3 lg:border-l lg:border-slate-200 lg:dark:border-slate-800 lg:pl-4">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">Size: {arraySize}</span>
            <input
              id="array-size-slider"
              type="range"
              min="4"
              max="14"
              value={arraySize}
              onChange={e => setArraySize(Number(e.target.value))}
              disabled={isPlaying}
              className="w-20 sm:w-24 accent-blue-600 cursor-pointer"
            />
          </div>

          <button
            id="random-array-btn"
            type="button"
            onClick={handleGenerateRandom}
            disabled={isPlaying}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Dices className="w-4 h-4 text-slate-300" />
            <span>Random</span>
          </button>

          <div className="relative">
            <button
              id="presets-menu-btn"
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              disabled={isPlaying}
              className="px-3 py-2 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Presets</span>
            </button>

            {showPresets && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-40 p-2 space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-2 py-1 uppercase tracking-wider">
                  Preset Arrays
                </div>
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p.array)}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col gap-0.5"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span>{p.label}</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">n={p.array.length}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                      [{p.array.join(', ')}]
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error feedback message */}
      {errorMsg && (
        <div className="mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
