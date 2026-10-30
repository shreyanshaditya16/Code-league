import React, { useState } from 'react';
import { 
  Code2, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Sparkles, 
  Cpu, 
  Check, 
  HelpCircle,
  Filter,
  Zap,
  RotateCcw
} from 'lucide-react';
import { PracticeChallenge, UserProgress, TopicId, Difficulty } from '../../types/dsa';
import { CHALLENGES, TOPICS } from '../../data/dsaData';
import { recordChallengeAttempt } from '../../services/storage';
import { AITutorModal } from './AITutorModal';

interface PracticeArenaProps {
  progress: UserProgress;
  onProgressUpdated: (newProgress: UserProgress) => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({ progress, onProgressUpdated }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Input states per challenge: { challengeId: userAnswerString }
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  
  // Feedback states per challenge: { challengeId: { isSubmitted: boolean, isCorrect: boolean, feedbackText?: string } }
  const [submissionFeedback, setSubmissionFeedback] = useState<Record<string, { isSubmitted: boolean; isCorrect: boolean }>>({});

  // Hint level reveals: { challengeId: number }
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});

  // Explanation reveals: { challengeId: boolean }
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  // Active AI Tutor Modal
  const [activeTutorChallenge, setActiveTutorChallenge] = useState<PracticeChallenge | null>(null);

  // Filter challenges
  const filteredChallenges = CHALLENGES.filter((ch) => {
    if (selectedTopic !== 'all' && ch.topicId !== selectedTopic) return false;
    if (selectedDifficulty !== 'all' && ch.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleInputChange = (challengeId: string, val: string) => {
    setUserInputs((prev) => ({ ...prev, [challengeId]: val }));
  };

  const handleRevealNextHint = (challengeId: string, maxHints: number) => {
    const current = revealedHints[challengeId] || 0;
    if (current < maxHints) {
      setRevealedHints((prev) => ({ ...prev, [challengeId]: current + 1 }));
    }
  };

  const handleSubmitAnswer = (challenge: PracticeChallenge) => {
    const rawInput = (userInputs[challenge.id] || '').trim();
    if (!rawInput) return;

    // Normalizing comparison for both trace outputs and multiple choice strings
    const normalizedUser = rawInput.toLowerCase().replace(/\s+/g, '');
    const normalizedCorrect = String(challenge.correctAnswer).toLowerCase().replace(/\s+/g, '');

    const isCorrect = normalizedUser === normalizedCorrect;

    // Record in local storage
    const updated = recordChallengeAttempt(challenge.id, isCorrect, challenge.points, rawInput);
    onProgressUpdated(updated);

    setSubmissionFeedback((prev) => ({
      ...prev,
      [challenge.id]: { isSubmitted: true, isCorrect },
    }));

    if (isCorrect) {
      setRevealedExplanations((prev) => ({ ...prev, [challenge.id]: true }));
    }
  };

  const totalPoints = CHALLENGES.reduce((acc, c) => acc + c.points, 0);
  const earnedPoints = CHALLENGES.filter((c) => progress.solvedChallenges.includes(c.id)).reduce(
    (acc, c) => acc + c.points,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Code2 className="w-3.5 h-3.5 text-violet-400" />
            <span>Problem Solving Arena</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">DSA Practice Challenges</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Original, conceptual challenges with real answer validation. Trace array loops, verify invariants, and inspect time complexity.
          </p>
        </div>

        {/* Stats card */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Solved Challenges
            </span>
            <span className="text-xl font-bold font-mono text-cyan-400">
              {progress.solvedChallenges.length} / {CHALLENGES.length}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Arena Points
            </span>
            <span className="text-xl font-bold font-mono text-violet-400">
              {earnedPoints} / {totalPoints} XP
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Topic Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedTopic('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedTopic === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            All Topics
          </button>
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedTopic === topic.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-mono">Difficulty:</span>
          {['all', 'Easy', 'Medium'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {diff === 'all' ? 'All' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-6">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No challenges match the selected filters.
          </div>
        ) : (
          filteredChallenges.map((challenge, idx) => {
            const isSolved = progress.solvedChallenges.includes(challenge.id);
            const feedback = submissionFeedback[challenge.id];
            const currentAnswer = userInputs[challenge.id] || '';
            const hintsCount = challenge.hints.length;
            const hintsRevealedCount = revealedHints[challenge.id] || 0;
            const isExplanationShown = revealedExplanations[challenge.id] || isSolved;

            return (
              <div
                key={challenge.id}
                className={`bg-[#0F172A] border rounded-2xl p-6 sm:p-7 transition shadow-lg space-y-5 ${
                  isSolved
                    ? 'border-emerald-500/30'
                    : feedback?.isSubmitted && !feedback.isCorrect
                    ? 'border-rose-500/40'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Challenge Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      #{idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                    {isSolved && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Solved</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-md border font-mono font-medium ${
                        challenge.difficulty === 'Easy'
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 font-bold">
                      +{challenge.points} XP
                    </span>
                  </div>
                </div>

                {/* Question Description */}
                <p className="text-sm text-slate-200 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Example Input / Output */}
                {challenge.exampleInput && (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-1.5">
                    <div>
                      <span className="text-slate-400">Input: </span>
                      <span className="text-slate-200 font-semibold">{challenge.exampleInput}</span>
                    </div>
                    {challenge.exampleOutput && (
                      <div>
                        <span className="text-slate-400">Expected Output Format: </span>
                        <span className="text-cyan-300 font-semibold">{challenge.exampleOutput}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive Input Form */}
                <div className="space-y-3 pt-2">
                  {challenge.type === 'multiple-choice' && challenge.options ? (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-300 block">
                        Select your answer:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {challenge.options.map((option, optIdx) => {
                          const isSelected = currentAnswer === option;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleInputChange(challenge.id, option)}
                              className={`text-left p-3 rounded-xl border text-xs font-mono transition cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-blue-600/20 border-blue-500 text-white font-bold ring-1 ring-blue-500/40'
                                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                              }`}
                            >
                              <span>{option}</span>
                              {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Your Calculated Answer:
                      </label>
                      <input
                        type="text"
                        value={currentAnswer}
                        onChange={(e) => handleInputChange(challenge.id, e.target.value)}
                        placeholder="Enter your exact answer here..."
                        className="w-full sm:max-w-md bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  {/* Submission and Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSubmitAnswer(challenge)}
                        disabled={!currentAnswer.trim()}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Check Answer</span>
                      </button>

                      {/* Progressive Hint Button */}
                      {hintsCount > 0 && (
                        <button
                          onClick={() => handleRevealNextHint(challenge.id, hintsCount)}
                          disabled={hintsRevealedCount >= hintsCount}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            {hintsRevealedCount === 0
                              ? 'Show Hint'
                              : hintsRevealedCount < hintsCount
                              ? `Next Hint (${hintsRevealedCount}/${hintsCount})`
                              : 'All Hints Shown'}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Ask AI DSA Tutor Button */}
                    <button
                      onClick={() => setActiveTutorChallenge(challenge)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600/20 to-blue-600/20 hover:from-violet-600/30 hover:to-blue-600/30 text-violet-300 hover:text-white border border-violet-500/30 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ask AI Tutor</span>
                    </button>
                  </div>
                </div>

                {/* Progressive Hints Box */}
                {hintsRevealedCount > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                    <span className="font-bold text-amber-400 flex items-center gap-1 font-mono">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Hints Unlocked:</span>
                    </span>
                    <ul className="space-y-1.5 pl-1">
                      {challenge.hints.slice(0, hintsRevealedCount).map((hint, hIdx) => (
                        <li key={hIdx} className="text-amber-200/90 leading-relaxed">
                          • {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submission Feedback Banner */}
                {feedback?.isSubmitted && (
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs leading-relaxed font-mono ${
                      feedback.isCorrect
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {feedback.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            Splendid! Correct Answer verified. You earned +{challenge.points} XP!
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>
                            Not quite right yet. Re-check the logic or ask the AI Tutor for a hint!
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Explanation Reveal */}
                {isExplanationShown && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                    <span className="font-bold text-white flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Detailed Algorithmic Solution Explanation:</span>
                    </span>
                    <p className="leading-relaxed text-slate-300 font-mono">
                      {challenge.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Socratic AI Tutor Modal */}
      {activeTutorChallenge && (
        <AITutorModal
          challenge={activeTutorChallenge}
          userAnswer={userInputs[activeTutorChallenge.id] || ''}
          onClose={() => setActiveTutorChallenge(null)}
        />
      )}
    </div>
  );
};
