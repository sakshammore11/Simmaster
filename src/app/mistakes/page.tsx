"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, TrendingUp, BookOpen, Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { pyqData } from "@/data/pyqs";
import { syllabusData } from "@/data/syllabus";

export default function MistakesPage() {
  const { mistakes, getWeakTopics, practiceProgress } = useStore();
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  const weakTopics = getWeakTopics();
  const topics = Array.from(new Set(mistakes.map((m) => m.topic)));

  const filteredMistakes =
    selectedTopic === "All" ? mistakes : mistakes.filter((m) => m.topic === selectedTopic);

  // Get related PYQs and concepts for weak topics
  const getRecommendations = (topic: string) => {
    const relatedPYQs = pyqData.filter((pyq) => pyq.topic.toLowerCase().includes(topic.toLowerCase()));
    const relatedConcepts = syllabusData.flatMap((unit) =>
      unit.concepts.filter((c) => c.title.toLowerCase().includes(topic.toLowerCase()))
    );
    return { pyqs: relatedPYQs, concepts: relatedConcepts };
  };

  const getProgressForTopic = (topic: string) => {
    const progress = practiceProgress[topic];
    if (!progress) return null;
    return {
      percentage: (progress.correct / progress.total) * 100,
      correct: progress.correct,
      total: progress.total,
    };
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
          <AlertCircle className="w-8 h-8 text-orange" />
          Mistake Tracker
        </h1>

        {mistakes.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2">No mistakes recorded!</h2>
            <p className="opacity-70">Great job! Keep practicing to maintain your streak.</p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-orange to-ocean text-white hover:opacity-90 transition-opacity"
            >
              Start Practicing
            </Link>
          </div>
        ) : (
          <>
            {/* Weak Topics Overview */}
            <div className="glass-card p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weak Topics Analysis
              </h2>
              <div className="grid gap-4">
                {weakTopics.slice(0, 5).map(({ topic, count }) => {
                  const progress = getProgressForTopic(topic);
                  const { pyqs, concepts } = getRecommendations(topic);
                  return (
                    <div key={topic} className="glass p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{topic}</span>
                          <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                            {count} mistakes
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

                      {pyqs.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs opacity-70 mb-2">Related PYQs:</div>
                          <div className="flex flex-wrap gap-2">
                            {pyqs.slice(0, 3).map((pyq) => (
                              <Link
                                key={pyq.id}
                                href={`/solver#${pyq.id}`}
                                className="px-2 py-1 rounded-full bg-ocean/20 text-ocean text-xs hover:bg-ocean/30 transition-colors"
                              >
                                {pyq.topic}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {concepts.length > 0 && (
                        <div>
                          <div className="text-xs opacity-70 mb-2">Related Concepts:</div>
                          <div className="flex flex-wrap gap-2">
                            {concepts.slice(0, 3).map((concept) => (
                              <Link
                                key={concept.id}
                                href={`/learn#${concept.id}`}
                                className="px-2 py-1 rounded-full bg-peach/20 text-peach text-xs hover:bg-peach/30 transition-colors"
                              >
                                {concept.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Topic Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedTopic("All")}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedTopic === "All"
                    ? "bg-gradient-to-r from-orange to-ocean text-white"
                    : "glass hover:bg-white/10"
                }`}
              >
                All Topics ({mistakes.length})
              </button>
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedTopic === topic
                      ? "bg-gradient-to-r from-orange to-ocean text-white"
                      : "glass hover:bg-white/10"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Mistakes List */}
            <div className="grid gap-4">
              {filteredMistakes.map((mistake, index) => {
                const relatedPYQ = pyqData.find((pyq) => pyq.id === mistake.questionId);
                return (
                  <div key={mistake.id} className="glass-card p-5 animate-fade-in">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                          Unit {mistake.unit}
                        </span>
                        <span className="font-semibold">{mistake.topic}</span>
                      </div>
                      <span className="text-xs opacity-50">
                        {new Date(mistake.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {relatedPYQ && (
                      <div className="mb-3">
                        <p className="opacity-90 text-sm mb-2">{relatedPYQ.question}</p>
                      </div>
                    )}

                    {mistake.yourAnswer && (
                      <div className="p-3 rounded-lg bg-red/10 border-l-4 border-red mb-3">
                        <span className="text-xs opacity-70">Your answer: </span>
                        <span className="opacity-90">{mistake.yourAnswer}</span>
                      </div>
                    )}

                    {mistake.correctAnswer && (
                      <div className="p-3 rounded-lg bg-green/10 border-l-4 border-green mb-4">
                        <span className="text-xs opacity-70">Correct answer: </span>
                        <span className="opacity-90">{mistake.correctAnswer}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {relatedPYQ && (
                        <Link
                          href={`/solver#${relatedPYQ.id}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors text-sm"
                        >
                          <BookOpen className="w-4 h-4" />
                          View Solution
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredMistakes.length === 0 && selectedTopic !== "All" && (
              <div className="glass-card p-12 text-center">
                <p className="opacity-70">No mistakes recorded for this topic.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
