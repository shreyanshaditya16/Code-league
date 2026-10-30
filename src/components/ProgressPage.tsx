import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Code2, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Zap, 
  Flame, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { UserProgress } from '../types/dsa';
import { TOPICS, LESSONS, CHALLENGES } from '../data/dsaData';
import { 
  exportProgressJSON, 
  importProgressJSON, 
  validateImportJSON,
  resetProgress,
  ImportValidationResult
} from '../services/storage';

interface ProgressPageProps {
  progress: UserProgress;
  onProgressUpdated: (newProgress: UserProgress) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ progress, onProgressUpdated }) => {
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalLessons = LESSONS.length;
  const completedLessons = progress.completedLessons.length;
  const lessonsPercent = Math.round((completedLessons / totalLessons) * 100);

  const totalChallenges = CHALLENGES.length;
  const solvedChallenges = progress.solvedChallenges.length;
  const challengesPercent = Math.round((solvedChallenges / totalChallenges) * 100);

  const totalAttempts = progress.challengeAttempts.length;
  const correctAttempts = progress.challengeAttempts.filter((a) => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;

  const handleExport = () => {
    const jsonStr = exportProgressJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codeleague_progress_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInspectImport = (text: string) => {
    setImportJsonText(text);
    setImportStatus(null);
    if (!text.trim()) {
      setValidationResult(null);
      return;
    }
    const val = validateImportJSON(text);
    setValidationResult(val);
  };

  const handleApplyImport = () => {
    if (!importJsonText.trim()) return;
    const result = importProgressJSON(importJsonText, importMode);
    if (result.success && result.progress) {
      setImportStatus({ type: 'success', message: result.message });
      onProgressUpdated(result.progress);
      setValidationResult(null);
      setImportJsonText('');
      setTimeout(() => {
        setShowImportBox(false);
        setImportStatus(null);
      }, 3000);
    } else {
      setImportStatus({ type: 'error', message: result.message });
    }
  };

  const handleConfirmReset = () => {
    const fresh = resetProgress();
    onProgressUpdated(fresh);
    setShowResetConfirm(false);
    setImportStatus({ type: 'success', message: 'Local progress was reset to starting state.' });
    setTimeout(() => setImportStatus(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>Learning Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Student Progress & Transcript</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Detailed breakdown of your completed modules, challenge attempts, accuracy rates, and persistent storage record.
          </p>
        </div>

        {/* Data Persistence Banner */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Local Storage Mode: Persistent Across Reloads</span>
        </div>
      </div>

      {/* Primary Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Total Experience</span>
          <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
            {progress.totalXP} <span className="text-xs text-violet-400 font-sans font-medium">XP</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Rank: Aspiring Algorist</p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Lesson Completion</span>
          <div className="text-3xl font-extrabold text-white font-mono">
            {lessonsPercent}%
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {completedLessons} of {totalLessons} lessons finished
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Challenges Solved</span>
          <div className="text-3xl font-extrabold text-white font-mono">
            {challengesPercent}%
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {solvedChallenges} of {totalChallenges} challenges solved
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Accuracy & Streak</span>
          <div className="text-3xl font-extrabold text-white font-mono">
            {accuracy}%
          </div>
          <p className="text-[11px] text-amber-400 mt-2 font-semibold">
            🔥 {progress.streakDays} Day Active Streak
          </p>
        </div>
      </div>

      {/* Topic Mastery Detailed Breakdown */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>Topic Mastery Breakdown</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">6 Curriculum Topics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((topic) => {
            const topicLessons = LESSONS.filter((l) => l.topicId === topic.id);
            const topicChallenges = CHALLENGES.filter((c) => c.topicId === topic.id);

            const doneLessons = topicLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
            const doneChallenges = topicChallenges.filter((c) => progress.solvedChallenges.includes(c.id)).length;

            const total = topicLessons.length + topicChallenges.length;
            const done = doneLessons + doneChallenges;
            const pct = Math.round((done / total) * 100);

            return (
              <div key={topic.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{topic.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${topic.badgeColor}`}>
                    {topic.difficulty}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct === 100 ? 'bg-emerald-400' : pct > 50 ? 'bg-blue-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Lessons: {doneLessons}/{topicLessons.length}</span>
                  <span>Arena: {doneChallenges}/{topicChallenges.length}</span>
                  <span className="text-cyan-400 font-bold">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenge Attempt History */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-violet-400" />
          <span>Challenge Attempt History ({progress.challengeAttempts.length} Records)</span>
        </h2>

        {progress.challengeAttempts.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center font-mono">
            No challenges attempted yet. Your verified submission logs will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Challenge</th>
                  <th className="py-2.5 px-3">Outcome</th>
                  <th className="py-2.5 px-3">Your Answer</th>
                  <th className="py-2.5 px-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {progress.challengeAttempts.map((att, idx) => {
                  const challenge = CHALLENGES.find((c) => c.id === att.challengeId);
                  return (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 text-slate-500">
                        {new Date(att.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-200">
                        {challenge ? challenge.title : att.challengeId}
                      </td>
                      <td className="py-2.5 px-3">
                        {att.isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Passed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Failed</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 truncate max-w-xs">
                        {att.userAnswer}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-violet-300">
                        {att.pointsAwarded > 0 ? `+${att.pointsAwarded} XP` : '0'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Data Management: Export / Import / Reset */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Local Storage & Backup Management</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Code League respects student privacy and operates in Guest Mode by default. All completed lessons, arena score, and streaks are preserved in your local browser storage. You can backup your progress as a JSON file or restore it anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Progress JSON</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-violet-400" />
            <span>Import Progress Backup</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>

        {/* Import JSON Box */}
        {showImportBox && (
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Paste your exported JSON progress data below:
              </label>
              <textarea
                rows={4}
                value={importJsonText}
                onChange={(e) => handleInspectImport(e.target.value)}
                placeholder='{"completedLessons": [...], "solvedChallenges": [...], "totalXP": 240, ...}'
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Validation Feedback / Preview */}
            {validationResult && (
              <div className={`p-3.5 rounded-lg text-xs space-y-2 ${
                validationResult.valid
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {validationResult.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{validationResult.message}</span>
                </div>

                {validationResult.valid && validationResult.preview && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px] text-slate-300">
                    <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block">Lessons:</span>
                      <strong className="text-white text-sm">{validationResult.preview.lessonsCount}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block">Challenges:</span>
                      <strong className="text-white text-sm">{validationResult.preview.challengesCount}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block">Total XP:</span>
                      <strong className="text-violet-300 text-sm">{validationResult.preview.totalXP}</strong>
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 block">Streak:</span>
                      <strong className="text-amber-300 text-sm">{validationResult.preview.streakDays}d</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Import Mode Selection */}
            {validationResult?.valid && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                <span className="text-xs font-semibold text-slate-300">Import Strategy:</span>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="accent-blue-500"
                  />
                  <span>Merge with Current Progress (recommended)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="accent-rose-500"
                  />
                  <span>Replace Existing Data</span>
                </label>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleApplyImport}
                disabled={!validationResult?.valid}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs transition cursor-pointer"
              >
                {importMode === 'merge' ? 'Merge and Apply' : 'Replace and Apply'}
              </button>
              <button
                onClick={() => {
                  setShowImportBox(false);
                  setValidationResult(null);
                  setImportJsonText('');
                }}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Global Import / Reset Feedback */}
        {importStatus && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            importStatus.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Are you sure you want to reset your local progress?</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              This action clears your completed lessons, solved challenges, and streak count stored in this browser's LocalStorage. It will <strong>not</strong> affect any JSON backups you have downloaded to your computer.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer"
              >
                Yes, Reset Local Progress
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              >
                Keep My Progress
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
