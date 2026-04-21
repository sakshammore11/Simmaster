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
  // Validate inputs
  if (!conceptProgress || typeof conceptProgress !== 'object') {
    console.error('Invalid conceptProgress provided');
    conceptProgress = {};
  }

  const totalConcepts = syllabusData.reduce((sum, unit) => sum + unit.concepts.length, 0);
  const totalQuestions = pyqData.length;
  const totalItems = totalConcepts + totalQuestions;

  // Avoid division by zero
  if (totalItems === 0) {
    console.warn('No items found in syllabus or pyqs');
    return {
      totalConcepts: 0,
      totalQuestions: 0,
      totalItems: 0,
      examDate: new Date(examDate),
      daysRemaining: 0,
      dailyTarget: 0,
      completedConcepts: 0,
      completedQuestions: 0,
      completedToday: 0,
      overallProgress: 0,
      onTrack: false,
      remainingConcepts: 0,
      remainingQuestions: 0,
      remainingItems: 0,
      unitBreakdown: [],
    };
  }

  // Create new date objects to avoid mutation
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const examDay = new Date(examDate);
  const examDayStart = new Date(examDay.getFullYear(), examDay.getMonth(), examDay.getDate());
  
  const daysRemaining = Math.max(1, Math.ceil((examDayStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Validate customDailyTarget
  const validatedDailyTarget = customDailyTarget !== undefined && customDailyTarget > 0 
    ? customDailyTarget 
    : Math.ceil(totalItems / daysRemaining);
  const dailyTarget = validatedDailyTarget;

  // Count completed items based on strict requirements (video + notes)
  const completedConcepts = Object.entries(conceptProgress).filter(([id, c]) => {
    const isConcept = syllabusData.some(unit => unit.concepts.some(concept => concept.id === id));
    return isConcept && c.handwritten && c.videoWatched;
  }).length;
  
  const completedQuestions = Object.entries(conceptProgress).filter(([id, c]) => {
    const isQuestion = pyqData.some(pyq => pyq.id === id);
    return isQuestion && c.handwritten && c.videoWatched;
  }).length;
  
  // Validate customCompletedToday
  const validatedCompletedToday = customCompletedToday !== undefined && customCompletedToday >= 0
    ? Math.min(customCompletedToday, totalItems) // Cap at total items
    : Object.values(conceptProgress).filter((c) => {
        if (!c.lastAccessed) return false;
        const lastAccess = new Date(c.lastAccessed);
        const lastAccessStart = new Date(lastAccess.getFullYear(), lastAccess.getMonth(), lastAccess.getDate());
        return lastAccessStart.getTime() === todayStart.getTime() && c.handwritten && c.videoWatched;
      }).length;
  const completedToday = validatedCompletedToday;

  const remainingConcepts = totalConcepts - completedConcepts;
  const remainingQuestions = totalQuestions - completedQuestions;
  const remainingItems = remainingConcepts + remainingQuestions;

  const overallProgress = ((completedConcepts + completedQuestions) / totalItems) * 100;
  
  // Calculate on track based on remaining items and days
  const expectedDailyTarget = daysRemaining > 0 ? Math.ceil(remainingItems / daysRemaining) : 0;
  const onTrack = dailyTarget >= expectedDailyTarget;

  // Unit-wise breakdown with division by zero protection
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
    
    // Avoid division by zero
    const progress = unitTotal > 0 ? (unitCompleted / unitTotal) * 100 : 0;
    
    return {
      unitId: unit.id,
      unitTitle: unit.title,
      totalConcepts: unit.concepts.length,
      completedConcepts: unitCompletedConcepts,
      totalQuestions: unitQuestions.length,
      completedQuestions: unitCompletedQuestions,
      progress,
    };
  });

  return {
    totalConcepts,
    totalQuestions,
    totalItems,
    examDate: examDayStart,
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
