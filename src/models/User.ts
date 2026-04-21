import mongoose, { Document, Schema } from 'mongoose';

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

interface PracticeProgress {
  correct: number;
  total: number;
}

interface ExamState {
  isActive: boolean;
  questions: string[];
  currentQuestion: number;
  answers: Record<string, string>;
  startTime: number;
  endTime?: number;
  timeLimit: number;
}

interface IUser extends Document {
  userId: string;
  bookmarks: Bookmark[];
  mistakes: Mistake[];
  examState: ExamState;
  practiceProgress: Record<string, PracticeProgress>;
  conceptProgress: Record<string, ConceptProgress>;
  darkMode: boolean;
  searchQuery: string;
  createdAt: Date;
  updatedAt: Date;
}

const MistakeSchema = new Schema<Mistake>({
  id: { type: String, required: true },
  questionId: { type: String, required: true },
  topic: { type: String, required: true },
  unit: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  yourAnswer: String,
  correctAnswer: String,
});

const BookmarkSchema = new Schema<Bookmark>({
  id: { type: String, required: true },
  type: { type: String, required: true, enum: ["concept", "pyq", "formula"] },
  itemId: { type: String, required: true },
  title: { type: String, required: true },
  unit: { type: Number },
  timestamp: { type: Number, required: true },
});

const ConceptProgressSchema = new Schema<ConceptProgress>({
  learned: { type: Boolean, default: false },
  practiced: { type: Boolean, default: false },
  lastAccessed: { type: Number, default: 0 },
  handwritten: { type: Boolean, default: false },
  handwrittenPhotos: { type: [String], default: [] },
  videoWatched: { type: Boolean, default: false },
});

const PracticeProgressSchema = new Schema<PracticeProgress>({
  correct: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
});

const ExamStateSchema = new Schema<ExamState>({
  isActive: { type: Boolean, default: false },
  questions: { type: [String], default: [] },
  currentQuestion: { type: Number, default: 0 },
  answers: { type: Object, default: {} },
  startTime: { type: Number, default: 0 },
  endTime: { type: Number },
  timeLimit: { type: Number, default: 60 },
});

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    bookmarks: { type: [BookmarkSchema], default: [] },
    mistakes: { type: [MistakeSchema], default: [] },
    examState: { type: ExamStateSchema, default: {} },
    practiceProgress: { type: Object, default: {} },
    conceptProgress: { type: Object, default: {} },
    darkMode: { type: Boolean, default: false },
    searchQuery: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
