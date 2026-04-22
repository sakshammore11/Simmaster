"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Calculator, Clock, Target, Lightbulb, AlertCircle, Search, Moon, Sun, Bookmark, ChevronRight, Play, ArrowRight, CheckCircle, Circle, LogOut } from "lucide-react";
import { useStore } from "@/store/useStore";
import { syllabusData } from "@/data/syllabus";
import DailyProgress from "@/components/DailyProgress";

export default function Home() {
  const { darkMode, toggleDarkMode, setSearchQuery, mistakes, getWeakTopics, practiceProgress, conceptProgress, getOverallProgress, logout } = useStore();
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
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange to-ocean bg-clip-text text-transparent">
            SimMaster
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
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

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* What to do next - MAIN FOCUS */}
        <div className="glass rounded-2xl p-6 border-2 border-orange/30">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange" />
            What to do next
          </h2>
          <Link href={nextStep.href} className="block">
            <div className="bg-gradient-to-r from-orange/20 to-ocean/20 rounded-xl p-6 hover:from-orange/30 hover:to-ocean/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange to-ocean rounded-xl">
                  <nextStep.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{nextStep.title}</h3>
                  <p className="opacity-70">{nextStep.description}</p>
                </div>
                <ArrowRight className="w-6 h-6 opacity-50" />
              </div>
            </div>
          </Link>
        </div>

        {/* Simple Progress */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-3xl font-bold text-orange">{overallProgress.learned}</div>
              <div className="text-sm opacity-70">Concepts learned</div>
              <div className="text-xs opacity-50">of {totalConcepts} total</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-3xl font-bold text-ocean">{totalPracticeProgress.correct}</div>
              <div className="text-sm opacity-70">Questions correct</div>
              <div className="text-xs opacity-50">{practicePercentage.toFixed(0)}% accuracy</div>
            </div>
          </div>
        </div>

        {/* Daily Progress */}
        <DailyProgress conceptProgress={conceptProgress} />

        {/* Simple Navigation */}
        <div className="grid grid-cols-3 gap-3">
          <Link href="/learn" className="glass rounded-xl p-4 hover:border-orange/50 transition-all text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-orange" />
            <div className="text-sm font-medium">Learn</div>
            <div className="text-xs opacity-50">Watch videos</div>
          </Link>
          <Link href="/practice" className="glass rounded-xl p-4 hover:border-ocean/50 transition-all text-center">
            <Calculator className="w-6 h-6 mx-auto mb-2 text-ocean" />
            <div className="text-sm font-medium">Practice</div>
            <div className="text-xs opacity-50">Solve problems</div>
          </Link>
          <Link href="/exam" className="glass rounded-xl p-4 hover:border-purple/50 transition-all text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-purple" />
            <div className="text-sm font-medium">Exam</div>
            <div className="text-xs opacity-50">Test yourself</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
