"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lightbulb, RotateCw, Bookmark } from "lucide-react";
import { syllabusData } from "@/data/syllabus";
import { useStore } from "@/store/useStore";
import LearningRequirements from "@/components/LearningRequirements";

interface FormulaCard {
  id: string;
  concept: string;
  formula: string;
  whenToUse: string;
  unit: number;
}

export default function FormulasPage() {
  const { addBookmark, isBookmarked, removeBookmark, markHandwritten, removeHandwrittenPhoto, conceptProgress, markVideoWatched, isVideoWatched, isRequirementsMet } = useStore();
  const [selectedUnit, setSelectedUnit] = useState<number>(0);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  // Extract formulas from syllabus
  const allFormulas: FormulaCard[] = [];
  syllabusData.forEach((unit) => {
    unit.concepts.forEach((concept) => {
      if (concept.formula) {
        allFormulas.push({
          id: concept.id,
          concept: concept.title,
          formula: concept.formula,
          whenToUse: concept.whenToUse || "Refer to concept details",
          unit: unit.id,
        });
      }
    });
  });

  const filteredFormulas =
    selectedUnit === 0 ? allFormulas : allFormulas.filter((f) => f.unit === selectedUnit);

  const handleBookmark = (formula: FormulaCard) => {
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
          <button
            onClick={shuffleFormulas}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            Shuffle
          </button>
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

        {/* Flashcards Grid */}
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
                      <span className="text-xs font-semibold text-ocean">When to use</span>
                    </div>
                    <p className="text-xs opacity-90">{formula.whenToUse}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFormulas.length === 0 && (
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
