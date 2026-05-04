export const diagnosticQuestions = [
  {
    id: 1,
    source: 'AP Guide',
    concept: 'Limits, Continuity, and Asymptotes',
    prompt:
      'Easy: Evaluate lim as x -> 3 of (x^2 - 9)/(x - 3).\n\nHard: Define f(x) = (x^2 - 4)/(x - 2) for x < 2, ax + b for 2 <= x < 5, 10 for x = 5, and x + b for x > 5. Find a and b so that f is continuous at x = 2 and x = 5, or explain why impossible.',
  },
  {
    id: 2,
    source: 'AP Guide',
    concept: 'Definition of Derivative and Tangent Lines',
    prompt:
      'Easy: Use the limit definition to find f\'(x) for f(x) = x^2 + 1.\n\nHard: Let g(x) = sqrt(x + 5). Find the equation of the tangent line to g at x = 4 using the derivative.',
  },
  {
    id: 3,
    source: 'AP Guide',
    concept: 'Differentiation Rules',
    prompt:
      'Easy: Find d/dx [4x^5 - 3x^2 + 7e^x - sin x].\n\nHard: Find y\' if y = (x^2 sin x)/(e^x + 1).',
  },
  {
    id: 4,
    source: 'AP Guide',
    concept: 'Chain Rule and Composite Functions',
    prompt:
      'Easy: Differentiate f(x) = (3x^2 - 5)^7.\n\nHard: Find dy/dx for y = sin^3(2x^2 + 1).',
  },
  {
    id: 5,
    source: 'AP Guide',
    concept: 'Implicit Differentiation and Inverse Derivatives',
    prompt:
      'Easy: Find dy/dx if x^2 + y^2 = 25.\n\nHard: Let f be differentiable and invertible, with f(2) = 7 and f\'(2) = -3. Find (f^-1)\'(7).',
  },
  {
    id: 6,
    source: 'AP Guide',
    concept: 'Inverse Trig and Logarithmic Differentiation',
    prompt:
      'Easy: Differentiate y = arctan(5x).\n\nHard: Differentiate y = x^x, x > 0.',
  },
  {
    id: 7,
    source: 'AP Guide',
    concept: 'Higher-Order Derivatives and Motion',
    prompt:
      'Easy: A particle has position s(t) = t^3 - 6t^2 + 9t. Find velocity and acceleration.\n\nHard: For the same particle, determine when the particle is speeding up on 0 < t < 5.',
  },
  {
    id: 8,
    source: 'AP Guide',
    concept: 'Related Rates',
    prompt:
      'Easy: A circle\'s radius increases at 3 cm/s. How fast is its area increasing when r = 5?\n\nHard: A 10-foot ladder leans against a wall. The bottom slides away from the wall at 2 ft/s. How fast is the top sliding down when the bottom is 6 ft from the wall?',
  },
  {
    id: 9,
    source: 'AP Guide',
    concept: 'Linearization and Differentials',
    prompt:
      'Easy: Use linearization of f(x) = sqrt(x) at x = 4 to estimate sqrt(4.1).\n\nHard: The radius of a sphere is measured as 10 cm with possible error 0.05 cm. Estimate the maximum error in the volume.',
  },
  {
    id: 10,
    source: 'AP Guide',
    concept: "L'Hopital's Rule and Indeterminate Forms",
    prompt:
      'Easy: Evaluate lim as x -> 0 of (sin x)/x.\n\nHard: Evaluate lim as x -> 0+ of x ln x.',
  },
  {
    id: 11,
    source: 'AP Guide',
    concept: 'Mean Value Theorem, EVT, and Critical Points',
    prompt:
      'Easy: For f(x) = x^2 on [1, 3], find the value c guaranteed by the Mean Value Theorem.\n\nHard: Does the Mean Value Theorem apply to f(x) = |x - 1| on [0, 2]? Explain.',
  },
  {
    id: 12,
    source: 'AP Guide',
    concept: 'Increasing/Decreasing, Extrema, Concavity, Inflection',
    prompt:
      'Easy: Let f\'(x) = (x - 2)(x + 1). Determine where f is increasing.\n\nHard: Let f\'(x) = x^(2/3)(x - 4). Find the critical points and classify local extrema.',
  },
  {
    id: 13,
    source: 'AP Guide',
    concept: 'Curve Sketching and Optimization',
    prompt:
      'Easy: Find the absolute maximum and minimum of f(x) = x^2 - 4x + 1 on [0, 5].\n\nHard: A rectangle is inscribed under the parabola y = 12 - x^2 above the x-axis, symmetric about the y-axis. Find the maximum area.',
  },
  {
    id: 14,
    source: 'AP Guide',
    concept: 'Antiderivatives and Initial Value Problems',
    prompt:
      'Easy: Find integral (6x^2 - 4x + 3) dx.\n\nHard: Find f(x) if f\'\'(x) = 12x - 6, f\'(1) = 5, and f(0) = 2.',
  },
  {
    id: 15,
    source: 'AP Guide',
    concept: 'Riemann Sums, Trapezoids, and Definite Integrals',
    prompt:
      'Easy: Approximate integral from 0 to 4 of f(x) dx using a right Riemann sum with 4 equal subintervals, given f(0)=2, f(1)=5, f(2)=6, f(3)=4, f(4)=1.\n\nHard: Using the same table, approximate integral from 0 to 4 of f(x) dx using the trapezoidal rule with 4 subintervals.',
  },
  {
    id: 16,
    source: 'AP Guide',
    concept: 'Fundamental Theorem of Calculus and Accumulation',
    prompt:
      'Easy: Evaluate integral from 1 to 3 of (2x + 1) dx.\n\nHard: Let F(x) = integral from 2 to x^2 of cos(t^3) dt. Find F\'(x).',
  },
  {
    id: 17,
    source: 'AP Guide',
    concept: 'Integral Properties, Net Change, and Average Value',
    prompt:
      'Easy: The velocity of a particle is v(t) = 3t^2. Find its displacement from t = 0 to t = 2.\n\nHard: Find the average value of f(x) = x^2 + 1 on [1, 4].',
  },
  {
    id: 18,
    source: 'AP Guide',
    concept: 'Integration by Substitution',
    prompt:
      'Easy: Evaluate integral 2x(x^2 + 1)^5 dx.\n\nHard: Evaluate integral from 0 to 1 of x e^(x^2 + 3) dx.',
  },
  {
    id: 19,
    source: 'AP Guide',
    concept: 'Differential Equations, Slope Fields, and Separable Equations',
    prompt:
      'Easy: Verify that y = Ce^(2x) is a solution to dy/dx = 2y.\n\nHard: Solve dy/dx = xy, y(0) = 3.',
  },
  {
    id: 20,
    source: 'AP Guide',
    concept: "Euler's Method and Logistic Growth",
    prompt:
      'Easy: Use Euler\'s method with step size h = 0.5 to estimate y(1), given dy/dx = x + y and y(0) = 1.\n\nHard: A population satisfies dP/dt = 0.2P(1 - P/1000). For what population value is the population increasing fastest?',
  },
  {
    id: 21,
    source: 'AP Guide',
    concept: 'Area Between Curves',
    prompt:
      'Easy: Find the area between y = x + 2 and y = x^2 from x = 0 to x = 2.\n\nHard: Find the area enclosed by y = x^2 and y = 2x + 3.',
  },
  {
    id: 22,
    source: 'AP Guide',
    concept: 'Volumes: Cross Sections, Disk, Washer',
    prompt:
      'Easy: The base of a solid is the region under y = sqrt(x) from x = 0 to x = 4. Cross sections perpendicular to the x-axis are squares. Find the volume.\n\nHard: Find the volume obtained by rotating the region between y = x and y = x^2 about the x-axis.',
  },
  {
    id: 23,
    source: 'AP Guide',
    concept: 'Arc Length of a Function',
    prompt:
      'BC Only. Easy: Find the arc length of y = x on [0, 3].\n\nHard: Set up, but do not evaluate, the arc length of y = ln(cos x) on [0, pi/4].',
  },
  {
    id: 24,
    source: 'AP Guide',
    concept: 'Integration by Parts',
    prompt:
      'BC Only. Easy: Evaluate integral x e^x dx.\n\nHard: Evaluate integral from 0 to 1 of x ln(x + 1) dx.',
  },
  {
    id: 25,
    source: 'AP Guide',
    concept: 'Partial Fractions and Improper Integrals',
    prompt:
      'BC Only. Easy: Evaluate integral (5x + 1)/(x^2 - 1) dx.\n\nHard: Determine whether integral from 1 to infinity of 1/x^2 dx converges, and if so, evaluate it.',
  },
  {
    id: 26,
    source: 'AP Guide',
    concept: 'Parametric Equations',
    prompt:
      'BC Only. Easy: Given x = t^2 + 1 and y = t^3, find dy/dx at t = 2.\n\nHard: For x = t^2 and y = t^3 - 3t, find d^2y/dx^2 at t = 1.',
  },
  {
    id: 27,
    source: 'AP Guide',
    concept: 'Polar Coordinates and Polar Area',
    prompt:
      'BC Only. Easy: Find the area enclosed by one loop of r = 2 sin(theta) for 0 <= theta <= pi.\n\nHard: Set up the area inside r = 2 and outside r = 1 + cos(theta).',
  },
  {
    id: 28,
    source: 'AP Guide',
    concept: 'Vector-Valued Functions and Motion',
    prompt:
      'BC Only. Easy: A particle has position r(t) = <t^2, e^t>. Find velocity and acceleration.\n\nHard: A particle has velocity v(t) = <3t^2, 4t>. Find the distance traveled from t = 0 to t = 1.',
  },
  {
    id: 29,
    source: 'AP Guide',
    concept: 'Sequences and Geometric Series',
    prompt:
      'BC Only. Easy: Determine whether the sequence a_n = (3n + 1)/n converges. If it converges, find the limit.\n\nHard: Find the sum of the infinite series sum from n = 0 to infinity of 5(2/3)^n.',
  },
  {
    id: 30,
    source: 'AP Guide',
    concept: 'p-Series, Comparison, Limit Comparison, Ratio Test',
    prompt:
      'BC Only. Easy: Determine whether sum from n = 1 to infinity of 1/n^3 converges.\n\nHard: Determine whether sum from n = 1 to infinity of (n^2 + 1)/(n^4 + 3) converges.',
  },
  {
    id: 31,
    source: 'AP Guide',
    concept: 'Alternating Series and Error Bound',
    prompt:
      'BC Only. Easy: Determine whether sum from n = 1 to infinity of (-1)^(n+1)/n converges.\n\nHard: How many terms of sum from n = 1 to infinity of (-1)^(n+1)/n^2 are needed to approximate the sum with error less than 0.001?',
  },
  {
    id: 32,
    source: 'AP Guide',
    concept: 'Taylor Polynomials and Lagrange Error Bound',
    prompt:
      'BC Only. Easy: Find the degree 3 Maclaurin polynomial for e^x.\n\nHard: Use the degree 3 Maclaurin polynomial for sin x to approximate sin(0.2), and give an error bound using the alternating series estimate.',
  },
  {
    id: 33,
    source: 'AP Guide',
    concept: 'Power Series: Radius and Interval of Convergence',
    prompt:
      'BC Only. Easy: Find the radius of convergence of sum from n = 0 to infinity of x^n/3^n.\n\nHard: Find the interval of convergence for sum from n = 1 to infinity of (x - 2)^n/(n3^n).',
  },
  {
    id: 34,
    source: 'AP Guide',
    concept: 'Taylor Series Representation and Manipulation',
    prompt:
      'BC Only. Easy: Use the geometric series to write a power series for 1/(1 - x).\n\nHard: Find a power series for x^2/(1 + 2x) and state its interval of convergence.',
  },
]

