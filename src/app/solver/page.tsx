"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, MessageCircle, ChevronDown, ChevronUp, Play, Maximize2, Minimize2, ChevronRight, Baby, GraduationCap } from "lucide-react";
import { pyqData, type PYQ, type PYQStep } from "@/data/pyqs";
import { explainNumerical } from "@/services/aiTutor";
import { useStore } from "@/store/useStore";
import PhotoUpload from "@/components/PhotoUpload";

export default function SolverPage() {
  const { addMistake, updatePracticeProgress, markHandwritten, removeHandwrittenPhoto, conceptProgress } = useStore();
  const [selectedPYQ, setSelectedPYQ] = useState<PYQ | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);

  const numericalPYQs = pyqData.filter((pyq) => pyq.type === "numerical");

  const toggleStep = (stepNum: number) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepNum)) {
        newSet.delete(stepNum);
      } else {
        newSet.add(stepNum);
      }
      return newSet;
    });
  };

  const handleAskAI = async (pyq: PYQ) => {
    setIsLoadingAI(true);
    setAiExplanation("");
    try {
      const explanation = await explainNumerical(pyq.question, simpleMode);
      setAiExplanation(explanation);
    } catch (error) {
      setAiExplanation("Sorry, I couldn't get an explanation right now. Please try again.");
    }
    setIsLoadingAI(false);
  };

  if (selectedPYQ) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!focusMode && (
            <button
              onClick={() => setSelectedPYQ(null)}
              className="flex items-center gap-2 mb-6 opacity-70 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to numericals
            </button>
          )}

          <div className="glass-card p-6 md:p-8 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-orange/20 text-orange text-sm font-semibold">
                    Unit {selectedPYQ.unit}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-ocean/20 text-ocean text-sm">
                    {selectedPYQ.marks} Marks
                  </span>
                  {selectedPYQ.youtubeUrl && (
                    <a
                      href={selectedPYQ.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-red/20 text-red text-sm flex items-center gap-1 hover:bg-red/30 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      Watch Video
                    </a>
                  )}
                </div>
                <h1 className="text-xl md:text-2xl font-bold">{selectedPYQ.topic}</h1>
              </div>
              <button
                onClick={() => setFocusMode(!focusMode)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
              >
                {focusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="glass p-4 mb-6">
              <h3 className="font-semibold mb-2">Question</h3>
              <p className="opacity-90">{selectedPYQ.question}</p>
              {selectedPYQ.data && (
                <pre className="mt-3 p-3 rounded-lg bg-black/10 text-sm overflow-x-auto">
                  {JSON.stringify(selectedPYQ.data, null, 2)}
                </pre>
              )}
            </div>

            {/* Photo Upload Requirement */}
            <PhotoUpload
              itemId={selectedPYQ.id}
              onPhotoUploaded={(photo) => markHandwritten(selectedPYQ.id, photo)}
              onPhotoRemoved={(photoIndex) => removeHandwrittenPhoto(selectedPYQ.id, photoIndex)}
              photos={conceptProgress[selectedPYQ.id]?.handwrittenPhotos || []}
            />

            {/* Step-by-Step Solution */}
            {selectedPYQ.steps && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Step-by-Step Solution
                </h3>
                <div className="space-y-3">
                  {selectedPYQ.steps.map((step: PYQStep, index: number) => (
                    <div key={step.step} className="glass p-4">
                      <button
                        onClick={() => toggleStep(step.step)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-orange to-ocean text-white flex items-center justify-center font-bold text-sm">
                            {step.step}
                          </span>
                          <span className="font-semibold">{step.title}</span>
                        </div>
                        {expandedSteps.has(step.step) ? (
                          <ChevronUp className="w-5 h-5 opacity-50" />
                        ) : (
                          <ChevronDown className="w-5 h-5 opacity-50" />
                        )}
                      </button>

                      {expandedSteps.has(step.step) && (
                        <div className="mt-4 ml-11 space-y-3 animate-fade-in">
                          <p className="opacity-90">{step.explanation}</p>
                          {step.formula && (
                            <div className="p-3 rounded-lg bg-black/5">
                              <span className="text-sm opacity-70">Formula: </span>
                              <code className="font-semibold">{step.formula}</code>
                            </div>
                          )}
                          {step.substitution && (
                            <div className="p-3 rounded-lg bg-black/5">
                              <span className="text-sm opacity-70">Substitution: </span>
                              <code>{step.substitution}</code>
                            </div>
                          )}
                          {step.calculation && (
                            <div className="p-3 rounded-lg bg-black/5">
                              <span className="text-sm opacity-70">Calculation: </span>
                              <code>{step.calculation}</code>
                            </div>
                          )}
                          {step.finalAnswer && (
                            <div className="p-3 rounded-lg bg-gradient-to-r from-orange/20 to-ocean/20 border border-orange/30">
                              <span className="text-sm opacity-70">Final Answer: </span>
                              <span className="font-bold">{step.finalAnswer}</span>
                            </div>
                          )}
                          {step.whyThisStep && (
                            <div className="p-3 rounded-lg bg-ocean/10 border-l-4 border-ocean">
                              <span className="text-sm font-semibold text-ocean">💡 Why this step? </span>
                              <span className="opacity-90">{step.whyThisStep}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Tutor */}
            <div className="glass p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Ask AI Tutor
              </h3>
              
              {/* Simple Mode Toggle */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-white/5">
                <button
                  onClick={() => setSimpleMode(!simpleMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    simpleMode ? 'bg-orange' : 'bg-gray-600'
                  }`}
                  aria-label={simpleMode ? "Disable simple mode" : "Enable simple mode"}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      simpleMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  {simpleMode ? (
                    <>
                      <Baby className="w-4 h-4 text-orange" />
                      <span className="text-sm">Simple Mode (5-year-old explanation)</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4 text-ocean" />
                      <span className="text-sm">Standard Mode (exam-focused)</span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleAskAI(selectedPYQ)}
                disabled={isLoadingAI}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange to-ocean text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4" />
                {isLoadingAI ? "Getting explanation..." : "Explain this numerical"}
              </button>
              {aiExplanation && (
                <div className="mt-4 p-4 rounded-xl bg-white/10 animate-fade-in">
                  <p className="opacity-90 whitespace-pre-wrap">{aiExplanation}</p>
                </div>
              )}
            </div>

            {/* Next Step Suggestion */}
            {!focusMode && (
              <div className="glass p-4 bg-gradient-to-r from-orange/10 to-ocean/10 border border-orange/20">
                <h3 className="font-semibold mb-2">Next Step</h3>
                <Link
                  href="/practice"
                  className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5 opacity-70" />
                    <span>Practice more questions on this topic</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
              </div>
            )}

            {/* Related Questions */}
            {!focusMode && (
              <div className="glass p-4">
                <h3 className="font-semibold mb-3">Related Questions</h3>
                <div className="space-y-2">
                  {numericalPYQs
                    .filter((pyq) => pyq.unit === selectedPYQ.unit && pyq.id !== selectedPYQ.id)
                    .slice(0, 3)
                    .map((relatedPYQ) => (
                      <button
                        key={relatedPYQ.id}
                        onClick={() => setSelectedPYQ(relatedPYQ)}
                        className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="text-sm font-semibold">{relatedPYQ.topic}</div>
                        <div className="text-xs opacity-60">{relatedPYQ.marks} marks • {relatedPYQ.year}</div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
          <Calculator className="w-8 h-8" />
          Numerical Solver
        </h1>

        <p className="text-lg opacity-70 mb-8">
          Step-by-step solutions with formula, substitution, and explanations.
        </p>

        <div className="grid gap-3">
          {numericalPYQs.map((pyq, index) => (
            <button
              key={pyq.id}
              onClick={() => setSelectedPYQ(pyq)}
              className="glass-card p-4 text-left hover:scale-[1.01] transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                      Unit {pyq.unit}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-ocean/20 text-ocean text-xs">
                      {pyq.marks} Marks
                    </span>
                    {pyq.youtubeUrl && (
                      <span className="px-2 py-0.5 rounded-full bg-red/20 text-red text-xs flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        Video
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{pyq.topic}</h3>
                  <p className="opacity-70 text-sm line-clamp-1">{pyq.question}</p>
                </div>
                <Calculator className="w-5 h-5 opacity-30" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
