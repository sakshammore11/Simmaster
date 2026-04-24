"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Calculator, Clock, Target, Lightbulb, AlertCircle, Search, Moon, Sun, Bookmark, ChevronRight, Play, ArrowRight, CheckCircle, Circle, LogOut, Cloud, CloudOff, RefreshCw, AlertTriangle, Brain } from "lucide-react";
import { useStore } from "@/store/useStore";
import { syllabusData } from "@/data/syllabus";
import DailyProgress from "@/components/DailyProgress";

export default function Home() {
  const { darkMode, toggleDarkMode, setSearchQuery, mistakes, getWeakTopics, practiceProgress, conceptProgress, getOverallProgress, logout, isSyncing, lastSyncedAt, justPassMode, toggleJustPassMode, getMarksPotential } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [showExplore, setShowExplore] = useState(false);

  const weakTopics = getWeakTopics();
  const overallProgress = getOverallProgress();
  const marksPotential = getMarksPotential();

  // Format last synced time
  const formatLastSynced = (timestamp: number | null) => {
    if (!timestamp) return null;
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

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
            {/* Just Pass Mode Toggle */}
            <button
              onClick={toggleJustPassMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                justPassMode
                  ? "bg-gradient-to-r from-orange to-ocean text-white"
                  : "glass hover:bg-white/10"
              }`}
              title="Just Pass Mode - Show only high-yield content"
            >
              <Target className="w-4 h-4" />
              {justPassMode ? "Just Pass ON" : "Just Pass"}
            </button>

            {/* Sync Status */}
            <div className="flex items-center gap-2 text-xs opacity-70" title="Data sync status">
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-orange" />
                  <span>Saving...</span>
                </>
              ) : lastSyncedAt ? (
                <>
                  <Cloud className="w-4 h-4 text-green-500" />
                  <span>{formatLastSynced(lastSyncedAt)}</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-4 h-4 text-red-500" />
                  <span>Not synced</span>
                </>
              )}
            </div>

            {/* Manual Sync Button */}
            <button
              onClick={() => useStore.getState().syncToDB()}
              disabled={isSyncing}
              className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Sync now"
            >
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

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

        {/* Marks Potential - EXAM FOCUSED */}
        <div className="glass rounded-2xl p-6 border-2 border-green/30">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green" />
            Marks Potential
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-3xl font-bold text-green">{marksPotential.currentMarks}</div>
              <div className="text-sm opacity-70">Marks you can score</div>
              <div className="text-xs opacity-50">out of {marksPotential.maxMarks}</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-3xl font-bold text-ocean">{marksPotential.percentage.toFixed(0)}%</div>
              <div className="text-sm opacity-70">Exam potential</div>
              <div className="text-xs opacity-50">based on learned topics</div>
            </div>
          </div>
          {marksPotential.percentage < 50 && (
            <div className="mt-4 p-3 rounded-lg bg-red/10 border-l-4 border-red">
              <p className="text-sm text-red font-semibold">
                ⚠️ You're losing {marksPotential.maxMarks - marksPotential.currentMarks} marks. Focus on high-importance topics.
              </p>
            </div>
          )}
        </div>

        {/* Daily Progress */}
        <DailyProgress conceptProgress={conceptProgress} />

        {/* Simple Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <Link
            href="/learn"
            className="glass-card p-4 hover:scale-[1.02] transition-all group"
          >
            <BookOpen className="w-6 h-6 mb-2 text-orange group-hover:scale-110 transition-transform" />
            <div className="font-semibold">Understand</div>
            <div className="text-xs opacity-70">Study concepts</div>
          </Link>
          <Link
            href="/practice"
            className="glass-card p-4 hover:scale-[1.02] transition-all group"
          >
            <Calculator className="w-6 h-6 mb-2 text-ocean group-hover:scale-110 transition-transform" />
            <div className="font-semibold">Score</div>
            <div className="text-xs opacity-70">Solve questions</div>
          </Link>
          <Link
            href="/formulas"
            className="glass-card p-4 hover:scale-[1.02] transition-all group"
          >
            <Lightbulb className="w-6 h-6 mb-2 text-yellow group-hover:scale-110 transition-transform" />
            <div className="font-semibold">Formulas</div>
            <div className="text-xs opacity-70">Memorize</div>
          </Link>
          <Link
            href="/patterns"
            className="glass-card p-4 hover:scale-[1.02] transition-all group border-2 border-ocean/50 bg-gradient-to-br from-ocean/10 to-purple/10"
          >
            <Brain className="w-6 h-6 mb-2 text-ocean group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-ocean">Patterns</div>
            <div className="text-xs opacity-70">Train brain</div>
          </Link>
          <Link
            href="/exam"
            className="glass-card p-4 hover:scale-[1.02] transition-all group"
          >
            <Target className="w-6 h-6 mb-2 text-red group-hover:scale-110 transition-transform" />
            <div className="font-semibold">Simulate</div>
            <div className="text-xs opacity-70">Test yourself</div>
          </Link>
          <Link
            href="/panic"
            className="glass-card p-4 hover:scale-[1.02] transition-all group border-2 border-red/50 bg-gradient-to-br from-red/10 to-orange/10"
          >
            <AlertTriangle className="w-6 h-6 mb-2 text-red group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-red">Panic</div>
            <div className="text-xs opacity-70">1-day prep</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
