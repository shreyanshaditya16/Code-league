import React from 'react';

interface CodeTrackerProps {
  algorithmId: string;
  activeLine: number;
}

const ALGORITHM_CODE: Record<string, { title: string; lines: string[] }> = {
  'bubble-sort': {
    title: 'Bubble Sort Invariant Logic',
    lines: [
      'function bubbleSort(arr, n):',
      '  for i = 0 to n - 2:',
      '    for j = 0 to n - 2 - i:',
      '      if arr[j] > arr[j + 1]:',
      '        swap(arr[j], arr[j + 1])',
      '    // element n - 1 - i locked in position',
      '  return arr',
    ],
  },
  'selection-sort': {
    title: 'Selection Sort Minimum Search',
    lines: [
      'function selectionSort(arr, n):',
      '  for i = 0 to n - 2:',
      '    minIdx = i',
      '    for j = i + 1 to n - 1:',
      '      if arr[j] < arr[minIdx]: minIdx = j',
      '    if minIdx != i: swap(arr[i], arr[minIdx])',
      '  return arr',
    ],
  },
  'insertion-sort': {
    title: 'Insertion Sort Shifting Subarray',
    lines: [
      'function insertionSort(arr, n):',
      '  for i = 1 to n - 1:',
      '    key = arr[i]; j = i - 1',
      '    while j >= 0 and arr[j] > key:',
      '      arr[j + 1] = arr[j] // shift right',
      '      j = j - 1',
      '    arr[j + 1] = key // place in sorted spot',
      '  return arr',
    ],
  },
  'linear-search': {
    title: 'Linear Search Scan',
    lines: [
      'function linearSearch(arr, target):',
      '  for i = 0 to arr.length - 1:',
      '    if arr[i] == target:',
      '      return i // found',
      '  return -1 // not found in array',
    ],
  },
  'binary-search': {
    title: 'Binary Search Divide & Conquer',
    lines: [
      'function binarySearch(arr, target):',
      '  low = 0; high = arr.length - 1',
      '  while low <= high:',
      '    mid = low + floor((high - low) / 2)',
      '    if arr[mid] == target: return mid',
      '    else if arr[mid] < target: low = mid + 1',
      '    else: high = mid - 1',
      '  return -1 // element absent',
    ],
  },
  'stack-viz': {
    title: 'Stack LIFO Top Operations',
    lines: [
      'function push(val):',
      '  if size >= capacity: throw Overflow',
      '  top = top + 1; items[top] = val',
      'function pop():',
      '  if top < 0: throw Underflow',
      '  val = items[top]; top = top - 1; return val',
    ],
  },
  'queue-viz': {
    title: 'Queue FIFO Circular Buffer',
    lines: [
      'function enqueue(val):',
      '  if size == capacity: throw Overflow',
      '  rear = (rear + 1) % cap; arr[rear] = val',
      'function dequeue():',
      '  if size == 0: throw Underflow',
      '  val = arr[front]; front = (front + 1) % cap',
      '  return val',
    ],
  },
  'linked-list-viz': {
    title: 'Singly Linked List Pointer Rewiring',
    lines: [
      'function insertAtHead(head, val):',
      '  newNode = new Node(val)',
      '  newNode.next = head',
      '  return newNode',
      'function deleteNode(head, val):',
      '  curr = head',
      '  while curr.next != null and curr.next.val != val:',
      '    curr = curr.next',
      '  curr.next = curr.next.next',
    ],
  },
};

export const CodeTracker: React.FC<CodeTrackerProps> = ({ algorithmId, activeLine }) => {
  const codeInfo = ALGORITHM_CODE[algorithmId] || ALGORITHM_CODE['bubble-sort'];

  return (
    <div className="bg-[#0A0E17] border border-slate-800 rounded-xl overflow-hidden shadow-md">
      <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
        <span className="font-mono font-semibold text-cyan-300">{codeInfo.title}</span>
        <span className="text-[10px] text-slate-400 font-mono">
          Active Line: {activeLine || 1}
        </span>
      </div>

      <div className="p-3 font-mono text-xs overflow-x-auto leading-relaxed">
        {codeInfo.lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLine;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-2 py-1 rounded transition-colors ${
                isActive
                  ? 'bg-blue-600/30 text-cyan-200 border-l-2 border-cyan-400 font-bold'
                  : 'text-slate-400'
              }`}
            >
              <span className="text-slate-600 select-none w-4 text-right text-[10px]">
                {lineNumber}
              </span>
              <span className="whitespace-pre">{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
