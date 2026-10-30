import { TopicMeta, LessonContent, PracticeChallenge } from '../types/dsa';

export const TOPICS: TopicMeta[] = [
  {
    id: 'arrays',
    title: 'Arrays & Memory',
    shortDesc: 'Contiguous memory allocation, indexing, in-place manipulation, and traversal.',
    fullDesc: 'The foundation of data structures. Learn how sequential memory layout provides instant O(1) random access, and examine the trade-offs of static sizing, shifting during insertion/deletion, and the two-pointer technique.',
    iconName: 'LayoutGrid',
    difficulty: 'Beginner',
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    lessonsCount: 2,
    challengesCount: 3,
    prerequisites: ['Basic Programming', 'Variables & Loops'],
    visualizerAlgoId: 'linear-search',
  },
  {
    id: 'searching',
    title: 'Searching Algorithms',
    shortDesc: 'Linear scanning vs divide-and-conquer logarithmic binary search.',
    fullDesc: 'Discover the mechanics of finding elements within datasets. Master Linear Search on unordered sequences (O(N)) and the exponential speedup of Binary Search on sorted sequences (O(log N)).',
    iconName: 'Search',
    difficulty: 'Beginner',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    lessonsCount: 2,
    challengesCount: 3,
    prerequisites: ['Arrays', 'Conditional Statements'],
    visualizerAlgoId: 'binary-search',
  },
  {
    id: 'sorting',
    title: 'Sorting Fundamentals',
    shortDesc: 'Bubble, Selection, and Insertion Sort: comparisons, swaps, and stability.',
    fullDesc: 'Understand how elements are systematically ordered. Explore elementary O(N²) quadratic sorts: Bubble Sort (bubbling inversions), Selection Sort (minimum extraction), and Insertion Sort (adaptive shifting).',
    iconName: 'ArrowUpDown',
    difficulty: 'Easy',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    lessonsCount: 3,
    challengesCount: 3,
    prerequisites: ['Arrays', 'Nested Loops'],
    visualizerAlgoId: 'bubble-sort',
  },
  {
    id: 'stacks',
    title: 'Stacks (LIFO)',
    shortDesc: 'Last-In, First-Out: Call stacks, parenthesis matching, and undo history.',
    fullDesc: 'A restricted linear structure where insertions and deletions happen exclusively at one end: the Top. Crucial for recursion management, expression parsing, and backtracking algorithms.',
    iconName: 'Layers',
    difficulty: 'Easy',
    badgeColor: 'border-violet-500/30 text-violet-400 bg-violet-500/10',
    lessonsCount: 2,
    challengesCount: 3,
    prerequisites: ['Arrays'],
    visualizerAlgoId: 'stack-viz',
  },
  {
    id: 'queues',
    title: 'Queues (FIFO)',
    shortDesc: 'First-In, First-Out: Task buffering, BFS graph traversal, and circular buffers.',
    fullDesc: 'A fair sequential structure where elements enter at the Rear (enqueue) and exit at the Front (dequeue). Explore linear array bottlenecks and the elegance of modulo circular queues.',
    iconName: 'GitCommitVertical',
    difficulty: 'Easy',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    lessonsCount: 2,
    challengesCount: 3,
    prerequisites: ['Arrays'],
    visualizerAlgoId: 'queue-viz',
  },
  {
    id: 'linked-lists',
    title: 'Singly Linked Lists',
    shortDesc: 'Dynamic node chains connected via memory pointers with O(1) head operations.',
    fullDesc: 'Overcome static contiguous memory limitations. Each node stores data and a pointer to the subsequent node. Learn pointer rewiring, NULL terminators, and traversal mechanics.',
    iconName: 'Share2',
    difficulty: 'Medium',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    lessonsCount: 2,
    challengesCount: 3,
    prerequisites: ['Pointers / Object References'],
    visualizerAlgoId: 'linked-list-viz',
  },
];

