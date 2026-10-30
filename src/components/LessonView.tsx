import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  Copy, 
  Check, 
  Lightbulb, 
  Code2, 
  HelpCircle,
  Share2
} from 'lucide-react';
import { LessonContent, TopicMeta, UserProgress } from '../types/dsa';
import { TOPICS, LESSONS } from '../data/dsaData';

interface LessonViewProps {
  lessonId: string;
  progress: UserProgress;
  onCompleteLesson: (lessonId: string) => void;
  onNavigateLesson: (nextId: string) => void;
  onBackToTopics: () => void;
  onOpenVisualizer: (algoId: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lessonId,
  progress,
  onCompleteLesson,
  onNavigateLesson,
  onBackToTopics,
  onOpenVisualizer,
}) => {
  const lesson = LESSONS.find((l) => l.id === lessonId) || LESSONS[0];
  const topic = TOPICS.find((t) => t.id === lesson.topicId) || TOPICS[0];

  const [activeLang, setActiveLang] = useState<'cpp' | 'python' | 'java' | 'typescript'>('cpp');
  const [copied, setCopied] = useState(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  React.useEffect(() => {
    setSelectedQuizAnswers({});
    setShowQuizResults(false);
    setCopied(false);
  }, [lessonId]);

  const isCompleted = progress.completedLessons.includes(lesson.id);

  // Lesson indexing for next / previous
  const currentIndex = LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  const currentCode = lesson.codeImplementations.find((c) => c.language === activeLang)?.code || '';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuizOptionSelect = (qIdx: number, optIdx: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onBackToTopics}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Topics</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenVisualizer(topic.visualizerAlgoId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Launch {topic.title} Visualizer</span>
          </button>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-0.5 rounded-md border font-semibold ${topic.badgeColor}`}>
            {topic.title}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lesson.estimatedMinutes} min read
          </span>
          <span className="text-xs text-slate-500 font-mono">• {lesson.difficulty}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          {lesson.title}
        </h1>
        <p className="text-base text-slate-300 font-medium">
          {lesson.subtitle}
        </p>
      </div>

      {/* Overview & Intuitive Analogy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-bold text-white mb-2">Overview & Theoretical Basis</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {lesson.overview}
            </p>
          </div>

          {/* Key Concepts */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Core Architectural Principles</span>
            </h2>
            <ul className="space-y-2">
              {lesson.keyConcepts.map((concept, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Real-World Analogy */}
        <div className="bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/20 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-3 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Real-World Analogy</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
              "{lesson.analogy}"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Anchor abstract algorithms to physical world intuition.
          </div>
        </div>
      </div>

      {/* Pseudocode Block */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-cyan-300">Algorithmic Pseudocode</span>
          <span className="text-[11px] font-mono text-slate-500">Language Agnostic</span>
        </div>
        <pre className="p-5 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed bg-[#080B12]">
          {lesson.pseudocode}
        </pre>
      </div>

      {/* Multi-Language Code Implementations */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 mr-2 font-mono flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Implementation:</span>
            </span>
            {(['cpp', 'python', 'java', 'typescript'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 rounded text-xs font-mono font-semibold transition cursor-pointer ${
                  activeLang === lang
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {lang === 'cpp' ? 'C++' : lang === 'typescript' ? 'TS' : lang.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-5 font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed bg-[#080B12]">
          {currentCode}
        </pre>
      </div>

      {/* Complexity Analysis Card */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-4">
          Time & Space Complexity Analysis
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
              Best Time
            </span>
            <span className="text-base font-bold font-mono text-emerald-400">
              {lesson.complexity.bestTime}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
              Average Time
            </span>
            <span className="text-base font-bold font-mono text-amber-400">
              {lesson.complexity.averageTime}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
              Worst Time
            </span>
            <span className="text-base font-bold font-mono text-rose-400">
              {lesson.complexity.worstTime}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
              Space (Auxiliary)
            </span>
            <span className="text-base font-bold font-mono text-cyan-400">
              {lesson.complexity.spaceComplexity}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
          <span className="font-semibold text-white">Mathematical Rationale: </span>
          {lesson.complexity.explanation}
        </p>
      </div>

      {/* Check Your Understanding Interactive Quiz */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-bold text-white">
            Check Your Understanding ({lesson.checkQuestions.length} Questions)
          </h2>
        </div>

        <div className="space-y-6">
          {lesson.checkQuestions.map((q, qIdx) => {
            const selectedOpt = selectedQuizAnswers[qIdx];
            const hasAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div key={qIdx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-sm font-semibold text-slate-200 mb-3">
                  {qIdx + 1}. {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selectedOpt === optIdx;
                    let optionStyle = 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300';

                    if (showQuizResults && hasAnswered) {
                      if (optIdx === q.correctIndex) {
                        optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold';
                      } else if (isOptionSelected) {
                        optionStyle = 'border-rose-500 bg-rose-500/10 text-rose-300';
                      }
                    } else if (isOptionSelected) {
                      optionStyle = 'border-blue-500 bg-blue-600/20 text-white font-medium';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                        className={`w-full text-left p-3 rounded-lg text-xs border transition cursor-pointer flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {showQuizResults && hasAnswered && optIdx === q.correctIndex && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {showQuizResults && hasAnswered && (
                  <div className={`mt-3 p-3 rounded-lg text-xs leading-relaxed ${
                    isCorrect ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}>
                    <span className="font-bold">{isCorrect ? 'Correct! ' : 'Incorrect. '}</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => setShowQuizResults(true)}
            className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition cursor-pointer"
          >
            Verify Answers
          </button>
        </div>
      </div>

      {/* Completion & Next/Prev Controls */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {prevLesson ? (
            <button
              onClick={() => onNavigateLesson(prevLesson.id)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev: {prevLesson.title.split(':')[0]}</span>
            </button>
          ) : (
            <div />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onCompleteLesson(lesson.id)}
            disabled={isCompleted}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Lesson Completed (+30 XP)' : 'Mark as Completed (+30 XP)'}</span>
          </button>

          {nextLesson && (
            <button
              onClick={() => onNavigateLesson(nextLesson.id)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
