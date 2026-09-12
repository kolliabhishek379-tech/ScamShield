import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, RotateCcw, Sparkles, Award } from 'lucide-react';
import { SPOT_THE_GLITCH_SCENARIOS } from '../../services/spotTheGlitchData';
import { SpotTheGlitchScenario } from '../../types/analysis';

export const SpotTheGlitch: React.FC = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedGlitchIds, setSelectedGlitchIds] = useState<string[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const scenario: SpotTheGlitchScenario = SPOT_THE_GLITCH_SCENARIOS[currentScenarioIndex];

  const handleToggleGlitch = (id: string) => {
    if (hasSubmitted) return;
    setSelectedGlitchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
  };

  const handleNext = () => {
    setSelectedGlitchIds([]);
    setHasSubmitted(false);
    setCurrentScenarioIndex((prev) => (prev + 1) % SPOT_THE_GLITCH_SCENARIOS.length);
  };

  const handleReset = () => {
    setSelectedGlitchIds([]);
    setHasSubmitted(false);
  };

  // Score calculations
  const correctGlitches = scenario.glitches.filter((g) => g.isCorrect);
  const userCorrectCount = selectedGlitchIds.filter((id) => {
    const g = scenario.glitches.find((gl) => gl.id === id);
    return g?.isCorrect;
  }).length;
  const userIncorrectCount = selectedGlitchIds.filter((id) => {
    const g = scenario.glitches.find((gl) => gl.id === id);
    return !g?.isCorrect;
  }).length;
  const missedCount = correctGlitches.length - userCorrectCount;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      {/* Title & Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Target className="w-3.5 h-3.5" />
          <span>Interactive Cyber Defense Drill</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Spot The Glitch: Can You Catch The Scam?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Train your instincts against deepfakes, urgency coercion, and fraudulent social engineering before you encounter them in the wild.
        </p>
      </div>

      {/* Scenario Indicator Navigation */}
      <div className="flex items-center justify-between py-2 px-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
        <span className="text-slate-400">
          Challenge {currentScenarioIndex + 1} of {SPOT_THE_GLITCH_SCENARIOS.length}
        </span>
        <div className="flex space-x-1.5">
          {SPOT_THE_GLITCH_SCENARIOS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentScenarioIndex(idx);
                setSelectedGlitchIds([]);
                setHasSubmitted(false);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentScenarioIndex ? 'bg-cyan-400 scale-110 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-slate-700'
              }`}
              title={`Jump to Challenge ${idx + 1}`}
            />
          ))}
        </div>
        <span className="text-cyan-400 font-semibold">{scenario.category}</span>
      </div>

      {/* Challenge Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f19]/95 border border-slate-800 space-y-6 shadow-xl">
        <div className="border-b border-slate-800/80 pb-4">
          <h3 className="text-lg font-bold text-white">{scenario.title}</h3>
          <p className="text-xs text-slate-400 mt-1">{scenario.prompt}</p>
        </div>

        {/* Suspicious Content Showcase */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Sender: {scenario.content.sender}</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              Platform: {scenario.platform}
            </span>
          </div>

          {scenario.content.imageUrl && (
            <div className="rounded-lg overflow-hidden max-h-[340px] flex justify-center bg-black border border-slate-800">
              <img
                src={scenario.content.imageUrl}
                alt="Target Portrait"
                className="max-h-[340px] w-auto object-contain select-none"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed break-words">
            {scenario.content.text}
          </div>
        </div>

        {/* Interactive Options: Which signals look suspicious? */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Select all elements that you believe are deceptive signals:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scenario.glitches.map((glitch) => {
              const isSelected = selectedGlitchIds.includes(glitch.id);

              let itemStyle = isSelected
                ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)] text-white'
                : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800 text-slate-300';

              if (hasSubmitted) {
                if (glitch.isCorrect && isSelected) {
                  itemStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                } else if (glitch.isCorrect && !isSelected) {
                  itemStyle = 'bg-amber-950/40 border-amber-500/60 text-amber-200'; // missed
                } else if (!glitch.isCorrect && isSelected) {
                  itemStyle = 'bg-rose-950/50 border-rose-500 text-rose-200'; // false positive
                }
              }

              return (
                <div
                  key={glitch.id}
                  onClick={() => handleToggleGlitch(glitch.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all select-none space-y-1 ${itemStyle}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold font-mono">{glitch.title}</span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected
                          ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                          : 'border-slate-600 bg-slate-950'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {hasSubmitted && (
                    <p className="text-[11px] text-slate-300 mt-2 pt-2 border-t border-slate-800/80 leading-relaxed">
                      {glitch.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit or Next Controls */}
        {!hasSubmitted ? (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-500 font-mono">
              {selectedGlitchIds.length} element{selectedGlitchIds.length === 1 ? '' : 's'} selected
            </span>
            <button
              onClick={handleSubmit}
              disabled={selectedGlitchIds.length === 0}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Submit & Reveal Analysis
            </button>
          </div>
        ) : (
          /* Post-submission scorecard and explanation */
          <div className="pt-4 border-t border-slate-800 space-y-5 animate-in fade-in">
            {/* Score pill */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Your Forensic Drill Result</h4>
                  <p className="text-xs text-slate-400">
                    Caught {userCorrectCount} of {correctGlitches.length} red flags • {userIncorrectCount} false alarm
                    {userIncorrectCount === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                  Retry
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center space-x-1"
                >
                  <span>Next Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* AI Forensic Analysis & Defense Takeaway */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5 text-xs">
                <span className="font-mono text-cyan-300 uppercase tracking-wider font-bold block">
                  AI Forensic Breakdown:
                </span>
                <p className="text-slate-300 leading-relaxed">{scenario.explanation}</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5 text-xs">
                <span className="font-mono text-emerald-300 uppercase tracking-wider font-bold block">
                  Key Security Takeaway:
                </span>
                <p className="text-slate-300 leading-relaxed">{scenario.takeaway}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
