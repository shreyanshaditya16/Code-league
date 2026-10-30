import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Shuffle, 
  Sliders, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { VisualizerStep } from '../../types/dsa';
import { 
  generateBubbleSortSteps, 
  generateSelectionSortSteps, 
  generateInsertionSortSteps 
} from '../../algorithms/sorting';
import { CodeTracker } from './CodeTracker';

interface ArraySortingVisualizerProps {
  algorithmType: 'bubble-sort' | 'selection-sort' | 'insertion-sort';
}

export const ArraySortingVisualizer: React.FC<ArraySortingVisualizerProps> = ({ algorithmType }) => {
  const [arrayInput, setArrayInput] = useState<number[]>([35, 12, 68, 24, 85, 47, 19, 53]);
  const [customInputText, setCustomInputText] = useState('35, 12, 68, 24, 85, 47, 19, 53');
  const [inputError, setInputError] = useState<string | null>(null);

  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1 = 800ms
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate steps whenever arrayInput or algorithmType changes
  useEffect(() => {
    let generated: VisualizerStep[] = [];
    if (algorithmType === 'bubble-sort') {
      generated = generateBubbleSortSteps(arrayInput);
    } else if (algorithmType === 'selection-sort') {
      generated = generateSelectionSortSteps(arrayInput);
    } else if (algorithmType === 'insertion-sort') {
      generated = generateInsertionSortSteps(arrayInput);
    }
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [arrayInput, algorithmType]);

  // Handle Playback Interval
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(150, Math.round(900 / playbackSpeed));
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  const currentStep = steps[currentStepIndex] || {
    stepIndex: 0,
    description: 'Initializing visualization...',
    codeLine: 1,
    arrayState: arrayInput,
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    const size = 8;
    const randomized: number[] = [];
    for (let i = 0; i < size; i++) {
      randomized.push(Math.floor(Math.random() * 85) + 10);
    }
    setArrayInput(randomized);
    setCustomInputText(randomized.join(', '));
    setInputError(null);
  };

  const handleApplyCustomInput = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const trimmed = customInputText.trim();
      if (!trimmed) {
        setInputError('Please enter at least one number (e.g. 35, 12, 68).');
        return;
      }

      const parsed = trimmed
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => {
          const val = Number(s);
          if (isNaN(val) || !Number.isFinite(val)) {
            throw new Error(`'${s}' is not a valid number`);
          }
          if (!Number.isInteger(val)) {
            return Math.round(val);
          }
          return val;
        });

      if (parsed.length === 0) {
        setInputError('Please enter at least one number.');
        return;
      }

      if (parsed.length > 14) {
        setInputError('Please enter at most 14 numbers for clean visual inspection.');
        return;
      }

      setArrayInput(parsed);
      setInputError(null);
    } catch (err: any) {
      setInputError(err.message || 'Invalid input format. Use comma-separated integers.');
    }
  };

  // Metrics derived from steps
  const comparisonsSoFar = steps
    .slice(0, currentStepIndex + 1)
    .filter((s) => s.actionType === 'compare').length;

  const swapsSoFar = steps
    .slice(0, currentStepIndex + 1)
    .filter((s) => s.actionType === 'swap').length;

  const displayArray = currentStep.arrayState || arrayInput;
  const maxVal = displayArray.length > 0 ? Math.max(...displayArray, 10) : 10;
  const minVal = displayArray.length > 0 ? Math.min(...displayArray, 0) : 0;
  const valRange = Math.max(1, maxVal - minVal);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Playback buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Reset to Start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleStepBackward}
            disabled={currentStepIndex === 0}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white transition cursor-pointer"
            title="Step Backward"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{currentStepIndex >= steps.length - 1 ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            disabled={currentStepIndex >= steps.length - 1}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white transition cursor-pointer"
            title="Step Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Randomize */}
          <button
            onClick={handleRandomize}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer ml-2"
            title="Generate Random Array"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Randomize</span>
          </button>
        </div>

        {/* Speed Selector & Progress */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <span className="text-slate-400 px-2 font-mono text-[11px]">Speed:</span>
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <div className="font-mono text-slate-400 hidden sm:block">
            Step <span className="text-cyan-400 font-bold">{currentStepIndex + 1}</span> / {steps.length}
          </div>
        </div>
      </div>

      {/* Array Display Visualization Stage */}
      <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Step Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 animate-ping" />
          <p className="text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Array Bars Container */}
        <div className="h-64 sm:h-72 flex items-end justify-center gap-2 sm:gap-4 px-2 pt-6 pb-2">
          {displayArray.map((value, idx) => {
            const isComparing = currentStep.comparingIndices?.includes(idx);
            const isSwapping = currentStep.swappingIndices?.includes(idx);
            const isSorted = currentStep.sortedIndices?.includes(idx);

            const heightPercent = Math.max(16, Math.min(100, Math.round(((value - minVal) / valRange) * 80) + 16));

            let barBg = 'bg-slate-800/80 border-slate-700 text-slate-300';
            let labelBadge = '';

            if (isSwapping) {
              barBg = 'bg-rose-500/50 border-rose-400 text-rose-200 shadow-lg shadow-rose-500/20 scale-105';
              labelBadge = 'SWAP';
            } else if (isComparing) {
              barBg = 'bg-amber-500/50 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 scale-105';
              labelBadge = 'CMP';
            } else if (isSorted) {
              barBg = 'bg-emerald-500/40 border-emerald-400 text-emerald-200';
            }

            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 flex-1 max-w-[65px] transition-all duration-200"
              >
                {/* Top value badge */}
                <span className="text-xs font-mono font-bold text-white">
                  {value}
                </span>

                {/* Animated Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-xl border-t-2 border-x-2 transition-all duration-200 flex flex-col items-center justify-between py-1.5 relative ${barBg}`}
                >
                  {labelBadge && (
                    <span className="text-[9px] font-bold font-mono px-1 py-0.5 rounded bg-black/60 text-white shadow">
                      {labelBadge}
                    </span>
                  )}
                </div>

                {/* Index label */}
                <span className="text-[10px] font-mono text-slate-500">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend & Real-Time Stats */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-600" />
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500/60 border border-amber-400" />
              <span className="text-amber-300">Comparing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500/60 border border-rose-400" />
              <span className="text-rose-300">Swapping / Shift</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/50 border border-emerald-400" />
              <span className="text-emerald-300">Sorted Position</span>
            </div>
          </div>

          {/* Real-time counters */}
          <div className="flex items-center gap-4 font-mono">
            <div className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
              Comparisons: <span className="text-amber-400 font-bold">{comparisonsSoFar}</span>
            </div>
            <div className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
              Swaps/Shifts: <span className="text-rose-400 font-bold">{swapsSoFar}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Custom Input Form + Live Code Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custom Input */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Custom Array Input</span>
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Enter 3 to 12 comma-separated numbers (e.g. 50, 20, 90, 10, 40) to visualize custom test cases.
          </p>

          <form onSubmit={handleApplyCustomInput} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="e.g. 40, 15, 80, 22, 65"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer"
              >
                Apply
              </button>
            </div>

            {inputError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{inputError}</span>
              </div>
            )}
          </form>
        </div>

        {/* Live Synchronized Code Line Tracker */}
        <CodeTracker
          algorithmId={algorithmType}
          activeLine={currentStep.codeLine}
        />
      </div>
    </div>
  );
};
