export interface PYQStep {
  step: number;
  title: string;
  explanation: string;
  formula?: string;
  substitution?: string;
  calculation?: string;
  finalAnswer?: string;
  whyThisStep?: string;
}

export interface PYQ {
  id: string;
  year: string;
  question: string;
  marks: number;
  unit: number;
  topic: string;
  difficulty: "Easy" | "Medium" | "PYQ Level" | "Hard";
  type: "theoretical" | "numerical";
  steps?: PYQStep[];
  data?: any;
  answer?: string;
  youtubeUrl?: string;
}

export const pyqData: PYQ[] = [
  // Unit 1 PYQs
  {
    id: "1-1",
    year: "2023",
    question: "Explain in brief Monte Carlo Simulation",
    marks: 5,
    unit: 1,
    topic: "Monte Carlo Simulation",
    difficulty: "Medium",
    type: "theoretical",
    answer: "Monte Carlo Simulation is a computational technique that uses random sampling to obtain numerical results. It relies on repeated random sampling to simulate the behavior of complex systems. Key steps: 1) Define problem domain, 2) Generate random inputs, 3) Perform deterministic computations, 4) Aggregate results. Applications: finance, physics, engineering, risk analysis.",
  },
  {
    id: "1-2",
    year: "2024",
    question: "Consider the grocery store with one checkout counter. Write the system states and event notices of the event-scheduling simulation model. Estimate mean response time, observed proportion of customer who spend 4 or more minutes in the system, total number of departures by event-scheduling simulation. Stop the simulation when clock time is at 10.",
    marks: 10,
    unit: 1,
    topic: "Event-Scheduling Simulation",
    difficulty: "PYQ Level",
    type: "numerical",
    data: {
      interArrivalTime: [8, 6, 1, 8, 3, 8],
      serviceTime: [4, 1, 4, 3, 2, 4],
    },
    steps: [
      {
        step: 1,
        title: "Create simulation table",
        explanation: "Set up event-scheduling simulation table with clock times, arrival times, departure times, and system state.",
        whyThisStep: "Event-scheduling requires tracking all events chronologically to determine system behavior.",
      },
      {
        step: 2,
        title: "Calculate arrival times",
        explanation: "Cumulative sum of inter-arrival times gives arrival times.",
        formula: "Arrival Time[i] = Arrival Time[i-1] + Inter-arrival Time[i]",
        substitution: "Customer 1: 0, Customer 2: 0+8=8, Customer 3: 8+6=14, Customer 4: 14+1=15, Customer 5: 15+8=23",
        calculation: "Arrival times: [0, 8, 14, 15, 23]",
        whyThisStep: "Need to know when each customer arrives to schedule events.",
      },
      {
        step: 3,
        title: "Calculate departure times",
        explanation: "Departure time = max(arrival time, previous departure) + service time.",
        formula: "Departure[i] = max(Arrival[i], Departure[i-1]) + Service[i]",
        substitution: "Customer 1: max(0,0)+4=4, Customer 2: max(8,4)+1=9, Customer 3: max(14,9)+4=18",
        calculation: "Departure times: [4, 9, 18, 21, 25]",
        whyThisStep: "Departure times determine when server becomes free for next customer.",
      },
      {
        step: 4,
        title: "Calculate response times",
        explanation: "Response time = departure time - arrival time (time spent in system).",
        formula: "Response[i] = Departure[i] - Arrival[i]",
        substitution: "Customer 1: 4-0=4, Customer 2: 9-8=1, Customer 3: 18-14=4, Customer 4: 21-15=6",
        calculation: "Response times: [4, 1, 4, 6]",
        whyThisStep: "Response time measures customer waiting + service time.",
      },
      {
        step: 5,
        title: "Calculate mean response time",
        explanation: "Average of all response times.",
        formula: "Mean Response = Σ Response[i] / n",
        substitution: "(4 + 1 + 4 + 6) / 4",
        calculation: "15 / 4 = 3.75",
        finalAnswer: "Mean response time = 3.75 minutes",
        whyThisStep: "Mean response time is key performance metric for queuing systems.",
      },
      {
        step: 6,
        title: "Calculate proportion spending 4+ minutes",
        explanation: "Count customers with response time ≥ 4, divide by total.",
        formula: "Proportion = Count(Response ≥ 4) / Total Customers",
        substitution: "Customers with response ≥ 4: 3 out of 4",
        calculation: "3 / 4 = 0.75",
        finalAnswer: "75% of customers spend 4+ minutes in system",
        whyThisStep: "This measures service quality - how many customers experience long waits.",
      },
      {
        step: 7,
        title: "Count total departures by clock=10",
        explanation: "Count departures that occur before or at clock time 10.",
        substitution: "Departures at times: 4, 9, 18, 21, 25",
        calculation: "Departures ≤ 10: 2 (at times 4 and 9)",
        finalAnswer: "Total departures by clock time 10 = 2",
        whyThisStep: "Measures system throughput up to specified time.",
      },
    ],
  },
  {
    id: "1-3",
    year: "2023",
    question: "Using the data given in table below, obtain the simulation table emphasizing clock times. Also draw figure to show the chronological ordering of events (showing arrival and departure of customers over a period of time)",
    marks: 10,
    unit: 1,
    topic: "Simulation Table",
    difficulty: "PYQ Level",
    type: "numerical",
    data: {
      customers: [
        { number: 1, interArrival: null, serviceTime: 2 },
        { number: 2, interArrival: 2, serviceTime: 1 },
        { number: 3, interArrival: 4, serviceTime: 3 },
        { number: 4, interArrival: 1, serviceTime: 2 },
        { number: 5, interArrival: 2, serviceTime: 1 },
      ],
    },
    steps: [
      {
        step: 1,
        title: "Calculate arrival times",
        explanation: "Cumulative sum of inter-arrival times.",
        formula: "Arrival[i] = Arrival[i-1] + Inter-arrival[i]",
        substitution: "C1: 0, C2: 0+2=2, C3: 2+4=6, C4: 6+1=7, C5: 7+2=9",
        calculation: "Arrival times: [0, 2, 6, 7, 9]",
      },
      {
        step: 2,
        title: "Calculate start times",
        explanation: "Start time = max(arrival time, previous departure).",
        formula: "Start[i] = max(Arrival[i], Departure[i-1])",
        substitution: "C1: max(0,0)=0, C2: max(2,2)=2, C3: max(6,3)=6, C4: max(7,9)=9, C5: max(9,11)=11",
        calculation: "Start times: [0, 2, 6, 9, 11]",
      },
      {
        step: 3,
        title: "Calculate departure times",
        explanation: "Departure = start time + service time.",
        formula: "Departure[i] = Start[i] + Service[i]",
        substitution: "C1: 0+2=2, C2: 2+1=3, C3: 6+3=9, C4: 9+2=11, C5: 11+1=12",
        calculation: "Departure times: [2, 3, 9, 11, 12]",
      },
      {
        step: 4,
        title: "Create simulation table",
        explanation: "Compile all times into simulation table.",
        finalAnswer: "Simulation table shows events at: Arrivals(0,2,6,7,9), Departures(2,3,9,11,12)",
      },
    ],
  },

  // Unit 2 PYQs
  {
    id: "2-1",
    year: "2024",
    question: "Explain the measures of linear dependence Covariance and Correlation between random variables.",
    marks: 5,
    unit: 2,
    topic: "Covariance and Correlation",
    difficulty: "Medium",
    type: "theoretical",
    answer: "Covariance measures how two variables change together: Cov(X,Y) = E[(X-μX)(Y-μY)]. Positive: variables move together, Negative: move opposite, Zero: independent. Correlation normalizes covariance to [-1,1]: ρ = Cov(X,Y)/(σXσY). 1: perfect positive, -1: perfect negative, 0: no linear relationship.",
  },
  {
    id: "2-2",
    year: "2024",
    question: "Probability of more than two hurricanes given mean of 0.8. Also, find mean and variance.",
    marks: 5,
    unit: 2,
    topic: "Poisson Distribution",
    difficulty: "Medium",
    type: "numerical",
    steps: [
      {
        step: 1,
        title: "Identify distribution",
        explanation: "Hurricane count follows Poisson distribution with λ = 0.8.",
        formula: "P(X=k) = (λ^k e^(-λ))/k!",
        whyThisStep: "Poisson models rare events in fixed interval.",
      },
      {
        step: 2,
        title: "Calculate P(X>2)",
        explanation: "P(X>2) = 1 - P(X≤2) = 1 - [P(X=0) + P(X=1) + P(X=2)]",
        formula: "P(X>2) = 1 - Σ(k=0 to 2) (λ^k e^(-λ))/k!",
        substitution: "P(X=0) = (0.8^0 e^(-0.8))/0! = e^(-0.8) = 0.4493",
        calculation: "P(X=1) = (0.8^1 e^(-0.8))/1! = 0.8 × 0.4493 = 0.3595",
      },
      {
        step: 3,
        title: "Continue calculation",
        explanation: "Calculate P(X=2) and sum.",
        substitution: "P(X=2) = (0.8^2 e^(-0.8))/2! = 0.64 × 0.4493 / 2 = 0.1438",
        calculation: "P(X≤2) = 0.4493 + 0.3595 + 0.1438 = 0.9526",
      },
      {
        step: 4,
        title: "Final probability",
        explanation: "P(X>2) = 1 - P(X≤2)",
        substitution: "P(X>2) = 1 - 0.9526",
        calculation: "P(X>2) = 0.0474",
        finalAnswer: "Probability of more than 2 hurricanes = 0.0474 (4.74%)",
      },
      {
        step: 5,
        title: "Mean and variance",
        explanation: "For Poisson, Mean = Variance = λ",
        substitution: "Mean = λ = 0.8, Variance = λ = 0.8",
        finalAnswer: "Mean = 0.8, Variance = 0.8",
        whyThisStep: "Poisson distribution has equal mean and variance.",
      },
    ],
  },

  // Unit 3 PYQs
  {
    id: "3-1",
    year: "2023",
    question: "Consider a Linear Congruential random number generator with parameters a=13, m=64, c=0, seed X0=2. Generate random numbers and determine the period of the generator.",
    marks: 10,
    unit: 3,
    topic: "Linear Congruential Generator",
    difficulty: "PYQ Level",
    type: "numerical",
    youtubeUrl: "https://www.youtube.com/watch?v=LUusa5Mhx_g",
    steps: [
      {
        step: 1,
        title: "Apply LCG formula",
        explanation: "Use Xn+1 = (aXn + c) mod m iteratively to generate sequence.",
        formula: "Xn+1 = (aXn + c) mod m",
        substitution: "a=13, m=64, c=0, X0=2",
        whyThisStep: "LCG generates pseudo-random numbers using modular arithmetic.",
      },
      {
        step: 2,
        title: "Calculate X1 and X2",
        explanation: "Apply formula to get first two values.",
        substitution: "X1 = (13×2 + 0) mod 64 = 26 mod 64 = 26",
        calculation: "X2 = (13×26 + 0) mod 64 = 338 mod 64 = 18",
      },
      {
        step: 3,
        title: "Calculate X3 and X4",
        explanation: "Continue generating sequence.",
        substitution: "X3 = (13×18 + 0) mod 64 = 234 mod 64 = 42",
        calculation: "X4 = (13×42 + 0) mod 64 = 546 mod 64 = 34",
      },
      {
        step: 4,
        title: "Calculate X5 to X8",
        explanation: "Complete the cycle until repetition.",
        calculation: "X5 = (13×34) mod 64 = 58, X6 = (13×58) mod 64 = 50, X7 = (13×50) mod 64 = 10, X8 = (13×10) mod 64 = 2",
      },
      {
        step: 5,
        title: "Determine period",
        explanation: "Period is the number of unique values before X0 repeats.",
        calculation: "Sequence: 2 → 26 → 18 → 42 → 34 → 58 → 50 → 10 → 2",
        finalAnswer: "Period = 8 (8 unique values before repetition)",
        whyThisStep: "When X8 = X0 = 2, the cycle repeats. Period = 8.",
      },
    ],
  },
  {
    id: "3-2",
    year: "2024",
    question: "Generate two random failure times given failure rate (1/6) and random numbers R1=0.38, R2=0.45.",
    marks: 5,
    unit: 3,
    topic: "Exponential Variate Generation",
    difficulty: "Medium",
    type: "numerical",
    youtubeUrl: "https://www.youtube.com/watch?v=QrcbgIMiVBg",
    steps: [
      {
        step: 1,
        title: "Identify distribution",
        explanation: "Failure times follow exponential distribution with failure rate λ = 1/6.",
        formula: "X = (-1/λ) × ln(R)",
        whyThisStep: "Inverse transform method generates exponential variates from uniform random numbers.",
      },
      {
        step: 2,
        title: "Generate first failure time (X1)",
        explanation: "Apply formula with R1 = 0.38.",
        substitution: "X1 = (-1/(1/6)) × ln(0.38) = -6 × ln(0.38)",
        calculation: "ln(0.38) = -0.9676, X1 = -6 × (-0.9676) = 5.8056 ≈ 5.81",
        finalAnswer: "First failure time = 5.81 time units",
      },
      {
        step: 3,
        title: "Generate second failure time (X2)",
        explanation: "Apply formula with R2 = 0.45.",
        substitution: "X2 = (-1/(1/6)) × ln(0.45) = -6 × ln(0.45)",
        calculation: "ln(0.45) = -0.7985, X2 = -6 × (-0.7985) = 4.791 ≈ 4.79",
        finalAnswer: "Second failure time = 4.79 time units",
      },
    ],
  },
  {
    id: "3-3",
    year: "2023",
    question: "Write the steps for K-S test for Uniformity of random numbers.",
    marks: 5,
    unit: 3,
    topic: "K-S Test",
    difficulty: "Medium",
    type: "theoretical",
    answer: "Steps for Kolmogorov-Smirnov Test for Uniformity: 1) Sort random numbers in ascending order. 2) Calculate empirical CDF: Fn(x) = i/n for i-th sorted value. 3) Calculate theoretical CDF: F(x) = x for Uniform(0,1). 4) Find D+ = max(Fn(xi) - F(xi)) and D- = max(F(xi) - Fn(xi-1)). 5) Test statistic D = max(D+, D-). 6) Compare D with critical value at significance level α. 7) If D ≤ critical value, accept uniformity.",
  },
  {
    id: "3-4",
    year: "2024",
    question: "Explain Acceptance-Rejection method.",
    marks: 5,
    unit: 3,
    topic: "Acceptance-Rejection Method",
    difficulty: "Medium",
    type: "theoretical",
    answer: "Acceptance-Rejection Method generates random variates from complex distributions using a simpler proposal distribution. Steps: 1) Choose proposal distribution g(x) that is easy to sample from. 2) Find constant M such that f(x) ≤ M×g(x) for all x. 3) Generate X from g(x). 4) Generate U from Uniform(0,1). 5) If U ≤ f(X)/(M×g(X)), accept X; else reject and repeat. Used when inverse transform is difficult or unavailable.",
  },

  // Unit 4 PYQs
  {
    id: "4-1",
    year: "2023",
    question: "A component having exponential time to failure distribution is recorded. Determine the maximum-likelihood estimator.",
    marks: 5,
    unit: 4,
    topic: "Maximum Likelihood Estimation",
    difficulty: "PYQ Level",
    type: "numerical",
    youtubeUrl: "https://www.youtube.com/watch?v=XepXtl9YKwc",
    data: {
      failures: [7.319, 4.561, 5.287, 6.142, 0.971, 20.182, 18.152, 3.723, 14.584, 30.764, 10.496, 11.236, 45.855, 23.865],
    },
    steps: [
      {
        step: 1,
        title: "Write likelihood function",
        explanation: "For exponential distribution f(x) = λe^(-λx), the likelihood of observing n data points is L(λ) = ∏ λe^(-λxi).",
        formula: "L(λ) = λ^n e^(-λΣxi)",
        whyThisStep: "MLE finds the value of λ that maximizes the probability of observing the given data.",
      },
      {
        step: 2,
        title: "Take log-likelihood",
        explanation: "Convert to log form for easier differentiation.",
        formula: "ln L(λ) = n ln(λ) - λΣxi",
        substitution: "n = 14 (number of failures), Σxi = sum of failure times",
      },
      {
        step: 3,
        title: "Calculate sum of failure times",
        explanation: "Add all 14 observed failure times.",
        substitution: "7.319 + 4.561 + 5.287 + 6.142 + 0.971 + 20.182 + 18.152 + 3.723 + 14.584 + 30.764 + 10.496 + 11.236 + 45.855 + 23.865",
        calculation: "Σxi = 203.137",
      },
      {
        step: 4,
        title: "Differentiate and solve",
        explanation: "Set derivative of log-likelihood to zero to find maximum.",
        formula: "d/dλ [ln L(λ)] = n/λ - Σxi = 0",
        substitution: "14/λ - 203.137 = 0 → 14/λ = 203.137",
        calculation: "λ = 14/203.137 = 0.0689",
        finalAnswer: "MLE λ̂ = 0.0689 (mean time to failure = 1/λ = 14.51)",
        whyThisStep: "Setting derivative to zero gives the maximum likelihood estimate.",
      },
    ],
  },
  {
    id: "4-2",
    year: "2023",
    question: "Fitting an AR (1) model to data of patrons staying at a hotel.",
    marks: 10,
    unit: 4,
    topic: "AR(1) Model",
    difficulty: "PYQ Level",
    type: "numerical",
    steps: [
      {
        step: 1,
        title: "Calculate mean",
        explanation: "X̄ = ΣXi / n",
        formula: "μ̂ = X̄",
        whyThisStep: "AR(1) model requires estimating mean μ.",
      },
      {
        step: 2,
        title: "Calculate autocovariance",
        explanation: "Covariance at lag 0 and lag 1.",
        formula: "γ0 = Σ(Xi - X̄)²/n, γ1 = Σ(Xi - X̄)(Xi+1 - X̄)/n",
      },
      {
        step: 3,
        title: "Estimate φ",
        explanation: "φ = γ1/γ0",
        formula: "φ̂ = γ1/γ0",
        finalAnswer: "AR(1) model: Xn = μ̂ + φ̂(Xn-1 - μ̂) + εn",
      },
    ],
  },
  {
    id: "4-3",
    year: "2023",
    question: "Applying Chi-Square test to manufacturing defects data to test if the underlying distribution is Poisson, using level of significance α=0.05.",
    marks: 10,
    unit: 4,
    topic: "Chi-Square Goodness-of-Fit Test",
    difficulty: "PYQ Level",
    type: "numerical",
    steps: [
      {
        step: 1,
        title: "State hypotheses",
        explanation: "H0: Data follows Poisson distribution, H1: Data does not follow Poisson.",
        whyThisStep: "Chi-square test requires null and alternative hypotheses.",
      },
      {
        step: 2,
        title: "Estimate λ",
        explanation: "λ̂ = sample mean = Σ(xi × fi) / Σfi",
        formula: "λ̂ = X̄",
      },
      {
        step: 3,
        title: "Calculate expected frequencies",
        explanation: "Ei = n × P(X=xi) where P uses Poisson with λ̂.",
        formula: "Ei = n × (λ̂^xi e^(-λ̂))/xi!",
      },
      {
        step: 4,
        title: "Calculate chi-square statistic",
        explanation: "χ² = Σ(Oi - Ei)²/Ei",
        formula: "χ² = Σ(Oi - Ei)²/Ei",
      },
      {
        step: 5,
        title: "Compare with critical value",
        explanation: "Find χ²crit with df = k - p - 1 (k: categories, p: parameters estimated).",
        finalAnswer: "If χ² ≤ χ²crit, accept H0 (Poisson fit).",
      },
    ],
  },

  // Unit 5 PYQs
  {
    id: "5-1",
    year: "2023",
    question: "What is Type 1 error and Type 2 error in context of model validation? What is power of test?",
    marks: 5,
    unit: 5,
    topic: "Type 1 and Type 2 Errors",
    difficulty: "Medium",
    type: "theoretical",
    answer: "Type 1 Error (False Positive): Rejecting a true null hypothesis. Probability = α (significance level). In model validation: concluding model is invalid when it's actually valid. Type 2 Error (False Negative): Failing to reject a false null hypothesis. Probability = β. In model validation: accepting model as valid when it's actually invalid. Power of Test: Probability of correctly rejecting a false null hypothesis. Power = 1 - β. Higher power means better ability to detect invalid models.",
  },
  {
    id: "5-2",
    year: "2023",
    question: "Explain initialization bias in steady state simulation.",
    marks: 5,
    unit: 5,
    topic: "Initialization Bias",
    difficulty: "Medium",
    type: "theoretical",
    answer: "Initialization bias occurs when simulation output is affected by the starting conditions. In steady-state simulation, initial conditions may not represent steady-state, causing early output to be biased. Solutions: 1) Warm-up period: discard initial data before steady-state is reached. 2) Use representative initial conditions from real system. 3) Replicate with different seeds and average. 4) Use batch means method after warm-up. Critical for accurate steady-state performance estimation.",
  },
  {
    id: "5-3",
    year: "2024",
    question: "Explain Verification in Simulation.",
    marks: 5,
    unit: 5,
    topic: "Verification",
    difficulty: "Medium",
    type: "theoretical",
    answer: "Verification is the process of determining if the simulation model is implemented correctly (debugging). It answers: 'Is the model built right?' Methods: 1) Code review by experts. 2) Trace/Debug: step through model execution. 3) Check model behavior with known inputs/outputs. 4) Animation/visualization to observe behavior. 5) Compare with simplified analytical solutions. 6) Sensitivity analysis to check response to parameter changes. Verification ensures the computer model matches the conceptual model.",
  },
  {
    id: "5-4",
    year: "2024",
    question: "Explain Input modeling.",
    marks: 5,
    unit: 4,
    topic: "Input Modeling",
    difficulty: "Medium",
    type: "theoretical",
    answer: "Input modeling is the process of developing probability distributions that represent real system inputs. Steps: 1) Data collection: gather relevant input data. 2) Identify distribution: use histograms, Q-Q plots to suggest candidate distributions. 3) Parameter estimation: use MLE or method of moments. 4) Goodness-of-fit tests: Chi-square, K-S test to validate fit. 5) Select best-fitting distribution. Good input models are critical for valid simulation results.",
  },
  {
    id: "5-5",
    year: "2024",
    question: "Multi-variate and time series models.",
    marks: 20,
    unit: 4,
    topic: "Multivariate and Time Series Models",
    difficulty: "Hard",
    type: "theoretical",
    answer: "Multivariate Input Models: Model multiple correlated input variables simultaneously. Use covariance matrix, correlation matrix, copulas, or multivariate normal distribution. Important when inputs are not independent. Time Series Models: Model data with temporal correlation. AR(1): Xn = μ + φ(Xn-1 - μ) + εn for autocorrelated data. EAR(1): Exponential autoregressive for positive correlation. GAM/GEM: Generalized autoregressive models. NORTA: Normal-to-Anything transformation. Critical for realistic simulation of correlated inputs.",
  },
];

// Get PYQs by unit
export const getPYQsByUnit = (unit: number): PYQ[] => {
  return pyqData.filter((pyq) => pyq.unit === unit);
};

// Get PYQs by topic
export const getPYQsByTopic = (topic: string): PYQ[] => {
  return pyqData.filter((pyq) => pyq.topic.toLowerCase().includes(topic.toLowerCase()));
};

// Get PYQs by difficulty
export const getPYQsByDifficulty = (difficulty: string): PYQ[] => {
  return pyqData.filter((pyq) => pyq.difficulty === difficulty);
};

// Get high weightage topics (based on marks and frequency)
export const getHighWeightageTopics = (): { topic: string; totalMarks: number; frequency: number }[] => {
  const topicMap: Record<string, { totalMarks: number; frequency: number }> = {};

  pyqData.forEach((pyq) => {
    if (!topicMap[pyq.topic]) {
      topicMap[pyq.topic] = { totalMarks: 0, frequency: 0 };
    }
    topicMap[pyq.topic].totalMarks += pyq.marks;
    topicMap[pyq.topic].frequency += 1;
  });

  return Object.entries(topicMap)
    .map(([topic, data]) => ({ topic, ...data }))
    .sort((a, b) => b.totalMarks - a.totalMarks);
};
