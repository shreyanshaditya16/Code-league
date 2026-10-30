import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Shuffle, 
  Search, 
  CheckCircle2, 
  XCircle,
  Info,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { VisualizerStep } from '../../types/dsa';
import { generateLinearSearchSteps, generateBinarySearchSteps } from '../../algorithms/searching';
import { CodeTracker } from './CodeTracker';

interface SearchingVisualizerProps {
  algorithmType: 'linear-search' | 'binary-search';
}

export const SearchingVisualizer: React.FC<SearchingVisualizerProps> = ({ algorithmType }) => {
  const [arrayInput, setArrayInput] = useState<number[]>([12, 25, 33, 47, 56, 68, 79, 88, 94]);
  const [customArrayText, setCustomArrayText] = useState('12, 25, 33, 47, 56, 68, 79, 88, 94');
  const [arrayError, setArrayError] = useState<string | null>(null);

  const [targetValue, setTargetValue] = useState<number>(56);
  const [targetInputText, setTargetInputText] = useState('56');
  const [targetError, setTargetError] = useState<string | null>(null);

  const [steps, setSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if current input array is sorted
  const isInputSorted = arrayInput.length <= 1 || arrayInput.every((v, i) => i === 0 || arrayInput[i - 1] <= v);

  // Generate steps
  useEffect(() => {
    let generated: VisualizerStep[] = [];
    if (algorithmType === 'linear-search') {
      generated = generateLinearSearchSteps(arrayInput, targetValue);
    } else {
      generated = generateBinarySearchSteps(arrayInput, targetValue);
    }
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [arrayInput, targetValue, algorithmType]);

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
    description: 'Initializing search visualization...',
    codeLine: 1,
    arrayState: arrayInput,
    comparingIndices: [],
    visitedIndices: [],
    pointers: [],
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

  const handleSetTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(targetInputText.trim());
    if (isNaN(val) || !Number.isFinite(val)) {
      setTargetError('Please enter a valid numeric target.');
      return;
    }
    setTargetError(null);
    setTargetValue(val);
  };

  const handleApplyCustomArray = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const trimmed = customArrayText.trim();
      if (!trimmed) {
        setArrayError('Please enter at least one number (e.g. 10, 20, 30).');
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
          return Math.round(val);
        });

      if (parsed.length === 0) {
        setArrayError('Please enter at least one integer.');
        return;
      }

      if (parsed.length > 14) {
        setArrayError('Please enter at most 14 elements for visual clarity.');
        return;
      }

      setArrayInput(parsed);
      setArrayError(null);
    } catch (err: any) {
      setArrayError(err.message || 'Invalid comma-separated format.');
    }
  };

  const handlePickRandomTarget = () => {
    if (arrayInput.length === 0) return;
    const randomPick = arrayInput[Math.floor(Math.random() * arrayInput.length)];
    setTargetValue(randomPick);
    setTargetInputText(String(randomPick));
    setTargetError(null);
  };

  const handleRandomizeArray = () => {
    setIsPlaying(false);
    const size = 9;
    const randomized: number[] = [];
    for (let i = 0; i < size; i++) {
      randomized.push(Math.floor(Math.random() * 90) + 10);
    }
    if (algorithmType === 'binary-search') {
      randomized.sort((a, b) => a - b);
    }
    setArrayInput(randomized);
    setCustomArrayText(randomized.join(', '));
    setArrayError(null);
  };

  const displayArray = currentStep.arrayState || arrayInput;

  // Extract pointers
  const lowPtr = currentStep.pointers?.find((p) => p.label === 'low')?.index ?? -1;
  const midPtr = currentStep.pointers?.find((p) => p.label === 'mid')?.index ?? -1;
  const highPtr = currentStep.pointers?.find((p) => p.label === 'high')?.index ?? -1;
  const iPtr = currentStep.pointers?.find((p) => p.label === 'i')?.index ?? -1;

  const comparisonsCount = steps
    .slice(0, currentStepIndex + 1)
    .filter((s) => s.actionType === 'compare').length;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Reset"
            aria-label="Reset Search Visualizer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleStepBackward}
            disabled={currentStepIndex === 0}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white transition cursor-pointer"
            title="Step Backward"
            aria-label="Step Backward"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            aria-label={isPlaying ? 'Pause Playback' : 'Start Playback'}
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
            aria-label="Step Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleRandomizeArray}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer ml-2"
            title="Generate Random Array"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Randomize</span>
          </button>
        </div>

        {/* Target Input form */}
        <form onSubmit={handleSetTarget} className="flex items-center gap-2">
          <label htmlFor="search-target-input" className="text-xs font-mono text-slate-300 font-semibold">
            Target:
          </label>
          <input
            id="search-target-input"
            type="number"
            value={targetInputText}
            onChange={(e) => setTargetInputText(e.target.value)}
            className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-blue-500 text-center"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer"
          >
            Set
          </button>
          <button
            type="button"
            onClick={handlePickRandomTarget}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
            title="Pick a random target from array"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </form>

        {/* Speed Selector */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                  playbackSpeed === spd ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
          <span className="font-mono text-slate-400 text-xs">
            Step {currentStepIndex + 1}/{steps.length}
          </span>
        </div>
      </div>

      {targetError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg font-mono">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{targetError}</span>
        </div>
      )}

      {/* Main Searching Stage */}
      <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Step description banner */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
          <Search className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Binary search sorted array note */}
        {algorithmType === 'binary-search' && (
          <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border font-mono transition-colors">
            {isInputSorted ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border-emerald-500/20 w-full">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Precondition Satisfied: Input array is strictly in sorted order.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 border-amber-500/20 w-full">
                <Info className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Notice: Binary Search requires a sorted array. The input was automatically sorted in ascending order for this visualization.</span>
              </div>
            )}
          </div>
        )}

        {/* Array Elements Grid */}
        <div className="py-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 min-h-[180px]">
          {displayArray.length === 0 ? (
            <div className="text-sm text-slate-500 font-mono italic">
              Array is empty. Enter comma-separated values below or click Randomize.
            </div>
          ) : (
            displayArray.map((value, idx) => {
              const isComparing = currentStep.comparingIndices?.includes(idx);
              const isVisited = currentStep.visitedIndices?.includes(idx);
              const isFound = currentStep.foundIndex === idx;

              // In Binary Search, is this index outside active [low, high]?
              const isDiscardedInBinary =
                algorithmType === 'binary-search' &&
                lowPtr >= 0 &&
                highPtr >= 0 &&
                (idx < lowPtr || idx > highPtr);

              let boxStyle = 'bg-slate-800/80 border-slate-700 text-slate-200';
              if (isFound) {
                boxStyle = 'bg-emerald-500/40 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50 scale-110';
              } else if (isComparing) {
                boxStyle = 'bg-amber-500/40 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 scale-105';
              } else if (isDiscardedInBinary) {
                boxStyle = 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-40 line-through';
              } else if (isVisited) {
                boxStyle = 'bg-slate-800/40 border-slate-700/60 text-slate-400';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  {/* Pointer tags above box */}
                  <div className="h-5 flex items-center justify-center font-mono text-[10px] font-bold">
                    {algorithmType === 'binary-search' ? (
                      <div className="flex items-center gap-1">
                        {idx === lowPtr && <span className="text-emerald-400">low</span>}
                        {idx === midPtr && <span className="text-amber-400 bg-amber-500/20 px-1 rounded">mid</span>}
                        {idx === highPtr && <span className="text-violet-400">high</span>}
                      </div>
                    ) : (
                      idx === iPtr && <span className="text-cyan-400 bg-cyan-500/20 px-1 rounded">i</span>
                    )}
                  </div>

                  {/* Number Box */}
                  <div
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono text-base sm:text-lg font-bold shadow-md transition-all duration-200 ${boxStyle}`}
                  >
                    {value}
                  </div>

                  {/* Index subscript */}
                  <span className="text-[10px] font-mono text-slate-500">
                    [{idx}]
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Outcome banner */}
        {currentStep.foundIndex !== undefined && currentStep.foundIndex !== null && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between border ${
              typeof currentStep.foundIndex === 'number' && currentStep.foundIndex >= 0
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold">
              {typeof currentStep.foundIndex === 'number' && currentStep.foundIndex >= 0 ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Success: Target {targetValue} found at index {currentStep.foundIndex}!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>Search Terminated: Target {targetValue} not found in array.</span>
                </>
              )}
            </div>

            <span className="text-xs font-mono">
              Comparisons: {comparisonsCount}
            </span>
          </div>
        )}
      </div>

      {/* Two Column Section: Custom Array Input + Live Code Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custom Array Input */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Custom Array Input</span>
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Enter 1 to 14 comma-separated integers to search custom values.
          </p>

          <form onSubmit={handleApplyCustomArray} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={customArrayText}
                onChange={(e) => setCustomArrayText(e.target.value)}
                placeholder="e.g. 15, 28, 42, 60, 75"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer"
              >
                Apply
              </button>
            </div>

            {arrayError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{arrayError}</span>
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
