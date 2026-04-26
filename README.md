# 📐 AP Calculus Tutoring Dashboard - Developer Guide

A comprehensive, interactive React application designed for AP Calculus (AB and BC) tutoring. This dashboard provides granular progress tracking, interactive function visualization, built-in diagnostic testing, and a rich reference library.

This document serves as a reference for developers looking to understand the architecture, state management, and component structure of the application.

---

## 🏗️ Architecture & Philosophy

The application is a **Pure Client-Side React Single Page Application (SPA)** built with Vite. 

**Key Design Decisions:**
1. **Zero-Backend / Privacy First:** All user data (student info, progress, grades, logs) is stored entirely in the browser's `localStorage`. There is no database or server-side state.
2. **Custom Math Engine:** Instead of relying on heavy external math libraries for graphing, the app uses a lightweight, custom tokenizer and JavaScript `Function` constructor to evaluate math expressions securely and quickly.
3. **KaTeX Integration:** All mathematical typesetting for diagnostics and reference sheets is rendered using KaTeX for high performance and beautiful typography.

```ascii
  +-------------------------------------------------------------+
  |                   React / Vite Frontend                     |
  |                                                             |
  |  +---------------+  +---------------+  +---------------+    |
  |  | Admin & KPI   |  | Progress      |  | Interactive   |    |
  |  | Inputs        |  | Tracker       |  | Function Lab  |    |
  |  +-------+-------+  +-------+-------+  +-------+-------+    |
  |          |                  |                  |            |
  |          v                  v                  v            |
  |  +----------------------------------------------------+     |
  |  |             Main State (App.jsx / Main)            |     |
  |  |    (student, progress, timeline, graph params)     |     |
  |  +--------------------------+-------------------------+     |
  |                             |                               |
  |                             v                               |
  |  +----------------------------------------------------+     |
  |  |                  localStorage                      |     |
  |  |         Key: 'ap-calc-tutoring-dashboard-v6'       |     |
  |  +----------------------------------------------------+     |
  +-------------------------------------------------------------+
```

---

## 📂 Project Structure

```text
ap-calc-dashboard/
├── src/
│   ├── App.jsx                              # Entry point wrapper
│   ├── ap_calculus_tutoring_dashboard.jsx   # MAIN APPLICATION COMPONENT & LOGIC
│   ├── diagnostic_questions.js              # Data store for diagnostic questions & answers
│   ├── App.css                              # Main stylesheet
│   └── index.css                            # Base styles
├── package.json
└── vite.config.js
```

---

## 🧠 State Management

The entire application state is held in the `APCalculusTutoringDashboard` component using `useState` hooks. A single `useEffect` hook synchronizes this state to `localStorage` whenever it changes.

### Core State Objects:

- **`student`**: Stores basic info, target scores, and specific tutor notes (e.g., `thisWeek`, `currentFocus`).
- **`progress`**: A deeply nested object keyed by Unit IDs (e.g., `u1`, `u2`). It tracks `taught`, `knows`, and `reviewed` boolean flags and timestamps for *every single concept* in the curriculum.
- **`skillRatings`**: Tracks the 0-5 rubric scores for different AP skills (Conceptual, Procedural, FRQ writing, etc.).
- **`sessions` & `mistakes`**: Arrays of objects representing the session logs and mistake tracker entries.
- **`diagnosticResponses`**: A dictionary mapping question IDs to the student's selected multiple-choice letter.
- **`graph`**: Stores the current state of the Function Lab (expression string, window bounds, transformation parameters).

---

## 🧩 Key React Components Reference

All primary components are located in `ap_calculus_tutoring_dashboard.jsx`.

### 1. `APCalculusTutoringDashboard` (The Container)
The root component that manages state, renders the top navigation tabs, and acts as the router switching between the views (`admin`, `tracker`, `timeline`, `diagnostic`, `graph`, `exam`, `student`, `references`, `parent`).

### 2. Progress & Tracking Components
- **`DashboardCard`**: A reusable UI component for displaying KPIs (e.g., "Overall Progress", "Readiness Status").
- **`CheckboxField`**: A controlled checkbox wrapper used extensively in the Unit Progress tracker.

