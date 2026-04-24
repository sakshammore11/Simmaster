export interface Formula {
  id: string;
  concept: string;
  formula: string;
  meaning: string;
  unit: number;
}

export const formulasData: Formula[] = [
  // UNIT 1: QUEUING MODELS
  {
    id: "1-1",
    concept: "Traffic Intensity (Utilization Factor)",
    formula: "ρ = λ/μ",
    meaning: "λ = Arrival rate (customers per unit time), μ = Service rate (customers served per unit time), ρ = Utilization factor. ρ < 1 means system is stable, ρ ≥ 1 means queue will grow infinitely.",
    unit: 1,
  },
  {
    id: "1-2",
    concept: "M/M/1: Probability of n Customers",
    formula: "Pn = (1-ρ)ρⁿ",
    meaning: "Pn = Probability of n customers in system, ρ = Traffic intensity. System must be stable (ρ < 1).",
    unit: 1,
  },
  {
    id: "1-3",
    concept: "M/M/1: Average Number in System",
    formula: "L = λ/(μ-λ)",
    meaning: "L = Average number in system, λ = Arrival rate, μ = Service rate. Includes both waiting and being served customers.",
    unit: 1,
  },
  {
    id: "1-4",
    concept: "M/M/1: Average Number in Queue",
    formula: "Lq = λ²/(μ(μ-λ))",
    meaning: "Lq = Average number in queue, λ = Arrival rate, μ = Service rate. Only waiting customers, not those being served.",
    unit: 1,
  },
  {
    id: "1-5",
    concept: "M/M/1: Average Time in System",
    formula: "W = 1/(μ-λ)",
    meaning: "W = Average time in system, λ = Arrival rate, μ = Service rate. Includes waiting time + service time.",
    unit: 1,
  },
  {
    id: "1-6",
    concept: "M/M/1: Average Waiting Time in Queue",
    formula: "Wq = λ/(μ(μ-λ))",
    meaning: "Wq = Average waiting time in queue, λ = Arrival rate, μ = Service rate. Only waiting time, not service time.",
    unit: 1,
  },
  {
    id: "1-7",
    concept: "Little's Law",
    formula: "L = λW, Lq = λWq",
    meaning: "L = Average number in system, λ = Arrival rate, W = Average time in system. Customers in system = arrival rate × time spent.",
    unit: 1,
  },
  {
    id: "1-8",
    concept: "M/M/c: Multi-server Utilization",
    formula: "ρ = λ/(cμ)",
    meaning: "ρ = Utilization, λ = Arrival rate, c = Number of servers, μ = Service rate per server.",
    unit: 1,
  },
  {
    id: "1-9",
    concept: "M/M/c: Probability System Empty",
    formula: "P0 = [Σ(λ/μ)ⁿ/n! + (λ/μ)ᶜ/(c!(1-ρ))]⁻¹",
    meaning: "P0 = Probability system is empty, c = Number of servers, ρ = Utilization. Used to calculate other probabilities.",
    unit: 1,
  },
  {
    id: "1-10",
    concept: "M/M/c: Average Queue Length",
    formula: "Lq = P0(λ/μ)ᶜρ/(c!(1-ρ)²)",
    meaning: "Lq = Average queue length, P0 = Probability system empty, c = Number of servers, ρ = Utilization.",
    unit: 1,
  },
  {
    id: "1-11",
    concept: "M/M/c: Average Waiting Time",
    formula: "Wq = Lq/λ, W = Wq + 1/μ",
    meaning: "Wq = Average waiting time, W = Total time, Lq = Queue length, λ = Arrival rate, μ = Service rate.",
    unit: 1,
  },

  // UNIT 2: PROBABILITY DISTRIBUTIONS
  {
    id: "2-1",
    concept: "Bernoulli Distribution",
    formula: "P(X=x) = pˣ(1-p)¹⁻ˣ, E[X]=p, Var(X)=p(1-p)",
    meaning: "p = Probability of success, x = Outcome (0 or 1), E[X] = Expected value, Var(X) = Variance. Single trial with binary outcome.",
    unit: 2,
  },
  {
    id: "2-2",
    concept: "Binomial Distribution",
    formula: "P(X=k) = C(n,k)pᵏ(1-p)ⁿ⁻ᵏ, E[X]=np, Var(X)=np(1-p)",
    meaning: "n = Number of trials, k = Number of successes, p = Probability of success, C(n,k) = Combinations. Probability of k successes in n trials.",
    unit: 2,
  },
  {
    id: "2-3",
    concept: "Geometric Distribution",
    formula: "P(X=k) = (1-p)ᵏ⁻¹p, E[X]=1/p, Var(X)=(1-p)/p²",
    meaning: "k = Trial number of first success, p = Probability of success. Number of trials needed until first success.",
    unit: 2,
  },
  {
    id: "2-4",
    concept: "Poisson Distribution",
    formula: "P(X=k) = e⁻λλᵏ/k!, E[X]=λ, Var(X)=λ",
    meaning: "λ = Average number of events, k = Number of events, e = Euler's number. Probability of k events in fixed interval.",
    unit: 2,
  },
  {
    id: "2-5",
    concept: "Uniform Distribution (Continuous)",
    formula: "f(x) = 1/(b-a), E[X]=(a+b)/2, Var(X)=(b-a)²/12",
    meaning: "a = Minimum value, b = Maximum value, f(x) = PDF. All values in range equally likely.",
    unit: 2,
  },
  {
    id: "2-6",
    concept: "Exponential Distribution",
    formula: "f(x) = λe⁻λˣ, E[X]=1/λ, Var(X)=1/λ², F(x)=1-e⁻λˣ",
    meaning: "λ = Rate parameter, f(x) = PDF, F(x) = CDF. Time between events, memoryless property.",
    unit: 2,
  },
  {
    id: "2-7",
    concept: "Normal Distribution",
    formula: "f(x) = (1/σ√(2π))e^(-(x-μ)²/(2σ²)), Z = (X-μ)/σ",
    meaning: "μ = Mean, σ = Standard deviation, Z = Standard score. Bell-shaped distribution, natural phenomena.",
    unit: 2,
  },
  {
    id: "2-8",
    concept: "Triangular Distribution",
    formula: "E[X]=(a+b+c)/3",
    meaning: "a = Minimum, b = Maximum, c = Most likely value. Used when exact distribution unknown but range known.",
    unit: 2,
  },
  {
    id: "2-9",
    concept: "Poisson Process",
    formula: "P(N(t)=k) = e⁻λᵗ(λt)ᵏ/k!",
    meaning: "N(t) = Number of events in time t, λ = Rate. Counts events over time.",
    unit: 2,
  },

  // UNIT 3: RANDOM NUMBERS
  {
    id: "3-1",
    concept: "Linear Congruential Generator (LCG)",
    formula: "Xn+1 = (aXn + c) mod m, Un = Xn/m",
    meaning: "Xn = Current number, a = Multiplier, c = Increment, m = Modulus, Un = Uniform random number. Generates pseudo-random numbers.",
    unit: 3,
  },
  {
    id: "3-2",
    concept: "Multiplicative Generator",
    formula: "Xn+1 = (aXn) mod m",
    meaning: "Xn = Current number, a = Multiplier, m = Modulus. Faster than mixed LCG but shorter period.",
    unit: 3,
  },
  {
    id: "3-3",
    concept: "Inverse Transform Method",
    formula: "X = F⁻¹(R)",
    meaning: "F⁻¹ = Inverse CDF, R = Uniform random number. Convert uniform random to required distribution.",
    unit: 3,
  },
  {
    id: "3-4",
    concept: "Exponential Variate",
    formula: "X = (-1/λ)ln(1-R) or X = (-1/λ)ln(R)",
    meaning: "λ = Rate parameter, R = Uniform random number, ln = Natural log. Generate random time between events.",
    unit: 3,
  },
  {
    id: "3-5",
    concept: "Acceptance-Rejection",
    formula: "Accept if R₂ ≤ f(x)/(c g(x))",
    meaning: "f(x) = Target distribution, g(x) = Proposal distribution, c = Scaling constant, R₂ = Uniform random number.",
    unit: 3,
  },

  // UNIT 4: INPUT MODELING
  {
    id: "4-1",
    concept: "Sample Mean",
    formula: "X̄ = (1/n)ΣXi",
    meaning: "X̄ = Sample mean, Xi = Data points, n = Sample size. Average of collected data.",
    unit: 4,
  },
  {
    id: "4-2",
    concept: "Sample Variance",
    formula: "S² = (1/(n-1))Σ(Xi-X̄)²",
    meaning: "S² = Sample variance, Xi = Data points, X̄ = Sample mean, n = Sample size. Spread of data.",
    unit: 4,
  },
  {
    id: "4-3",
    concept: "Covariance",
    formula: "Cov(X,Y) = E[(X-μX)(Y-μY)]",
    meaning: "X,Y = Variables, μX,μY = Means, E = Expected value. How two variables change together.",
    unit: 4,
  },
  {
    id: "4-4",
    concept: "Correlation",
    formula: "ρ = Cov(X,Y)/(σX σY)",
    meaning: "ρ = Correlation coefficient, Cov = Covariance, σX,σY = Standard deviations. Strength of relationship (-1 to +1).",
    unit: 4,
  },
  {
    id: "4-5",
    concept: "AR(1) Model",
    formula: "Xt = φXt-1 + εt",
    meaning: "Xt = Current value, Xt-1 = Previous value, φ = Dependency factor, εt = Random error. Current value depends on previous.",
    unit: 4,
  },
  {
    id: "4-6",
    concept: "EAR(1) Model",
    formula: "Xt = φXt-1 + εt (Exponential noise)",
    meaning: "Xt = Current value, Xt-1 = Previous value, φ = Dependency factor, εt = Exponential noise. For correlated exponential data.",
    unit: 4,
  },

  // UNIT 5: OUTPUT ANALYSIS
  {
    id: "5-1",
    concept: "Confidence Interval",
    formula: "X̄ ± t(α/2,n-1)(S/√n)",
    meaning: "X̄ = Sample mean, t = t-value, S = Standard deviation, n = Sample size. Range where true value lies.",
    unit: 5,
  },
  {
    id: "5-2",
    concept: "Batch Means Method",
    formula: "Ȳi = (1/m)Σj=1ᵐ Xij",
    meaning: "Ȳi = Batch mean, m = Batch size, Xij = Data points. Divide data into batches to reduce randomness.",
    unit: 5,
  },
  {
    id: "5-3",
    concept: "Standard Error",
    formula: "SE = S/√n",
    meaning: "SE = Standard error, S = Standard deviation, n = Sample size. Accuracy of sample mean.",
    unit: 5,
  },
  {
    id: "5-4",
    concept: "Chi-Square Test",
    formula: "χ² = Σ(Oi-Ei)²/Ei",
    meaning: "Oi = Observed frequency, Ei = Expected frequency. Testing goodness-of-fit.",
    unit: 5,
  },
  {
    id: "5-5",
    concept: "Kolmogorov-Smirnov Test",
    formula: "D = max|Fn(x)-F(x)|",
    meaning: "D = Test statistic, Fn = Empirical CDF, F = Theoretical CDF. Testing goodness-of-fit for continuous distributions.",
    unit: 5,
  },
];
