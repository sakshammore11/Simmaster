import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Mistake {
  id: string;
  questionId: string;
  topic: string;
  unit: number;
  timestamp: number;
  yourAnswer?: string;
  correctAnswer?: string;
}

interface Bookmark {
  id: string;
  type: "concept" | "pyq" | "formula";
  itemId: string;
  title: string;
  unit?: number;
  timestamp: number;
}

interface ExamState {
  isActive: boolean;
  questions: string[];
  currentQuestion: number;
  answers: Record<string, string>;
  startTime: number;
  endTime?: number;
  timeLimit: number; // in minutes
}

interface StoreState {
  // UI State
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, "id" | "timestamp">) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (itemId: string) => boolean;

  // Mistakes
  mistakes: Mistake[];
  addMistake: (mistake: Omit<Mistake, "id" | "timestamp">) => void;
  getWeakTopics: () => { topic: string; count: number }[];

  // Exam State
  examState: ExamState;
  startExam: (questions: string[], timeLimit: number) => void;
  submitAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  endExam: () => void;
  resetExam: () => void;

  // Practice Progress
  practiceProgress: Record<string, { correct: number; total: number }>;
  updatePracticeProgress: (topic: string, correct: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // UI State
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // Bookmarks
      bookmarks: [],
      addBookmark: (bookmark) =>
        set((state) => {
          // Prevent duplicate bookmarks
          if (state.bookmarks.some((b) => b.itemId === bookmark.itemId)) {
            return state;
          }
          return {
            bookmarks: [
              ...state.bookmarks,
              { ...bookmark, id: Date.now().toString(), timestamp: Date.now() },
            ],
          };
        }),
      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),
      isBookmarked: (itemId) => {
        const state = get();
        return state.bookmarks.some((b) => b.itemId === itemId);
      },

      // Mistakes
      mistakes: [],
      addMistake: (mistake) =>
        set((state) => ({
          mistakes: [
            ...state.mistakes,
            { ...mistake, id: Date.now().toString(), timestamp: Date.now() },
          ],
        })),
      getWeakTopics: () => {
        const state = get();
        const topicCounts: Record<string, number> = {};
        state.mistakes.forEach((mistake) => {
          topicCounts[mistake.topic] = (topicCounts[mistake.topic] || 0) + 1;
        });
        return Object.entries(topicCounts)
          .map(([topic, count]) => ({ topic, count }))
          .sort((a, b) => b.count - a.count);
      },

      // Exam State
      examState: {
        isActive: false,
        questions: [],
        currentQuestion: 0,
        answers: {},
        startTime: 0,
        timeLimit: 60,
      },
      startExam: (questions, timeLimit) =>
        set({
          examState: {
            isActive: true,
            questions,
            currentQuestion: 0,
            answers: {},
            startTime: Date.now(),
            timeLimit,
          },
        }),
      submitAnswer: (questionId, answer) =>
        set((state) => ({
          examState: {
            ...state.examState,
            answers: { ...state.examState.answers, [questionId]: answer },
          },
        })),
      nextQuestion: () =>
        set((state) => ({
          examState: {
            ...state.examState,
            currentQuestion: Math.min(state.examState.currentQuestion + 1, state.examState.questions.length - 1),
          },
        })),
      endExam: () =>
        set((state) => ({
          examState: { ...state.examState, isActive: false, endTime: Date.now() },
        })),
      resetExam: () =>
        set({
          examState: {
            isActive: false,
            questions: [],
            currentQuestion: 0,
            answers: {},
            startTime: 0,
            timeLimit: 60,
          },
        }),

      // Practice Progress
      practiceProgress: {},
      updatePracticeProgress: (topic, correct) =>
        set((state) => {
          const currentProgress = state.practiceProgress[topic] || { correct: 0, total: 0 };
          const newCorrect = Math.max(0, currentProgress.correct + (correct ? 1 : 0));
          const newTotal = Math.max(0, currentProgress.total + 1);
          return {
            practiceProgress: {
              ...state.practiceProgress,
              [topic]: {
                correct: newCorrect,
                total: newTotal,
              },
            },
          };
        }),

      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "simmaster-storage",
    }
  )
);
