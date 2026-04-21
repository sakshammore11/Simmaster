"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Calculator, Clock, Target, Lightbulb, AlertCircle, Search, Moon, Sun, Bookmark, ChevronRight, Play, ArrowRight, CheckCircle, Circle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { syllabusData } from "@/data/syllabus";
import DailyProgress from "@/components/DailyProgress";

export default function Home() {
  const { darkMode, toggleDarkMode, setSearchQuery, mistakes, getWeakTopics, practiceProgress, conceptProgress, getOverallProgress } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [showExplore, setShowExplore] = useState(false);

  const weakTopics = getWeakTopics();
  const overallProgress = getOverallProgress();

  // Calculate overall practice progress
  const totalPracticeProgress = Object.values(practiceProgress).reduce((acc, curr) => {
    if (curr) {
      acc.correct += curr.correct;
      acc.total += curr.total;
    }
    return acc;
  }, { correct: 0, total: 0 });

  const practicePercentage = totalPracticeProgress.total > 0 ? (totalPracticeProgress.correct / totalPracticeProgress.total) * 100 : 0;

  // Calculate total concepts in syllabus
  const totalConcepts = syllabusData.reduce((acc, unit) => acc + unit.concepts.length, 0);
  const learnedConcepts = overallProgress.learned;
  const conceptPercentage = totalConcepts > 0 ? (learnedConcepts / totalConcepts) * 100 : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // Determine next step in learning path
  const getNextStep = () => {
    // Find first unit with unlearned concepts
    for (const unit of syllabusData) {
      const unitProgress = unit.concepts.filter(c => conceptProgress[c.id]?.learned).length;
      if (unitProgress < unit.concepts.length) {
        return {
          title: `Learn Unit ${unit.id}`,
          description: `${unitProgress}/${unit.concepts.length} concepts completed`,
          href: `/learn?unit=${unit.id}`,
          icon: BookOpen,
        };
      }
    }

    // If all concepts learned, check if practiced
    for (const unit of syllabusData) {
      const unitPracticed = unit.concepts.filter(c => conceptProgress[c.id]?.practiced).length;
      if (unitPracticed < unit.concepts.length) {
        return {
          title: `Practice Unit ${unit.id}`,
          description: `${unitPracticed}/${unit.concepts.length} concepts practiced`,
          href: `/practice?unit=${unit.id}`,
          icon: Calculator,
        };
      }
    }

    // If all done, suggest mock exam
    return {
      title: "Take Mock Exam",
      description: "Test your knowledge with PYQs",
      href: "/exam",
      icon: Clock,
    };
  };

  const nextStep = getNextStep();

  // Calculate unit-wise progress
  const getUnitProgress = (unitId: number) => {
    const unit = syllabusData.find(u => u.id === unitId);
    if (!unit) return { learned: 0, total: 0, practiced: 0 };
    const learned = unit.concepts.filter(c => conceptProgress[c.id]?.learned).length;
    const practiced = unit.concepts.filter(c => conceptProgress[c.id]?.practiced).length;
    return { learned, total: unit.concepts.length, practiced };
  };

  return (
    <div className="min-h-screen">
      {/* Header - Simplified */}
      <header className="sticky top-0 z-50 glass border-b border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange to-ocean bg-clip-text text-transparent">
            SimMaster
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              href="/bookmarks"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Bookmarks"
            >
              <Bookmark className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Simplified */}
      <section className="px-4 py-8 max-w-2xl mx-auto">
        {/* Continue Where You Left Off - Most Important */}
        <div className="glass-card p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-5 h-5 text-orange" />
            <span className="font-semibold text-orange">Continue where you left off</span>
          </div>
          <Link
            href={nextStep.href}
            className="group block p-5 rounded-xl bg-gradient-to-r from-orange/20 to-ocean/20 border border-orange/30 hover:border-orange/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-white/20">
                  <nextStep.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{nextStep.title}</h3>
                  <p className="text-sm opacity-70">{nextStep.description}</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Daily Progress / Study Planner */}
        <DailyProgress conceptProgress={conceptProgress} />

        {/* Quick Progress */}
        {totalPracticeProgress.total > 0 && (
          <div className="glass-card p-5 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Your Progress</span>
              <span className="text-sm opacity-70">{Math.round(practicePercentage)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange to-ocean transition-all duration-500"
                style={{ width: `${practicePercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Comprehensive Learning Path - Zero to Pro */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Zero-to-Pro Learning Path</h2>
          <p className="text-sm opacity-70 mb-4">Complete all units systematically to master the subject</p>
          
          {/* Overall Progress */}
          <div className="glass-card p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Overall Progress</span>
              <span className="text-sm opacity-70">{Math.round(conceptPercentage)}% concepts learned</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange to-ocean transition-all duration-500"
                style={{ width: `${conceptPercentage}%` }}
              />
            </div>
          </div>

          {/* Unit-wise Progress */}
          <div className="space-y-3">
            {syllabusData.map((unit) => {
              const progress = getUnitProgress(unit.id);
              const progressPercent = (progress.learned / progress.total) * 100;
              const isComplete = progress.learned === progress.total;
              
              return (
                <Link
                  key={unit.id}
                  href={`/learn?unit=${unit.id}`}
                  className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange to-ocean flex items-center justify-center text-white font-bold">
                    {unit.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{unit.title}</h3>
                    <p className="text-sm opacity-70">
                      {progress.learned}/{progress.total} concepts learned • {progress.practiced} practiced
                    </p>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-orange to-ocean'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 opacity-30" />
                    )}
                    <span className="text-xs opacity-60">{Math.round(progressPercent)}%</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Explore More - Hidden by default */}
        <div>
          <button
            onClick={() => setShowExplore(!showExplore)}
            className="w-full text-center text-sm opacity-60 hover:opacity-100 transition-opacity mb-4"
          >
            {showExplore ? "Show less" : "Explore more features ↓"}
          </button>

          {showExplore && (
            <div className="space-y-3 animate-fade-in">
              <Link
                href="/practice"
                className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-all"
              >
                <Target className="w-5 h-5 opacity-50" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Topic-wise Practice</h3>
                </div>
                <ChevronRight className="w-5 h-5 opacity-30" />
              </Link>

              <Link
                href="/formulas"
                className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-all"
              >
                <Lightbulb className="w-5 h-5 opacity-50" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Formula Flashcards</h3>
                </div>
                <ChevronRight className="w-5 h-5 opacity-30" />
              </Link>

              <Link
                href="/mistakes"
                className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-all"
              >
                <AlertCircle className="w-5 h-5 opacity-50" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Mistake Tracker</h3>
                  {weakTopics.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs">
                      {weakTopics.length}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 opacity-30" />
              </Link>

              <Link
                href="/search"
                className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-all"
              >
                <Search className="w-5 h-5 opacity-50" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Search</h3>
                </div>
                <ChevronRight className="w-5 h-5 opacity-30" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-center text-sm opacity-60">
        <p>Made by Saksham More</p>
      </footer>
    </div>
  );
}
