import { syllabusData } from "@/data/syllabus";
import { pyqData } from "@/data/pyqs";

export interface StudyStats {
  totalConcepts: number;
  totalQuestions: number;
  totalItems: number;
  examDate: Date;
  daysRemaining: number;
  dailyTarget: number;
  completedConcepts: number;
  completedQuestions: number;
  completedToday: number;
  overallProgress: number;
  onTrack: boolean;
}

export function calculateStudyStats(
  conceptProgress: Record<string, { learned: boolean; practiced: boolean; lastAccessed: number }>,
  examDate: Date = new Date("2025-05-05")
): StudyStats {
  const totalConcepts = syllabusData.reduce((sum, unit) => sum + unit.concepts.length, 0);
  const totalQuestions = pyqData.length;
  const totalItems = totalConcepts + totalQuestions;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDay = new Date(examDate);
  examDay.setHours(0, 0, 0, 0);
  
  const daysRemaining = Math.max(1, Math.ceil((examDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const dailyTarget = Math.ceil(totalItems / daysRemaining);

  const completedConcepts = Object.values(conceptProgress).filter((c) => c.learned).length;
  const completedQuestions = Object.values(conceptProgress).filter((c) => c.practiced).length;
  
  const completedToday = Object.values(conceptProgress).filter((c) => {
    if (!c.lastAccessed) return false;
    const lastAccess = new Date(c.lastAccessed);
    lastAccess.setHours(0, 0, 0, 0);
    return lastAccess.getTime() === today.getTime();
  }).length;

  const overallProgress = ((completedConcepts + completedQuestions) / totalItems) * 100;
  
  const expectedProgressByNow = ((totalItems - (dailyTarget * daysRemaining)) / totalItems) * 100;
  const onTrack = overallProgress >= expectedProgressByNow - 5; // 5% tolerance

  return {
    totalConcepts,
    totalQuestions,
    totalItems,
    examDate: examDay,
    daysRemaining,
    dailyTarget,
    completedConcepts,
    completedQuestions,
    completedToday,
    overallProgress,
    onTrack,
  };
}
