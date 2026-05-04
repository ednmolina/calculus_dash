import { useEffect, useMemo, useRef, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { diagnosticAnswerNotes, diagnosticQuestions, diagnosticSolutions } from './diagnostic_questions.js'
import { firebaseEnabled, subscribeToDashboard, syncDashboardToFirebase } from './firebase.js'

const STORAGE_KEY = 'ap-calc-tutoring-dashboard-v6'
const CLIENT_ID_KEY = 'ap-calc-dashboard-client-id'
const DASHBOARD_QUERY_PARAM = 'dashboard'
const orderedDiagnosticQuestions = [...diagnosticQuestions].sort((a, b) => a.id - b.id)

const statusDateFields = {
  taught: 'taughtAt',
  knows: 'knowsAt',
  reviewed: 'reviewedAt',
}

const unitStatusDateFields = {
  taught: 'taughtAt',
  practiced: 'practicedAt',
  reviewed: 'reviewedAt',
}

const parentFunctions = {
  sin: { label: 'sin(x)', body: 'sin', defaultWindow: ['-2*pi', '2*pi', -3, 3] },
  cos: { label: 'cos(x)', body: 'cos', defaultWindow: ['-2*pi', '2*pi', -3, 3] },
  quadratic: { label: 'x²', body: 'square', defaultWindow: [-8, 8, -8, 12] },
  absolute: { label: '|x|', body: 'abs', defaultWindow: [-8, 8, -3, 12] },
  root: { label: '√x', body: 'sqrt', defaultWindow: [-2, 12, -4, 8] },
  cubic: { label: 'x³', body: 'cube', defaultWindow: [-5, 5, -10, 10] },
}

const skillTypes = [
  { id: 'conceptual', label: 'Conceptual understanding', example: 'Knows what derivative/integral means.' },
  { id: 'procedural', label: 'Procedural fluency', example: 'Can execute chain rule, u-sub, series tests.' },
  { id: 'modeling', label: 'Application modeling', example: 'Can set up related rates, optimization, motion.' },
  { id: 'graphs', label: 'Graph interpretation', example: "Can reason from graphs of f, f', or f''." },
  { id: 'frq', label: 'FRQ writing/justification', example: 'Can justify with MVT, IVT, FTC, signs, units.' },
  { id: 'calculator', label: 'Calculator fluency', example: 'Can use graphing calculator appropriately.' },
  { id: 'timed', label: 'Timed performance', example: 'Can do it under AP exam pressure.' },
]

const skillScale = [
  'Not introduced',
  'Introduced',
  'Can do with help',
  'Can do independently',
  'Mixed AP-style ready',
  'Exam-ready under time',
]

const errorTypes = ['Algebra slip', 'Concept gap', 'Misread prompt', 'Notation issue', 'Calculator issue', 'Time pressure', 'FRQ justification']

const defaultSessions = [
  {
    id: 'session-1',
    date: '2026-04-20',
    focus: 'Related rates setup and implicit differentiation',
    win: 'Identified variables and rates more consistently.',
    next: 'Timed related-rates set plus correction pass.',
  },
]

const defaultMistakes = [
  { id: 'mistake-1', type: 'FRQ justification', topic: 'Related rates', note: 'Needs to state units and explain why derivative sign matters.' },
  { id: 'mistake-2', type: 'Concept gap', topic: 'Implicit differentiation', note: 'Forgets chain rule on y-terms.' },
]

const defaultMasteryGoal = {
  start: new Date(2026, 3, 24, 12),
  endDate: '2026-09-30',
}

const defaultGraphState = {
  expression: 'sin(x)',
  xMin: -4,
  xMax: 4,
  yMin: -10,
  yMax: 10,
  showDerivative: true,
  showIntegral: true,
  approxMethod: 'none',
  approxN: 6,
  approxA: -2,
  approxB: 2,
  eulerY0: 1,
  transformParent: 'sin',
  transformParams: { a: 1, b: 1, h: 0, k: 0 },
}

const apUnits = [
  {
    id: 'u1',
    unit: 'Unit 1',
    title: 'Limits and Continuity',
    path: 'AB/BC',
    abWeight: '10-12%',
    bcWeight: '4-7%',
    concepts: [
      'Estimating limits from graphs/tables',
      'Algebraic limits: factoring, rationalizing, trig limits',
      'One-sided limits and discontinuities',
      'Continuity at a point and on an interval',
      'Infinite limits and vertical asymptotes',
      'Limits at infinity and horizontal asymptotes',
      'Intermediate Value Theorem',
    ],
  },
  {
    id: 'u2',
    unit: 'Unit 2',
    title: 'Differentiation: Definition and Basic Rules',
    path: 'AB/BC',
    abWeight: '10-12%',
    bcWeight: '4-7%',
    concepts: [
      'Average vs. instantaneous rate of change',
      'Definition of derivative',
      'Tangent and normal lines',
      'Power, constant multiple, sum/difference rules',
      'Derivatives of exponential functions',
      'Product and quotient rules',
      'Derivatives of sine, cosine, tangent, cotangent, secant, cosecant',
    ],
  },
  {
    id: 'u3',
    unit: 'Unit 3',
    title: 'Composite, Implicit, and Inverse Differentiation',
    path: 'AB/BC',
    abWeight: '9-13%',
    bcWeight: '4-7%',
    concepts: [
      'Chain rule',
      'Implicit differentiation',
      'Derivatives of inverse functions',
      'Derivatives of inverse trigonometric functions',
      'Selecting derivative techniques',
      'Higher-order derivatives',
      'Logarithmic differentiation',
    ],
  },
  {
    id: 'u4',
    unit: 'Unit 4',
    title: 'Contextual Applications of Differentiation',
    path: 'AB/BC',
    abWeight: '10-15%',
    bcWeight: '6-9%',
    concepts: [
      'Derivatives as rates of change in context',
      'Position, velocity, acceleration',
      'Speed vs. velocity',
      'Related rates',
      'Local linearity and linearization',
      'Differentials',
      "L'Hopital's Rule",
    ],
  },
  {
    id: 'u5',
    unit: 'Unit 5',
    title: 'Analytical Applications of Differentiation',
    path: 'AB/BC',
    abWeight: '15-18%',
    bcWeight: '8-11%',
    concepts: [
      'Mean Value Theorem',
      'Extreme Value Theorem',
      'Critical points',
      'Increasing/decreasing intervals',
      'First Derivative Test',
      'Concavity and inflection points',
      'Second Derivative Test',
      'Curve sketching',
      'Optimization',
    ],
  },
  {
    id: 'u6',
    unit: 'Unit 6',
    title: 'Integration and Accumulation of Change',
    path: 'AB/BC',
    abWeight: '17-20%',
    bcWeight: '17-20%',
    concepts: [
      'Antiderivatives and indefinite integrals',
      'Definite integrals as signed area',
      'Riemann sums and summation notation',
      'Trapezoidal approximation',
      'Fundamental Theorem of Calculus, Part 1',
      'Fundamental Theorem of Calculus, Part 2',
      'Accumulation functions',
      'Net change theorem',
      'Definite integral properties',
      'Integration by substitution',
      'Long division before integrating rational functions',
      'Integration by parts',
      'Partial fractions',
      'Improper integrals',
      'Choosing an integration technique',
    ],
  },
  {
    id: 'u7',
    unit: 'Unit 7',
    title: 'Differential Equations',
    path: 'AB/BC',
    abWeight: '6-12%',
    bcWeight: '6-9%',
    concepts: [
      'Slope fields',
      'Verifying solutions',
      'Separable differential equations',
      'Particular solutions',
      'Exponential growth and decay',
      'Logistic growth',
      "Euler's method",
    ],
  },
  {
    id: 'u8',
    unit: 'Unit 8',
    title: 'Applications of Integration',
    path: 'AB/BC',
    abWeight: '10-15%',
    bcWeight: '6-9%',
    concepts: [
      'Average value of a function',
      'Particle motion using integrals',
      'Accumulation in applied contexts',
      'Area between curves',
      'Volume by cross sections',
      'Disk method',
      'Washer method',
      'Volume around non-axis lines',
      'Arc length of a function',
    ],
  },
  {
    id: 'u9',
    unit: 'Unit 9',
    title: 'Parametric, Polar, and Vector-Valued Functions',
    path: 'BC only',
    abWeight: 'N/A',
    bcWeight: '11-12%',
    concepts: [
      'Parametric derivatives',
      'Second derivatives for parametric curves',
      'Parametric area',
      'Parametric arc length',
      'Polar coordinates and graph interpretation',
      'Polar slope',
      'Polar area',
      'Polar arc length',
      'Vector-valued position, velocity, acceleration',
      'Vector-valued speed, distance, and displacement',
    ],
  },
  {
    id: 'u10',
    unit: 'Unit 10',
    title: 'Infinite Sequences and Series',
    path: 'BC only',
    abWeight: 'N/A',
    bcWeight: '17-18%',
    concepts: [
      'Sequence convergence',
      'Geometric series',
      'Harmonic and p-series',
      'Comparison and limit comparison tests',
      'Alternating series test and error bound',
      'Ratio test',
      'Absolute vs. conditional convergence',
      'Taylor polynomials',
      'Lagrange error bound',
      'Power series radius and interval of convergence',
      'Taylor/Maclaurin series',
      'Using series to approximate values',
    ],
  },
]

const unitDiagnosticLinks = orderedDiagnosticQuestions
  .filter((question) => question.difficulty === 'easy')
  .reduce((links, question) => {
    const hardQuestion = orderedDiagnosticQuestions.find((candidate) => candidate.concept === question.concept && candidate.difficulty === 'hard')
    return {
      ...links,
      [question.unitId]: [...(links[question.unitId] || []), { id: question.id, hardId: hardQuestion?.id, label: question.concept }],
    }
  }, {})

const defaultStudent = {
  name: '',
  course: 'AP Calculus BC',
  targetScore: '5',
  diagnosticScore: 58,
  recentScore: 76,
  frqScore: 70,
  mcqAccuracy: 79,
  homeworkCompletion: 86,
  confidence: 3,
  attendance: 100,
  thisWeek: 'Implicit differentiation, related rates setup, and interpreting derivative graphs.',
  improvedIn: 'Identifying changing quantities and choosing the correct derivative rule.',
  currentFocus: 'Translate word problems into equations before differentiating.',
  practiceAssigned: '12 related-rates problems with corrections required.',
  parentSupport: 'Ask the student to explain what each variable means before solving.',
  nextSessionPlan: 'Timed related-rates set, then short FRQ justification practice.',
  notes:
    'Strong improvement on limits, continuity, and core derivative rules. Current priority: mixed application problems, especially translating word problems into equations and justifying answers with units.',
}

const blankStudent = {
  name: '',
  course: 'AP Calculus BC',
  targetScore: '5',
  diagnosticScore: 0,
  recentScore: 0,
  frqScore: 0,
  mcqAccuracy: 0,
  homeworkCompletion: 0,
  confidence: 0,
  attendance: 0,
  thisWeek: '',
  improvedIn: '',
  currentFocus: '',
  practiceAssigned: '',
  parentSupport: '',
  nextSessionPlan: '',
  notes: '',
}

function sanitizeDashboardId(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function getDashboardIdFromUrl() {
  if (typeof window === 'undefined') return ''

  try {
    const url = new URL(window.location.href)
    return sanitizeDashboardId(url.searchParams.get(DASHBOARD_QUERY_PARAM))
  } catch {
    return ''
  }
}

function syncDashboardIdToUrl(dashboardId) {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (dashboardId) {
    url.searchParams.set(DASHBOARD_QUERY_PARAM, dashboardId)
  } else {
    url.searchParams.delete(DASHBOARD_QUERY_PARAM)
  }

  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

function getClientId() {
  if (typeof window === 'undefined') return 'server'

  const existing = window.localStorage.getItem(CLIENT_ID_KEY)
  if (existing) return existing

  const next = `client-${Math.random().toString(36).slice(2, 10)}`
  window.localStorage.setItem(CLIENT_ID_KEY, next)
  return next
}

function normalizeDashboardSnapshot(saved = {}, fallbackDashboardId = '') {
  const snapshot = saved?.state && typeof saved.state === 'object' ? saved.state : saved

  return {
    dashboardId: sanitizeDashboardId(snapshot?.dashboardId || fallbackDashboardId),
    student: { ...defaultStudent, ...(snapshot?.student || {}) },
    progress: hydrateProgress(snapshot?.progress),
    skillRatings: createDefaultSkillRatings(snapshot?.skillRatings),
    sessions: Array.isArray(snapshot?.sessions) ? snapshot.sessions : defaultSessions,
    mistakes: Array.isArray(snapshot?.mistakes) ? snapshot.mistakes : defaultMistakes,
    diagnosticResponses: snapshot?.diagnosticResponses || {},
    timeline: {
      goalEndDate: snapshot?.timeline?.goalEndDate || defaultMasteryGoal.endDate,
    },
    graph: {
      ...defaultGraphState,
      ...(snapshot?.graph || {}),
    },
  }
}

function buildDashboardSnapshot({
  dashboardId,
  student,
  progress,
  skillRatings,
  sessions,
  mistakes,
  diagnosticResponses,
  masteryEndDate,
  expression,
  xMin,
  xMax,
  yMin,
  yMax,
  showDerivative,
  showIntegral,
  approxMethod,
  approxN,
  approxA,
  approxB,
  eulerY0,
  transformParent,
  transformParams,
}) {
  return {
    dashboardId,
    student,
    progress,
    skillRatings,
    sessions,
    mistakes,
    diagnosticResponses,
    timeline: { goalEndDate: masteryEndDate },
    graph: { expression, xMin, xMax, yMin, yMax, showDerivative, showIntegral, approxMethod, approxN, approxA, approxB, eulerY0, transformParent, transformParams },
  }
}

function getSyncStatusCopy(syncStatus, dashboardId) {
  if (!dashboardId) return 'Local-only mode. Add a shared dashboard ID to turn on live sync.'
  if (!firebaseEnabled) return 'Firebase config is missing. Add .env locally or GitHub Secrets for deployed builds.'

  switch (syncStatus) {
    case 'connecting':
      return 'Connecting to Firestore...'
    case 'ready':
      return 'Connected. This dashboard is ready to sync.'
    case 'saving':
      return 'Saving changes to Firestore...'
    case 'live':
      return 'Live sync is active. Other open sessions on the same dashboard ID should update automatically.'
    case 'error':
      return 'Firestore sync failed. Check your Firebase config and Firestore rules.'
    default:
      return 'Local-only mode. Add a shared dashboard ID to turn on live sync.'
  }
}

const tutorKpis = [
  {
    field: 'diagnosticScore',
    label: 'Diagnostic baseline',
    unit: '%',
    source: 'Enter the score from the first full diagnostic, unit test, or baseline AP-style set.',
    cadence: 'Update rarely. This is the starting point for measuring growth.',
    use: 'Use it to show improvement from where the student began.',
  },
  {
    field: 'recentScore',
    label: 'Recent practice benchmark',
    unit: '%',
    source: 'Enter the latest mixed AP-style practice score, not a single easy worksheet.',
    cadence: 'Update after each scored practice set or mock section.',
    use: 'This is the cleanest current performance signal.',
  },
  {
    field: 'frqScore',
    label: 'FRQ writing average',
    unit: '%',
    source: 'Convert recent FRQ rubric points to a percent. Example: 6/9 = 67%.',
    cadence: 'Update when you grade FRQs with an AP-style rubric.',
    use: 'Tracks setup, notation, justification, units, and explanation quality.',
  },
  {
    field: 'mcqAccuracy',
    label: 'MCQ accuracy',
    unit: '%',
    source: 'Enter correct multiple-choice questions divided by total attempted.',
    cadence: 'Update after timed or mixed MCQ sets.',
    use: 'Shows whether the student can recognize methods quickly and avoid traps.',
  },
  {
    field: 'homeworkCompletion',
    label: 'Corrected practice completion',
    unit: '%',
    source: 'Use completed-and-corrected work, not just work attempted.',
    cadence: 'Update weekly.',
    use: 'Tracks follow-through between tutoring sessions.',
  },
  {
    field: 'attendance',
    label: 'Session consistency',
    unit: '%',
    source: 'Use attended sessions divided by scheduled sessions.',
    cadence: 'Update monthly or when sessions are missed.',
    use: 'Helps separate performance issues from consistency issues.',
  },
]

const theoremInfo = {
  ftc1: {
    title: 'FTC Part 1',
    visual: 'accumulation',
    text: 'An accumulation function adds area from a fixed start to x. The rate that accumulated area changes is the height of the curve at x.',
    layperson: 'Plain English: if you track how area is piling up, the slope of that area total is just the curve height right there.',
    example: 'If A(x) = ∫₂ˣ sin(t) dt, then A′(x) = sin(x).',
    takeaway: 'Derivative of accumulated area gives back the original function.',
  },
  ftc2: {
    title: 'FTC Part 2',
    visual: 'net-area',
    text: 'A definite integral measures signed area over an interval. If F is an antiderivative of f, subtracting F(a) from F(b) gives that net area.',
    layperson: 'Plain English: total area can be found by checking how much the antiderivative changed from start to finish.',
    example: '∫₁³ 2x dx = [x²]₁³ = 9 − 1 = 8.',
    takeaway: 'Area on [a,b] equals antiderivative change.',
  },
  average: {
    title: 'Average Value',
    visual: 'average',
    text: 'The average value is the constant height that would make the same total area over the interval.',
    layperson: 'Plain English: it is the flat height that would give the same area as the curvy graph.',
    example: 'For f(x) = x² on [0,3], average value is (1/3)∫₀³ x² dx = 3.',
    takeaway: 'Average height = area divided by interval width.',
  },
  netChange: {
    title: 'Net Change',
    visual: 'net-change',
    text: "Integrating a rate of change tells how much the original quantity changed from a to b.",
    layperson: 'Plain English: if you add up all the tiny changes, you get the total change.',
    example: 'If v(t) is velocity, then ∫₀⁵ v(t) dt gives displacement.',
    takeaway: 'Integral of a rate = total change.',
  },
  ivt: {
    title: 'Intermediate Value Theorem',
    visual: 'ivt',
    text: 'If a function is continuous, it cannot jump over y-values. Between f(a) and f(b), every intermediate height must happen somewhere.',
    layperson: 'Plain English: an unbroken curve cannot skip a height between where it starts and ends.',
    example: 'If f is continuous, f(1) = 2, and f(4) = 9, then f(c) = 5 for some c in (1,4).',
    takeaway: 'Continuity guarantees a crossing.',
  },
  mvt: {
    title: 'Mean Value Theorem',
    visual: 'mvt',
    text: 'For a smooth continuous curve, at some point the instantaneous slope equals the average slope over the whole interval.',
    layperson: 'Plain English: somewhere on the trip, your exact speed matched your average speed.',
    example: 'If position changes from 10 to 70 miles in 2 hours, then at some time velocity was 30 mph.',
    takeaway: 'Some tangent line matches the secant slope.',
  },
  evt: {
    title: 'Extreme Value Theorem',
    visual: 'evt',
    text: 'A continuous function on a closed interval must actually reach both an absolute maximum and an absolute minimum.',
    layperson: 'Plain English: on a complete unbroken interval, the graph has a highest and lowest point.',
    example: 'To find an absolute max on [a,b], check critical points and endpoints.',
    takeaway: 'Closed interval plus continuity guarantees extrema.',
  },
  lhopital: {
    title: "L'Hopital's Rule",
    visual: 'lhopital',
    text: 'When a quotient has an indeterminate form like 0/0 or infinity/infinity, compare the rates of change of the numerator and denominator.',
    layperson: 'Plain English: when direct substitution is unclear, compare how fast the top and bottom are changing.',
    example: 'lim as x→0 of sin(x)/x becomes lim as x→0 of cos(x)/1 = 1.',
    takeaway: 'For valid indeterminate forms, use derivative ratio to evaluate the limit.',
  },
  unitCircle: {
    title: 'Unit Circle',
    visual: 'unit-circle',
    text: 'The unit circle has radius 1. Every point on it is written as (cos θ, sin θ), so the x-coordinate is cosine and the y-coordinate is sine.',
    layperson: 'Plain English: cosine tells left/right movement, sine tells up/down movement.',
    example: 'At θ = π/6, the point is (√3/2, 1/2), so cos(π/6)=√3/2 and sin(π/6)=1/2.',
    takeaway: 'Memory trick: for 0, π/6, π/4, π/3, π/2, sine goes √0/2, √1/2, √2/2, √3/2, √4/2. Cosine is the same list backward.',
  },
}

const referenceGuide = [
  {
    tag: 'Unit 2–3',
    title: 'Derivative Rules',
    items: [
      { label: 'Power rule', markdown: String.raw`(x^n)' = nx^{n-1}` },
      { label: 'Product rule', markdown: String.raw`(fg)' = f'g + fg'` },
      { label: 'Quotient rule', markdown: String.raw`\!\left(\tfrac{f}{g}\right)' = \tfrac{f'g - fg'}{g^2}` },
      { label: 'Chain rule', markdown: String.raw`[f(g(x))]' = f'(g(x))\cdot g'(x)` },
    ],
  },
  {
    tag: 'Unit 2–3',
    title: 'Key Derivatives',
    items: [
      { label: 'sin x', markdown: String.raw`(\sin x)' = \cos x` },
      { label: 'cos x', markdown: String.raw`(\cos x)' = -\sin x` },
      { label: 'tan x', markdown: String.raw`(\tan x)' = \sec^2 x` },
      { label: 'eˣ', markdown: String.raw`(e^x)' = e^x` },
      { label: 'ln x', markdown: String.raw`(\ln x)' = 1/x` },
      { label: 'aˣ', markdown: String.raw`(a^x)' = a^x \ln a` },
    ],
  },
  {
    tag: 'Unit 5',
    title: 'Derivative Analysis',
    items: [
      { label: 'Increasing', markdown: String.raw`f'(x) > 0 \Rightarrow f \text{ is increasing}` },
      { label: 'Decreasing', markdown: String.raw`f'(x) < 0 \Rightarrow f \text{ is decreasing}` },
      { label: 'Concave up', markdown: String.raw`f''(x) > 0 \Rightarrow f \text{ is concave up}` },
      { label: 'Concave down', markdown: String.raw`f''(x) < 0 \Rightarrow f \text{ is concave down}` },
      { label: 'Critical point', markdown: String.raw`f'(c) = 0 \text{ or } f'(c) \text{ is undefined}` },
      { label: 'Inflection point', markdown: String.raw`f'' \text{ changes sign at } c` },
    ],
  },
  {
    tag: 'Unit 6',
    title: 'Integration Rules',
    items: [
      { label: 'Power rule', markdown: String.raw`\int x^n\,\mathrm{d}x = \frac{x^{n+1}}{n+1}+C,\quad n\ne -1` },
      { label: 'Exponential', markdown: String.raw`\int e^x\,\mathrm{d}x = e^x+C` },
      { label: 'Sine', markdown: String.raw`\int \sin x\,\mathrm{d}x = -\cos x+C` },
      { label: 'Cosine', markdown: String.raw`\int \cos x\,\mathrm{d}x = \sin x+C` },
      { label: 'Reciprocal', markdown: String.raw`\int \frac{1}{x}\,\mathrm{d}x = \ln|x|+C` },
    ],
  },
  {
    tag: 'Unit 6',
    title: 'Fundamental Theorem',
    items: [
      { label: 'FTC Part 1', markdown: String.raw`\frac{\mathrm{d}}{\mathrm{d}x}\left[\int_a^x f(t)\,\mathrm{d}t\right] = f(x)`, info: theoremInfo.ftc1 },
      { label: 'FTC Part 2', markdown: String.raw`\int_a^b f(x)\,\mathrm{d}x = F(b)-F(a)`, info: theoremInfo.ftc2 },
      { label: 'Average value', markdown: String.raw`f_{\text{avg}} = \frac{1}{b-a}\int_a^b f(x)\,\mathrm{d}x`, info: theoremInfo.average },
      { label: 'Net change', markdown: String.raw`\int_a^b f'(x)\,\mathrm{d}x = f(b)-f(a)`, info: theoremInfo.netChange },
    ],
  },
  {
    tag: 'Unit 1 / Unit 4',
    title: 'Key Theorems',
    items: [
      { label: 'IVT', markdown: String.raw`f \text{ continuous on } [a,b] \Rightarrow f \text{ hits every value between } f(a) \text{ and } f(b)`, info: theoremInfo.ivt },
      { label: 'MVT', markdown: String.raw`f'(c)=\frac{f(b)-f(a)}{b-a} \text{ for some } c\in(a,b)`, info: theoremInfo.mvt },
      { label: 'EVT', markdown: String.raw`f \text{ continuous on } [a,b] \Rightarrow f \text{ has an absolute max and min}`, info: theoremInfo.evt },
      { label: "L'Hopital", markdown: String.raw`\lim_{x\to a}\frac{f(x)}{g(x)}=\lim_{x\to a}\frac{f'(x)}{g'(x)} \text{ for } \frac{0}{0} \text{ or } \frac{\infty}{\infty}`, info: theoremInfo.lhopital },
    ],
  },
  {
    tag: 'Trig',
    title: 'Unit Circle',
    items: [
      { label: 'Coordinates', markdown: String.raw`(\cos\theta,\sin\theta)`, info: theoremInfo.unitCircle },
      { label: 'Quadrantal angles', markdown: String.raw`0:(1,0),\quad \frac{\pi}{2}:(0,1),\quad \pi:(-1,0),\quad \frac{3\pi}{2}:(0,-1)` },
      { label: 'Special angle pattern', markdown: String.raw`\sin\theta,\cos\theta \in \left\{0,\frac{1}{2},\frac{\sqrt2}{2},\frac{\sqrt3}{2},1\right\}` },
      { label: 'Tangent', markdown: String.raw`\tan\theta=\frac{\sin\theta}{\cos\theta}` },
      { label: 'Pythagorean identity', markdown: String.raw`\sin^2\theta+\cos^2\theta=1` },
      { label: 'Periodicity', markdown: String.raw`\sin(\theta+2\pi)=\sin\theta,\quad \cos(\theta+2\pi)=\cos\theta` },
    ],
  },
  {
    tag: 'Functions',
    title: 'Odd and Even Functions',
    items: [
      { label: 'Even test', markdown: String.raw`f(-x)=f(x)` },
      { label: 'Even symmetry', markdown: String.raw`\text{symmetric about the } y\text{-axis}` },
      { label: 'Even examples', markdown: String.raw`x^2,\ |x|,\ \cos x` },
      { label: 'Odd test', markdown: String.raw`f(-x)=-f(x)` },
      { label: 'Odd symmetry', markdown: String.raw`\text{symmetric about the origin}` },
      { label: 'Odd examples', markdown: String.raw`x^3,\ x,\ \sin x` },
    ],
  },
  {
    tag: 'Unit 10 — BC only',
    title: 'Series Quick Facts',
    items: [
      { label: 'Geometric series', markdown: String.raw`\sum_{n=0}^{\infty} ar^n = \frac{a}{1-r},\quad |r|<1` },
      { label: 'p-series', markdown: String.raw`\sum_{n=1}^{\infty}\frac{1}{n^p} \text{ converges when } p>1` },
      { label: 'Taylor series', markdown: String.raw`f(x)=\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}(x-a)^n` },
      { label: 'e^x series', markdown: String.raw`e^x = 1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots` },
      { label: 'sin x series', markdown: String.raw`\sin x = x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots` },
      { label: 'cos x series', markdown: String.raw`\cos x = 1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots` },
    ],
  },
  {
    tag: 'Unit 8',
    title: 'Volumes — Disk & Washer',
    items: [
      { label: 'Disk (x-axis)', markdown: String.raw`V = \pi\int_a^b [f(x)]^2\,dx` },
      { label: 'Disk (y-axis)', markdown: String.raw`V = \pi\int_c^d [g(y)]^2\,dy` },
      { label: 'Washer (x-axis)', markdown: String.raw`V = \pi\int_a^b \left([R(x)]^2-[r(x)]^2\right)dx` },
      { label: 'Washer (y-axis)', markdown: String.raw`V = \pi\int_c^d \left([R(y)]^2-[r(y)]^2\right)dy` },
      { label: 'Key idea', markdown: String.raw`R = \text{outer radius},\quad r = \text{inner radius}` },
    ],
  },
  {
    tag: 'Unit 8',
    title: 'Volumes — Shell Method',
    items: [
      { label: 'Shell (x-axis rotation)', markdown: String.raw`V = 2\pi\int_a^b x\,f(x)\,dx` },
      { label: 'Shell (y-axis rotation)', markdown: String.raw`V = 2\pi\int_c^d y\,g(y)\,dy` },
      { label: 'Key idea', markdown: String.raw`\text{Shell: } 2\pi \cdot \text{radius} \cdot \text{height} \cdot \Delta x` },
      { label: 'When to use', markdown: String.raw`\text{Shell when disk/washer requires } y = f(x) \to x = g(y)` },
    ],
  },
  {
    tag: 'Unit 8',
    title: 'Volumes — Known Cross-Sections',
    items: [
      { label: 'General setup', markdown: String.raw`V = \int_a^b A(x)\,dx \text{ where } A(x) = \text{cross-section area}` },
      { label: 'Square', markdown: String.raw`A(x) = [f(x)]^2` },
      { label: 'Rectangle (height h)', markdown: String.raw`A(x) = h \cdot f(x)` },
      { label: 'Semicircle', markdown: String.raw`A(x) = \tfrac{\pi}{8}[f(x)]^2` },
      { label: 'Equilateral triangle', markdown: String.raw`A(x) = \tfrac{\sqrt{3}}{4}[f(x)]^2` },
      { label: 'Right iso. triangle', markdown: String.raw`A(x) = \tfrac{1}{2}[f(x)]^2` },
    ],
  },
]

const foundationalFactSheets = [
  {
    tag: 'Algebra',
    title: 'Algebraic Manipulation & Equations',
    items: [
      { label: 'Exponents & radicals', concept: 'Know exponent rules inside and out.', formulas: [String.raw`(a^b)^c=a^{bc}`, String.raw`x^{-n}=\frac{1}{x^n}`, String.raw`x^{a/b}=(\sqrt[b]{x})^a`], trick: 'Power substitution: break huge powers into known blocks. Example: 2^26=(2^13)^2, so if 2^13≈8000, then square 8000.' },
      { label: 'Systems of linear equations', concept: 'Intersection of two lines means solving both equations at the same time.', formulas: [String.raw`\begin{aligned}-x+4y&=-50\\x+y&=20\end{aligned}`], trick: 'Elimination by addition: opposite coefficients cancel. Add vertically so the x terms disappear, leaving 5y=-30.' },
      { label: 'Rational equations', concept: 'A fraction equals zero only when its numerator equals zero.', formulas: [String.raw`\frac{(2x-3)(x+5)}{x-7}=0\Rightarrow(2x-3)(x+5)=0`], trick: 'For “fraction equals zero,” set only the top equal to zero. Still remember excluded denominator values.' },
      { label: 'Quadratic equations', concept: 'Use the quadratic formula after the equation is written in standard form.', formulas: [String.raw`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`], trick: 'Set to zero first. Rewrite 3x^2=4x+1 as 3x^2-4x-1=0 before identifying a, b, and c.' },
      { label: 'Factoring polynomials', concept: 'Memorize special factoring patterns.', formulas: [String.raw`a^2-b^2=(a-b)(a+b)`, String.raw`a^3-b^3=(a-b)(a^2+ab+b^2)`, String.raw`a^3+b^3=(a+b)(a^2-ab+b^2)`], trick: 'Factor theorem: if plugging b into a makes the expression 0, then (a-b) is a factor. Also, a^2+b^2 does not factor over the reals.' },
      { label: 'Logarithms', concept: 'A logarithm asks for an exponent.', formulas: [String.raw`\log_b(y)=x\Longleftrightarrow b^x=y`], trick: 'Base bump: log_2(x-6)=6 becomes 2^6=x-6.' },
      { label: 'Absolute value inequalities', concept: 'Absolute value measures distance.', formulas: [String.raw`|x-4|\le8\Longleftrightarrow -8\le x-4\le8`], trick: 'Distance translation: “x is at most 8 units from 4,” so the boundaries are -4 and 12.' },
    ],
  },
  {
    tag: 'Functions',
    title: 'Functions & Graphing',
    items: [
      { label: 'Evaluating functions', concept: 'f(x) means replace every x with the input.', formulas: [String.raw`f(n+1):\text{ substitute }(n+1)\text{ everywhere}`], trick: 'Parentheses protection: 5(n+1)=5n+5, not 5n+1.' },
      { label: 'Even and odd functions', concept: 'Even functions mirror over the y-axis; odd functions mirror through the origin.', formulas: [String.raw`f(-x)=f(x)\text{ even}`, String.raw`f(-x)=-f(x)\text{ odd}`], trick: 'Visual mirror: check symmetry first before doing algebra.' },
      { label: 'Linear graphs & slope', concept: 'Slope measures rise over run.', formulas: [String.raw`m=\frac{y_2-y_1}{x_2-x_1}`, String.raw`y=mx+b`], trick: 'Direction check: negative slope falls to the right.' },
      { label: 'Circles and conics', concept: 'A circle is defined by center and radius.', formulas: [String.raw`(x-h)^2+(y-k)^2=r^2`], trick: 'Completing the square reveals the center and radius from expanded equations.' },
      { label: 'Reading graphs', concept: 'Function notation translates directly to graph locations.', formulas: [String.raw`f(x)<0`], trick: 'Above or below: f(x)<0 means the graph is below the x-axis.' },
    ],
  },
  {
    tag: 'Geometry',
    title: 'Geometry & Real-World Applications',
    items: [
      { label: 'Coordinate distance', concept: 'Distance comes from the Pythagorean theorem.', formulas: [String.raw`a^2+b^2=c^2`], trick: 'Draw the triangle: count horizontal and vertical legs, then use Pythagorean theorem.' },
      { label: 'Area and perimeter word problems', concept: 'Translate dimensions into equations.', formulas: [String.raw`A=LW`, String.raw`P=2L+2W`], trick: 'Contextual rejection: discard negative lengths or widths from quadratic solutions.' },
      { label: 'Scaling area', concept: 'Area changes by the square of the scale factor.', formulas: [String.raw`\text{new area}=k^2(\text{old area})`], trick: 'If side lengths scale by 4, area scales by 16.' },
      { label: 'Surface area', concept: 'Surface area is the total area of every exposed face.', formulas: [String.raw`\text{SA}=\text{sum of face areas}`], trick: 'Inventory the faces. For a box, calculate top, bottom, and four sides separately, then add.' },
    ],
  },
  {
    tag: 'Trig',
    title: 'Trigonometry Foundations',
    items: [
      { label: 'Radians and degrees', concept: 'π radians equals 180 degrees.', formulas: [String.raw`\pi\text{ rad}=180^\circ`, String.raw`\text{degrees}\cdot\frac{\pi}{180}=\text{radians}`], trick: 'Multiply degrees by π/180 and simplify.' },
      { label: 'Reciprocal trig functions', concept: 'csc, sec, and cot are flipped versions of sin, cos, and tan.', formulas: [String.raw`\csc x=\frac1{\sin x}`, String.raw`\sec x=\frac1{\cos x}`, String.raw`\cot x=\frac1{\tan x}`], trick: 'Find and flip: csc(30°)=1/sin(30°)=2.' },
      { label: 'SOH CAH TOA', concept: 'Right-triangle trig ratios compare sides.', formulas: [String.raw`\sin=\frac{\text{opp}}{\text{hyp}}`, String.raw`\cos=\frac{\text{adj}}{\text{hyp}}`, String.raw`\tan=\frac{\text{opp}}{\text{adj}}`], trick: 'Two-step triangle: find the missing side first, then build the ratio.' },
      { label: 'Trig bounds', concept: 'Sine and cosine only range from -1 to 1.', formulas: [String.raw`-1\le\sin x\le1`, String.raw`-1\le\cos x\le1`], trick: 'Impossible equation: sin(x)=5 has no solution.' },
    ],
  },
]

function createEmptyProgress() {
  return Object.fromEntries(
    apUnits.map((unit) => [unit.id, createProgressRow(unit)]),
  )
}

function createProgressRow(unit, savedRow = {}) {
  const conceptProgress = Object.fromEntries(
    unit.concepts.map((concept) => {
      const savedConcept = savedRow.concepts?.[concept]
      const migratedKnows = typeof savedConcept === 'boolean' ? savedConcept : Boolean(savedConcept?.knows || savedRow.mastered)

      return [
        concept,
        {
          taught: typeof savedConcept === 'object' ? Boolean(savedConcept.taught) : Boolean(savedRow.taught),
          knows: migratedKnows,
          reviewed: typeof savedConcept === 'object' ? Boolean(savedConcept.reviewed) : Boolean(savedRow.reviewed),
          taughtAt: typeof savedConcept === 'object' ? savedConcept.taughtAt || null : null,
          knowsAt: typeof savedConcept === 'object' ? savedConcept.knowsAt || null : null,
          reviewedAt: typeof savedConcept === 'object' ? savedConcept.reviewedAt || null : null,
        },
      ]
    }),
  )
  const inferLatestConceptDate = (field) => {
    const dates = unit.concepts.map((concept) => validDate(conceptProgress[concept]?.[field])).filter(Boolean)
    return dates.length ? new Date(Math.max(...dates.map((date) => date.getTime()))).toISOString() : null
  }

  return {
    taught: Boolean(savedRow.taught),
    practiced: Boolean(savedRow.practiced),
    reviewed: Boolean(savedRow.reviewed),
    taughtAt: savedRow.taughtAt || (savedRow.taught ? inferLatestConceptDate('taughtAt') : null),
    practicedAt: savedRow.practicedAt || (savedRow.practiced ? inferLatestConceptDate('knowsAt') : null),
    reviewedAt: savedRow.reviewedAt || (savedRow.reviewed ? inferLatestConceptDate('reviewedAt') : null),
    quiz: savedRow.quiz || '',
    concepts: conceptProgress,
  }
}

function hydrateProgress(savedProgress = {}) {
  return Object.fromEntries(apUnits.map((unit) => [unit.id, createProgressRow(unit, savedProgress[unit.id])]))
}

function createDefaultSkillRatings(savedRatings = {}) {
  return Object.fromEntries(skillTypes.map((skill) => [skill.id, Number(savedRatings[skill.id] ?? 0)]))
}

function createParentSummary(student, metrics) {
  return [
    `This week, we worked on ${student.thisWeek}`,
    `The student is improving at ${student.improvedIn}`,
    `Current focus is ${student.currentFocus}`,
    `Assigned practice: ${student.practiceAssigned}`,
    `Parent support: ${student.parentSupport}`,
    `Next session plan: ${student.nextSessionPlan}`,
    `Readiness status: ${metrics.readinessStatus}.`,
  ].join('\n')
}

function loadDashboardState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function clampPercent(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.max(0, Math.min(100, Math.round(number)))
}

function completedConcepts(row, unit) {
  return unit.concepts.filter((concept) => row.concepts?.[concept]?.knows).length
}

function unitProgress(row, unit) {
  return clampPercent((completedConcepts(row, unit) / unit.concepts.length) * 100)
}

function unitHasLoggedActivity(row, unit) {
  if (!row) return false
  if (row.taught || row.practiced || row.reviewed || row.quiz) return true

  return unit.concepts.some((concept) => {
    const conceptRow = row.concepts?.[concept]
    return conceptRow?.taught || conceptRow?.knows || conceptRow?.reviewed
  })
}

function validDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatShortDate(value) {
  const date = validDate(value)
  if (!date) return 'Not logged'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatMonth(value) {
  const date = validDate(value)
  if (!date) return ''
  return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
}

function formatCompactDate(value) {
  const date = validDate(value)
  if (!date) return ''
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function dateInputToNoon(value, fallback) {
  if (!value) return fallback
  const [year, month, day] = String(value).split('-').map(Number)
  const date = new Date(year, month - 1, day, 12)
  return Number.isNaN(date.getTime()) ? fallback : date
}

function getConceptDates(row, unit) {
  return unit.concepts.flatMap((concept) => {
    const conceptRow = row.concepts?.[concept] || {}
    return [conceptRow.taughtAt, conceptRow.knowsAt, conceptRow.reviewedAt].map(validDate).filter(Boolean)
  })
}

function courseUnits(course) {
  if (course === 'AP Calculus AB') return apUnits.filter((u) => u.path === 'AB/BC')
  return apUnits // BC or Both includes all units
}

function buildTimeline(progress, goalEndDate = defaultMasteryGoal.endDate, course = 'AP Calculus BC') {
  const units = courseUnits(course)
  const fallbackEnd = dateInputToNoon(defaultMasteryGoal.endDate, new Date(2026, 8, 30, 12))
  const selectedEnd = dateInputToNoon(goalEndDate, fallbackEnd)
  const goal = {
    start: defaultMasteryGoal.start,
    end: selectedEnd > defaultMasteryGoal.start ? selectedEnd : fallbackEnd,
  }
  const goalSpan = goal.end.getTime() - goal.start.getTime()
  const unitPlanWindow = goalSpan / units.length
  const rows = units.map((unit) => {
    const row = progress[unit.id]
    const unitIndex = units.findIndex((candidate) => candidate.id === unit.id)
    const plannedStart = new Date(goal.start.getTime() + unitPlanWindow * unitIndex)
    const plannedEnd = unitIndex === units.length - 1 ? goal.end : new Date(goal.start.getTime() + unitPlanWindow * (unitIndex + 1))
    const dates = getConceptDates(row, unit)
    const score = unitProgress(row, unit)
    const start = dates.length ? new Date(Math.min(...dates.map((date) => date.getTime()))) : null
    const end = dates.length ? new Date(Math.max(...dates.map((date) => date.getTime()))) : null
    const expectedByToday =
      new Date() < plannedStart
        ? 0
        : new Date() > plannedEnd
          ? 100
          : clampPercent(((new Date().getTime() - plannedStart.getTime()) / (plannedEnd.getTime() - plannedStart.getTime())) * 100)
    const paceGap = score - expectedByToday

    return {
      unit,
      row,
      score,
      start,
      end,
      plannedStart,
      plannedEnd,
      expectedByToday,
      paceGap,
      paceHealth: paceGap >= -10 ? 'on-track' : paceGap >= -30 ? 'at-risk' : 'behind',
      taughtCount: unit.concepts.filter((concept) => row.concepts?.[concept]?.taught).length,
      knowsCount: completedConcepts(row, unit),
      reviewedCount: unit.concepts.filter((concept) => row.concepts?.[concept]?.reviewed).length,
      complete: score === 100,
    }
  })

  const datedRows = rows.filter((row) => row.start && row.end)
  const today = new Date()
  const minDate = datedRows.length
    ? new Date(Math.min(...datedRows.map((row) => row.start.getTime()), goal.start.getTime(), today.getTime()))
    : goal.start
  const maxDate = datedRows.length
    ? new Date(Math.max(...datedRows.map((row) => row.end.getTime()), goal.end.getTime(), today.getTime()))
    : goal.end
  const start = addDays(minDate, -7)
  const end = addDays(maxDate, 21)
  const span = Math.max(1, end.getTime() - start.getTime())
  const months = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)

  while (cursor <= end) {
    months.push(new Date(cursor))
    cursor.setMonth(cursor.getMonth() + 1)
  }

  const milestones = rows
    .map((row) => ({
      label: `${row.unit.unit} target`,
      date: row.plannedEnd,
      complete: row.complete,
      left: ((row.plannedEnd.getTime() - start.getTime()) / span) * 100,
    }))

  const completedConceptCount = rows.reduce((sum, row) => sum + row.knowsCount, 0)
  const totalConceptCount = units.reduce((sum, unit) => sum + unit.concepts.length, 0)
  const expectedOverall =
    today < goal.start
      ? 0
      : today > goal.end
        ? 100
        : clampPercent(((today.getTime() - goal.start.getTime()) / goalSpan) * 100)
  const actualOverall = clampPercent((completedConceptCount / totalConceptCount) * 100)

  return { rows, start, end, span, months, today, milestones, goal, expectedOverall, actualOverall, course, unitCount: units.length }
}

function normalizeExpression(expression) {
  let prepared = expression
    .toLowerCase()
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/\s+/g, '')
    .replace(/(\d|\)|x|pi|e)(?=(x|pi|e|\())/g, '$1*')
    .replace(/(\d|\)|x|pi|e)(?=(sin|cos|tan|asin|acos|atan|sqrt|abs|ln|log|exp)\()/g, '$1*')
    .replace(/(\))(?=\d)/g, '$1*')

  const identifiers = prepared.match(/[A-Za-z_]+/g) || []
  const allowed = new Set(['x', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'abs', 'ln', 'log', 'exp', 'pi', 'e'])

  for (const identifier of identifiers) {
    if (!allowed.has(identifier)) {
      throw new Error(`Unsupported token "${identifier}". Use x, trig, log/ln, sqrt, abs, exp, pi, or e.`)
    }
  }

  return prepared
    .replace(/\^/g, '**')
    .replace(/\bln\s*\(/g, 'Math.log(')
    .replace(/\blog\s*\(/g, 'Math.log10(')
    .replace(/\bsin\s*\(/g, 'Math.sin(')
    .replace(/\bcos\s*\(/g, 'Math.cos(')
    .replace(/\btan\s*\(/g, 'Math.tan(')
    .replace(/\basin\s*\(/g, 'Math.asin(')
    .replace(/\bacos\s*\(/g, 'Math.acos(')
    .replace(/\batan\s*\(/g, 'Math.atan(')
    .replace(/\bsqrt\s*\(/g, 'Math.sqrt(')
    .replace(/\babs\s*\(/g, 'Math.abs(')
    .replace(/\bexp\s*\(/g, 'Math.exp(')
    .replace(/\bpi\b/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E')
}

function createEvaluator(expression) {
  if (!/^[0-9A-Za-z_+\-*/^().,\sπ√]+$/.test(expression)) {
    throw new Error('Only numbers, x, π, common math functions, and arithmetic operators are supported.')
  }

  const jsExpression = normalizeExpression(expression)
  try {
    return new Function('x', `"use strict"; return (${jsExpression});`)
  } catch {
    throw new Error('The function has invalid syntax. Use complete expressions like sin(x), sqrt(x), abs(x), x^2, or 2*pi.')
  }
}

function parseScalar(value) {
  const evaluator = createEvaluator(String(value))
  const result = Number(evaluator(0))
  if (!Number.isFinite(result)) throw new Error(`Could not evaluate "${value}" as a number.`)
  return result
}

function sampleGraph(expression, xMin, xMax, yMin, yMax, samples = 220) {
  const f = createEvaluator(expression)
  const x0 = parseScalar(xMin)
  const x1 = parseScalar(xMax)
  const y0 = parseScalar(yMin)
  const y1 = parseScalar(yMax)

  if (![x0, x1, y0, y1].every(Number.isFinite)) throw new Error('Domain and range must be valid numbers.')
  if (x1 <= x0) throw new Error('x max must be greater than x min.')
  if (y1 <= y0) throw new Error('y max must be greater than y min.')

  const step = (x1 - x0) / (samples - 1)
  const h = Math.max(Math.abs(step) / 2, 0.0001)
  let accumulated = 0
  let previous = null

  return Array.from({ length: samples }, (_, index) => {
    const x = x0 + index * step
    const rawY = Number(f(x))
    const y = Number.isFinite(rawY) ? rawY : null
    const derivative = y === null ? null : (Number(f(x + h)) - Number(f(x - h))) / (2 * h)

    if (previous && y !== null) {
      accumulated += ((previous.y + y) / 2) * (x - previous.x)
    }

    if (y !== null) previous = { x, y }

    return {
      x,
      f: y,
      derivative: Number.isFinite(derivative) ? derivative : null,
      integral: Number.isFinite(accumulated) ? accumulated : null,
    }
  })
}

function buildPolyline(data, key, xMin, xMax, yMin, yMax, width, height) {
  const xScale = (x) => ((x - xMin) / (xMax - xMin)) * width
  const yScale = (y) => height - ((y - yMin) / (yMax - yMin)) * height
  const paths = []
  let current = []

  for (const point of data) {
    const value = point[key]
    if (value === null || value < yMin || value > yMax) {
      if (current.length > 1) paths.push(current)
      current = []
    } else {
      current.push(`${xScale(point.x).toFixed(2)},${yScale(value).toFixed(2)}`)
    }
  }

  if (current.length > 1) paths.push(current)
  return paths
}

function niceStep(range, targetTicks = 9) {
  const raw = Math.abs(range) / targetTicks
  if (!Number.isFinite(raw) || raw === 0) return 1
  const power = 10 ** Math.floor(Math.log10(raw))
  const scaled = raw / power
  const factor = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10
  return factor * power
}

function formatAxisNumber(value) {
  if (Math.abs(value) < 1e-10) return '0'
  if (Math.abs(value - Math.round(value)) < 1e-10) return String(Math.round(value))
  return Number(value.toFixed(3)).toString()
}

function formatPiTick(value) {
  if (Math.abs(value) < 1e-10) return '0'
  const ratio = value / Math.PI
  const denominators = [1, 2, 3, 4, 6]

  for (const denominator of denominators) {
    const numerator = Math.round(ratio * denominator)
    if (Math.abs(ratio - numerator / denominator) < 0.03) {
      if (numerator === 0) return '0'
      const sign = numerator < 0 ? '-' : ''
      const absNumerator = Math.abs(numerator)
      const coefficient = absNumerator === 1 ? '' : absNumerator
      return denominator === 1 ? `${sign}${coefficient}π` : `${sign}${coefficient}π/${denominator}`
    }
  }

  return formatAxisNumber(value)
}

function createAxisTicks(min, max, trigLabels = false) {
  const step = trigLabels ? Math.PI / 2 : niceStep(max - min)
  const first = Math.ceil(min / step) * step
  const ticks = []

  for (let value = first; value <= max + step * 0.25; value += step) {
    if (value >= min - step * 0.25) {
      ticks.push({
        value,
        label: trigLabels ? formatPiTick(value) : formatAxisNumber(value),
      })
    }
  }

  return ticks.slice(0, 16)
}

function createMinorTicks(min, max, majorTicks, subdivisions = 4) {
  if (majorTicks.length < 2) return []
  const majorStep = majorTicks[1].value - majorTicks[0].value
  const minorStep = majorStep / subdivisions
  const first = Math.ceil(min / minorStep) * minorStep
  const majorValues = new Set(majorTicks.map((tick) => tick.value.toFixed(8)))
  const ticks = []

  for (let value = first; value <= max + minorStep * 0.25; value += minorStep) {
    if (!majorValues.has(value.toFixed(8))) ticks.push(value)
  }

  return ticks.slice(0, 80)
}

function formatApproxMethod(method) {
  const labels = {
    left: 'Left Riemann sum',
    right: 'Right Riemann sum',
    midpoint: 'Midpoint Riemann sum',
    trapezoid: 'Trapezoid rule',
    euler: 'Euler method',
  }

  return labels[method] || 'No approximation'
}

function cleanParam(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0'
  return Number(number.toFixed(4)).toString()
}

function buildParentExpression(parentKey, params) {
  const parent = parentFunctions[parentKey]
  const a = Number(cleanParam(params.a))
  const b = Number(cleanParam(params.b)) || 1
  const h = Number(cleanParam(params.h))
  const k = Number(cleanParam(params.k))
  const inner = b === 1 && h === 0 ? 'x' : b === 1 ? `(x-${h})` : h === 0 ? `(${b}*x)` : `(${b}*(x-${h}))`
  const bodyByType = {
    sin: `sin(${inner})`,
    cos: `cos(${inner})`,
    square: `(${inner})^2`,
    abs: `abs(${inner})`,
    sqrt: `sqrt(${inner})`,
    cube: `(${inner})^3`,
  }
  const base = bodyByType[parent.body]
  const scaled = a === 1 ? base : a === -1 ? `-${base}` : `${a}*${base}`

  if (k === 0) return scaled
  return `${scaled}${k > 0 ? '+' : ''}${k}`
}

function transformationNotes(parentKey, params) {
  const a = Number(params.a)
  const b = Number(params.b)
  const h = Number(params.h)
  const k = Number(params.k)
  const notes = []

  notes.push(a < 0 ? 'reflects across the x-axis' : 'keeps the original vertical orientation')
  notes.push(Math.abs(a) === 1 ? 'no vertical stretch' : `vertical scale factor ${Math.abs(a)}`)
  notes.push(Math.abs(b) === 1 ? 'no horizontal stretch/compression' : `horizontal scale factor ${Number((1 / Math.abs(b)).toFixed(3))}`)
  notes.push(h === 0 ? 'no horizontal shift' : `${h > 0 ? 'right' : 'left'} ${Math.abs(h)} units`)
  notes.push(k === 0 ? 'no vertical shift' : `${k > 0 ? 'up' : 'down'} ${Math.abs(k)} units`)

  if (parentKey === 'sin' || parentKey === 'cos') {
    notes.push(`period = ${formatPiTick((2 * Math.PI) / Math.abs(b || 1))}`)
    notes.push(`phase shift = ${h}`)
  }

  return notes
}

function DashboardCard({ title, value, caption }) {
  return (
    <article className="metric-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{caption}</p>
    </article>
  )
}

function CheckboxField({ checked, children, onChange }) {
  return (
    <label className="check-field">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{children}</span>
    </label>
  )
}

function prettyDiagnosticText(value) {
  return String(value)
    .replace(/\bsqrt\(([^)]+)\)/g, '√($1)')
    .replace(/\bsqrt(\d+)/g, '√$1')
    .replace(/\bpi\b/g, 'π')
    .replace(/\binfinity\b/g, '∞')
    .replace(/<=/g, '≤')
    .replace(/>=/g, '≥')
    .replace(/\bdegrees\b/g, '°')
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    .replace(/\^4\b/g, '⁴')
    .replace(/\^-1\b/g, '⁻¹')
    .replace(/\^-3\b/g, '⁻³')
}

function toDiagnosticLatex(value) {
  let latex = String(value).trim()

  latex = latex
    .replace(/degrees/g, '^\\circ')
    .replace(/°/g, '^\\circ')
    .replace(/\binfinity\b/g, '\\infty')
    .replace(/∞/g, '\\infty')
    .replace(/\bpi\b/g, '\\pi')
    .replace(/π/g, '\\pi')
    .replace(/<=/g, '\\le')
    .replace(/>=/g, '\\ge')
    .replace(/\+-/g, '\\pm')
    .replace(/\*/g, '\\cdot ')
    // derivative fractions must come before general fraction rules
    .replace(/d\^2y\/dx\^2/g, '\\frac{d^{2}y}{dx^{2}}')
    .replace(/dr\/dtheta/g, '\\frac{dr}{d\\theta}')
    .replace(/dy\/dx/g, '\\frac{dy}{dx}')
    .replace(/dy\/dt/g, '\\frac{dy}{dt}')
    .replace(/dx\/dt/g, '\\frac{dx}{dt}')
    .replace(/d\/dx/g, '\\frac{d}{dx}')
    .replace(/d\/dt/g, '\\frac{d}{dt}')
    .replace(/d\/dy/g, '\\frac{d}{dy}')
    .replace(/\bsqrt\(([^)]+)\)/g, '\\sqrt{$1}')
    .replace(/\bsqrt(\d+)/g, '\\sqrt{$1}')
    // exponents: (expr) form first, then numeric, then letter
    .replace(/([A-Za-z0-9)}])\s*\^\s*\(([^)]+)\)/g, '$1^{$2}')
    .replace(/([A-Za-z0-9)}])\s*\^\s*(-?\d+)/g, '$1^{$2}')
    .replace(/([A-Za-z0-9)}])\s*\^\s*([A-Za-z][A-Za-z0-9]*)/g, '$1^{$2}')
    .replace(/([A-Za-z])_([A-Za-z0-9]+)/g, '$1_{$2}')
    .replace(/\bf\^-1\b/g, 'f^{-1}')
    .replace(/\blog_(\d+)\(/g, '\\log_{$1}(')
    .replace(/\bln\b/g, '\\ln')
    .replace(/\barcsin\b/g, '\\arcsin')
    .replace(/\barccos\b/g, '\\arccos')
    .replace(/\barctan\b/g, '\\arctan')
    .replace(/\bsin\b/g, '\\sin')
    .replace(/\bcos\b/g, '\\cos')
    .replace(/\btan\b/g, '\\tan')
    .replace(/\bcot\b/g, '\\cot')
    .replace(/\bcsc\b/g, '\\csc')
    .replace(/\bsec\b/g, '\\sec')
    .replace(/\blim\b/g, '\\lim')
    .replace(/->/g, '\\to')

  // fraction patterns — most specific first
  latex = latex
    // (a)/(b)^n  e.g. (x^2-1)/(x-1)^2
    .replace(/\(([^()]+)\)\/\(([^()]+)\)(\^[{]?[^}\s,]+[}]?|\^-?\d+)?/g, (_, n, d, exp) =>
      `\\frac{${n}}{${d}}${exp ?? ''}`)
    // whole-string simple fraction a/b
    .replace(/^([^/\s]+)\/([^/\s]+)$/g, '\\frac{$1}{$2}')
    // a/(b) inline  e.g. 1/(x+1)^2
    .replace(/([A-Za-z\d]+)\/\(([^()]+)\)(\^[{]?[^}\s,]+[}]?|\^-?\d+)?/g, (_, n, d, exp) =>
      `\\frac{${n}}{${d}}${exp ?? ''}`)
    // parenthesized numerator over simple denominator  e.g. (x^2)/2
    .replace(/\(([^()]+)\)\/(\d+)/g, '\\frac{$1}{$2}')
    // simple numeric fraction inline  e.g. 1/6, 3/2
    .replace(/(?<![A-Za-z\d])([-]?\d+)\/(\d+)(?![A-Za-z\d])/g, '\\frac{$1}{$2}')
    .replace(/(\d+)\\pi\/(\d+)/g, '\\frac{$1\\pi}{$2}')
    .replace(/(?<![A-Za-z])\\pi\/(\d+)/g, '\\frac{\\pi}{$1}')

  return latex
}

function renderDiagnosticLatex(value, displayMode = false) {
  return katex.renderToString(toDiagnosticLatex(value), {
    displayMode,
    throwOnError: false,
    strict: false,
  })
}

function DiagnosticMath({ value, displayMode = false }) {
  const html = renderDiagnosticLatex(value, displayMode)

  return <span className="diagnostic-math" dangerouslySetInnerHTML={{ __html: html }} />
}

// Detects math-dense spans in prose text and renders them via KaTeX.
// Covers: (a)/(b)^n fractions, exponents, sqrt, f'(x)/f''(x), dy/dx, pi, infinity, ->
const INLINE_MATH_RE =
  /(?:\([^()]*\)\s*\/\s*\([^()]*\)(?:\s*\^[({]?[^)\s,]+[)}]?)?|\([^()]*\)\s*\^[({]?[^)\s,]+[)}]?|[A-Za-z\d._]+\s*\^[({]?[A-Za-z\d.+\-*/^]+[)}]?|[A-Za-z]_[A-Za-z0-9]+|\bsqrt\s*\([^)]+\)|[A-Za-z]''\s*\([^)]*\)|[A-Za-z]'\s*\([^)]*\)|dr\/dtheta|d[yxf]?\/d[xyzt](?:\^2)?|\bpi\b|\binfinity\b|->|[A-Za-z\d]+\/[A-Za-z\d()^{}]+)/g

function DiagnosticMixedText({ value }) {
  const text = String(value)
  const parts = []
  let lastIndex = 0
  const inlineMathRe = new RegExp(INLINE_MATH_RE.source, 'g')
  let match
  while ((match = inlineMathRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={lastIndex}>{prettyDiagnosticText(text.slice(lastIndex, match.index))}</span>)
    }
    parts.push(<DiagnosticMath key={match.index} value={match[0]} />)
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(<span key={lastIndex}>{prettyDiagnosticText(text.slice(lastIndex))}</span>)
  }
  return <>{parts}</>
}

