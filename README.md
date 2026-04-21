# SimMaster – Modeling & Simulation Trainer

A complete, production-ready web application for students preparing for "Modeling and Simulation" (TY IT, Mumbai University / KJ Somaiya level).

## 🌟 Features

### Core Learning Features
- **Unit-wise Learning (Units 1-5)**: Concepts explained simply with visual aids and PYQ tags
- **Step-by-step Numerical Solver**: Formula → Substitution → Calculation → Final Answer with "Why this step?" explanations
- **Formula Revision Mode**: Flashcards with "When to use this" hints for quick revision

### Practice & Assessment
- **Exam Mode**: PYQ-based mock tests with timer, scoring, full solution, and marks breakdown
- **Practice Mode**: Topic-wise questions with difficulty levels (Easy, Medium, PYQ Level, Hard)
- **Mistake Tracker**: Tracks wrong answers and suggests weak topics

### AI-Powered Learning
- **AI Tutor**: Integrated Google Gemini API (gemma-3-1b) to answer doubts, explain numericals, and simplify concepts
- **Fallback System**: Predefined explanations when API is unavailable

### User Experience
- **Search**: Find topics, formulas, and PYQs instantly
- **Bookmark System**: Save important concepts, formulas, and PYQs
- **Dark Mode**: Comfortable late-night study sessions
- **PWA Support**: Installable, works offline
- **Mobile-First Design**: Optimized for all devices

## 🎨 Design

Frank Ocean inspired aesthetic:
- Soft gradients (peach, orange, beige, ocean blue)
- Glassmorphism elements with blur effects
- Smooth subtle animations
- Clean, distraction-free interface
- Late-night study vibes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "MS APP"
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📚 Syllabus Coverage

Based on Mumbai University TY IT syllabus:

### Unit 1: Introduction to Modeling and Simulation (10 Hrs)
- Queuing systems
- Simulation examples (single/two-server, inventory, reliability)
- Discrete-event simulation
- Steps of a simulation study
- Simulation languages

### Unit 2: Basic Probability and Statistics (7 Hrs)
- Statistical terminology
- Discrete distributions (Bernoulli, Binomial, Geometric, Poisson)
- Continuous distributions (Uniform, Exponential, Normal, Triangular)
- Poisson process properties
- Empirical distributions

### Unit 3: Random Numbers and Random Variates (12 Hrs)
- Properties of random numbers
- Linear congruential generators
- Testing random number generators (frequency, runs, autocorrelation)
- Generating random variates (inverse transform, acceptance-rejection)

### Unit 4: Input Modeling (9 Hrs)
- Data collection and identification
- Parameter estimation (MLE)
- Goodness-of-fit tests (Chi-Square, K-S)
- Multivariate and time series input models (covariance, correlation, AR(1))

### Unit 5: Verification, Validation and Output Analysis (7 Hrs)
- Model building, verification, and validation
- Calibration and validation techniques
- Output analysis for steady-state simulations
- Initialization bias and batch means method

## 🔧 Tech Stack

- **Framework**: Next.js 16 (React)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with persistence
- **Storage**: LocalStorage (via Zustand persist middleware)
- **PWA**: next-pwa
- **AI**: Google Gemini API (gemma-3-1b)
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📱 PWA Installation

The app is PWA-enabled and can be installed:
1. Open the app in Chrome/Safari on mobile
2. Tap "Add to Home Screen" or "Install App"
3. The app will work offline after installation

## 🤖 AI Tutor Configuration

The AI Tutor uses Google Gemini API with the gemma-3-1b model. The API key is configured in `src/services/aiTutor.ts`. To use your own API key:

1. Get a key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Replace the API key in `src/services/aiTutor.ts`:
```typescript
const API_KEY = "your-api-key-here";
```

## 📊 Data Structure

### Syllabus Data (`src/data/syllabus.ts`)
- 5 Units with concepts
- Each concept has: title, description, formula, whenToUse, PYQ tags

### PYQ Data (`src/data/pyqs.ts`)
- Previous Year Questions with step-by-step solutions
- Includes: question, marks, unit, topic, difficulty, type, solution steps

## 🎯 Performance

- Fast loading (<2s)
- Works on low-end phones
- Smooth animations with hardware acceleration
- Optimized images and assets
- Code splitting and lazy loading

## 📝 License

This project is for educational purposes for TY IT students at Mumbai University.

## 🙏 Acknowledgments

- Syllabus and PYQs from K.J. Somaiya College of Engineering, Mumbai University
- Inspired by Frank Ocean's aesthetic for calm, focused learning
- Built with Next.js, Tailwind CSS, and modern web technologies
