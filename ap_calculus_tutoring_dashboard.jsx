import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Calculator, CheckCircle2, ClipboardList, Eye, FunctionSquare, GraduationCap, Lock, Parentheses, TrendingUp, UserRoundCog } from "lucide-react";
import { create, all, derivative } from "mathjs";

const math = create(all, {});

const STORAGE_KEY = "ap-calc-tutoring-dashboard-v1";

const units = [
  {
    id: "u1",
    unit: "Unit 1",
    title: "Limits & Continuity",
    course: "AB/BC",
    weightAB: "10–12%",
    weightBC: "4–7%",
    concepts: ["Limit notation", "One-sided limits", "Infinite limits", "Continuity", "IVT", "Squeeze theorem"],
  },
  {
    id: "u2",
    unit: "Unit 2",
    title: "Differentiation: Definition & Basic Rules",
    course: "AB/BC",
    weightAB: "10–12%",
    weightBC: "4–7%",
    concepts: ["Average vs instantaneous rate", "Derivative definition", "Power/product/quotient rules", "Tangent lines", "Differentiability"],
  },
  {
    id: "u3",
    unit: "Unit 3",
    title: "Composite, Implicit & Inverse Differentiation",
    course: "AB/BC",
    weightAB: "9–13%",
    weightBC: "4–7%",
    concepts: ["Chain rule", "Implicit differentiation", "Inverse functions", "Inverse trig derivatives", "Log/exponential derivatives"],
  },
  {
    id: "u4",
    unit: "Unit 4",
    title: "Contextual Applications of Differentiation",
    course: "AB/BC",
    weightAB: "10–15%",
    weightBC: "6–9%",
    concepts: ["Related rates", "Linearization", "Motion", "L'Hospital's Rule", "Units and interpretation"],
  },
  {
    id: "u5",
    unit: "Unit 5",
    title: "Analytical Applications of Differentiation",
    course: "AB/BC",
    weightAB: "15–18%",
    weightBC: "8–11%",
    concepts: ["MVT/EVT", "Increasing/decreasing", "Concavity", "Optimization", "Graph analysis"],
  },
  {
    id: "u6",
    unit: "Unit 6",
    title: "Integration & Accumulation of Change",
    course: "AB/BC",
    weightAB: "17–20%",
    weightBC: "17–20%",
    concepts: ["Riemann sums", "Definite integrals", "FTC", "u-substitution", "Accumulation functions", "Average value"],
  },
  {
    id: "u7",
    unit: "Unit 7",
    title: "Differential Equations",
    course: "AB/BC",
    weightAB: "6–12%",
    weightBC: "6–9%",
    concepts: ["Slope fields", "Euler's method", "Separable equations", "Exponential/logistic models"],
  },
  {
    id: "u8",
    unit: "Unit 8",
    title: "Applications of Integration",
    course: "AB/BC",
    weightAB: "10–15%",
    weightBC: "6–9%",
    concepts: ["Area between curves", "Volumes", "Washer/shell ideas", "Arc length basics", "Physical applications"],
  },
  {
    id: "u9",
    unit: "Unit 9",
    title: "Parametric, Polar & Vector-Valued Functions",
    course: "BC only",
    weightAB: "—",
    weightBC: "11–12%",
    concepts: ["Parametric derivatives", "Vector motion", "Speed/acceleration", "Polar derivatives", "Polar area", "Arc length"],
  },
  {
    id: "u10",
    unit: "Unit 10",
    title: "Infinite Sequences & Series",
    course: "BC only",
    weightAB: "—",
    weightBC: "17–18%",
    concepts: ["Convergence tests", "Alternating series", "Power series", "Taylor/Maclaurin series", "Error bounds", "Radius/interval of convergence"],
  },
];