function DiagnosticRichText({ value }) {
  const text = String(value)
  const parts = text.split(/(\$[^$]+\$)/g)

  if (parts.length === 1) {
    return <DiagnosticMixedText value={text} />
  }

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          return <DiagnosticMath key={`${part}-${index}`} value={part.slice(1, -1)} />
        }
        return <DiagnosticMixedText key={`${part}-${index}`} value={part} />
      })}
    </>
  )
}

function studentDiagnosticPrompt(value) {
  return String(value)
    .replace(/\bBC Only\.\s*/g, '')
    .replace(/\bEasy:\s*/g, 'Part A. ')
    .replace(/\bHard:\s*/g, 'Part B. ')
}

function studentDiagnosticChoice(value) {
  return String(value)
    .replace(/\bEasy:\s*/g, '')
    .replace(/;\s*Hard:\s*/g, '; ')
    .replace(/\bHard:\s*/g, '')
}

function FormulaItem({ item }) {
  if (typeof item === 'string') return <li>{item}</li>
  const html = katex.renderToString(item.markdown, {
    displayMode: false,
    throwOnError: false,
    strict: false,
  })

  return (
    <li className="formula-item">
      <span className="formula-label">
        {item.label}
        {item.info && (
          <span className="theorem-info-wrap">
            <button aria-label={`Show visual explanation for ${item.info.title}`} className="info-button" type="button">
              i
            </button>
            <TheoremInfoCard info={item.info} />
          </span>
        )}
      </span>
      <div className="formula-render" dangerouslySetInnerHTML={{ __html: html }} />
    </li>
  )
}