export const diagnosticAnswerNotes = [
  'Student-facing diagnostic cards show only the problem prompts and completion status buttons.',
  'Worked answers and AP gotchas are intentionally available only from the Tutor/Admin answer key.',
  'Each diagnostic item contains the easy and hard problem from the matching concept cluster in the AP Calculus AB + BC Concept Practice Guide.',
]

export const diagnosticSolutions = {
  1: ['Easy answer: 6.', 'Hard answer: impossible.', 'Continuity at x = 2 gives 2a + b = 4. Continuity at x = 5 requires 5a + b = 10 and 5 + b = 10, so b = 5 and a = -1/2 from the first equation. That fails 5a + b = 10.', 'AP gotcha: continuity requires left limit, right limit, and function value to match.'],
  2: ['Easy answer: f\'(x) = 2x.', 'Hard answer: y - 3 = (1/6)(x - 4).', 'Use g\'(x) = 1/(2sqrt(x + 5)), so g\'(4) = 1/6 and g(4) = 3.', 'AP gotcha: tangent line needs both slope and point.'],
  3: ['Easy answer: 20x^4 - 6x + 7e^x - cos x.', 'Hard answer: [(2x sin x + x^2 cos x)(e^x + 1) - x^2e^x sin x]/(e^x + 1)^2.', 'Use product rule on the numerator and quotient rule on the full fraction.', 'AP gotcha: numerator order in the quotient rule matters.'],
  4: ['Easy answer: 42x(3x^2 - 5)^6.', 'Hard answer: 12x sin^2(2x^2 + 1) cos(2x^2 + 1).', 'Both require outer derivative times inner derivative.', 'AP gotcha: powers of trig functions often hide multiple chain rules.'],
  5: ['Easy answer: dy/dx = -x/y.', 'Hard answer: -1/3.', 'For the inverse derivative, (f^-1)\'(7) = 1/f\'(f^-1(7)) = 1/f\'(2).', 'AP gotcha: evaluate f\' at the input 2, not at 7.'],
  6: ['Easy answer: 5/(1 + 25x^2).', 'Hard answer: x^x(ln x + 1).', 'For x^x, take logs: ln y = x ln x, then y\'/y = ln x + 1.', 'AP gotcha: x^x is not a basic power-rule or exponential-rule problem.'],
  7: ['Easy answer: v(t) = 3t^2 - 12t + 9 and a(t) = 6t - 12.', 'Hard answer: (1, 2) union (3, 5).', 'A particle speeds up when velocity and acceleration have the same sign.', 'AP gotcha: speeding up does not mean v > 0.'],
  8: ['Easy answer: 30pi cm^2/s.', 'Hard answer: -3/2 ft/s.', 'Use A = pi r^2 for the circle. For the ladder, x^2 + y^2 = 100, so dy/dt = -(x/y)(dx/dt); when x = 6, y = 8.', 'AP gotcha: the negative sign means the top is moving down.'],
  9: ['Easy answer: sqrt(4.1) is approximately 2.025.', 'Hard answer: maximum volume error is approximately 20pi cm^3.', 'Use L(x) = 2 + (1/4)(x - 4). For the sphere, dV = 4pi r^2 dr.', 'AP gotcha: differentials estimate change; they are not exact delta values.'],
  10: ['Easy answer: 1.', 'Hard answer: 0.', 'Rewrite x ln x as (ln x)/(1/x), apply L\'Hopital, and get lim as x -> 0+ of -x = 0.', 'AP gotcha: L\'Hopital applies only after rewriting into 0/0 or infinity/infinity form.'],
  11: ['Easy answer: c = 2.', 'Hard answer: no, MVT does not apply because f is not differentiable at x = 1.', 'MVT requires continuity on the closed interval and differentiability on the open interval.', 'AP gotcha: continuity alone is not enough.'],
  12: ['Easy answer: increasing on (-infinity, -1) union (2, infinity).', 'Hard answer: critical points are x = 0 and x = 4; local minimum at x = 4; no extremum at x = 0.', 'Check sign changes of f\'.', 'AP gotcha: a critical point is not automatically a maximum or minimum.'],
  13: ['Easy answer: absolute minimum -3 at x = 2; absolute maximum 6 at x = 5.', 'Hard answer: maximum area 32.', 'For optimization, A(x) = 2x(12 - x^2) = 24x - 2x^3, so A\'(x) = 24 - 6x^2 and x = 2.', 'AP gotcha: the rectangle width is 2x, not x.'],
  14: ['Easy answer: 2x^3 - 2x^2 + 3x + C.', 'Hard answer: f(x) = 2x^3 - 3x^2 + 5x + 2.', 'Integrate f\'\' once, use f\'(1) = 5, integrate again, then use f(0) = 2.', 'AP gotcha: each integration introduces a new constant.'],
  15: ['Easy answer: 16.', 'Hard answer: 33/2.', 'Right sum uses x = 1, 2, 3, 4. Trapezoid formula is (Delta x/2)[f(0) + 2f(1) + 2f(2) + 2f(3) + f(4)].', 'AP gotcha: first and last values are not doubled in the trapezoidal rule.'],
  16: ['Easy answer: 10.', 'Hard answer: F\'(x) = 2x cos(x^6).', 'Use FTC plus chain rule for the variable upper limit x^2.', 'AP gotcha: do not try to integrate cos(t^3).'],
  17: ['Easy answer: displacement = 8.', 'Hard answer: average value = 8.', 'Average value is (1/(b - a)) times the definite integral.', 'AP gotcha: average value is not the average of endpoint values.'],
  18: ['Easy answer: (x^2 + 1)^6/6 + C.', 'Hard answer: (e^4 - e^3)/2.', 'Use u = x^2 + 1 for the first and u = x^2 + 3 for the second.', 'AP gotcha: with definite integrals, change bounds or substitute back, but do not mix methods.'],
  19: ['Easy answer: verified.', 'Hard answer: y = 3e^(x^2/2).', 'Separate variables: (1/y)dy = x dx, integrate, exponentiate, and use y(0) = 3.', 'AP gotcha: after ln|y|, the constant becomes multiplicative after exponentiating.'],
  20: ['Easy answer: y(1) is approximately 2.5.', 'Hard answer: P = 500.', 'Euler steps: y(0.5) = 1.5, then y(1) = 2.5. Logistic growth is fastest at half the carrying capacity.', 'AP gotcha: fastest logistic growth is not at the carrying capacity.'],
  21: ['Easy answer: 10/3.', 'Hard answer: 32/3.', 'Use top minus bottom and solve intersections for the enclosed region.', 'AP gotcha: always solve for intersections unless bounds are explicitly given.'],
  22: ['Easy answer: 8.', 'Hard answer: 2pi/15.', 'Square cross sections have area x. Washer volume is pi integral from 0 to 1 of (x^2 - x^4) dx.', 'AP gotcha: washer setup is outer radius squared minus inner radius squared.'],
  23: ['Easy answer: 3sqrt(2).', 'Hard answer: integral from 0 to pi/4 of sqrt(1 + tan^2 x) dx, equivalently integral of sec x dx.', 'Use arc length L = integral sqrt(1 + (y\')^2) dx.', 'AP gotcha: if the prompt says set up, do not evaluate.'],
  24: ['Easy answer: e^x(x - 1) + C.', 'Hard answer: 1/4.', 'Use integration by parts. The hard problem also requires dividing x^2 by x + 1 after parts.', 'AP gotcha: integration by parts often creates a second algebra step.'],
  25: ['Easy answer: 3ln|x - 1| + 2ln|x + 1| + C.', 'Hard answer: converges to 1.', 'Use partial fractions for the first. Use a limit for the improper integral.', 'AP gotcha: infinite bounds require limits.'],
  26: ['Easy answer: dy/dx = 3 at t = 2.', 'Hard answer: d^2y/dx^2 = 3/2 at t = 1.', 'For second parametric derivative, differentiate dy/dx with respect to t, then divide by dx/dt.', 'AP gotcha: d^2y/dx^2 is not (d^2y/dt^2)/(d^2x/dt^2).'],
  27: ['Easy answer: pi.', 'Hard answer: (1/2) integral from 0 to 2pi of [4 - (1 + cos theta)^2] dtheta.', 'Use polar area A = (1/2) integral r^2 dtheta.', 'AP gotcha: inside one polar curve and outside another means outer radius squared minus inner radius squared.'],
  28: ['Easy answer: v(t) = <2t, e^t> and a(t) = <2, e^t>.', 'Hard answer: 61/27.', 'Distance is integral of speed: integral from 0 to 1 of sqrt(9t^4 + 16t^2) dt = integral t sqrt(9t^2 + 16) dt.', 'AP gotcha: distance traveled uses speed, not velocity components added separately.'],
  29: ['Easy answer: converges to 3.', 'Hard answer: 15.', 'Rewrite a_n = 3 + 1/n. The series is geometric with first term 5 and ratio 2/3.', 'AP gotcha: geometric series converge only when |r| < 1.'],
  30: ['Easy answer: converges.', 'Hard answer: converges.', 'The easy problem is a p-series with p = 3. The hard problem limit-compares to 1/n^2.', 'AP gotcha: the nth-term test can prove divergence only, not convergence.'],
  31: ['Easy answer: converges.', 'Hard answer: 31 terms.', 'Alternating harmonic converges by AST. For error less than 0.001, require 1/(N + 1)^2 < 0.001, so N >= 31.', 'AP gotcha: alternating error is bounded by the first omitted term.'],
  32: ['Easy answer: 1 + x + x^2/2 + x^3/6.', 'Hard answer: sin(0.2) is approximately 0.198667 with error at most 2.667 x 10^-6.', 'Use sin x approximately x - x^3/6 and the next omitted term x^5/5!.', 'AP gotcha: the next-term alternating estimate applies only when alternating-series conditions hold.'],
  33: ['Easy answer: R = 3.', 'Hard answer: interval [-1, 5).', 'Use geometric form for the first and ratio test for the second, then test endpoints.', 'AP gotcha: ratio test gives the open interval only; endpoints require separate tests.'],
  34: ['Easy answer: sum from n = 0 to infinity of x^n, |x| < 1.', 'Hard answer: sum from n = 0 to infinity of (-2)^n x^(n + 2), -1/2 < x < 1/2.', 'Use 1/(1 - r) = sum r^n with r = x or r = -2x.', 'AP gotcha: multiplying by x^2 shifts powers but does not change the geometric convergence condition except possible endpoints.'],
}
