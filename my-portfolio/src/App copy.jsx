import { useEffect, useState, useRef } from "react";
import { Mail, Phone, ExternalLink, MapPin, ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
`;

const COLORS = {
  bg: "#EEF0EA",
  bgAlt: "#E4E7DE",
  ink: "#15191B",
  inkSoft: "#4B524C",
  line: "#C6CABD",
  teal: "#1F6F63",
  tealSoft: "#D7E4DE",
  rust: "#A6402D",
  rustSoft: "#F0DBD3",
};

/* ---------- small building blocks ---------- */

function Bracket({ className = "", color = COLORS.ink }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M2 10V2H10" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function ViewfinderFrame({ children, className = "", active = true }) {
  return (
    <div className={`relative ${className}`}>
      <Bracket className={`absolute -top-1 -left-1 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`} />
      <Bracket className={`absolute -top-1 -right-1 rotate-90 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`} />
      <Bracket className={`absolute -bottom-1 -right-1 rotate-180 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`} />
      <Bracket className={`absolute -bottom-1 -left-1 -rotate-90 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`} />
      {children}
    </div>
  );
}

function StatusBadge({ children, tone = "teal" }) {
  const map = {
    teal: { bg: COLORS.tealSoft, fg: COLORS.teal },
    rust: { bg: COLORS.rustSoft, fg: COLORS.rust },
  };
  const c = map[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] tracking-widest uppercase"
      style={{ fontFamily: "'JetBrains Mono', monospace", background: c.bg, color: c.fg, border: `1px solid ${c.fg}33` }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: c.fg }} />
      {children}
    </span>
  );
}

/* ruler-style divider with tick marks, used between major sections */
function RulerDivider({ index }) {
  const ticks = Array.from({ length: 40 });
  return (
    <div className="flex items-center gap-3 py-2 select-none" aria-hidden="true">
      <span className="mono text-[10px]" style={{ color: COLORS.inkSoft }}>{index}</span>
      <div className="flex-1 flex items-end gap-[3px] overflow-hidden h-3">
        {ticks.map((_, i) => (
          <span
            key={i}
            style={{
              width: 1,
              height: i % 5 === 0 ? 10 : 5,
              background: COLORS.line,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ id, title }) {
  return (
    <div className="flex items-baseline gap-3 mb-10">
      <span className="mono text-xs tracking-widest" style={{ color: COLORS.teal }}>{id}</span>
      <span className="flex-1 h-px" style={{ background: COLORS.line }} />
      <h2 className="display text-2xl md:text-3xl" style={{ color: COLORS.ink, fontWeight: 600 }}>{title}</h2>
    </div>
  );
}

/* fade + rise on scroll into view */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* deterministic pseudo-random landmark mesh — abstract, not a face, echoes the
   MediaPipe/landmark-detection subject without depicting anyone */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function LandmarkMesh({ size = 360, seed = 7 }) {
  const rand = seededRandom(seed);
  const points = Array.from({ length: 34 }).map((_, i) => ({
    id: i,
    x: 40 + rand() * (size - 80),
    y: 40 + rand() * (size - 80),
  }));
  // connect each point to its 2 nearest neighbours -> organic triangulated look
  const edges = [];
  points.forEach((p, i) => {
    const dists = points
      .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 }))
      .filter((d) => d.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    dists.forEach((d) => edges.push([i, d.j]));
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      className="mesh-rotate"
      aria-hidden="true"
    >
      <g stroke={COLORS.teal} strokeWidth="0.75" opacity="0.55">
        {edges.map(([a, b], i) => (
          <line key={i} x1={points[a].x} y1={points[a].y} x2={points[b].x} y2={points[b].y} />
        ))}
      </g>
      <g>
        {points.map((p) => (
          <circle key={p.id} cx={p.x} cy={p.y} r={p.id % 5 === 0 ? 3 : 1.6} fill={p.id % 7 === 0 ? COLORS.rust : COLORS.teal}>
            <animate
              attributeName="opacity"
              values="0.35;1;0.35"
              dur={`${2.5 + (p.id % 5)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 20} stroke={COLORS.line} strokeWidth="1" fill="none" strokeDasharray="2 6" />
    </svg>
  );
}