### 3. Diagnostic System
The diagnostic system separates the student's view from the tutor's grading view.
- **`DiagnosticQuestionCard`**: Renders a single multiple-choice question. Uses KaTeX to render math in prompts and choices.
- **`DiagnosticResultsSummary`**: Calculates the score, lists missed questions, and identifies "What to learn next" based on the specific concepts tied to the missed questions.
- **`DiagnosticAnswerKeyItem`**: (Admin only) Shows the correct answer and a step-by-step worked solution.

### 4. Theorem & Reference UI
- **`TheoremInfoCard`**: Displays plain-English explanations of complex theorems.
- **`TheoremMiniPlot`**: A highly specialized SVG component that renders visual intuition for theorems (e.g., showing the area under a curve for FTC, or the secant/tangent lines for MVT).
- **`FactSheetCard` & `FormulaItem`**: Renders algebraic and trigonometric rules.

---

## 🧮 The Math Engine ("Function Lab")

To allow tutors to type equations like `sin(2x) + x^2` and see them graphed instantly, the app implements a custom math parser and evaluator.

### How Evaluation Works:
1. **`normalizeExpression(expression)`**: 
   - Takes raw user input.
   - Inserts explicit multiplication (e.g., turns `2x` into `2*x` and `2sin(x)` into `2*sin(x)`).
   - Replaces math keywords with JavaScript `Math` equivalents (e.g., `sin(` becomes `Math.sin(`, `^` becomes `**`, `pi` becomes `Math.PI`).
   - Restricts execution to a strict safelist of allowed identifiers (`x`, `sin`, `cos`, `sqrt`, etc.) to prevent code injection.
2. **`createEvaluator(expression)`**:
   - Takes the normalized string and wraps it in a `new Function('x', 'return (...)')`.
3. **`sampleGraph(expression, xMin, xMax, yMin, yMax, samples)`**:
   - Iterates from `xMin` to `xMax`.
   - Calculates `f(x)`.
   - Numerically calculates the derivative $f'(x)$ using the symmetric difference quotient.
   - Numerically calculates the definite integral using the Trapezoidal rule.

### Extending the Math Engine:
To add support for a new function (e.g., `sec(x)`):
1. Add `sec` to the `allowed` Set in `normalizeExpression`.
2. Add a `.replace(/\bsec\s*\(/g, '1/Math.cos(')` rule in the return block of `normalizeExpression`.

---

## 🛠️ How to Add Data / Make Changes

### Adding a New AP Unit or Concept
Look for the `apUnits` array at the top of `ap_calculus_tutoring_dashboard.jsx`. Add a new object or append to the `concepts` array. The UI and progress percentages will automatically adapt.
```javascript
{
  id: 'u11',
  unit: 'Unit 11',
  title: 'Multivariable Intro',
  path: 'BC Extension',
  // ...
  concepts: ['Partial Derivatives', 'Gradient Vectors']
}
```

### Adding New Diagnostic Questions
Open `src/diagnostic_questions.js`.
1. Add a new object to the `diagnosticQuestions` array.
2. Ensure you provide an `id`, `concept`, `prompt`, `choices` array, and `answer` (letter).
3. Use plain text or wrap KaTeX in `$` symbols.
4. Add the step-by-step solution array to `diagnosticSolutions` using the question `id` as the key.

---

## 🚀 Development Workflow

### Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ap-calc-dashboard
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

### Scripts
- `npm run dev`: Starts local dev server with Hot Module Replacement (HMR).
- `npm run build`: Compiles the application for production.
- `npm run lint`: Runs ESLint for code quality.

## 📋 Python Environment Requirements (For External Analytics)
*Note: The React frontend does not require Python.*

If you are running external scripts, notebooks, or API backends alongside this project, you can reproduce the standard environment using:
```bash
pip install -r requirements.txt
```
Key packages include: `fastapi`, `torch`, `transformers`, `sympy`, `scikit-learn`, `pandas`, `streamlit`, and `jupyterlab`.