export const LESSONS: LessonContent[] = [
  {
    id: 'intro-arrays',
    topicId: 'arrays',
    title: 'Introduction to Arrays & Memory Layout',
    subtitle: 'Understanding contiguous memory, indexing formula, and cache locality',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    overview: 'An array is a linear collection of elements stored at contiguous (adjacent) memory locations. Because memory addresses are strictly sequential, accessing any element given its index takes immediate O(1) constant time via the address calculation formula.',
    analogy: 'Imagine a row of numbered lockers in a college corridor (Lockers 0 through 9). If you know locker 0 begins at corridor distance 100cm and each locker is 30cm wide, Locker #4 is directly at 100 + (4 * 30) = 220cm without inspecting lockers 1, 2, or 3.',
    keyConcepts: [
      'Contiguous Storage: Elements live right next to each other in RAM.',
      'Memory Formula: Address(arr[i]) = Base_Address + (i * Element_Byte_Size)',
      'O(1) Random Access: Instant retrieval when the index is known.',
      'Cache Friendly: Contiguous data triggers CPU hardware prefetching (spatial locality).'
    ],
    pseudocode: `// Accessing element at index k
function getElement(arr, k):
    if k < 0 or k >= arr.length:
        throw IndexOutOfBoundsError
    return arr[k] // O(1) operation

// Traversing an array
function printAll(arr):
    for i from 0 to arr.length - 1:
        print arr[i] // O(N) operation`,
    codeImplementations: [
      {
        language: 'cpp',
        code: `// C++: Fixed-size and dynamic vector
#include <iostream>
#include <vector>

int main() {
    // Static stack array
    int staticArr[5] = {10, 20, 30, 40, 50};
    std::cout << "Element at index 2: " << staticArr[2] << "\\n"; // 30

    // Dynamic array (std::vector)
    std::vector<int> numbers = {10, 20, 30};
    numbers.push_back(40); // Appends to end
    return 0;
}`
      },
      {
        language: 'python',
        code: `# Python: Dynamic Lists
numbers = [10, 20, 30, 40, 50]

# O(1) Instant random access
print(f"Index 2: {numbers[2]}") # 30

# O(N) Traversal
for idx, val in enumerate(numbers):
    print(f"Index {idx} contains {val}")`
      },
      {
        language: 'java',
        code: `// Java: Fixed-size array declaration
public class ArrayExample {
    public static void main(String[] args) {
        int[] scores = new int[]{10, 20, 30, 40, 50};
        
        // O(1) lookup
        System.out.println("Item: " + scores[2]); // 30
        System.out.println("Length: " + scores.length);
    }
}`
      },
      {
        language: 'typescript',
        code: `// TypeScript: Typed array
const scores: number[] = [10, 20, 30, 40, 50];

// O(1) Access
const thirdItem = scores[2]; // 30

// Read length
console.log('Size:', scores.length);`
      }
    ],
    complexity: {
      bestTime: 'O(1)',
      averageTime: 'O(1) Access / O(N) Search',
      worstTime: 'O(N) Search & Insert',
      spaceComplexity: 'O(N)',
      explanation: 'Accessing arr[i] is always O(1) because the CPU calculates the memory address in one arithmetic clock cycle. Searching an unsorted array for a value requires inspecting up to N elements (O(N)).'
    },
    checkQuestions: [
      {
        question: 'Why does accessing an element in an array by its index run in O(1) time?',
        options: [
          'Because the computer scans through each element from index 0 until it finds the match',
          'Because contiguous memory layout allows direct address computation: Base + index * size',
          'Because arrays are always sorted alphabetically',
          'Because elements are stored across a distributed hash cluster'
        ],
        correctIndex: 1,
        explanation: 'Contiguous memory allows the CPU to calculate the physical memory address using a simple multiplication: BaseAddress + (index * sizeof(type)).'
      },
      {
        question: 'What is the worst-case time complexity of inserting an element at index 0 of an array of size N?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
        correctIndex: 2,
        explanation: 'Inserting at index 0 requires shifting all existing N elements one position to the right to make room, which takes O(N) time.'
      }
    ]
  },
  {
    id: 'arrays-operations',
    topicId: 'arrays',
    title: 'Array Operations & Two-Pointer Technique',
    subtitle: 'Insertion, deletion, shifting costs, and in-place two-pointer transformations',
    difficulty: 'Easy',
    estimatedMinutes: 10,
    overview: 'While reading an array is instantaneous, modifying its contents (inserting or deleting in the middle) incurs element shifting. To solve array problems without creating auxiliary copies, engineers rely on the Two-Pointer technique (e.g. reversing an array, two-sum on sorted arrays).',
    analogy: 'Imagine people standing in a tight queue. If a new person cuts in at position #1, every single person behind them must step back one space. If the person at position #1 leaves, everyone behind them steps forward.',
    keyConcepts: [
      'Insertion at End: O(1) amortized when buffer capacity exists.',
      'Insertion/Deletion at Beginning: O(N) because every subsequent element must be shifted.',
      'Two-Pointer Technique: Using two index cursors (e.g. left and right) converging inward.',
      'In-Place Reversal: Swapping elements at left and right pointers in O(N) time and O(1) auxiliary space.'
    ],
    pseudocode: `// In-place Array Reversal using Two Pointers
function reverseArray(arr):
    left = 0
    right = arr.length - 1
    while left < right:
        swap(arr[left], arr[right])
        left = left + 1
        right = right - 1`,
    codeImplementations: [
      {
        language: 'python',
        code: `def reverse_array(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        # Swap elements in place
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr`
      },
      {
        language: 'cpp',
        code: `#include <vector>
#include <utility>

void reverseArray(std::vector<int>& arr) {
    int left = 0;
    int right = arr.size() - 1;
    while (left < right) {
        std::swap(arr[left], arr[right]);
        left++;
        right--;
    }
}`
      },
      {
        language: 'typescript',
        code: `function reverseArray(arr: number[]): number[] {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
  return arr;
}`
      },
      {
        language: 'java',
        code: `public class ArrayReverse {
    public static void reverse(int[] arr) {
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
}`
      }
    ],
    complexity: {
      bestTime: 'O(N)',
      averageTime: 'O(N)',
      worstTime: 'O(N)',
      spaceComplexity: 'O(1) Auxiliary',
      explanation: 'Reversing an array via two pointers visits N/2 pairs, resulting in O(N) time with zero extra heap allocations (O(1) space).'
    },
    checkQuestions: [
      {
        question: 'How many element swaps take place when reversing an array of size 7 using the two-pointer approach?',
        options: ['7 swaps', '3 swaps', '4 swaps', '0 swaps'],
        correctIndex: 1,
        explanation: 'Floor(7 / 2) = 3 swaps (indices 0↔6, 1↔5, 2↔4). The middle element at index 3 stays in place.'
      }
    ]
  },
  {
    id: 'searching-linear',
    topicId: 'searching',
    title: 'Linear Search: Exhaustive Inspection',
    subtitle: 'Sequentially scanning every element when order is unknown',
    difficulty: 'Beginner',
    estimatedMinutes: 6,
    overview: 'Linear Search is the most fundamental searching algorithm. It examines each element one-by-one from the first to the last until the target value is found or the collection is exhausted. It works on both sorted and unsorted collections.',
    analogy: 'Searching for a lost key in an unsorted backpack. You reach in and examine every single pocket in order until you either feel the key or confirm it is absent.',
    keyConcepts: [
      'Unordered Data: Does not require pre-sorting.',
      'Early Exit: Returns immediately as soon as target is matched.',
      'Worst Case: Target is at the very end or completely absent, requiring N checks.'
    ],
    pseudocode: `function linearSearch(arr, target):
    for i from 0 to arr.length - 1:
        if arr[i] == target:
            return i // Found at index i
    return -1 // Not found`,
    codeImplementations: [
      {
        language: 'python',
        code: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`
      },
      {
        language: 'cpp',
        code: `int linearSearch(const int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`
      },
      {
        language: 'typescript',
        code: `function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`
      },
      {
        language: 'java',
        code: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`
      }
    ],
    complexity: {
      bestTime: 'O(1) (Target is at index 0)',
      averageTime: 'O(N/2) = O(N)',
      worstTime: 'O(N) (Target absent or at last index)',
      spaceComplexity: 'O(1)',
      explanation: 'In the best case, the target is at index 0 (1 comparison). In the worst case, we must compare all N elements.'
    },
    checkQuestions: [
      {
        question: 'Under what condition does Linear Search achieve its best-case time complexity of O(1)?',
        options: [
          'When the array is sorted in descending order',
          'When the target element is located at the first index (index 0)',
          'When the array contains only even numbers',
          'When the array has size greater than 1,000,000'
        ],
        correctIndex: 1,
        explanation: 'If the target is at index 0, the first loop comparison arr[0] == target evaluates to true and immediately returns.'
      }
    ]
  },
  {
    id: 'searching-binary',
    topicId: 'searching',
    title: 'Binary Search: Divide & Conquer',
    subtitle: 'Halving the search space in sorted sequences in logarithmic time O(log N)',
    difficulty: 'Easy',
    estimatedMinutes: 9,
    overview: 'Binary Search is an extraordinarily efficient searching algorithm for sorted arrays. At each step, it compares the target with the middle element. Depending on whether the target is smaller or greater, it completely discards half of the remaining elements.',
    analogy: 'Looking up a name in a physical telephone directory. You open directly to the middle. If the name is "Miller" and you opened at "K", you discard the entire first half of the book and repeat on the right half.',
    keyConcepts: [
      'Precondition: The input array MUST be sorted.',
      'Logarithmic Efficiency: Searching 1,000,000 items takes at most 20 comparisons (log2(10^6) ≈ 19.93).',
      'Overflow-Safe Midpoint: Use low + (high - low) / 2 to avoid integer arithmetic overflow.'
    ],
    pseudocode: `function binarySearch(arr, target):
    low = 0
    high = arr.length - 1
    while low <= high:
        mid = low + floor((high - low) / 2)
        if arr[mid] == target:
            return mid
        else if arr[mid] < target:
            low = mid + 1 // Discard left half
        else:
            high = mid - 1 // Discard right half
    return -1`,
    codeImplementations: [
      {
        language: 'python',
        code: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
      },
      {
        language: 'cpp',
        code: `int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0;
    int high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
      },
      {
        language: 'typescript',
        code: `function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`
      },
      {
        language: 'java',
        code: `public static int binarySearch(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
      }
    ],
    complexity: {
      bestTime: 'O(1) (Target is exactly at the initial mid)',
      averageTime: 'O(log N)',
      worstTime: 'O(log N)',
      spaceComplexity: 'O(1) Iterative',
      explanation: 'With each comparison, the search space is cut in half: N -> N/2 -> N/4 ... -> 1. The number of divisions is log2(N).'
    },
    checkQuestions: [
      {
        question: 'If an array contains 1,024 sorted elements, what is the MAXIMUM number of comparisons Binary Search will perform?',
        options: ['1,024', '512', '11', '10'],
        correctIndex: 2,
        explanation: 'log2(1024) = 10, plus 1 check for boundary condition gives at most 11 comparisons.'
      }
    ]
  },
  {
    id: 'sorting-bubble',
    topicId: 'sorting',
    title: 'Bubble Sort: Adjacent Swaps & Bubbling',
    subtitle: 'Iteratively moving the largest unsorted element to the end',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    overview: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Pass after pass, the largest remaining value "bubbles up" to its correct position at the end of the array.',
    analogy: 'Carbonated bubbles rising to the top of a glass of soda. The largest air bubbles float upward the fastest.',
    keyConcepts: [
      'Adjacent Comparisons: Only compares pairs (arr[j], arr[j+1]).',
      'Invariant: After pass i, the last i elements are guaranteed to be in their final sorted positions.',
      'Optimization: If an entire pass completes without a single swap, the array is already sorted and we can exit early (O(N) best case).'
    ],
    pseudocode: `function bubbleSort(arr):
    n = arr.length
    for i from 0 to n - 2:
        swapped = false
        for j from 0 to n - 2 - i:
            if arr[j] > arr[j + 1]:
                swap(arr[j], arr[j + 1])
                swapped = true
        if not swapped:
            break // Early exit optimization`,
    codeImplementations: [
      {
        language: 'python',
        code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`
      },
      {
        language: 'cpp',
        code: `void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`
      },
      {
        language: 'typescript',
        code: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`
      },
      {
        language: 'java',
        code: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`
      }
    ],
    complexity: {
      bestTime: 'O(N) (Optimized when already sorted)',
      averageTime: 'O(N²)',
      worstTime: 'O(N²) (Reverse sorted array)',
      spaceComplexity: 'O(1) In-Place',
      explanation: 'In the worst case, (N-1) + (N-2) + ... + 1 = N(N-1)/2 comparisons and swaps take place, yielding quadratic O(N²) time.'
    },
    checkQuestions: [
      {
        question: 'What happens in an optimized Bubble Sort if no swaps are made during the first pass?',
        options: [
          'The algorithm resets from index 0',
          'The algorithm terminates immediately because the array is verified to be sorted',
          'The algorithm throws a runtime error',
          'It continues running all N-1 passes anyway'
        ],
        correctIndex: 1,
        explanation: 'If zero adjacent inversions are detected in a complete pass, no two adjacent elements are out of order, proving the list is sorted.'
      }
    ]
  },
  {
    id: 'sorting-selection',
    topicId: 'sorting',
    title: 'Selection Sort: Minimum Extraction',
    subtitle: 'Partitioning array into sorted and unsorted segments',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    overview: 'Selection Sort divides the array into a sorted subarray at the left and an unsorted subarray at the right. In each pass, it finds the smallest element in the unsorted portion and swaps it into the beginning of the unsorted segment.',
    analogy: 'Organizing playing cards by looking through your entire hand, finding the lowest card (e.g. Ace), and moving it to the leftmost slot.',
    keyConcepts: [
      'Minimal Swaps: Makes at most N - 1 swaps total, useful when write/swap operations are expensive (e.g. Flash EEPROM memory).',
      'Non-Adaptive: Performs O(N²) comparisons even if the array is already sorted.',
      'Unstable: Default implementation may swap identical keys across positions.'
    ],
    pseudocode: `function selectionSort(arr):
    n = arr.length
    for i from 0 to n - 2:
        minIdx = i
        for j from i + 1 to n - 1:
            if arr[j] < arr[minIdx]:
                minIdx = j
        if minIdx != i:
            swap(arr[i], arr[minIdx])`,
    codeImplementations: [
      {
        language: 'python',
        code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
      },
      {
        language: 'cpp',
        code: `void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) std::swap(arr[i], arr[minIdx]);
    }
}`
      },
      {
        language: 'typescript',
        code: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`
      },
      {
        language: 'java',
        code: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`
      }
    ],
    complexity: {
      bestTime: 'O(N²)',
      averageTime: 'O(N²)',
      worstTime: 'O(N²)',
      spaceComplexity: 'O(1) In-Place',
      explanation: 'Selection Sort always checks all remaining elements to find the true minimum, meaning it performs N(N-1)/2 comparisons regardless of initial ordering.'
    },
    checkQuestions: [
      {
        question: 'What is a key advantage of Selection Sort over Bubble Sort?',
        options: [
          'It has O(N log N) worst-case time',
          'It performs at most O(N) swaps, minimizing write operations',
          'It is always stable',
          'It automatically divides the list recursively'
        ],
        correctIndex: 1,
        explanation: 'Selection Sort performs at most one swap per outer pass (N - 1 swaps total), whereas Bubble Sort can perform up to O(N²) swaps.'
      }
    ]
  },
  {
    id: 'sorting-insertion',
    topicId: 'sorting',
    title: 'Insertion Sort: Adaptive Shifting',
    subtitle: 'Building the sorted array one element at a time',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    overview: 'Insertion Sort iterates through an input array and removes one element per iteration, finding the location it belongs within the already-sorted prefix and inserting it there. It is highly efficient for small or nearly sorted lists.',
    analogy: 'Sorting playing cards in your hand as they are dealt. When you pick up a new card, you slide it left past cards that are greater until you find where it slips in.',
    keyConcepts: [
      'Adaptive: Runs in linear O(N) time when the input is already sorted.',
      'Stable: Never swaps equal elements past one another.',
      'Online Algorithm: Can sort a list as it receives pieces in real-time.'
    ],
    pseudocode: `function insertionSort(arr):
    for i from 1 to arr.length - 1:
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j] // Shift right
            j = j - 1
        arr[j + 1] = key`,
    codeImplementations: [
      {
        language: 'python',
        code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
      },
      {
        language: 'cpp',
        code: `void insertionSort(std::vector<int>& arr) {
    for (size_t i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
      },
      {
        language: 'typescript',
        code: `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`
      },
      {
        language: 'java',
        code: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
      }
    ],
    complexity: {
      bestTime: 'O(N) (Already sorted)',
      averageTime: 'O(N²)',
      worstTime: 'O(N²) (Reverse sorted)',
      spaceComplexity: 'O(1)',
      explanation: 'When the array is already sorted, the inner while loop condition fails immediately on each step, taking only 1 comparison per element (N - 1 total).'
    },
    checkQuestions: [
      {
        question: 'Which sorting algorithm is the component of choice inside Timsort and Introsort for small partitions?',
        options: ['Bubble Sort', 'Insertion Sort', 'Selection Sort', 'Bogosort'],
        correctIndex: 1,
        explanation: 'Due to low constant factors and O(N) adaptive performance on nearly sorted subarrays, Insertion Sort is used for small subproblems in modern production hybrid sorts.'
      }
    ]
  },
  {
    id: 'stacks-fundamentals',
    topicId: 'stacks',
    title: 'Stack Architecture: LIFO Mechanics',
    subtitle: 'Push, pop, peek, and call stack mechanics',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    overview: 'A Stack is a linear data structure following the Last-In, First-Out (LIFO) protocol. The last element added to the stack is the first one to be removed. All operations occur at a single end termed the Top.',
    analogy: 'A spring-loaded cafeteria plate dispenser. You place new clean plates on top of the stack, and students take plates off the very top.',
    keyConcepts: [
      'Push: Insert an item on top of the stack (O(1)).',
      'Pop: Remove and return the top item (O(1)).',
      'Peek: View top item without removing it (O(1)).',
      'Stack Underflow: Popping an empty stack.',
      'Stack Overflow: Pushing onto a stack whose allocated memory is exhausted.'
    ],
    pseudocode: `class Stack:
    items = []

    function push(val):
        items.append(val) // O(1)

    function pop():
        if isEmpty():
            throw UnderflowError
        return items.removeLast() // O(1)

    function peek():
        if isEmpty():
            throw UnderflowError
        return items[items.length - 1] // O(1)

    function isEmpty():
        return items.length == 0`,
    codeImplementations: [
      {
        language: 'python',
        code: `class Stack:
    def __init__(self):
        self.items = []
        
    def push(self, val):
        self.items.append(val)
        
    def pop(self):
        if not self.items:
            raise IndexError("Stack Underflow")
        return self.items.pop()
        
    def peek(self):
        return self.items[-1] if self.items else None`
      },
      {
        language: 'cpp',
        code: `#include <iostream>
#include <stack>

int main() {
    std::stack<int> s;
    s.push(10);
    s.push(20);
    std::cout << "Top: " << s.top() << "\\n"; // 20
    s.pop();
    std::cout << "Top after pop: " << s.top() << "\\n"; // 10
    return 0;
}`
      },
      {
        language: 'typescript',
        code: `class Stack<T> {
  private data: T[] = [];

  push(item: T): void {
    this.data.push(item);
  }

  pop(): T | undefined {
    return this.data.pop();
  }

  peek(): T | undefined {
    return this.data[this.data.length - 1];
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }
}`
      },
      {
        language: 'java',
        code: `import java.util.ArrayDeque;
import java.util.Deque;

public class StackDemo {
    public static void main(String[] args) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(10);
        stack.push(20);
        System.out.println("Top: " + stack.peek()); // 20
        stack.pop();
    }
}`
      }
    ],
    complexity: {
      bestTime: 'O(1) for push, pop, peek',
      averageTime: 'O(1)',
      worstTime: 'O(1)',
      spaceComplexity: 'O(N)',
      explanation: 'All stack operations touch only the element at the top pointer, making push, pop, and peek strictly constant time O(1).'
    },
    checkQuestions: [
      {
        question: 'If a stack executes push(1), push(2), pop(), push(3), push(4), pop(), what element is currently at the top?',
        options: ['1', '2', '3', '4'],
        correctIndex: 2,
        explanation: 'Trace: push 1 -> [1]; push 2 -> [1, 2]; pop 2 -> [1]; push 3 -> [1, 3]; push 4 -> [1, 3, 4]; pop 4 -> [1, 3]. Top is 3.'
      }
    ]
  },
  {
    id: 'queues-fundamentals',
    topicId: 'queues',
    title: 'Queue Mechanics: FIFO Operations',
    subtitle: 'Enqueue at rear, dequeue from front, circular buffer mechanics',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    overview: 'A Queue is a linear data structure adhering strictly to First-In, First-Out (FIFO). The first element added is the first one to be removed. Elements enter at the Rear (enqueue) and exit from the Front (dequeue).',
    analogy: 'A ticket counter line at a cinema. The first person in line gets their ticket and leaves first. New arrivals join the back of the queue.',
    keyConcepts: [
      'Enqueue: Insert an element at the rear (O(1)).',
      'Dequeue: Remove the element at the front (O(1)).',
      'Circular Array: Using (rear + 1) % capacity avoids wasting vacated front slots in fixed-size arrays.'
    ],
    pseudocode: `class CircularQueue:
    front = 0
    rear = 0
    size = 0
    capacity = K
    arr = array of size K

    function enqueue(val):
        if size == capacity: throw OverflowError
        arr[rear] = val
        rear = (rear + 1) % capacity
        size = size + 1

    function dequeue():
        if size == 0: throw UnderflowError
        val = arr[front]
        front = (front + 1) % capacity
        size = size - 1
        return val`,
    codeImplementations: [
      {
        language: 'python',
        code: `from collections import deque

# Python collections.deque provides O(1) appends and pops on both ends
queue = deque()
queue.append(10) # Enqueue
queue.append(20)
print(queue.popleft()) # Dequeue -> 10`
      },
      {
        language: 'cpp',
        code: `#include <iostream>
#include <queue>

int main() {
    std::queue<int> q;
    q.push(10); // Enqueue
    q.push(20);
    std::cout << "Front: " << q.front() << "\\n"; // 10
    q.pop(); // Dequeue
    return 0;
}`
      },
      {
        language: 'typescript',
        code: `class Queue<T> {
  private data: T[] = [];

  enqueue(item: T): void {
    this.data.push(item);
  }

  dequeue(): T | undefined {
    return this.data.shift(); // O(N) in simple array, O(1) in linked/circular
  }

  front(): T | undefined {
    return this.data[0];
  }
}`
      },
      {
        language: 'java',
        code: `import java.util.LinkedList;
import java.util.Queue;

public class QueueDemo {
    public static void main(String[] args) {
        Queue<Integer> q = new LinkedList<>();
        q.offer(10);
        q.offer(20);
        System.out.println("Front: " + q.poll()); // 10
    }
}`
      }
    ],
    complexity: {
      bestTime: 'O(1) Enqueue and Dequeue',
      averageTime: 'O(1)',
      worstTime: 'O(1)',
      spaceComplexity: 'O(N)',
      explanation: 'With a circular array or doubly linked list, both enqueue at the rear and dequeue at the front are constant time O(1).'
    },
    checkQuestions: [
      {
        question: 'In a circular queue with array capacity 5, if rear is at index 4, what is the next rear position after enqueue?',
        options: ['5', '0', '4', '-1'],
        correctIndex: 1,
        explanation: 'Using modulo arithmetic: (4 + 1) % 5 = 5 % 5 = 0. The rear pointer wraps around to index 0.'
      }
    ]
  },
  {
    id: 'linkedlists-singly',
    topicId: 'linked-lists',
    title: 'Singly Linked Lists: Dynamic Pointer Chains',
    subtitle: 'Node anatomy, next pointers, head operations, and traversal',
    difficulty: 'Medium',
    estimatedMinutes: 10,
    overview: 'Unlike arrays where elements are packed contiguously in memory, a Linked List consists of separate nodes allocated dynamically anywhere on the heap. Each node stores a data value and a pointer (reference) pointing to the next node.',
    analogy: 'A treasure hunt. Clue #1 contains a message and directions to the location of Clue #2. Clue #2 points to Clue #3, until you reach a box marked "End" (NULL).',
    keyConcepts: [
      'Node Anatomy: struct Node { int data; Node* next; };',
      'Head Pointer: The single entry point to the list.',
      'O(1) Head Insertion: Attaching a node before head takes constant time.',
      'O(N) Sequential Access: Must traverse sequentially from head to reach index k.'
    ],
    pseudocode: `class Node:
    data = 0
    next = null

function insertAtHead(head, val):
    newNode = new Node(val)
    newNode.next = head
    return newNode // new head

function traverse(head):
    curr = head
    while curr != null:
        print curr.data
        curr = curr.next`,
    codeImplementations: [
      {
        language: 'cpp',
        code: `struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

Node* insertAtHead(Node* head, int val) {
    Node* newNode = new Node(val);
    newNode->next = head;
    return newNode;
}`
      },
      {
        language: 'python',
        code: `class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def insert_at_head(head, val):
    new_node = Node(val, head)
    return new_node`
      },
      {
        language: 'typescript',
        code: `interface ListNode {
  val: number;
  next: ListNode | null;
}

function insertAtHead(head: ListNode | null, val: number): ListNode {
  return { val, next: head };
}`
      },
      {
        language: 'java',
        code: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; next = null; }
}

public class LinkedListDemo {
    public static ListNode insertAtHead(ListNode head, int val) {
        ListNode newNode = new ListNode(val);
        newNode.next = head;
        return newNode;
    }
}`
      }
    ],
    complexity: {
      bestTime: 'O(1) Insert/Delete at Head',
      averageTime: 'O(N) Access/Search',
      worstTime: 'O(N) Traversal to Tail',
      spaceComplexity: 'O(N) (Extra memory for pointers)',
      explanation: 'Inserting at head is O(1) because no elements are shifted. Finding element at index k requires traversing k pointers, taking O(k) = O(N) time.'
    },
    checkQuestions: [
      {
        question: 'Why can we NOT perform Binary Search on a standard Singly Linked List in O(log N) time?',
        options: [
          'Because linked lists cannot hold numbers',
          'Because finding the middle element requires O(N) sequential pointer traversal, destroying the O(1) midpoint access required by Binary Search',
          'Because linked lists are always circular',
          'Because nodes do not have values'
        ],
        correctIndex: 1,
        explanation: 'Binary Search requires O(1) random access to the midpoint. In a linked list, finding the midpoint requires traversing N/2 nodes in O(N) time.'
      }
    ]
  }
];

export const CHALLENGES: PracticeChallenge[] = [
  // Arrays
  {
    id: 'arr-ch-1',
    topicId: 'arrays',
    title: 'Array Memory Offset Formula',
    difficulty: 'Easy',
    points: 20,
    description: 'An integer array starts at memory address 4000. Each integer occupies 4 bytes. What is the exact physical memory address of arr[5]?',
    type: 'trace-output',
    exampleInput: 'Base Address = 4000, Element Size = 4 bytes, Index = 5',
    exampleOutput: '4020',
    correctAnswer: '4020',
    explanation: 'Address = BaseAddress + (index * size) = 4000 + (5 * 4) = 4000 + 20 = 4020.',
    hints: [
      'Remember arrays are 0-indexed: index 0 is at 4000.',
      'Multiply the index (5) by the size of each element in bytes (4).',
      'Add the resulting byte offset to the base address 4000.'
    ]
  },
  {
    id: 'arr-ch-2',
    topicId: 'arrays',
    title: 'In-Place Reverse Trace',
    difficulty: 'Easy',
    points: 25,
    description: 'Given the array [14, 28, 35, 42, 59], what will the array look like after EXACTLY ONE SWAP in the standard two-pointer reversal algorithm?',
    type: 'multiple-choice',
    options: [
      '[59, 28, 35, 42, 14]',
      '[28, 14, 35, 42, 59]',
      '[14, 42, 35, 28, 59]',
      '[59, 42, 35, 28, 14]'
    ],
    correctAnswer: '[59, 28, 35, 42, 14]',
    explanation: 'The first swap occurs between left=0 (14) and right=4 (59), yielding [59, 28, 35, 42, 14].',
    hints: [
      'Left pointer starts at index 0 and right pointer starts at index 4.',
      'Which two values are exchanged first?'
    ]
  },
  {
    id: 'arr-ch-3',
    topicId: 'arrays',
    title: 'Kadane Max Subarray Logic',
    difficulty: 'Medium',
    points: 35,
    description: 'In Kadane\'s algorithm for Maximum Subarray, when deciding whether to extend the previous subarray or start a new one at current element x, what is the update condition?',
    type: 'multiple-choice',
    options: [
      'current_sum = max(x, current_sum + x)',
      'current_sum = min(x, current_sum + x)',
      'current_sum = current_sum * x',
      'current_sum = x - current_sum'
    ],
    correctAnswer: 'current_sum = max(x, current_sum + x)',
    explanation: 'If extending the subarray (current_sum + x) yields less than x alone (meaning current_sum was negative), we drop the previous subarray and restart at x.',
    hints: [
      'Think about what happens if current_sum has become negative.',
      'Adding a negative sum to x only makes things worse than starting fresh at x.'
    ]
  },

  // Searching
  {
    id: 'search-ch-1',
    topicId: 'searching',
    title: 'Binary Search Midpoint Trace',
    difficulty: 'Easy',
    points: 25,
    description: 'Given sorted array [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] and target = 23. What is the value of arr[mid] on the FIRST comparison?',
    type: 'trace-output',
    exampleInput: 'Array size = 10 (indices 0..9), low = 0, high = 9',
    exampleOutput: '16',
    correctAnswer: '16',
    explanation: 'low = 0, high = 9. mid = floor((0 + 9) / 2) = floor(4.5) = 4. arr[4] = 16.',
    hints: [
      'Indices run from 0 to 9.',
      'Mid calculation uses integer division floor((0 + 9) / 2) = 4.',
      'Look up element at index 4 in the provided array.'
    ]
  },
  {
    id: 'search-ch-2',
    topicId: 'searching',
    title: 'Integer Overflow in Midpoint Formula',
    difficulty: 'Medium',
    points: 30,
    description: 'In languages with 32-bit signed integers (like C++ or Java), `(low + high) / 2` can trigger arithmetic overflow if low + high exceeds 2,147,483,647. What is the safe alternative formula?',
    type: 'multiple-choice',
    options: [
      'low + (high - low) / 2',
      '(low * high) / 2',
      'high - (low + high) / 2',
      '(low + high) * 2'
    ],
    correctAnswer: 'low + (high - low) / 2',
    explanation: 'low + (high - low) / 2 is mathematically identical to (low + high) / 2, but subtracts high - low first, completely avoiding overflow.',
    hints: [
      'We want a subtraction first so the number never exceeds high.',
      'Notice that low + (high - low)/2 = (2*low + high - low)/2 = (low + high)/2.'
    ]
  },
  {
    id: 'search-ch-3',
    topicId: 'searching',
    title: 'Linear Search Comparisons for Missing Target',
    difficulty: 'Easy',
    points: 20,
    description: 'If you run standard Linear Search for target = 99 on an unsorted array with 15 elements, and 99 is NOT present, how many comparisons occur?',
    type: 'trace-output',
    exampleInput: 'Unsorted array of size 15, target absent',
    exampleOutput: '15',
    correctAnswer: '15',
    explanation: 'Because the array is unsorted, Linear Search must inspect every single element from index 0 to 14 before determining the element is absent (15 comparisons).',
    hints: [
      'Can Linear Search stop early if the array is unsorted and the item is missing?',
      'It must verify every single position.'
    ]
  },

  // Sorting
  {
    id: 'sort-ch-1',
    topicId: 'sorting',
    title: 'Bubble Sort Pass 1 Result',
    difficulty: 'Easy',
    points: 25,
    description: 'Given the array [5, 1, 4, 2, 8], what is the exact state of the array after the FIRST complete pass of Bubble Sort?',
    type: 'multiple-choice',
    options: [
      '[1, 4, 2, 5, 8]',
      '[1, 2, 4, 5, 8]',
      '[5, 1, 2, 4, 8]',
      '[4, 1, 2, 5, 8]'
    ],
    correctAnswer: '[1, 4, 2, 5, 8]',
    explanation: 'Step 1: (5,1) swap -> [1,5,4,2,8]. Step 2: (5,4) swap -> [1,4,5,2,8]. Step 3: (5,2) swap -> [1,4,2,5,8]. Step 4: (5,8) no swap -> [1,4,2,5,8].',
    hints: [
      'Trace adjacent comparisons: (5,1), (5,4), (5,2), (5,8).',
      '5 bubbles to index 3, and 8 stays at index 4.'
    ]
  },
  {
    id: 'sort-ch-2',
    topicId: 'sorting',
    title: 'Selection Sort Swap Efficiency',
    difficulty: 'Medium',
    points: 30,
    description: 'For an array of N elements in the absolute worst case (reverse sorted), what is the MAXIMUM number of swaps performed by Selection Sort?',
    type: 'multiple-choice',
    options: [
      'N - 1',
      'N(N - 1) / 2',
      'N²',
      '2N'
    ],
    correctAnswer: 'N - 1',
    explanation: 'Selection Sort performs at most one swap per outer loop pass (from i = 0 to N - 2), so it never performs more than N - 1 swaps total.',
    hints: [
      'How many times does the swap code line execute in Selection Sort?',
      'It sits outside the inner j loop.'
    ]
  },
  {
    id: 'sort-ch-3',
    topicId: 'sorting',
    title: 'Adaptive Nature of Insertion Sort',
    difficulty: 'Easy',
    points: 20,
    description: 'What is the time complexity of Insertion Sort when executed on an array that is ALREADY sorted in ascending order?',
    type: 'multiple-choice',
    options: [
      'O(N)',
      'O(N log N)',
      'O(N²)',
      'O(1)'
    ],
    correctAnswer: 'O(N)',
    explanation: 'For an already sorted array, each element is compared once with its predecessor (arr[j] > key is false immediately), taking only N - 1 comparisons.',
    hints: [
      'Does the inner while loop shift any elements if arr[j] is already less than key?',
      'It breaks immediately.'
    ]
  },

  // Stacks
  {
    id: 'stack-ch-1',
    topicId: 'stacks',
    title: 'Stack Operations Trace',
    difficulty: 'Easy',
    points: 25,
    description: 'An initially empty stack undergoes the following sequence: push(10), push(20), pop(), push(30), push(40), pop(), pop(). What value was returned by the LAST pop()?',
    type: 'trace-output',
    exampleInput: 'push(10), push(20), pop(), push(30), push(40), pop(), pop()',
    exampleOutput: '30',
    correctAnswer: '30',
    explanation: 'Trace: push(10)->[10]; push(20)->[10,20]; pop()->returns 20, stack=[10]; push(30)->[10,30]; push(40)->[10,30,40]; pop()->returns 40, stack=[10,30]; pop()->returns 30.',
    hints: [
      'Remember Last-In, First-Out (LIFO).',
      'After popping 40, what is at the top of the stack?'
    ]
  },
  {
    id: 'stack-ch-2',
    topicId: 'stacks',
    title: 'Valid Parentheses Matching Rule',
    difficulty: 'Medium',
    points: 30,
    description: 'When validating matched brackets like "{[()]}", when an opening bracket is encountered, what stack operation is performed?',
    type: 'multiple-choice',
    options: [
      'Push the opening bracket (or expected closing bracket) onto the stack',
      'Pop from the stack',
      'Clear the entire stack',
      'Sort the stack'
    ],
    correctAnswer: 'Push the opening bracket (or expected closing bracket) onto the stack',
    explanation: 'Opening brackets are pushed so that when the corresponding closing bracket arrives later, we can pop and verify that they match.',
    hints: [
      'Opening brackets wait until their partner closing bracket arrives.'
    ]
  },
  {
    id: 'stack-ch-3',
    topicId: 'stacks',
    title: 'Stack Underflow Detection Invariant',
    difficulty: 'Medium',
    points: 30,
    description: 'Before calling pop() or peek() on a stack, which boolean condition MUST evaluate to false to guarantee that a Stack Underflow error does not occur?',
    type: 'multiple-choice',
    options: [
      'isEmpty()',
      'isFull()',
      'size() > 10',
      'top == capacity - 1'
    ],
    correctAnswer: 'isEmpty()',
    explanation: 'Popping or peeking an empty stack (where isEmpty() is true or top == -1) triggers a Stack Underflow error. Verifying !isEmpty() guarantees an element exists.',
    hints: [
      'Think about the condition when there are zero items remaining in the stack.',
      'Underflow occurs when attempting to remove from an empty container.'
    ]
  },

  // Queues
  {
    id: 'queue-ch-1',
    topicId: 'queues',
    title: 'Queue FIFO Evaluation',
    difficulty: 'Easy',
    points: 25,
    description: 'An initially empty queue undergoes: enqueue(A), enqueue(B), dequeue(), enqueue(C), enqueue(D), dequeue(). Which element is currently at the FRONT of the queue?',
    type: 'multiple-choice',
    options: ['C', 'D', 'B', 'A'],
    correctAnswer: 'C',
    explanation: 'Queue: [A] -> [A, B] -> dequeue A gives [B] -> [B, C] -> [B, C, D] -> dequeue B gives [C, D]. Front is C.',
    hints: [
      'Queues are First-In, First-Out: the earliest element dequeues first.',
      'A dequeued first, then B dequeued next.'
    ]
  },
  {
    id: 'queue-ch-2',
    topicId: 'queues',
    title: 'Circular Queue Index Calculation',
    difficulty: 'Medium',
    points: 30,
    description: 'A circular queue implemented using a fixed-size array of capacity 8 currently has its rear pointer at index 7. When the next element is enqueued, what is its new rear index?',
    type: 'trace-output',
    exampleInput: 'rear = 7, capacity = 8',
    exampleOutput: '0',
    correctAnswer: '0',
    explanation: 'In a circular queue, the next index wraps around using modulo arithmetic: (rear + 1) % capacity = (7 + 1) % 8 = 8 % 8 = 0.',
    hints: [
      'Recall the circular wrap formula: (current_index + 1) % capacity.',
      '7 + 1 = 8. What is 8 modulo 8?'
    ]
  },
  {
    id: 'queue-ch-3',
    topicId: 'queues',
    title: 'Queue via Two Stacks Invariant',
    difficulty: 'Hard',
    points: 35,
    description: 'When implementing a FIFO Queue using two LIFO Stacks (stack_in and stack_out), in order to perform a dequeue() operation when stack_out is empty, what must be done?',
    type: 'multiple-choice',
    options: [
      'Pop all elements from stack_in and push them onto stack_out, then pop from stack_out',
      'Push a null element onto stack_in',
      'Clear both stacks completely',
      'Reverse stack_out directly in place'
    ],
    correctAnswer: 'Pop all elements from stack_in and push them onto stack_out, then pop from stack_out',
    explanation: 'Popping all elements from stack_in and pushing them onto stack_out reverses their order twice (LIFO + LIFO = FIFO). The top of stack_out is now the oldest element, which can be popped in O(1) amortized time.',
    hints: [
      'Reversing a reversed order restores the original First-In, First-Out sequence.',
      'Transferring elements from input stack to output stack inverts the LIFO order.'
    ]
  },

  // Linked Lists
  {
    id: 'll-ch-1',
    topicId: 'linked-lists',
    title: 'Head Insertion Time Complexity',
    difficulty: 'Easy',
    points: 20,
    description: 'What is the time complexity of inserting a new node at the HEAD (beginning) of a Singly Linked List of length N?',
    type: 'multiple-choice',
    options: [
      'O(1)',
      'O(N)',
      'O(log N)',
      'O(N²)'
    ],
    correctAnswer: 'O(1)',
    explanation: 'We only need to set newNode.next = head and head = newNode. No elements need to be shifted, which takes constant O(1) time.',
    hints: [
      'Do you need to traverse the other nodes to attach at the head?'
    ]
  },
  {
    id: 'll-ch-2',
    topicId: 'linked-lists',
    title: 'Pointer Rewiring Traversal Bug',
    difficulty: 'Medium',
    points: 35,
    description: 'When deleting the node right after `curr` in a Singly Linked List (`curr -> target -> nextNode`), what is the correct pointer assignment to remove target?',
    type: 'multiple-choice',
    options: [
      'curr.next = curr.next.next',
      'curr = curr.next',
      'curr.next = curr',
      'curr.next = null'
    ],
    correctAnswer: 'curr.next = curr.next.next',
    explanation: 'Bypassing `target` requires linking `curr.next` directly to `curr.next.next` (which is `nextNode`).',
    hints: [
      'You want curr.next to bypass the deleted node and point to the node following it.'
    ]
  },
  {
    id: 'll-ch-3',
    topicId: 'linked-lists',
    title: 'Finding the Middle Node (Tortoise & Hare)',
    difficulty: 'Medium',
    points: 30,
    description: 'Using Floyd\'s Tortoise and Hare two-pointer algorithm on a linked list with N nodes, if the fast pointer advances 2 nodes per step, how many nodes does the slow pointer advance per step?',
    type: 'trace-output',
    exampleInput: 'fast pointer speed = 2 nodes/step',
    exampleOutput: '1',
    correctAnswer: '1',
    explanation: 'The slow pointer advances 1 node per step while the fast pointer advances 2 nodes per step. When the fast pointer reaches the end, the slow pointer is precisely at the midpoint.',
    hints: [
      'Fast travels twice as fast as slow.',
      'If fast moves 2 steps, slow moves 1 step.'
    ]
  }
];
