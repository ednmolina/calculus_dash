const conceptRows = [
  ['u1', 'Unit 1', 'Estimating limits from graphs/tables'],
  ['u1', 'Unit 1', 'Algebraic limits: factoring, rationalizing, trig limits'],
  ['u1', 'Unit 1', 'One-sided limits and discontinuities'],
  ['u1', 'Unit 1', 'Continuity at a point and on an interval'],
  ['u1', 'Unit 1', 'Infinite limits and vertical asymptotes'],
  ['u1', 'Unit 1', 'Limits at infinity and horizontal asymptotes'],
  ['u1', 'Unit 1', 'Intermediate Value Theorem'],
  ['u2', 'Unit 2', 'Average vs. instantaneous rate of change'],
  ['u2', 'Unit 2', 'Definition of derivative'],
  ['u2', 'Unit 2', 'Tangent and normal lines'],
  ['u2', 'Unit 2', 'Power, constant multiple, sum/difference rules'],
  ['u2', 'Unit 2', 'Derivatives of exponential functions'],
  ['u2', 'Unit 2', 'Product and quotient rules'],
  ['u2', 'Unit 2', 'Derivatives of sine, cosine, tangent, cotangent, secant, cosecant'],
  ['u3', 'Unit 3', 'Chain rule'],
  ['u3', 'Unit 3', 'Implicit differentiation'],
  ['u3', 'Unit 3', 'Derivatives of inverse functions'],
  ['u3', 'Unit 3', 'Derivatives of inverse trigonometric functions'],
  ['u3', 'Unit 3', 'Selecting derivative techniques'],
  ['u3', 'Unit 3', 'Higher-order derivatives'],
  ['u3', 'Unit 3', 'Logarithmic differentiation'],
  ['u4', 'Unit 4', 'Derivatives as rates of change in context'],
  ['u4', 'Unit 4', 'Position, velocity, acceleration'],
  ['u4', 'Unit 4', 'Speed vs. velocity'],
  ['u4', 'Unit 4', 'Related rates'],
  ['u4', 'Unit 4', 'Local linearity and linearization'],
  ['u4', 'Unit 4', 'Differentials'],
  ['u4', 'Unit 4', "L'Hopital's Rule"],
  ['u5', 'Unit 5', 'Mean Value Theorem'],
  ['u5', 'Unit 5', 'Extreme Value Theorem'],
  ['u5', 'Unit 5', 'Critical points'],
  ['u5', 'Unit 5', 'Increasing/decreasing intervals'],
  ['u5', 'Unit 5', 'First Derivative Test'],
  ['u5', 'Unit 5', 'Concavity and inflection points'],
  ['u5', 'Unit 5', 'Second Derivative Test'],
  ['u5', 'Unit 5', 'Curve sketching'],
  ['u5', 'Unit 5', 'Optimization'],
  ['u6', 'Unit 6', 'Antiderivatives and indefinite integrals'],
  ['u6', 'Unit 6', 'Definite integrals as signed area'],
  ['u6', 'Unit 6', 'Riemann sums and summation notation'],
  ['u6', 'Unit 6', 'Trapezoidal approximation'],
  ['u6', 'Unit 6', 'Fundamental Theorem of Calculus, Part 1'],
  ['u6', 'Unit 6', 'Fundamental Theorem of Calculus, Part 2'],
  ['u6', 'Unit 6', 'Accumulation functions'],
  ['u6', 'Unit 6', 'Net change theorem'],
  ['u6', 'Unit 6', 'Definite integral properties'],
  ['u6', 'Unit 6', 'Integration by substitution'],
  ['u6', 'Unit 6', 'Long division before integrating rational functions'],
  ['u6', 'Unit 6', 'Integration by parts'],
  ['u6', 'Unit 6', 'Partial fractions'],
  ['u6', 'Unit 6', 'Improper integrals'],
  ['u6', 'Unit 6', 'Choosing an integration technique'],
  ['u7', 'Unit 7', 'Slope fields'],
  ['u7', 'Unit 7', 'Verifying solutions'],
  ['u7', 'Unit 7', 'Separable differential equations'],
  ['u7', 'Unit 7', 'Particular solutions'],
  ['u7', 'Unit 7', 'Exponential growth and decay'],
  ['u7', 'Unit 7', 'Logistic growth'],
  ['u7', 'Unit 7', "Euler's method"],
  ['u8', 'Unit 8', 'Average value of a function'],
  ['u8', 'Unit 8', 'Particle motion using integrals'],
  ['u8', 'Unit 8', 'Accumulation in applied contexts'],
  ['u8', 'Unit 8', 'Area between curves'],
  ['u8', 'Unit 8', 'Volume by cross sections'],
  ['u8', 'Unit 8', 'Disk method'],
  ['u8', 'Unit 8', 'Washer method'],
  ['u8', 'Unit 8', 'Volume around non-axis lines'],
  ['u8', 'Unit 8', 'Arc length of a function'],
  ['u9', 'Unit 9', 'Parametric derivatives'],
  ['u9', 'Unit 9', 'Second derivatives for parametric curves'],
  ['u9', 'Unit 9', 'Parametric area'],
  ['u9', 'Unit 9', 'Parametric arc length'],
  ['u9', 'Unit 9', 'Polar coordinates and graph interpretation'],
  ['u9', 'Unit 9', 'Polar slope'],
  ['u9', 'Unit 9', 'Polar area'],
  ['u9', 'Unit 9', 'Polar arc length'],
  ['u9', 'Unit 9', 'Vector-valued position, velocity, acceleration'],
  ['u9', 'Unit 9', 'Vector-valued speed, distance, and displacement'],
  ['u10', 'Unit 10', 'Sequence convergence'],
  ['u10', 'Unit 10', 'Geometric series'],
  ['u10', 'Unit 10', 'Harmonic and p-series'],
  ['u10', 'Unit 10', 'Comparison and limit comparison tests'],
  ['u10', 'Unit 10', 'Alternating series test and error bound'],
  ['u10', 'Unit 10', 'Ratio test'],
  ['u10', 'Unit 10', 'Absolute vs. conditional convergence'],
  ['u10', 'Unit 10', 'Taylor polynomials'],
  ['u10', 'Unit 10', 'Lagrange error bound'],
  ['u10', 'Unit 10', 'Power series radius and interval of convergence'],
  ['u10', 'Unit 10', 'Taylor/Maclaurin series'],
  ['u10', 'Unit 10', 'Using series to approximate values'],
]