function useLiveConfidence() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    let start = null;
    const target = 88.2;
    const duration = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(+(target * eased).toFixed(1));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return value;
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setP(Math.min(1, Math.max(0, scrolled)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

/* ---------- content ---------- */

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
    id: "TC-01",
    name: "Folio",
    tagline: "Cross-platform facial recognition bookstore system",
    period: "Final Year Project",
    status: "PASS",
    description:
      "Full-stack progressive web app (React/Vite on Netlify, Laravel REST API, MySQL) backed by a custom Python/Flask computer-vision microservice — InsightFace, MediaPipe, blink detection, and LBP texture analysis for face recognition and liveness detection.",
    metrics: [
      { label: "LFW accuracy", value: "88.2%" },
      { label: "False accept rate", value: "0%" },
      { label: "Tests passed", value: "92 / 92" },
      { label: "SUS score", value: "80" },
    ],
    stack: ["React", "Vite", "Laravel", "MySQL", "Flask", "InsightFace", "MediaPipe"],
    link: "https://github.com/DefinitelyNotTzeJing/FYP",
  },
  {
    id: "TC-02",
    name: "Driver Task Selection",
    tagline: "Branch and Bound optimization for ride-hailing dispatch",
    period: "Data Structures & Algorithms",
    status: "PASS",
    description:
      "Designed and implemented a Branch and Bound algorithm in Java to optimize driver task selection, benchmarked alongside a teammate's greedy / priority-queue approach.",
    metrics: [],
    stack: ["Java", "Branch & Bound", "Algorithm Design"],
    link: "https://github.com/DefinitelyNotTzeJing/Data-Structure-Algorithms",
  },
  {
    id: "TC-03",
    name: "Intercity Bus Booking",
    tagline: "Offline-first React Native app for transit booking",
    period: "Web & App Development",
    status: "PASS",
    description:
      "Cross-platform mobile app in React Native/TypeScript integrating real GTFS transit data, OpenWeatherMap forecasts, and geocoding for stop mapping. Offline-first via SQLite, with AsyncStorage for session handling.",
    metrics: [],
    stack: ["React Native", "TypeScript", "SQLite", "GTFS", "OpenWeatherMap"],
    link: null,
  },
  {
    id: "TC-04",
    name: "Hollow Knight-inspired Platformer",
    tagline: "2D action-platformer built in Godot",
    period: "Personal Project",
    status: "PASS",
    description:
      "Player movement, combat systems, and level design for a 2D action-platformer built with the Godot engine.",
    metrics: [],
    stack: ["Godot", "GDScript"],
    link: "https://github.com/DefinitelyNotTzeJing/GameEngine",
  },
  {
    id: "TC-05",
    name: "Predictive Model Benchmark",
    tagline: "Algorithm comparison for predictive modeling",
    period: "Data Mining",
    status: "PASS",
    description:
      "Benchmarked multiple algorithms in Google Colab on accuracy, precision, and related metrics to identify the best-performing model for a given prediction task.",
    metrics: [],
    stack: ["Python", "Google Colab", "Data Mining"],
    link: null,
  },
];

const SKILLS = {
  Frameworks: ["React", "React Native", "Laravel", "Flask", "Robot Framework", "InsightFace", "MediaPipe", "Tkinter"],
  Languages: ["Python", "PHP", "JavaScript", "TypeScript", "Java", "SQL"],
  "Tools & Platforms": ["Git & GitHub", "MySQL", "Docker", "Netlify", "ngrok", "Godot", "Google Colab"],
  "Focus Areas": ["Test automation", "Full-stack web dev", "Computer vision", "REST API design"],
};

/* ---------- page ---------- */

