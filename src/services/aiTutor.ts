// Fallback explanations for common topics
const fallbackExplanations: Record<string, string> = {
  "monte carlo": "Monte Carlo Simulation is a computational technique that uses random sampling to obtain numerical results. It relies on repeated random sampling to simulate the behavior of complex systems. Key steps: 1) Define problem domain, 2) Generate random inputs, 3) Perform deterministic computations, 4) Aggregate results. Used in finance, physics, engineering, and risk analysis.",
  "type 1 error": "Type 1 Error (False Positive) occurs when we reject a true null hypothesis. Probability = α (significance level). In model validation: concluding model is invalid when it's actually valid. To minimize, use lower significance level, but this increases Type 2 error risk.",
  "type 2 error": "Type 2 Error (False Negative) occurs when we fail to reject a false null hypothesis. Probability = β. In model validation: accepting model as valid when it's actually invalid. To minimize, increase sample size or use more sensitive tests.",
  "power of test": "Power of Test is the probability of correctly rejecting a false null hypothesis. Power = 1 - β. Higher power means better ability to detect invalid models. Aim for power ≥ 0.8. Increase sample size or effect size to improve power.",
  "ks test": "Kolmogorov-Smirnov Test checks if data follows a specified distribution. Steps: 1) Sort data, 2) Calculate empirical CDF, 3) Calculate theoretical CDF, 4) Find D = max|Fn(x) - F(x)|, 5) Compare with critical value. If D ≤ critical, accept distribution. Used for continuous distributions.",
  "mle": "Maximum Likelihood Estimation finds parameters that maximize probability of observed data. Steps: 1) Write likelihood function L(θ|data), 2) Take log for easier differentiation, 3) Differentiate and set to zero, 4) Solve for parameters. Used for parameter estimation in input modeling.",
  "lcg": "Linear Congruential Generator: Xn+1 = (aXn + c) mod m. Parameters: multiplier (a), increment (c), modulus (m), seed (X0). Period depends on parameters. For full period (m), need: c and m relatively prime, a-1 divisible by all prime factors of m, a-1 divisible by 4 if m divisible by 4.",
  "covariance": "Covariance measures linear relationship between two variables: Cov(X,Y) = E[(X-μX)(Y-μY)]. Positive: move together, Negative: move opposite, Zero: independent. Not normalized - depends on variable scales.",
  "correlation": "Correlation normalizes covariance to [-1,1]: ρ = Cov(X,Y)/(σXσY). 1: perfect positive linear, -1: perfect negative linear, 0: no linear relationship. Scale-independent, easier to interpret than covariance.",
  "initialization bias": "Initialization bias occurs when simulation output is affected by starting conditions. In steady-state simulation, initial conditions may not represent steady-state. Solutions: 1) Warm-up period (discard initial data), 2) Use representative initial conditions, 3) Replicate with different seeds, 4) Use batch means after warm-up.",
  "ar1": "AR(1) Model: Xn = μ + φ(Xn-1 - μ) + εn, where εn ~ N(0,σ²). Used for time series with autocorrelation. Estimate φ = γ1/γ0 (autocorrelation at lag 1). Stationary if |φ| < 1. EAR(1) is exponential version for positively correlated data.",
  "chi square": "Chi-Square Goodness-of-Fit Test checks if data fits theoretical distribution. Steps: 1) State H0: data follows distribution, 2) Estimate parameters, 3) Calculate expected frequencies, 4) Compute χ² = Σ(Oi-Ei)²/Ei, 5) Compare with critical value. Used for discrete distributions or binned continuous data.",
  "exponential": "Exponential Distribution: f(x) = λe^(-λx) for x≥0. Memoryless: P(X > s+t | X > s) = P(X > t). Mean = 1/λ, Variance = 1/λ². Used for inter-arrival times, failure times. Generate using inverse transform: X = (-1/λ)ln(U).",
  "poisson": "Poisson Distribution: P(X=k) = (λ^k e^(-λ))/k!. Models count of rare events in fixed interval. Mean = Variance = λ. Used for defect counts, arrivals. If inter-arrival times are exponential(λ), counts are Poisson(λ).",
  "acceptance rejection": "Acceptance-Rejection Method generates variates from complex distributions. Steps: 1) Choose easy proposal distribution g(x), 2) Find M where f(x) ≤ Mg(x), 3) Generate X from g(x), 4) Generate U~Uniform(0,1), 5) If U ≤ f(X)/(Mg(X)), accept X; else reject. Used when inverse transform unavailable.",
  "inverse transform": "Inverse Transform Method: X = F^(-1)(U) where U~Uniform(0,1). Requires invertible CDF. Steps: 1) Find CDF F(x), 2) Solve x = F^(-1)(u), 3) Generate U, 4) Compute X. Used for exponential, uniform, triangular distributions. Simple and efficient when inverse available.",
  "verification": "Verification checks if model is implemented correctly (debugging). Methods: code review, trace/debug, animation, compare with analytical solutions, sensitivity analysis. Answers: 'Is model built right?' Different from validation which checks accuracy.",
  "validation": "Validation checks if model accurately represents reality. Methods: face validity (expert review), sensitivity analysis, input-output validation (compare with real data), Turing test (experts compare outputs). Answers: 'Is model right?' Critical for credible results.",
  "discrete event": "Discrete-Event Simulation models systems where state changes at discrete time points. Key components: entities (customers), attributes (properties), events (state changes), state variables (system state). Event list schedules future events. Clock advances to next event (next-event time advance).",
  "queue": "Queuing systems model waiting lines. Components: arrival process, service mechanism, queue discipline (FIFO, LIFO, priority), system capacity. Performance measures: average waiting time, utilization, throughput, queue length. Kendall notation: A/B/c (arrival/service/servers).",
};

