/**
 * AnimatedBackground — premium ambient moving aurora.
 * Pure CSS, GPU-friendly, themed via design tokens.
 * Lives behind all content (z-index: -10).
 */
export function AnimatedBackground() {
  return (
    <div className="pf-bg" aria-hidden>
      <div className="pf-bg-grid" />
      <div className="pf-blob pf-blob-1" />
      <div className="pf-blob pf-blob-2" />
      <div className="pf-blob pf-blob-3" />
      <div className="pf-bg-noise" />
      <style>{css}</style>
    </div>
  );
}

const css = `
.pf-bg {
  position: fixed; inset: 0; z-index: -10; overflow: hidden; pointer-events: none;
  background: hsl(var(--background));
}
.pf-bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(hsl(var(--foreground) / 0.045) 1px, transparent 1px),
    linear-gradient(90deg, hsl(var(--foreground) / 0.045) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  opacity: 0.7;
}
.pf-blob {
  position: absolute; border-radius: 50%; filter: blur(80px);
  will-change: transform; opacity: 0.55;
}
.pf-blob-1 {
  width: 520px; height: 520px;
  background: radial-gradient(circle, hsl(var(--primary) / 0.55), transparent 70%);
  top: -120px; left: -120px;
  animation: pf-drift-1 22s ease-in-out infinite;
}
.pf-blob-2 {
  width: 480px; height: 480px;
  background: radial-gradient(circle, hsl(var(--accent) / 0.45), transparent 70%);
  top: 30%; right: -140px;
  animation: pf-drift-2 26s ease-in-out infinite;
}
.pf-blob-3 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, hsl(var(--secondary) / 0.4), transparent 70%);
  bottom: -200px; left: 30%;
  animation: pf-drift-3 30s ease-in-out infinite;
}
.pf-bg-noise {
  position: absolute; inset: 0; opacity: 0.025; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
html.light .pf-blob { opacity: 0.35; filter: blur(100px); }
html.light .pf-bg-grid { opacity: 0.5; }

@keyframes pf-drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(120px, 80px) scale(1.1); }
}
@keyframes pf-drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-100px, 120px) scale(1.15); }
}
@keyframes pf-drift-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(80px, -100px) scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .pf-blob { animation: none; }
}
`;
