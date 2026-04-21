"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Calculator, Clock, Target, Lightbulb, AlertCircle, Search, Moon, Sun, Bookmark, ChevronRight, Play, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Home() {
  const { darkMode, toggleDarkMode, setSearchQuery, mistakes, getWeakTopics, practiceProgress } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [showExplore, setShowExplore] = useState(false);

  const weakTopics = getWeakTopics();

  // Calculate overall progress
  const totalProgress = Object.values(practiceProgress).reduce((acc, curr) => {
    if (curr) {
      acc.correct += curr.correct;
      acc.total += curr.total;
    }
    return acc;
  }, { correct: 0, total: 0 });

  const progressPercentage = totalProgress.total > 0 ? (totalProgress.correct / totalProgress.total) * 100 : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // Determine what to show as "Continue where you left off"
  const getContinueAction = () => {
    if (weakTopics.length > 0) {
      return {
        title: "Revise weak topics",
        description: "Focus on areas where you made mistakes",
        href: "/mistakes",
        icon: AlertCircle,
      };
    }
    if (progressPercentage < 30) {
      return {
        title: "Start learning concepts",
        description: "Begin with Unit 1 fundamentals",
        href: "/learn",
        icon: BookOpen,
      };
    }
    if (progressPercentage < 60) {
      return {
        title: "Practice numericals",
        description: "Apply what you've learned",
        href: "/practice",
        icon: Calculator,
      };
    }
    return {
      title: "Take a mock exam",
      description: "Test your knowledge with PYQs",
      href: "/exam",
      icon: Clock,
    };
  };

  const continueAction = getContinueAction();

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
            href={continueAction.href}
            className="group block p-5 rounded-xl bg-gradient-to-r from-orange/20 to-ocean/20 border border-orange/30 hover:border-orange/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-white/20">
                  <continueAction.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{continueAction.title}</h3>
                  <p className="text-sm opacity-70">{continueAction.description}</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Quick Progress */}
        {totalProgress.total > 0 && (
          <div className="glass-card p-5 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Your Progress</span>
              <span className="text-sm opacity-70">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange to-ocean transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Learning Path - Simplified */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Your Learning Path</h2>
          <div className="space-y-3">
            <Link
              href="/learn"
              className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange to-ocean flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Learn Concepts</h3>
                <p className="text-sm opacity-70">Units 1-5 with explanations</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100" />
            </Link>

            <Link
              href="/solver"
              className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange to-ocean flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Practice Numericals</h3>
                <p className="text-sm opacity-70">Step-by-step solutions</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100" />
            </Link>

            <Link
              href="/exam"
              className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange to-ocean flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Take Mock Tests</h3>
                <p className="text-sm opacity-70">PYQ-based exams with timer</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100" />
            </Link>
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
