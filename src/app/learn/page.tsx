"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, MessageCircle, ChevronRight, Play, ChevronDown, Calculator, Baby, GraduationCap, Target } from "lucide-react";
import { syllabusData, type Concept } from "@/data/syllabus";
import { useStore } from "@/store/useStore";
import { getAIExplanation } from "@/services/aiTutor";
import LearningRequirements from "@/components/LearningRequirements";

export default function LearnPage() {
  const { addBookmark, isBookmarked, removeBookmark, markConceptLearned, markConceptPracticed, conceptProgress, markHandwritten, removeHandwrittenPhoto, markVideoWatched, isVideoWatched, isRequirementsMet, justPassMode } = useStore();
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [showAll, setShowAll] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);

  const currentUnit = syllabusData.find((u) => u.id === selectedUnit);

  // Filter concepts based on Just Pass Mode
  const filteredConcepts = currentUnit?.concepts.filter(concept => {
    if (!justPassMode) return true;
    // In Just Pass Mode, only show high-importance concepts (score >= 70)
    return (concept.importanceScore || 0) >= 70;
  }) || [];

  const handleBookmark = (concept: Concept) => {
    if (isBookmarked(concept.id)) {
      removeBookmark(concept.id);
    } else {
      addBookmark({
        type: "concept",
        itemId: concept.id,
        title: concept.title,
        unit: parseInt(concept.id.split("-")[0]),
      });
    }
  };

  const handleAskAI = async (concept: Concept) => {
    setIsLoadingAI(true);
    setAiExplanation("");
    try {
      const explanation = await getAIExplanation(concept.title, concept.description, simpleMode);
      setAiExplanation(explanation);
    } catch (error) {
      setAiExplanation("Sorry, I couldn't get an explanation right now. Please try again.");
    }
    setIsLoadingAI(false);
  };

  if (selectedConcept) {
    // Mark concept as learned when selected
    if (!conceptProgress[selectedConcept.id]?.learned) {
      markConceptLearned(selectedConcept.id);
    }

    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedConcept(null)}
            className="flex items-center gap-2 mb-6 opacity-70 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to concepts
          </button>

          <div className="glass-card p-6 md:p-8 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">{selectedConcept.title}</h1>
              <div className="flex gap-2">
                {selectedConcept.youtubeUrl && (
                  <a
                    href={selectedConcept.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-red/20 text-red hover:bg-red/30 transition-colors"
                    aria-label="Watch video on YouTube"
                  >
                    <Play className="w-5 h-5" />
                  </a>
                )}
                <button
                  onClick={() => handleBookmark(selectedConcept)}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked(selectedConcept.id)
                      ? "bg-orange text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked(selectedConcept.id) ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            {selectedConcept.pyqTag && (
              <div className="inline-block px-3 py-1 rounded-full bg-orange/20 text-orange text-sm font-semibold mb-4">
                📚 PYQ Topic {selectedConcept.pyqYears?.join(", ")}
              </div>
            )}

            {/* Progress indicator */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${conceptProgress[selectedConcept.id]?.learned ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm opacity-70">
                  {conceptProgress[selectedConcept.id]?.learned ? 'Learned' : 'Not learned'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${conceptProgress[selectedConcept.id]?.practiced ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm opacity-70">
                  {conceptProgress[selectedConcept.id]?.practiced ? 'Practiced' : 'Not practiced'}
                </span>
              </div>
            </div>

            <p className="text-lg opacity-90 mb-6 leading-relaxed">{selectedConcept.description}</p>

            {/* Learning Requirements - Strict Mode */}
            <LearningRequirements
              itemId={selectedConcept.id}
              youtubeUrl={selectedConcept.youtubeUrl}
              onPhotoUploaded={(photo: string) => markHandwritten(selectedConcept.id, photo)}
              onPhotoRemoved={(photoIndex: number) => removeHandwrittenPhoto(selectedConcept.id, photoIndex)}
              photos={conceptProgress[selectedConcept.id]?.handwrittenPhotos || []}
              isVideoWatched={isVideoWatched(selectedConcept.id)}
              onVideoWatched={() => markVideoWatched(selectedConcept.id)}
              requirementsMet={isRequirementsMet(selectedConcept.id)}
            />

            {selectedConcept.formula && (
              <div className="glass p-4 mb-4">
                <h3 className="font-semibold mb-2">Formula</h3>
                <code className="text-lg">{selectedConcept.formula}</code>
              </div>
            )}

            {selectedConcept.whenToUse && (
              <div className="glass p-4 mb-6">
                <h3 className="font-semibold mb-2">When to use this</h3>
                <p className="opacity-90">{selectedConcept.whenToUse}</p>
              </div>
            )}

            <div className="glass p-4 mb-6">
              <h3 className="font-semibold mb-3">Ask AI Tutor</h3>
              
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
                onClick={() => handleAskAI(selectedConcept)}
                disabled={isLoadingAI}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange to-ocean text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4" />
                {isLoadingAI ? "Getting explanation..." : "Explain this concept"}
              </button>
              {aiExplanation && (
                <div className="mt-4 p-4 rounded-xl bg-white/10 animate-fade-in">
                  <p className="opacity-90">{aiExplanation}</p>
                </div>
              )}
            </div>

            {/* Next Step Suggestion */}
            <div className="glass p-4 bg-gradient-to-r from-orange/10 to-ocean/10 border border-orange/20">
              <h3 className="font-semibold mb-2">Next Step</h3>
              <Link
                href="/solver"
                className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 opacity-70" />
                  <span>Practice related numericals</span>
                </div>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const visibleConcepts = showAll ? filteredConcepts : filteredConcepts.slice(0, visibleCount);

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

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Unit-wise Learning</h1>

        {/* Unit Selector - Simplified */}
        <div className="flex flex-wrap gap-2 mb-6">
          {syllabusData.map((unit) => (
            <button
              key={unit.id}
              onClick={() => {
                setSelectedUnit(unit.id);
                setVisibleCount(5);
                setShowAll(false);
              }}
              className={`px-4 py-2 rounded-full transition-all text-sm ${
                selectedUnit === unit.id
                  ? "bg-gradient-to-r from-orange to-ocean text-white"
                  : "glass hover:bg-white/10"
              }`}
            >
              Unit {unit.id}
            </button>
          ))}
        </div>

        {/* Unit Content */}
        {currentUnit && (
          <div className="animate-fade-in">
            {/* Just Pass Mode Banner */}
            {justPassMode && (
              <div className="glass-card p-4 mb-6 border-2 border-orange/50 bg-gradient-to-r from-orange/10 to-ocean/10">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-orange" />
                  <div>
                    <h3 className="font-bold text-orange">Just Pass Mode ON</h3>
                    <p className="text-sm opacity-70">Ignore the rest. This is enough to pass.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="glass-card p-5 mb-6">
              <h2 className="text-xl font-bold mb-1">{currentUnit.title}</h2>
              <p className="text-sm opacity-70">
                {currentUnit.hours} Hours • {currentUnit.co} • {justPassMode ? `${filteredConcepts.length} high-yield` : currentUnit.concepts.length} concepts
              </p>
            </div>

            <div className="grid gap-3">
              {visibleConcepts?.map((concept, index) => (
                <button
                  key={concept.id}
                  onClick={() => setSelectedConcept(concept)}
                  className="glass-card p-4 text-left hover:scale-[1.01] transition-all duration-200 animate-fade-in group"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold group-hover:text-orange transition-colors">
                          {concept.title}
                        </h3>
                        {concept.pyqTag && (
                          <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                            PYQ
                          </span>
                        )}
                        {concept.youtubeUrl && (
                          <span className="px-2 py-0.5 rounded-full bg-red/20 text-red text-xs flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            Video
                          </span>
                        )}
                        {concept.importanceScore && (
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            concept.importanceScore >= 85 ? 'bg-red/20 text-red' :
                            concept.importanceScore >= 70 ? 'bg-orange/20 text-orange' :
                            'bg-green/20 text-green'
                          }`}>
                            {concept.importanceScore >= 85 ? '🔥 Critical' :
                             concept.importanceScore >= 70 ? '⭐ Important' : '✓ Standard'}
                          </span>
                        )}
                      </div>
                      <p className="opacity-70 text-sm line-clamp-1">{concept.description}</p>
                      {concept.importanceScore && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                concept.importanceScore >= 85 ? 'bg-red' :
                                concept.importanceScore >= 70 ? 'bg-orange' : 'bg-green'
                              }`}
                              style={{ width: `${concept.importanceScore}%` }}
                            />
                          </div>
                          <span className="opacity-70">{concept.marksWeightage || 6} marks</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:text-orange transition-all" />
                  </div>
                </button>
              ))}
            </div>

            {/* Load More Button */}
            {filteredConcepts.length > visibleCount && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full mt-4 py-3 rounded-xl glass hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronDown className="w-4 h-4" />
                Show all {currentUnit.concepts.length} concepts
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
