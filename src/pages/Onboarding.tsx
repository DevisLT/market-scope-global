import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  LineChart,
  BrainCircuit,
  Globe2,
  Rocket,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";

type Slide = {
  id: string;
  kicker: string;
  headline: string;
  subtext: string;
  icon: React.ReactNode;
  visual: React.ReactNode;
  cta: string;
};

const ParticleField = () => (
  <div className="pf-particles" aria-hidden>
    {Array.from({ length: 36 }).map((_, i) => (
      <span
        key={i}
        style={{
          left: `${(i * 37) % 100}%`,
          top: `${(i * 53) % 100}%`,
          animationDelay: `${(i % 12) * 0.4}s`,
          animationDuration: `${6 + (i % 7)}s`,
        }}
      />
    ))}
  </div>
);

const WelcomeVisual = () => (
  <div className="pf-visual">
    <div className="pf-orb pf-orb-pulse">
      <Sparkles className="w-16 h-16" strokeWidth={1.2} />
    </div>
    <div className="pf-ring pf-ring-1" />
    <div className="pf-ring pf-ring-2" />
    <div className="pf-ring pf-ring-3" />
  </div>
);

const ChartVisual = () => (
  <div className="pf-visual">
    <svg viewBox="0 0 400 240" className="pf-chart" aria-hidden>
      <defs>
        <linearGradient id="pfGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pfLine" x1="0" x2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      {[40, 80, 120, 160, 200].map((y) => (
        <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgba(125,211,252,0.08)" />
      ))}
      <path
        d="M0,180 C40,140 80,200 120,150 C160,110 200,170 240,90 C280,40 320,120 360,70 L400,80 L400,240 L0,240 Z"
        fill="url(#pfGrad)"
        className="pf-chart-fill"
      />
      <path
        d="M0,180 C40,140 80,200 120,150 C160,110 200,170 240,90 C280,40 320,120 360,70 L400,80"
        fill="none"
        stroke="url(#pfLine)"
        strokeWidth="2.5"
        className="pf-chart-line"
      />
      <circle cx="400" cy="80" r="5" fill="#34d399" className="pf-pulse-dot" />
    </svg>
  </div>
);

