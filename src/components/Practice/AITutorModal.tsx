import React, { useState } from 'react';
import { 
  Cpu, 
  X, 
  Sparkles, 
  Send, 
  Lightbulb, 
  Loader2, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { PracticeChallenge } from '../../types/dsa';

interface AITutorModalProps {
  challenge: PracticeChallenge;
  userAnswer: string;
  onClose: () => void;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({ challenge, userAnswer, onClose }) => {
  const [hintLevel, setHintLevel] = useState<number>(1);
  const [tutorResponse, setTutorResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tutorSource, setTutorSource] = useState<string | null>(null);
  const [sourceNote, setSourceNote] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTutorHint = async (level: number) => {
    setIsLoading(true);
    setErrorMsg(null);
    setHintLevel(level);

    try {
      const res = await fetch('/api/tutor/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: challenge.topicId,
          problemTitle: challenge.title,
          questionText: challenge.description,
          userCodeOrAnswer: userAnswer,
          currentHintLevel: level,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTutorResponse(data.hint);
        setTutorSource(data.source || null);
        setSourceNote(data.note || null);
      } else {
        setTutorResponse(data.hint || 'Remember to break the problem into smaller invariant steps.');
        setTutorSource('curated-tutor');
        setErrorMsg('Live model is operating in offline mode. Curated tutor hint provided below.');
      }
    } catch (err: any) {
      console.error('Error contacting AI Tutor:', err);
      setTutorResponse(
        challenge.hints[Math.min(level - 1, challenge.hints.length - 1)] ||
        'Consider checking edge cases and loop invariants.'
      );
      setTutorSource('curated-tutor');
      setErrorMsg('Network error reaching tutor. Provided expert hint.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial hint on mount
  React.useEffect(() => {
    fetchTutorHint(1);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F172A] border border-blue-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Code League Socratic Tutor</h3>
                {tutorSource === 'gemini-3.8-flash' ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-medium">
                    Live Gemini 3.8 Flash
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-medium">
                    Curated Expert Tutor
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Guiding your algorithmic reasoning step-by-step
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Challenge Summary */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
            Problem Context:
          </span>
          <p className="text-slate-200 font-semibold">{challenge.title}</p>
        </div>

        {/* Hint Level Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Choose Guidance Depth:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { level: 1, label: 'Level 1: Gentle Nudge' },
              { level: 2, label: 'Level 2: Conceptual' },
              { level: 3, label: 'Level 3: Algorithm Step' },
            ].map((btn) => (
              <button
                key={btn.level}
                onClick={() => fetchTutorHint(btn.level)}
                disabled={isLoading}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition cursor-pointer text-center ${
                  hintLevel === btn.level
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tutor Response Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[110px] flex flex-col justify-between">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Consulting the AI DSA Tutor...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
                  {tutorResponse}
                </p>
              </div>

              {sourceNote && (
                <div className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-900">
                  {sourceNote}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[11px] text-slate-500">
            Hint Level {hintLevel} of 3
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            Got it, back to problem
          </button>
        </div>
      </div>
    </div>
  );
};
