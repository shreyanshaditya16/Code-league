import { UserProgress } from '../types/dsa';

const STORAGE_KEY = 'codeleague_user_progress_v1';

export const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: ['intro-arrays'],
  solvedChallenges: [],
  challengeAttempts: [],
  totalXP: 50, // Starting bonus for joining the league!
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export interface ImportValidationResult {
  valid: boolean;
  message: string;
  parsed?: UserProgress;
  preview?: {
    lessonsCount: number;
    challengesCount: number;
    attemptsCount: number;
    totalXP: number;
    streakDays: number;
  };
}

// Dispatch custom event so all open views update simultaneously
function notifyProgressChange(progress: UserProgress) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('codeleague:progress_updated', { detail: progress }));
  }
}

/**
 * Validates and sanitizes a candidate UserProgress object
 */
function sanitizeProgress(candidate: any): UserProgress {
  if (!candidate || typeof candidate !== 'object') {
    return { ...DEFAULT_PROGRESS };
  }

  const completedLessons = Array.isArray(candidate.completedLessons)
    ? candidate.completedLessons.filter((item: any) => typeof item === 'string' && item.trim().length > 0)
    : [...DEFAULT_PROGRESS.completedLessons];

  const solvedChallenges = Array.isArray(candidate.solvedChallenges)
    ? candidate.solvedChallenges.filter((item: any) => typeof item === 'string' && item.trim().length > 0)
    : [];

  const challengeAttempts = Array.isArray(candidate.challengeAttempts)
    ? candidate.challengeAttempts
        .filter((att: any) => att && typeof att === 'object' && typeof att.challengeId === 'string')
        .slice(0, 100) // Keep reasonable log limit
        .map((att: any) => ({
          challengeId: String(att.challengeId),
          timestamp: typeof att.timestamp === 'string' ? att.timestamp : new Date().toISOString(),
          isCorrect: Boolean(att.isCorrect),
          pointsAwarded: typeof att.pointsAwarded === 'number' && !isNaN(att.pointsAwarded) ? Math.max(0, att.pointsAwarded) : 0,
          userAnswer: typeof att.userAnswer === 'string' ? att.userAnswer : String(att.userAnswer ?? ''),
        }))
    : [];

  const totalXP = typeof candidate.totalXP === 'number' && !isNaN(candidate.totalXP) && candidate.totalXP >= 0
    ? Math.floor(candidate.totalXP)
    : DEFAULT_PROGRESS.totalXP;

  const streakDays = typeof candidate.streakDays === 'number' && !isNaN(candidate.streakDays) && candidate.streakDays >= 1
    ? Math.floor(candidate.streakDays)
    : 1;

  let lastActiveDate = typeof candidate.lastActiveDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(candidate.lastActiveDate)
    ? candidate.lastActiveDate
    : new Date().toISOString().split('T')[0];

  return {
    completedLessons: completedLessons.length > 0 ? completedLessons : [...DEFAULT_PROGRESS.completedLessons],
    solvedChallenges,
    challengeAttempts,
    totalXP,
    streakDays,
    lastActiveDate,
  };
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROGRESS));
      return DEFAULT_PROGRESS;
    }

    const rawParsed = JSON.parse(raw);
    const parsed = sanitizeProgress(rawParsed);

    // Calculate streak update safely
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastActiveDate !== today) {
      const lastDate = new Date(parsed.lastActiveDate);
      const currDate = new Date(today);
      if (!isNaN(lastDate.getTime()) && !isNaN(currDate.getTime())) {
        const diffDays = Math.floor((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          parsed.streakDays += 1;
        } else if (diffDays > 1) {
          parsed.streakDays = 1;
        }
      }
      parsed.lastActiveDate = today;
      saveProgress(parsed);
    }

    return parsed;
  } catch (e) {
    console.error('Failed to read or parse progress from localStorage, recovering with default:', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    const sanitized = sanitizeProgress(progress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    notifyProgressChange(sanitized);
  } catch (e) {
    console.error('Failed to save progress to localStorage:', e);
  }
}

export function markLessonCompleted(lessonId: string): UserProgress {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    progress.totalXP += 30; // +30 XP per completed lesson
    saveProgress(progress);
  }
  return progress;
}

