import React from 'react';
import { 
  Zap, 
  BookOpen, 
  Code2, 
  Flame, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  PlayCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { UserProgress, TopicId } from '../types/dsa';
import { TOPICS, LESSONS, CHALLENGES } from '../data/dsaData';

interface DashboardPageProps {
  progress: UserProgress;
  onOpenLesson: (lessonId: string) => void;
  onOpenTopic: (topicId: TopicId) => void;
  onOpenVisualizer: (algoId?: string) => void;
  onOpenPractice: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  progress,
  onOpenLesson,
  onOpenTopic,
  onOpenVisualizer,
  onOpenPractice,
}) => {
  const totalLessons = LESSONS.length;
  const completedLessonsCount = progress.completedLessons.length;
  const lessonProgressPercent = Math.min(100, Math.round((completedLessonsCount / totalLessons) * 100));

  const totalChallenges = CHALLENGES.length;
  const solvedChallengesCount = progress.solvedChallenges.length;
  const challengeProgressPercent = Math.min(100, Math.round((solvedChallengesCount / totalChallenges) * 100));

  // Calculate Accuracy
  const totalAttempts = progress.challengeAttempts.length;
  const correctAttempts = progress.challengeAttempts.filter(a => a.isCorrect).length;
  const accuracyPercent = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;

  // Find next recommended lesson
  const uncompletedLesson = LESSONS.find(l => !progress.completedLessons.includes(l.id)) || LESSONS[0];
  const recommendedTopic = TOPICS.find(t => t.id === uncompletedLesson.topicId) || TOPICS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Card */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#0F172A] to-slate-900 border border-blue-500/20 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            <span>Student Dashboard</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Active Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, Engineer!
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            You are building solid algorithmic intuition. Review recommended lessons, verify step traces in the visualizer, or climb the practice arena.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onOpenLesson(uncompletedLesson.id)}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Resume: {uncompletedLesson.title.split(':')[0]}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total XP */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 hover:border-violet-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Total Score & XP</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mb-1">
            {progress.totalXP} <span className="text-xs text-violet-400 font-sans font-medium">XP</span>
          </div>
          <p className="text-xs text-slate-400">Earned via lessons & challenges</p>
        </div>

        {/* Metric 2: Lessons Completed */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Lessons Completed</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mb-1">
            {completedLessonsCount} <span className="text-xs text-slate-400 font-sans font-normal">/ {totalLessons}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${lessonProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Challenges Solved */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Challenges Solved</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mb-1">
            {solvedChallengesCount} <span className="text-xs text-slate-400 font-sans font-normal">/ {totalChallenges}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${challengeProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Accuracy & Streak */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Accuracy & Streak</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mb-1">
            {accuracyPercent}% <span className="text-xs text-amber-400 font-sans font-medium">{progress.streakDays}d streak</span>
          </div>
          <p className="text-xs text-slate-400">{totalAttempts} total attempts recorded</p>
        </div>
      </div>

      {/* Two Column Layout: Recommended Action & Topic Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recommended Next Step */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Recommended Next Milestone</h2>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${recommendedTopic.badgeColor}`}>
                {recommendedTopic.title}
              </span>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-cyan-400 font-mono font-semibold uppercase tracking-wider">
                    Next Lesson
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">
                    {uncompletedLesson.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {uncompletedLesson.subtitle}
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end text-xs text-slate-400 gap-1 shrink-0">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {uncompletedLesson.estimatedMinutes} mins
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {uncompletedLesson.difficulty}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => onOpenLesson(uncompletedLesson.id)}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Start Lesson</span>
                </button>
                <button
                  onClick={() => onOpenVisualizer(recommendedTopic.visualizerAlgoId)}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-cyan-400" />
                  <span>Open in Visualizer</span>
                </button>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => onOpenVisualizer()}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <PlayCircle className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-slate-400 group-hover:text-blue-300 transition">Launch →</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Algorithm Visualizer</h4>
                <p className="text-xs text-slate-400">Experiment with custom inputs, step controls, and animations.</p>
              </div>

              <div 
                onClick={onOpenPractice}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Code2 className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-slate-400 group-hover:text-violet-300 transition">Enter →</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Practice Arena</h4>
                <p className="text-xs text-slate-400">Solve interactive trace problems and earn XP.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Topic Mastery Bars */}
        <div className="space-y-6">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Topic Mastery</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">6 Topics</span>
            </div>

            <div className="space-y-4">
              {TOPICS.map((topic) => {
                const topicLessons = LESSONS.filter(l => l.topicId === topic.id);
                const topicChallenges = CHALLENGES.filter(c => c.topicId === topic.id);
                
                const completedInTopic = topicLessons.filter(l => progress.completedLessons.includes(l.id)).length;
                const solvedInTopic = topicChallenges.filter(c => progress.solvedChallenges.includes(c.id)).length;
                
                const totalUnits = topicLessons.length + topicChallenges.length;
                const doneUnits = completedInTopic + solvedInTopic;
                const percent = totalUnits > 0 ? Math.round((doneUnits / totalUnits) * 100) : 0;

                return (
                  <div 
                    key={topic.id}
                    onClick={() => onOpenTopic(topic.id)}
                    className="p-2.5 rounded-lg hover:bg-slate-850 border border-transparent hover:border-slate-800 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-200">{topic.title}</span>
                      <span className="font-mono text-slate-400">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent === 100 
                            ? 'bg-emerald-400' 
                            : percent > 50 
                            ? 'bg-blue-500' 
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Challenge Attempts */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-violet-400" />
              <span>Recent Activity</span>
            </h2>
            {progress.challengeAttempts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No challenges attempted yet. Visit the Practice Arena to test your knowledge!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {progress.challengeAttempts.slice(0, 5).map((attempt, idx) => {
                  const challenge = CHALLENGES.find(c => c.id === attempt.challengeId);
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs">
                      <div className="truncate max-w-[180px]">
                        <span className="font-medium text-slate-200 truncate block">
                          {challenge ? challenge.title : attempt.challengeId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(attempt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        attempt.isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {attempt.isCorrect ? `+${attempt.pointsAwarded} XP` : 'Incorrect'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
