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
  remainingConcepts: number;
  remainingQuestions: number;
  remainingItems: number;
  unitBreakdown: Array<{
    unitId: number;
    unitTitle: string;
    totalConcepts: number;
    completedConcepts: number;
    totalQuestions: number;
    completedQuestions: number;
    progress: number;
  }>;
}

export function calculateStudyStats(
  conceptProgress: Record<string, { learned: boolean; practiced: boolean; lastAccessed: number; handwritten: boolean; videoWatched: boolean }>,
  examDate: Date = new Date("2026-05-05"),
  customDailyTarget?: number,
  customCompletedToday?: number
): StudyStats {
  const totalConcepts = syllabusData.reduce((sum, unit) => sum + unit.concepts.length, 0);
  const totalQuestions = pyqData.length;
  const totalItems = totalConcepts + totalQuestions;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDay = new Date(examDate);
  examDay.setHours(0, 0, 0, 0);
  
  const daysRemaining = Math.max(1, Math.ceil((examDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const dailyTarget = customDailyTarget || Math.ceil(totalItems / daysRemaining);

  // Count completed items based on strict requirements (video + notes)
  const completedConcepts = Object.entries(conceptProgress).filter(([id, c]) => {
    const isConcept = syllabusData.some(unit => unit.concepts.some(concept => concept.id === id));
    return isConcept && c.handwritten && c.videoWatched;
  }).length;
  
  const completedQuestions = Object.entries(conceptProgress).filter(([id, c]) => {
    const isQuestion = pyqData.some(pyq => pyq.id === id);
    return isQuestion && c.handwritten && c.videoWatched;
  }).length;
  
  const completedToday = customCompletedToday !== undefined 
    ? customCompletedToday
    : Object.values(conceptProgress).filter((c) => {
        if (!c.lastAccessed) return false;
        const lastAccess = new Date(c.lastAccessed);
        lastAccess.setHours(0, 0, 0, 0);
        return lastAccess.getTime() === today.getTime() && c.handwritten && c.videoWatched;
      }).length;

  const remainingConcepts = totalConcepts - completedConcepts;
  const remainingQuestions = totalQuestions - completedQuestions;
  const remainingItems = remainingConcepts + remainingQuestions;

  const overallProgress = ((completedConcepts + completedQuestions) / totalItems) * 100;
  
  // Calculate on track based on remaining items and days
  const expectedDailyTarget = Math.ceil(remainingItems / daysRemaining);
  const onTrack = dailyTarget >= expectedDailyTarget;

  // Unit-wise breakdown
  const unitBreakdown = syllabusData.map(unit => {
    const unitConceptIds = unit.concepts.map(c => c.id);
    const unitCompletedConcepts = unitConceptIds.filter(id => 
      conceptProgress[id]?.handwritten && conceptProgress[id]?.videoWatched
    ).length;
    
    const unitQuestions = pyqData.filter(pyq => pyq.unit === unit.id);
    const unitCompletedQuestions = unitQuestions.filter(pyq =>
      conceptProgress[pyq.id]?.handwritten && conceptProgress[pyq.id]?.videoWatched
    ).length;
    
    const unitTotal = unit.concepts.length + unitQuestions.length;
    const unitCompleted = unitCompletedConcepts + unitCompletedQuestions;
    
    return {
      unitId: unit.id,
      unitTitle: unit.title,
      totalConcepts: unit.concepts.length,
      completedConcepts: unitCompletedConcepts,
      totalQuestions: unitQuestions.length,
      completedQuestions: unitCompletedQuestions,
      progress: (unitCompleted / unitTotal) * 100,
    };
  });

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
    remainingConcepts,
    remainingQuestions,
    remainingItems,
    unitBreakdown,
  };
}
