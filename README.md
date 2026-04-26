# Calculus Dashboard

A dashboard application tailored for AP Calculus tutoring, complete with diagnostic questions and interactive problem solving.

## 🔀 Architecture & Workflow

```ascii
  +-------------------+         +-------------------------+
  |                   |         |                         |
  |   User / Student  |         |  Vite + React Frontend  |
  |   (Web Browser)   | <-----> |  (ap-calc-dashboard)    |
  |                   |         |                         |
  +-------------------+         +-------------------------+
                                 |                       |
                                 v                       v
                      +-------------------+  +-----------------------+
                      |                   |  |                       |
                      |  KaTeX Rendering  |  | Diagnostic Questions  |
                      |  (Math Formulas)  |  | (Local State/Logic)   |
                      |                   |  |                       |
                      +-------------------+  +-----------------------+
```

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

### Python Environment
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
