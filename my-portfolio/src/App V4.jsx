import { useEffect, useState, useRef } from "react";
import {
  Mail,
  Phone,
  ExternalLink,
  MapPin,
  ArrowUp,
  ArrowRight,
  Code2,
  Terminal,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./App.css";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
`;

const COLORS = {
  bg: "#05090B",
  bgAlt: "#091014",
  surface: "rgba(10,18,22,0.72)",
  dark: "#030709",
  darkSoft: "#0A1216",
  ink: "#ECFFFB",
  inkSoft: "#AEC3BE",
  line: "rgba(112, 236, 216, 0.22)",
  teal: "#37E6C4",
  tealBright: "#62F5DA",
  tealSoft: "rgba(55,230,196,0.10)",
  lime: "#B8FF7A",
  rust: "#FF7A64",
  blue: "#5FA8FF",
};

/* -------------------------------------------------- */
/* Small building blocks */
/* -------------------------------------------------- */

function StatusBadge({ children, tone = "teal" }) {
  const styles =
    tone === "rust"
      ? {
          bg: "rgba(255,122,100,0.10)",
          fg: COLORS.rust,
        }
      : {
          bg: COLORS.tealSoft,
          fg: COLORS.teal,
        };

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] uppercase"
      style={{
        fontFamily: "'DM Mono', monospace",
        background: styles.bg,
        color: styles.fg,
        border: `1px solid ${styles.fg}30`,
      }}
    >
      <span
        className="pulse-dot h-1.5 w-1.5 rounded-full"
        style={{ background: styles.fg }}
      />
      {children}
    </span>
  );
}

function CornerMarks({ color = COLORS.teal }) {
  return (
    <>
      <span
        className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2"
        style={{ borderColor: color }}
      />
      <span
        className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2"
        style={{ borderColor: color }}
      />
      <span
        className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2"
        style={{ borderColor: color }}
      />
      <span
        className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2"
        style={{ borderColor: color }}
      />
    </>
  );
}

function SectionLabel({ number, title, description }) {
  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center gap-4">
        <span
          className="mono text-[10px] tracking-[0.25em]"
          style={{ color: COLORS.teal }}
        >
          {number}
        </span>

        <div
          className="h-px flex-1"
          style={{ background: COLORS.line }}
        />

        <span
          className="mono text-[10px] tracking-[0.2em]"
          style={{ color: COLORS.inkSoft }}
        >
          2026
        </span>
      </div>

      <h2
        className="display text-4xl md:text-5xl"
        style={{
          fontWeight: 700,
          color: COLORS.ink,
          letterSpacing: "-0.04em",
        }}
      >
        {title}
      </h2>

      {description && (
        <p
          className="body-font mt-3 max-w-xl text-sm leading-relaxed"
          style={{ color: COLORS.inkSoft }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0)"
          : "translateY(24px)",
        filter: visible ? "blur(0px)" : "blur(8px)",
        transition: `
          opacity 0.75s ease ${delay}ms,
          transform 0.75s cubic-bezier(.22,1,.36,1) ${delay}ms,
          filter 0.75s ease ${delay}ms
        `,
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------- */
/* Background / visual effects */
/* -------------------------------------------------- */

function BackgroundGrid() {
  return (
    <>
      <div className="background-base" />
      <div className="background-grid" />
      <div className="perspective-grid" />
      <div className="background-glow background-glow-one" />
      <div className="background-glow background-glow-two" />
      <div className="background-glow background-glow-three" />
      <div className="background-orbit orbit-one" />
      <div className="background-orbit orbit-two" />
      <div className="background-constellation constellation-one" />
      <div className="background-constellation constellation-two" />
      <div className="scanline-overlay" />
      <div className="noise-overlay" />
      <div className="ambient-particle particle-1" />
      <div className="ambient-particle particle-2" />
      <div className="ambient-particle particle-3" />
      <div className="ambient-particle particle-4" />
      <div className="ambient-particle particle-5" />
      <div className="ambient-particle particle-6" />
    </>
  );
}

function LandmarkMesh({ size = 380, seed = 11 }) {
  const seededRandom = (initialSeed) => {
    let s = initialSeed;

    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  };

  const rand = seededRandom(seed);

  const points = Array.from({ length: 34 }).map((_, i) => ({
    id: i,
    x: 40 + rand() * (size - 80),
    y: 40 + rand() * (size - 80),
  }));

  const edges = [];

  points.forEach((point, index) => {
    const nearest = points
      .map((other, j) => ({
        j,
        distance:
          (point.x - other.x) ** 2 +
          (point.y - other.y) ** 2,
      }))
      .filter((item) => item.j !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    nearest.forEach((item) => {
      edges.push([index, item.j]);
    });
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[430px]">
      <div className="absolute inset-8 rounded-full border border-dashed border-[rgba(98,245,218,.22)]" />

      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        className="mesh-rotate"
        aria-hidden="true"
      >
        <g
          stroke={COLORS.teal}
          strokeWidth="0.8"
          opacity="0.48"
        >
          {edges.map(([a, b], index) => (
            <line
              key={index}
              x1={points[a].x}
              y1={points[a].y}
              x2={points[b].x}
              y2={points[b].y}
            />
          ))}
        </g>

        {points.map((point) => (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r={point.id % 5 === 0 ? 3 : 1.7}
            fill={
              point.id % 7 === 0
                ? COLORS.rust
                : COLORS.tealBright
            }
          >
            <animate
              attributeName="opacity"
              values="0.25;1;0.25"
              dur={`${2.5 + (point.id % 5)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="mono text-[9px] tracking-[0.3em]"
          style={{ color: COLORS.teal }}
        >
          CV / LIVENESS
        </div>

        <div
          className="mono mt-1 text-[8px] tracking-[0.2em]"
          style={{ color: COLORS.inkSoft }}
        >
          34 LANDMARKS
        </div>
      </div>
    </div>
  );
}

