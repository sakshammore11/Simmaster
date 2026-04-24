"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Clock, Target, AlertTriangle, BookOpen, Calculator, CheckCircle, ChevronRight } from "lucide-react";
import { syllabusData } from "@/data/syllabus";
import { formulasData } from "@/data/formulas";
import { useStore } from "@/store/useStore";

export default function PanicPage() {
  const { conceptProgress, practiceProgress } = useStore();
  const [activeTab, setActiveTab] = useState<"formulas" | "pyqs" | "numericals" | "topics">("formulas");

  // Get top formulas (highest importance)
  const topFormulas = formulasData
    .filter(f => {
      const concept = syllabusData
        .flatMap(u => u.concepts)
        .find(c => c.id === f.id);
      return (concept?.importanceScore || 0) >= 85;
    })
    .slice(0, 15);

  // Get top PYQ concepts (high importance + PYQ tag)
  const topPYQConcepts = syllabusData
    .flatMap(u => u.concepts)
    .filter(c => c.pyqTag && (c.importanceScore || 0) >= 80)
    .sort((a, b) => (b.importanceScore || 0) - (a.importanceScore || 0))
    .slice(0, 20);

  // Get most repeated numericals (high importance + formula)
  const repeatedNumericals = syllabusData
    .flatMap(u => u.concepts)
    .filter(c => c.formula && (c.importanceScore || 0) >= 85)
    .sort((a, b) => (b.importanceScore || 0) - (a.importanceScore || 0))
    .slice(0, 10);

  // Get high-weight topics (marksWeightage >= 8)
  const highWeightTopics = syllabusData
    .flatMap(u => u.concepts)
    .filter(c => (c.marksWeightage || 0) >= 8)
    .sort((a, b) => (b.marksWeightage || 0) - (a.marksWeightage || 0))
    .slice(0, 10);

  const tabs = [
    { id: "formulas" as const, label: "🔥 Top Formulas", icon: Flame, count: topFormulas.length },
    { id: "pyqs" as const, label: "📚 Top PYQs", icon: BookOpen, count: topPYQConcepts.length },
    { id: "numericals" as const, label: "🧮 Repeated Numericals", icon: Calculator, count: repeatedNumericals.length },
    { id: "topics" as const, label: "🎯 High-Weight Topics", icon: Target, count: highWeightTopics.length },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </Link>

        {/* Panic Mode Header */}
        <div className="glass-card p-6 mb-6 border-2 border-red/50 bg-gradient-to-r from-red/10 to-orange/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-red/20">
              <AlertTriangle className="w-8 h-8 text-red" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-red">PANIC MODE</h1>
              <p className="opacity-70">1-Day Emergency System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-orange" />
            <span className="font-semibold text-orange">Complete this in 3 hours</span>
          </div>
        </div>

        {/* Tabs */}
        <div="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange to-ocean text-white"
                  : "glass hover:bg-white/10"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className="opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === "formulas" && (
            <div className="space-y-3">
              <div className="glass-card p-4 mb-4">
                <h2 className="font-bold mb-2 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red" />
                  Must Memorize Formulas
                </h2>
                <p className="text-sm opacity-70">These formulas appear every year. Memorize them first.</p>
              </div>
              {topFormulas.map((formula, index) => (
                <div key={formula.id} className="glass-card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono bg-red/20 text-red px-2 py-0.5 rounded">
                          #{index + 1}
                        </span>
                        <h3 className="font-semibold">{formula.concept}</h3>
                      </div>
                      <code className="text-lg font-mono block mb-2">{formula.formula}</code>
                      <p className="text-sm opacity-70">{formula.meaning}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "pyqs" && (
            <div className="space-y-3">
              <div className="glass-card p-4 mb-4">
                <h2 className="font-bold mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange" />
                  Top 20 PYQ Topics
                </h2>
                <p className="text-sm opacity-70">These topics are asked repeatedly. Focus on these first.</p>
              </div>
              {topPYQConcepts.map((concept, index) => (
                <Link
                  key={concept.id}
                  href={`/learn?unit=${concept.id.split("-")[0]}&concept=${concept.id}`}
                  className="glass-card p-4 block hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono bg-orange/20 text-orange px-2 py-0.5 rounded">
                          #{index + 1}
                        </span>
                        <h3 className="font-semibold">{concept.title}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-red/20 text-red text-xs">
                          {concept.marksWeightage || 6} marks
                        </span>
                      </div>
                      <p className="text-sm opacity-70 line-clamp-1">{concept.description}</p>
                      {concept.examinerStyleNotes && (
                        <p className="text-xs mt-2 opacity-50 italic">{concept.examinerStyleNotes}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-30" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === "numericals" && (
            <div className="space-y-3">
              <div className="glass-card p-4 mb-4">
                <h2 className="font-bold mb-2 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-ocean" />
                  Most Repeated Numericals
                </h2>
                <p className="text-sm opacity-70">Practice these numericals. They appear every year.</p>
              </div>
              {repeatedNumericals.map((concept, index) => (
                <Link
                  key={concept.id}
                  href={`/learn?unit=${concept.id.split("-")[0]}&concept=${concept.id}`}
                  className="glass-card p-4 block hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono bg-ocean/20 text-ocean px-2 py-0.5 rounded">
                          #{index + 1}
                        </span>
                        <h3 className="font-semibold">{concept.title}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-red/20 text-red text-xs">
                          {concept.marksWeightage || 6} marks
                        </span>
                      </div>
                      {concept.formula && (
                        <code className="text-sm font-mono block mb-2 opacity-70">{concept.formula}</code>
                      )}
                      <p className="text-sm opacity-70 line-clamp-1">{concept.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-30" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === "topics" && (
            <div className="space-y-3">
              <div className="glass-card p-4 mb-4">
                <h2 className="font-bold mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green" />
                  High-Weight Topics
                </h2>
                <p className="text-sm opacity-70">These topics carry maximum marks. Don't skip them.</p>
              </div>
              {highWeightTopics.map((concept, index) => (
                <Link
                  key={concept.id}
                  href={`/learn?unit=${concept.id.split("-")[0]}&concept=${concept.id}`}
                  className="glass-card p-4 block hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono bg-green/20 text-green px-2 py-0.5 rounded">
                          #{index + 1}
                        </span>
                        <h3 className="font-semibold">{concept.title}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-red/20 text-red text-xs font-bold">
                          {concept.marksWeightage || 6} marks
                        </span>
                      </div>
                      <p className="text-sm opacity-70 line-clamp-1">{concept.description}</p>
                      {concept.examWritingGuidelines && (
                        <div className="mt-2 p-2 rounded bg-white/5">
                          <p className="text-xs opacity-70">
                            <span className="font-semibold">Format:</span> {concept.examWritingGuidelines.idealFormat}
                          </p>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-30" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="glass-card p-4 mt-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green" />
            Panic Mode Progress
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Formulas memorized</span>
              <span className="font-semibold">
                {topFormulas.filter(f => conceptProgress[f.id]?.learned).length} / {topFormulas.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>PYQs covered</span>
              <span className="font-semibold">
                {topPYQConcepts.filter(c => conceptProgress[c.id]?.learned).length} / {topPYQConcepts.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Numericals practiced</span>
              <span className="font-semibold">
                {repeatedNumericals.filter(c => conceptProgress[c.id]?.practiced).length} / {repeatedNumericals.length}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="mt-6 glass-card p-4 border-2 border-orange/50">
          <p className="text-center mb-3 font-semibold">Ready to test your knowledge?</p>
          <Link
            href="/exam"
            className="block w-full py-3 rounded-xl bg-gradient-to-r from-orange to-ocean text-white font-semibold text-center hover:opacity-90 transition-opacity"
          >
            Take Panic Exam (30 min)
          </Link>
        </div>
      </div>
    </div>
  );
}