// Copy text to clipboard with fallback
async function copyToClipboard(text: string): Promise<{ success: boolean; message: string }> {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: "Prompt copied to clipboard!" };
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return { success: false, message: "Could not copy prompt to clipboard. You'll need to copy it manually." };
  }
}

// Open ChatGPT with prompt
export async function openChatGPT(prompt: string): Promise<{ success: boolean; message: string }> {
  // Copy prompt to clipboard first
  const copyResult = await copyToClipboard(prompt);

  // Open ChatGPT in new tab
  const chatGPTUrl = "https://chatgpt.com/";
  const opened = window.open(chatGPTUrl, "_blank");

  if (!opened) {
    return { success: false, message: "Popup blocked. Please allow popups or manually open ChatGPT." };
  }

  return copyResult;
}

export async function getAIExplanation(query: string, context?: string, simpleMode: boolean = false): Promise<string> {
  // Build the prompt for ChatGPT
  const basePrompt = `You are an expert tutor for Modeling and Simulation course (TY IT, Mumbai University).`;

  const modePrompt = simpleMode
    ? `Explain this concept in TWO WAYS:
1. ORIGINAL SOLUTION: Give the proper, exam-focused explanation with formulas, steps, and technical details. This is what you'd write in an exam.
2. 5-YEAR-OLD EXPLANATION: Explain the same concept using simple analogies, everyday examples, and very basic language. Like explaining to a child who has never seen this before.

Use headings to separate the two explanations clearly.`
    : `Keep answers concise and exam-focused. Focus on key formulas, steps, and exam-relevant explanations. Avoid unnecessary theory.`;

  const prompt = `${basePrompt}

${modePrompt}

Context: ${context || "Modeling and Simulation syllabus"}

Query: ${query}

Please provide the explanation.`;

  // Open ChatGPT with the prompt
  const result = await openChatGPT(prompt);

  // Return a message to the user
  return result.success
    ? "ChatGPT has been opened in a new tab with your prompt! The prompt has been copied to your clipboard. Paste it in ChatGPT to get the explanation."
    : `ChatGPT opened. ${result.message}`;
}

function getFallbackExplanation(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Find matching fallback
  for (const [key, explanation] of Object.entries(fallbackExplanations)) {
    if (lowerQuery.includes(key)) {
      return explanation;
    }
  }

  // Generic fallback
  return "I'm having trouble connecting to the AI service. Here's a general approach: For this topic, focus on understanding the key formula, knowing when to apply it, and practicing with numerical examples. Check the concept explanations in the app for detailed information.";
}

export async function explainNumerical(question: string, simpleMode: boolean = false): Promise<string> {
  // Build the prompt for ChatGPT
  const basePrompt = `You are an expert tutor for Modeling and Simulation numerical problems.`;

  const modePrompt = simpleMode
    ? `Explain this problem in TWO WAYS:
1. ORIGINAL SOLUTION: Step-by-step in exam format - Identify distribution, state formula, show substitution, calculate, state final answer.
2. 5-YEAR-OLD EXPLANATION: Explain what's happening using simple analogies and everyday language. Like explaining a math problem to a child.

Use headings to separate the two explanations clearly.`
    : `Explain this problem step-by-step in exam format:
1. Identify the distribution/concept
2. State the relevant formula
3. Show substitution of values
4. Calculate the result
5. State the final answer clearly

Keep it concise and match exam answer writing style.`;

  const prompt = `${basePrompt}

${modePrompt}

Question: ${question}

Please provide the solution.`;

  // Open ChatGPT with the prompt
  const result = await openChatGPT(prompt);

  // Return a message to the user
  return result.success
    ? "ChatGPT has been opened in a new tab with your question! The prompt has been copied to your clipboard. Paste it in ChatGPT to get the step-by-step solution."
    : `ChatGPT opened. ${result.message}`;
}

export async function simplifyConcept(concept: string): Promise<string> {
  // Build the prompt for ChatGPT
  const prompt = `Simplify this Modeling and Simulation concept for a student:
- Use simple language
- Focus on practical understanding
- Include when/why it's used
- Keep it under 100 words

Concept: ${concept}

Please explain this simply.`;

  // Open ChatGPT with the prompt
  const result = await openChatGPT(prompt);

  // Return a message to the user
  return result.success
    ? "ChatGPT has been opened in a new tab with your concept! The prompt has been copied to your clipboard. Paste it in ChatGPT to get a simple explanation."
    : `ChatGPT opened. ${result.message}`;
}
