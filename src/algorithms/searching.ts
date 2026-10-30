import { VisualizerStep } from '../types/dsa';

export function generateLinearSearchSteps(arr: number[], target: number): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const visited: number[] = [];

  // Edge case: empty array
  if (arr.length === 0) {
    return [
      {
        stepIndex: 0,
        description: `Array is empty (size 0). Target ${target} cannot be located. Returns -1.`,
        codeLine: 6,
        arrayState: [],
        comparingIndices: [],
        visitedIndices: [],
        foundIndex: -1,
        targetValue: target,
        actionType: 'done',
      },
    ];
  }

  steps.push({
    stepIndex: 0,
    description: `Begin Linear Search for target = ${target}. Scan each element starting from index 0.`,
    codeLine: 1,
    arrayState: [...arr],
    comparingIndices: [],
    visitedIndices: [],
    targetValue: target,
    actionType: 'search',
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      stepIndex: steps.length,
      description: `Checking index ${i}: Is arr[${i}] (${arr[i]}) equal to target (${target})?`,
      codeLine: 3,
      arrayState: [...arr],
      comparingIndices: [i],
      visitedIndices: [...visited],
      pointers: [{ label: 'i', index: i, color: 'text-cyan-400' }],
      targetValue: target,
      actionType: 'compare',
    });

    visited.push(i);

    if (arr[i] === target) {
      steps.push({
        stepIndex: steps.length,
        description: `Target ${target} found at index ${i}! Search completes successfully in ${i + 1} comparison${i === 0 ? '' : 's'}.`,
        codeLine: 4,
        arrayState: [...arr],
        comparingIndices: [i],
        visitedIndices: [...visited],
        foundIndex: i,
        targetValue: target,
        actionType: 'done',
      });
      return steps;
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `Target ${target} was not found in the array after scanning all ${arr.length} elements. Returns -1.`,
    codeLine: 6,
    arrayState: [...arr],
    comparingIndices: [],
    visitedIndices: [...visited],
    foundIndex: -1,
    targetValue: target,
    actionType: 'done',
  });

  return steps;
}

export function generateBinarySearchSteps(arr: number[], target: number): VisualizerStep[] {
  const steps: VisualizerStep[] = [];

  // Edge case: empty array
  if (arr.length === 0) {
    return [
      {
        stepIndex: 0,
        description: `Array is empty (size 0). Binary Search cannot operate on an empty collection. Target ${target} not found. Returns -1.`,
        codeLine: 10,
        arrayState: [],
        pointers: [],
        foundIndex: -1,
        targetValue: target,
        actionType: 'done',
      },
    ];
  }

  // Check if original array was sorted
  const isAlreadySorted = arr.every((v, idx) => idx === 0 || arr[idx - 1] <= v);
  const sorted = isAlreadySorted ? [...arr] : [...arr].sort((a, b) => a - b);
  const visited: number[] = [];

  const initialDesc = isAlreadySorted
    ? `Binary Search initialized on sorted array (size ${sorted.length}). Target = ${target}. Set low = 0, high = ${sorted.length - 1}.`
    : `Notice: Binary Search requires a sorted array. Original input was sorted: [${arr.join(', ')}] → [${sorted.join(', ')}]. Target = ${target}. low = 0, high = ${sorted.length - 1}.`;

  steps.push({
    stepIndex: 0,
    description: initialDesc,
    codeLine: 1,
    arrayState: sorted,
    pointers: [
      { label: 'low', index: 0, color: 'text-emerald-400' },
      { label: 'high', index: sorted.length - 1, color: 'text-violet-400' },
    ],
    targetValue: target,
    actionType: 'search',
  });

  let low = 0;
  let high = sorted.length - 1;
  let comparisons = 0;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    comparisons++;
    visited.push(mid);

    steps.push({
      stepIndex: steps.length,
      description: `Calculate mid = ${low} + floor((${high} - ${low}) / 2) = ${mid}. Comparing arr[mid] (${sorted[mid]}) with target (${target}).`,
      codeLine: 3,
      arrayState: sorted,
      comparingIndices: [mid],
      visitedIndices: [...visited],
      pointers: [
        { label: 'low', index: low, color: 'text-emerald-400' },
        { label: 'mid', index: mid, color: 'text-amber-400' },
        { label: 'high', index: high, color: 'text-violet-400' },
      ],
      targetValue: target,
      actionType: 'compare',
    });

    if (sorted[mid] === target) {
      steps.push({
        stepIndex: steps.length,
        description: `Target ${target} found at mid index ${mid}! Total comparisons: ${comparisons}.`,
        codeLine: 4,
        arrayState: sorted,
        comparingIndices: [mid],
        visitedIndices: [...visited],
        foundIndex: mid,
        targetValue: target,
        actionType: 'done',
      });
      return steps;
    }

    if (sorted[mid] < target) {
      const nextLow = mid + 1;
      steps.push({
        stepIndex: steps.length,
        description: `Since arr[mid] (${sorted[mid]}) < target (${target}), target must lie in the right half. Discarding indices ${low}..${mid}. Setting low = mid + 1 (${nextLow}).`,
        codeLine: 6,
        arrayState: sorted,
        visitedIndices: [...visited],
        pointers: [
          { label: 'low', index: Math.min(nextLow, sorted.length - 1), color: 'text-emerald-400' },
          { label: 'high', index: high, color: 'text-violet-400' },
        ],
        targetValue: target,
        actionType: 'search',
      });
      low = nextLow;
    } else {
      const nextHigh = mid - 1;
      steps.push({
        stepIndex: steps.length,
        description: `Since arr[mid] (${sorted[mid]}) > target (${target}), target must lie in the left half. Discarding indices ${mid}..${high}. Setting high = mid - 1 (${nextHigh}).`,
        codeLine: 8,
        arrayState: sorted,
        visitedIndices: [...visited],
        pointers: [
          { label: 'low', index: low, color: 'text-emerald-400' },
          { label: 'high', index: Math.max(0, nextHigh), color: 'text-violet-400' },
        ],
        targetValue: target,
        actionType: 'search',
      });
      high = nextHigh;
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `Search space exhausted (low=${low} > high=${high}). Target ${target} does not exist in array. Total comparisons: ${comparisons}. Returns -1.`,
    codeLine: 10,
    arrayState: sorted,
    visitedIndices: [...visited],
    foundIndex: -1,
    targetValue: target,
    actionType: 'done',
  });

  return steps;
}
