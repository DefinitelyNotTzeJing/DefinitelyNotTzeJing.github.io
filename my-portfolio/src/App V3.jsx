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

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
`;

const COLORS = {
  bg: "#07100F",
  bgAlt: "#0C1816",
  surface: "#10211E",
  dark: "#050A09",
  darkSoft: "#0B1513",
  ink: "#E8F1EE",
  inkSoft: "#91A49D",
  line: "#1B3430",
  teal: "#35C7AE",
  tealBright: "#62F4D3",
  tealSoft: "#12352F",
  lime: "#C7F36B",
  rust: "#FF775E",
};

/* -------------------------------------------------- */
/* Small building blocks */
/* -------------------------------------------------- */

function StatusBadge({ children, tone = "teal" }) {
  const styles =
    tone === "rust"
      ? {
          bg: "#F4DDD7",
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
        transition: `
          opacity 0.7s ease ${delay}ms,
          transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms
        `,
      }}
    >
      {children}
    </div>
  );
}

function useMouseGlow() {
  const [position, setPosition] = useState({ x: 50, y: 20 });

  useEffect(() => {
    const onMove = (event) => {
      setPosition({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return position;
}

function ParticleField() {
  const particles = Array.from({ length: 28 }, (_, index) => ({
    id: index,
    left: (index * 37) % 101,
    top: (index * 61) % 101,
    delay: (index % 7) * 0.8,
    duration: 5 + (index % 5),
  }));

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------- */
/* Background / visual effects */
/* -------------------------------------------------- */

function BackgroundGrid() {
  return (
    <>
      <div className="background-grid" />
      <div className="background-scanlines" />
      <div className="background-glow background-glow-one" />
      <div className="background-glow background-glow-two" />
      <ParticleField />
      <div className="cursor-glow" />
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
      <div className="absolute inset-8 rounded-full border border-dashed border-[#C8D1CB]" />

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
  const mouseGlow = useMouseGlow();

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

  return (
    <div
      id="top"
      className="portfolio min-h-screen overflow-hidden"
      style={{
        background: COLORS.bg,
        color: COLORS.ink,
        "--mouse-x": `${mouseGlow.x}%`,
        "--mouse-y": `${mouseGlow.y}%`,
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
          color-scheme: dark;
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

        ::selection {
          background: linear-gradient(135deg, ${COLORS.tealBright}, ${COLORS.teal});
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
          opacity: 0.72;

          background-image:
            linear-gradient(
              rgba(53, 199, 174, 0.075) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(53, 199, 174, 0.075) 1px,
              transparent 1px
            );

          background-size: 52px 52px;
          animation: gridDrift 24s linear infinite;

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
          top: -300px;
          right: -200px;
          background: ${COLORS.teal};
        }

        .background-glow-two {
          top: 40%;
          left: -350px;
          background: ${COLORS.lime};
          opacity: 0.08;
        }

        .background-scanlines {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.12;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 4px,
            rgba(255,255,255,0.018) 5px
          );
        }

        .cursor-glow {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(
            circle 280px at var(--mouse-x) var(--mouse-y),
            rgba(53,199,174,0.085),
            transparent 70%
          );
          transition: background 0.18s ease-out;
        }

        .particle-field {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 999px;
          background: ${COLORS.tealBright};
          box-shadow: 0 0 10px rgba(98,244,211,0.8);
          opacity: 0;
          animation: particleFloat 7s ease-in-out infinite;
        }

        @keyframes gridDrift {
          from { background-position: 0 0, 0 0; }
          to { background-position: 52px 52px, 52px 52px; }
        }

        @keyframes particleFloat {
          0%, 100% { transform: translate3d(0, 20px, 0); opacity: 0; }
          25% { opacity: 0.45; }
          70% { opacity: 0.18; }
          100% { transform: translate3d(20px, -90px, 0); opacity: 0; }
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
          background: linear-gradient(145deg, rgba(12,29,26,0.92), rgba(4,10,9,0.96));
          color: white;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(98,244,211,0.18);
          box-shadow: 0 30px 100px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(18px);
        }

        .hero-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 10%, rgba(98,244,211,0.13), transparent 28%),
            linear-gradient(135deg, rgba(53,199,174,0.12), transparent 45%);
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
          background: linear-gradient(145deg, rgba(15,33,30,0.82), rgba(8,20,18,0.76));
          border: 1px solid ${COLORS.line};
          backdrop-filter: blur(16px);
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
          transform: translateY(-7px);
          border-color: ${COLORS.teal};
          box-shadow:
            0 24px 70px rgba(0,0,0,0.34),
            0 0 30px rgba(53,199,174,0.06);
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
          background: rgba(10,28,25,0.72);
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .skill-pill:hover {
          transform: translateY(-2px);
          background: rgba(53,199,174,0.12);
          border-color: ${COLORS.teal};
          color: ${COLORS.teal};
        }

        .portfolio .bg-white {
          background: linear-gradient(145deg, rgba(14,31,28,0.82), rgba(7,18,16,0.76)) !important;
          backdrop-filter: blur(16px);
        }

        .portfolio .shadow-lg,
        .portfolio .shadow-xl {
          box-shadow: 0 24px 70px rgba(0,0,0,0.28) !important;
        }

        .glass-panel {
          background: rgba(12,29,26,0.66);
          border: 1px solid rgba(98,244,211,0.14);
          backdrop-filter: blur(18px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .tech-sheen {
          position: relative;
          overflow: hidden;
        }

        .tech-sheen::after {
          content: "";
          position: absolute;
          top: 0;
          left: -30%;
          width: 18%;
          height: 100%;
          transform: skewX(-18deg);
          background: linear-gradient(90deg, transparent, rgba(98,244,211,0.08), transparent);
          animation: sheen 7s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes sheen {
          0%, 45% { left: -30%; }
          70%, 100% { left: 125%; }
        }

        /* Buttons */
        .primary-button {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, ${COLORS.tealBright}, ${COLORS.teal});
          color: ${COLORS.dark};
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(53,199,174,0.2), 0 0 24px rgba(53,199,174,0.1);
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
          filter: drop-shadow(0 0 7px rgba(53,199,174,0.32));
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
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          background: "rgba(7,16,15,0.72)",
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

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-20 md:px-8 md:pb-28 md:pt-28">
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
                <span style={{ color: COLORS.teal }}>
                  Tze Jing.
                </span>
              </h1>
            </div>

            <div
              className="mt-8 max-w-2xl border-l-2 pl-5"
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
            <div className="hero-card tech-sheen rounded-3xl p-7 md:p-9">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#B7D86A]" />
                    <span
                      className="mono text-[9px] tracking-[0.2em]"
                      style={{ color: "#A8B5B1" }}
                    >
                      SYSTEM ONLINE
                    </span>
                  </div>

                  <span
                    className="mono text-[9px]"
                    style={{ color: "#65716D" }}
                  >
                    01 / 04
                  </span>
                </div>

                <div className="mt-5">
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
                      style={{ color: "#73807B" }}
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
                      style={{ color: "#73807B" }}
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
              className="absolute -bottom-5 -left-5 hidden rounded-2xl border bg-white p-4 shadow-xl md:block"
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
                className="tech-sheen rounded-2xl border bg-white p-6 md:p-9"
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
                      background: COLORS.bgAlt,
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
                      style={{ background: COLORS.bg }}
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
                className={`project-card tech-sheen h-full rounded-2xl p-6 md:p-7 ${
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
                            color: "white",
                          }}
                        >
                          <p
                            className="mono text-[8px] uppercase tracking-widest"
                            style={{ color: "#7C8A85" }}
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
                  className="group tech-sheen rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-7"
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
              background: COLORS.bgAlt,
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
          className="relative overflow-hidden rounded-3xl p-8 md:p-14"
          style={{
            background: COLORS.dark,
            color: "white",
          }}
        >
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full border"
            style={{ borderColor: "#2D3B37" }}
          />

          <div
            className="absolute -bottom-32 right-24 h-80 w-80 rounded-full border"
            style={{ borderColor: "#24312E" }}
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
                style={{ color: "#DCE2DF" }}
              >
                <span
                  className="rounded-full border p-2 transition-colors group-hover:border-[#B7D86A]"
                  style={{ borderColor: "#394742" }}
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
                style={{ color: "#DCE2DF" }}
              >
                <span
                  className="rounded-full border p-2 transition-colors group-hover:border-[#B7D86A]"
                  style={{ borderColor: "#394742" }}
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
                style={{ color: "#DCE2DF" }}
              >
                <span
                  className="rounded-full border p-2 transition-colors group-hover:border-[#B7D86A]"
                  style={{ borderColor: "#394742" }}
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