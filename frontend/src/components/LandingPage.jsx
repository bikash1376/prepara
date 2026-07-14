import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  Flag,
  Shield,
  Target,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Landing design tokens (paper & ink) — deliberately self-contained  */
/* so the landing page keeps its brand look in light and dark mode.   */
/* ------------------------------------------------------------------ */
const INK = "#1B1830";
const PAPER = "#FAF7EF";
const VIOLET = "#6C5CE7";
const SUN = "#FFC94B";
const MINT = "#4ECDB4";
const CORAL = "#FF7A59";

const cardShadow = "shadow-[5px_5px_0_0_#1B1830]";
const pressable =
  "transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1B1830]";

/* ------------------------------------------------------------------ */
/* Auth gate (unchanged behavior): tests are desktop-only             */
/* ------------------------------------------------------------------ */
const MobileRestrictedAuth = ({ children, mode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDialog, setShowMobileDialog] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // treating anything smaller than laptop as mobile for test platform
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <>
        <div onClick={() => setShowMobileDialog(true)} className="inline-block w-full sm:w-auto text-center cursor-pointer">
          {children}
        </div>
        <Dialog open={showMobileDialog} onOpenChange={setShowMobileDialog}>
          <DialogContent className="sm:max-w-md w-[90%] rounded-lg mx-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Desktop Only</DialogTitle>
              <DialogDescription className="text-base mt-2">
                We apologize, but the practice tests are only available on desktop devices to simulate the real exam environment accurately. Please log in from a desktop or laptop computer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <button
                onClick={() => setShowMobileDialog(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto"
              >
                Understood
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const AuthComponent = mode === "signin" ? SignInButton : SignUpButton;
  return <AuthComponent mode="modal">{children}</AuthComponent>;
};

/* ------------------------------------------------------------------ */
/* Hand-drawn SVG bits — no stock images anywhere                     */
/* ------------------------------------------------------------------ */

const Sparkle = ({ className = "", fill = SUN }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M12 1.5c.8 4.8 2.6 8 9 10.5-6.4 2.5-8.2 5.7-9 10.5-.8-4.8-2.6-8-9-10.5 6.4-2.5 8.2-5.7 9-10.5Z"
      fill={fill}
      stroke={INK}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const DoodleArrow = ({ className = "" }) => (
  <svg viewBox="0 0 120 70" className={className} fill="none" aria-hidden="true">
    <path
      d="M6 10 C 42 4, 84 14, 102 46"
      stroke={INK}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="1 8"
    />
    <path d="M108 56 L 100 40 M108 56 L 90 52" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** Friendly pencil mascot */
const PencilBuddy = ({ className = "" }) => (
  <svg viewBox="0 0 140 190" className={className} aria-hidden="true">
    {/* waving arm (behind body) */}
    <path d="M96 92 Q 122 84 126 60" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
    <circle cx="127" cy="57" r="6" fill={SUN} stroke={INK} strokeWidth="3" />
    {/* eraser */}
    <rect x="44" y="12" width="52" height="26" rx="10" fill={CORAL} stroke={INK} strokeWidth="3.5" />
    {/* ferrule */}
    <rect x="41" y="34" width="58" height="14" rx="4" fill="#C9C4E8" stroke={INK} strokeWidth="3.5" />
    {/* body */}
    <rect x="44" y="46" width="52" height="88" fill={SUN} stroke={INK} strokeWidth="3.5" />
    <line x1="61" y1="47" x2="61" y2="133" stroke={INK} strokeWidth="1.6" opacity="0.25" />
    <line x1="79" y1="47" x2="79" y2="133" stroke={INK} strokeWidth="1.6" opacity="0.25" />
    {/* wood + tip */}
    <path d="M44 134 L96 134 L70 178 Z" fill="#F3E3C0" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M62 166 L78 166 L70 178 Z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    {/* face */}
    <circle cx="59" cy="76" r="4.2" fill={INK} />
    <circle cx="81" cy="76" r="4.2" fill={INK} />
    <circle cx="60.5" cy="74.5" r="1.4" fill="#fff" />
    <circle cx="82.5" cy="74.5" r="1.4" fill="#fff" />
    <path d="M62 92 Q 70 100 78 92" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <circle cx="52" cy="88" r="4.5" fill={CORAL} opacity="0.55" />
    <circle cx="88" cy="88" r="4.5" fill={CORAL} opacity="0.55" />
    {/* resting arm */}
    <path d="M44 96 Q 26 104 24 118" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
  </svg>
);

/** Animated score-growth chart, drawn by hand */
const ScoreChart = () => {
  const points = "10,118 66,96 122,102 178,62 234,48 290,18";
  return (
    <svg viewBox="0 0 300 140" className="w-full" aria-hidden="true">
      {/* notebook grid */}
      {[28, 56, 84, 112].map((y) => (
        <line key={y} x1="0" y1={y} x2="300" y2={y} stroke={INK} strokeWidth="1" opacity="0.08" />
      ))}
      {[60, 120, 180, 240].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="140" stroke={INK} strokeWidth="1" opacity="0.08" />
      ))}
      <motion.polyline
        points={points}
        fill="none"
        stroke={VIOLET}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      {points.split(" ").map((p, i) => {
        const [x, y] = p.split(",");
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="5"
            fill={i === 5 ? SUN : "#fff"}
            stroke={INK}
            strokeWidth="2.5"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.18 }}
          />
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Hero collage pieces                                                */
/* ------------------------------------------------------------------ */

const QuestionCardMock = () => (
  <div className={`bg-white border-2 rounded-2xl p-5 w-full max-w-sm ${cardShadow}`} style={{ borderColor: INK }}>
    <div className="flex items-center justify-between mb-4">
      <span className="font-grotesk text-xs font-bold uppercase tracking-wider" style={{ color: INK }}>
        Reading · Module 1
      </span>
      <span
        className="font-grotesk text-xs font-bold px-2.5 py-1 rounded-full border-2 flex items-center gap-1"
        style={{ borderColor: INK, backgroundColor: SUN, color: INK }}
      >
        <Clock className="w-3 h-3" /> 32:15
      </span>
    </div>
    <p className="font-grotesk text-sm font-semibold mb-4 leading-snug" style={{ color: INK }}>
      Which choice completes the text with the most logical word or phrase?
    </p>
    <div className="space-y-2 font-grotesk text-sm">
      {[
        { letter: "A", text: "ambiguous", state: "plain" },
        { letter: "B", text: "meticulous", state: "selected" },
        { letter: "C", text: "fleeting", state: "plain" },
        { letter: "D", text: "clamorous", state: "struck" },
      ].map((opt) => (
        <div
          key={opt.letter}
          className="flex items-center gap-3 px-3 py-2 rounded-xl border-2"
          style={{
            borderColor: opt.state === "selected" ? VIOLET : `${INK}22`,
            backgroundColor: opt.state === "selected" ? "#F1EEFF" : "#fff",
            color: INK,
            opacity: opt.state === "struck" ? 0.45 : 1,
          }}
        >
          <span
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              borderColor: opt.state === "selected" ? VIOLET : INK,
              backgroundColor: opt.state === "selected" ? VIOLET : "transparent",
              color: opt.state === "selected" ? "#fff" : INK,
            }}
          >
            {opt.letter}
          </span>
          <span className={opt.state === "struck" ? "line-through" : ""}>{opt.text}</span>
          {opt.state === "selected" && <CheckCircle2 className="w-4 h-4 ml-auto" style={{ color: VIOLET }} />}
        </div>
      ))}
    </div>
    <div className="flex items-center justify-between mt-4 pt-3 border-t-2" style={{ borderColor: `${INK}14` }}>
      <span className="font-grotesk text-xs font-semibold flex items-center gap-1.5" style={{ color: `${INK}99` }}>
        <Flag className="w-3.5 h-3.5" /> Mark for review
      </span>
      <span
        className="font-grotesk text-xs font-bold px-3 py-1.5 rounded-full"
        style={{ backgroundColor: INK, color: PAPER }}
      >
        Next →
      </span>
    </div>
  </div>
);

const ScoreCardMock = () => (
  <div className={`bg-white border-2 rounded-2xl p-4 w-56 ${cardShadow}`} style={{ borderColor: INK }}>
    <div className="flex items-center justify-between mb-2">
      <span className="font-grotesk text-xs font-bold uppercase tracking-wider" style={{ color: `${INK}99` }}>
        Your progress
      </span>
      <span
        className="font-grotesk text-[11px] font-bold px-2 py-0.5 rounded-full border-2"
        style={{ borderColor: INK, backgroundColor: MINT, color: INK }}
      >
        ↑ climbing
      </span>
    </div>
    <ScoreChart />
    <div className="flex justify-between mt-1 font-grotesk text-[10px] font-semibold" style={{ color: `${INK}77` }}>
      <span>Test 1</span>
      <span>Test 6</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Scroll animation helper                                            */
/* ------------------------------------------------------------------ */
const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.55, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
const LandingPage = () => {
  const steps = [
    {
      n: "1",
      bg: SUN,
      title: "Pick a practice test",
      desc: "Browse the library and jump straight in. There is nothing to install, everything runs in your browser.",
    },
    {
      n: "2",
      bg: MINT,
      title: "Sit it like the real thing",
      desc: "Timed modules, breaks, mark for review, strike-outs and a built-in calculator. It feels just like the actual exam.",
    },
    {
      n: "3",
      bg: CORAL,
      title: "Learn from every answer",
      desc: "You get your score right away, plus a walkthrough of every question, so each test makes the next one better.",
    },
  ];

  const features = [
    {
      icon: <Clock className="w-5 h-5" />,
      bg: "#FFF3D1",
      title: "Real exam environment",
      desc: "The same interface, timer and module flow you'll see on test day, so nothing catches you off guard.",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      bg: "#E8E4FB",
      title: "Progress tracking",
      desc: "Every attempt is saved to your history so you can watch your score trend upward over time.",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      bg: "#DDF5EE",
      title: "Answer explanations",
      desc: "See your score instantly and read why each answer was right or wrong, not just what the answer was.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      bg: "#FFE4DA",
      title: "Pause & resume",
      desc: "Life happens. Save mid-test and pick up exactly where you left off, timer and answers intact.",
    },
    {
      icon: <Target className="w-5 h-5" />,
      bg: "#E3EEFF",
      title: "Exam-day tools",
      desc: "Mark questions for review, strike out options, and use the built-in graphing calculator.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      bg: "#FBE7F4",
      title: "Your own dashboard",
      desc: "A personal account that keeps your tests, results and review history in one tidy place.",
    },
  ];

  return (
    <div className="min-h-screen font-grotesk" style={{ backgroundColor: PAPER, color: INK }}>
      {/* ---------------- Nav ---------------- */}
      <nav
        className="fixed top-0 left-0 right-0 h-18 z-50 border-b-2 backdrop-blur-md"
        style={{ borderColor: INK, backgroundColor: `${PAPER}E6`, height: "72px" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <span className="font-display text-2xl font-bold tracking-tight">Prepara</span>

          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <a href="#how" className="hover:opacity-60 transition-opacity">How it works</a>
            <a href="#features" className="hover:opacity-60 transition-opacity">Features</a>
            <a href="#results" className="hover:opacity-60 transition-opacity">Results</a>
          </div>

          <div className="flex items-center gap-3">
            <MobileRestrictedAuth mode="signin">
              <button className="text-sm font-bold px-4 py-2 rounded-full hover:opacity-60 transition-opacity">
                Log in
              </button>
            </MobileRestrictedAuth>
            <MobileRestrictedAuth mode="signup">
              <button
                className={`text-sm font-bold px-5 py-2.5 rounded-full border-2 flex items-center gap-1.5 ${cardShadow} ${pressable}`}
                style={{ backgroundColor: VIOLET, borderColor: INK, color: "#fff" }}
              >
                Get started <ArrowRight className="w-4 h-4" />
              </button>
            </MobileRestrictedAuth>
          </div>
        </div>
      </nav>

      {/* ---------------- Hero ---------------- */}
      <section
        className="pt-36 pb-20 lg:pt-44 lg:pb-28 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(${INK}0A 1px, transparent 1px), linear-gradient(90deg, ${INK}0A 1px, transparent 1px)`,
          backgroundSize: "34px 34px",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative">
          {/* Left: copy */}
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="font-display font-black text-5xl lg:text-[4.2rem] leading-[1.04] tracking-tight mb-6"
            >
              Practice like it's{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span
                  className="absolute inset-x-[-4px] bottom-1 top-[55%] -rotate-1 rounded-sm -z-10"
                  style={{ backgroundColor: SUN }}
                />
                the real test
              </span>
              , score like you mean it.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="text-lg leading-relaxed mb-9 max-w-md"
              style={{ color: `${INK}B3` }}
            >
              Prepara puts you in front of the same screen, the same timer and the same pressure as the real
              exam. Then it shows you exactly where you gained and lost points, so there are no surprises
              left for test day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <MobileRestrictedAuth mode="signup">
                <button
                  className={`px-7 py-4 rounded-full border-2 font-bold text-lg flex items-center gap-2 ${cardShadow} ${pressable}`}
                  style={{ backgroundColor: VIOLET, borderColor: INK, color: "#fff" }}
                >
                  Start practicing free <ArrowRight className="w-5 h-5" />
                </button>
              </MobileRestrictedAuth>
              <a
                href="#how"
                className={`px-7 py-4 rounded-full border-2 font-bold text-lg bg-white ${cardShadow} ${pressable}`}
                style={{ borderColor: INK, color: INK }}
              >
                How it works
              </a>
            </motion.div>
          </div>

          {/* Right: sticker collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <DoodleArrow className="absolute -left-24 top-6 w-24 rotate-[20deg]" />
            <Sparkle className="absolute -top-8 left-10 w-7 h-7" />
            <Sparkle className="absolute top-24 -right-4 w-5 h-5" fill={CORAL} />
            <Sparkle className="absolute -bottom-4 left-0 w-6 h-6" fill={MINT} />

            <div className="rotate-1 flex justify-center">
              <QuestionCardMock />
            </div>

            <motion.div
              className="absolute -bottom-14 -left-10 -rotate-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ScoreCardMock />
            </motion.div>

            <div className="absolute -right-8 -bottom-16 w-32 animate-landing-bob">
              <PencilBuddy className="w-full rotate-6" />
            </div>

            <div
              className={`absolute -top-6 right-2 rotate-6 px-4 py-2 rounded-full border-2 font-bold text-sm bg-white ${cardShadow}`}
              style={{ borderColor: INK }}
            >
              🎯 1400 club, loading…
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="font-display font-black text-4xl lg:text-5xl tracking-tight mb-4">
              Three steps. Zero mystery.
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: `${INK}B3` }}>
              You don't need another study hack. You just need honest practice in a realistic setting.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.12}>
                <div
                  className={`bg-white border-2 rounded-2xl p-8 h-full ${cardShadow}`}
                  style={{ borderColor: INK }}
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-display font-black text-xl mb-6 -rotate-6"
                    style={{ borderColor: INK, backgroundColor: step.bg }}
                  >
                    {step.n}
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3">{step.title}</h3>
                  <p className="leading-relaxed" style={{ color: `${INK}B3` }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="py-24" style={{ backgroundColor: "#F3EFE3" }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="font-display font-black text-4xl lg:text-5xl tracking-tight mb-4">
              Everything the exam throws at you
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: `${INK}B3` }}>
              Built to match the digital test experience, tool for tool.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={(i % 3) * 0.1}>
                <div
                  className={`border-2 rounded-2xl p-7 h-full ${cardShadow} ${pressable}`}
                  style={{ borderColor: INK, backgroundColor: feature.bg }}
                >
                  <div
                    className="w-11 h-11 bg-white rounded-xl border-2 flex items-center justify-center mb-5"
                    style={{ borderColor: INK, color: INK }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2.5">{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: `${INK}B3` }}>{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Results ---------------- */}
      <section id="results" className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div
              className="inline-block px-3 py-1 rounded-full border-2 text-xs font-bold uppercase tracking-wider mb-6 -rotate-2"
              style={{ borderColor: INK, backgroundColor: MINT }}
            >
              After every test
            </div>
            <h2 className="font-display font-black text-4xl lg:text-5xl tracking-tight mb-5">
              Your score, explained. Not just announced.
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: `${INK}B3` }}>
              Finish a test and get your score instantly, then walk through every question: what you picked,
              what was right, and why. Your history sticks around, so improvement is something you can
              actually see.
            </p>
            <ul className="space-y-3 font-semibold">
              {["Question-by-question review with explanations", "Full submission history on your dashboard", "Score trends across every attempt"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: INK, backgroundColor: SUN }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className={`bg-white border-2 rounded-2xl p-7 rotate-1 ${cardShadow}`} style={{ borderColor: INK }}>
              <div className="flex items-center justify-between mb-5">
                <span className="font-display font-bold text-xl">Score report</span>
                <span
                  className="px-3 py-1 rounded-full border-2 text-xs font-bold -rotate-3"
                  style={{ borderColor: INK, backgroundColor: SUN }}
                >
                  +180 pts
                </span>
              </div>
              <ScoreChart />
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: "Correct", value: "52/66", bg: "#DDF5EE" },
                  { label: "Accuracy", value: "79%", bg: "#E8E4FB" },
                  { label: "Time used", value: "1:58:04", bg: "#FFF3D1" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="border-2 rounded-xl px-3 py-3 text-center"
                    style={{ borderColor: INK, backgroundColor: stat.bg }}
                  >
                    <div className="font-display font-black text-lg leading-none mb-1">{stat.value}</div>
                    <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: `${INK}99` }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: INK }}>
        <Sparkle className="absolute top-12 left-[12%] w-8 h-8 rotate-12" />
        <Sparkle className="absolute bottom-16 right-[15%] w-6 h-6 -rotate-12" fill={MINT} />
        <Sparkle className="absolute top-24 right-[28%] w-5 h-5" fill={CORAL} />

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <div className="w-24 mx-auto mb-6 animate-landing-bob">
              <PencilBuddy className="w-full" />
            </div>
            <h2 className="font-display font-black text-4xl lg:text-6xl tracking-tight mb-6" style={{ color: PAPER }}>
              Your best score is still ahead.
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: `${PAPER}B3` }}>
              Every point you gain in practice is a point you don't have to sweat on exam day.
            </p>
            <MobileRestrictedAuth mode="signup">
              <button
                className="px-10 py-4 rounded-full border-2 font-bold text-lg shadow-[5px_5px_0_0_#6C5CE7] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#6C5CE7]"
                style={{ backgroundColor: SUN, borderColor: PAPER, color: INK }}
              >
                Join free and start today
              </button>
            </MobileRestrictedAuth>
          </FadeIn>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="py-12 border-t-2" style={{ borderColor: INK, backgroundColor: PAPER }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <span className="font-display text-xl font-bold tracking-tight">Prepara</span>
            <div className="flex items-center gap-8 text-sm font-semibold">
              <a href="#how" className="hover:opacity-60 transition-opacity">How it works</a>
              <a href="#features" className="hover:opacity-60 transition-opacity">Features</a>
              <a href="#results" className="hover:opacity-60 transition-opacity">Results</a>
            </div>
          </div>
          <div
            className="pt-6 border-t text-center text-sm font-medium"
            style={{ borderColor: `${INK}22`, color: `${INK}99` }}
          >
            © {new Date().getFullYear()} Prepara. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
