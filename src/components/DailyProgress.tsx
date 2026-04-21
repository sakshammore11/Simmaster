"use client";

import { useState } from "react";
import { Calendar, Target, TrendingUp, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import { calculateStudyStats, type StudyStats } from "@/utils/studyPlanner";

interface DailyProgressProps {
  conceptProgress: Record<string, { learned: boolean; practiced: boolean; lastAccessed: number; handwritten: boolean; videoWatched: boolean }>;
}

export default function DailyProgress({ conceptProgress }: DailyProgressProps) {
  const [customTarget, setCustomTarget] = useState<number | null>(null);
  const [customCompletedToday, setCustomCompletedToday] = useState<number | null>(null);
  const [showUnitBreakdown, setShowUnitBreakdown] = useState(true);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [isEditingCompleted, setIsEditingCompleted] = useState(false);
  
  const stats = calculateStudyStats(conceptProgress, new Date("2026-05-05"), customTarget || undefined, customCompletedToday || undefined);
  const remainingToday = Math.max(0, stats.dailyTarget - stats.completedToday);

  return (
    <div className="glass rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-orange" />
          Exam Study Planner
        </h2>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
          stats.onTrack ? "bg-green/20 text-green-500" : "bg-red/20 text-red-500"
        }`}>
          {stats.onTrack ? (
            <>
              <TrendingUp className="w-4 h-4" />
              On Track
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              Behind Schedule
            </>
          )}
        </div>
      </div>

      {/* Countdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange" />
            <span className="text-sm opacity-70">Days Remaining</span>
          </div>
          <div className="text-3xl font-bold">{stats.daysRemaining}</div>
          <div className="text-xs opacity-70">until May 5th</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-ocean" />
              <span className="text-sm opacity-70">Daily Target</span>
            </div>
            <button
              onClick={() => setIsEditingTarget(!isEditingTarget)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Edit target"
            >
              <Edit2 className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          </div>
          {isEditingTarget ? (
            <input
              type="number"
              value={customTarget || stats.dailyTarget}
              onChange={(e) => setCustomTarget(parseInt(e.target.value) || 0)}
              onBlur={() => setIsEditingTarget(false)}
              className="text-3xl font-bold bg-transparent border-b border-white/30 focus:border-orange outline-none w-20"
              autoFocus
            />
          ) : (
            <div className="text-3xl font-bold">{stats.dailyTarget}</div>
          )}
          <div className="text-xs opacity-70">items per day</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm opacity-70">Completed Today</span>
            </div>
            <button
              onClick={() => setIsEditingCompleted(!isEditingCompleted)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Edit completed today"
            >
              <Edit2 className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          </div>
          {isEditingCompleted ? (
            <input
              type="number"
              value={customCompletedToday ?? stats.completedToday}
              onChange={(e) => setCustomCompletedToday(parseInt(e.target.value) || 0)}
              onBlur={() => setIsEditingCompleted(false)}
              className="text-3xl font-bold bg-transparent border-b border-white/30 focus:border-orange outline-none w-20"
              autoFocus
            />
          ) : (
            <div className="text-3xl font-bold">{stats.completedToday}</div>
          )}
          <div className="text-xs opacity-70">{remainingToday > 0 ? `${remainingToday} more needed` : "Target met!"}</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-purple-500" />
            <span className="text-sm opacity-70">Remaining</span>
          </div>
          <div className="text-3xl font-bold">{stats.remainingItems}</div>
          <div className="text-xs opacity-70">{stats.remainingConcepts} concepts + {stats.remainingQuestions} questions</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="opacity-70">Total Progress</span>
          <span className="font-semibold">{stats.completedConcepts + stats.completedQuestions} / {stats.totalItems} ({stats.overallProgress.toFixed(1)}%)</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              stats.onTrack ? "bg-gradient-to-r from-green to-emerald" : "bg-gradient-to-r from-orange to-red"
            }`}
            style={{ width: `${stats.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="opacity-70">Concepts</span>
            <span className="font-semibold">{stats.completedConcepts} / {stats.totalConcepts}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="h-full rounded-full bg-ocean"
              style={{ width: `${(stats.completedConcepts / stats.totalConcepts) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="opacity-70">Questions</span>
            <span className="font-semibold">{stats.completedQuestions} / {stats.totalQuestions}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="h-full rounded-full bg-orange"
              style={{ width: `${(stats.completedQuestions / stats.totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Unit Breakdown Toggle */}
      <button
        onClick={() => setShowUnitBreakdown(!showUnitBreakdown)}
        className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors mb-4"
      >
        <span className="text-sm font-semibold">Unit-wise Progress</span>
        {showUnitBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Unit Breakdown */}
      {showUnitBreakdown && (
        <div className="space-y-3 mb-4">
          {stats.unitBreakdown.map((unit) => (
            <div key={unit.unitId} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold">Unit {unit.unitId}</span>
                  <p className="text-xs opacity-70">{unit.unitTitle}</p>
                </div>
                <span className="text-sm font-semibold">{unit.progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    unit.progress === 100 ? "bg-green-500" : "bg-gradient-to-r from-orange to-ocean"
                  }`}
                  style={{ width: `${unit.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs opacity-70">
                <span>Concepts: {unit.completedConcepts}/{unit.totalConcepts}</span>
                <span>Questions: {unit.completedQuestions}/{unit.totalQuestions}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Motivation */}
      {!stats.onTrack && (
        <div className="p-3 bg-red/20 border border-red/30 rounded-lg">
          <p className="text-sm font-semibold text-red-400">
            ⚠️ You're behind schedule! Complete {remainingToday} more items today to get back on track.
          </p>
        </div>
      )}

      {stats.onTrack && stats.completedToday >= stats.dailyTarget && (
        <div className="p-3 bg-green/20 border border-green/30 rounded-lg">
          <p className="text-sm font-semibold text-green-400">
            🎉 Great job! You've met your daily target. Keep up the momentum!
          </p>
        </div>
      )}
    </div>
  );
}
