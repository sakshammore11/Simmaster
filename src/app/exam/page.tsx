"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, XCircle, Play } from "lucide-react";
import { pyqData, type PYQ } from "@/data/pyqs";
import { syllabusData } from "@/data/syllabus";
import { useStore } from "@/store/useStore";
import LearningRequirements from "@/components/LearningRequirements";

export default function ExamPage() {
  const { examState, startExam, submitAnswer, nextQuestion, endExam, resetExam, addMistake, markHandwritten, removeHandwrittenPhoto, conceptProgress, markVideoWatched, isVideoWatched, isRequirementsMet } = useStore();
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [customTime, setCustomTime] = useState<number>(30);
  const [examPreset, setExamPreset] = useState<"custom" | "most-expected" | "high-weight" | "last-night">("custom");

  useEffect(() => {
    if (examState.isActive && examState.timeLimit > 0) {
      const timer = setInterval(() => {
        const elapsed = (Date.now() - examState.startTime) / 1000 / 60; // in minutes
        if (elapsed >= examState.timeLimit) {
          handleEndExam();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examState.isActive, examState.startTime, examState.timeLimit]);

  const handleStartExam = () => {
    let questions: string[] = [];
    let timeLimit = customTime;

    switch (examPreset) {
      case "most-expected":
        // Filter by high importanceScore and recent PYQs
        questions = pyqData
          .filter(pyq => {
            const concept = syllabusData
              .flatMap(u => u.concepts)
              .find(c => c.id === pyq.id);
            return (concept?.importanceScore || 0) >= 80 && (concept?.pyqYears?.includes("2024") || false);
          })
          .map(pyq => pyq.id)
          .slice(0, 20);
        timeLimit = 45;
        break;
      case "high-weight":
        // Filter by high marksWeightage
        questions = pyqData
          .filter(pyq => {
            const concept = syllabusData
              .flatMap(u => u.concepts)
              .find(c => c.id === pyq.id);
            return (concept?.marksWeightage || 0) >= 8;
          })
          .map(pyq => pyq.id)
          .slice(0, 15);
        timeLimit = 60;
        break;
      case "last-night":
        // Top 10 most important formulas/concepts
        questions = pyqData
          .filter(pyq => {
            const concept = syllabusData
              .flatMap(u => u.concepts)
              .find(c => c.id === pyq.id);
            return (concept?.importanceScore || 0) >= 90;
          })
          .map(pyq => pyq.id)
          .slice(0, 10);
        timeLimit = 30;
        break;
      default:
        questions = pyqData.map((pyq) => pyq.id);
        timeLimit = customTime;
    }

    startExam(questions, timeLimit);
  };

  const handleSubmitAnswer = () => {
    if (currentAnswer.trim()) {
      submitAnswer(examState.questions[examState.currentQuestion], currentAnswer);
      setCurrentAnswer("");
    }
  };

  const handleNextQuestion = () => {
    if (examState.currentQuestion < examState.questions.length - 1) {
      nextQuestion();
    } else {
      handleEndExam();
    }
  };

  const handleEndExam = () => {
    endExam();
    // Calculate score (simplified - in real app would compare with correct answers)
    const answered = Object.keys(examState.answers).length;
    setScore(answered);
    setShowResults(true);
  };

  const handleReset = () => {
    resetExam();
    setShowResults(false);
    setScore(0);
    setCurrentAnswer("");
  };

  const timeRemaining = examState.timeLimit - (Date.now() - examState.startTime) / 1000 / 60;
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
                  <div className="text-xs opacity-70">20 Q • 45 min</div>
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
                  <div className="text-xs opacity-70">15 Q • 60 min</div>
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
                  <div className="text-xs opacity-70">10 Q • 30 min</div>
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
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Exam Results</h1>

            <div className="glass p-6 mb-8">
              <div className="text-5xl font-bold bg-gradient-to-r from-orange to-ocean bg-clip-text text-transparent mb-2">
                {score}/{examState.questions.length}
              </div>
              <p className="opacity-70">Questions Attempted</p>
            </div>

            <div className="grid gap-4 mb-8">
              {examState.questions.map((questionId, index) => {
                const pyq = pyqData.find((p) => p.id === questionId);
                const answer = examState.answers[questionId];
                return (
                  <div key={questionId} className="glass p-4 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      {answer ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-semibold">Question {index + 1}</span>
                      <span className="text-sm opacity-70">({pyq?.marks} marks)</span>
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
      <div className="max-w-4xl mx-auto">
        {/* Timer Header - Fixed at top */}
        <div className="sticky top-0 z-50 glass border-b border-white/10 px-4 py-3 mb-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${timeRemaining < 5 ? 'text-red-500 animate-pulse' : 'text-orange'}`} />
              <span className={`font-semibold text-lg ${timeRemaining < 5 ? 'text-red-500' : ''}`}>
                {Math.max(0, timeRemaining).toFixed(1)} min remaining
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="opacity-70">
                Question {examState.currentQuestion + 1} of {examState.questions.length}
              </div>
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
              className={`h-full transition-all duration-300 ${timeRemaining < 5 ? 'bg-red-500' : 'bg-gradient-to-r from-orange to-ocean'}`}
              style={{
                width: `${(timeRemaining / examState.timeLimit) * 100}%`,
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
            </div>

            <h2 className="text-xl font-bold mb-2">{currentPYQ.topic}</h2>
            <p className="text-lg opacity-90 mb-6">{currentPYQ.question}</p>

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
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-40 p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange/50 resize-none"
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim()}
                className="flex-1 py-3 rounded-full bg-gradient-to-r from-orange to-ocean text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Save Answer
              </button>
              <button
                onClick={handleNextQuestion}
                className="flex-1 py-3 rounded-full glass hover:bg-white/10 transition-colors font-semibold"
              >
                {examState.currentQuestion === examState.questions.length - 1 ? "Submit Exam" : "Next Question"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