const handcrafted = {
  'Estimating limits from graphs/tables': [
    ['A table gives f(1.9)=5.8, f(1.99)=5.98, f(2.01)=6.02, and f(2.1)=6.2. Estimate lim as x -> 2 of f(x).', '6', ['2', '5.8', 'Does not exist'], 'Values from both sides approach 6.', 'Use nearby values from both sides.'],
    ['A graph approaches y=-1 from the left of x=3 and y=4 from the right. What is lim as x -> 3 of f(x)?', 'Does not exist', ['-1', '4', '3/2'], 'The one-sided limits are unequal.', 'Do not average one-sided limits.'],
  ],
  'Algebraic limits: factoring, rationalizing, trig limits': [
    ['Evaluate lim as x -> 4 of (x^2 - 16)/(x - 4).', '8', ['0', '4', 'Does not exist'], 'Factor and cancel x-4.', '0/0 often means simplify first.'],
    ['Evaluate lim as x -> 0 of (sqrt(x+9)-3)/x.', '1/6', ['0', '1/3', '6'], 'Rationalize to get 1/(sqrt(x+9)+3).', 'Use the conjugate for radical 0/0 forms.'],
  ],
  'One-sided limits and discontinuities': [
    ['For f(x)=2x+1 when x<1 and f(x)=5 when x>=1, find lim as x -> 1- of f(x).', '3', ['5', '1', 'Does not exist'], 'Use the left branch, 2x+1.', 'One-sided limits use only one side.'],
    ['For f(x)=x+2 when x<0 and f(x)=x^2+1 when x>0, what is true at x=0?', 'The two-sided limit does not exist.', ['The limit is 1.', 'The limit is 2.', 'The function is continuous.'], 'The left limit is 2 and right limit is 1.', 'Piecewise limits need both sides.'],
  ],
  'Continuity at a point and on an interval': [
    ['What value of k makes f continuous at x=2 if f(x)=(x^2-4)/(x-2) for x not equal to 2 and f(2)=k?', '4', ['0', '2', 'Does not exist'], 'The simplified limit is x+2, so the limit is 4.', 'Continuity requires f(a)=lim f(x).'],
    ['A function has lim as x -> 5 of f(x)=7 and f(5)=9. What issue occurs?', 'Removable discontinuity', ['Continuous', 'Jump discontinuity', 'Vertical asymptote'], 'The limit exists but does not equal the function value.', 'A defined point alone does not guarantee continuity.'],
  ],
  'Infinite limits and vertical asymptotes': [
    ['As x -> 3+, what happens to 1/(x-3)?', 'infinity', ['-infinity', '0', '3'], 'The denominator is small and positive.', 'Sign matters for infinite limits.'],
    ['Which listed x-value is a vertical asymptote of (x+1)/(x^2-9)?', 'x = 3', ['x = 1', 'x = 0', 'x = 9'], 'The denominator factors as (x-3)(x+3).', 'Vertical asymptotes come from uncanceled denominator zeros.'],
  ],
  'Limits at infinity and horizontal asymptotes': [
    ['Evaluate lim as x -> infinity of (3x^2+1)/(x^2-5).', '3', ['0', '1', 'infinity'], 'Use the ratio of leading coefficients.', 'Equal degrees give leading-coefficient ratio.'],
    ['What is the horizontal asymptote of y=(2x-7)/(5x+1)?', 'y = 2/5', ['y = 5/2', 'x = -1/5', 'y = 0'], 'The degrees match, so use 2/5.', 'Do not confuse vertical and horizontal asymptotes.'],
  ],
  'Intermediate Value Theorem': [
    ['If f is continuous on [1,4], f(1)=2, and f(4)=10, which value must occur on (1,4)?', '7', ['0', '12', '-1'], '7 is between 2 and 10.', 'IVT requires continuity.'],
    ['Why can IVT prove x^3+x-5=0 has a solution on [1,2]?', 'The polynomial is continuous and changes sign.', ['The derivative is positive.', 'The endpoints are equal.', 'The function is discontinuous.'], 'f(1)=-3 and f(2)=5, with continuity.', 'IVT proves existence, not exact location.'],
  ],
}

