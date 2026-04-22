import { create } from "zustand";
import { fetchUserData, updateUserData, getUserId } from "@/lib/store-utils";

// Helper function to generate unique IDs
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

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

interface ConceptProgress {
  learned: boolean;
  practiced: boolean;
  lastAccessed: number;
  handwritten: boolean;
  handwrittenPhotos: string[];
  videoWatched: boolean;
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

  // Concept Progress
  conceptProgress: Record<string, ConceptProgress>;
  markConceptLearned: (conceptId: string) => void;
  markConceptPracticed: (conceptId: string) => void;
  markHandwritten: (itemId: string, photo: string) => void;
  removeHandwrittenPhoto: (itemId: string, photoIndex: number) => void;
  isHandwritten: (itemId: string) => boolean;
  markVideoWatched: (itemId: string) => void;
  isVideoWatched: (itemId: string) => boolean;
  isRequirementsMet: (itemId: string) => boolean;
  getOverallProgress: () => { learned: number; total: number; practiced: number };

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // MongoDB Sync
  syncFromDB: () => Promise<void>;
  syncToDB: () => Promise<void>;

  // Authentication
  isAuthenticated: boolean;
  user: { userId: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
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
              { ...bookmark, id: generateId(), timestamp: Date.now() },
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
            { ...mistake, id: generateId(), timestamp: Date.now() },
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
        set(() => {
          // Validate inputs
          if (!Array.isArray(questions) || questions.length === 0) {
            console.error('Invalid questions array provided to startExam');
            return {}; // Return empty state to prevent update
          }
          if (typeof timeLimit !== 'number' || timeLimit <= 0) {
            console.error('Invalid timeLimit provided to startExam');
            return {}; // Return empty state to prevent update
          }
          
          return {
            examState: {
              isActive: true,
              questions,
              currentQuestion: 0,
              answers: {},
              startTime: Date.now(),
              timeLimit,
            },
          };
        }),
      submitAnswer: (questionId, answer) =>
        set((state) => {
          // Validate inputs
          if (!questionId || typeof questionId !== 'string') {
            console.error('Invalid questionId in submitAnswer');
            return state;
          }
          if (answer === undefined || answer === null) {
            console.error('Invalid answer in submitAnswer');
            return state;
          }
          if (!state.examState.isActive) {
            console.error('Cannot submit answer: exam not active');
            return state;
          }
          
          return {
            examState: {
              ...state.examState,
              answers: { ...state.examState.answers, [questionId]: answer },
            },
          };
        }),
      nextQuestion: () =>
        set((state) => {
          if (!state.examState.isActive) {
            console.error('Cannot go to next question: exam not active');
            return state;
          }
          
          const nextIndex = state.examState.currentQuestion + 1;
          const maxIndex = Math.max(0, state.examState.questions.length - 1);
          
          return {
            examState: {
              ...state.examState,
              currentQuestion: Math.min(nextIndex, maxIndex),
            },
          };
        }),
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

      // Concept Progress
      conceptProgress: {},
      markConceptLearned: (conceptId) =>
        set((state) => ({
          conceptProgress: {
            ...state.conceptProgress,
            [conceptId]: {
              ...(state.conceptProgress[conceptId] || {
                learned: false,
                practiced: false,
                lastAccessed: 0,
                handwritten: false,
                handwrittenPhotos: [],
                videoWatched: false,
              }),
              learned: true,
              lastAccessed: Date.now(),
            },
          },
        })),
      markConceptPracticed: (conceptId) =>
        set((state) => ({
          conceptProgress: {
            ...state.conceptProgress,
            [conceptId]: {
              ...(state.conceptProgress[conceptId] || {
                learned: false,
                practiced: false,
                lastAccessed: 0,
                handwritten: false,
                handwrittenPhotos: [],
                videoWatched: false,
              }),
              practiced: true,
              lastAccessed: Date.now(),
            },
          },
        })),
      getOverallProgress: () => {
        const state = get();
        const concepts = Object.values(state.conceptProgress);
        const learned = concepts.filter((c) => c.learned).length;
        const total = concepts.length;
        const practiced = concepts.filter((c) => c.practiced).length;
        return { learned, total, practiced };
      },
      markHandwritten: (itemId, photo) =>
        set((state) => {
          // Validate photo is a non-empty string
          if (!photo || typeof photo !== 'string') {
            console.error('Invalid photo data');
            return state;
          }
          
          const existing = state.conceptProgress[itemId] || {
            learned: false,
            practiced: false,
            lastAccessed: 0,
            handwritten: false,
            handwrittenPhotos: [],
            videoWatched: false,
          };
          
          return {
            conceptProgress: {
              ...state.conceptProgress,
              [itemId]: {
                ...existing,
                handwritten: true,
                handwrittenPhotos: [
                  ...(existing.handwrittenPhotos || []),
                  photo,
                ],
                lastAccessed: Date.now(),
              },
            },
          };
        }),
      removeHandwrittenPhoto: (itemId, photoIndex) =>
        set((state) => {
          const existing = state.conceptProgress[itemId];
          if (!existing) return state;
          
          const currentPhotos = existing.handwrittenPhotos || [];
          // Validate photoIndex bounds
          if (photoIndex < 0 || photoIndex >= currentPhotos.length) {
            console.error('Invalid photo index:', photoIndex);
            return state;
          }
          
          const newPhotos = currentPhotos.filter((_, index) => index !== photoIndex);
          return {
            conceptProgress: {
              ...state.conceptProgress,
              [itemId]: {
                ...existing,
                handwrittenPhotos: newPhotos,
                handwritten: newPhotos.length > 0,
              },
            },
          };
        }),
      isHandwritten: (itemId) => {
        const state = get();
        return state.conceptProgress[itemId]?.handwritten || false;
      },
      markVideoWatched: (itemId) =>
        set((state) => {
          const existing = state.conceptProgress[itemId] || {
            learned: false,
            practiced: false,
            lastAccessed: 0,
            handwritten: false,
            handwrittenPhotos: [],
            videoWatched: false,
          };
          
          return {
            conceptProgress: {
              ...state.conceptProgress,
              [itemId]: {
                ...existing,
                videoWatched: true,
                lastAccessed: Date.now(),
              },
            },
          };
        }),
      isVideoWatched: (itemId) => {
        const state = get();
        return state.conceptProgress[itemId]?.videoWatched || false;
      },
      isRequirementsMet: (itemId) => {
        const state = get();
        const progress = state.conceptProgress[itemId];
        return progress?.handwritten && progress?.videoWatched;
      },

      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      // MongoDB Sync
      syncFromDB: async () => {
        try {
          const state = get();
          // Use authenticated user ID if available, otherwise fall back to localStorage ID
          const userId = state.user?.userId || getUserId();
          const data = await fetchUserData(userId);
          if (data) {
            set({
              bookmarks: data.bookmarks || [],
              mistakes: data.mistakes || [],
              examState: data.examState || {
                isActive: false,
                questions: [],
                currentQuestion: 0,
                answers: {},
                startTime: 0,
                timeLimit: 60,
              },
              practiceProgress: data.practiceProgress || {},
              conceptProgress: data.conceptProgress || {},
              darkMode: data.darkMode || false,
              searchQuery: data.searchQuery || "",
            });
          }
        } catch (error) {
          console.error('Error syncing from DB:', error);
        }
      },

      syncToDB: async () => {
        try {
          const state = get();
          // Use authenticated user ID if available, otherwise fall back to localStorage ID
          const userId = state.user?.userId || getUserId();
          console.log('Syncing to DB with userId:', userId);
          console.log('Data to sync:', {
            bookmarks: state.bookmarks,
            mistakes: state.mistakes,
            conceptProgress: state.conceptProgress,
          });
          const result = await updateUserData(userId, {
            bookmarks: state.bookmarks,
            mistakes: state.mistakes,
            examState: state.examState,
            practiceProgress: state.practiceProgress,
            conceptProgress: state.conceptProgress,
            darkMode: state.darkMode,
            searchQuery: state.searchQuery,
          });
          console.log('Sync to DB successful:', result);
        } catch (error) {
          console.error('Error syncing to DB:', error);
        }
      },

      // Authentication
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
          }
          
          const data = await response.json();
          set({
            isAuthenticated: true,
            user: data.user,
          });
          
          // Sync user data after login
          get().syncFromDB();
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          set({
            isAuthenticated: false,
            user: null,
            bookmarks: [],
            mistakes: [],
            examState: {
              isActive: false,
              questions: [],
              currentQuestion: 0,
              answers: {},
              startTime: 0,
              timeLimit: 60,
            },
            practiceProgress: {},
            conceptProgress: {},
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
      checkAuth: async () => {
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const data = await response.json();
            set({
              isAuthenticated: true,
              user: data.user,
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({
            isAuthenticated: false,
            user: null,
          });
        }
      },
    })
);
