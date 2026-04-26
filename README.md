# 📐 AP Calculus Tutoring Dashboard

A comprehensive, interactive React application designed specifically for AP Calculus (AB and BC) tutoring. This dashboard moves beyond simple grade tracking by providing concept-level granular progress tracking, interactive function visualization, built-in diagnostic testing, and a rich reference library.

## ✨ Core Features

### 1. Granular Progress Tracking (Units 1–10)
Tracks student mastery across all 10 AP Calculus units (both AB and BC paths). Instead of just tracking "covered" topics, the dashboard tracks:
- **Taught vs. Known vs. Reviewed**: Differentiates between a concept being introduced, independently mastered, and spiraled back for review.
- **Pacing & Timeline**: Automatically calculates if a student is "On Track," "At Risk," or "Behind" based on a set mastery target date.
- **0–5 Skill Rubric**: Evaluates conceptual understanding, procedural fluency, graph interpretation, FRQ writing, and calculator fluency.

### 2. Interactive Function Lab
A built-in math engine and graphing tool designed for tutoring demonstrations:
- **Evaluator**: Parses and evaluates mathematical expressions using a custom tokenizer and JS `Function` evaluation.
- **Visualizations**: Plots functions, their derivatives, and integrals dynamically.
- **Approximations**: Visualizes Left/Right/Midpoint Riemann sums, Trapezoid rules, and Euler's Method approximations.
- **Parent Transformations**: Easily manipulate parent functions (e.g., $sin(x)$, $x^2$, $\sqrt{x}$) using $a, b, h, k$ parameters.

### 3. Integrated Diagnostic Testing
Includes a built-in diagnostic assessment covering foundational algebra, geometry, and trigonometry required for AP Calculus.
- 38 built-in multiple-choice questions.
- Automatic grading with immediate feedback.
- Hidden "Admin Only" answer key with step-by-step worked solutions for the tutor.
- Formulas rendered beautifully with **KaTeX**.

### 4. Session & Mistake Logs
- **Session Log**: Tracks dates, focus areas, "wins", and next steps to keep parents and students aligned.
- **Mistake Tracker**: Categorizes errors (e.g., "Algebra slip", "Concept gap", "FRQ justification") to identify and fix recurring bad habits before exam day.

### 5. Reference & Fact Sheets
A built-in library of crucial theorems and rules:
- Interactive "Theorem Info Cards" with visual SVG diagrams for concepts like the Mean Value Theorem, Intermediate Value Theorem, and the Fundamental Theorem of Calculus.
- Quick-reference sheets for derivative rules, integration rules, and series tests.

---

## 🔀 Architecture & Workflow

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
  |  |                   Local State                      |     |
  |  |    (Student KPIs, Unit Progress, Graph Params)     |     |
  |  +--------------------------+-------------------------+     |
  |                             |                               |
  |                             v                               |
  |  +----------------------------------------------------+     |
  |  |                  localStorage                      |     |
  |  |    (Persists session data entirely in browser)     |     |
  |  +----------------------------------------------------+     |
  +-------------------------------------------------------------+
```

### State Management
The application is entirely client-side. It uses React `useState` and `useEffect` to manage a complex application state, syncing it directly to the browser's `localStorage` (using the key `ap-calc-tutoring-dashboard-v6`). This ensures privacy and zero setup for the tutor while keeping data persistent across browser sessions.

---

## 🚀 How to Run

### Frontend Setup (Node.js)

1. **Navigate to the dashboard directory:**
   ```bash
   cd ap-calc-dashboard
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📋 Requirements

### Python Environment (Optional/Analytics Backend)
- **Python Version:** `3.12.13`

The Python environment utilizes several scientific, ML, and web frameworks. You can install the full list of dependencies using the generated `requirements.txt` file in this repository:

```bash
pip install -r requirements.txt
```

Some of the key packages include:
- `fastapi` & `uvicorn` (Web Server)
- `torch` & `transformers` (Machine Learning)
- `sympy` (Symbolic Mathematics)
- `scikit-learn`, `pandas`, `numpy` (Data Science)
- `streamlit` & `jupyterlab` (Data Apps & Notebooks)

### Node.js Environment (ap-calc-dashboard)
- `react` ^19.2.5
- `vite` ^8.0.10
- `katex` ^0.16.45
