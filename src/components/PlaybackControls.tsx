import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  FastForward,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PlaybackControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onJumpToStart: () => void;
  onJumpToEnd: () => void;
  onSeek: (stepIndex: number) => void;
  speed: number;
  onSetSpeed: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  onJumpToStart,
  onJumpToEnd,
  onSeek,
  speed,
  onSetSpeed,
}) => {
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = currentStepIndex >= totalSteps - 1;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
      {/* Step Scrubber / Progress Slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">
          Step {currentStepIndex + 1}
        </span>
        <input
          id="step-scrubber-slider"
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={e => onSeek(Number(e.target.value))}
          className="flex-1 h-2 bg-slate-100 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-600"
          title="Drag to scrub through steps"
        />
        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0">
          {totalSteps} total
        </span>
      </div>

      {/* Main Control Button Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Playback Buttons Group */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Jump to start */}
          <button
            id="jump-start-btn"
            onClick={onJumpToStart}
            disabled={isAtStart || isPlaying}
            className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 disabled:opacity-40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Jump to Start (Step 0)"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Step */}
          <button
            id="prev-step-btn"
            onClick={onPrev}
            disabled={isAtStart || isPlaying}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 disabled:opacity-40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            title="Previous Step (Left Arrow)"
          >
            <SkipBack className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden xs:inline">Prev</span>
          </button>

          {/* Play / Pause Primary Button */}
          <button
            id="play-pause-btn"
            onClick={onPlayPause}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-xs cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
            }`}
            title={isPlaying ? "Pause Animation (Space)" : "Auto Play Animation (Space)"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{isAtEnd ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Next Step Primary Button */}
          <button
            id="next-step-btn"
            onClick={onNext}
            disabled={isAtEnd || isPlaying}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs sm:text-sm font-bold transition-all shadow-xs border border-blue-500 cursor-pointer"
            title="Next Step (Right Arrow / Space)"
          >
            <span>Next</span>
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Jump to end */}
          <button
            id="jump-end-btn"
            onClick={onJumpToEnd}
            disabled={isAtEnd || isPlaying}
            className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 disabled:opacity-40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Jump to Completed Sort"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            id="reset-btn"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors ml-1 cursor-pointer"
            title="Reset Array to Original State (R)"
          >
            <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg">
          <FastForward className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Speed:</span>
          <div className="flex items-center gap-1">
            {[0.5, 1, 1.5, 2].map(speedVal => (
              <button
                key={speedVal}
                id={`speed-btn-${speedVal}x`}
                onClick={() => onSetSpeed(speedVal)}
                className={`px-2 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                  speed === speedVal
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {speedVal}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
