import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { InputControls } from './components/InputControls';
import { GapHistoryStrip } from './components/GapHistoryStrip';
import { StatsBar } from './components/StatsBar';
import { Visualizer } from './components/Visualizer';
import { CodePanel } from './components/CodePanel';
import { ExplanationPanel } from './components/ExplanationPanel';
import { generateShellSortSteps } from './utils/shellSortGenerator';
import { SortStep } from './types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const INITIAL_ARRAY = [9, 5, 1, 8, 3, 7, 2];

export default function App() {
  const [array, setArray] = useState<number[]>(INITIAL_ARRAY);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Pre-generate deterministic steps
  const steps: SortStep[] = useMemo(() => {
    return generateShellSortSteps(array);
  }, [array]);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex] || steps[0];
  const maxVal = useMemo(() => Math.max(...array, 10), [array]);
  const isComplete = currentStepIndex >= totalSteps - 1;

  // Handle setting a new array
  const handleSetArray = (newArr: number[]) => {
    setIsPlaying(false);
    setArray(newArr);
    setCurrentStepIndex(0);
  };

  // Step navigation functions
  const handleNext = useCallback(() => {
    setCurrentStepIndex(prev => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      setIsPlaying(false);
      return prev;
    });
  }, [totalSteps]);

  const handlePrev = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleJumpToStart = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleJumpToEnd = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(totalSteps - 1);
  }, [totalSteps]);

  const handlePlayPause = useCallback(() => {
    if (isComplete) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [isComplete]);

  const handleSeek = (index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(totalSteps - 1, index)));
  };

  // Timer loop for auto-play
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const intervalMs = Math.max(150, Math.round(900 / speed));
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speed, totalSteps]);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing in text inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleNext, handlePrev, handleReset]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* Header */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-5">
        {/* Input & Array Configuration Bar */}
        <InputControls
          currentArray={array}
          onSetArray={handleSetArray}
          isPlaying={isPlaying}
        />

        {/* Gap History Strip */}
        <GapHistoryStrip
          arrayLength={array.length}
          currentGap={currentStep.gap}
          isComplete={isComplete}
        />

        {/* Stats & Progress Bar */}
        <StatsBar currentStep={currentStep} totalSteps={totalSteps} />

        {/* Core Two-Panel Visualizer & Code Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Panel: Visualization (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <Visualizer currentStep={currentStep} maxVal={maxVal} />

            {/* Step Navigation Action Bar directly below the Demonstration / Visualization box */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-xs transition-colors">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Current step <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentStepIndex + 1}</span> of <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{totalSteps}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="direct-prev-btn"
                  onClick={handlePrev}
                  disabled={currentStepIndex <= 0 || isPlaying}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all shadow-xs border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95"
                  title="Previous Step"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  id="direct-next-btn"
                  onClick={handleNext}
                  disabled={isComplete || isPlaying}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-all shadow-xs border border-blue-500 cursor-pointer active:scale-95"
                  title="Next Step"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <ExplanationPanel currentStep={currentStep} />
          </div>

          {/* Right Panel: C++ Code Panel & Variable Watcher (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <CodePanel currentStep={currentStep} />
          </div>
        </div>
      </main>
    </div>
  );
}
