"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, CheckCircle, XCircle, Lightbulb, ChevronRight } from "lucide-react";
import { syllabusData } from "@/data/syllabus";

interface Pattern {
  id: string;
  trigger: string;
  pattern: string;
  example: string;
  conceptId: string;
  conceptTitle: string;
}

const patterns: Pattern[] = [
  {
    id: "p1",
    trigger: "Given λ + time interval",
    pattern: "Poisson Distribution",
    example: "If arrival rate λ = 3/hour, find probability of 5 arrivals in 2 hours",
    conceptId: "2-5",
    conceptTitle: "Poisson Distribution",
  },
  {
    id: "p2",
    trigger: "Fixed trials + probability",
    pattern: "Binomial Distribution",
    example: "10 trials, p=0.3, find probability of exactly 4 successes",
    conceptId: "2-4",
    conceptTitle: "Binomial Distribution",
  },
  {
    id: "p3",
    trigger: "Arrival rate & service rate",
    pattern: "Queueing Model (M/M/1)",
    example: "λ=10/hr, μ=15/hr, find average waiting time",
    conceptId: "1-4",
    conceptTitle: "Single Server Queue Simulation",
  },
  {
    id: "p4",
    trigger: "Time between events",
    pattern: "Exponential Distribution",
    example: "If λ=2/hr, find probability next arrival > 30 min",
    conceptId: "2-7",
    conceptTitle: "Exponential Distribution",
  },
  {
    id: "p5",
    trigger: "Random number generation",
    pattern: "Inverse Transform Technique",
    example: "Generate exponential variate with λ=2 using U=0.5",
    conceptId: "3-7",
    conceptTitle: "Inverse Transform Technique",
  },
  {
    id: "p6",
    trigger: "LCG parameters a, c, m",
    pattern: "Linear Congruential Generator",
    example: "a=5, c=1, m=16, X0=3, generate sequence",
    conceptId: "3-2",
    conceptTitle: "Mixed LCG Generators",
  },
  {
    id: "p7",
    trigger: "Uniform random number U",
    pattern: "Transform to [a,b]",
    example: "U=0.5, generate uniform on [10,20]",
    conceptId: "3-10",
    conceptTitle: "Generating Uniform Variates",
  },
  {
    id: "p8",
    trigger: "Mean & variance given",
    pattern: "Normal Distribution",
    example: "μ=50, σ=10, find P(X<60)",
    conceptId: "2-8",
    conceptTitle: "Normal Distribution",
  },
];

export default function PatternsPage() {
  const [currentPattern, setCurrentPattern] = useState<Pattern>(patterns[0]);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);

  const handleCheck = () => {
    setShowResult(true);
    setAttempted(attempted + 1);
    if (userAnswer.toLowerCase().includes(currentPattern.pattern.toLowerCase())) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    const currentIndex = patterns.findIndex(p => p.id === currentPattern.id);
    const nextIndex = (currentIndex + 1) % patterns.length;
    setCurrentPattern(patterns[nextIndex]);
    setUserAnswer("");
    setShowResult(false);
  };

  const handleSkip = () => {
    handleNext();
  };

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

        <div className="glass-card p-6 mb-6 border-2 border-ocean/50 bg-gradient-to-r from-ocean/10 to-purple/10">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8 text-ocean" />
            Pattern Recognition Training
          </h1>
          <p className="opacity-70">Train your brain to identify question types instantly.</p>
        </div>

        {/* Score */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-70">Score:</span>
              <span className="text-2xl font-bold text-green">{score}</span>
              <span className="opacity-50">/ {attempted}</span>
            </div>
            <div className="text-sm opacity-70">
              {attempted > 0 ? `${((score / attempted) * 100).toFixed(0)}% accuracy` : "Start training"}
            </div>
          </div>
        </div>

        {/* Pattern Card */}
        <div className="glass-card p-6 mb-6">
          <div className="mb-6">
            <div className="text-sm opacity-70 mb-2">Question Trigger:</div>
            <div className="text-xl font-semibold text-orange">{currentPattern.trigger}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm opacity-70 mb-2">Example Question:</div>
            <div className="p-4 rounded-lg bg-white/5">{currentPattern.example}</div>
          </div>

          {!showResult ? (
            <>
              <div className="mb-6">
                <label className="block text-sm opacity-70 mb-2">What type is this?</label>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="e.g., Poisson Distribution, Queueing Model..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/50"
                  onKeyPress={(e) => e.key === "Enter" && handleCheck()}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCheck}
                  disabled={!userAnswer.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange to-ocean text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Check Answer
                </button>
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 rounded-xl glass hover:bg-white/10 transition-colors"
                >
                  Skip
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              <div className={`p-4 rounded-lg mb-4 border-l-4 ${
                userAnswer.toLowerCase().includes(currentPattern.pattern.toLowerCase())
                  ? "bg-green/10 border-green"
                  : "bg-red/10 border-red"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {userAnswer.toLowerCase().includes(currentPattern.pattern.toLowerCase()) ? (
                    <CheckCircle className="w-5 h-5 text-green" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red" />
                  )}
                  <span className="font-semibold">
                    {userAnswer.toLowerCase().includes(currentPattern.pattern.toLowerCase())
                      ? "Correct!"
                      : "Incorrect"}
                  </span>
                </div>
                <div className="text-sm opacity-70">
                  Your answer: {userAnswer || "(empty)"}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-ocean/10 border border-ocean/20 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-ocean" />
                  <span className="font-semibold">Correct Pattern:</span>
                </div>
                <div className="text-lg font-semibold">{currentPattern.pattern}</div>
              </div>

              <Link
                href={`/learn?unit=${currentPattern.conceptId.split("-")[0]}&concept=${currentPattern.conceptId}`}
                className="block w-full py-3 rounded-xl glass hover:bg-white/10 transition-colors text-center mb-3"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Learn {currentPattern.conceptTitle}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>

              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange to-ocean text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Next Pattern
              </button>
            </div>
          )}
        </div>

        {/* Pattern Library */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Pattern Library</h2>
          <div className="space-y-3">
            {patterns.map((pattern) => (
              <div
                key={pattern.id}
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-orange mb-1">
                      {pattern.trigger}
                    </div>
                    <div className="text-sm opacity-70">
                      → {pattern.pattern}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentPattern(pattern);
                      setUserAnswer("");
                      setShowResult(false);
                    }}
                    className="px-3 py-1 rounded-full glass hover:bg-white/10 text-sm"
                  >
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