function FactSheetCard({ sheet }) {
  return (
    <article className="fact-card">
      <div className="ref-card-header">
        <span className="ref-tag">{sheet.tag}</span>
        <strong>{sheet.title}</strong>
      </div>
      <div className="fact-list">
        {sheet.items.map((item) => (
          <article className="fact-item" key={item.label}>
            <h4>{item.label}</h4>
            <p>
              <b>Key concept:</b> {item.concept}
            </p>
            <div className="fact-formulas">
              {item.formulas.map((formula) => {
                const html = katex.renderToString(formula, {
                  displayMode: false,
                  throwOnError: false,
                  strict: false,
                })

                return <span dangerouslySetInnerHTML={{ __html: html }} key={formula} />
              })}
            </div>
            <p className="fact-trick">
              <b>Trick:</b> {item.trick}
            </p>
          </article>
        ))}
      </div>
    </article>
  )
}

function DiagnosticQuestionCard({ question, selectedAnswer, onSelect }) {
  const hasChoices = Array.isArray(question.choices) && question.choices.length > 0
  const sourceClass = question.source === 'File 1' ? 'source-blue' : question.source === 'File 2' ? 'source-green' : 'source-guide'

  return (
    <article className="diagnostic-card" id={`diagnostic-question-${question.id}`}>
      <div className="diagnostic-card-header">
        <span className={`question-number-badge ${sourceClass}`}>{question.id}</span>
        <strong>Question {question.id}</strong>
        <details className="diagnostic-hint">
          <summary aria-label={`Show hint for question ${question.id}`}>i</summary>
          <div>
            <b>Concept:</b> {question.concept}
            <p>{question.hint}</p>
          </div>
        </details>
      </div>
      <p className="diagnostic-prompt">
        <DiagnosticRichText value={studentDiagnosticPrompt(question.prompt)} />
      </p>
      {hasChoices ? (
        <div className="diagnostic-choices">
          {question.choices.map((choice, index) => {
            const letter = String.fromCharCode(97 + index)
            const isSelected = selectedAnswer === letter

            return (
              <button className={isSelected ? 'selected' : ''} key={choice} type="button" onClick={() => onSelect(question.id, letter)}>
                <span>{letter}.</span>
                <em><DiagnosticRichText value={studentDiagnosticChoice(choice)} /></em>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="diagnostic-choices diagnostic-status-choices">
          <button className={selectedAnswer === 'solved' ? 'correct' : ''} type="button" onClick={() => onSelect(question.id, 'solved')}>
            <span>OK</span>
            <em>Solved without help</em>
          </button>
          <button className={selectedAnswer === 'review' ? 'incorrect' : ''} type="button" onClick={() => onSelect(question.id, 'review')}>
            <span>!</span>
            <em>Flag for review</em>
          </button>
        </div>
      )}
      {hasChoices && selectedAnswer && (
        <p className="diagnostic-feedback selected">
          Answer saved. Results and worked steps are reviewed in Tutor/Admin.
        </p>
      )}
      {!hasChoices && selectedAnswer && (
        <p className={`diagnostic-feedback ${selectedAnswer === 'solved' ? 'correct' : 'incorrect'}`}>
          {selectedAnswer === 'solved' ? 'Marked solved. Worked solution remains tutor-only.' : 'Flagged for tutor review. Worked solution remains tutor-only.'}
        </p>
      )}
    </article>
  )
}

function buildDiagnosticSummary(responses) {
  const answeredQuestions = orderedDiagnosticQuestions.filter((question) => responses[question.id])
  const correctQuestions = answeredQuestions.filter((question) =>
    Array.isArray(question.choices) && question.choices.length > 0 ? responses[question.id] === question.answer : responses[question.id] === 'solved',
  )
  const missedQuestions = answeredQuestions.filter((question) =>
    Array.isArray(question.choices) && question.choices.length > 0 ? responses[question.id] !== question.answer : responses[question.id] === 'review',
  )
  const score = answeredQuestions.length ? clampPercent((correctQuestions.length / answeredQuestions.length) * 100) : 0

  return {
    answered: answeredQuestions.length,
    correct: correctQuestions.length,
    missed: missedQuestions,
    score,
    nextFocus: missedQuestions.slice(0, 6).map((question) => question.concept),
  }
}

function DiagnosticResultsSummary({ responses, summary, onClear }) {
  return (
    <section className="panel diagnostic-summary-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Saved diagnostic responses</p>
          <h2>Diagnostic Results</h2>
        </div>
        {onClear && (
          <button className="mini-button fit-button" type="button" onClick={onClear}>
            Clear answers
          </button>
        )}
      </div>
      <div className="metric-grid diagnostic-metrics">
        <DashboardCard title="Answered" value={`${summary.answered}/${orderedDiagnosticQuestions.length}`} caption="Saved locally in this browser." />
        <DashboardCard title="Solved so far" value={`${summary.correct}/${summary.answered || 0}`} caption="Multiple choice counts correct; written items count solved." />
        <DashboardCard title="Current score" value={`${summary.score}%`} caption="Solved or correct divided by answered." />
      </div>
      <div className="diagnostic-focus-box">
        <h3>What to learn next</h3>
        {summary.nextFocus.length ? (
          <div className="diagnostic-focus-list">
            {summary.nextFocus.map((concept) => (
              <span key={concept}>{concept}</span>
            ))}
          </div>
        ) : (
          <p>No missed concepts logged yet. Have the student answer diagnostic questions to populate this.</p>
        )}
      </div>
      {summary.missed.length > 0 && (
        <div className="diagnostic-missed-table">
          {summary.missed.map((question) => {
            const sourceClass = question.source === 'File 1' ? 'source-blue' : question.source === 'File 2' ? 'source-green' : 'source-guide'
            const hasChoices = Array.isArray(question.choices) && question.choices.length > 0

            return (
              <article key={question.id}>
                <span className={`question-number-badge ${sourceClass}`}>{question.id}</span>
                <strong>{question.concept}</strong>
                <p>
                  {hasChoices
                    ? `Chose ${responsesLabel(question, responses[question.id])}. Correct: ${responsesLabel(question, question.answer)}`
                    : `Status: ${responsesLabel(question, responses[question.id])}. Review the worked steps in Tutor/Admin.`}
                </p>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

function responsesLabel(question, selectedAnswer) {
  if (!selectedAnswer) return 'an incorrect answer.'
  if (!Array.isArray(question.choices) || question.choices.length === 0) {
    return selectedAnswer === 'solved' ? 'solved without help' : 'flagged for review'
  }
  const selectedChoice = question.choices[selectedAnswer.charCodeAt(0) - 97]
  return `${selectedAnswer}. ${prettyDiagnosticText(selectedChoice)}`
}

function DiagnosticAnswerKeyItem({ question }) {
  const hasChoices = Array.isArray(question.choices) && question.choices.length > 0
  const sourceClass = question.source === 'File 1' ? 'source-blue' : question.source === 'File 2' ? 'source-green' : 'source-guide'
  const selectedChoice = hasChoices ? question.choices[question.answer.charCodeAt(0) - 97] : null

  return (
    <details className="answer-key-detail">
      <summary>
        <span className={`question-number-badge ${sourceClass}`}>{question.id}</span>
        <strong>{hasChoices ? question.answer : 'FR'}</strong>
        <em>{question.concept}</em>
      </summary>
      <div className="answer-detail-body">
        {hasChoices ? (
          <>
            <p>
              <b>Correct answer:</b> {question.answer}. <DiagnosticRichText value={selectedChoice} />
            </p>
            <div className="answer-choice-review">
              {question.choices.map((choice, index) => {
                const letter = String.fromCharCode(97 + index)
                return (
                  <span className={letter === question.answer ? 'correct' : ''} key={`${question.id}-${letter}`}>
                    <b>{letter}.</b> <DiagnosticRichText value={choice} />
                  </span>
                )
              })}
            </div>
          </>
        ) : (
          <p>
            <b>Problem:</b> <DiagnosticRichText value={question.prompt} />
          </p>
        )}
        <ol>
          {(diagnosticSolutions[question.id] || ['Solution steps not added yet.']).map((step) => (
            <li key={step}>
              <DiagnosticRichText value={step} />
            </li>
          ))}
        </ol>
      </div>
    </details>
  )
}

function DiagnosticAnswerKey() {
  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Admin only</p>
          <h2>Diagnostic Answer Key and Worked Steps</h2>
        </div>
        <span className="syntax-note">Do not show this section to the student.</span>
      </div>
      <div className="answer-key-list">
        {orderedDiagnosticQuestions.map((question) => (
          <DiagnosticAnswerKeyItem key={question.id} question={question} />
        ))}
      </div>
      <div className="answer-notes">
        {diagnosticAnswerNotes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    </section>
  )
}

function TheoremInfoCard({ info }) {
  return (
    <aside className="theorem-popover">
      <TheoremMiniPlot type={info.visual} />
      <div>
        <strong>{info.title}</strong>
        <p>{info.text}</p>
        <p className="layperson-summary">{info.layperson}</p>
        <div className="theorem-example">
          <span>Example use</span>
          <div>{info.example}</div>
        </div>
        <em>{info.takeaway}</em>
      </div>
    </aside>
  )
}

function TheoremMiniPlot({ type }) {
  if (type === 'unit-circle') {
    const points = [
      { label: '0', x: 150, y: 48, anchor: 'start' },
      { label: 'π/6', x: 136, y: 28, anchor: 'start' },
      { label: 'π/4', x: 120, y: 16, anchor: 'start' },
      { label: 'π/3', x: 94, y: 10, anchor: 'middle' },
      { label: 'π/2', x: 64, y: 14, anchor: 'end' },
      { label: 'π', x: 20, y: 48, anchor: 'end' },
      { label: '3π/2', x: 92, y: 90, anchor: 'middle' },
    ]

    return (
      <svg aria-hidden="true" className="theorem-plot unit-circle-plot" viewBox="0 0 180 100">
        <circle className="unit-circle-ring" cx="90" cy="50" r="38" />
        <line className="plot-axis" x1="12" x2="168" y1="50" y2="50" />
        <line className="plot-axis" x1="90" x2="90" y1="8" y2="92" />
        <line className="plot-guide gold" x1="90" x2="136" y1="50" y2="28" />
        <path className="unit-angle-arc" d="M112 50 A22 22 0 0 0 109 39" />
        <text className="unit-angle-label" x="112" y="38">
          θ
        </text>
        <circle className="plot-point max" cx="136" cy="28" r="4" />
        <text className="unit-coordinate" x="112" y="22">
          (cos θ, sin θ)
        </text>
        {points.map((point) => (
          <text className="unit-tick-label" key={point.label} textAnchor={point.anchor} x={point.x} y={point.y}>
            {point.label}
          </text>
        ))}
      </svg>
    )
  }

  const curve = {
    accumulation: 'M12 82 C34 28, 62 34, 94 62 C118 84, 142 44, 168 26',
    'net-area': 'M12 72 C36 38, 62 22, 88 42 C116 64, 136 80, 168 36',
    average: 'M12 76 C42 32, 70 34, 96 58 C122 82, 144 58, 168 36',
    'net-change': 'M12 74 C44 74, 54 28, 84 34 C116 40, 122 76, 168 40',
    ivt: 'M12 78 C42 74, 54 58, 78 48 C112 34, 132 24, 168 18',
    mvt: 'M12 74 C40 28, 66 22, 92 52 C116 82, 140 64, 168 26',
    evt: 'M12 62 C38 22, 64 86, 92 50 C116 18, 140 76, 168 34',
    lhopital: 'M12 78 C44 54, 66 42, 88 36 C116 30, 140 24, 168 18',
  }[type]

  return (
    <svg aria-hidden="true" className="theorem-plot" viewBox="0 0 180 96">
      <defs>
        <linearGradient id={`fill-${type}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f6c66d" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8fbf8a" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <line className="plot-axis" x1="10" x2="172" y1="78" y2="78" />
      <line className="plot-axis" x1="18" x2="18" y1="12" y2="86" />
      {['accumulation', 'net-area', 'average'].includes(type) && (
        <path className="plot-area" d={`${curve} L168 78 L12 78 Z`} fill={`url(#fill-${type})`} />
      )}
      {type === 'average' && <line className="plot-guide gold" x1="28" x2="162" y1="54" y2="54" />}
      {type === 'ivt' && <line className="plot-guide gold" x1="20" x2="168" y1="48" y2="48" />}
      {type === 'mvt' && <line className="plot-guide gold" x1="20" x2="168" y1="74" y2="26" />}
      {type === 'evt' && (
        <>
          <circle className="plot-point max" cx="116" cy="18" r="5" />
          <circle className="plot-point min" cx="64" cy="86" r="5" />
        </>
      )}
      {type === 'net-change' && (
        <>
          <line className="plot-guide gold" x1="28" x2="156" y1="74" y2="40" />
          <circle className="plot-point" cx="28" cy="74" r="4" />
          <circle className="plot-point" cx="156" cy="40" r="4" />
        </>
      )}
      {type === 'lhopital' && (
        <>
          <path className="plot-guide red" d="M18 82 C54 58, 90 42, 168 18" />
          <path className="plot-guide gold" d="M18 88 C56 64, 98 46, 168 24" />
        </>
      )}
      <path className="plot-curve" d={curve} />
      {['accumulation', 'net-area'].includes(type) && (
        <>
          <line className="plot-bound" x1="44" x2="44" y1="20" y2="78" />
          <line className="plot-bound" x1="142" x2="142" y1="20" y2="78" />
        </>
      )}
    </svg>
  )
}

function APCalculusTutoringDashboard() {
  const saved = typeof window !== 'undefined' ? loadDashboardState() : null
  const initialSnapshot = normalizeDashboardSnapshot(saved)
  const initialDashboardId = getDashboardIdFromUrl() || initialSnapshot.dashboardId || 'eden-calculus'
  const [activePage, setActivePage] = useState('timeline')
  const [navOpen, setNavOpen] = useState(false)
  const [passwordModal, setPasswordModal] = useState(null)
  const unlockedGroupsRef = useRef(new Set())
  const [dashboardId, setDashboardId] = useState(initialDashboardId)
  const [dashboardIdDraft, setDashboardIdDraft] = useState(initialDashboardId)
  const [syncStatus, setSyncStatus] = useState(initialDashboardId ? (firebaseEnabled ? 'connecting' : 'error') : 'idle')
  const [student, setStudent] = useState(initialSnapshot.student)
  const [progress, setProgress] = useState(initialSnapshot.progress)
  const [skillRatings, setSkillRatings] = useState(initialSnapshot.skillRatings)
  const [sessions, setSessions] = useState(initialSnapshot.sessions)
  const [mistakes, setMistakes] = useState(initialSnapshot.mistakes)
  const [diagnosticResponses, setDiagnosticResponses] = useState(initialSnapshot.diagnosticResponses)
  const [masteryEndDate, setMasteryEndDate] = useState(initialSnapshot.timeline.goalEndDate)
  const [unitFilter, setUnitFilter] = useState('bc')
  const [expression, setExpression] = useState(initialSnapshot.graph.expression)
  const [xMin, setXMin] = useState(initialSnapshot.graph.xMin)
  const [xMax, setXMax] = useState(initialSnapshot.graph.xMax)
  const [yMin, setYMin] = useState(initialSnapshot.graph.yMin)
  const [yMax, setYMax] = useState(initialSnapshot.graph.yMax)
  const [showDerivative, setShowDerivative] = useState(initialSnapshot.graph.showDerivative)
  const [showIntegral, setShowIntegral] = useState(initialSnapshot.graph.showIntegral)
  const [approxMethod, setApproxMethod] = useState(initialSnapshot.graph.approxMethod)
  const [approxN, setApproxN] = useState(initialSnapshot.graph.approxN)
  const [approxA, setApproxA] = useState(initialSnapshot.graph.approxA)
  const [approxB, setApproxB] = useState(initialSnapshot.graph.approxB)
  const [eulerY0, setEulerY0] = useState(initialSnapshot.graph.eulerY0)
  const [transformParent, setTransformParent] = useState(initialSnapshot.graph.transformParent)
  const [transformParams, setTransformParams] = useState(initialSnapshot.graph.transformParams)
  const [hoverIndex, setHoverIndex] = useState(null)
  const clientIdRef = useRef(null)
  const currentSnapshotJsonRef = useRef('')
  const lastRemoteSnapshotJsonRef = useRef('')
  const skipNextRemoteWriteRef = useRef(false)
  const remoteReadyRef = useRef(!initialDashboardId || !firebaseEnabled)
  const [initialLastLocalSaveTimestamp] = useState(() => {
    if (typeof window === 'undefined') return 0
    const stored = localStorage.getItem('ap-calc-last-save-ts-v6')
    if (stored) return parseInt(stored, 10)
    // No timestamp stored yet, but if we have local data treat it as more recent than
    // any legacy Firestore record that also has no clientTimestamp.
    return localStorage.getItem(STORAGE_KEY) ? Date.now() : 0
  })
  const lastLocalSaveTimestampRef = useRef(initialLastLocalSaveTimestamp)

  if (clientIdRef.current == null) {
    clientIdRef.current = getClientId()
  }

  const dashboardSnapshot = useMemo(
    () =>
      buildDashboardSnapshot({
        dashboardId,
        student,
        progress,
        skillRatings,
        sessions,
        mistakes,
        diagnosticResponses,
        masteryEndDate,
        expression,
        xMin,
        xMax,
        yMin,
        yMax,
        showDerivative,
        showIntegral,
        approxMethod,
        approxN,
        approxA,
        approxB,
        eulerY0,
        transformParent,
        transformParams,
      }),
    [
      dashboardId,
      student,
      progress,
      skillRatings,
      sessions,
      mistakes,
      diagnosticResponses,
      masteryEndDate,
      expression,
      xMin,
      xMax,
      yMin,
      yMax,
      showDerivative,
      showIntegral,
      approxMethod,
      approxN,
      approxA,
      approxB,
      eulerY0,
      transformParent,
      transformParams,
    ],
  )
  const dashboardSnapshotJson = useMemo(() => JSON.stringify(dashboardSnapshot), [dashboardSnapshot])

  useEffect(() => {
    currentSnapshotJsonRef.current = dashboardSnapshotJson
    localStorage.setItem(STORAGE_KEY, dashboardSnapshotJson)
  }, [dashboardSnapshotJson])

  useEffect(() => {
    syncDashboardIdToUrl(dashboardId)

    if (!dashboardId) {
      remoteReadyRef.current = true
      return
    }

    if (!firebaseEnabled) {
      remoteReadyRef.current = true
      return
    }

    remoteReadyRef.current = false

    const unsubscribe = subscribeToDashboard(
      dashboardId,
      (remoteDoc) => {
        remoteReadyRef.current = true

        if (!remoteDoc) {
          setSyncStatus('ready')
          return
        }

        const remoteClientTimestamp = remoteDoc?.meta?.clientTimestamp || 0
        const remoteSnapshot = normalizeDashboardSnapshot(remoteDoc, dashboardId)
        const remoteSnapshotJson = JSON.stringify(remoteSnapshot)

        lastRemoteSnapshotJsonRef.current = remoteSnapshotJson

        if (remoteSnapshotJson === currentSnapshotJsonRef.current) {
          setSyncStatus('live')
          return
        }

        skipNextRemoteWriteRef.current = true
        setDashboardIdDraft(remoteSnapshot.dashboardId)
        setStudent(remoteSnapshot.student)
        setProgress(remoteSnapshot.progress)
        setSkillRatings(remoteSnapshot.skillRatings)
        setSessions(remoteSnapshot.sessions)
        setMistakes(remoteSnapshot.mistakes)
        // Merge: remote adds questions not yet answered locally; local answers are never overwritten
        setDiagnosticResponses((prev) => ({ ...remoteSnapshot.diagnosticResponses, ...prev }))
        // Only accept the remote target date if it is newer than the last local save
        if (remoteClientTimestamp >= lastLocalSaveTimestampRef.current) {
          setMasteryEndDate(remoteSnapshot.timeline.goalEndDate)
        }
        setExpression(remoteSnapshot.graph.expression)
        setXMin(remoteSnapshot.graph.xMin)
        setXMax(remoteSnapshot.graph.xMax)
        setYMin(remoteSnapshot.graph.yMin)
        setYMax(remoteSnapshot.graph.yMax)
        setShowDerivative(remoteSnapshot.graph.showDerivative)
        setShowIntegral(remoteSnapshot.graph.showIntegral)
        setApproxMethod(remoteSnapshot.graph.approxMethod)
        setApproxN(remoteSnapshot.graph.approxN)
        setApproxA(remoteSnapshot.graph.approxA)
        setApproxB(remoteSnapshot.graph.approxB)
        setEulerY0(remoteSnapshot.graph.eulerY0)
        setTransformParent(remoteSnapshot.graph.transformParent)
        setTransformParams(remoteSnapshot.graph.transformParams)
        setSyncStatus('live')
      },
      () => {
        remoteReadyRef.current = true
        setSyncStatus('error')
      },
    )

    return () => unsubscribe()
  }, [dashboardId])

  useEffect(() => {
    if (!dashboardId || !firebaseEnabled || !remoteReadyRef.current) return

    if (skipNextRemoteWriteRef.current) {
      skipNextRemoteWriteRef.current = false
      return
    }

    if (dashboardSnapshotJson === lastRemoteSnapshotJsonRef.current) return

    let cancelled = false

    const timer = setTimeout(() => {
      if (cancelled) return

      const clientTimestamp = Date.now()
      lastLocalSaveTimestampRef.current = clientTimestamp
      localStorage.setItem('ap-calc-last-save-ts-v6', String(clientTimestamp))

      setSyncStatus('saving')

      syncDashboardToFirebase(dashboardId, {
        state: dashboardSnapshot,
        meta: { updatedBy: clientIdRef.current, clientTimestamp },
      })
        .then(() => {
          if (cancelled) return
          lastRemoteSnapshotJsonRef.current = dashboardSnapshotJson
          setSyncStatus('live')
        })
        .catch(() => {
          if (cancelled) return
          setSyncStatus('error')
        })
    }, 1000)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [dashboardId, dashboardSnapshot, dashboardSnapshotJson])

  const visibleUnits = apUnits.filter((unit) => {
    if (unitFilter === 'all') return true
    if (unitFilter === 'ab') return unit.path === 'AB/BC'
    if (unitFilter === 'bc-only') return unit.path === 'BC only'
    return true
  })
  const syncStatusCopy = getSyncStatusCopy(syncStatus, dashboardId)
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined' || !dashboardId) return ''
    const url = new URL(window.location.href)
    url.searchParams.set(DASHBOARD_QUERY_PARAM, dashboardId)
    return url.toString()
  }, [dashboardId])

  const metrics = useMemo(() => {
    const overall = apUnits.reduce((sum, unit) => sum + unitProgress(progress[unit.id], unit), 0) / apUnits.length
    const abUnits = apUnits.filter((unit) => unit.path === 'AB/BC')
    const abProgress = abUnits.reduce((sum, unit) => sum + unitProgress(progress[unit.id], unit), 0) / abUnits.length
    const mastered = apUnits.filter((unit) => completedConcepts(progress[unit.id], unit) === unit.concepts.length).length
    const unitsWithActivity = apUnits.filter((unit) => unitHasLoggedActivity(progress[unit.id], unit))
    const hasTrackedProgress = unitsWithActivity.length > 0
    const hasRatedSkills = Object.values(skillRatings).some((rating) => Number(rating) > 0)
    const risk =
      100 -
      (clampPercent(student.recentScore) * 0.3 +
        clampPercent(student.frqScore) * 0.25 +
        clampPercent(student.mcqAccuracy) * 0.2 +
        clampPercent(student.homeworkCompletion) * 0.15 +
        clampPercent(student.attendance) * 0.1)
    const priorityUnits = unitsWithActivity
      .filter((unit) => unitProgress(progress[unit.id], unit) < 75)
      .sort((a, b) => unitProgress(progress[a.id], a) - unitProgress(progress[b.id], b))
      .slice(0, 3)
    const skillAverage = Object.values(skillRatings).reduce((sum, rating) => sum + Number(rating), 0) / skillTypes.length
    const readinessStatus = skillAverage >= 4.2 && overall >= 80 ? 'On Track' : skillAverage >= 3.2 && overall >= 60 ? 'Needs Practice' : 'Needs Attention'
    const skillPriorities = skillTypes
      .filter((skill) => Number(skillRatings[skill.id]) > 0 && Number(skillRatings[skill.id]) < 4)
      .sort((a, b) => Number(skillRatings[a.id]) - Number(skillRatings[b.id]))
      .slice(0, 3)

    return {
      overall: clampPercent(overall),
      abProgress: clampPercent(abProgress),
      mastered,
      risk: clampPercent(risk),
      hasTrackedProgress,
      hasRatedSkills,
      priorityUnits,
      skillAverage: Number(skillAverage.toFixed(1)),
      readinessStatus,
      skillPriorities,
    }
  }, [progress, student, skillRatings])

  const graph = useMemo(() => {
    try {
      return {
        ok: true,
        message: '',
        data: sampleGraph(expression, xMin, xMax, yMin, yMax),
      }
    } catch (error) {
      return { ok: false, message: error.message, data: [] }
    }
  }, [expression, xMin, xMax, yMin, yMax])

  const timeline = useMemo(() => buildTimeline(progress, masteryEndDate, student.course), [progress, masteryEndDate, student.course])
  const diagnosticSummary = useMemo(() => buildDiagnosticSummary(diagnosticResponses), [diagnosticResponses])

  const hoverPoint = hoverIndex === null ? null : graph.data[hoverIndex]

  function setGraphWindow(nextXMin, nextXMax, nextYMin, nextYMax) {
    setXMin(Number(nextXMin.toFixed(4)))
    setXMax(Number(nextXMax.toFixed(4)))
    setYMin(Number(nextYMin.toFixed(4)))
    setYMax(Number(nextYMax.toFixed(4)))
  }

  function selectExampleExpression(snippet) {
    setExpression(snippet)
  }

  function applyGraphPreset(preset) {
    if (preset === 'trig') {
      setExpression('sin(x)')
      setXMin('-2*pi')
      setXMax('2*pi')
      setYMin(-2)
      setYMax(2)
      return
    }

    if (preset === 'standard') {
      setXMin(-10)
      setXMax(10)
      setYMin(-10)
      setYMax(10)
      return
    }

    setXMin(-4)
    setXMax(4)
    setYMin(-10)
    setYMax(10)
  }

  function setTransformParam(key, value) {
    setTransformParams((current) => {
      const next = { ...current, [key]: value }
      setExpression(buildParentExpression(transformParent, next))
      return next
    })
  }

  function setParentFunction(parentKey) {
    const parent = parentFunctions[parentKey]
    setTransformParent(parentKey)
    setExpression(buildParentExpression(parentKey, transformParams))
    setXMin(parent.defaultWindow[0])
    setXMax(parent.defaultWindow[1])
    setYMin(parent.defaultWindow[2])
    setYMax(parent.defaultWindow[3])
  }

  function preventNumberWheel(event) {
    event.currentTarget.blur()
  }

  function applySharedDashboardId() {
    const nextDashboardId = sanitizeDashboardId(dashboardIdDraft)
    setDashboardIdDraft(nextDashboardId)
    setDashboardId(nextDashboardId)
    setSyncStatus(nextDashboardId ? (firebaseEnabled ? 'connecting' : 'error') : 'idle')
  }

  function setStudentField(field, value) {
    setStudent((current) => ({ ...current, [field]: value }))
  }

  function setProgressField(unitId, field, value) {
    const dateField = unitStatusDateFields[field]

    setProgress((current) => ({
      ...current,
      [unitId]: {
        ...current[unitId],
        [field]: value,
        ...(dateField ? { [dateField]: value ? current[unitId][dateField] || new Date().toISOString() : null } : {}),
      },
    }))
  }

  function setSkillRating(skillId, value) {
    setSkillRatings((current) => ({ ...current, [skillId]: Number(value) }))
  }

  function updateSession(id, field, value) {
    setSessions((current) => current.map((session) => (session.id === id ? { ...session, [field]: value } : session)))
  }

  function addSession() {
    setSessions((current) => [
      ...current,
      { id: `session-${Date.now()}`, date: new Date().toISOString().slice(0, 10), focus: '', win: '', next: '' },
    ])
  }

  function deleteSession(id) {
    setSessions((current) => current.filter((session) => session.id !== id))
  }

  function updateMistake(id, field, value) {
    setMistakes((current) => current.map((mistake) => (mistake.id === id ? { ...mistake, [field]: value } : mistake)))
  }

  function addMistake() {
    setMistakes((current) => [...current, { id: `mistake-${Date.now()}`, type: errorTypes[0], topic: '', note: '' }])
  }

  function selectDiagnosticAnswer(questionId, answer) {
    setDiagnosticResponses((current) => ({ ...current, [questionId]: answer }))
  }

  function openDiagnosticQuestion(questionId) {
    setActivePage('diagnostic')
    if (typeof window === 'undefined') return

    window.setTimeout(() => {
      document.getElementById(`diagnostic-question-${questionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  function setConceptProgress(unitId, concept, field, value) {
    setProgress((current) => ({
      ...current,
      [unitId]: {
        ...current[unitId],
        concepts: {
          ...current[unitId].concepts,
          [concept]: {
            ...current[unitId].concepts[concept],
            [field]: value,
            [statusDateFields[field]]: value ? current[unitId].concepts[concept][statusDateFields[field]] || new Date().toISOString() : null,
          },
        },
      },
    }))
  }

  function setAllConcepts(unit, value) {
    setProgress((current) => ({
      ...current,
      [unit.id]: {
        ...current[unit.id],
        concepts: Object.fromEntries(
          unit.concepts.map((concept) => [
            concept,
            {
              ...current[unit.id].concepts[concept],
              taught: value ? true : current[unit.id].concepts[concept].taught,
              knows: value,
              taughtAt: value ? current[unit.id].concepts[concept].taughtAt || new Date().toISOString() : current[unit.id].concepts[concept].taughtAt,
              knowsAt: value ? current[unit.id].concepts[concept].knowsAt || new Date().toISOString() : null,
            },
          ]),
        ),
      },
    }))
  }

  function resetDemoData() {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Reset all dashboard inputs and clear every saved checkbox, note, score, and graph setting?')
      if (!confirmed) return
    }

    localStorage.removeItem(STORAGE_KEY)
    setActivePage('admin')
    setStudent(blankStudent)
    setProgress(createEmptyProgress())
    setSkillRatings(createDefaultSkillRatings())
    setSessions(defaultSessions)
    setMistakes(defaultMistakes)
    setDiagnosticResponses({})
    setMasteryEndDate(defaultMasteryGoal.endDate)
    setUnitFilter('bc')
    setExpression(defaultGraphState.expression)
    setXMin(defaultGraphState.xMin)
    setXMax(defaultGraphState.xMax)
    setYMin(defaultGraphState.yMin)
    setYMax(defaultGraphState.yMax)
    setShowDerivative(defaultGraphState.showDerivative)
    setShowIntegral(defaultGraphState.showIntegral)
    setApproxMethod(defaultGraphState.approxMethod)
    setApproxN(defaultGraphState.approxN)
    setApproxA(defaultGraphState.approxA)
    setApproxB(defaultGraphState.approxB)
    setEulerY0(defaultGraphState.eulerY0)
    setTransformParent(defaultGraphState.transformParent)
    setTransformParams({ ...defaultGraphState.transformParams })
    setHoverIndex(null)
  }

  // Pages that share a group use the same password; unlocking one unlocks all in the group.
  const PAGE_PASSWORD_GROUP = { admin: 'tutor', tracker: 'tutor', parent: 'parent' }
  const GROUP_PASSWORDS = { tutor: 'edenadmin', parent: 'parent26' }

  function handleTabClick(id) {
    const group = PAGE_PASSWORD_GROUP[id]
    if (group && !unlockedGroupsRef.current.has(group)) {
      setPasswordModal({ page: id, group, input: '', error: false })
      return
    }
    setActivePage(id)
  }

  function submitPassword() {
    if (!passwordModal) return
    if (passwordModal.input === GROUP_PASSWORDS[passwordModal.group]) {
      unlockedGroupsRef.current.add(passwordModal.group)
      setActivePage(passwordModal.page)
      setPasswordModal(null)
    } else {
      setPasswordModal((m) => ({ ...m, error: true, input: '' }))
    }
  }

  return (
    <main className="dashboard-shell">
      {passwordModal && (
        <div className="password-overlay" role="dialog" aria-modal="true" aria-label="Password required">
          <div className="password-modal">
            <h2 className="password-modal-title">
              {passwordModal.page === 'admin' ? 'Tutor/Admin' : 'Parent View'}
            </h2>
            <p className="password-modal-subtitle">Enter the password to access this page.</p>
            <input
              autoFocus
              className={`password-modal-input${passwordModal.error ? ' error' : ''}`}
              type="password"
              placeholder="Password"
              value={passwordModal.input}
              onChange={(e) => setPasswordModal((m) => ({ ...m, input: e.target.value, error: false }))}
              onKeyDown={(e) => { if (e.key === 'Enter') submitPassword() }}
            />
            {passwordModal.error && <p className="password-modal-error">Incorrect password. Try again.</p>}
            <div className="password-modal-actions">
              <button type="button" className="password-modal-cancel" onClick={() => setPasswordModal(null)}>Cancel</button>
              <button type="button" className="password-modal-submit" onClick={submitPassword}>Unlock</button>
            </div>
          </div>
        </div>
      )}
      <div className="mobile-topbar" aria-hidden="true">
        <button className="hamburger-btn" type="button" aria-label="Open navigation" onClick={() => setNavOpen(true)}>
          <span /><span /><span />
        </button>
        <span className="mobile-page-label">
          {[['admin','Tutor/Admin'],['tracker','Progress Tracker'],['timeline','Timeline'],['diagnostic','Diagnostic'],['graph','Function Lab'],['exam','Exam Readiness'],['student','Student View'],['references','References'],['parent','Parent View']].find(([id]) => id === activePage)?.[1] ?? ''}
        </span>
      </div>

      {navOpen && <div className="nav-backdrop" onClick={() => setNavOpen(false)} />}

      <nav className={`page-tabs${navOpen ? ' nav-open' : ''}`} aria-label="Dashboard pages">
        <button className="nav-close-btn" type="button" aria-label="Close navigation" onClick={() => setNavOpen(false)}>✕</button>
        {[
          ['admin', 'Tutor/Admin'],
          ['tracker', 'Progress Tracker'],
          ['timeline', 'Timeline'],
          ['diagnostic', 'Diagnostic'],
          ['graph', 'Function Lab'],
          ['exam', 'Exam Readiness'],
          ['student', 'Student View'],
          ['references', 'References'],
          ['parent', 'Parent View'],
        ].map(([id, label]) => (
          <button
            className={activePage === id ? 'active' : ''}
            key={id}
            type="button"
            onClick={() => { handleTabClick(id); setNavOpen(false) }}
          >
            {label}
          </button>
        ))}
      </nav>

      {activePage === 'admin' && (
        <section className="page-grid">
          <div className="metric-grid">
            <DashboardCard title="Overall curriculum progress" value={`${metrics.overall}%`} caption="Based on individual concept mastery." />
            <DashboardCard title="AB foundation progress" value={`${metrics.abProgress}%`} caption="AB/BC shared units only." />
            <DashboardCard title="Units mastered" value={`${metrics.mastered}/10`} caption="Student can solve mixed AP-style prompts." />
            <DashboardCard title="Readiness status" value={metrics.readinessStatus} caption={`Skill average ${metrics.skillAverage}/5 across AP task types.`} />
          </div>

          <section className="panel split-panel">
            <div>
              <h2>Student Setup</h2>
              <label>
                Shared dashboard ID
                <input
                  placeholder="calc-student-1"
                  value={dashboardIdDraft}
                  onChange={(event) => setDashboardIdDraft(event.target.value)}
                />
              </label>
              <div className="section-header compact-header">
                <p className="helper-copy">
                  Use the same dashboard ID and page URL on every device that should stay in sync.
                </p>
                <button className="mini-button fit-button" type="button" onClick={applySharedDashboardId}>
                  Use shared ID
                </button>
              </div>
              <p className="syntax-note">{syncStatusCopy}</p>
              {shareUrl && (
                <label>
                  Shared page URL
                  <input readOnly value={shareUrl} />
                </label>
              )}
              <label>
                Course
                <select value={student.course} onChange={(event) => setStudentField('course', event.target.value)}>
                  <option>AP Calculus AB</option>
                  <option>AP Calculus BC</option>
                  <option>AP Calculus AB + BC</option>
                </select>
              </label>
              <label>
                Target AP score
                <input value={student.targetScore} onChange={(event) => setStudentField('targetScore', event.target.value)} />
              </label>
              <label>
                Timeline mastery target date
                <input type="date" value={masteryEndDate} onChange={(event) => setMasteryEndDate(event.target.value)} />
              </label>
              <p className="helper-copy">
                Timeline pacing uses this date as the goal for covering and mastering every tracked AP Calculus concept.
              </p>
              <button className="secondary-button" type="button" onClick={resetDemoData}>
                Reset demo data
              </button>
            </div>

            <div>
              <div className="section-header compact-header">
                <div>
                  <p className="eyebrow">Tutor tracking inputs</p>
                  <h2>What to Update After Sessions</h2>
                </div>
              </div>
              <p className="helper-copy">
                These are manual checkpoints. If you do not have a score for one yet, leave it at 0 until you run that type of practice.
              </p>
              <div className="kpi-input-grid">
                {tutorKpis.map((kpi) => (
                  <article className="kpi-input-card" key={kpi.field}>
                    <label>
                      <span>{kpi.label}</span>
                      <div className="kpi-number-row">
                        <input
                          min="0"
                          max="100"
                          type="number"
                          value={student[kpi.field]}
                          onChange={(event) => setStudentField(kpi.field, event.target.value)}
                        />
                        <strong>{kpi.unit}</strong>
                      </div>
                    </label>
                    <p>
                      <b>Source:</b> {kpi.source}
                    </p>
                    <p>
                      <b>When:</b> {kpi.cadence}
                    </p>
                    <p>
                      <b>Why it matters:</b> {kpi.use}
                    </p>
                  </article>
                ))}
              </div>
              <label>
                Tutor notes / parent talking points
                <textarea value={student.notes} onChange={(event) => setStudentField('notes', event.target.value)} />
              </label>
            </div>
          </section>

          <DiagnosticResultsSummary responses={diagnosticResponses} summary={diagnosticSummary} onClear={() => setDiagnosticResponses({})} />

          <section className="panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">AP skill-type mastery</p>
                <h2>0-5 Skill Rubric</h2>
              </div>
              <p className="syntax-note">0 not introduced · 3 independent · 5 exam-ready under time</p>
            </div>
            <div className="skill-rubric-grid">
              {skillTypes.map((skill) => (
                <article className="skill-card" key={skill.id}>
                  <div>
                    <h3>{skill.label}</h3>
                    <p>{skill.example}</p>
                  </div>
                  <label>
                    Rating: {skillRatings[skill.id]} - {skillScale[skillRatings[skill.id]]}
                    <input
                      max="5"
                      min="0"
                      type="range"
                      value={skillRatings[skill.id]}
                      onChange={(event) => setSkillRating(skill.id, event.target.value)}
                    />
                  </label>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>Parent/Student Update Fields</h2>
            <div className="input-grid update-field-grid">
              {[
                ['thisWeek', 'This week we worked on'],
                ['improvedIn', 'The student improved in'],
                ['currentFocus', 'Current focus'],
                ['practiceAssigned', 'Practice assigned'],
                ['parentSupport', 'What parent can support'],
                ['nextSessionPlan', 'Next session plan'],
              ].map(([field, label]) => (
                <label key={field}>
                  {label}
                  <textarea value={student[field] || ''} onChange={(event) => setStudentField(field, event.target.value)} />
                </label>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">Version 2 tracking</p>
                <h2>Session Log</h2>
              </div>
              <button className="mini-button fit-button" type="button" onClick={addSession}>
                Add session
              </button>
            </div>
            <div className="log-grid">
              {sessions.map((session) => (
                <article className="log-card" key={session.id}>
                  <div className="log-card-header">
                    <label>
                      Date
                      <input type="date" value={session.date} onChange={(event) => updateSession(session.id, 'date', event.target.value)} />
                    </label>
                    <button className="mini-button delete-button" type="button" onClick={() => deleteSession(session.id)}>Delete</button>
                  </div>
                  <label>
                    Focus
                    <input value={session.focus} onChange={(event) => updateSession(session.id, 'focus', event.target.value)} />
                  </label>
                  <label>
                    Win
                    <textarea value={session.win} onChange={(event) => updateSession(session.id, 'win', event.target.value)} />
                  </label>
                  <label>
                    Next step
                    <textarea value={session.next} onChange={(event) => updateSession(session.id, 'next', event.target.value)} />
                  </label>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">Mistake tracker</p>
                <h2>Error Types to Fix</h2>
              </div>
              <button className="mini-button fit-button" type="button" onClick={addMistake}>
                Add mistake
              </button>
            </div>
            <div className="log-grid">
              {mistakes.map((mistake) => (
                <article className="log-card" key={mistake.id}>
                  <label>
                    Error type
                    <select value={mistake.type} onChange={(event) => updateMistake(mistake.id, 'type', event.target.value)}>
                      {errorTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Topic
                    <input value={mistake.topic} onChange={(event) => updateMistake(mistake.id, 'topic', event.target.value)} />
                  </label>
                  <label>
                    Note / correction
                    <textarea value={mistake.note} onChange={(event) => updateMistake(mistake.id, 'note', event.target.value)} />
                  </label>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>Recommended Tutor KPIs</h2>
            <div className="kpi-list">
              <article>
                <h3>Mastery by AP unit</h3>
                <p>Use individual concept checkboxes so “covered” does not masquerade as retained.</p>
              </article>
              <article>
                <h3>FRQ rubric strength</h3>
                <p>Track setup, notation, justification, units, calculator use, and final answer accuracy.</p>
              </article>
              <article>
                <h3>MCQ accuracy by concept</h3>
                <p>Use this to decide whether the next session should be reteach, mixed practice, or timed exam work.</p>
              </article>
              <article>
                <h3>Error type log</h3>
                <p>Tag algebra slips, concept gaps, misread prompts, notation issues, and time-pressure errors.</p>
              </article>
              <article>
                <h3>Corrected homework rate</h3>
                <p>Completion is useful; corrected completion is the signal that feedback is being used.</p>
              </article>
              <article>
                <h3>Exam readiness trend</h3>
                <p>Compare diagnostic, weekly practice, timed sections, and mock exams instead of relying on one score.</p>
              </article>
            </div>
          </section>

          <DiagnosticAnswerKey />
        </section>
      )}

      {activePage === 'tracker' && (
        <section className="page-grid">
          <div className="section-header">
            <div>
              <p className="eyebrow">Saved progress tracker</p>
              <h2>AP Unit Progress</h2>
            </div>
            <select value={unitFilter} onChange={(event) => setUnitFilter(event.target.value)}>
              <option value="all">Show all units</option>
              <option value="ab">AB path only</option>
              <option value="bc">BC full path</option>
              <option value="bc-only">BC-only units</option>
            </select>
          </div>

          {visibleUnits.map((unit) => {
            const row = progress[unit.id]
            const score = unitProgress(row, unit)
            const masteredCount = completedConcepts(row, unit)

            return (
              <article className="unit-card" key={unit.id}>
                <div>
                  <div className="tag-row">
                    <span className="tag">{unit.path}</span>
                    <span>{unit.unit}</span>
                    <span>AB {unit.abWeight}</span>
                    <span>BC {unit.bcWeight}</span>
                  </div>
                  <h3>{unit.title}</h3>
                  <p className="unit-summary">
                    {masteredCount}/{unit.concepts.length} concepts known. Unit progress is calculated from the “Knows it” checkboxes.
                  </p>
                  <div className="concept-checklist">
                    {unit.concepts.map((concept) => {
                      const conceptRow = row.concepts?.[concept] || { taught: false, knows: false, reviewed: false }

                      return (
                        <article className="concept-status-card" key={concept}>
                          <strong>{concept}</strong>
                          <div className="concept-status-grid">
                            <CheckboxField checked={Boolean(conceptRow.taught)} onChange={(value) => setConceptProgress(unit.id, concept, 'taught', value)}>
                              Taught
                            </CheckboxField>
                            <CheckboxField checked={Boolean(conceptRow.knows)} onChange={(value) => setConceptProgress(unit.id, concept, 'knows', value)}>
                              Knows it
                            </CheckboxField>
                            <CheckboxField
                              checked={Boolean(conceptRow.reviewed)}
                              onChange={(value) => setConceptProgress(unit.id, concept, 'reviewed', value)}
                            >
                              Reviewed again
                            </CheckboxField>
                          </div>
                          <div className="concept-date-row">
                            <span>Taught: {formatShortDate(conceptRow.taughtAt)}</span>
                            <span>Known: {formatShortDate(conceptRow.knowsAt)}</span>
                            <span>Reviewed: {formatShortDate(conceptRow.reviewedAt)}</span>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
                <div className="progress-controls">
                  <div className="progress-bar" aria-label={`${unit.title} ${score}% complete`}>
                    <span style={{ width: `${score}%` }} />
                  </div>
                  <strong>{score}% complete</strong>
                  <button className="mini-button" type="button" onClick={() => setAllConcepts(unit, masteredCount !== unit.concepts.length)}>
                    {masteredCount === unit.concepts.length ? 'Clear knows-it checks' : 'Mark all as known'}
                  </button>
                  <div className="checkbox-grid">
                    {[
                      ['taught', 'Unit taught', 'Taught'],
                      ['practiced', 'Mixed practice done', 'Practice'],
                      ['reviewed', 'Spiral reviewed', 'Review'],
                    ].map(([field, label, dateLabel]) => {
                      const dateField = unitStatusDateFields[field]

                      return (
                        <div className="unit-status-check" key={field}>
                          <CheckboxField checked={row[field]} onChange={(value) => setProgressField(unit.id, field, value)}>
                            {label}
                          </CheckboxField>
                          <span>
                            {dateLabel}: {formatShortDate(row[dateField])}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <input
                    placeholder="Quiz score, assignment, or next-step note"
                    value={row.quiz}
                    onChange={(event) => setProgressField(unit.id, 'quiz', event.target.value)}
                  />
                </div>
              </article>
            )
          })}
        </section>
      )}

      {activePage === 'timeline' && (
        <section className="page-grid">
          <TimelineView onOpenDiagnosticQuestion={openDiagnosticQuestion} timeline={timeline} />
        </section>
      )}

      {activePage === 'diagnostic' && (
        <section className="page-grid">
          <section className="student-panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">Student-facing diagnostic</p>
                <h2>AP Calculus Concept Diagnostic</h2>
              </div>
              <p className="syntax-note">
                {diagnosticSummary.answered}/{orderedDiagnosticQuestions.length} answered. Answers save automatically in this browser.
              </p>
            </div>
            <div className="diagnostic-test-toolbar">
              <span>
                Saved answers: {diagnosticSummary.answered}/{orderedDiagnosticQuestions.length}
              </span>
              <button className="mini-button fit-button" type="button" onClick={() => setDiagnosticResponses({})}>
                Clear answer choices
              </button>
            </div>
            <div className="diagnostic-grid">
              {orderedDiagnosticQuestions.map((question) => (
                <DiagnosticQuestionCard
                  key={question.id}
                  onSelect={selectDiagnosticAnswer}
                  question={question}
                  selectedAnswer={diagnosticResponses[question.id]}
                />
              ))}
            </div>
          </section>
        </section>
      )}

      {activePage === 'graph' && (
        <section className="page-grid">
          <section className="panel">
            <div className="section-header">
              <div>
                <p className="eyebrow">Interactive function lab</p>
                <h2>Function, Derivative, and Accumulated Integral</h2>
              </div>
              <p className="syntax-note">Try: x^2, sin(x), e^x, ln(x), sqrt(x), abs(x)</p>
            </div>

            <div className="graph-controls">
              <label className="function-input">
                f(x)
                <input value={expression} onChange={(event) => setExpression(event.target.value)} />
              </label>
              <label>
                x min
                <input value={xMin} onChange={(event) => setXMin(event.target.value)} />
              </label>
              <label>
                x max
                <input value={xMax} onChange={(event) => setXMax(event.target.value)} />
              </label>
              <label>
                y min
                <input value={yMin} onChange={(event) => setYMin(event.target.value)} />
              </label>
              <label>
                y max
                <input value={yMax} onChange={(event) => setYMax(event.target.value)} />
              </label>
            </div>

            <div className="transform-lab">
              <div>
                <p className="eyebrow">Transformation Lab</p>
                <h3>Build: a · g(b(x - h)) + k</h3>
                <p>Use this to show vertical stretch/reflection, horizontal compression, phase shift, and vertical shift.</p>
              </div>
              <div className="transform-controls">
                <label>
                  Parent g(x)
                  <select value={transformParent} onChange={(event) => setParentFunction(event.target.value)}>
                    {Object.entries(parentFunctions).map(([key, parent]) => (
                      <option key={key} value={key}>
                        {parent.label}
                      </option>
                    ))}
                  </select>
                </label>
                {[
                  ['a', 'Vertical scale / reflection'],
                  ['b', 'Horizontal scale / period'],
                  ['h', 'Horizontal shift'],
                  ['k', 'Vertical shift'],
                ].map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <input
                      type="number"
                      step="0.25"
                      value={transformParams[key]}
                      onChange={(event) => setTransformParam(key, event.target.value)}
                      onWheel={preventNumberWheel}
                    />
                  </label>
                ))}
              </div>
              <div className="transform-actions">
                <span className="live-badge">Live updates enabled</span>
                <code>f(x) = {buildParentExpression(transformParent, transformParams)}</code>
              </div>
              <div className="transform-notes">
                {transformationNotes(transformParent, transformParams).map((note) => (
                  <span key={note}>{note}</span>
                ))}
              </div>
            </div>

            <div className="math-button-row">
              {[
                ['π', 'pi'],
                ['2π', '2*pi'],
                ['√x', 'sqrt(x)'],
                ['|x|', 'abs(x)'],
                ['sin x', 'sin(x)'],
                ['cos x', 'cos(x)'],
                ['tan x', 'tan(x)'],
                ['x²', 'x^2'],
                ['e^x', 'exp(x)'],
                ['ln x', 'ln(x)'],
              ].map(([label, snippet]) => (
                <button key={label} type="button" onClick={() => selectExampleExpression(snippet)}>
                  {label}
                </button>
              ))}
              <button type="button" onClick={() => applyGraphPreset('trig')}>
                Trig window
              </button>
              <button type="button" onClick={() => applyGraphPreset('standard')}>
                Standard window
              </button>
              <button type="button" onClick={() => applyGraphPreset('default')}>
                Reset view
              </button>
            </div>

            <div className="legend-row">
              <span className="legend function">f(x)</span>
              <CheckboxField checked={showDerivative} onChange={setShowDerivative}>
                derivative
              </CheckboxField>
              <CheckboxField checked={showIntegral} onChange={setShowIntegral}>
                accumulated integral
              </CheckboxField>
            </div>

            <div className="approx-controls">
              <label>
                Approximation view
                <select value={approxMethod} onChange={(event) => setApproxMethod(event.target.value)}>
                  <option value="none">None</option>
                  <option value="left">Left Riemann sum</option>
                  <option value="right">Right Riemann sum</option>
                  <option value="midpoint">Midpoint Riemann sum</option>
                  <option value="trapezoid">Trapezoid rule</option>
                  <option value="euler">Euler method for y&apos; = f(x)</option>
                </select>
              </label>
              <label>
                a (left bound)
                <input type="number" step="0.5" value={approxA} onChange={(event) => setApproxA(Number(event.target.value))} onWheel={(e) => e.currentTarget.blur()} />
              </label>
              <label>
                b (right bound)
                <input type="number" step="0.5" value={approxB} onChange={(event) => setApproxB(Number(event.target.value))} onWheel={(e) => e.currentTarget.blur()} />
              </label>
              <label>
                Subintervals / steps
                <input min="2" max="40" type="number" value={approxN} onChange={(event) => setApproxN(event.target.value)} />
              </label>
              <label>
                Euler y₀
                <input type="number" step="0.25" value={eulerY0} onChange={(event) => setEulerY0(event.target.value)} />
              </label>
            </div>

            {!graph.ok && <div className="error-box">{graph.message}</div>}
            {graph.ok && (
              <GraphSvg
                data={graph.data}
                expression={expression}
                hoverPoint={hoverPoint}
                setHoverIndex={setHoverIndex}
                setGraphWindow={setGraphWindow}
                approxMethod={approxMethod}
                approxN={Number(approxN)}
                approxA={Number(approxA)}
                approxB={Number(approxB)}
                eulerY0={Number(eulerY0)}
                showDerivative={showDerivative}
                showIntegral={showIntegral}
                xMax={parseScalar(xMax)}
                xMin={parseScalar(xMin)}
                yMax={parseScalar(yMax)}
                yMin={parseScalar(yMin)}
              />
            )}

          </section>
        </section>
      )}

      {activePage === 'exam' && (
        <section className="page-grid">
          <section className="student-panel">
            <p className="eyebrow">Exam readiness</p>
            <h2>AP Calculus Readiness Check</h2>
            <div className="metric-grid parent-metrics">
              <DashboardCard title="Readiness status" value={metrics.readinessStatus} caption="Combined concept and skill signal." />
              <DashboardCard title="Skill average" value={`${metrics.skillAverage}/5`} caption="Average across AP task types." />
              <DashboardCard title="Recent benchmark" value={`${clampPercent(student.recentScore)}%`} caption="Most recent practice score." />
            </div>
            <div className="skill-rubric-grid">
              {skillTypes.map((skill) => (
                <article className="skill-card" key={skill.id}>
                  <h3>{skill.label}</h3>
                  <p>
                    {skillRatings[skill.id]}/5 - {skillScale[skillRatings[skill.id]]}
                  </p>
                </article>
              ))}
            </div>
            <h3>Highest Priority Before Mock Exam</h3>
            <div className="priority-grid">
              {metrics.skillPriorities.length > 0 ? (
                metrics.skillPriorities.map((skill) => (
                  <article key={skill.id}>
                    <strong>{skill.label}</strong>
                    <p>{skill.example}</p>
                  </article>
                ))
              ) : (
                <article>
                  <strong>No exam priorities yet</strong>
                  <p>Rate the skill rubric first so this section reflects real weak spots instead of defaults.</p>
                </article>
              )}
            </div>
          </section>
        </section>
      )}

      {activePage === 'student' && (
        <section className="page-grid">
          <section className="student-panel">
            <p className="eyebrow">Student action page</p>
            <h2>Next Actions</h2>
            <div className="student-action-grid">
              <article>
                <span>Today&apos;s assignment</span>
                <strong>{student.practiceAssigned}</strong>
              </article>
              <article>
                <span>Topics to review</span>
                <strong>{metrics.priorityUnits.length > 0 ? metrics.priorityUnits.map((unit) => unit.title).join(', ') : 'Nothing flagged yet'}</strong>
              </article>
              <article>
                <span>Mistakes to fix</span>
                <strong>{metrics.skillPriorities.length > 0 ? metrics.skillPriorities.map((skill) => skill.label).join(', ') : 'No skill issues logged yet'}</strong>
              </article>
              <article>
                <span>Upcoming target</span>
                <strong>{student.nextSessionPlan}</strong>
              </article>
            </div>
            <h3>Progress Badges</h3>
            <div className="badge-board">
              {skillTypes.map((skill) => {
                const rating = skillRatings[skill.id]
                const label = rating >= 4 ? 'Mastered' : rating >= 3 ? 'Practicing' : rating >= 1 ? 'Needs Review' : 'Locked'
                return (
                  <span className={`student-badge rating-${Math.min(4, rating)}`} key={skill.id}>
                    {skill.label}: {label}
                  </span>
                )
              })}
            </div>
          </section>
        </section>
      )}

      {activePage === 'references' && (
        <section className="page-grid">
          <section className="student-panel">
            <p className="eyebrow">Student reference library</p>
            <h2>Quick Reference and Foundational Fact Sheets</h2>
            <h3>AP Calculus Quick Reference</h3>
            <div className="ref-grid">
              {referenceGuide.map((card) => (
                <article className="ref-card" key={card.title}>
                  <div className="ref-card-header">
                    <span className="ref-tag">{card.tag}</span>
                    <strong>{card.title}</strong>
                  </div>
                  <ul>
                    {card.items.map((item) => (
                      <FormulaItem item={item} key={typeof item === 'string' ? item : item.label} />
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <h3>Foundational Skills Fact Sheets</h3>
            <div className="fact-grid">
              {foundationalFactSheets.map((sheet) => (
                <FactSheetCard key={sheet.title} sheet={sheet} />
              ))}
            </div>
          </section>
        </section>
      )}

      {activePage === 'parent' && (
        <section className="page-grid">
          <section className="parent-panel">
            <p className="eyebrow">Parent-safe view</p>
            <h2>AP Calculus Progress</h2>
            <p>
              Goal: {student.course}, target AP score {student.targetScore}
            </p>
            <h3>Current Priority Areas</h3>
            <div className="priority-grid">
              {metrics.priorityUnits.length > 0 ? (
                metrics.priorityUnits.map((unit) => (
                  <article key={unit.id}>
                    <strong>{unit.title}</strong>
                    <p>Next step: practice targeted AP-style questions, then spiral review in mixed sets.</p>
                  </article>
                ))
              ) : (
                <article>
                  <strong>No priority units yet</strong>
                  <p>Once tutoring progress is logged, this section will highlight the units that need the most attention.</p>
                </article>
              )}
            </div>
            <div className="parent-update-grid">
              {[
                ['This week we worked on', student.thisWeek],
                ['The student improved in', student.improvedIn],
                ['Current focus', student.currentFocus],
                ['Practice assigned', student.practiceAssigned],
                ['What parent can support', student.parentSupport],
                ['Next session plan', student.nextSessionPlan],
              ].map(([label, value]) => (
                <article key={label}>
                  <h3>{label}</h3>
                  <p>{value}</p>
                </article>
              ))}
            </div>
            <h3>Generated Parent Summary</h3>
            <p className="notes-box">{createParentSummary(student, metrics)}</p>
          </section>
        </section>
      )}
    </main>
  )
}

function TimelineView({ timeline, onOpenDiagnosticQuestion }) {
  const todayLeft = ((timeline.today.getTime() - timeline.start.getTime()) / timeline.span) * 100
  const clampedTodayLeft = Math.max(0, Math.min(100, todayLeft))
  const hasActivity = timeline.rows.some((row) => row.start)

  return (
    <section className="timeline-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Auto-built from tracker logs</p>
          <h2>Learning Timeline</h2>
          <p style={{ fontSize: '0.82rem', color: '#4e24a8', marginTop: 2, fontWeight: 600 }}>{timeline.course} · {timeline.unitCount} units</p>
        </div>
        <div className="timeline-health-legend">
          <span className="health on-track">On track</span>
          <span className="health at-risk">Needs attention</span>
          <span className="health behind">Behind</span>
        </div>
      </div>

      <div className="timeline-explainer">
        <article>
          <strong>{timeline.actualOverall}% actual mastery</strong>
          <p>Concepts marked “Knows it” out of all {timeline.course} concepts in scope.</p>
        </article>
        <article>
          <strong>{timeline.expectedOverall}% pacing target</strong>
          <p>Target is the permanent baseline needed to master everything by {formatShortDate(timeline.goal.end)}.</p>
        </article>
        <article>
          <strong>Color meaning</strong>
          <p>Green is within 10 points of target, yellow is 11-30 points behind, red is more than 30 points behind.</p>
        </article>
      </div>

      {!hasActivity && (
        <div className="empty-timeline">
          Check off a concept as taught, known, or reviewed in the Progress Tracker and it will appear here automatically.
        </div>
      )}

      <div className="timeline-board">
        <div className="timeline-months">
          <span />
          <div className="month-axis">
            <div className="today-header-marker" style={{ left: `${clampedTodayLeft}%` }}>
              <span>Today</span>
            </div>
            {timeline.months.map((month) => (
              <span
                key={month.toISOString()}
                style={{ left: `${((month.getTime() - timeline.start.getTime()) / timeline.span) * 100}%` }}
              >
                {formatMonth(month)}
              </span>
            ))}
          </div>
        </div>

        <div className="timeline-body">
          <div className="today-line" style={{ left: `${clampedTodayLeft}%` }} />

          {timeline.rows.map((row) => {
            const left = row.start ? ((row.start.getTime() - timeline.start.getTime()) / timeline.span) * 100 : 0
            const width = row.start && row.end ? Math.max(4, ((row.end.getTime() - row.start.getTime()) / timeline.span) * 100) : 0
            const plannedLeft = ((row.plannedStart.getTime() - timeline.start.getTime()) / timeline.span) * 100
            const plannedWidth = Math.max(4, ((row.plannedEnd.getTime() - row.plannedStart.getTime()) / timeline.span) * 100)
            const diagnosticLinks = unitDiagnosticLinks[row.unit.id] || []

            return (
              <div className="timeline-row" key={row.unit.id}>
                <div className="timeline-label">
                  <strong>{row.unit.unit}</strong>
                  <span>{row.unit.title}</span>
                  <em>
                    {row.taughtCount}/{row.unit.concepts.length} taught · {row.knowsCount}/{row.unit.concepts.length} known · {row.reviewedCount}/
                    {row.unit.concepts.length} reviewed
                  </em>
                  <em>
                    Target: {row.expectedByToday}% by today · {row.paceGap >= 0 ? '+' : ''}
                    {row.paceGap} pts vs pace
                  </em>
                  {diagnosticLinks.length > 0 && (
                    <div className="timeline-diagnostic-links" aria-label={`${row.unit.title} diagnostic links`}>
                      <b>Diagnostic:</b>
                      {diagnosticLinks.map((link) => (
                        <button key={`${row.unit.id}-${link.id}`} type="button" onClick={() => onOpenDiagnosticQuestion(link.id)}>
                          Q{link.id}{link.hardId ? `/Q${link.hardId}` : ''}: {link.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="timeline-track">
                  <div className="timeline-plan-bar" style={{ left: `${plannedLeft}%`, width: `${plannedWidth}%` }}>
                    <span>Goal</span>
                    <em>
                      {formatCompactDate(row.plannedStart)}-{formatCompactDate(row.plannedEnd)}
                    </em>
                  </div>
                  {row.start ? (
                    <div
                      className={`timeline-bar ${row.paceHealth}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      title={`Actual work logged ${formatCompactDate(row.start)}-${formatCompactDate(row.end)}. ${row.score}% known.`}
                    >
                      <strong>{row.score}%</strong>
                    </div>
                  ) : (
                    <span className="timeline-placeholder">No logged work yet</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {timeline.milestones.length > 0 && (
          <div className="timeline-milestones">
            <strong>Milestones</strong>
            <div className="milestone-track-wrapper">
              <div className="milestone-track">
                {timeline.milestones.map((milestone, index) => (
                  <span
                    className="milestone"
                    key={`${milestone.label}-${milestone.date.toISOString()}`}
                    style={{ left: `${milestone.left}%` }}
                    title={`${milestone.label} — ${formatCompactDate(milestone.date)}`}
                  >
                    <b className={milestone.complete ? 'complete' : ''}>{index + 1}</b>
                  </span>
                ))}
              </div>
              <div className="milestone-legend">
                {timeline.milestones.map((milestone, index) => (
                  <span className={`milestone-legend-item${milestone.complete ? ' complete' : ''}`} key={index}>
                    <b>{index + 1}</b>
                    <span>{milestone.label}</span>
                    <small>{formatCompactDate(milestone.date)}</small>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function GraphSvg({
  data,
  expression,
  hoverPoint,
  setGraphWindow,
  setHoverIndex,
  approxMethod,
  approxN,
  approxA,
  approxB,
  eulerY0,
  showDerivative,
  showIntegral,
  xMin,
  xMax,
  yMin,
  yMax,
}) {
  const width = 1120
  const height = 520
  const dragRef = useRef(null)
  const xAxis = yMin <= 0 && yMax >= 0 ? height - ((0 - yMin) / (yMax - yMin)) * height : null
  const yAxis = xMin <= 0 && xMax >= 0 ? ((0 - xMin) / (xMax - xMin)) * width : null
  const fLines = buildPolyline(data, 'f', xMin, xMax, yMin, yMax, width, height)
  const derivativeLines = showDerivative ? buildPolyline(data, 'derivative', xMin, xMax, yMin, yMax, width, height) : []
  const integralLines = showIntegral ? buildPolyline(data, 'integral', xMin, xMax, yMin, yMax, width, height) : []
  const trigLabels = Math.abs(xMin) <= Math.PI * 6 && Math.abs(xMax) <= Math.PI * 6
  const xTicks = createAxisTicks(xMin, xMax, trigLabels)
  const yTicks = createAxisTicks(yMin, yMax)
  const xMinorTicks = createMinorTicks(xMin, xMax, xTicks, trigLabels ? 2 : 4)
  const yMinorTicks = createMinorTicks(yMin, yMax, yTicks, 4)
  const xScale = (x) => ((x - xMin) / (xMax - xMin)) * width
  const yScale = (y) => height - ((y - yMin) / (yMax - yMin)) * height
  const evaluator = useMemo(() => createEvaluator(expression), [expression])
  const fAt = (x) => {
    const value = Number(evaluator(x))
    return Number.isFinite(value) ? value : 0
  }
  const steps = Math.max(2, Math.min(40, Number.isFinite(approxN) ? approxN : 6))
  const approxStart = Number.isFinite(approxA) ? approxA : -2
  const approxEnd = Number.isFinite(approxB) && approxB > approxStart ? approxB : approxStart + 4
  const dxApprox = (approxEnd - approxStart) / steps
  const approximationShapes = Array.from({ length: steps }, (_, index) => {
    const left = approxStart + index * dxApprox
    const right = left + dxApprox
    const sample = approxMethod === 'right' ? right : approxMethod === 'midpoint' ? (left + right) / 2 : left
    const yLeft = fAt(left)
    const yRight = fAt(right)
    const ySample = fAt(sample)
    return { left, right, yLeft, yRight, ySample }
  })
  const eulerPoints = (() => {
    if (approxMethod !== 'euler') return []
    let y = Number.isFinite(eulerY0) ? eulerY0 : 1
    const points = [{ x: approxStart, y }]
    for (let i = 0; i < steps; i++) {
      const x = approxStart + i * dxApprox
      y += dxApprox * fAt(x)
      points.push({ x: x + dxApprox, y })
    }
    return points
  })()
  const numericalIntegral = (() => {
    const integrationSteps = 600
    const dx = (approxEnd - approxStart) / integrationSteps
    let total = 0

    for (let index = 0; index < integrationSteps; index++) {
      const left = approxStart + index * dx
      const right = left + dx
      total += ((fAt(left) + fAt(right)) / 2) * dx
    }

    return total
  })()
  const approximationArea = approximationShapes.reduce((sum, shape) => {
    if (approxMethod === 'trapezoid') return sum + ((shape.yLeft + shape.yRight) / 2) * (shape.right - shape.left)
    return sum + shape.ySample * (shape.right - shape.left)
  }, 0)
  const showAreaComparison = ['left', 'right', 'midpoint', 'trapezoid'].includes(approxMethod)
  const showApproxStart = approxMethod !== 'none' && xMin <= approxStart && xMax >= approxStart
  const showApproxEnd = approxMethod !== 'none' && xMin <= approxEnd && xMax >= approxEnd

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const xRatio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    setHoverIndex(Math.round(xRatio * (data.length - 1)))

    if (!dragRef.current) return
    const dx = ((event.clientX - dragRef.current.clientX) / rect.width) * (dragRef.current.xMax - dragRef.current.xMin)
    const dy = ((event.clientY - dragRef.current.clientY) / rect.height) * (dragRef.current.yMax - dragRef.current.yMin)
    setGraphWindow(dragRef.current.xMin - dx, dragRef.current.xMax - dx, dragRef.current.yMin + dy, dragRef.current.yMax + dy)
  }

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { clientX: event.clientX, clientY: event.clientY, xMin, xMax, yMin, yMax }
  }

  function handlePointerUp(event) {
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    dragRef.current = null
  }

  function zoom(factor, centerX = (xMin + xMax) / 2, centerY = (yMin + yMax) / 2) {
    const nextXRange = (xMax - xMin) * factor
    const nextYRange = (yMax - yMin) * factor
    const xRatio = (centerX - xMin) / (xMax - xMin)
    const yRatio = (centerY - yMin) / (yMax - yMin)
    const nextXMin = centerX - nextXRange * xRatio
    const nextXMax = nextXMin + nextXRange
    const nextYMin = centerY - nextYRange * yRatio
    const nextYMax = nextYMin + nextYRange
    setGraphWindow(nextXMin, nextXMax, nextYMin, nextYMax)
  }

  function handleWheel(event) {
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    const xRatio = (event.clientX - rect.left) / rect.width
    const yRatio = (event.clientY - rect.top) / rect.height
    const centerX = xMin + xRatio * (xMax - xMin)
    const centerY = yMax - yRatio * (yMax - yMin)
    zoom(event.deltaY > 0 ? 1.15 : 0.87, centerX, centerY)
  }

  return (
    <div className="graph-card">
      <div className="graph-toolbar">
        <span>Drag to pan · scroll to zoom · x-axis uses π labels for trig windows</span>
        <div>
          <button type="button" onClick={() => zoom(0.8)}>
            Zoom in
          </button>
          <button type="button" onClick={() => zoom(1.25)}>
            Zoom out
          </button>
        </div>
      </div>
      <svg
        onPointerDown={handlePointerDown}
        onPointerLeave={() => {
          setHoverIndex(null)
          dragRef.current = null
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
      >
        <rect width={width} height={height} rx="18" fill="#fffdf6" />
        {xMinorTicks.map((tick) => (
          <line className="minor-tick-line" key={`xm-${tick}`} x1={xScale(tick)} x2={xScale(tick)} y1="0" y2={height} />
        ))}
        {yMinorTicks.map((tick) => (
          <line className="minor-tick-line" key={`ym-${tick}`} x1="0" x2={width} y1={yScale(tick)} y2={yScale(tick)} />
        ))}
        {xTicks.map((tick) => (
          <g key={`x-${tick.value}`}>
            <line className="tick-line" x1={xScale(tick.value)} x2={xScale(tick.value)} y1="0" y2={height} />
            <text className="axis-label" x={xScale(tick.value)} y={height - 12} textAnchor="middle">
              {tick.label}
            </text>
          </g>
        ))}
        {yTicks.map((tick) => (
          <g key={`y-${tick.value}`}>
            <line className="tick-line" x1="0" x2={width} y1={yScale(tick.value)} y2={yScale(tick.value)} />
            <text className="axis-label" x="10" y={yScale(tick.value) - 5}>
              {tick.label}
            </text>
          </g>
        ))}
        {xAxis !== null && <line className="axis-line" x1="0" x2={width} y1={xAxis} y2={xAxis} />}
        {yAxis !== null && <line className="axis-line" x1={yAxis} x2={yAxis} y1="0" y2={height} />}
        {showApproxStart && (
          <line className="approx-start-line" x1={xScale(approxStart)} x2={xScale(approxStart)} y1="0" y2={height} />
        )}
        {showApproxEnd && (
          <line className="approx-start-line" x1={xScale(approxEnd)} x2={xScale(approxEnd)} y1="0" y2={height} />
        )}
        {approxMethod !== 'none' &&
          approxMethod !== 'trapezoid' &&
          approxMethod !== 'euler' &&
          approximationShapes.map((shape, index) => (
            <rect
              className="riemann-box"
              height={Math.abs(yScale(shape.ySample) - yScale(0))}
              key={`rect-${index}`}
              width={Math.abs(xScale(shape.right) - xScale(shape.left))}
              x={xScale(shape.left)}
              y={Math.min(yScale(shape.ySample), yScale(0))}
            />
          ))}
        {approxMethod === 'trapezoid' &&
          approximationShapes.map((shape, index) => (
            <polygon
              className="trapezoid-shape"
              key={`trap-${index}`}
              points={`${xScale(shape.left)},${yScale(0)} ${xScale(shape.left)},${yScale(shape.yLeft)} ${xScale(shape.right)},${yScale(
                shape.yRight,
              )} ${xScale(shape.right)},${yScale(0)}`}
            />
          ))}
        {approxMethod === 'euler' && eulerPoints.length > 1 && (
          <polyline className="euler-line" fill="none" points={eulerPoints.map((point) => `${xScale(point.x)},${yScale(point.y)}`).join(' ')} />
        )}
        {fLines.map((line, index) => (
          <polyline className="function-line" fill="none" key={`f-${index}`} points={line.join(' ')} />
        ))}
        {derivativeLines.map((line, index) => (
          <polyline className="derivative-line" fill="none" key={`d-${index}`} points={line.join(' ')} />
        ))}
        {(showIntegral || showAreaComparison) && integralLines.map((line, index) => (
          <polyline className="integral-line" fill="none" key={`i-${index}`} points={line.join(' ')} />
        ))}
      </svg>
      {showAreaComparison && (
        <div className="area-comparison">
          <article>
            <span>∫ from {formatReadout(approxStart)} to {formatReadout(approxEnd)} (numerical)</span>
            <strong>{formatReadout(numericalIntegral)}</strong>
            <p>Trapezoidal accumulation over the same interval drawn by the approximation.</p>
          </article>
          <article>
            <span>{formatApproxMethod(approxMethod)}</span>
            <strong>{formatReadout(approximationArea)}</strong>
            <p>
              {steps} subintervals, Δx = {formatReadout(dxApprox)}
            </p>
          </article>
          <article>
            <span>Approximation error</span>
            <strong>{formatReadout(approximationArea - numericalIntegral)}</strong>
            <p>Approximation minus numerical integral.</p>
          </article>
        </div>
      )}
      <div className="readout">
        {hoverPoint ? (
          <>
            <span>x: {hoverPoint.x.toFixed(3)}</span>
            <span>f(x): {formatReadout(hoverPoint.f)}</span>
            <span>f&apos;(x): {formatReadout(hoverPoint.derivative)}</span>
            <span>Integral: {formatReadout(hoverPoint.integral)}</span>
          </>
        ) : (
          <span>Move over the graph to inspect x, f(x), numerical derivative, and accumulated integral.</span>
        )}
      </div>
    </div>
  )
}

function formatReadout(value) {
  return value === null || !Number.isFinite(value) ? 'undefined' : value.toFixed(3)
}

export default APCalculusTutoringDashboard
