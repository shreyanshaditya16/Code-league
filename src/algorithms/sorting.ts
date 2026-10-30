import { VisualizerStep } from '../types/dsa';

export function generateBubbleSortSteps(initialArr: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const arr = [...initialArr];
  const n = arr.length;
  const sortedIndices: number[] = [];
  let compCount = 0;
  let swapCount = 0;

  // Edge case: Empty array
  if (n === 0) {
    return [
      {
        stepIndex: 0,
        description: 'Empty array provided. Nothing to sort.',
        codeLine: 1,
        arrayState: [],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [],
        actionType: 'done',
      },
    ];
  }

  // Edge case: Single-element array
  if (n === 1) {
    return [
      {
        stepIndex: 0,
        description: `Single-element array [${arr[0]}] is already trivially sorted.`,
        codeLine: 7,
        arrayState: [...arr],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [0],
        actionType: 'done',
      },
    ];
  }

  steps.push({
    stepIndex: 0,
    description: `Start Bubble Sort on array of size ${n}. Bubble Sort repeatedly compares adjacent elements and swaps them if out of order.`,
    codeLine: 1,
    arrayState: [...arr],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    actionType: 'search',
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedInThisPass = false;

    steps.push({
      stepIndex: steps.length,
      description: `Starting Pass ${i + 1} of ${n - 1}. Largest unsorted element will bubble up to index ${n - 1 - i}.`,
      codeLine: 2,
      arrayState: [...arr],
      comparingIndices: [],
      sortedIndices: [...sortedIndices],
      pointers: [{ label: `Pass ${i + 1}`, index: 0, color: 'text-cyan-400' }],
      actionType: 'search',
    });

    for (let j = 0; j < n - 1 - i; j++) {
      compCount++;
      steps.push({
        stepIndex: steps.length,
        description: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}). Comparisons: ${compCount}, Swaps: ${swapCount}.`,
        codeLine: 3,
        arrayState: [...arr],
        comparingIndices: [j, j + 1],
        sortedIndices: [...sortedIndices],
        pointers: [
          { label: 'j', index: j, color: 'text-amber-400' },
          { label: 'j+1', index: j + 1, color: 'text-amber-300' },
        ],
        actionType: 'compare',
      });

      if (arr[j] > arr[j + 1]) {
        swapCount++;
        swappedInThisPass = true;

        // Perform swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        steps.push({
          stepIndex: steps.length,
          description: `Swap! Since ${temp} > ${arr[j]}, swapped arr[${j}] and arr[${j + 1}]. Swaps: ${swapCount}.`,
          codeLine: 4,
          arrayState: [...arr],
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          pointers: [
            { label: 'swapped', index: j, color: 'text-rose-400' },
            { label: 'swapped', index: j + 1, color: 'text-rose-400' },
          ],
          actionType: 'swap',
        });
      }
    }

    const newlySorted = n - 1 - i;
    sortedIndices.push(newlySorted);

    steps.push({
      stepIndex: steps.length,
      description: `End of Pass ${i + 1}. Element ${arr[newlySorted]} is now locked into its final sorted position at index ${newlySorted}.`,
      codeLine: 5,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      actionType: 'search',
    });

    if (!swappedInThisPass) {
      steps.push({
        stepIndex: steps.length,
        description: `Early exit optimization: No swaps occurred during Pass ${i + 1}. Array is already fully sorted!`,
        codeLine: 6,
        arrayState: [...arr],
        sortedIndices: Array.from({ length: n }, (_, k) => k),
        actionType: 'done',
      });
      return steps;
    }
  }

  // Mark all as sorted
  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    stepIndex: steps.length,
    description: `Bubble Sort complete! Total comparisons: ${compCount}, total swaps: ${swapCount}. Array is fully sorted.`,
    codeLine: 7,
    arrayState: [...arr],
    sortedIndices: allSorted,
    actionType: 'done',
  });

  return steps;
}

export function generateSelectionSortSteps(initialArr: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const arr = [...initialArr];
  const n = arr.length;
  const sortedIndices: number[] = [];
  let compCount = 0;
  let swapCount = 0;

  // Edge case: Empty array
  if (n === 0) {
    return [
      {
        stepIndex: 0,
        description: 'Empty array provided. Nothing to sort.',
        codeLine: 1,
        arrayState: [],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [],
        actionType: 'done',
      },
    ];
  }

  // Edge case: Single element
  if (n === 1) {
    return [
      {
        stepIndex: 0,
        description: `Single-element array [${arr[0]}] is already sorted.`,
        codeLine: 6,
        arrayState: [...arr],
        sortedIndices: [0],
        actionType: 'done',
      },
    ];
  }

  steps.push({
    stepIndex: 0,
    description: `Start Selection Sort. In each pass, we find the minimum element in the unsorted portion and place it at the beginning.`,
    codeLine: 1,
    arrayState: [...arr],
    sortedIndices: [],
    actionType: 'search',
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      stepIndex: steps.length,
      description: `Pass ${i + 1}: Looking for smallest element from index ${i} to ${n - 1}. Initial assume min is arr[${i}] (${arr[i]}).`,
      codeLine: 2,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      pointers: [
        { label: 'i (target pos)', index: i, color: 'text-cyan-400' },
        { label: 'min', index: minIdx, color: 'text-amber-400' },
      ],
      actionType: 'search',
    });

    for (let j = i + 1; j < n; j++) {
      compCount++;
      steps.push({
        stepIndex: steps.length,
        description: `Scanning: Comparing current min arr[${minIdx}] (${arr[minIdx]}) with arr[${j}] (${arr[j]}).`,
        codeLine: 3,
        arrayState: [...arr],
        comparingIndices: [minIdx, j],
        sortedIndices: [...sortedIndices],
        pointers: [
          { label: 'min', index: minIdx, color: 'text-amber-400' },
          { label: 'j', index: j, color: 'text-blue-400' },
        ],
        actionType: 'compare',
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          stepIndex: steps.length,
          description: `New minimum discovered! arr[${j}] (${arr[j]}) is smaller than previous minimum. Updated minIndex = ${minIdx}.`,
          codeLine: 4,
          arrayState: [...arr],
          sortedIndices: [...sortedIndices],
          pointers: [{ label: 'NEW min', index: minIdx, color: 'text-emerald-400' }],
          actionType: 'search',
        });
      }
    }

    if (minIdx !== i) {
      swapCount++;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        stepIndex: steps.length,
        description: `Swap! Placing minimum element ${arr[i]} into sorted position index ${i} by swapping with index ${minIdx}.`,
        codeLine: 5,
        arrayState: [...arr],
        swappingIndices: [i, minIdx],
        sortedIndices: [...sortedIndices],
        pointers: [
          { label: 'min -> placed', index: i, color: 'text-emerald-400' },
          { label: 'swapped', index: minIdx, color: 'text-rose-400' },
        ],
        actionType: 'swap',
      });
    } else {
      steps.push({
        stepIndex: steps.length,
        description: `arr[${i}] (${arr[i]}) is already the minimum for this pass; no swap necessary.`,
        codeLine: 5,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        actionType: 'search',
      });
    }

    sortedIndices.push(i);
  }

  sortedIndices.push(n - 1);

  steps.push({
    stepIndex: steps.length,
    description: `Selection Sort complete! Total comparisons: ${compCount}, swaps: ${swapCount}. Array is fully sorted.`,
    codeLine: 6,
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    actionType: 'done',
  });

  return steps;
}

export function generateInsertionSortSteps(initialArr: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const arr = [...initialArr];
  const n = arr.length;
  let compCount = 0;
  let shiftCount = 0;

  // Edge case: Empty array
  if (n === 0) {
    return [
      {
        stepIndex: 0,
        description: 'Empty array provided. Nothing to sort.',
        codeLine: 1,
        arrayState: [],
        comparingIndices: [],
        swappingIndices: [],
        sortedIndices: [],
        actionType: 'done',
      },
    ];
  }

  // Edge case: Single element
  if (n === 1) {
    return [
      {
        stepIndex: 0,
        description: `Single-element array [${arr[0]}] is already sorted.`,
        codeLine: 7,
        arrayState: [...arr],
        sortedIndices: [0],
        actionType: 'done',
      },
    ];
  }

  steps.push({
    stepIndex: 0,
    description: `Start Insertion Sort. Elements at index 0..i-1 are maintained as a sorted subarray. We take element i ('key') and insert it in place.`,
    codeLine: 1,
    arrayState: [...arr],
    sortedIndices: [0],
    actionType: 'search',
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      stepIndex: steps.length,
      description: `Pass ${i}: Selected key = ${key} at index ${i}. Will compare with elements in the sorted portion (indices 0..${i - 1}).`,
      codeLine: 2,
      arrayState: [...arr],
      sortedIndices: Array.from({ length: i }, (_, k) => k),
      pointers: [{ label: `key: ${key}`, index: i, color: 'text-violet-400' }],
      actionType: 'search',
    });

    while (j >= 0) {
      compCount++;
      steps.push({
        stepIndex: steps.length,
        description: `Comparing key (${key}) with arr[${j}] (${arr[j]}). Is arr[${j}] > key?`,
        codeLine: 3,
        arrayState: [...arr],
        comparingIndices: [j, j + 1],
        pointers: [
          { label: 'compare', index: j, color: 'text-amber-400' },
          { label: `key (${key})`, index: j + 1, color: 'text-violet-400' },
        ],
        actionType: 'compare',
      });

      if (arr[j] > key) {
        shiftCount++;
        arr[j + 1] = arr[j];

        steps.push({
          stepIndex: steps.length,
          description: `Since ${arr[j]} > ${key}, shift ${arr[j]} one spot right to index ${j + 1}.`,
          codeLine: 4,
          arrayState: [...arr],
          swappingIndices: [j, j + 1],
          pointers: [{ label: 'shifted', index: j + 1, color: 'text-cyan-400' }],
          actionType: 'swap',
        });

        j--;
      } else {
        steps.push({
          stepIndex: steps.length,
          description: `Since ${arr[j]} <= ${key}, found the correct insertion boundary.`,
          codeLine: 5,
          arrayState: [...arr],
          actionType: 'search',
        });
        break;
      }
    }

    arr[j + 1] = key;
    steps.push({
      stepIndex: steps.length,
      description: `Inserted key (${key}) at position ${j + 1}. Subarray 0..${i} is now sorted!`,
      codeLine: 6,
      arrayState: [...arr],
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
      pointers: [{ label: `inserted ${key}`, index: j + 1, color: 'text-emerald-400' }],
      actionType: 'insert',
    });
  }

  steps.push({
    stepIndex: steps.length,
    description: `Insertion Sort complete! Total comparisons: ${compCount}, total shifts: ${shiftCount}. Array is fully sorted.`,
    codeLine: 7,
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    actionType: 'done',
  });

  return steps;
}
