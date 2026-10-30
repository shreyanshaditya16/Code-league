import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  Trash2, 
  ArrowRight, 
  RotateCcw, 
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { ListNode, generateLinkedListInsertSteps, generateLinkedListDeleteSteps } from '../../algorithms/dataStructures';
import { CodeTracker } from './CodeTracker';

export const LinkedListVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<ListNode[]>([
    { id: 'n1', value: 15 },
    { id: 'n2', value: 32 },
    { id: 'n3', value: 48 },
    { id: 'n4', value: 77 },
  ]);

  const [insertVal, setInsertVal] = useState('99');
  const [deleteVal, setDeleteVal] = useState('32');
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [activeCodeLine, setActiveCodeLine] = useState(1);
  const [message, setMessage] = useState('Linked list initialized with 4 nodes. Head points to [15].');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Insert Head
  const handleInsertHead = () => {
    if (isAnimating) return;
    setInputError(null);
    if (!insertVal.trim() || isNaN(Number(insertVal))) {
      setInputError('Please enter a valid numeric value to insert.');
      return;
    }
    if (nodes.length >= 10) {
      setInputError('Maximum list length is 10 nodes for visualization clarity.');
      return;
    }
    const val = Math.round(Number(insertVal));
    const { newList, steps } = generateLinkedListInsertSteps(nodes, val, 'head');

    setIsAnimating(true);
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const step = steps[stepIdx];
        setMessage(step.description);
        setActiveCodeLine(step.codeLine);
        setActiveHighlightId(step.activeNodeId || null);
        stepIdx++;
      } else {
        clearInterval(interval);
        setNodes(newList);
        setIsAnimating(false);
        setActiveHighlightId(null);
      }
    }, 700);
  };

  // Insert Tail
  const handleInsertTail = () => {
    if (isAnimating) return;
    setInputError(null);
    if (!insertVal.trim() || isNaN(Number(insertVal))) {
      setInputError('Please enter a valid numeric value to insert.');
      return;
    }
    if (nodes.length >= 10) {
      setInputError('Maximum list length is 10 nodes for visualization clarity.');
      return;
    }
    const val = Math.round(Number(insertVal));
    const { newList, steps } = generateLinkedListInsertSteps(nodes, val, 'tail');

    setIsAnimating(true);
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const step = steps[stepIdx];
        setMessage(step.description);
        setActiveCodeLine(step.codeLine);
        setActiveHighlightId(step.activeNodeId || null);
        stepIdx++;
      } else {
        clearInterval(interval);
        setNodes(newList);
        setIsAnimating(false);
        setActiveHighlightId(null);
      }
    }, 600);
  };

  // Delete by Value
  const handleDeleteValue = () => {
    if (isAnimating) return;
    setInputError(null);
    if (nodes.length === 0) {
      setInputError('List is currently empty (HEAD is NULL).');
      return;
    }
    if (!deleteVal.trim() || isNaN(Number(deleteVal))) {
      setInputError('Please enter a valid numeric value to search and delete.');
      return;
    }
    const val = Math.round(Number(deleteVal));

    const { newList, steps } = generateLinkedListDeleteSteps(nodes, val);

    setIsAnimating(true);
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const step = steps[stepIdx];
        setMessage(step.description);
        setActiveCodeLine(step.codeLine);
        setActiveHighlightId(step.activeNodeId || null);
        stepIdx++;
      } else {
        clearInterval(interval);
        setNodes(newList);
        setIsAnimating(false);
        setActiveHighlightId(null);
      }
    }, 750);
  };

  const handleReset = () => {
    setInputError(null);
    setNodes([
      { id: 'n1', value: 15 },
      { id: 'n2', value: 32 },
      { id: 'n3', value: 48 },
      { id: 'n4', value: 77 },
    ]);
    setActiveHighlightId(null);
    setActiveCodeLine(1);
    setMessage('Reset list to default state.');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Insert controls */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={insertVal}
            onChange={(e) => setInsertVal(e.target.value)}
            placeholder="Val"
            className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-blue-500 text-center"
          />
          <button
            onClick={handleInsertHead}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert Head</span>
          </button>
          <button
            onClick={handleInsertTail}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert Tail</span>
          </button>
        </div>

        {/* Delete controls */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={deleteVal}
            onChange={(e) => setDeleteVal(e.target.value)}
            placeholder="Target"
            className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-rose-300 font-bold focus:outline-none focus:border-rose-500 text-center"
          />
          <button
            onClick={handleDeleteValue}
            disabled={isAnimating || nodes.length === 0}
            className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 disabled:opacity-40 text-rose-300 font-semibold text-xs border border-rose-500/30 transition cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Node</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Reset to default nodes"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {inputError && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{inputError}</span>
        </div>
      )}

      {/* Linked List Canvas */}
      <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Step Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{message}</span>
          </div>
          <span className="text-slate-500">
            Length: {nodes.length} Nodes
          </span>
        </div>

        {/* Visual Node Chain */}
        <div className="py-8 overflow-x-auto min-h-[160px] flex items-center gap-3 px-2">
          {/* HEAD pointer label */}
          <div className="flex flex-col items-center shrink-0 pr-2">
            <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 rounded-md mb-1 shadow-sm">
              HEAD
            </span>
            <ArrowRight className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>

          {nodes.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500 font-mono">
              List is empty (HEAD == NULL)
            </div>
          ) : (
            nodes.map((node, idx) => {
              const isHighlighted = activeHighlightId === node.id;

              return (
                <div key={node.id} className="flex items-center gap-3 shrink-0">
                  {/* Two-part Node Box: [ data | next ] */}
                  <div
                    className={`rounded-xl border-2 flex overflow-hidden shadow-lg transition-all duration-300 ${
                      isHighlighted
                        ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/50 scale-105'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {/* Data portion */}
                    <div className="px-3.5 py-2.5 flex flex-col items-center justify-center border-r border-slate-700/80 min-w-[50px]">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">val</span>
                      <span className="text-base font-bold font-mono text-white">
                        {node.value}
                      </span>
                    </div>

                    {/* Next pointer portion */}
                    <div className="px-2.5 py-2.5 bg-slate-950 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">next</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-1 shadow-sm shadow-cyan-400" />
                    </div>
                  </div>

                  {/* Pointer Arrow to next node */}
                  <div className="flex items-center text-cyan-400">
                    <div className="w-4 h-0.5 bg-cyan-400" />
                    <ArrowRight className="w-4 h-4 -ml-1 text-cyan-400" />
                  </div>
                </div>
              );
            })
          )}

          {/* NULL Terminator */}
          <div className="shrink-0 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-rose-400 shadow">
            NULL
          </div>
        </div>

        {/* Informational Footer */}
        <div className="border-t border-slate-800/80 pt-4 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Insert Head: <strong className="text-emerald-400">O(1)</strong></span>
            <span>Traverse to Tail: <strong className="text-amber-400">O(N)</strong></span>
            <span>Delete by Value: <strong className="text-amber-400">O(N)</strong></span>
          </div>
          <span className="text-slate-500">Each node has independent heap address</span>
        </div>
      </div>

      {/* Live Code Tracker */}
      <CodeTracker
        algorithmId="linked-list-viz"
        activeLine={activeCodeLine}
      />
    </div>
  );
};