function genericProblem(unitId, concept, index, difficulty) {
  const n = (index % 5) + 2
  const k = index + 2
  const hard = difficulty === 'hard'
  const c = concept.toLowerCase()

  if (c.includes('derivative') || c.includes('differentiation') || c.includes('tangent') || c.includes('chain') || c.includes('implicit') || c.includes('rate') || c.includes('velocity') || c.includes('acceleration')) {
    if (c.includes('implicit')) return hard
      ? [`If xy + y^2 = ${n}, what is dy/dx?`, '-y/(x+2y)', ['-x/(y+2x)', '-y/x', 'y/(x+2y)'], 'Differentiate xy with product rule and y^2 with chain rule.', 'Every y derivative needs dy/dx.']
      : [`If x^2 + y^2 = ${n * n}, what is dy/dx?`, '-x/y', ['x/y', '-y/x', '2x+2y'], 'Differentiate both sides and solve for dy/dx.', 'Do not forget dy/dx on y terms.']
    if (c.includes('inverse function')) return hard
      ? [`If f(3)=10 and f'(3)=-2, what is (f^-1)'(10)?`, '-1/2', ['-2', '1/2', '3'], 'Use 1/f\'(f^-1(10)).', 'Evaluate f\' at the original input.']
      : [`If f(2)=5 and f'(2)=4, what is (f^-1)'(5)?`, '1/4', ['4', '2', '5'], 'Since f^-1(5)=2, use 1/f\'(2).', 'Do not plug 5 into f\'.']
    if (c.includes('inverse trigonometric')) return hard
      ? ['Differentiate arcsin(3x).', '3/sqrt(1-9x^2)', ['1/sqrt(1-9x^2)', '3/(1+9x^2)', '-3/sqrt(1-9x^2)'], 'Use the arcsin derivative and chain rule.', 'Include the inside derivative.']
      : ['Differentiate arctan x.', '1/(1+x^2)', ['1/sqrt(1-x^2)', '-1/sqrt(1-x^2)', '1/(1-x^2)'], 'Use the arctangent derivative rule.', 'Inverse trig rules are easy to mix up.']
    if (c.includes('logarithmic')) return hard
      ? ['Differentiate y=x^x for x>0.', 'x^x(ln x+1)', ['x^x ln x', 'x*x^(x-1)', 'x^(x-1)'], 'Take logs: ln y = x ln x.', 'x^x is not a simple power rule.']
      : ['Differentiate ln(x^2+1).', '2x/(x^2+1)', ['1/(x^2+1)', 'ln(2x)', '2xln(x^2+1)'], 'Use d/dx ln u = u\'/u.', 'Log derivatives require chain rule.']
    if (c.includes('higher-order')) return hard
      ? ['If s(t)=t^4-2t^2, what is s\'\'(t)?', '12t^2-4', ['4t^3-4t', '12t^2', '24t'], 'Differentiate twice.', 'Second derivative is not the square of the first.']
      : ['If f(x)=x^3, what is f\'\'(x)?', '6x', ['3x^2', '6', 'x^2'], 'Differentiate f twice.', 'Track derivative order.']
    if (c.includes('exponential')) return hard
      ? ['Differentiate 3(2^x).', '3(2^x)ln2', ['6x', '3(2^x)', '2^x ln3'], 'Use d/dx a^x = a^x ln a.', 'Only e^x differentiates to itself.']
      : ['Differentiate 7e^x.', '7e^x', ['7xe^(x-1)', 'e^7', '7e^(x-1)'], 'e^x is its own derivative.', 'Keep the constant multiple.']
    if (c.includes('product') || c.includes('quotient') || c.includes('selecting')) return hard
      ? ['Differentiate y=x/(x+1).', '1/(x+1)^2', ['0', 'x/(x+1)^2', '(x+1)^2'], 'Use quotient rule and simplify.', 'Keep the numerator order.']
      : ['Differentiate y=x^2 sin x.', '2x sin x + x^2 cos x', ['2x cos x', 'x^2 cos x', '2x sin x - x^2 cos x'], 'Use product rule.', 'Do not multiply derivatives only.']
    if (c.includes('trigonometric') || c.includes('sine')) return hard
      ? ['Differentiate tan x + sec x.', 'sec^2 x + sec x tan x', ['sec x + tan x', 'sec^2 x - sec x tan x', 'csc^2 x + sec x tan x'], 'Use trig derivative rules.', 'Do not confuse sec and csc derivatives.']
      : ['Differentiate sin x - cos x.', 'cos x + sin x', ['cos x - sin x', '-cos x + sin x', '-sin x - cos x'], 'Differentiate term by term.', 'The derivative of -cos x is +sin x.']
    if (c.includes('speed')) return hard
      ? ['A particle speeds up when which signs match?', 'v and a have the same sign', ['v is positive', 'a is positive', 'position and velocity have same sign'], 'Speed increases when velocity and acceleration have the same sign.', 'Positive velocity alone is not enough.']
      : ['If v(t)=-5, what is speed?', '5', ['-5', '0', '25'], 'Speed is |v|.', 'Speed cannot be negative.']
    return hard
      ? [`For y=${k}x^${n}+${n}x, what is the tangent slope at x=1?`, String(k * n + n), [String(k + n), String(k * n), String(k * n * n)], 'Differentiate and evaluate at x=1.', 'Slope comes from the derivative, not y.']
      : [`Differentiate ${k}x^${n}.`, `${k * n}x^${n - 1}`, [`${k}x^${n - 1}`, `${k * n}x^${n}`, `${n}x^${k}`], 'Apply the power rule.', 'Reduce the exponent by 1.']
  }

  if (c.includes('integral') || c.includes('integration') || c.includes('integrating') || c.includes('accumulation') || c.includes('riemann') || c.includes('trapezoidal') || c.includes('area') || c.includes('volume') || c.includes('arc length') || c.includes('net change') || c.includes('average value')) {
    if (c.includes('riemann')) return hard
      ? ['Using right endpoints for f(0)=2,f(1)=5,f(2)=6 on [0,2] with two intervals, what is the sum?', '11', ['7', '13', '6'], 'Right endpoints are x=1 and x=2, so 5+6=11.', 'Use the requested sample points.']
      : ['For two equal subintervals on [0,4], what is Delta x?', '2', ['1', '4', '8'], 'Delta x=(4-0)/2.', 'Width is interval length divided by number of subintervals.']
    if (c.includes('trapezoidal')) return hard
      ? ['For f(0)=2,f(1)=5,f(2)=6, trapezoidal approximation on [0,2] is what?', '9', ['11', '13', '6'], 'T=(1/2)[2+2(5)+6]=9.', 'Interior values are doubled.']
      : ['In trapezoidal rule, which values are not doubled?', 'The first and last values', ['All values', 'Only the middle values', 'No values'], 'Endpoints have coefficient 1.', 'Do not double endpoints.']
    if (c.includes('parts')) return hard
      ? ['Evaluate integral x e^x dx.', 'e^x(x-1)+C', ['xe^x+C', 'e^x+C', 'e^x(x+1)+C'], 'Use u=x and dv=e^x dx.', 'Integration by parts creates a second integral.']
      : ['Which formula is integration by parts?', 'integral u dv = uv - integral v du', ['integral u dv = uv + integral v du', 'integral f(g)g\' = f(g)', 'integral 1/x dx = x^2/2'], 'Recall the parts formula.', 'The sign is minus.']
    if (c.includes('partial')) return hard
      ? ['Decompose 5x+1 over (x-1)(x+1). What are A and B for A/(x-1)+B/(x+1)?', 'A=3, B=2', ['A=2, B=3', 'A=5, B=1', 'A=1, B=5'], 'Solve A+B=5 and A-B=1.', 'Match coefficients after clearing denominators.']
      : ['Before partial fractions, what should you do to x^2-1?', 'Factor it as (x-1)(x+1)', ['Expand it', 'Set x=0', 'Differentiate it'], 'Partial fractions require factored denominators.', 'Factor first.']
    if (c.includes('improper')) return hard
      ? ['Determine integral from 1 to infinity of 1/x^2 dx.', 'Converges to 1', ['Diverges', 'Converges to 0', 'Converges to 2'], 'Use a limit: [-1/x] from 1 to b, then b->infinity.', 'Infinite bounds require limits.']
      : ['What must be written for an integral with infinity as a bound?', 'A limit', ['A Riemann sum only', 'A derivative', 'A tangent line'], 'Improper integrals are defined by limits.', 'Do not plug in infinity as a number.']
    if (c.includes('long division')) return hard
      ? ['Before integrating (x^2+3x+2)/x, what does division give?', 'x+3+2/x', ['x+3', 'x^2+3+2/x', '1+3x+2x'], 'Divide each term by x before integrating.', 'Rewrite improper rational expressions before integrating.']
      : ['Which rational integral may need long division first?', 'integral (x^2+1)/x dx', ['integral 1/(x^2+1) dx', 'integral 1/x^2 dx', 'integral x/(x^2+1) dx'], 'Use long division when numerator degree is at least denominator degree.', 'Check degrees first.']
    if (c.includes('parametric arc length')) return hard
      ? ['Parametric arc length uses which integrand?', 'sqrt((dx/dt)^2+(dy/dt)^2)', ['sqrt(1+(dy/dx)^2)', 'dy/dx', 'x(t)y(t)'], 'Use component rates with respect to t.', 'Parametric arc length is not the Cartesian formula unless converted.']
      : ['For x=t, y=t on [0,3], parametric arc length is what?', '3sqrt(2)', ['3', 'sqrt(2)', '6'], 'Speed is sqrt(1^2+1^2), integrated over length 3.', 'Use vector speed.']
    if (c.includes('polar arc length')) return hard
      ? ['Polar arc length uses which integrand?', 'sqrt(r^2+(dr/dtheta)^2)', ['sqrt(1+(r\')^2)', '1/2 r^2', 'r only'], 'Polar arc length combines r and dr/dtheta.', 'Do not use the polar area formula.']
      : ['For r=2, 0<=theta<=pi, polar arc length is what?', '2pi', ['pi', '4pi', '2'], 'A circle radius 2 over angle pi has length r theta.', 'Constant r simplifies arc length.']
    if (c.includes('arc length')) return hard
      ? ['Set up arc length for y=ln(cos x) on [0,pi/4].', 'integral from 0 to pi/4 of sqrt(1+tan^2 x) dx', ['integral tan x dx', 'integral sqrt(1-tan^2 x) dx', 'integral ln(cos x) dx'], 'Use sqrt(1+(y\')^2) with y\'=-tan x.', 'Set up only when requested.']
      : ['Arc length for y=x on [0,3] is what?', '3sqrt(2)', ['3', 'sqrt(2)', '6'], 'Use integral sqrt(1+1^2) dx from 0 to 3.', 'Include 1+(y\')^2.']
    if (c.includes('volume around')) return hard
      ? ['Rotating around y=1 changes washer radii by what?', 'distance from curve to y=1', ['distance to x-axis always', 'function value only', 'interval length'], 'Non-axis rotation uses distance to the rotation line.', 'Radii are distances, not just y-values.']
      : ['For rotation about y=2, radius is measured how?', 'vertically to y=2', ['horizontally to x=2', 'along the curve', 'by arc length'], 'Radius is perpendicular distance to the axis of rotation.', 'Non-axis lines require adjusted radii.']
    if (c.includes('volume')) return hard
      ? ['Rotate y=2x from x=0 to x=1 about the x-axis. What is the volume?', '4pi/3', ['2pi/3', '4pi', '2pi'], 'Use pi integral (2x)^2 dx.', 'Square the radius.']
      : ['Cross sections perpendicular to x-axis are squares with side sqrt(x). What is area A(x)?', 'x', ['sqrt(x)', 'x^2', 'pi x'], 'Square area is side squared.', 'Cross-section area comes before integrating.']
    if (c.includes('area between')) return hard
      ? ['Find area between y=x+2 and y=x^2 from x=0 to x=2.', '10/3', ['8/3', '4', '2'], 'Integrate top minus bottom: x+2-x^2.', 'Use top minus bottom.']
      : ['For area between curves, which setup is correct?', 'integral of top minus bottom', ['integral of bottom minus top', 'derivative of top minus bottom', 'product of functions'], 'Area is accumulated vertical distance.', 'Order matters.']
    if (c.includes('substitution')) return hard
      ? ['Evaluate integral 2x(x^2+1)^5 dx.', '(x^2+1)^6/6 + C', ['(x^2+1)^5+C', '2(x^2+1)^6+C', 'x(x^2+1)^6+C'], 'Let u=x^2+1.', 'du must match leftover factors.']
      : ['For integral 2x cos(x^2) dx, what is a good u?', 'u=x^2', ['u=2x', 'u=cos x', 'u=dx'], 'The derivative of x^2 is 2x.', 'Choose u so du appears.']
    return hard
      ? [`Let F(x)=integral from 1 to x^2 of (t^3+${k}) dt. Find F'(x).`, `2x(x^6+${k})`, [`x^6+${k}`, `2x(t^3+${k})`, `x^2+${k}`], 'Use FTC with chain rule.', 'Do not integrate when differentiating an accumulation function.']
      : [`Evaluate integral from 0 to ${n} of ${2 * k}x dx.`, String(k * n * n), [String(k * n), String(n), `${k * n * n}/2`], 'Antiderivative is the coefficient times x^2 divided by 2.', 'Evaluate at both bounds.']
  }

  if (c.includes('differential equation') || c.includes('slope field') || c.includes('logistic') || c.includes('euler') || c.includes('growth') || c.includes('solution')) {
    if (c.includes('euler')) return hard
      ? ['Use Euler with h=0.5 for y\'=x+y, y(0)=1. Estimate y(1).', '2.5', ['2', '1.5', '3'], 'Step to y(0.5)=1.5, then y(1)=2.5.', 'Use the slope at the start of each step.']
      : ['Euler update formula is which?', 'new y = old y + h(slope)', ['new y = h/old y', 'new y = slope - h', 'new y = old y/h'], 'Euler takes a tangent-line step.', 'The step size multiplies the slope.']
    if (c.includes('logistic')) return hard
      ? ['For dP/dt=0.2P(1-P/1000), growth is fastest at what P?', '500', ['1000', '0', '200'], 'Logistic growth is fastest at half carrying capacity.', 'Fastest growth is not at carrying capacity.']
      : ['In dP/dt=kP(1-P/L), what is L?', 'Carrying capacity', ['Initial population', 'Growth rate', 'Time'], 'L is the limiting population.', 'Identify model parameters.']
    if (c.includes('separable')) return hard
      ? ['Solve dy/dx=xy with y(0)=3.', 'y=3e^(x^2/2)', ['y=e^(3x^2/2)', 'y=3x^2/2', 'y=Ce^x'], 'Separate: dy/y = x dx.', 'The constant becomes multiplicative.']
      : ['Which equation is separable?', 'dy/dx = xy', ['dy/dx = x+y', 'dy/dx = y+x^2y^2+1', 'dy/dx = sin(x+y)'], 'xy can be separated into dy/y = x dx.', 'Look for factorable x and y parts.']
    return hard
      ? [`Verify y=Ce^(${n}x) solves dy/dx=${n}y. What is y'?`, `${n}Ce^(${n}x)`, [`Ce^(${n}x)`, `${n}y^2`, `Ce^x`], 'Differentiate and compare to the right side.', 'Verification requires substitution.']
      : [`In a slope field for dy/dx=x-y, what is the slope at (${n + 1},${n})?`, '1', [String(2 * n + 1), '-1', String(n)], 'Substitute the point into x-y.', 'Slope fields use the differential equation at each point.']
  }

  if (c.includes('parametric') || c.includes('polar') || c.includes('vector')) {
    if (c.includes('polar area')) return hard
      ? ['Set up area for r=2sin(theta), 0<=theta<=pi.', '1/2 integral from 0 to pi of (2sin(theta))^2 dtheta', ['integral 2sin(theta) dtheta', 'pi integral r dtheta', '1/2 integral 2sin(theta) dtheta'], 'Use polar area formula.', 'Polar area squares r.']
      : ['Polar area formula is which?', '1/2 integral r^2 dtheta', ['integral r dtheta', 'pi integral r^2 dtheta', '1/2 integral r dtheta'], 'Recall the polar sector area formula.', 'Use r squared.']
    if (c.includes('polar slope')) return hard
      ? ['Polar slope dy/dx is computed as what?', '(dy/dtheta)/(dx/dtheta)', ['dr/dtheta', 'r/theta', 'dx/dtheta only'], 'Convert to parametric x=r cos theta, y=r sin theta.', 'Polar slope is not just dr/dtheta.']
      : ['For polar slope, x equals what in terms of r and theta?', 'r cos(theta)', ['r sin(theta)', 'theta cos(r)', 'r tan(theta)'], 'Use x=r cos theta.', 'Convert polar to parametric coordinates.']
    if (c.includes('polar')) return hard
      ? ['For r=2cos(theta), what angle gives r=0 in [0,pi]?', 'pi/2', ['0', 'pi', '2pi'], 'Set cos(theta)=0.', 'Zeros help interpret polar graphs.']
      : ['In polar coordinates, r measures what?', 'Distance from the pole', ['Angle from x-axis', 'Area', 'Slope'], 'r is radial distance.', 'Separate r and theta meanings.']
    if (c.includes('second derivatives')) return hard
      ? ['For x=t^2, y=t^3, what is d^2y/dx^2 at t=1?', '3/4', ['3/2', '6', '1'], 'dy/dx=3t/2, then divide d/dt by dx/dt=2t.', 'Second parametric derivative divides by dx/dt after differentiating dy/dx.']
      : ['For parametric curves, d^2y/dx^2 equals what?', 'd/dt(dy/dx) divided by dx/dt', ['d^2y/dt^2 divided by d^2x/dt^2', 'dy/dt divided by dx/dt', 'dx/dt divided by dy/dt'], 'Use the parametric second derivative formula.', 'Do not divide second t-derivatives.']
    if (c.includes('vector-valued speed')) return hard
      ? ['If v(t)=<3t^2,4t>, what is speed?', 'sqrt(9t^4+16t^2)', ['3t^2+4t', '7t^3', 'sqrt(3t^2+4t)'], 'Speed is magnitude of velocity.', 'Do not add components without squaring.']
      : ['Distance traveled by vector motion is integral of what?', 'speed', ['position', 'acceleration', 'x-coordinate only'], 'Distance integrates magnitude of velocity.', 'Distance and displacement differ.']
    if (c.includes('vector')) return hard
      ? ['For r(t)=<t^2,e^t>, what is a(t)?', '<2,e^t>', ['<2t,e^t>', '<t^2,e^t>', '<2,0>'], 'Differentiate position twice.', 'Acceleration is derivative of velocity.']
      : ['For r(t)=<t^2,e^t>, what is v(t)?', '<2t,e^t>', ['<2,e^t>', '<t^2,e^t>', '<2t,0>'], 'Velocity is r\'(t).', 'Differentiate each component.']
    return hard
      ? ['Given x=t^2 and y=t^3, find dy/dx at t=2.', '3', ['6', '2', '3/2'], 'dy/dx=(3t^2)/(2t)=3t/2.', 'Divide dy/dt by dx/dt.']
      : ['For x=t^2+1 and y=t^3, what is dy/dx?', '3t/2', ['3t^2/2', '2t/3t^2', 't'], 'Use (dy/dt)/(dx/dt).', 'Parametric derivative is not dy/dt alone.']
  }

  if (c.includes('series') || c.includes('sequence') || c.includes('convergence') || c.includes('taylor') || c.includes('maclaurin') || c.includes('lagrange') || c.includes('ratio') || c.includes('comparison')) {
    if (c.includes('geometric')) return hard
      ? ['Find sum from n=0 to infinity of 5(2/3)^n.', '15', ['5', '10', 'Does not converge'], 'Use a/(1-r).', 'Geometric sums require |r|<1.']
      : ['A geometric series converges when what is true?', '|r| < 1', ['|r| > 1', 'r = 1', 'a = 0 only'], 'The common ratio must have magnitude less than 1.', 'Check the ratio.']
    if (c.includes('alternating')) return hard
      ? ['How many terms ensure alternating error below 0.001 for sum (-1)^(n+1)/n^2?', '31', ['30', '32', '1000'], 'Require 1/(N+1)^2 < 0.001.', 'Use the first omitted term.']
      : ['Alternating series test requires terms that decrease to what?', '0', ['1', 'infinity', '-1'], 'The positive terms must decrease to 0.', 'AST has two conditions.']
    if (c.includes('ratio test')) return hard
      ? ['Ratio test limit is 1/3. What is the conclusion?', 'Converges absolutely', ['Diverges', 'Inconclusive', 'Conditionally converges'], 'A ratio-test limit below 1 gives absolute convergence.', 'Ratio test is inconclusive only at 1.']
      : ['Ratio test is especially useful for which expression?', 'n!', ['1/n^2', '1/n', 'constant terms only'], 'Factorials and exponentials suit ratio test.', 'Choose tests strategically.']
    if (c.includes('taylor/maclaurin')) return hard
      ? ['Maclaurin series are Taylor series centered where?', '0', ['1', 'a', 'infinity'], 'Maclaurin means center 0.', 'Taylor has any center; Maclaurin center is 0.']
      : ['Which is a Maclaurin series fact?', 'It is centered at x=0', ['It never has a remainder', 'It only works for polynomials', 'It is centered at x=1'], 'Maclaurin is Taylor at 0.', 'Know the vocabulary.']
    if (c.includes('taylor') || c.includes('maclaurin')) return hard
      ? ['Degree 3 Maclaurin polynomial for sin x is what?', 'x - x^3/6', ['1+x+x^2/2+x^3/6', 'x+x^3/6', '1-x^2/2'], 'Use the sin x series.', 'Do not use the e^x pattern for sin x.']
      : ['Degree 3 Maclaurin polynomial for e^x is what?', '1+x+x^2/2+x^3/6', ['x-x^3/6', '1-x^2/2', 'x+x^2+x^3'], 'Use the e^x series.', 'Include factorial denominators.']
    if (c.includes('lagrange')) return hard
      ? ['For e^x on [0,0.1], a Lagrange error bound uses which derivative size?', 'max of |e^x| on the interval', ['only f(0)', 'only f(0.1)-f(0)', 'the first derivative only'], 'Lagrange error uses a bound on the next derivative.', 'Use the next derivative.']
      : ['Lagrange error bound controls what?', 'remainder after a Taylor polynomial', ['radius of convergence only', 'average value', 'slope field'], 'It bounds Taylor approximation error.', 'It is an error estimate.']
    if (c.includes('power series')) return hard
      ? ['Find radius of convergence of sum x^n/3^n.', '3', ['1/3', '9', 'infinity'], 'Rewrite as sum (x/3)^n.', 'Radius is not the reciprocal endpoint by itself.']
      : ['After ratio test gives |x-2|<5, what is the radius?', '5', ['2', '7', '10'], 'Radius is the distance from center to endpoint.', 'Do not report the center as radius.']
    if (c.includes('comparison')) return hard
      ? ['(n^2+1)/(n^4+3) behaves like which p-series term?', '1/n^2', ['1/n', 'n^2', '1/n^4'], 'Compare leading powers.', 'Large-n behavior drives comparison.']
      : ['If 0 <= a_n <= b_n and sum b_n converges, then sum a_n does what?', 'Converges', ['Diverges', 'Is inconclusive always', 'Oscillates'], 'Use direct comparison.', 'The upper bounding series must converge.']
    if (c.includes('harmonic') || c.includes('p-series')) return hard
      ? ['Does sum 1/n^3 converge?', 'Converges', ['Diverges', 'Conditionally converges', 'Inconclusive'], 'p=3>1.', 'p-series converge for p>1.']
      : ['The harmonic series sum 1/n does what?', 'Diverges', ['Converges to 1', 'Converges to 0', 'Alternates'], 'The harmonic series is divergent.', 'Terms going to zero is not enough.']
    if (c.includes('absolute vs. conditional')) return hard
      ? ['If sum a_n converges but sum |a_n| diverges, convergence is what?', 'conditional', ['absolute', 'divergent', 'geometric'], 'Conditional convergence means only the original series converges.', 'Absolute convergence is stronger.']
      : ['Absolute convergence tests which series?', 'sum |a_n|', ['sum a_n only', 'sequence a_n', 'partial sums only'], 'Take absolute values of terms.', 'Do not confuse absolute value with alternating signs.']
    if (c.includes('using series')) return hard
      ? ['To approximate e^0.1 with a series, which first three terms are used?', '1+0.1+(0.1)^2/2', ['0.1-(0.1)^3/6', '1-(0.1)^2/2', '1/(1-0.1)'], 'Use the e^x Maclaurin series.', 'Choose the correct base series.']
      : ['Series approximations usually improve by doing what?', 'adding more valid terms', ['changing the center randomly', 'dropping the first term', 'ignoring error'], 'More terms generally improve an approximation within convergence.', 'Stay inside the interval of convergence.']
    return hard
      ? ['Does a_n=(3n+1)/n converge, and to what?', 'Converges to 3', ['Diverges', 'Converges to 1', 'Converges to 0'], 'Rewrite as 3+1/n.', 'Simplify before taking the limit.']
      : ['If lim a_n is finite, the sequence does what?', 'Converges', ['Diverges', 'Oscillates only', 'Becomes a series'], 'A finite sequence limit means convergence.', 'Sequences and series are different objects.']
  }

  if (c.includes('mean value')) return hard
    ? ['For f(x)=x^2 on [1,3], what c satisfies MVT?', '2', ['1', '3', '4'], 'Average slope is 4, so 2c=4.', 'Verify hypotheses before applying MVT.']
    : ['MVT requires which conditions?', 'Continuous on [a,b] and differentiable on (a,b)', ['Only continuous at endpoints', 'Only differentiable at endpoints', 'Always true'], 'These are the MVT hypotheses.', 'Closed vs open interval matters.']
  if (c.includes('extreme value')) return hard
    ? ['Why does EVT apply to f(x)=x^2 on [0,2]?', 'Continuous function on a closed interval', ['Differentiable on all reals only', 'Open interval', 'Discontinuous endpoint'], 'EVT needs continuity on a closed interval.', 'Closed interval matters.']
    : ['EVT guarantees what?', 'Absolute max and min', ['Only a derivative', 'Only a root', 'Only an inflection point'], 'Continuous functions on closed intervals attain extrema.', 'EVT is about absolute extrema.']
  if (c.includes('critical')) return hard
    ? ['Critical numbers occur where f exists and f\' is what?', 'zero or undefined', ['positive only', 'negative only', 'equal to f'], 'Critical numbers come from f\'=0 or undefined.', 'The original function must exist.']
    : ['If f\'(3)=0 and f exists at 3, x=3 is what?', 'a critical number', ['always a maximum', 'always a minimum', 'not important'], 'f\'=0 creates a critical number.', 'Classification needs a sign test.']
  if (c.includes('increasing')) return hard
    ? ['If f\'(x)>0 on (1,4), what is f doing there?', 'increasing', ['decreasing', 'concave up', 'constant'], 'Positive derivative means increasing.', 'Do not confuse increasing with concavity.']
    : ['Increasing intervals come from the sign of which derivative?', 'f\'', ['f', 'f\'\'', 'integral of f'], 'Use the first derivative.', 'The function value sign is not enough.']
  if (c.includes('first derivative')) return hard
    ? ['If f\' changes from positive to negative at c, what occurs?', 'local maximum', ['local minimum', 'inflection point', 'no conclusion'], 'First derivative test gives a max.', 'Use sign change, not just f\'=0.']
    : ['First derivative test classifies what?', 'local extrema', ['absolute area', 'Taylor error', 'horizontal asymptotes'], 'It uses f\' sign changes.', 'Critical point alone is not classification.']
  if (c.includes('concavity') || c.includes('inflection')) return hard
    ? ['If f\'\' changes from positive to negative at x=2, what occurs?', 'inflection point', ['local maximum always', 'vertical asymptote', 'endpoint'], 'Concavity changes sign.', 'Inflection needs concavity change.']
    : ['Concave up corresponds to what sign?', 'f\'\' > 0', ['f\' < 0', 'f > 0', 'f\'\' < 0'], 'Second derivative positive means concave up.', 'Concavity is second derivative behavior.']
  if (c.includes('second derivative')) return hard
    ? ['If f\'(c)=0 and f\'\'(c)>0, what does second derivative test say?', 'local minimum', ['local maximum', 'inconclusive', 'inflection only'], 'Positive second derivative means concave up at the critical point.', 'Need f\'(c)=0 first.']
    : ['Second derivative test uses f\'\' to classify what?', 'critical points', ['limits at infinity', 'Riemann sums', 'series'], 'It classifies some extrema.', 'It can be inconclusive if f\'\'=0.']
  if (c.includes('curve sketching')) return hard
    ? ['A curve sketch sign chart should include which information?', 'f\', f\'\', intercepts, and asymptotes when relevant', ['only f values', 'only endpoints', 'only units'], 'Use derivative signs and key graph features.', 'Sketching is synthesis.']
    : ['Which derivative helps determine concavity for sketching?', 'f\'\'', ['f', 'f\' only', 'antiderivative only'], 'Second derivative gives concavity.', 'Use both f\' and f\'\' for full analysis.']
  if (c.includes('optimization')) return hard
    ? ['A rectangle has area A(x)=24x-2x^3. Which equation finds interior optimum?', 'A\'(x)=0', ['A(x)=0', 'A\'\'(x)=0 only', 'x=0 only'], 'Optimization uses critical points of the objective.', 'Define and differentiate the objective.']
    : ['The first step in optimization is usually what?', 'define variables and objective function', ['guess the answer', 'differentiate the constraint only', 'ignore units'], 'Translate the situation first.', 'Setup matters more than algebra speed.']

  return hard
    ? [`Which AP-style conclusion best matches ${concept}?`, 'Use the relevant theorem/rule and state conditions.', ['Skip conditions', 'Use only a calculator', 'Differentiate every expression'], 'Match the method to the concept and justify.', 'AP credit often depends on setup and conditions.']
    : [`Which idea is most central to ${concept}?`, 'Apply the named rule with its required conditions.', ['Ignore conditions', 'Use unrelated algebra only', 'Estimate randomly'], 'Use the definition or rule attached to the skill.', 'Concept questions test when a method is valid.']
}

