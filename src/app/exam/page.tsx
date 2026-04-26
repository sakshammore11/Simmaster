"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, XCircle, Play, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { pyqData, type PYQ } from "@/data/pyqs";
import { syllabusData } from "@/data/syllabus";
import { useStore } from "@/store/useStore";
import LearningRequirements from "@/components/LearningRequirements";

export default function ExamPage() {
  const { examState, startExam, submitAnswer, nextQuestion, previousQuestion, jumpToQuestion, toggleMarkForReview, endExam, resetExam, addMistake, markHandwritten, removeHandwrittenPhoto, conceptProgress, markVideoWatched, isVideoWatched, isRequirementsMet, trackQuestionTime } = useStore();
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [customTime, setCustomTime] = useState<number>(30);
  const [examPreset, setExamPreset] = useState<"custom" | "most-expected" | "high-weight" | "last-night">("custom");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (examState.isActive && examState.timeLimit > 0) {
      const timer = setInterval(() => {
        const elapsed = (Date.now() - examState.startTime) / 1000 / 60; // in minutes
        const remaining = Math.max(0, examState.timeLimit - elapsed);
        setTimeLeft(remaining);
        if (elapsed >= examState.timeLimit) {
          handleEndExam();
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [examState.isActive, examState.startTime, examState.timeLimit]);

  const handleStartExam = () => {
    let questions: string[] = [];
    let timeLimit = customTime;

    switch (examPreset) {
      case "most-expected":
        questions = selectQuestionsWithCriteria({
          minImportance: 80,
          requireRecent: true,
          targetCount: 50,
          minCount: 40,
        });
        timeLimit = 90;
        break;
      case "high-weight":
        questions = selectQuestionsWithCriteria({
          minMarksWeightage: 8,
          targetCount: 40,
          minCount: 30,
        });
        timeLimit = 120;
        break;
      case "last-night":
        questions = selectQuestionsWithCriteria({
          minImportance: 90,
          targetCount: 25,
          minCount: 20,
        });
        timeLimit = 60;
        break;
      default:
        questions = pyqData.map((pyq) => pyq.id);
        timeLimit = customTime;
    }

    startExam(questions, timeLimit);
  };

  const selectQuestionsWithCriteria = (criteria: {
    minImportance?: number;
    minMarksWeightage?: number;
    requireRecent?: boolean;
    targetCount: number;
    minCount: number;
  }) => {
    let filtered = pyqData.filter(pyq => {
      const concept = syllabusData
        .flatMap(u => u.concepts)
        .find(c => c.id === pyq.id);

      if (criteria.minImportance && (concept?.importanceScore || 0) < criteria.minImportance) {
        return false;
      }
      if (criteria.minMarksWeightage && (concept?.marksWeightage || 0) < criteria.minMarksWeightage) {
        return false;
      }
      if (criteria.requireRecent && !(concept?.pyqYears?.includes("2024") || false)) {
        return false;
      }
      return true;
    });

    // Sort by importanceScore, then marksWeightage, then recency
    filtered.sort((a, b) => {
      const conceptA = syllabusData.flatMap(u => u.concepts).find(c => c.id === a.id);
      const conceptB = syllabusData.flatMap(u => u.concepts).find(c => c.id === b.id);

      const impA = conceptA?.importanceScore || 0;
      const impB = conceptB?.importanceScore || 0;
      if (impA !== impB) return impB - impA;

      const marksA = conceptA?.marksWeightage || 0;
      const marksB = conceptB?.marksWeightage || 0;
      if (marksA !== marksB) return marksB - marksA;

      const yearA = a.year === "2024" ? 2 : a.year === "2023" ? 1 : 0;
      const yearB = b.year === "2024" ? 2 : b.year === "2023" ? 1 : 0;
      return yearB - yearA;
    });

    // Ensure unit coverage and question type balance
    const selected = ensureBalancedSelection(filtered, criteria.targetCount);

    // If we don't have enough, add lower priority questions
    if (selected.length < criteria.minCount) {
      const remaining = pyqData.filter(pyq => !selected.includes(pyq.id));
      const additional = ensureBalancedSelection(remaining, criteria.minCount - selected.length);
      selected.push(...additional);
    }

    return selected;
  };

  const ensureBalancedSelection = (questions: PYQ[], targetCount: number): string[] => {
    const selected: string[] = [];
    const byUnit: Record<number, PYQ[]> = {};
    const byType: Record<string, PYQ[]> = { numerical: [], theoretical: [] };

    questions.forEach(q => {
      if (!byUnit[q.unit]) byUnit[q.unit] = [];
      byUnit[q.unit].push(q);
      byType[q.type].push(q);
    });

    // Ensure at least some questions from each unit
    Object.keys(byUnit).forEach(unit => {
      const unitQuestions = byUnit[parseInt(unit)];
      if (unitQuestions.length > 0 && selected.length < targetCount) {
        const count = Math.min(Math.ceil(targetCount / 5), unitQuestions.length);
        selected.push(...unitQuestions.slice(0, count).map(q => q.id));
      }
    });

    // Fill remaining with balanced mix of numerical and theoretical
    const remainingNeeded = targetCount - selected.length;
    if (remainingNeeded > 0) {
      const numericalNeeded = Math.ceil(remainingNeeded * 0.5);
      const theoreticalNeeded = remainingNeeded - numericalNeeded;

      const availableNumerical = byType.numerical.filter(q => !selected.includes(q.id));
      const availableTheoretical = byType.theoretical.filter(q => !selected.includes(q.id));

      selected.push(
        ...availableNumerical.slice(0, numericalNeeded).map(q => q.id),
        ...availableTheoretical.slice(0, theoreticalNeeded).map(q => q.id)
      );
    }

    return selected.slice(0, targetCount);
  };

  const handleSubmitAnswer = () => {
    if (currentAnswer.trim()) {
      submitAnswer(examState.questions[examState.currentQuestion], currentAnswer);
      setCurrentAnswer("");
    }
  };

  const handleNextQuestion = () => {
    trackQuestionTime(examState.questions[examState.currentQuestion]);
    if (examState.currentQuestion < examState.questions.length - 1) {
      nextQuestion();
    } else {
      handleEndExam();
    }
  };

  const handlePreviousQuestion = () => {
    trackQuestionTime(examState.questions[examState.currentQuestion]);
    previousQuestion();
  };

  const handleJumpToQuestion = (index: number) => {
    trackQuestionTime(examState.questions[examState.currentQuestion]);
    jumpToQuestion(index);
  };

  const handleToggleMarkForReview = () => {
    toggleMarkForReview(examState.questions[examState.currentQuestion]);
  };

  // Auto-save answer while typing
  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
    if (value.trim()) {
      submitAnswer(examState.questions[examState.currentQuestion], value);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!examState.isActive) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePreviousQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [examState.isActive, examState.currentQuestion, examState.questions.length]);

  // Track time when question changes
  useEffect(() => {
    if (examState.isActive) {
      const currentQuestionId = examState.questions[examState.currentQuestion];
      trackQuestionTime(currentQuestionId);
    }
  }, [examState.currentQuestion, examState.isActive, examState.questions]);

  const handleEndExam = () => {
    endExam();
    setShowResults(true);
  };

  const handleReset = () => {
    resetExam();
    setShowResults(false);
    setScore(0);
    setCurrentAnswer("");
  };

  const currentQuestionId = examState.questions[examState.currentQuestion];
  const currentPYQ = pyqData.find((pyq) => pyq.id === currentQuestionId);

  if (!examState.isActive && !showResults) {
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

          <div className="glass-card p-8 text-center animate-fade-in">
            <Clock className="w-16 h-16 mx-auto mb-6 text-orange" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Exam Mode</h1>
            <p className="text-lg opacity-70 mb-8">
              Test your knowledge with PYQ-based mock tests.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass p-4">
                <div className="text-2xl font-bold">{pyqData.length}</div>
                <div className="text-sm opacity-70">Questions</div>
              </div>
              <div className="glass p-4">
                <div className="text-2xl font-bold">
                  {pyqData.reduce((sum, pyq) => sum + pyq.marks, 0)}
                </div>
                <div className="text-sm opacity-70">Total Marks</div>
              </div>
              <div className="glass p-4">
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm opacity-70">Units</div>
              </div>
              <div className="glass p-4">
                <div className="text-2xl font-bold">{customTime}</div>
                <div className="text-sm opacity-70">Minutes</div>
              </div>
            </div>

            {/* Exam Presets */}
            <div className="mb-8">
              <label className="block text-sm opacity-70 mb-2">Select Exam Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => { setExamPreset("custom"); setCustomTime(30); }}
                  className={`p-4 rounded-xl transition-all text-center ${
                    examPreset === "custom"
                      ? "bg-gradient-to-r from-orange to-ocean text-white"
                      : "glass hover:bg-white/10"
                  }`}
                >
                  <div className="font-semibold">Custom</div>
                  <div className="text-xs opacity-70">Full syllabus</div>
                </button>
                <button
                  onClick={() => setExamPreset("most-expected")}
                  className={`p-4 rounded-xl transition-all text-center ${
                    examPreset === "most-expected"
                      ? "bg-gradient-to-r from-orange to-ocean text-white"
                      : "glass hover:bg-white/10"
                  }`}
                >
                  <div className="font-semibold">Most Expected</div>
                  <div className="text-xs opacity-70">40-50 Q • 90 min</div>
                </button>
                <button
                  onClick={() => setExamPreset("high-weight")}
                  className={`p-4 rounded-xl transition-all text-center ${
                    examPreset === "high-weight"
                      ? "bg-gradient-to-r from-orange to-ocean text-white"
                      : "glass hover:bg-white/10"
                  }`}
                >
                  <div className="font-semibold">High Weight</div>
                  <div className="text-xs opacity-70">30-40 Q • 120 min</div>
                </button>
                <button
                  onClick={() => setExamPreset("last-night")}
                  className={`p-4 rounded-xl transition-all text-center border-2 border-red/50 ${
                    examPreset === "last-night"
                      ? "bg-gradient-to-r from-red to-orange text-white"
                      : "glass hover:bg-white/10"
                  }`}
                >
                  <div className="font-semibold">Last Night</div>
                  <div className="text-xs opacity-70">20-25 Q • 60 min</div>
                </button>
              </div>
            </div>

            {/* Time Input (only for custom) */}
            {examPreset === "custom" && (
              <div className="mb-8">
                <label className="block text-sm opacity-70 mb-2">Set exam time (minutes)</label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setCustomTime(Math.max(5, customTime - 5))}
                    className="w-10 h-10 rounded-full glass hover:bg-white/10 transition-colors font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={customTime}
                    onChange={(e) => setCustomTime(Math.max(5, parseInt(e.target.value) || 5))}
                    className="w-24 text-center text-2xl font-bold bg-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange/50"
                    min="5"
                    max="180"
                  />
                  <button
                    onClick={() => setCustomTime(Math.min(180, customTime + 5))}
                    className="w-10 h-10 rounded-full glass hover:bg-white/10 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2 mt-3 justify-center">
                  {[15, 30, 45, 60, 90, 120].map((time) => (
                    <button
                      key={time}
                      onClick={() => setCustomTime(time)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        customTime === time
                          ? "bg-gradient-to-r from-orange to-ocean text-white"
                          : "glass hover:bg-white/10"
                      }`}
                    >
                      {time}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleStartExam}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange to-ocean text-white text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Play className="w-5 h-5" />
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const answered = Object.keys(examState.answers).length;
    const accuracy = examState.questions.length > 0 ? (answered / examState.questions.length) * 100 : 0;
    const totalTime = examState.endTime ? (examState.endTime - examState.startTime) / 1000 / 60 : 0;
    const avgTimePerQuestion = examState.questions.length > 0 ? totalTime / examState.questions.length : 0;

    // Calculate unit-wise performance
    const unitPerformance: Record<number, { total: number; answered: number; timeSpent: number }> = {};
    examState.questions.forEach((questionId) => {
      const pyq = pyqData.find((p) => p.id === questionId);
      if (pyq) {
        if (!unitPerformance[pyq.unit]) {
          unitPerformance[pyq.unit] = { total: 0, answered: 0, timeSpent: 0 };
        }
        unitPerformance[pyq.unit].total++;
        if (examState.answers[questionId]) {
          unitPerformance[pyq.unit].answered++;
        }
        unitPerformance[pyq.unit].timeSpent += examState.questionTimeSpent[questionId] || 0;
      }
    });

    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-8 text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Exam Results</h1>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange to-ocean bg-clip-text text-transparent mb-2">
                  {answered}/{examState.questions.length}
                </div>
                <p className="opacity-70">Questions Attempted</p>
              </div>
              <div className="glass p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-green to-emerald bg-clip-text text-transparent mb-2">
                  {accuracy.toFixed(1)}%
                </div>
                <p className="opacity-70">Attempt Rate</p>
              </div>
              <div className="glass p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue to-cyan bg-clip-text text-transparent mb-2">
                  {totalTime.toFixed(1)}m
                </div>
                <p className="opacity-70">Total Time</p>
              </div>
              <div className="glass p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent mb-2">
                  {avgTimePerQuestion.toFixed(1)}m
                </div>
                <p className="opacity-70">Avg per Question</p>
              </div>
            </div>

            {/* Unit-wise Performance */}
            <div className="glass p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Unit-wise Performance</h2>
              <div className="space-y-3">
                {Object.entries(unitPerformance).map(([unit, data]) => {
                  const unitAccuracy = (data.answered / data.total) * 100;
                  const avgTime = data.timeSpent / data.total / 60; // in minutes
                  const isStrong = unitAccuracy >= 70;
                  const isWeak = unitAccuracy < 40;

                  return (
                    <div key={unit} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                      <div className="w-16 text-center">
                        <span className="font-semibold">Unit {unit}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm opacity-70">{data.answered}/{data.total} answered</span>
                          <span className={`text-sm font-semibold ${isStrong ? 'text-green' : isWeak ? 'text-red' : 'text-orange'}`}>
                            {unitAccuracy.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${isStrong ? 'bg-green' : isWeak ? 'bg-red' : 'bg-orange'}`}
                            style={{ width: `${unitAccuracy}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm opacity-70">
                        {avgTime.toFixed(1)}m avg
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question-by-Question Review */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Question Review</h2>
              <div className="grid gap-4">
                {examState.questions.map((questionId, index) => {
                  const pyq = pyqData.find((p) => p.id === questionId);
                  const answer = examState.answers[questionId];
                  const timeSpent = examState.questionTimeSpent[questionId] || 0;
                  const isMarked = examState.markedForReview.has(questionId);
                  const timeSpentMin = timeSpent / 60;
                  const spentTooMuchTime = timeSpentMin > avgTimePerQuestion * 1.5;

                  return (
                    <div key={questionId} className={`glass p-4 text-left ${spentTooMuchTime ? 'border-2 border-yellow/50' : ''}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {answer ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        {isMarked && <Flag className="w-5 h-5 text-red-500" />}
                        <span className="font-semibold">Question {index + 1}</span>
                        <span className="text-sm opacity-70">({pyq?.marks} marks)</span>
                        <span className="text-sm opacity-70 ml-auto">
                          {timeSpentMin.toFixed(1)}m
                          {spentTooMuchTime && <span className="text-yellow ml-2">⚠ Slow</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded bg-orange/20 text-orange text-xs">
                          Unit {pyq?.unit}
                        </span>
                        <span className="px-2 py-1 rounded bg-purple/20 text-purple text-xs">
                          {pyq?.type}
                        </span>
                      </div>
                      <p className="opacity-90 text-sm mb-2">{pyq?.question}</p>
                      {answer && (
                        <div className="p-3 rounded-lg bg-black/5">
                          <span className="text-sm opacity-70">Your answer: </span>
                          <span className="opacity-90">{answer}</span>
                        </div>
                      )}
                      {pyq?.answer && (
                        <div className="mt-2 p-3 rounded-lg bg-ocean/10">
                          <span className="text-sm opacity-70">Solution: </span>
                          <span className="opacity-90">{pyq.answer}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-full glass hover:bg-white/10 transition-colors"
            >
              Take Exam Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Question Navigator Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4 glass-card p-4">
            <h3 className="font-semibold mb-4">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {examState.questions.map((questionId, index) => {
                const isAnswered = examState.answers[questionId];
                const isMarked = examState.markedForReview.has(questionId);
                const isCurrent = index === examState.currentQuestion;
                const pyq = pyqData.find((p) => p.id === questionId);

                return (
                  <button
                    key={questionId}
                    onClick={() => handleJumpToQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      isCurrent
                        ? "bg-gradient-to-r from-orange to-ocean text-white"
                        : isMarked
                        ? "bg-red/20 text-red border-2 border-red"
                        : isAnswered
                        ? "bg-green/20 text-green"
                        : "glass hover:bg-white/10"
                    }`}
                    title={`Q${index + 1}: ${pyq?.topic}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green/20 border border-green"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red/20 border border-red"></div>
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded glass"></div>
                <span>Not Visited</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Exam Area */}
        <div className="flex-1">
          {/* Timer Header - Fixed at top */}
          <div className="sticky top-0 z-50 glass border-b border-white/10 px-4 py-3 mb-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-orange'}`} />
                <span className={`font-semibold text-lg ${timeLeft < 5 ? 'text-red-500' : ''}`}>
                  {timeLeft.toFixed(1)} min remaining
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="opacity-70">
                  Question {examState.currentQuestion + 1} of {examState.questions.length}
                </div>
                <button
                  onClick={handleToggleMarkForReview}
                  className={`px-4 py-2 rounded-full transition-colors text-sm font-semibold ${
                    examState.markedForReview.has(examState.questions[examState.currentQuestion])
                      ? "bg-red/20 text-red"
                      : "glass hover:bg-white/10"
                  }`}
                >
                  <Flag className="w-4 h-4 inline mr-1" />
                  Mark for Review
                </button>
                <button
                  onClick={handleEndExam}
                  className="px-4 py-2 rounded-full bg-red/20 text-red hover:bg-red/30 transition-colors text-sm font-semibold"
                >
                  End Test
                </button>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${timeLeft < 5 ? 'bg-red-500' : 'bg-gradient-to-r from-orange to-ocean'}`}
                style={{
                  width: `${(timeLeft / examState.timeLimit) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange to-ocean transition-all duration-300"
              style={{
                width: `${((examState.currentQuestion + 1) / examState.questions.length) * 100}%`,
              }}
            />
          </div>

          {currentPYQ && (
            <div className="glass-card p-6 md:p-8 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-orange/20 text-orange text-sm font-semibold">
                  Unit {currentPYQ.unit}
                </span>
                <span className="px-3 py-1 rounded-full bg-ocean/20 text-ocean text-sm">
                  {currentPYQ.marks} Marks
                </span>
                <span className="px-3 py-1 rounded-full bg-purple/20 text-purple text-sm">
                  {currentPYQ.type}
                </span>
              </div>

              <h2 className="text-xl font-bold mb-2">{currentPYQ.topic}</h2>
              <p className="text-lg opacity-90 mb-6 leading-relaxed">{currentPYQ.question}</p>

              {currentPYQ.data && (
                <div className="glass p-4 mb-6">
                  <pre className="text-sm overflow-x-auto">{JSON.stringify(currentPYQ.data, null, 2)}</pre>
                </div>
              )}

              {/* Learning Requirements - Strict Mode */}
              <LearningRequirements
                itemId={currentPYQ.id}
                youtubeUrl={currentPYQ.youtubeUrl}
                onPhotoUploaded={(photo: string) => markHandwritten(currentPYQ.id, photo)}
                onPhotoRemoved={(photoIndex: number) => removeHandwrittenPhoto(currentPYQ.id, photoIndex)}
                photos={conceptProgress[currentPYQ.id]?.handwrittenPhotos || []}
                isVideoWatched={isVideoWatched(currentPYQ.id)}
                onVideoWatched={() => markVideoWatched(currentPYQ.id)}
                requirementsMet={isRequirementsMet(currentPYQ.id)}
              />

              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-40 p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange/50 resize-none"
              />

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={examState.currentQuestion === 0}
                  className="flex-1 py-3 rounded-full glass hover:bg-white/10 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim()}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-orange to-ocean text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Save Answer
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 py-3 rounded-full glass hover:bg-white/10 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  {examState.currentQuestion === examState.questions.length - 1 ? "Submit Exam" : "Next"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