const defaultStudent = {
  name: "Student",
  target: "AP Calculus BC / 5 target",
  diagnosticScore: 0,
  recentScore: 0,
  frqScore: 0,
  mcqAccuracy: 0,
  homeworkCompletion: 0,
  confidence: 3,
  notes: "",
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function createDefaultProgress() {
  const progress = {};
  units.forEach((u) => {
    progress[u.id] = { taught: false, practiced: false, mastered: false, reviewed: false, quiz: "" };
  });
  return progress;
}

function pct(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function progressScore(row) {
  return [row.taught, row.practiced, row.mastered, row.reviewed].filter(Boolean).length * 25;
}

function safeNumber(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function sampleFunction(expr, xMin, xMax, points = 241) {
  const compiled = math.compile(expr);
  const out = [];
  const step = (xMax - xMin) / (points - 1);
  let integral = 0;
  let prevY = null;
  let prevX = null;

  for (let i = 0; i < points; i++) {
    const x = xMin + step * i;
    let y = null;
    try {
      const val = compiled.evaluate({ x });
      y = Number.isFinite(Number(val)) ? Number(val) : null;
    } catch {
      y = null;
    }

    if (y !== null && prevY !== null) integral += ((prevY + y) / 2) * (x - prevX);
    out.push({ x: Number(x.toFixed(4)), f: y === null ? null : Number(y.toFixed(5)), integral: Number(integral.toFixed(5)) });
    prevY = y;
    prevX = x;
  }
  return out;
}

function sampleDerivative(expr, xMin, xMax, points = 241) {
  let dExpr = "";
  try {
    dExpr = derivative(expr, "x").toString();
  } catch {
    return { dExpr: "Could not symbolically differentiate", data: [] };
  }
  const dData = sampleFunction(dExpr, xMin, xMax, points).map((p) => ({ x: p.x, derivative: p.f }));
  return { dExpr, data: dData };
}

function mergeSeries(base, dData) {
  const byX = new Map(dData.map((p) => [p.x, p.derivative]));
  return base.map((p) => ({ ...p, derivative: byX.get(p.x) ?? null }));
}

export default function APCalculusTutoringDashboard() {
  const saved = typeof window !== "undefined" ? loadState() : null;
  const [student, setStudent] = useState(saved?.student || defaultStudent);
  const [progress, setProgress] = useState(saved?.progress || createDefaultProgress());
  const [filter, setFilter] = useState("all");
  const [expr, setExpr] = useState(saved?.expr || "x^3 - 3x");
  const [xMin, setXMin] = useState(saved?.xMin ?? -4);
  const [xMax, setXMax] = useState(saved?.xMax ?? 4);
  const [yMin, setYMin] = useState(saved?.yMin ?? -10);
  const [yMax, setYMax] = useState(saved?.yMax ?? 10);
  const [showDerivative, setShowDerivative] = useState(true);
  const [showIntegral, setShowIntegral] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ student, progress, expr, xMin, xMax, yMin, yMax }));
  }, [student, progress, expr, xMin, xMax, yMin, yMax]);

  const visibleUnits = units.filter((u) => filter === "all" || u.course === filter || (filter === "ab" && u.course === "AB/BC") || (filter === "bc" && (u.course === "AB/BC" || u.course === "BC only")));

  const metrics = useMemo(() => {
    const rows = Object.values(progress);
    const overall = rows.reduce((sum, row) => sum + progressScore(row), 0) / rows.length;
    const mastered = rows.filter((r) => r.mastered).length;
    const weak = units.filter((u) => progressScore(progress[u.id]) < 50).slice(0, 3);
    const risk = 100 - (pct(student.recentScore) * 0.35 + pct(student.frqScore) * 0.25 + pct(student.mcqAccuracy) * 0.25 + pct(student.homeworkCompletion) * 0.15);
    return { overall: pct(overall), mastered, weak, risk: pct(risk) };
  }, [progress, student]);

  const graph = useMemo(() => {
    try {
      const x0 = safeNumber(xMin, -4);
      const x1 = safeNumber(xMax, 4);
      if (x1 <= x0) throw new Error("Domain max must be greater than min.");
      const base = sampleFunction(expr, x0, x1);
      const d = sampleDerivative(expr, x0, x1);
      return { ok: true, dExpr: d.dExpr, data: mergeSeries(base, d.data), message: "" };
    } catch (e) {
      return { ok: false, dExpr: "", data: [], message: e.message || "Could not parse that function." };
    }
  }, [expr, xMin, xMax]);

  function updateProgress(id, key, value) {
    setProgress((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  }

  function resetDemo() {
    setStudent(defaultStudent);
    setProgress(createDefaultProgress());
  }

  const kpiCards = [
    { label: "Overall curriculum progress", value: `${metrics.overall}%`, icon: CheckCircle2, help: "Taught + practiced + mastered + spiral reviewed." },
    { label: "Units mastered", value: `${metrics.mastered}/10`, icon: GraduationCap, help: "Mastered means the student can solve mixed AP-style problems without prompting." },
    { label: "Recent practice score", value: `${pct(student.recentScore)}%`, icon: TrendingUp, help: "Use for weekly AP Classroom / packet / mock exam performance." },
    { label: "Risk index", value: `${metrics.risk}%`, icon: Eye, help: "Higher means more urgency. Based on recent score, FRQ, MCQ, and completion." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2"><Badge>AP Calculus AB/BC</Badge><Badge variant="secondary">Local save enabled</Badge></div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Tutoring Progress Dashboard</h1>
            <p className="text-slate-600 mt-2 max-w-3xl">Track mastery, session priorities, parent-facing progress, and interactive function behavior in one lightweight dashboard.</p>
          </div>
          <Button variant="outline" onClick={resetDemo}>Reset demo data</Button>
        </motion.div>

        <Tabs defaultValue="admin" className="space-y-5">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-fit">
            <TabsTrigger value="admin"><UserRoundCog className="w-4 h-4 mr-2" />Tutor/Admin</TabsTrigger>
            <TabsTrigger value="tracker"><ClipboardList className="w-4 h-4 mr-2" />Progress Tracker</TabsTrigger>
            <TabsTrigger value="grapher"><FunctionSquare className="w-4 h-4 mr-2" />Function Lab</TabsTrigger>
            <TabsTrigger value="parent"><Parentheses className="w-4 h-4 mr-2" />Parent View</TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {kpiCards.map((k) => {
                const Icon = k.icon;
                return <Card key={k.label} className="rounded-2xl shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{k.label}</p><p className="text-3xl font-semibold mt-1">{k.value}</p></div><Icon className="w-5 h-5 text-slate-500" /></div><p className="text-xs text-slate-500 mt-3">{k.help}</p></CardContent></Card>;
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="rounded-2xl shadow-sm lg:col-span-1"><CardContent className="p-5 space-y-4">
                <h2 className="text-xl font-semibold">Student setup</h2>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Student name</label>
                  <Input value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} />
                  <label className="text-sm font-medium">Goal / course target</label>
                  <Input value={student.target} onChange={(e) => setStudent({ ...student, target: e.target.value })} />
                </div>
              </CardContent></Card>

              <Card className="rounded-2xl shadow-sm lg:col-span-2"><CardContent className="p-5 space-y-4">
                <h2 className="text-xl font-semibold">Tutor KPI inputs</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[
                    ["diagnosticScore", "Diagnostic %"],
                    ["recentScore", "Recent score %"],
                    ["frqScore", "FRQ avg %"],
                    ["mcqAccuracy", "MCQ accuracy %"],
                    ["homeworkCompletion", "HW completion %"],
                  ].map(([key, label]) => <div key={key}><label className="text-sm font-medium">{label}</label><Input type="number" min="0" max="100" value={student[key]} onChange={(e) => setStudent({ ...student, [key]: e.target.value })} /></div>)}
                </div>
                <div>
                  <label className="text-sm font-medium">Session notes / parent talking points</label>
                  <textarea className="w-full min-h-28 rounded-xl border p-3 text-sm" value={student.notes} onChange={(e) => setStudent({ ...student, notes: e.target.value })} placeholder="Example: Strong improvement on derivative rules. Needs more practice translating word problems into equations for related rates." />
                </div>
              </CardContent></Card>
            </div>

            <Card className="rounded-2xl shadow-sm"><CardContent className="p-5">
              <h2 className="text-xl font-semibold mb-3">Best tutor/admin KPIs to track</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="p-4 rounded-2xl bg-white border"><b>Mastery by AP unit</b><p className="text-slate-600 mt-1">A unit is not “done” until taught, practiced, mastered, and spiral-reviewed.</p></div>
                <div className="p-4 rounded-2xl bg-white border"><b>FRQ rubric strength</b><p className="text-slate-600 mt-1">Track setup, notation, justification, units, and final answer accuracy separately.</p></div>
                <div className="p-4 rounded-2xl bg-white border"><b>MCQ accuracy by concept</b><p className="text-slate-600 mt-1">Especially valuable for limits, derivative rules, applications, accumulation, and series.</p></div>
                <div className="p-4 rounded-2xl bg-white border"><b>Error type log</b><p className="text-slate-600 mt-1">Algebra slip, concept gap, misread question, calculator issue, notation issue, time pressure.</p></div>
                <div className="p-4 rounded-2xl bg-white border"><b>Homework completion</b><p className="text-slate-600 mt-1">Completion matters less than corrected completion. Add a “redone after feedback” marker later.</p></div>
                <div className="p-4 rounded-2xl bg-white border"><b>Exam readiness</b><p className="text-slate-600 mt-1">Diagnostic → weekly practice → timed sections → full mock. Show score trend, not just one score.</p></div>
              </div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="tracker" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold">AP Unit Progress Tracker</h2>
              <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-full md:w-56"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Show all units</SelectItem><SelectItem value="ab">AB path only</SelectItem><SelectItem value="bc">BC full path</SelectItem><SelectItem value="BC only">BC-only units</SelectItem></SelectContent></Select>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {visibleUnits.map((u) => {
                const row = progress[u.id];
                const score = progressScore(row);
                return <Card key={u.id} className="rounded-2xl shadow-sm"><CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="max-w-3xl">
                      <div className="flex items-center gap-2 flex-wrap"><Badge variant={u.course === "BC only" ? "default" : "secondary"}>{u.course}</Badge><span className="text-sm text-slate-500">{u.unit}</span><span className="text-sm text-slate-500">AB {u.weightAB} · BC {u.weightBC}</span></div>
                      <h3 className="text-xl font-semibold mt-2">{u.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-3">{u.concepts.map((c) => <Badge key={c} variant="outline">{c}</Badge>)}</div>
                    </div>
                    <div className="lg:w-80 space-y-3">
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden"><div className="h-full bg-slate-900" style={{ width: `${score}%` }} /></div>
                      <p className="text-sm text-slate-600">Progress: {score}%</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {[["taught", "Taught"], ["practiced", "Practiced"], ["mastered", "Mastered"], ["reviewed", "Reviewed"]].map(([key, label]) => <label key={key} className="flex items-center gap-2 rounded-xl border p-2 bg-white"><Checkbox checked={row[key]} onCheckedChange={(v) => updateProgress(u.id, key, Boolean(v))} />{label}</label>)}
                      </div>
                      <Input placeholder="Quiz/practice score notes" value={row.quiz} onChange={(e) => updateProgress(u.id, "quiz", e.target.value)} />
                    </div>
                  </div>
                </CardContent></Card>;
              })}
            </div>
          </TabsContent>

          <TabsContent value="grapher" className="space-y-4">
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2"><Calculator className="w-5 h-5" /><h2 className="text-2xl font-semibold">Function Lab</h2></div>
              <p className="text-sm text-slate-600">Use mathjs syntax: <code>x^2</code>, <code>sin(x)</code>, <code>e^x</code>, <code>ln(x)</code>, <code>sqrt(x)</code>. The integral curve is a numerical accumulation from the left endpoint.</p>
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
                <div className="lg:col-span-2"><label className="text-sm font-medium">f(x)</label><Input value={expr} onChange={(e) => setExpr(e.target.value)} /></div>
                <div><label className="text-sm font-medium">x min</label><Input type="number" value={xMin} onChange={(e) => setXMin(e.target.value)} /></div>
                <div><label className="text-sm font-medium">x max</label><Input type="number" value={xMax} onChange={(e) => setXMax(e.target.value)} /></div>
                <div><label className="text-sm font-medium">y min</label><Input type="number" value={yMin} onChange={(e) => setYMin(e.target.value)} /></div>
                <div><label className="text-sm font-medium">y max</label><Input type="number" value={yMax} onChange={(e) => setYMax(e.target.value)} /></div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <label className="flex items-center gap-2"><Checkbox checked={showDerivative} onCheckedChange={(v) => setShowDerivative(Boolean(v))} />Show derivative</label>
                <label className="flex items-center gap-2"><Checkbox checked={showIntegral} onCheckedChange={(v) => setShowIntegral(Boolean(v))} />Show accumulated integral</label>
              </div>
              {graph.ok ? <div className="space-y-2"><div className="text-sm text-slate-600">Derivative: <code>f'(x) = {graph.dExpr}</code></div><div className="h-[430px] rounded-2xl border bg-white p-3"><ResponsiveContainer width="100%" height="100%"><LineChart data={graph.data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="x" type="number" domain={[safeNumber(xMin, -4), safeNumber(xMax, 4)]} /><YAxis domain={[safeNumber(yMin, -10), safeNumber(yMax, 10)]} /><Tooltip /><ReferenceLine x={0} /><ReferenceLine y={0} /><Line dot={false} type="monotone" dataKey="f" name="f(x)" strokeWidth={2} isAnimationActive={false} />{showDerivative && <Line dot={false} type="monotone" dataKey="derivative" name="f'(x)" strokeWidth={2} isAnimationActive={false} />}{showIntegral && <Line dot={false} type="monotone" dataKey="integral" name="Accumulated integral" strokeWidth={2} isAnimationActive={false} />}</LineChart></ResponsiveContainer></div></div> : <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm">{graph.message}</div>}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="parent" className="space-y-5">
            <Card className="rounded-2xl shadow-sm"><CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2"><Lock className="w-5 h-5 text-slate-500" /><Badge variant="secondary">Parent-safe summary</Badge></div>
              <h2 className="text-3xl font-bold">{student.name}'s AP Calculus Progress</h2>
              <p className="text-slate-600">Goal: {student.target}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border bg-white"><p className="text-sm text-slate-500">Curriculum progress</p><p className="text-3xl font-semibold">{metrics.overall}%</p></div>
                <div className="p-4 rounded-2xl border bg-white"><p className="text-sm text-slate-500">Recent practice</p><p className="text-3xl font-semibold">{pct(student.recentScore)}%</p></div>
                <div className="p-4 rounded-2xl border bg-white"><p className="text-sm text-slate-500">Homework completion</p><p className="text-3xl font-semibold">{pct(student.homeworkCompletion)}%</p></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Current priority areas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{metrics.weak.map((u) => <div key={u.id} className="p-4 rounded-2xl bg-white border"><b>{u.title}</b><p className="text-sm text-slate-600 mt-1">Next step: teach, practice, then review mixed AP-style problems.</p></div>)}</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Tutor notes</h3>
                <p className="p-4 rounded-2xl bg-white border text-sm text-slate-700 whitespace-pre-wrap">{student.notes || "No parent-facing notes added yet."}</p>
              </div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