function rotateChoices(choices, seed) {
  const offset = seed % choices.length
  return choices.slice(offset).concat(choices.slice(0, offset))
}

function makeQuestion(row, conceptIndex, difficulty) {
  const [unitId, unit, concept] = row
  const source = handcrafted[concept]?.[difficulty === 'easy' ? 0 : 1] || genericProblem(unitId, concept, conceptIndex, difficulty)
  const [prompt, correct, distractors, solution, gotcha] = source
  const rawChoices = [correct, ...distractors]
  const choices = rotateChoices([...new Set(rawChoices)], conceptIndex + (difficulty === 'hard' ? 2 : 0))
  if (choices.length !== 4) throw new Error(`Invalid diagnostic choices for ${concept}: ${rawChoices.join(' | ')}`)

  return {
    id: conceptIndex * 2 + (difficulty === 'easy' ? 1 : 2),
    source: 'AP Guide',
    unitId,
    unit,
    concept,
    difficulty,
    prompt,
    choices,
    answer: String.fromCharCode(97 + choices.indexOf(correct)),
    hint: `${difficulty === 'easy' ? 'Start with the core rule.' : 'Use the setup before calculating.'} Focus: ${concept}.`,
    solution: [solution],
    gotcha,
  }
}

export const diagnosticQuestions = conceptRows.flatMap((row, index) => [makeQuestion(row, index, 'easy'), makeQuestion(row, index, 'hard')])

export const diagnosticAnswerNotes = [
  'There are 180 diagnostic questions: one easier and one harder question for each of the 90 progress-tracker concepts.',
  'Student-facing cards show multiple-choice answers and hide the tested concept unless the info hint is opened.',
  'Tutor/Admin shows worked solution notes and AP gotchas.',
]

export const diagnosticSolutions = Object.fromEntries(
  diagnosticQuestions.map((question) => [
    question.id,
    [...question.solution, `AP gotcha: ${question.gotcha}`],
  ]),
)
