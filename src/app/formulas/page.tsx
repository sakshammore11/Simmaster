"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lightbulb, RotateCw, Bookmark } from "lucide-react";
import { formulasData, type Formula } from "@/data/formulas";
import { useStore } from "@/store/useStore";
import LearningRequirements from "@/components/LearningRequirements";

export default function FormulasPage() {
  const { addBookmark, isBookmarked, removeBookmark, markHandwritten, removeHandwrittenPhoto, conceptProgress, markVideoWatched, isVideoWatched, isRequirementsMet, formulaMastery, updateFormulaMastery, getWeakFormulas } = useStore();
  const [selectedUnit, setSelectedUnit] = useState<number>(0);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [memorizeMode, setMemorizeMode] = useState(false);
  const [currentFormulaIndex, setCurrentFormulaIndex] = useState(0);
  const [showFormula, setShowFormula] = useState(false);
  const [activeRecallMode, setActiveRecallMode] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  const filteredFormulas =
    selectedUnit === 0 ? formulasData : formulasData.filter((f) => f.unit === selectedUnit);

  const handleBookmark = (formula: Formula) => {
    if (isBookmarked(formula.id)) {
      removeBookmark(formula.id);
    } else {
      addBookmark({
        type: "formula",
        itemId: formula.id,
        title: formula.concept,
        unit: formula.unit,
      });
    }
  };

  const shuffleFormulas = () => {
    setFlippedCard(null);
    // Add a small animation effect by re-rendering
  };

  // Memorize mode handlers
  const handleMemorizeNext = () => {
    if (currentFormulaIndex < filteredFormulas.length - 1) {
      setCurrentFormulaIndex(currentFormulaIndex + 1);
      setShowFormula(false);
    }
  };

  const handleMemorizePrevious = () => {
    if (currentFormulaIndex > 0) {
      setCurrentFormulaIndex(currentFormulaIndex - 1);
      setShowFormula(false);
    }
  };

  const handleMarkMemorized = (formulaId: string) => {
    updateFormulaMastery(formulaId, true);
    handleMemorizeNext();
  };

  const currentFormula = filteredFormulas[currentFormulaIndex];
  const memorizedCount = Object.values(formulaMastery).filter(m => m.strength === "Strong").length;
  const memorizeProgress = memorizedCount / filteredFormulas.length * 100;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Lightbulb className="w-8 h-8" />
            Formula Revision
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMemorizeMode(!memorizeMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                memorizeMode
                  ? "bg-gradient-to-r from-orange to-ocean text-white"
                  : "glass hover:bg-white/10"
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              {memorizeMode ? "Exit Memorize" : "Memorize Mode"}
            </button>
            <button
              onClick={() => setActiveRecallMode(!activeRecallMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                activeRecallMode
                  ? "bg-gradient-to-r from-red to-orange text-white"
                  : "glass hover:bg-white/10"
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              {activeRecallMode ? "Exit Recall" : "Active Recall"}
            </button>
            <button
              onClick={shuffleFormulas}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              Shuffle
            </button>
          </div>
        </div>

        {/* Unit Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[0, 1, 2, 3, 4, 5].map((unit) => (
            <button
              key={unit}
              onClick={() => {
                setSelectedUnit(unit);
                setFlippedCard(null);
              }}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedUnit === unit
                  ? "bg-gradient-to-r from-orange to-ocean text-white"
                  : "glass hover:bg-white/10"
              }`}
            >
              {unit === 0 ? "All Units" : `Unit ${unit}`}
            </button>
          ))}
        </div>

        {/* Memorize Mode */}
        {memorizeMode && currentFormula && (
          <div className="glass-card p-8 text-center animate-fade-in">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-70">Memorization Progress</span>
                <span className="text-sm font-semibold">{memorizedCount}/{filteredFormulas.length}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange to-ocean transition-all duration-300"
                  style={{ width: `${memorizeProgress}%` }}
                />
              </div>
            </div>

            {/* Formula Card */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-orange/20 text-orange text-sm">
                  Unit {currentFormula.unit}
                </span>
                <span className="text-sm opacity-70">
                  {currentFormulaIndex + 1} of {filteredFormulas.length}
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-6">{currentFormula.concept}</h2>

              <div
                className={`glass p-8 mb-6 cursor-pointer transition-all ${
                  showFormula ? 'bg-gradient-to-br from-orange/20 to-ocean/20' : ''
                }`}
                onClick={() => setShowFormula(!showFormula)}
              >
                {showFormula ? (
                  <code className="text-2xl font-mono">{currentFormula.formula}</code>
                ) : (
                  <p className="text-lg opacity-70">Click to reveal formula</p>
                )}
              </div>

              {showFormula && (
                <div className="p-4 rounded-lg bg-black/5 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-ocean" />
                    <span className="text-sm font-semibold text-ocean">Meaning</span>
                  </div>
                  <p className="text-sm opacity-90">{currentFormula.meaning}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleMemorizePrevious}
                  disabled={currentFormulaIndex === 0}
                  className="px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handleMarkMemorized(currentFormula.id)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-orange to-ocean text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {formulaMastery[currentFormula.id]?.strength === "Strong" ? "Memorized ✓" : "Mark as Memorized"}
                </button>
                <button
                  onClick={handleMemorizeNext}
                  disabled={currentFormulaIndex === filteredFormulas.length - 1}
                  className="px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {currentFormulaIndex === filteredFormulas.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Recall Mode */}
        {activeRecallMode && currentFormula && (
          <div className="glass-card p-8 text-center animate-fade-in border-2 border-red/50 bg-gradient-to-r from-red/10 to-orange/10">
            <h2 className="text-2xl font-bold mb-4 text-red">Active Recall Mode</h2>
            <p className="opacity-70 mb-6">Type the formula from memory. No peeking!</p>

            {!showResult ? (
              <>
                <div className="mb-6">
                  <div className="text-lg font-semibold mb-4">{currentFormula.concept}</div>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type the formula here..."
                    className="w-full px-4 py-3 rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-red/50 text-center text-lg font-mono"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        setShowResult(true);
                        const isCorrect = userAnswer.toLowerCase().includes(currentFormula.formula.toLowerCase().replace(/\s/g, ''));
                        updateFormulaMastery(currentFormula.id, isCorrect);
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setShowResult(true);
                      const isCorrect = userAnswer.toLowerCase().includes(currentFormula.formula.toLowerCase().replace(/\s/g, ''));
                      updateFormulaMastery(currentFormula.id, isCorrect);
                    }}
                    disabled={!userAnswer.trim()}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-red to-orange text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={() => {
                      setShowResult(true);
                      updateFormulaMastery(currentFormula.id, false);
                    }}
                    className="px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors"
                  >
                    I Don't Know
                  </button>
                </div>
              </>
            ) : (
              <div className="animate-fade-in">
                <div className={`p-4 rounded-lg mb-4 border-l-4 ${
                  userAnswer.toLowerCase().includes(currentFormula.formula.toLowerCase().replace(/\s/g, ''))
                    ? "bg-green/10 border-green"
                    : "bg-red/10 border-red"
                }`}>
                  <div className="text-lg font-semibold mb-2">
                    {userAnswer.toLowerCase().includes(currentFormula.formula.toLowerCase().replace(/\s/g, ''))
                      ? "✓ Correct!"
                      : "✗ Incorrect"}
                  </div>
                  <div className="text-sm opacity-70">
                    Your answer: {userAnswer || "(empty)"}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/10 mb-4">
                  <div className="text-sm opacity-70 mb-2">Correct formula:</div>
                  <code className="text-xl font-mono">{currentFormula.formula}</code>
                </div>

                <div className="p-4 rounded-lg bg-white/5 mb-4">
                  <div className="text-sm opacity-70 mb-2">Meaning:</div>
                  <p className="opacity-90">{currentFormula.meaning}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm opacity-70">Mastery:</span>
                  <span className={`font-semibold ${
                    formulaMastery[currentFormula.id]?.strength === "Strong" ? "text-green" :
                    formulaMastery[currentFormula.id]?.strength === "Medium" ? "text-orange" : "text-red"
                  }`}>
                    {formulaMastery[currentFormula.id]?.strength || "Weak"}
                  </span>
                </div>

                <button
                  onClick={() => {
                    handleMemorizeNext();
                    setUserAnswer("");
                    setShowResult(false);
                  }}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-orange to-ocean text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Next Formula
                </button>
              </div>
            )}
          </div>
        )}

        {/* Flashcards Grid */}
        {!memorizeMode && !activeRecallMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFormulas.map((formula, index) => (
              <div
                key={formula.id}
                className="relative h-64 cursor-pointer perspective-1000 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setFlippedCard(flippedCard === formula.id ? null : formula.id)}
              >
                <div
                  className={`relative w-full h-full transition-all duration-500 preserve-3d ${
                    flippedCard === formula.id ? "rotate-y-180" : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flippedCard === formula.id ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute w-full h-full glass-card p-6 backface-hidden flex flex-col justify-between"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                          Unit {formula.unit}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark(formula);
                          }}
                          className={`p-1 rounded-full transition-colors ${
                            isBookmarked(formula.id)
                              ? "bg-orange text-white"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${isBookmarked(formula.id) ? "fill-current" : ""}`}
                          />
                        </button>
                      </div>
                      <h3 className="font-semibold mb-3">{formula.concept}</h3>
                      <p className="text-sm opacity-70">Click to reveal formula</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-50">
                      <RotateCw className="w-3 h-3" />
                      Tap to flip
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute w-full h-full glass-card p-6 backface-hidden flex flex-col justify-between bg-gradient-to-br from-orange/20 to-ocean/20"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div>
                      <h3 className="font-semibold mb-3">{formula.concept}</h3>
                      <div className="glass p-4 mb-4">
                        <code className="text-lg font-mono">{formula.formula}</code>
                      </div>
                    </div>
                    
                    {/* Learning Requirements - Strict Mode */}
                    <LearningRequirements
                      itemId={formula.id}
                      youtubeUrl={undefined}
                      onPhotoUploaded={(photo: string) => markHandwritten(formula.id, photo)}
                      onPhotoRemoved={(photoIndex: number) => removeHandwrittenPhoto(formula.id, photoIndex)}
                      photos={conceptProgress[formula.id]?.handwrittenPhotos || []}
                      isVideoWatched={isVideoWatched(formula.id)}
                      onVideoWatched={() => markVideoWatched(formula.id)}
                      requirementsMet={isRequirementsMet(formula.id)}
                    />

                    <div className="p-3 rounded-lg bg-black/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-ocean" />
                        <span className="text-xs font-semibold text-ocean">Meaning</span>
                      </div>
                      <p className="text-xs opacity-90">{formula.meaning}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFormulas.length === 0 && !memorizeMode && (
          <div className="glass-card p-12 text-center">
            <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg opacity-70">No formulas found for this unit.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