export default function Portfolio() {
  const confidence = useLiveConfidence();
  const [scanY, setScanY] = useState(0);
  const scrollProgress = useScrollProgress();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let raf;
    const animate = (t) => {
      setScanY((Math.sin(t / 1400) + 1) / 2);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen w-full relative" style={{ background: COLORS.bg, color: COLORS.ink }}>
      <style>{`
        ${FONT_IMPORT}
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        body { margin: 0; }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        a:focus-visible, button:focus-visible {
          outline: 2px solid ${COLORS.teal};
          outline-offset: 2px;
        }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .display { font-family: 'Space Grotesk', sans-serif; }
        .body-font { font-family: 'IBM Plex Sans', sans-serif; }

        .bg-texture {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            radial-gradient(circle, ${COLORS.ink}14 1px, transparent 1px);
          background-size: 26px 26px;
          opacity: 0.5;
        }
        .bg-vignette {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(ellipse at 50% 0%, transparent 40%, ${COLORS.bg} 90%);
        }

        .card {
          background: #fff;
          border: 1px solid ${COLORS.line};
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card:hover {
          border-color: ${COLORS.teal};
          transform: translateY(-4px);
          box-shadow: 6px 6px 0 0 ${COLORS.teal}22, 0 10px 30px -12px rgba(21,25,27,0.25);
        }
        .card::before, .card::after {
          content: "";
          position: absolute;
          width: 10px; height: 10px;
          border-color: ${COLORS.teal};
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .card::before { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
        .card::after { bottom: -1px; right: -1px; border-bottom: 2px solid; border-right: 2px solid; }
        .card:hover::before, .card:hover::after { opacity: 1; }

        .tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 2px 8px;
          border: 1px solid ${COLORS.line};
          color: ${COLORS.inkSoft};
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .card:hover .tag { border-color: ${COLORS.teal}55; }

        .nav-link { position: relative; }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -4px;
          height: 1px;
          background: ${COLORS.teal};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .nav-link:hover::after { transform: scaleX(1); }

        .pulse-dot { animation: pulse 1.8s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }

        .mesh-rotate { animation: rotateMesh 60s linear infinite; transform-origin: 50% 50%; }
        @keyframes rotateMesh { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .cta-primary {
          position: relative;
          overflow: hidden;
        }
        .cta-primary::before {
          content: "";
          position: absolute;
          inset: 0;
          background: ${COLORS.teal};
          transform: translateX(-101%);
          transition: transform 0.3s ease;
        }
        .cta-primary:hover::before { transform: translateX(0); }
        .cta-primary span { position: relative; z-index: 1; }

        .watermark {
          position: absolute;
          right: -20px;
          top: 10%;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(70px, 16vw, 220px);
          font-weight: 700;
          color: transparent;
          -webkit-text-stroke: 1px ${COLORS.line};
          letter-spacing: -4px;
          z-index: 0;
          pointer-events: none;
          user-select: none;
          line-height: 1;
        }

        .exp-rail {
          position: absolute;
          left: 15px;
          top: 8px;
          bottom: 8px;
          width: 1px;
          background: repeating-linear-gradient(to bottom, ${COLORS.line} 0 4px, transparent 4px 8px);
        }
      `}</style>

      <div className="bg-texture" />
      <div className="bg-vignette" />

      {/* scroll progress */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-40" style={{ background: "transparent" }}>
        <div style={{ width: `${scrollProgress * 100}%`, height: "100%", background: COLORS.teal, transition: "width 0.1s linear" }} />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-30 backdrop-blur" style={{ background: `${COLORS.bg}E6`, borderBottom: `1px solid ${COLORS.line}` }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="mono text-sm tracking-widest" style={{ color: COLORS.teal }}>CTJ // PORTFOLIO</span>
          <nav className="hidden sm:flex gap-6 mono text-xs tracking-widest uppercase" style={{ color: COLORS.inkSoft }}>
            <a href="#experience" className="nav-link">Experience</a>
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 z-10 overflow-hidden">
        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <StatusBadge tone="teal">Available Jul 2026</StatusBadge>

            <ViewfinderFrame className="mt-8 inline-block px-6 py-5 md:px-8 md:py-6">
              <div className="relative overflow-hidden">
                <div
                  className="absolute left-0 right-0 h-px pointer-events-none"
                  style={{ top: `${scanY * 100}%`, background: `linear-gradient(90deg, transparent, ${COLORS.teal}AA, transparent)` }}
                />
                <h1 className="display text-4xl sm:text-5xl md:text-[3.4rem] leading-[1.03]" style={{ fontWeight: 700 }}>
                  Chan <span style={{ color: COLORS.teal }}>Tze Jing</span>
                </h1>
              </div>
              <p className="mono text-xs md:text-sm tracking-widest uppercase mt-4" style={{ color: COLORS.teal }}>
                Software Engineering Graduate — QA Automation &amp; Full-Stack Development
              </p>
            </ViewfinderFrame>

            <p className="body-font text-base md:text-lg leading-relaxed mt-8 max-w-xl" style={{ color: COLORS.inkSoft }}>
              End-to-end technical depth — from React and Laravel web applications to a custom
              Python/Flask computer-vision microservice with facial recognition and liveness
              detection. QA automation experience at a global biometrics company, spanning test
              frameworks, algorithm optimisation, and tooling for non-technical users.
            </p>

            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 mono text-xs" style={{ color: COLORS.inkSoft }}>
              <div>
                <div className="uppercase tracking-widest mb-1" style={{ color: COLORS.teal }}>match_confidence</div>
                <div className="text-lg" style={{ color: COLORS.ink }}>{confidence.toFixed(1)}%</div>
              </div>
              <div>
                <div className="uppercase tracking-widest mb-1" style={{ color: COLORS.teal }}>false_accept_rate</div>
                <div className="text-lg" style={{ color: COLORS.ink }}>0.0%</div>
              </div>
              <div>
                <div className="uppercase tracking-widest mb-1" style={{ color: COLORS.teal }}>base</div>
                <div className="text-lg" style={{ color: COLORS.ink }}>Kuala Lumpur, MY</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <a href="mailto:jinz1083@gmail.com" className="cta-primary inline-flex items-center gap-2 px-5 py-3 mono text-xs tracking-widest uppercase" style={{ background: COLORS.ink, color: COLORS.bg }}>
                <span className="inline-flex items-center gap-2"><Mail size={14} /> Get in touch</span>
              </a>
              <a href="https://github.com/DefinitelyNotTzeJing" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 mono text-xs tracking-widest uppercase border transition-colors hover:bg-black hover:text-white" style={{ borderColor: COLORS.ink, color: COLORS.ink }}>
                {/* <GitHub size={14} /> GitHub */}
                {/* <span className="mono text-xs">GH</span> GitHub */}
                <FaGithub size={14} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/chan-tze-jing-3aba71412/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 mono text-xs tracking-widest uppercase border transition-colors hover:bg-black hover:text-white" style={{ borderColor: COLORS.ink, color: COLORS.ink }}>
                {/* <Linkedin size={14} /> LinkedIn */}
                <FaLinkedin size={14} /> LinkedIn
              </a>
            </div>
          </div>

          {/* abstract landmark mesh — nods to the liveness-detection project without depicting a real face */}
          <div className="hidden md:block relative">
            <LandmarkMesh size={380} seed={11} />
            <p className="mono text-[10px] text-center tracking-widest mt-2" style={{ color: COLORS.inkSoft }}>
              34_LANDMARKS · LIVENESS_CHECK · OK
            </p>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="relative max-w-5xl mx-auto px-6 py-16 md:py-20 z-10">
        <RulerDivider index="00" />
        <SectionLabel id="LOG_001" title="Experience" />
        {EXPERIENCE.map((exp, idx) => (
          <Reveal key={exp.id}>
            <div className="relative pl-8">
              <div className="exp-rail" />
              <div className="card p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                  <div>
                    <h3 className="display text-xl md:text-2xl" style={{ fontWeight: 600 }}>{exp.role}</h3>
                    <p className="mono text-sm mt-1" style={{ color: COLORS.teal }}>{exp.org}</p>
                  </div>
                  <div className="text-right">
                    <p className="mono text-xs" style={{ color: COLORS.inkSoft }}>{exp.period}</p>
                    <p className="mono text-xs flex items-center gap-1 justify-end mt-1" style={{ color: COLORS.inkSoft }}>
                      <MapPin size={12} /> {exp.loc}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 body-font text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>
                  {exp.log.map((line, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mono text-xs mt-1" style={{ color: COLORS.teal }}>{String(i + 1).padStart(2, "0")}</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative max-w-5xl mx-auto px-6 py-16 md:py-20 z-10 overflow-hidden">
        <span className="watermark" aria-hidden="true">VERIFIED</span>
        <RulerDivider index="01" />
        <SectionLabel id="LOG_002" title="Projects" />
        <div className="grid md:grid-cols-2 gap-5 relative">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <div className="card p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="mono text-xs tracking-widest" style={{ color: COLORS.inkSoft }}>{p.id}</span>
                  <StatusBadge tone={i % 3 === 0 ? "teal" : "teal"}>{p.status}</StatusBadge>
                </div>
                <h3 className="display text-lg" style={{ fontWeight: 600 }}>{p.name}</h3>
                <p className="mono text-xs mt-1 mb-3" style={{ color: COLORS.teal }}>{p.tagline}</p>
                <p className="body-font text-sm leading-relaxed flex-1" style={{ color: COLORS.inkSoft }}>{p.description}</p>

                {p.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4" style={{ borderTop: `1px solid ${COLORS.line}` }}>
                    {p.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="mono text-[10px] uppercase tracking-widest" style={{ color: COLORS.inkSoft }}>{m.label}</div>
                        <div className="display text-base" style={{ fontWeight: 600, color: COLORS.ink }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {p.stack.map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="mono text-[11px]" style={{ color: COLORS.inkSoft }}>{p.period}</span>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="mono text-xs inline-flex items-center gap-1" style={{ color: COLORS.teal }}>
                      View repo <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="relative max-w-5xl mx-auto px-6 py-16 md:py-20 z-10">
        <RulerDivider index="02" />
        <SectionLabel id="LOG_003" title="Skills" />
        <div className="grid sm:grid-cols-2 gap-8">
          {Object.entries(SKILLS).map(([group, items], gi) => (
            <Reveal key={group} delay={gi * 60}>
              <div>
                <p className="mono text-xs uppercase tracking-widest mb-3" style={{ color: COLORS.teal }}>{group}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <span key={s} className="tag" style={{ transition: "transform 0.15s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mono text-xs uppercase tracking-widest mt-10 mb-3" style={{ color: COLORS.teal }}>Languages</p>
        <p className="body-font text-sm" style={{ color: COLORS.inkSoft }}>
          English, Mandarin &amp; Malay (spoken &amp; written) · Hakka &amp; Cantonese (spoken)
        </p>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 z-10">
        <RulerDivider index="03" />
        <SectionLabel id="LOG_004" title="Contact" />
        <Reveal>
          <div className="card p-8 md:p-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="display text-2xl md:text-3xl mb-2" style={{ fontWeight: 600 }}>
                Open to graduate software engineering roles.
              </p>
              <p className="body-font text-sm" style={{ color: COLORS.inkSoft }}>
                Building reliable, large-scale systems — available from July 2026.
              </p>
            </div>
            <div className="flex flex-col gap-3 mono text-sm">
              <a href="mailto:jinz1083@gmail.com" className="inline-flex items-center gap-2" style={{ color: COLORS.ink }}>
                <Mail size={14} /> jinz1083@gmail.com
              </a>
              <a href="tel:+60166363688" className="inline-flex items-center gap-2" style={{ color: COLORS.ink }}>
                <Phone size={14} /> +60 16-636 3688
              </a>
              <a href="https://github.com/DefinitelyNotTzeJing" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2" style={{ color: COLORS.ink }}>
                {/* <Github size={14} /> github.com/DefinitelyNotTzeJing */}
                {/* <span className="mono text-xs">GH</span> github.com/DefinitelyNotTzeJing */}
                <FaGithub size={14} /> github.com/DefinitelyNotTzeJing
              </a>
              <a href="https://www.linkedin.com/in/chan-tze-jing-3aba71412/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2" style={{ color: COLORS.ink }}>
                {/* <Linkedin size={14} /> linkedin.com/in/chan-tze-jing-3aba71412 */}
                <FaLinkedin size={14} /> linkedin.com/in/chan-tze-jing-3aba71412
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="relative max-w-5xl mx-auto px-6 pb-10 z-10 flex items-center justify-between">
        <p className="mono text-[11px]" style={{ color: COLORS.inkSoft }}>© 2026 Chan Tze Jing — Built with React.</p>
      </footer>

      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-40 p-3 transition-opacity duration-300"
        style={{
          background: COLORS.ink,
          color: COLORS.bg,
          opacity: showTop ? 1 : 0,
          pointerEvents: showTop ? "auto" : "none",
        }}
      >
        <ArrowUp size={16} />
      </a>
    </div>
  );
}