function useLiveConfidence() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animationFrame;
    let start = null;

    const target = 88.2;
    const duration = 1800;

    const animate = (timestamp) => {
      if (!start) start = timestamp;

      const progress = Math.min(
        (timestamp - start) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(+(target * eased).toFixed(1));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return value;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const documentElement = document.documentElement;

      const value =
        documentElement.scrollTop /
        (documentElement.scrollHeight -
          documentElement.clientHeight || 1);

      setProgress(Math.min(1, Math.max(0, value)));
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    onScroll();

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

/* -------------------------------------------------- */
/* Content */
/* -------------------------------------------------- */

const EXPERIENCE = [
  {
    id: "EXP-01",
    role: "QA Engineer, Intern",
    org: "IDEMIA",
    loc: "Malaysia",
    period: "Oct 2025 — Jan 2026",
    log: [
      "Built automated testing frameworks with Robot Framework to streamline validation across the software suite.",
      "Optimized search and validation logic through data structure and algorithm improvements, cutting execution overhead.",
      "Shipped a Python/Tkinter GUI so non-technical stakeholders could run automated tests independently.",
      "Partnered with cross-functional teams on defect detection and delivery of enterprise-grade releases.",
    ],
  },
];

const PROJECTS = [
  {
    id: "01",
    name: "Folio",
    tagline: "AI-powered bookstore & biometric authentication",
    period: "Final Year Project",
    status: "FEATURED",
    description:
      "Full-stack progressive web app combining React, Laravel, MySQL and a custom Python computer-vision microservice. The system integrates facial recognition, liveness detection and biometric payment workflows.",
    metrics: [
      { label: "LFW accuracy", value: "88.2%" },
      { label: "False accept", value: "0%" },
      { label: "Tests passed", value: "92 / 92" },
      { label: "SUS score", value: "80" },
    ],
    stack: [
      "React",
      "Vite",
      "Laravel",
      "MySQL",
      "Flask",
      "InsightFace",
      "MediaPipe",
    ],
    link: "https://github.com/DefinitelyNotTzeJing/FYP",
  },
  {
    id: "02",
    name: "Driver Task Selection",
    tagline: "Branch & Bound optimization",
    period: "Data Structures & Algorithms",
    status: "COMPLETED",
    description:
      "Designed and implemented a Branch and Bound algorithm in Java to optimize driver task selection, benchmarked against a greedy / priority-queue approach.",
    metrics: [],
    stack: [
      "Java",
      "Branch & Bound",
      "Algorithm Design",
    ],
    link: "https://github.com/DefinitelyNotTzeJing/Data-Structure-Algorithms",
  },
  {
    id: "03",
    name: "Intercity Bus Booking",
    tagline: "Offline-first transit booking application",
    period: "Web & App Development",
    status: "COMPLETED",
    description:
      "Cross-platform mobile application integrating GTFS transit data, OpenWeatherMap forecasts and geocoding. Offline-first architecture powered by SQLite with AsyncStorage session handling.",
    metrics: [],
    stack: [
      "React Native",
      "TypeScript",
      "SQLite",
      "GTFS",
      "OpenWeatherMap",
    ],
    link: null,
  },
  {
    id: "04",
    name: "Hollow Knight-inspired Platformer",
    tagline: "2D action platformer",
    period: "Personal Project",
    status: "COMPLETED",
    description:
      "Player movement, combat systems and level design for a 2D action-platformer built using the Godot engine.",
    metrics: [],
    stack: ["Godot", "GDScript"],
    link: "https://github.com/DefinitelyNotTzeJing/GameEngine",
  },
  {
    id: "05",
    name: "Predictive Model Benchmark",
    tagline: "Machine-learning algorithm comparison",
    period: "Data Mining",
    status: "COMPLETED",
    description:
      "Benchmarked multiple predictive algorithms using accuracy, precision and related metrics to identify the best-performing model for a prediction task.",
    metrics: [],
    stack: [
      "Python",
      "Google Colab",
      "Data Mining",
    ],
    link: null,
  },
];

const SKILLS = {
  Frameworks: [
    "React",
    "React Native",
    "Laravel",
    "Flask",
    "Robot Framework",
    "InsightFace",
    "MediaPipe",
    "Tkinter",
  ],
  Languages: [
    "Python",
    "PHP",
    "JavaScript",
    "TypeScript",
    "Java",
    "SQL",
  ],
  "Tools & Platforms": [
    "Git & GitHub",
    "MySQL",
    "Docker",
    "Netlify",
    "ngrok",
    "Godot",
    "Google Colab",
  ],
  "Focus Areas": [
    "Test automation",
    "Full-stack development",
    "Computer vision",
    "REST API design",
  ],
};

/* -------------------------------------------------- */
/* Main Portfolio */
/* -------------------------------------------------- */

export default function Portfolio() {
  const confidence = useLiveConfidence();
  const scrollProgress = useScrollProgress();

  const [showTop, setShowTop] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 800);
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerMove = (event) => {
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div
      id="top"
      className="portfolio min-h-screen overflow-hidden"
      style={{
        background: COLORS.bg,
        color: COLORS.ink,
      }}
    >
      <style>{`
        ${FONT_IMPORT}

        html {
          scroll-behavior: smooth;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: ${COLORS.bg};
        }

        .mono {
          font-family: "DM Mono", monospace;
        }

        .display {
          font-family: "Space Grotesk", sans-serif;
        }

        .body-font {
          font-family: "Manrope", sans-serif;
        }

        .portfolio {
          font-family: "Manrope", sans-serif;
        }

        :root {
          --mouse-x: 50vw;
          --mouse-y: 35vh;
        }

        body {
          overflow-x: hidden;
        }

        .portfolio {
          position: relative;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% -10%, rgba(55,230,196,0.08), transparent 32%),
            linear-gradient(180deg, #061014 0%, #05090B 45%, #030607 100%);
        }

        .background-base {
          position: fixed;
          inset: 0;
          z-index: -8;
          background:
            radial-gradient(circle at 15% 10%, rgba(95,168,255,0.08), transparent 22%),
            radial-gradient(circle at 85% 22%, rgba(55,230,196,0.10), transparent 24%),
            radial-gradient(circle at 50% 88%, rgba(184,255,122,0.045), transparent 28%),
            #05090B;
          pointer-events: none;
        }

        .mouse-glow {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), rgba(55,230,196,0.075), transparent 65%);
          mix-blend-mode: screen;
        }

        .perspective-grid {
          position: fixed;
          left: -20vw;
          right: -20vw;
          bottom: -34vh;
          height: 74vh;
          z-index: -6;
          opacity: 0.3;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(55,230,196,0.11) 1px, transparent 1px),
            linear-gradient(90deg, rgba(55,230,196,0.11) 1px, transparent 1px);
          background-size: 54px 54px;
          transform: perspective(520px) rotateX(68deg);
          transform-origin: center bottom;
          mask-image: linear-gradient(to top, black 0%, rgba(0,0,0,.85) 35%, transparent 88%);
          animation: gridDrift 18s linear infinite;
        }

        @keyframes gridDrift {
          to { background-position: 0 54px, 54px 0; }
        }

        .background-orbit {
          position: fixed;
          z-index: -5;
          border: 1px solid rgba(55,230,196,0.09);
          border-radius: 50%;
          pointer-events: none;
          box-shadow: 0 0 80px rgba(55,230,196,0.03), inset 0 0 80px rgba(95,168,255,0.02);
        }

        .orbit-one {
          width: 56vw;
          aspect-ratio: 1;
          right: -23vw;
          top: 9vh;
          animation: orbitFloat 18s ease-in-out infinite alternate;
        }

        .orbit-two {
          width: 34vw;
          aspect-ratio: 1;
          left: -18vw;
          top: 48vh;
          animation: orbitFloat 22s ease-in-out infinite alternate-reverse;
        }

        @keyframes orbitFloat {
          from { transform: translateY(-10px) scale(1); }
          to { transform: translateY(24px) scale(1.04); }
        }

        .background-constellation {
          position: fixed;
          z-index: -4;
          pointer-events: none;
          width: 320px;
          height: 220px;
          opacity: 0.25;
          background:
            radial-gradient(circle at 10% 30%, rgba(98,245,218,.9) 0 1px, transparent 2px),
            radial-gradient(circle at 36% 12%, rgba(98,245,218,.65) 0 1px, transparent 2px),
            radial-gradient(circle at 55% 52%, rgba(95,168,255,.65) 0 1px, transparent 2px),
            radial-gradient(circle at 84% 26%, rgba(98,245,218,.8) 0 1px, transparent 2px),
            linear-gradient(28deg, transparent 48%, rgba(98,245,218,.09) 49%, rgba(98,245,218,.09) 50%, transparent 51%);
          filter: drop-shadow(0 0 10px rgba(98,245,218,.2));
        }

        .constellation-one { right: 4vw; top: 18vh; transform: rotate(-8deg); }
        .constellation-two { left: 3vw; top: 68vh; transform: rotate(14deg) scale(.8); }

        .scanline-overlay {
          position: fixed;
          inset: 0;
          z-index: 40;
          pointer-events: none;
          opacity: .17;
          background: repeating-linear-gradient(to bottom, transparent 0 3px, rgba(255,255,255,.018) 4px);
          mix-blend-mode: soft-light;
        }

        .noise-overlay {
          position: fixed;
          inset: -50%;
          z-index: 39;
          pointer-events: none;
          opacity: .025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
          animation: noiseShift .35s steps(2) infinite;
        }

        @keyframes noiseShift {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(2%, -1%, 0); }
          100% { transform: translate3d(-1%, 2%, 0); }
        }

        .ambient-particle {
          position: fixed;
          z-index: -3;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: ${COLORS.tealBright};
          box-shadow: 0 0 14px ${COLORS.tealBright};
          opacity: .55;
          pointer-events: none;
          animation: particleFloat 9s ease-in-out infinite;
        }

        .particle-1 { left: 8%; top: 21%; animation-delay: -1s; }
        .particle-2 { left: 19%; top: 72%; animation-delay: -4s; }
        .particle-3 { right: 12%; top: 34%; animation-delay: -6s; }
        .particle-4 { right: 23%; top: 76%; animation-delay: -2s; }
        .particle-5 { left: 52%; top: 12%; animation-delay: -7s; }
        .particle-6 { left: 66%; top: 58%; animation-delay: -3s; }

        @keyframes particleFloat {
          0%, 100% { transform: translate3d(0,0,0) scale(.8); opacity: .2; }
          45% { transform: translate3d(14px,-28px,0) scale(1.2); opacity: .75; }
          70% { transform: translate3d(-10px,-42px,0) scale(.9); opacity: .4; }
        }

        .glass-card,
        .project-card {
          background: linear-gradient(180deg, rgba(11,23,27,.78), rgba(6,12,15,.67));
          backdrop-filter: blur(18px) saturate(120%);
          -webkit-backdrop-filter: blur(18px) saturate(120%);
          border-color: rgba(98,245,218,.16) !important;
          box-shadow: 0 18px 70px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.035);
        }

        .hud-panel {
          position: relative;
        }

        .hud-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          background: linear-gradient(110deg, transparent 10%, rgba(98,245,218,.04) 35%, transparent 60%);
          transform: translateX(-120%);
          transition: transform 1s cubic-bezier(.22,1,.36,1);
        }

        .hud-panel:hover::after { transform: translateX(120%); }

        .hero-stage::before {
          content: "";
          position: absolute;
          width: 700px;
          height: 700px;
          right: -180px;
          top: -120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(55,230,196,.13), rgba(95,168,255,.04) 35%, transparent 68%);
          filter: blur(8px);
          pointer-events: none;
          z-index: -1;
        }

        .gradient-text {
          background: linear-gradient(90deg, #ECFFFB 0%, ${COLORS.tealBright} 38%, ${COLORS.lime} 72%, #ECFFFB 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientFlow 8s linear infinite;
          text-shadow: 0 0 45px rgba(55,230,196,.09);
        }

        @keyframes gradientFlow { to { background-position: 220% center; } }

        .hero-copy {
          border-color: rgba(98,245,218,.45) !important;
          box-shadow: -10px 0 30px -22px rgba(98,245,218,.65);
        }

        .hero-visual-core {
          position: relative;
          isolation: isolate;
        }

        .hero-halo {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px solid rgba(98,245,218,.14);
          pointer-events: none;
          z-index: -1;
        }

        .hero-halo-one { width: 82%; aspect-ratio: 1; animation: haloPulse 5s ease-in-out infinite; }
        .hero-halo-two { width: 64%; aspect-ratio: 1; border-style: dashed; animation: haloSpin 26s linear infinite; }

        @keyframes haloPulse { 50% { transform: translate(-50%,-50%) scale(1.06); opacity: .55; } }
        @keyframes haloSpin { to { transform: translate(-50%,-50%) rotate(360deg); } }

        .scan-beam {
          position: absolute;
          left: 10%;
          right: 10%;
          height: 1px;
          top: 16%;
          background: linear-gradient(90deg, transparent, rgba(98,245,218,.9), transparent);
          box-shadow: 0 0 18px rgba(98,245,218,.5);
          animation: scanBeam 4.2s ease-in-out infinite;
          z-index: 3;
          pointer-events: none;
        }

        @keyframes scanBeam {
          0%,100% { transform: translateY(0); opacity: 0; }
          15% { opacity: .8; }
          50% { transform: translateY(220px); opacity: .95; }
          85% { opacity: .4; }
        }

        .contact-panel {
          background:
            radial-gradient(circle at 82% 20%, rgba(55,230,196,.12), transparent 28%),
            linear-gradient(160deg, rgba(7,16,19,.96), rgba(3,8,10,.93)) !important;
          border: 1px solid rgba(98,245,218,.18);
          box-shadow: 0 24px 90px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04);
        }

        ::selection {
          background: ${COLORS.tealBright};
          color: ${COLORS.dark};
        }

        a:focus-visible,
        button:focus-visible {
          outline: 2px solid ${COLORS.teal};
          outline-offset: 4px;
        }

        /* Background */
        .background-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.28;

          background-image:
            linear-gradient(
              rgba(98, 245, 218, 0.07) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(98, 245, 218, 0.07) 1px,
              transparent 1px
            );

          background-size: 56px 56px;
          animation: backgroundGridMove 22s linear infinite;

          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 80%
          );
        }

        .background-glow {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(100px);
          opacity: 0.18;
        }

        .background-glow-one {
          top: -260px;
          right: -180px;
          background: ${COLORS.teal};
        }

        .background-glow-two {
          top: 38%;
          left: -340px;
          background: ${COLORS.blue};
          opacity: 0.10;
        }

        .background-glow-three {
          bottom: -260px;
          right: 16%;
          background: ${COLORS.lime};
          opacity: 0.05;
        }

        @keyframes backgroundGridMove {
          to { background-position: 56px 56px, 56px 56px; }
        }

        /* Navigation */
        .nav-link {
          position: relative;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: ${COLORS.teal};
        }

        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -7px;
          height: 1px;
          background: ${COLORS.teal};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }

        .nav-link:hover::after {
          transform: scaleX(1);
        }

        /* Hero */
        .hero-name {
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(3.8rem, 9vw, 8.2rem);
          line-height: 0.88;
          font-weight: 700;
          letter-spacing: -0.075em;
        }

        .hero-outline {
          color: transparent;
          -webkit-text-stroke: 1.5px ${COLORS.ink};
        }

        .hero-outline:hover {
          color: ${COLORS.teal};
          -webkit-text-stroke-color: ${COLORS.teal};
          transition: all 0.35s ease;
        }

        .hero-card {
          background: ${COLORS.dark};
          color: white;
          position: relative;
          overflow: hidden;
        }

        .hero-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              135deg,
              rgba(34,161,141,0.12),
              transparent 45%
            );
          pointer-events: none;
        }

        .hero-card::after {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          right: -100px;
          bottom: -150px;
          border: 1px solid rgba(183,216,106,0.2);
          border-radius: 50%;
        }

        /* Cards */
        .project-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            rgba(11,23,27,0.88),
            rgba(6,12,15,0.78)
          );
          color: ${COLORS.ink};
          border: 1px solid ${COLORS.line};
          transition:
            transform 0.35s cubic-bezier(.22,1,.36,1),
            border-color 0.25s ease,
            box-shadow 0.35s ease;
        }

        .project-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(
            90deg,
            ${COLORS.teal},
            ${COLORS.lime}
          );
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .project-card:hover {
          transform: translateY(-9px) scale(1.01);
          border-color: rgba(98,245,218,.52) !important;
          box-shadow: 0 26px 80px rgba(0,0,0,.44), 0 0 34px rgba(55,230,196,.08);
        }

        .project-card:hover::before {
          transform: scaleX(1);
        }

        .project-number {
          font-family: "Space Grotesk", sans-serif;
          font-size: 5rem;
          line-height: 1;
          font-weight: 700;
          color: transparent;
          -webkit-text-stroke: 1px ${COLORS.line};
          transition: all 0.35s ease;
        }

        .project-card:hover .project-number {
          color: ${COLORS.tealSoft};
          -webkit-text-stroke-color: ${COLORS.tealSoft};
        }

        .skill-pill {
          font-family: "DM Mono", monospace;
          font-size: 11px;
          padding: 7px 11px;
          border: 1px solid ${COLORS.line};
          background: rgba(255,255,255,0.025);
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .skill-pill:hover {
          transform: translateY(-2px);
          background: rgba(55,230,196,0.08);
          border-color: ${COLORS.teal};
          color: ${COLORS.teal};
        }

        /* Buttons */
        .primary-button {
          position: relative;
          overflow: hidden;
          background: ${COLORS.teal};
          color: ${COLORS.dark};
          font-weight: 700;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(55,230,196,0.24), 0 0 32px rgba(55,230,196,0.08);
        }

        .secondary-button {
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .secondary-button:hover {
          background: ${COLORS.dark};
          color: white !important;
          transform: translateY(-2px);
        }

        /* Pulse */
        .pulse-dot {
          animation: pulse 1.8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.35;
            transform: scale(1.5);
          }
        }

        /* Mesh */
        .mesh-rotate {
          animation: rotateMesh 60s linear infinite;
          transform-origin: 50% 50%;
        }

        @keyframes rotateMesh {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* Marquee */
        .marquee {
          overflow: hidden;
          white-space: nowrap;
          border-top: 1px solid ${COLORS.line};
          border-bottom: 1px solid ${COLORS.line};
        }

        .marquee-track {
          display: inline-flex;
          min-width: max-content;
          animation: marquee 25s linear infinite;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        /* Experience timeline */
        .timeline-line {
          position: absolute;
          left: 10px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: ${COLORS.line};
        }

        .timeline-dot {
          position: absolute;
          left: 4px;
          top: 8px;
          width: 13px;
          height: 13px;
          border: 3px solid ${COLORS.bg};
          background: ${COLORS.teal};
          border-radius: 50%;
          box-shadow: 0 0 0 1px ${COLORS.teal};
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <BackgroundGrid />
      <div className="mouse-glow" />

      {/* Scroll progress */}
      <div
        className="fixed left-0 right-0 top-0 z-50 h-[3px]"
        style={{ background: "transparent" }}
      >
        <div
          style={{
            width: `${scrollProgress * 100}%`,
            height: "100%",
            background: COLORS.tealBright,
          }}
        />
      </div>

      {/* -------------------------------------------------- */}
      {/* NAVIGATION */}
      {/* -------------------------------------------------- */}

      <header
        className="sticky top-0 z-40 border-b backdrop-blur-2xl"
        style={{
          background: "rgba(5,9,11,0.72)",
          borderColor: COLORS.line,
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
          <a
            href="#top"
            className="mono text-xs tracking-[0.22em]"
            style={{ color: COLORS.ink }}
          >
            <span style={{ color: COLORS.teal }}>CTJ</span>
            {" "}//
            {" "}PORTFOLIO
          </a>

          <nav
            className="hidden gap-7 text-[10px] uppercase tracking-[0.18em] sm:flex"
            style={{
              fontFamily: "'DM Mono', monospace",
              color: COLORS.inkSoft,
            }}
          >
            <a href="#experience" className="nav-link">
              Experience
            </a>

            <a href="#projects" className="nav-link">
              Projects
            </a>

            <a href="#skills" className="nav-link">
              Skills
            </a>

            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>

          <a
            href="#contact"
            className="mono hidden rounded-full border px-4 py-2 text-[10px] tracking-widest sm:block"
            style={{
              borderColor: COLORS.ink,
              color: COLORS.ink,
            }}
          >
            LET'S TALK
          </a>
        </div>
      </header>

      {/* -------------------------------------------------- */}
      {/* HERO */}
      {/* -------------------------------------------------- */}

      <section className="hero-stage relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-20 md:px-8 md:pb-28 md:pt-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <StatusBadge>
              Available for graduate roles
            </StatusBadge>

            <div className="mt-8">
              <p
                className="mono mb-5 text-[10px] uppercase tracking-[0.3em]"
                style={{ color: COLORS.inkSoft }}
              >
                Software Engineer / QA Automation
              </p>

              <h1 className="hero-name">
                Chan
                <br />
                <span className="gradient-text">
                  Tze Jing.
                </span>
              </h1>
            </div>

            <div
              className="hero-copy mt-8 max-w-2xl border-l pl-5"
              style={{ borderColor: COLORS.teal }}
            >
              <p
                className="body-font text-base leading-8 md:text-lg"
                style={{ color: COLORS.inkSoft }}
              >
                Software Engineering graduate focused on building
                reliable software, automated testing systems and
                practical full-stack applications.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:jinz1083@gmail.com"
                className="primary-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-medium tracking-wider"
              >
                <Mail size={14} />
                GET IN TOUCH
                <ArrowRight size={14} />
              </a>

              <a
                href="https://github.com/DefinitelyNotTzeJing"
                target="_blank"
                rel="noreferrer"
                className="secondary-button inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-medium tracking-wider"
                style={{
                  borderColor: COLORS.ink,
                  color: COLORS.ink,
                }}
              >
                <FaGithub size={15} />
                GITHUB
              </a>

              <a
                href="https://www.linkedin.com/in/chan-tze-jing-3aba71412/"
                target="_blank"
                rel="noreferrer"
                className="secondary-button inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-medium tracking-wider"
                style={{
                  borderColor: COLORS.ink,
                  color: COLORS.ink,
                }}
              >
                <FaLinkedin size={15} />
                LINKEDIN
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <p
                  className="mono text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: COLORS.inkSoft }}
                >
                  Location
                </p>

                <p
                  className="display mt-1 text-sm font-semibold"
                  style={{ color: COLORS.ink }}
                >
                  Kuala Lumpur, MY
                </p>
              </div>

              <div>
                <p
                  className="mono text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: COLORS.inkSoft }}
                >
                  Primary focus
                </p>

                <p
                  className="display mt-1 text-sm font-semibold"
                  style={{ color: COLORS.ink }}
                >
                  Backend Developer / Full Stack Developer
                </p>
              </div>

              <div>
                <p
                  className="mono text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: COLORS.inkSoft }}
                >
                  Experience
                </p>

                <p
                  className="display mt-1 text-sm font-semibold"
                  style={{ color: COLORS.ink }}
                >
                  IDEMIA
                </p>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="hero-card hud-panel rounded-3xl p-7 md:p-9">
              <CornerMarks color={COLORS.tealBright} />
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#B7D86A]" />
                    <span
                      className="mono text-[9px] tracking-[0.2em]"
                      style={{ color: "#9DB7B1" }}
                    >
                      SYSTEM ONLINE
                    </span>
                  </div>

                  <span
                    className="mono text-[9px]"
                    style={{ color: "#65837D" }}
                  >
                    01 / 04
                  </span>
                </div>

                <div className="hero-visual-core mt-5">
                  <div className="hero-halo hero-halo-one" />
                  <div className="hero-halo hero-halo-two" />
                  <div className="scan-beam" />
                  <LandmarkMesh />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: "#2B3935",
                      background: "#16201E",
                    }}
                  >
                    <p
                      className="mono text-[9px] uppercase tracking-widest"
                      style={{ color: "#6E8F88" }}
                    >
                      Match confidence
                    </p>

                    <p className="display mt-2 text-2xl font-semibold text-white">
                      {confidence.toFixed(1)}
                      <span className="text-sm text-[#22A18D]">
                        %
                      </span>
                    </p>
                  </div>

                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: "#2B3935",
                      background: "#16201E",
                    }}
                  >
                    <p
                      className="mono text-[9px] uppercase tracking-widest"
                      style={{ color: "#6E8F88" }}
                    >
                      FAR
                    </p>

                    <p className="display mt-2 text-2xl font-semibold text-white">
                      0.0
                      <span className="text-sm text-[#22A18D]">
                        %
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="glass-card absolute -bottom-5 -left-5 hidden rounded-2xl border p-4 shadow-xl md:block"
              style={{ borderColor: COLORS.line }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="rounded-lg p-2"
                  style={{ background: COLORS.tealSoft }}
                >
                  <ShieldCheck
                    size={18}
                    style={{ color: COLORS.teal }}
                  />
                </div>

                <div>
                  <p
                    className="mono text-[8px] uppercase tracking-widest"
                    style={{ color: COLORS.inkSoft }}
                  >
                    Security
                  </p>

                  <p className="display text-xs font-semibold">
                    Biometric systems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* MARQUEE */}
      {/* -------------------------------------------------- */}

      <div className="marquee relative z-10">
        <div
          className="marquee-track py-4"
          style={{
            fontFamily: "'DM Mono', monospace",
            color: COLORS.inkSoft,
            fontSize: "10px",
            letterSpacing: "0.2em",
          }}
        >
          <span>
            SOFTWARE ENGINEERING&nbsp;&nbsp;•&nbsp;&nbsp;
            QA AUTOMATION&nbsp;&nbsp;•&nbsp;&nbsp;
            FULL-STACK DEVELOPMENT&nbsp;&nbsp;•&nbsp;&nbsp;
            COMPUTER VISION&nbsp;&nbsp;•&nbsp;&nbsp;
            REST APIs&nbsp;&nbsp;•&nbsp;&nbsp;
            SOFTWARE ENGINEERING&nbsp;&nbsp;•&nbsp;&nbsp;
            QA AUTOMATION&nbsp;&nbsp;•&nbsp;&nbsp;
            FULL-STACK DEVELOPMENT&nbsp;&nbsp;•&nbsp;&nbsp;
            COMPUTER VISION&nbsp;&nbsp;•&nbsp;&nbsp;
            REST APIs&nbsp;&nbsp;•&nbsp;&nbsp;
          </span>

          <span aria-hidden="true">
            SOFTWARE ENGINEERING&nbsp;&nbsp;•&nbsp;&nbsp;
            QA AUTOMATION&nbsp;&nbsp;•&nbsp;&nbsp;
            FULL-STACK DEVELOPMENT&nbsp;&nbsp;•&nbsp;&nbsp;
            COMPUTER VISION&nbsp;&nbsp;•&nbsp;&nbsp;
            REST APIs&nbsp;&nbsp;•&nbsp;&nbsp;
          </span>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* EXPERIENCE */}
      {/* -------------------------------------------------- */}

      <section
        id="experience"
        className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32"
      >
        <SectionLabel
          number="01 / EXPERIENCE"
          title="Where I've worked."
          description="Hands-on experience building automated testing systems and developer tooling in an enterprise environment."
        />

        {EXPERIENCE.map((experience) => (
          <Reveal key={experience.id}>
            <div className="relative pl-7 md:pl-10">
              <div className="timeline-line" />
              <div className="timeline-dot" />

              <div
                className="glass-card hud-panel rounded-2xl border p-6 md:p-9"
                style={{ borderColor: COLORS.line }}
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <StatusBadge>
                        {experience.id}
                      </StatusBadge>

                      <span
                        className="mono text-[10px]"
                        style={{ color: COLORS.inkSoft }}
                      >
                        {experience.period}
                      </span>
                    </div>

                    <h3
                      className="display text-2xl font-bold md:text-3xl"
                      style={{
                        color: COLORS.ink,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {experience.role}
                    </h3>

                    <p
                      className="display mt-1 font-semibold"
                      style={{ color: COLORS.teal }}
                    >
                      {experience.org}
                    </p>
                  </div>

                  <div
                    className="flex h-fit items-center gap-2 rounded-full px-3 py-2"
                    style={{
                      background: "rgba(8,16,19,0.68)",
                      color: COLORS.inkSoft,
                    }}
                  >
                    <MapPin size={13} />

                    <span className="mono text-[9px] uppercase tracking-widest">
                      {experience.loc}
                    </span>
                  </div>
                </div>

                <div
                  className="my-7 h-px"
                  style={{ background: COLORS.line }}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  {experience.log.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-xl p-4"
                      style={{ background: "rgba(255,255,255,0.025)" }}
                    >
                      <span
                        className="mono text-[10px] font-medium"
                        style={{ color: COLORS.teal }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p
                        className="body-font text-sm leading-6"
                        style={{ color: COLORS.inkSoft }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* -------------------------------------------------- */}
      {/* PROJECTS */}
      {/* -------------------------------------------------- */}

      <section
        id="projects"
        className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32"
      >
        <SectionLabel
          number="02 / PROJECTS"
          title="Things I've built."
          description="A selection of academic and personal projects spanning full-stack development, algorithms, computer vision and mobile applications."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <Reveal
              key={project.id}
              delay={index * 70}
            >
              <article
                className={`project-card h-full rounded-2xl p-6 md:p-7 ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
                onMouseEnter={() =>
                  setActiveProject(project.id)
                }
                onMouseLeave={() =>
                  setActiveProject(null)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="project-number">
                    {project.id}
                  </div>

                  <StatusBadge>
                    {project.status}
                  </StatusBadge>
                </div>

                <div
                  className={`mt-4 ${
                    index === 0
                      ? "md:grid md:grid-cols-[1fr_1fr] md:gap-10"
                      : ""
                  }`}
                >
                  <div>
                    <h3
                      className="display text-2xl font-bold"
                      style={{
                        color: COLORS.ink,
                        letterSpacing: "-0.035em",
                      }}
                    >
                      {project.name}
                    </h3>

                    <p
                      className="mono mt-2 text-[10px] uppercase tracking-[0.12em]"
                      style={{ color: COLORS.teal }}
                    >
                      {project.tagline}
                    </p>

                    <p
                      className="body-font mt-5 text-sm leading-7"
                      style={{ color: COLORS.inkSoft }}
                    >
                      {project.description}
                    </p>
                  </div>

                  {project.metrics.length > 0 && (
                    <div className="mt-7 grid grid-cols-2 gap-2 md:mt-0">
                      {project.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-xl p-4"
                          style={{
                            background: COLORS.dark,
                            color: COLORS.ink,
                          }}
                        >
                          <p
                            className="mono text-[8px] uppercase tracking-widest"
                            style={{ color: "#76928C" }}
                          >
                            {metric.label}
                          </p>

                          <p className="display mt-2 text-2xl font-semibold">
                            {metric.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="my-6 h-px"
                  style={{ background: COLORS.line }}
                />

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((technology) => (
                    <span
                      key={technology}
                      className="skill-pill rounded-full"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <span
                    className="mono text-[9px] uppercase tracking-widest"
                    style={{ color: COLORS.inkSoft }}
                  >
                    {project.period}
                  </span>

                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-medium tracking-wider transition-all hover:bg-[#111817] hover:text-white"
                      style={{
                        borderColor: COLORS.ink,
                        color: COLORS.ink,
                      }}
                    >
                      VIEW PROJECT
                      <ExternalLink
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </a>
                  ) : (
                    <span
                      className="mono text-[9px] uppercase tracking-widest"
                      style={{ color: COLORS.inkSoft }}
                    >
                      Private / Academic
                    </span>
                  )}
                </div>

                {activeProject === project.id && (
                  <div
                    className="pointer-events-none absolute bottom-4 right-5"
                    style={{
                      color: COLORS.teal,
                      opacity: 0.12,
                    }}
                  >
                    <Code2 size={70} />
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* SKILLS */}
      {/* -------------------------------------------------- */}

      <section
        id="skills"
        className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32"
      >
        <SectionLabel
          number="03 / TOOLKIT"
          title="What I work with."
          description="A practical stack built through coursework, projects, internship experience and independent development."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {Object.entries(SKILLS).map(
            ([category, technologies], index) => (
              <Reveal
                key={category}
                delay={index * 80}
              >
                <div
                  className="glass-card hud-panel group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 md:p-7"
                  style={{ borderColor: COLORS.line }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-lg p-2.5"
                        style={{
                          background: COLORS.tealSoft,
                          color: COLORS.teal,
                        }}
                      >
                        {index === 0 ? (
                          <Code2 size={17} />
                        ) : index === 1 ? (
                          <Terminal size={17} />
                        ) : index === 2 ? (
                          <Sparkles size={17} />
                        ) : (
                          <ShieldCheck size={17} />
                        )}
                      </div>

                      <h3 className="display font-semibold">
                        {category}
                      </h3>
                    </div>

                    <span
                      className="mono text-[9px]"
                      style={{ color: COLORS.inkSoft }}
                    >
                      {String(technologies.length).padStart(
                        2,
                        "0"
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {technologies.map((technology) => (
                      <span
                        key={technology}
                        className="skill-pill rounded-full"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          )}
        </div>

        <Reveal delay={250}>
          <div
            className="mt-6 rounded-2xl border p-6 md:p-7"
            style={{
              borderColor: COLORS.line,
              background: "rgba(8,16,19,0.68)",
            }}
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p
                  className="mono text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: COLORS.teal }}
                >
                  Languages
                </p>

                <p
                  className="display mt-2 text-lg font-semibold"
                  style={{ color: COLORS.ink }}
                >
                  English · Mandarin · Malay
                </p>

                <p
                  className="body-font mt-1 text-sm"
                  style={{ color: COLORS.inkSoft }}
                >
                  Hakka & Cantonese — spoken
                </p>
              </div>

              <div
                className="mono text-[9px] uppercase tracking-[0.18em]"
                style={{ color: COLORS.inkSoft }}
              >
                Communication / Collaboration
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------- */}
      {/* CONTACT */}
      {/* -------------------------------------------------- */}

      <section
        id="contact"
        className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-24 md:px-8 md:pb-32"
      >
        <div
          className="contact-panel hud-panel relative overflow-hidden rounded-3xl p-8 md:p-14"
          style={{
            background: COLORS.dark,
            color: COLORS.ink,
          }}
        >
          <CornerMarks color={COLORS.tealBright} />
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full border"
            style={{ borderColor: "rgba(98,245,218,.14)" }}
          />

          <div
            className="absolute -bottom-32 right-24 h-80 w-80 rounded-full border"
            style={{ borderColor: "rgba(95,168,255,.10)" }}
          />

          <div className="relative z-10 grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p
                className="mono text-[10px] uppercase tracking-[0.25em]"
                style={{ color: COLORS.lime }}
              >
                04 / CONTACT
              </p>

              <h2
                className="display mt-5 max-w-2xl text-4xl font-bold md:text-6xl"
                style={{
                  letterSpacing: "-0.055em",
                }}
              >
                Let's build something
                <span style={{ color: COLORS.lime }}>
                  {" "}useful.
                </span>
              </h2>

              <p
                className="body-font mt-6 max-w-xl text-sm leading-7"
                style={{ color: "#9AA6A1" }}
              >
                I'm currently open to graduate software
                engineering opportunities, particularly roles
                involving software development and backend systems.
              </p>

              <a
                href="mailto:jinz1083@gmail.com"
                className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-semibold tracking-wider transition-transform hover:-translate-y-1"
                style={{
                  background: COLORS.lime,
                  color: COLORS.dark,
                }}
              >
                <Mail size={14} />
                jinz1083@gmail.com
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href="tel:+60166363688"
                className="group flex items-center gap-3 text-sm"
                style={{ color: "#D7F7F0" }}
              >
                <span
                  className="rounded-full border p-2 transition-colors group-hover:border-[#B7D86A]"
                  style={{ borderColor: "rgba(98,245,218,.18)" }}
                >
                  <Phone size={14} />
                </span>

                +60 16-636 3688
              </a>

              <a
                href="https://github.com/DefinitelyNotTzeJing"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 text-sm"
                style={{ color: "#D7F7F0" }}
              >
                <span
                  className="rounded-full border p-2 transition-colors group-hover:border-[#B7D86A]"
                  style={{ borderColor: "rgba(98,245,218,.18)" }}
                >
                  <FaGithub size={14} />
                </span>

                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/chan-tze-jing-3aba71412/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 text-sm"
                style={{ color: "#D7F7F0" }}
              >
                <span
                  className="rounded-full border p-2 transition-colors group-hover:border-[#B7D86A]"
                  style={{ borderColor: "rgba(98,245,218,.18)" }}
                >
                  <FaLinkedin size={14} />
                </span>

                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* FOOTER */}
      {/* -------------------------------------------------- */}

      <footer
        className="relative z-10 border-t"
        style={{ borderColor: COLORS.line }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <p
            className="mono text-[9px] uppercase tracking-[0.18em]"
            style={{ color: COLORS.inkSoft }}
          >
            © 2026 Chan Tze Jing
          </p>

          <p
            className="mono text-[9px] uppercase tracking-[0.18em]"
            style={{ color: COLORS.inkSoft }}
          >
            Built with React · Designed for the web
          </p>
        </div>
      </footer>

      {/* Back to top */}
      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-40 rounded-full p-3 shadow-lg transition-all duration-300"
        style={{
          background: COLORS.dark,
          color: COLORS.lime,
          opacity: showTop ? 1 : 0,
          pointerEvents: showTop ? "auto" : "none",
          transform: showTop
            ? "translateY(0)"
            : "translateY(10px)",
        }}
      >
        <ArrowUp size={16} />
      </a>
    </div>
  );
}