export function recordChallengeAttempt(
  challengeId: string,
  isCorrect: boolean,
  points: number,
  userAnswer: string
): UserProgress {
  const progress = getProgress();
  const alreadySolved = progress.solvedChallenges.includes(challengeId);

  // Prevent duplicate XP awards on repeat submissions
  const pointsAwarded = isCorrect && !alreadySolved ? points : 0;

  if (isCorrect && !alreadySolved) {
    progress.solvedChallenges.push(challengeId);
    progress.totalXP += pointsAwarded;
  }

  progress.challengeAttempts.unshift({
    challengeId,
    timestamp: new Date().toISOString(),
    isCorrect,
    pointsAwarded,
    userAnswer,
  });

  // Limit attempt history to last 50 items
  if (progress.challengeAttempts.length > 50) {
    progress.challengeAttempts.pop();
  }

  saveProgress(progress);
  return progress;
}

export function resetProgress(): UserProgress {
  const fresh = {
    ...DEFAULT_PROGRESS,
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
  saveProgress(fresh);
  return fresh;
}

export function exportProgressJSON(): string {
  const progress = getProgress();
  return JSON.stringify(progress, null, 2);
}

/**
 * Validates a JSON string candidate for import without committing to storage
 */
export function validateImportJSON(jsonStr: string): ImportValidationResult {
  try {
    if (!jsonStr || !jsonStr.trim()) {
      return { valid: false, message: 'Input is empty. Please paste valid progress JSON.' };
    }

    const candidate = JSON.parse(jsonStr);
    if (!candidate || typeof candidate !== 'object') {
      return { valid: false, message: 'Invalid format: Expected a JSON object.' };
    }

    if (!Array.isArray(candidate.completedLessons) && !Array.isArray(candidate.solvedChallenges)) {
      return { valid: false, message: 'Invalid structure: Missing completedLessons or solvedChallenges arrays.' };
    }

    const sanitized = sanitizeProgress(candidate);
    return {
      valid: true,
      message: 'Valid progress backup file.',
      parsed: sanitized,
      preview: {
        lessonsCount: sanitized.completedLessons.length,
        challengesCount: sanitized.solvedChallenges.length,
        attemptsCount: sanitized.challengeAttempts.length,
        totalXP: sanitized.totalXP,
        streakDays: sanitized.streakDays,
      },
    };
  } catch (err: any) {
    return { valid: false, message: `Syntax error parsing JSON: ${err.message || 'Invalid syntax'}` };
  }
}

/**
 * Imports progress JSON with either 'merge' (safe union) or 'replace' mode
 */
export function importProgressJSON(
  jsonStr: string,
  mode: 'merge' | 'replace' = 'merge'
): { success: boolean; message: string; progress?: UserProgress } {
  const validation = validateImportJSON(jsonStr);
  if (!validation.valid || !validation.parsed) {
    return { success: false, message: validation.message };
  }

  const incoming = validation.parsed;

  if (mode === 'replace') {
    saveProgress(incoming);
    return {
      success: true,
      message: `Progress replaced successfully with ${incoming.totalXP} XP and ${incoming.completedLessons.length} lessons.`,
      progress: incoming,
    };
  } else {
    // Merge mode: safe union without losing existing achievements
    const current = getProgress();

    // Union lessons
    const mergedLessons = Array.from(new Set([...current.completedLessons, ...incoming.completedLessons]));

    // Union solved challenges
    const mergedChallenges = Array.from(new Set([...current.solvedChallenges, ...incoming.solvedChallenges]));

    // Union attempts by timestamp + challengeId uniqueness
    const seenAttempts = new Set<string>();
    const mergedAttempts: typeof current.challengeAttempts = [];

    for (const att of [...current.challengeAttempts, ...incoming.challengeAttempts]) {
      const key = `${att.challengeId}_${att.timestamp}`;
      if (!seenAttempts.has(key)) {
        seenAttempts.add(key);
        mergedAttempts.push(att);
      }
    }

    // Sort attempts by timestamp desc and clamp to 50
    mergedAttempts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const clampedAttempts = mergedAttempts.slice(0, 50);

    const mergedXP = Math.max(current.totalXP, incoming.totalXP);
    const mergedStreak = Math.max(current.streakDays, incoming.streakDays);

    const mergedProgress: UserProgress = {
      completedLessons: mergedLessons,
      solvedChallenges: mergedChallenges,
      challengeAttempts: clampedAttempts,
      totalXP: mergedXP,
      streakDays: mergedStreak,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    saveProgress(mergedProgress);
    return {
      success: true,
      message: `Merged progress: ${mergedLessons.length} lessons, ${mergedChallenges.length} challenges, ${mergedXP} total XP.`,
      progress: mergedProgress,
    };
  }
}
