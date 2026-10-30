import React, { useState } from 'react';
import { 
  Layers, 
  ArrowDown, 
  ArrowUp, 
  Eye, 
  Trash2, 
  AlertTriangle, 
  Info,
  GitCommitVertical,
  Plus
} from 'lucide-react';
import { 
  generateStackPushSteps, 
  generateStackPopSteps, 
  generateQueueEnqueueSteps, 
  generateQueueDequeueSteps 
} from '../../algorithms/dataStructures';
import { CodeTracker } from './CodeTracker';

interface StackQueueVisualizerProps {
  initialType?: 'stack' | 'queue';
}

export const StackQueueVisualizer: React.FC<StackQueueVisualizerProps> = ({ initialType = 'stack' }) => {
  const [mode, setMode] = useState<'stack' | 'queue'>(initialType);

  // Stack state
  const [stackData, setStackData] = useState<(string | number)[]>([10, 25, 42]);
  const [stackInput, setStackInput] = useState('58');

  // Queue state
  const [queueData, setQueueData] = useState<(string | number)[]>([10, 25, 42]);
  const [queueInput, setQueueInput] = useState('58');

  const [message, setMessage] = useState<string>('Ready for operations.');
  const [activeCodeLine, setActiveCodeLine] = useState<number>(1);
  const [alertError, setAlertError] = useState<string | null>(null);

  const MAX_CAPACITY = 6;

  // Stack Operations
  const handlePush = () => {
    setAlertError(null);
    const trimmed = stackInput.trim();
    if (!trimmed) {
      setAlertError('Please enter a value to push onto the stack.');
      return;
    }
    const val = trimmed;
    const { newStack, steps } = generateStackPushSteps(stackData, val, MAX_CAPACITY);

    if (steps.some((s) => s.description.includes('Overflow'))) {
      setAlertError(`Stack Overflow! Maximum capacity (${MAX_CAPACITY}) reached.`);
      setActiveCodeLine(2);
      return;
    }

    setStackData(newStack);
    setMessage(`Pushed [${val}] onto top of stack.`);
    setActiveCodeLine(3);
  };

  const handlePop = () => {
    setAlertError(null);
    const { newStack, steps } = generateStackPopSteps(stackData);

    if (steps.some((s) => s.description.includes('Underflow'))) {
      setAlertError('Stack Underflow! Cannot pop from an empty stack.');
      setActiveCodeLine(2);
      return;
    }

    const popped = stackData[stackData.length - 1];
    setStackData(newStack);
    setMessage(`Popped [${popped}] from top of stack.`);
    setActiveCodeLine(3);
  };

  const handlePeekStack = () => {
    setAlertError(null);
    if (stackData.length === 0) {
      setAlertError('Stack is empty! Peek returns null/undefined.');
      return;
    }
    const topItem = stackData[stackData.length - 1];
    setMessage(`Peek: Element at Top (Index ${stackData.length - 1}) is [${topItem}].`);
    setActiveCodeLine(1);
  };

  const handleClearStack = () => {
    setAlertError(null);
    setStackData([]);
    setMessage('Stack cleared to empty state.');
  };

  // Queue Operations
  const handleEnqueue = () => {
    setAlertError(null);
    const trimmed = queueInput.trim();
    if (!trimmed) {
      setAlertError('Please enter a value to enqueue.');
      return;
    }
    const val = trimmed;
    const { newQueue, steps } = generateQueueEnqueueSteps(queueData, val, MAX_CAPACITY);

    if (steps.some((s) => s.description.includes('Overflow'))) {
      setAlertError(`Queue Overflow! Maximum capacity (${MAX_CAPACITY}) reached.`);
      setActiveCodeLine(2);
      return;
    }

    setQueueData(newQueue);
    setMessage(`Enqueued [${val}] at Rear (Index ${newQueue.length - 1}).`);
    setActiveCodeLine(3);
  };

  const handleDequeue = () => {
    setAlertError(null);
    const { newQueue, steps } = generateQueueDequeueSteps(queueData);

    if (steps.some((s) => s.description.includes('Underflow'))) {
      setAlertError('Queue Underflow! Cannot dequeue from an empty queue.');
      setActiveCodeLine(2);
      return;
    }

    const dequeued = queueData[0];
    setQueueData(newQueue);
    setMessage(`Dequeued [${dequeued}] from Front.`);
    setActiveCodeLine(3);
  };

  const handlePeekQueue = () => {
    setAlertError(null);
    if (queueData.length === 0) {
      setAlertError('Queue is empty! Front element does not exist.');
      return;
    }
    setMessage(`Front element is [${queueData[0]}].`);
    setActiveCodeLine(1);
  };

  const handleClearQueue = () => {
    setAlertError(null);
    setQueueData([]);
    setMessage('Queue cleared to empty state.');
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation between Stack and Queue */}
      <div className="flex items-center justify-between bg-[#0F172A] border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMode('stack');
              setAlertError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mode === 'stack'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Stack (LIFO)</span>
          </button>

          <button
            onClick={() => {
              setMode('queue');
              setAlertError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mode === 'queue'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitCommitVertical className="w-4 h-4" />
            <span>Queue (FIFO)</span>
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 pr-2">
          Max Capacity: <span className="text-cyan-400 font-bold">{MAX_CAPACITY}</span> slots
        </div>
      </div>

      {/* Main Visualizer Board */}
      <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Status / Log Message */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{message}</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">
            Current Count: {mode === 'stack' ? stackData.length : queueData.length} / {MAX_CAPACITY}
          </span>
        </div>

        {/* Error notification */}
        {alertError && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-pulse font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{alertError}</span>
          </div>
        )}

        {/* Dynamic Display: Stack or Queue */}
        {mode === 'stack' ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
            {/* Vertical Stack Visual Container */}
            <div className="relative w-48 sm:w-56 h-80 border-b-4 border-x-4 border-slate-600 rounded-b-2xl bg-slate-950/80 p-3 flex flex-col-reverse items-center justify-start gap-2 shadow-inner">
              {/* Slot indicators */}
              {Array.from({ length: MAX_CAPACITY }).map((_, slotIdx) => {
                const item = stackData[slotIdx];
                const isTop = slotIdx === stackData.length - 1;

                if (item !== undefined) {
                  return (
                    <div
                      key={slotIdx}
                      className={`w-full py-2.5 rounded-xl border flex items-center justify-between px-4 font-mono font-bold text-sm shadow-md transition-all duration-300 ${
                        isTop
                          ? 'bg-blue-600/40 border-cyan-400 text-cyan-200 scale-102 ring-1 ring-cyan-400/40'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span>[{slotIdx}]</span>
                      <span className="text-base text-white">{item}</span>
                      {isTop ? (
                        <span className="text-[10px] uppercase font-bold text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded">
                          TOP
                        </span>
                      ) : (
                        <span className="w-4" />
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={slotIdx}
                      className="w-full py-2 rounded-lg border border-dashed border-slate-800/80 flex items-center justify-center text-[10px] font-mono text-slate-700"
                    >
                      Empty Slot {slotIdx}
                    </div>
                  );
                }
              })}
            </div>

            {/* Controls Panel for Stack */}
            <div className="space-y-4 max-w-xs w-full bg-[#0F172A] p-5 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold uppercase text-slate-400 font-mono tracking-wider">
                Stack Operations (LIFO)
              </h4>

              {/* Push Form */}
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block">Value to Push:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={stackInput}
                    onChange={(e) => setStackInput(e.target.value)}
                    placeholder="e.g. 58"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handlePush}
                    disabled={stackData.length >= MAX_CAPACITY}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Push</span>
                  </button>
                </div>
              </div>

              {/* Pop & Peek buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handlePop}
                  disabled={stackData.length === 0}
                  className="py-2 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 disabled:opacity-40 text-rose-300 text-xs font-semibold border border-rose-500/30 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Pop</span>
                </button>

                <button
                  onClick={handlePeekStack}
                  disabled={stackData.length === 0}
                  className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Peek</span>
                </button>
              </div>

              {/* Clear */}
              <button
                onClick={handleClearStack}
                className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] font-mono transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Stack</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 py-4">
            {/* Horizontal Conveyor Queue View */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-between w-full max-w-2xl px-2 text-xs font-mono text-slate-400">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ← FRONT (Dequeue Exits)
                </span>
                <span className="text-violet-400 font-bold flex items-center gap-1">
                  REAR (Enqueue Enters) ←
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-800 overflow-x-auto w-full max-w-2xl justify-center min-h-[100px]">
                {queueData.length === 0 ? (
                  <span className="text-xs text-slate-600 font-mono italic">
                    Queue is currently empty
                  </span>
                ) : (
                  queueData.map((val, idx) => {
                    const isFront = idx === 0;
                    const isRear = idx === queueData.length - 1;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className="h-4 text-[10px] font-mono font-bold">
                          {isFront && <span className="text-emerald-400">FRONT</span>}
                          {isRear && !isFront && <span className="text-violet-400">REAR</span>}
                        </div>

                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center font-mono text-base font-bold shadow-md transition-all ${
                            isFront
                              ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200'
                              : isRear
                              ? 'bg-violet-600/30 border-violet-400 text-violet-200'
                              : 'bg-slate-800/80 border-slate-700 text-slate-300'
                          }`}
                        >
                          {val}
                        </div>

                        <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Queue Controls Bar */}
            <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={queueInput}
                  onChange={(e) => setQueueInput(e.target.value)}
                  placeholder="e.g. 58"
                  className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleEnqueue}
                  disabled={queueData.length >= MAX_CAPACITY}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enqueue</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDequeue}
                  disabled={queueData.length === 0}
                  className="py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 disabled:opacity-40 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition cursor-pointer"
                >
                  Dequeue Front
                </button>
                <button
                  onClick={handlePeekQueue}
                  disabled={queueData.length === 0}
                  className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  Peek
                </button>
                <button
                  onClick={handleClearQueue}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Clear Queue"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Synchronized Code Tracker */}
      <CodeTracker
        algorithmId={mode === 'stack' ? 'stack-viz' : 'queue-viz'}
        activeLine={activeCodeLine}
      />
    </div>
  );
};
