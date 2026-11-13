/** Animated electric waves along the bottom of a section (pure SVG + CSS, no JS). */
const W = 1024;
const wave = (amp: number, phase: number, base: number, k = 1) => {
  let d = "";
  for (let x = 0; x <= W * 2; x += 8) {
    const y = base + Math.sin((x / W) * Math.PI * 2 * k + phase) * amp + Math.sin((x / W) * Math.PI * 6 * k + phase * 2) * amp * 0.3;
    d += `${x ? "L" : "M"}${x} ${y.toFixed(1)}`;
  }
  return d;
};
const LAYERS = [
  { d: wave(14, 0, 44), c: "#ff7a1a", dash: "1 7", speed: 16, w: 1.6 },
  { d: wave(10, 2, 52, 1), c: "#5aa9ff", dash: "1 6", speed: 22, w: 1.4 },
  { d: wave(18, 4, 38, 1), c: "#ff9a4d", dash: "1 9", speed: 28, w: 1.2 },
  { d: wave(7, 1, 58, 1), c: "#ffffff", dash: "1 12", speed: 34, w: 1 },
];
export default function Waves() {
  return (
    <div className="waves" aria-hidden>
      {LAYERS.map((l, i) => (
        <svg key={i} viewBox={`0 0 ${W * 2} 80`} preserveAspectRatio="none" className="wv" style={{ ["--s" as string]: `${l.speed}s`, animationDirection: i % 2 ? "reverse" : "normal" }}>
          <path d={l.d} fill="none" stroke={l.c} strokeWidth={l.w} strokeLinecap="round" strokeDasharray={l.dash} />
        </svg>
      ))}
      <i className="pulse" />
    </div>
  );
}
