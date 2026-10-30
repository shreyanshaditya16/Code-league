import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  BookOpen, 
  Code2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Cpu, 
  Zap,
  Terminal,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { TOPICS } from '../data/dsaData';
import { TopicId } from '../types/dsa';

interface LandingPageProps {
  onStartLearning: () => void;
  onOpenVisualizer: (algoId?: string) => void;
  onOpenTopic: (topicId: TopicId) => void;
  onOpenPractice: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onOpenVisualizer,
  onOpenTopic,
  onOpenPractice,
}) => {
  // Mini interactive bubble sort demo in the hero
  const [heroArray, setHeroArray] = useState<number[]>([45, 18, 72, 31, 64]);
  const [activeCompare, setActiveCompare] = useState<[number, number] | null>([0, 1]);
  const [isSorted, setIsSorted] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const resetHeroDemo = () => {
    setHeroArray([45, 18, 72, 31, 64]);
    setActiveCompare([0, 1]);
    setIsSorted(false);
    setDemoStep(0);
  };

  const stepHeroDemo = () => {
    if (isSorted) {
      resetHeroDemo();
      return;
    }

    const arr = [...heroArray];
    const n = arr.length;
    let i = Math.floor(demoStep / (n - 1));
    let j = demoStep % (n - 1);

    if (i >= n - 1) {
      setIsSorted(true);
      setActiveCompare(null);
      return;
    }

    if (arr[j] > arr[j + 1]) {
      const temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;
    }

    const nextStep = demoStep + 1;
    const nextJ = nextStep % (n - 1);
    setHeroArray(arr);
    setActiveCompare([nextJ, nextJ + 1]);
    setDemoStep(nextStep);

    if (nextStep >= 8) {
      // Finished sorting
      setHeroArray([...arr].sort((a, b) => a - b));
      setIsSorted(true);
      setActiveCompare(null);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      stepHeroDemo();
    }, 2400);
    return () => clearInterval(timer);
  }, [demoStep, heroArray, isSorted]);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-16 sm:pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-violet-600/10 to-cyan-500/15 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full-Stack DSA Education Mini-Project</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Master Data Structures. <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                Visualize Logic in Motion.
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl font-mono text-cyan-300/90 font-medium mb-6">
              "Learn Algorithms. Visualize Logic. Master Code."
            </p>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Designed specifically for college computer science students. Bridge the gap between abstract textbook pseudocode and intuitive algorithmic execution through step-by-step animations, interactive tests, and instant feedback.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onStartLearning}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenVisualizer('bubble-sort')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-cyan-400" />
                <span>Open Visualizer</span>
              </button>

              <button
                onClick={onOpenPractice}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-violet-950/40 hover:bg-violet-900/40 border border-violet-800/50 text-violet-300 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-violet-400" />
                <span>Practice Arena</span>
              </button>
            </div>
          </div>

          {/* Hero Interactive Mini-Visualizer Preview Card */}
          <div className="mt-14 max-w-3xl mx-auto rounded-2xl bg-[#0F172A]/90 border border-slate-800 shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-slate-300">Live Preview: Bubble Sort Pass Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetHeroDemo}
                  title="Reset demo"
                  className="p-1 hover:text-white transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                  {isSorted ? 'Status: Sorted' : `Step ${demoStep + 1}`}
                </span>
              </div>
            </div>

            {/* Interactive bars */}
            <div className="h-40 flex items-end justify-center gap-3 sm:gap-6 px-4 py-2">
              {heroArray.map((val, idx) => {
                const isComparing = activeCompare?.includes(idx);
                const heightPercent = Math.max(20, (val / 80) * 100);

                let barColor = 'bg-slate-700 border-slate-600 text-slate-300';
                if (isSorted) {
                  barColor = 'bg-emerald-600/40 border-emerald-500 text-emerald-300';
                } else if (isComparing) {
                  barColor = 'bg-amber-500/40 border-amber-400 text-amber-200 animate-pulse';
                }

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[70px]">
                    <span className="text-xs font-mono font-bold text-slate-200">{val}</span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg border-t-2 border-x-2 transition-all duration-300 flex items-center justify-center ${barColor}`}
                    >
                      <span className="text-[10px] font-mono text-slate-400 opacity-70">
                        [{idx}]
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="text-slate-300">
                {isSorted
                  ? 'All elements in ascending order! Complete sorting achieved.'
                  : 'Comparing adjacent array elements. Elements swap if left > right.'}
              </span>
              <button
                onClick={() => onOpenVisualizer('bubble-sort')}
                className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 group"
              >
                <span>Open Full Controls</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
            Why Code League?
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            Built for Real Understanding, Not Rote Memorization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 hover:border-blue-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
              <PlayCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Interactive Visualizers</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Step forward, backward, or auto-play through Bubble, Selection, Insertion Sort, Binary Search, Stacks, Queues, and Linked Lists.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 hover:border-violet-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Concept-First Lessons</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Beginner-friendly explanations, physical analogies, pseudocode, and multi-language snippets in C++, Python, Java, and TypeScript.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Practice Arena</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Test your grasp with real original challenges: array trace outputs, loop invariants, and complexity puzzles with instant verification.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 hover:border-emerald-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Socratic AI DSA Tutor</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Stuck on a problem? Ask the AI Tutor for progressive hints that guide your reasoning without spoiling the solution directly.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Topics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Curriculum Roadmap
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              Core Data Structures & Algorithms
            </p>
          </div>
          <button
            onClick={onStartLearning}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
          >
            <span>View All Topics</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${topic.badgeColor}`}>
                    {topic.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {topic.lessonsCount} lessons • {topic.challengesCount} challenges
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{topic.title}</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  {topic.shortDesc}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onOpenTopic(topic.id)}
                  className="flex-1 py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/30 transition text-center cursor-pointer"
                >
                  Read Lessons
                </button>
                <button
                  onClick={() => onOpenVisualizer(topic.visualizerAlgoId)}
                  className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition text-center flex items-center gap-1 cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Visualize</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mini-Project Credibility & Architecture Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0B0F19] border border-slate-800 p-8 sm:p-10 relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>College Mini-Project Standard Compliance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Functional Logic Over Superficial Prototypes
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Unlike static mockups, Code League generates authentic execution traces of sorting, searching, stack, queue, and linked-list operations. All questions validate user answers mathematically, and your learning progress is persisted reliably in browser storage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
                <div className="text-cyan-400 font-bold mb-1">✓ Real Step Generators</div>
                Bubble, Selection, Insertion, Binary Search, Linked Lists
              </div>
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
                <div className="text-violet-400 font-bold mb-1">✓ Multi-Language Code</div>
                C++, Python, Java, TypeScript with Complexity Matrix
              </div>
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
                <div className="text-amber-400 font-bold mb-1">✓ Local Storage Persistence</div>
                Zero fake accounts — offline ready & instant reload
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
