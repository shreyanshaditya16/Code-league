import React from 'react';
import { 
  PlayCircle, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Layers, 
  LayoutGrid, 
  Search, 
  ArrowUpDown, 
  GitCommitVertical, 
  Share2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { TOPICS, LESSONS, CHALLENGES } from '../data/dsaData';
import { UserProgress, TopicId } from '../types/dsa';

interface TopicsPageProps {
  progress: UserProgress;
  onOpenLesson: (lessonId: string) => void;
  onOpenVisualizer: (algoId: string) => void;
}

const TOPIC_ICONS: Record<string, React.ElementType> = {
  LayoutGrid: LayoutGrid,
  Search: Search,
  ArrowUpDown: ArrowUpDown,
  Layers: Layers,
  GitCommitVertical: GitCommitVertical,
  Share2: Share2,
};

export const TopicsPage: React.FC<TopicsPageProps> = ({
  progress,
  onOpenLesson,
  onOpenVisualizer,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
          Curriculum Overview
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Data Structures & Algorithms Topics
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mt-1">
          Each topic includes structured conceptual lessons, step-by-step visualizers, multi-language code snippets, and interactive arena challenges.
        </p>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.map((topic) => {
          const IconComponent = TOPIC_ICONS[topic.iconName] || LayoutGrid;
          const topicLessons = LESSONS.filter((l) => l.topicId === topic.id);
          const topicChallenges = CHALLENGES.filter((c) => c.topicId === topic.id);

          const completedLessons = topicLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
          const solvedChallenges = topicChallenges.filter((c) => progress.solvedChallenges.includes(c.id)).length;

          const totalUnits = topicLessons.length + topicChallenges.length;
          const doneUnits = completedLessons + solvedChallenges;
          const progressPercent = Math.round((doneUnits / totalUnits) * 100);

          return (
            <div
              key={topic.id}
              className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition shadow-lg group"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${topic.badgeColor}`}>
                    {topic.difficulty}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">{topic.title}</h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {topic.fullDesc}
                </p>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
                    <span>Topic Progress</span>
                    <span className="text-cyan-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progressPercent === 100 ? 'bg-emerald-400' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="mb-4">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                    Prerequisites:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.prerequisites.map((req, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lessons List within Topic */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                    Lessons ({completedLessons}/{topicLessons.length}):
                  </span>
                  {topicLessons.map((lesson) => {
                    const isDone = progress.completedLessons.includes(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onOpenLesson(lesson.id)}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-left text-xs text-slate-300 hover:text-white transition group/item cursor-pointer"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 group-hover/item:text-blue-400 shrink-0 font-mono">
                          {lesson.estimatedMinutes}m →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => onOpenLesson(topicLessons[0]?.id || '')}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Start Lessons</span>
                </button>
                <button
                  onClick={() => onOpenVisualizer(topic.visualizerAlgoId)}
                  className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                  title="Open in Algorithm Visualizer"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Visualizer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