const AIVisual = () => (
  <div className="pf-visual">
    <div className="pf-neural">
      <div className="pf-node pf-node-center">
        <BrainCircuit className="w-10 h-10" strokeWidth={1.3} />
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="pf-node pf-node-sat"
          style={{
            transform: `rotate(${i * 60}deg) translateX(120px) rotate(-${i * 60}deg)`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
      <svg className="pf-neural-lines" viewBox="-150 -150 300 300" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i * 60 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos(a) * 120}
              y2={Math.sin(a) * 120}
              stroke="rgba(34,211,238,0.35)"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  </div>
);

const GlobeVisual = () => (
  <div className="pf-visual">
    <div className="pf-globe">
      <Globe2 className="w-28 h-28" strokeWidth={0.8} />
      <div className="pf-globe-glow" />
      {[15, 45, 75, 110, 160, 220, 290].map((deg, i) => (
        <span
          key={i}
          className="pf-globe-node"
          style={{
            transform: `rotate(${deg}deg) translateY(-90px)`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  </div>
);

const LaunchVisual = () => (
  <div className="pf-visual">
    <div className="pf-dashboard">
      <div className="pf-dash-row">
        <div className="pf-dash-card">
          <div className="pf-dash-label">Revenue</div>
          <div className="pf-dash-val">+24.8%</div>
        </div>
        <div className="pf-dash-card">
          <div className="pf-dash-label">Markets</div>
          <div className="pf-dash-val">142</div>
        </div>
      </div>
      <div className="pf-dash-chart">
        <svg viewBox="0 0 200 60" aria-hidden>
          <polyline
            points="0,40 25,30 50,35 75,20 100,25 125,10 150,18 175,8 200,12"
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="pf-dash-hologram">
        <Rocket className="w-8 h-8" />
      </div>
    </div>
  </div>
);

const slides: Slide[] = [
  {
    id: "welcome",
    kicker: "Welcome",
    headline: "Welcome to the Future of Market Intelligence",
    subtext: "Track, analyze, and visualize pricing movement in real time.",
    icon: <Sparkles className="w-4 h-4" />,
    visual: <WelcomeVisual />,
    cta: "Start Tutorial",
  },
  {
    id: "tracking",
    kicker: "Real-Time Tracking",
    headline: "Monitor Prices Across Markets Instantly",
    subtext: "Live charts and dynamic graphs surface every market signal as it happens.",
    icon: <LineChart className="w-4 h-4" />,
    visual: <ChartVisual />,
    cta: "Continue",
  },
  {
    id: "ai",
    kicker: "AI Intelligence",
    headline: "AI-Powered Insights That Predict Market Movement",
    subtext: "Neural models forecast trends and surface intelligent recommendations.",
    icon: <BrainCircuit className="w-4 h-4" />,
    visual: <AIVisual />,
    cta: "Continue",
  },
  {
    id: "global",
    kicker: "Global Commerce",
    headline: "Understand Global Economic Movement",
    subtext: "Connect to a worldwide ecosystem of pricing nodes and trade flows.",
    icon: <Globe2 className="w-4 h-4" />,
    visual: <GlobeVisual />,
    cta: "Continue",
  },
  {
    id: "launch",
    kicker: "Ready",
    headline: "Your Market Intelligence Journey Starts Now",
    subtext: "Step into a premium command center built for decisive action.",
    icon: <Rocket className="w-4 h-4" />,
    visual: <LaunchVisual />,
    cta: "Launch PriceFlow",
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);

  const finish = () => {
    try {
      localStorage.setItem("priceflow_onboarding_seen", "1");
    } catch {}
    navigate("/dashboard");
  };

  const next = () => (index === slides.length - 1 ? finish() : setIndex((i) => i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) next();
    else if (dx > 50) prev();
    touchStartX.current = null;
  };

  const slide = slides[index];

  return (
    <div className="pf-onboarding" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <style>{onboardingCSS}</style>

      <div className="pf-bg-gradient" aria-hidden />
      <div className="pf-bg-grid" aria-hidden />
      <ParticleField />

      {/* Top bar */}
      <header className="pf-topbar">
        <div className="pf-brand">
          <div className="pf-brand-mark" />
          <span>PriceFlow</span>
        </div>
        <button onClick={finish} className="pf-skip">
          Skip <X className="w-4 h-4" />
        </button>
      </header>

      {/* Progress */}
      <div className="pf-progress">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            className={`pf-progress-item ${i === index ? "is-active" : ""} ${i < index ? "is-done" : ""}`}
            aria-label={`Go to step ${i + 1}`}
          >
            <span className="pf-progress-fill" />
          </button>
        ))}
      </div>

      {/* Slide */}
      <main className="pf-stage">
        <div key={slide.id} className="pf-slide">
          <div className="pf-slide-visual">{slide.visual}</div>

          <div className="pf-slide-content">
            <div className="pf-kicker">
              {slide.icon}
              <span>{slide.kicker}</span>
              <span className="pf-kicker-count">
                {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
            <h1 className="pf-headline">{slide.headline}</h1>
            <p className="pf-subtext">{slide.subtext}</p>

            <div className="pf-actions">
              {index > 0 && (
                <button onClick={prev} className="pf-btn pf-btn-ghost">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button onClick={next} className="pf-btn pf-btn-primary">
                {slide.cta} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="pf-footer">
        <span>Swipe, click the dots, or use arrow keys to navigate</span>
      </footer>
    </div>
  );
}

const onboardingCSS = `
.pf-onboarding {
  --pf-navy: #050a1f;
  --pf-navy-2: #0a1535;
  --pf-cyan: #22d3ee;
  --pf-teal: #2dd4bf;
  --pf-emerald: #34d399;
  --pf-ink: #e6f1ff;
  --pf-ink-dim: rgba(230, 241, 255, 0.65);
  --pf-stroke: rgba(125, 211, 252, 0.18);

  position: fixed; inset: 0;
  background: var(--pf-navy);
  color: var(--pf-ink);
  font-family: 'Inter', system-ui, sans-serif;
  letter-spacing: 0.01em;
  overflow: hidden;
  z-index: 50;
  display: flex; flex-direction: column;
}
.pf-bg-gradient {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(34,211,238,0.18), transparent 55%),
    radial-gradient(ellipse at 80% 80%, rgba(52,211,153,0.16), transparent 55%),
    radial-gradient(ellipse at 50% 50%, rgba(45,212,191,0.10), transparent 70%),
    linear-gradient(180deg, #050a1f 0%, #0a1535 100%);
  pointer-events: none;
}
.pf-bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(125,211,252,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(125,211,252,0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
  pointer-events: none;
}
.pf-particles { position: absolute; inset: 0; pointer-events: none; }
.pf-particles span {
  position: absolute; width: 3px; height: 3px; border-radius: 50%;
  background: var(--pf-cyan);
  box-shadow: 0 0 12px var(--pf-cyan), 0 0 24px rgba(34,211,238,0.4);
  opacity: 0.45;
  animation: pf-float linear infinite;
}
@keyframes pf-float {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-120px) scale(0.6); opacity: 0; }
}

.pf-topbar {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 28px;
}
.pf-brand { display: flex; align-items: center; gap: 10px; font-weight: 700; letter-spacing: 0.18em; font-size: 13px; text-transform: uppercase; }
.pf-brand-mark {
  width: 22px; height: 22px; border-radius: 6px;
  background: linear-gradient(135deg, var(--pf-cyan), var(--pf-emerald));
  box-shadow: 0 0 18px rgba(34,211,238,0.6);
}
.pf-skip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 999px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--pf-stroke);
  color: var(--pf-ink-dim); font-size: 13px;
  backdrop-filter: blur(12px);
  transition: all 0.2s ease;
}
.pf-skip:hover { color: var(--pf-ink); border-color: var(--pf-cyan); background: rgba(34,211,238,0.08); }

.pf-progress {
  position: relative; z-index: 2;
  display: flex; gap: 8px; padding: 0 28px 8px;
}
.pf-progress-item {
  flex: 1; height: 3px; border-radius: 999px;
  background: rgba(125,211,252,0.12);
  position: relative; overflow: hidden;
  cursor: pointer;
}
.pf-progress-fill {
  position: absolute; inset: 0; transform-origin: left;
  background: linear-gradient(90deg, var(--pf-cyan), var(--pf-emerald));
  box-shadow: 0 0 10px var(--pf-cyan);
  transform: scaleX(0); transition: transform 0.6s ease;
}
.pf-progress-item.is-done .pf-progress-fill { transform: scaleX(1); }
.pf-progress-item.is-active .pf-progress-fill { animation: pf-fill 0.7s ease forwards; }
@keyframes pf-fill { to { transform: scaleX(1); } }

.pf-stage { position: relative; z-index: 2; flex: 1; display: flex; align-items: center; justify-content: center; padding: 16px 28px; }
.pf-slide {
  display: grid; grid-template-columns: 1.05fr 1fr; gap: 48px;
  align-items: center; max-width: 1180px; width: 100%;
  animation: pf-slide-in 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes pf-slide-in {
  from { opacity: 0; transform: translateY(20px); filter: blur(8px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@media (max-width: 880px) {
  .pf-slide { grid-template-columns: 1fr; gap: 24px; }
  .pf-slide-visual { order: -1; }
}
.pf-slide-visual {
  position: relative;
  aspect-ratio: 1 / 1;
  max-height: 420px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(34,211,238,0.06), rgba(52,211,153,0.04));
  border: 1px solid var(--pf-stroke);
  backdrop-filter: blur(20px);
  box-shadow: 0 30px 80px -20px rgba(34,211,238,0.25), inset 0 1px 0 rgba(255,255,255,0.06);
  overflow: hidden;
}

.pf-slide-content { display: flex; flex-direction: column; gap: 20px; }
.pf-kicker {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--pf-cyan); padding: 8px 14px; border-radius: 999px;
  background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.25);
  align-self: flex-start;
}
.pf-kicker-count { color: var(--pf-ink-dim); border-left: 1px solid rgba(125,211,252,0.2); padding-left: 10px; margin-left: 4px; }
.pf-headline {
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  font-weight: 800; font-size: clamp(28px, 4vw, 48px);
  line-height: 1.08; letter-spacing: -0.02em;
  background: linear-gradient(180deg, #ffffff 0%, #cbe6ff 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.pf-subtext { color: var(--pf-ink-dim); font-size: 17px; line-height: 1.55; max-width: 520px; font-weight: 300; }

.pf-actions { display: flex; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
.pf-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 24px; border-radius: 999px;
  font-size: 14px; font-weight: 600; letter-spacing: 0.04em;
  transition: all 0.25s ease; cursor: pointer; border: 1px solid transparent;
}
.pf-btn-primary {
  background: linear-gradient(135deg, var(--pf-cyan), var(--pf-emerald));
  color: #032030;
  box-shadow: 0 12px 40px -10px rgba(34,211,238,0.65), inset 0 1px 0 rgba(255,255,255,0.4);
}
.pf-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 50px -10px rgba(34,211,238,0.8); }
.pf-btn-ghost { background: rgba(255,255,255,0.03); color: var(--pf-ink); border-color: var(--pf-stroke); }
.pf-btn-ghost:hover { background: rgba(255,255,255,0.07); border-color: var(--pf-cyan); }

.pf-footer {
  position: relative; z-index: 2;
  padding: 16px 28px 24px; text-align: center;
  color: rgba(230,241,255,0.4); font-size: 12px; letter-spacing: 0.06em;
}

/* Visuals */
.pf-visual { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

.pf-orb {
  width: 120px; height: 120px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(34,211,238,0.2) 60%, transparent);
  color: var(--pf-cyan);
  box-shadow: 0 0 60px rgba(34,211,238,0.6), 0 0 120px rgba(52,211,153,0.4);
  position: relative; z-index: 2;
}
.pf-orb-pulse { animation: pf-orb-pulse 3s ease-in-out infinite; }
@keyframes pf-orb-pulse {
  0%,100% { transform: scale(1); box-shadow: 0 0 60px rgba(34,211,238,0.6), 0 0 120px rgba(52,211,153,0.4); }
  50% { transform: scale(1.06); box-shadow: 0 0 90px rgba(34,211,238,0.85), 0 0 160px rgba(52,211,153,0.55); }
}
.pf-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(34,211,238,0.4); animation: pf-ring 4s ease-out infinite; }
.pf-ring-1 { width: 180px; height: 180px; animation-delay: 0s; }
.pf-ring-2 { width: 240px; height: 240px; animation-delay: 1s; border-color: rgba(52,211,153,0.3); }
.pf-ring-3 { width: 320px; height: 320px; animation-delay: 2s; border-color: rgba(45,212,191,0.25); }
@keyframes pf-ring {
  0% { transform: scale(0.6); opacity: 0; }
  50% { opacity: 0.7; }
  100% { transform: scale(1.2); opacity: 0; }
}

.pf-chart { width: 90%; height: auto; }
.pf-chart-line { stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: pf-draw 2.4s ease forwards; filter: drop-shadow(0 0 6px rgba(52,211,153,0.6)); }
.pf-chart-fill { opacity: 0; animation: pf-fade 1.5s ease 0.8s forwards; }
@keyframes pf-draw { to { stroke-dashoffset: 0; } }
@keyframes pf-fade { to { opacity: 1; } }
.pf-pulse-dot { filter: drop-shadow(0 0 8px var(--pf-emerald)); animation: pf-dot 1.8s ease-in-out infinite; }
@keyframes pf-dot { 0%,100% { r: 5; opacity: 1; } 50% { r: 8; opacity: 0.6; } }

.pf-neural { position: relative; width: 280px; height: 280px; }
.pf-neural-lines { position: absolute; inset: 0; width: 100%; height: 100%; }
.pf-node {
  position: absolute; top: 50%; left: 50%;
  width: 14px; height: 14px; margin: -7px 0 0 -7px;
  border-radius: 50%;
  background: var(--pf-cyan);
  box-shadow: 0 0 14px var(--pf-cyan);
  animation: pf-node-pulse 2s ease-in-out infinite;
}
.pf-node-center {
  width: 80px; height: 80px; margin: -40px 0 0 -40px;
  background: radial-gradient(circle, rgba(52,211,153,0.6), rgba(34,211,238,0.3));
  display: flex; align-items: center; justify-content: center;
  color: white; z-index: 2;
  box-shadow: 0 0 40px rgba(52,211,153,0.6);
}
@keyframes pf-node-pulse {
  0%,100% { transform: var(--tw, none) scale(1); opacity: 0.8; }
  50% { opacity: 1; }
}
.pf-node-sat { animation: pf-node-sat 3s ease-in-out infinite; }
@keyframes pf-node-sat {
  0%,100% { opacity: 0.5; box-shadow: 0 0 10px var(--pf-cyan); }
  50% { opacity: 1; box-shadow: 0 0 20px var(--pf-cyan), 0 0 35px var(--pf-emerald); }
}

.pf-globe { position: relative; width: 240px; height: 240px; display: flex; align-items: center; justify-content: center; color: rgba(34,211,238,0.85); }
.pf-globe svg { animation: pf-spin 18s linear infinite; filter: drop-shadow(0 0 12px rgba(34,211,238,0.5)); }
@keyframes pf-spin { to { transform: rotate(360deg); } }
.pf-globe-glow { position: absolute; inset: -30px; border-radius: 50%; background: radial-gradient(circle, rgba(34,211,238,0.2), transparent 60%); }
.pf-globe-node {
  position: absolute; top: 50%; left: 50%;
  width: 10px; height: 10px; margin: -5px 0 0 -5px;
  border-radius: 50%; background: var(--pf-emerald);
  box-shadow: 0 0 12px var(--pf-emerald);
  animation: pf-node-pulse 2s ease-in-out infinite;
}

.pf-dashboard {
  position: relative; width: 86%; padding: 20px; border-radius: 18px;
  background: linear-gradient(135deg, rgba(10,21,53,0.85), rgba(5,10,31,0.7));
  border: 1px solid var(--pf-stroke);
  box-shadow: 0 20px 60px -10px rgba(34,211,238,0.35);
  backdrop-filter: blur(12px);
}
.pf-dash-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
.pf-dash-card { padding: 14px; border-radius: 12px; background: rgba(34,211,238,0.06); border: 1px solid rgba(34,211,238,0.18); }
.pf-dash-label { font-size: 11px; color: var(--pf-ink-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.pf-dash-val { font-size: 24px; font-weight: 700; color: var(--pf-emerald); margin-top: 4px; }
.pf-dash-chart { padding: 10px; border-radius: 12px; background: rgba(52,211,153,0.05); border: 1px solid rgba(52,211,153,0.15); }
.pf-dash-chart svg { width: 100%; height: 60px; filter: drop-shadow(0 0 6px rgba(52,211,153,0.5)); }
.pf-dash-hologram {
  position: absolute; top: -16px; right: -16px;
  width: 56px; height: 56px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--pf-cyan), var(--pf-emerald));
  color: #032030; box-shadow: 0 0 30px rgba(34,211,238,0.7);
  animation: pf-orb-pulse 2.5s ease-in-out infinite;
}
`;
