"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Filter } from "lucide-react";
import { pyqData } from "@/data/pyqs";
import { useStore } from "@/store/useStore";
import PhotoUpload from "@/components/PhotoUpload";

export default function PracticePage() {
  const { updatePracticeProgress, practiceProgress, markConceptPracticed, markHandwritten, removeHandwrittenPhoto, conceptProgress } = useStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedUnit, setSelectedUnit] = useState<number>(0);

  const difficulties = ["All", "Easy", "Medium", "PYQ Level", "Hard"];
  const units = [0, 1, 2, 3, 4, 5];

  const filteredPYQs = pyqData.filter((pyq) => {
    const difficultyMatch = selectedDifficulty === "All" || pyq.difficulty === selectedDifficulty;
    const unitMatch = selectedUnit === 0 || pyq.unit === selectedUnit;
    return difficultyMatch && unitMatch;
  });

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

        <div className="grid gap-4">
          {filteredPYQs.map((pyq, index) => {
            const progress = getProgress(pyq.topic);
            return (
              <div
                key={pyq.id}
                className="glass-card p-5 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                      Unit {pyq.unit}
                    </span>
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
                  {progress && (
                    <div className="text-right">
                      <div className="text-sm font-semibold">{progress.percentage.toFixed(0)}%</div>
                      <div className="text-xs opacity-70">
                        {progress.correct}/{progress.total} correct
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">{pyq.topic}</h3>
                <p className="opacity-70 text-sm line-clamp-2 mb-4">{pyq.question}</p>

                {/* Photo Upload Requirement */}
                <PhotoUpload
                  itemId={pyq.id}
                  onPhotoUploaded={(photo) => markHandwritten(pyq.id, photo)}
                  onPhotoRemoved={(photoIndex) => removeHandwrittenPhoto(pyq.id, photoIndex)}
                  photos={conceptProgress[pyq.id]?.handwrittenPhotos || []}
                />

                <div className="flex gap-2">
                  <Link
                    href={`/solver#${pyq.id}`}
                    className="flex-1 py-2 rounded-full glass hover:bg-white/10 transition-colors text-center text-sm font-semibold"
                  >
                    View Solution
                  </Link>
                  <button
                    onClick={() => {
                      updatePracticeProgress(pyq.topic, true);
                      markConceptPracticed(pyq.topic);
                    }}
                    className="px-4 py-2 rounded-full bg-green/20 text-green hover:bg-green/30 transition-colors text-sm"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      updatePracticeProgress(pyq.topic, false);
                      markConceptPracticed(pyq.topic);
                    }}
                    className="px-4 py-2 rounded-full bg-red/20 text-red hover:bg-red/30 transition-colors text-sm"
                  >
                    ✗
                  </button>
                </div>
              </div>
            );
          })}
        </div>

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
