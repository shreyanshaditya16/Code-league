import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Search, 
  Layers, 
  GitCommitVertical, 
  Share2,
  Sparkles
} from 'lucide-react';
import { ArraySortingVisualizer } from './ArraySortingVisualizer';
import { SearchingVisualizer } from './SearchingVisualizer';
import { StackQueueVisualizer } from './StackQueueVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';

interface VisualizerPageProps {
  initialAlgorithm?: string;
}

export const VisualizerPage: React.FC<VisualizerPageProps> = ({ initialAlgorithm = 'bubble-sort' }) => {
  const [selectedAlgo, setSelectedAlgo] = useState<string>(initialAlgorithm);

  // Synchronize when parent navigates to a specific algorithm
  React.useEffect(() => {
    if (initialAlgorithm) {
      setSelectedAlgo(initialAlgorithm);
    }
  }, [initialAlgorithm]);

  const algorithms = [
    // Sorting category
    { id: 'bubble-sort', label: 'Bubble Sort', category: 'Sorting', icon: ArrowUpDown },
    { id: 'selection-sort', label: 'Selection Sort', category: 'Sorting', icon: ArrowUpDown },
    { id: 'insertion-sort', label: 'Insertion Sort', category: 'Sorting', icon: ArrowUpDown },

    // Searching category
    { id: 'linear-search', label: 'Linear Search', category: 'Searching', icon: Search },
    { id: 'binary-search', label: 'Binary Search', category: 'Searching', icon: Search },

    // Data Structures
    { id: 'stack-viz', label: 'Stack (LIFO)', category: 'Data Structures', icon: Layers },
    { id: 'queue-viz', label: 'Queue (FIFO)', category: 'Data Structures', icon: GitCommitVertical },
    { id: 'linked-list-viz', label: 'Linked List', category: 'Data Structures', icon: Share2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Simulator</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Algorithm Visualizer</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Watch algorithm state transitions frame by frame. Enter custom inputs, inspect comparisons and swaps, and track code line execution in real time.
          </p>
        </div>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {algorithms.map((algo) => {
          const Icon = algo.icon;
          const isSelected = selectedAlgo === algo.id;
          return (
            <button
              key={algo.id}
              onClick={() => setSelectedAlgo(algo.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{algo.label}</span>
            </button>
          );
        })}
      </div>

      {/* Visualizer Renderer based on selection */}
      <div>
        {(selectedAlgo === 'bubble-sort' ||
          selectedAlgo === 'selection-sort' ||
          selectedAlgo === 'insertion-sort') && (
          <ArraySortingVisualizer
            algorithmType={selectedAlgo as 'bubble-sort' | 'selection-sort' | 'insertion-sort'}
          />
        )}

        {(selectedAlgo === 'linear-search' || selectedAlgo === 'binary-search') && (
          <SearchingVisualizer
            algorithmType={selectedAlgo as 'linear-search' | 'binary-search'}
          />
        )}

        {selectedAlgo === 'stack-viz' && (
          <StackQueueVisualizer initialType="stack" />
        )}

        {selectedAlgo === 'queue-viz' && (
          <StackQueueVisualizer initialType="queue" />
        )}

        {selectedAlgo === 'linked-list-viz' && (
          <LinkedListVisualizer />
        )}
      </div>
    </div>
  );
};
