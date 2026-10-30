export type TopicId = 'arrays' | 'searching' | 'sorting' | 'stacks' | 'queues' | 'linked-lists';

export type Difficulty = 'Beginner' | 'Easy' | 'Medium' | 'Hard';

export interface ComplexityInfo {
  bestTime: string;
  averageTime: string;
  worstTime: string;
  spaceComplexity: string;
  explanation: string;
}

export interface LessonContent {
  id: string;
  topicId: TopicId;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  overview: string;
  analogy: string;
  keyConcepts: string[];
  pseudocode: string;
  codeImplementations: {
    language: 'cpp' | 'python' | 'java' | 'typescript';
    code: string;
  }[];
  complexity: ComplexityInfo;
  checkQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface TopicMeta {
  id: TopicId;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  difficulty: Difficulty;
  badgeColor: string;
  lessonsCount: number;
  challengesCount: number;
  prerequisites: string[];
  visualizerAlgoId: string;
}

export interface PracticeChallenge {
  id: string;
  topicId: TopicId;
  title: string;
  difficulty: Difficulty;
  points: number;
  description: string;
  codeSnippet?: string;
  type: 'multiple-choice' | 'trace-output' | 'fill-blank' | 'complexity';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hints: string[];
  exampleInput?: string;
  exampleOutput?: string;
}

export interface VisualizerStep {
  stepIndex: number;
  description: string;
  codeLine: number;
  arrayState?: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  visitedIndices?: number[];
  pointers?: {
    label: string;
    index: number;
    color?: string;
  }[];
  targetValue?: number;
  foundIndex?: number | null;
  // Specific data for Stack / Queue / Linked List
  stackState?: (string | number)[];
  queueState?: (string | number)[];
  listState?: { id: string; value: number }[];
  activeNodeId?: string;
  activePointers?: { name: string; targetId: string }[];
  actionType?: 'compare' | 'swap' | 'insert' | 'delete' | 'search' | 'push' | 'pop' | 'enqueue' | 'dequeue' | 'done';
}

export interface UserProgress {
  completedLessons: string[]; // lesson ids
  solvedChallenges: string[]; // challenge ids
  challengeAttempts: {
    challengeId: string;
    timestamp: string;
    isCorrect: boolean;
    pointsAwarded: number;
    userAnswer: string;
  }[];
  totalXP: number;
  streakDays: number;
  lastActiveDate: string;
}
