"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Filter, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";
import { pyqData } from "@/data/pyqs";
import { useStore } from "@/store/useStore";
import LearningRequirements from "@/components/LearningRequirements";

export default function PracticePage() {
  const { updatePracticeProgress, practiceProgress, markConceptPracticed, markHandwritten, removeHandwrittenPhoto, conceptProgress, markVideoWatched, isVideoWatched, isRequirementsMet } = useStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedUnit, setSelectedUnit] = useState<number>(0);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const difficulties = ["All", "Easy", "Medium", "PYQ Level", "Hard"];
  const units = [0, 1, 2, 3, 4, 5];

  const filteredPYQs = pyqData.filter((pyq) => {
    const difficultyMatch = selectedDifficulty === "All" || pyq.difficulty === selectedDifficulty;
    const unitMatch = selectedUnit === 0 || pyq.unit === selectedUnit;
    return difficultyMatch && unitMatch;
  });

  // Group by unit when "All Units" is selected
  const groupedByUnit = selectedUnit === 0 
    ? [1, 2, 3, 4, 5].map(unit => ({
        unit,
        questions: filteredPYQs.filter(pyq => pyq.unit === unit)
      })).filter(group => group.questions.length > 0)
    : [{ unit: selectedUnit, questions: filteredPYQs }];

  const getProgress = (topic: string) => {
    const progress = practiceProgress[topic];
    if (!progress) return null;
    const percentage = (progress.correct / progress.total) * 100;
    return { percentage, correct: progress.correct, total: progress.total };
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

        <h1 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <Target className="w-8 h-8" />
          Practice Mode
        </h1>

        {/* Filters */}
        <div className="glass-card p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 opacity-70" />
            <span className="font-semibold">Filters</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedDifficulty === difficulty
                    ? "bg-gradient-to-r from-orange to-ocean text-white"
                    : "glass hover:bg-white/10"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {units.map((unit) => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
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
        </div>

        {/* Questions Grid */}
        <div className="mb-4 opacity-70">
          Showing {filteredPYQs.length} questions
        </div>

        {groupedByUnit.map((group, groupIndex) => (
          <div key={group.unit} className="mb-8">
            {selectedUnit === 0 && (
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange to-ocean text-white text-sm">
                  Unit {group.unit}
                </span>
                <span className="opacity-70 text-lg">({group.questions.length} questions)</span>
              </h2>
            )}
            <div className="grid gap-4">
              {group.questions.map((pyq, index) => {
                const progress = getProgress(pyq.topic);
                const isExpanded = expandedQuestion === pyq.id;
                return (
                  <div
                    key={pyq.id}
                    className="glass-card p-5 animate-fade-in"
                    style={{ animationDelay: `${(groupIndex * 100) + (index * 50)}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedUnit === 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                            Unit {pyq.unit}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-ocean/20 text-ocean text-xs">
                          {pyq.marks} Marks
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            pyq.difficulty === "Easy"
                              ? "bg-green-20 text-green"
                              : pyq.difficulty === "Medium"
                              ? "bg-yellow-20 text-yellow"
                              : pyq.difficulty === "PYQ Level"
                              ? "bg-orange/20 text-orange"
                              : "bg-red-20 text-red"
                          }`}
                        >
                          {pyq.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-peach/20 text-peach text-xs">
                          {pyq.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {progress && (
                          <div className="text-right">
                            <div className="text-sm font-semibold">{progress.percentage.toFixed(0)}%</div>
                            <div className="text-xs opacity-70">
                              {progress.correct}/{progress.total} correct
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => setExpandedQuestion(isExpanded ? null : pyq.id)}
                          className="p-2 rounded-full glass hover:bg-white/10 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{pyq.topic}</h3>
                    <p className="opacity-70 text-sm mb-4 whitespace-pre-wrap">{pyq.question}</p>

                    {isExpanded && (
                      <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
                        {/* Solution Steps */}
                        {pyq.steps && pyq.steps.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-ocean"></span>
                              Solution Steps
                            </h4>
                            <div className="space-y-3">
                              {pyq.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="pl-4 border-l-2 border-white/10">
                                  <div className="font-medium text-sm mb-1">Step {step.step}: {step.title}</div>
                                  <div className="text-xs opacity-70 mb-1">{step.explanation}</div>
                                  {step.calculation && (
                                    <div className="text-xs bg-black/20 p-2 rounded mt-1 font-mono">
                                      {step.calculation}
                                    </div>
                                  )}
                                  {step.finalAnswer && (
                                    <div className="text-xs text-green font-semibold mt-1">
                                      ✓ {step.finalAnswer}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Answer for theoretical questions */}
                        {pyq.answer && !pyq.steps && (
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-ocean"></span>
                              Answer
                            </h4>
                            <div className="text-sm opacity-90 whitespace-pre-wrap bg-black/20 p-3 rounded">
                              {pyq.answer}
                            </div>
                          </div>
                        )}

                        {/* Learning Requirements - Strict Mode */}
                        <LearningRequirements
                          itemId={pyq.id}
                          youtubeUrl={pyq.youtubeUrl}
                          onPhotoUploaded={(photo: string) => markHandwritten(pyq.id, photo)}
                          onPhotoRemoved={(photoIndex: number) => removeHandwrittenPhoto(pyq.id, photoIndex)}
                          photos={conceptProgress[pyq.id]?.handwrittenPhotos || []}
                          isVideoWatched={isVideoWatched(pyq.id)}
                          onVideoWatched={() => markVideoWatched(pyq.id)}
                          requirementsMet={isRequirementsMet(pyq.id)}
                        />
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          updatePracticeProgress(pyq.topic, true);
                          markConceptPracticed(pyq.topic);
                        }}
                        className="flex-1 py-2 rounded-full bg-green/20 text-green hover:bg-green/30 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Correct
                      </button>
                      <button
                        onClick={() => {
                          updatePracticeProgress(pyq.topic, false);
                          markConceptPracticed(pyq.topic);
                        }}
                        className="flex-1 py-2 rounded-full bg-red/20 text-red hover:bg-red/30 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Incorrect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredPYQs.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg opacity-70">No questions match your filters.</p>
            <p className="opacity-50">Try adjusting your selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
