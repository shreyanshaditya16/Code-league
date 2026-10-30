/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardPage } from './components/DashboardPage';
import { TopicsPage } from './components/TopicsPage';
import { LessonView } from './components/LessonView';
import { VisualizerPage } from './components/Visualizer/VisualizerPage';
import { PracticeArena } from './components/Practice/PracticeArena';
import { ProgressPage } from './components/ProgressPage';
import { UserProgress, TopicId } from './types/dsa';
import { getProgress, markLessonCompleted } from './services/storage';
import { Terminal, Github, Heart } from 'lucide-react';
import { LESSONS } from './data/dsaData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [activeLessonId, setActiveLessonId] = useState<string>('intro-arrays');
  const [activeVisualizerAlgo, setActiveVisualizerAlgo] = useState<string>('bubble-sort');
  const [progress, setProgress] = useState<UserProgress>(getProgress());

  // Listen to storage progress events
  useEffect(() => {
    const handleProgressUpdate = (e: CustomEvent<UserProgress>) => {
      setProgress(e.detail);
    };

    window.addEventListener('codeleague:progress_updated' as any, handleProgressUpdate);
    return () => {
      window.removeEventListener('codeleague:progress_updated' as any, handleProgressUpdate);
    };
  }, []);

  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveTab('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVisualizer = (algoId?: string) => {
    if (algoId) {
      setActiveVisualizerAlgo(algoId);
    }
    setActiveTab('visualizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTopic = (topicId: TopicId) => {
    const firstLesson = LESSONS.find((l) => l.topicId === topicId);
    if (firstLesson) {
      setActiveLessonId(firstLesson.id);
      setActiveTab('lesson');
    } else {
      setActiveTab('topics');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteLesson = (lessonId: string) => {
    const updated = markLessonCompleted(lessonId);
    setProgress(updated);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-cyan-200">
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab === 'lesson' ? 'topics' : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        progress={progress}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onStartLearning={() => {
              setActiveTab('topics');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVisualizer={(algoId) => handleOpenVisualizer(algoId)}
            onOpenTopic={(topicId) => handleOpenTopic(topicId)}
            onOpenPractice={() => {
              setActiveTab('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            progress={progress}
            onOpenLesson={handleOpenLesson}
            onOpenTopic={handleOpenTopic}
            onOpenVisualizer={handleOpenVisualizer}
            onOpenPractice={() => {
              setActiveTab('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'topics' && (
          <TopicsPage
            progress={progress}
            onOpenLesson={handleOpenLesson}
            onOpenVisualizer={handleOpenVisualizer}
          />
        )}

        {activeTab === 'lesson' && (
          <LessonView
            lessonId={activeLessonId}
            progress={progress}
            onCompleteLesson={handleCompleteLesson}
            onNavigateLesson={handleOpenLesson}
            onBackToTopics={() => {
              setActiveTab('topics');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVisualizer={handleOpenVisualizer}
          />
        )}

        {activeTab === 'visualizer' && (
          <VisualizerPage initialAlgorithm={activeVisualizerAlgo} />
        )}

        {activeTab === 'practice' && (
          <PracticeArena
            progress={progress}
            onProgressUpdated={(newProg) => setProgress(newProg)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressPage
            progress={progress}
            onProgressUpdated={(newProg) => setProgress(newProg)}
          />
        )}
      </main>

      {/* Code League Global Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070A11] text-xs text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="font-extrabold text-white text-sm font-mono tracking-wider">
                  CODE LEAGUE
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  DSA Platform
                </span>
              </div>
              <p className="text-slate-400 text-xs font-mono">
                "Learn Algorithms. Visualize Logic. Master Code."
              </p>
              <p className="text-slate-500 text-[11px] max-w-md">
                An interactive full-stack computer science learning platform built for college students with animated visualizers, authentic test validations, and progressive guidance.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-mono">
              <div className="space-y-2">
                <span className="text-slate-200 font-bold uppercase text-[10px] tracking-wider block">
                  Curriculum
                </span>
                <button
                  onClick={() => handleOpenTopic('arrays')}
                  className="block text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                >
                  Arrays & Memory
                </button>
                <button
                  onClick={() => handleOpenTopic('searching')}
                  className="block text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                >
                  Searching
                </button>
                <button
                  onClick={() => handleOpenTopic('sorting')}
                  className="block text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                >
                  Sorting
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-slate-200 font-bold uppercase text-[10px] tracking-wider block">
                  Data Structures
                </span>
                <button
                  onClick={() => handleOpenTopic('stacks')}
                  className="block text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                >
                  Stacks (LIFO)
                </button>
                <button
                  onClick={() => handleOpenTopic('queues')}
                  className="block text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                >
                  Queues (FIFO)
                </button>
                <button
                  onClick={() => handleOpenTopic('linked-lists')}
                  className="block text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                >
                  Linked Lists
                </button>
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <span className="text-slate-200 font-bold uppercase text-[10px] tracking-wider block">
                  Platform
                </span>
                <button
                  onClick={() => {
                    setActiveTab('visualizer');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="block text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                >
                  Visualizer
                </button>
                <button
                  onClick={() => {
                    setActiveTab('practice');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="block text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                >
                  Practice Arena
                </button>
                <button
                  onClick={() => {
                    setActiveTab('progress');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="block text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                >
                  My Transcript
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 Code League — College DSA Mini-Project Edition. Persistent Local Storage Mode.
            </div>
            <div className="flex items-center gap-1">
              <span>Crafted for computer science students mastering algorithms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
