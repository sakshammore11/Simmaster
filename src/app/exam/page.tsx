"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, XCircle, Play } from "lucide-react";
import { pyqData, type PYQ } from "@/data/pyqs";
import { useStore } from "@/store/useStore";
import PhotoUpload from "@/components/PhotoUpload";

export default function ExamPage() {
  const { examState, startExam, submitAnswer, nextQuestion, endExam, resetExam, addMistake, markHandwritten, isHandwritten } = useStore();
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

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
    const questions = pyqData.map((pyq) => pyq.id);
    startExam(questions, 30); // 30 minutes exam
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
              Test your knowledge with PYQ-based mock tests. You'll have 30 minutes to answer all questions.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass p-4">
                <div className="text-2xl font-bold">{pyqData.length}</div>
                <div className="text-sm opacity-70">Questions</div>
              </div>
              <div className="glass p-4">
                <div className="text-2xl font-bold">30</div>
                <div className="text-sm opacity-70">Minutes</div>
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
            </div>

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange" />
            <span className="font-semibold">
              {Math.max(0, timeRemaining).toFixed(1)} minutes remaining
            </span>
          </div>
          <div className="opacity-70">
            Question {examState.currentQuestion + 1} of {examState.questions.length}
          </div>
        </div>

        {/* Progress Bar */}
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

            {/* Photo Upload Requirement */}
            <PhotoUpload
              itemId={currentPYQ.id}
              onPhotoUploaded={(photo) => markHandwritten(currentPYQ.id, photo)}
              isUploaded={isHandwritten(currentPYQ.id)}
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
