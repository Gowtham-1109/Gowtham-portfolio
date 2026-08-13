import { useState, useEffect, useRef } from "react";

/* ============================================================
   DATA — extracted from the original static markup.
   Edit these arrays to update page content; no JSX changes needed.
   ============================================================ */

const NAV_ROUTES = [
  { href: "#about", label: "/about" },
  { href: "#skills", label: "/skills" },
  { href: "#projects", label: "/projects" },
  { href: "#education", label: "/education" },
  { href: "#contact", label: "/contact" },
];

const ABOUT_PARAGRAPHS = [
  "I graduated BCA from Nandha Arts and Science College (Bharathiar University), Erode, with a CGPA of 8.0, and spent the months since building things instead of just studying for a placement drive.",
  <>
    My core strength is <strong>Python programs that interact with real REST
    APIs</strong> — handling authentication, parsing JSON responses, and
    structuring the code into reusable, modular pieces rather than one-off
    scripts. I've applied the same engineering discipline to browser
    automation using the <strong>Page Object Model</strong>, and to
    performance scripting with JMeter.
  </>,
  <>
    I'm comfortable with Git/GitHub, Linux CLI, SQL, and the basics of
    HTML/CSS/JavaScript, and I'm currently deepening my backend skills with{" "}
    <strong>Flask and FastAPI</strong> so I can build the APIs I've spent so
    long testing and consuming.
  </>,
];

const SKILL_GROUPS = [
  {
    label: "Languages",
    chips: [
      { text: "Python", strong: true },
      { text: "SQL" },
      { text: "C" },
      { text: "HTML" },
      { text: "CSS" },
      { text: "JavaScript (basics)" },
    ],
  },
  {
    label: "Currently Strengthening",
    chips: [
      { text: "Flask", strong: true },
      { text: "FastAPI", strong: true },
    ],
  },
  {
    label: "Data Structures & Algorithms",
    chips: [
      { text: "Arrays" },
      { text: "Linked Lists" },
      { text: "Stacks" },
      { text: "Queues" },
      { text: "Recursion" },
      { text: "Two-Pointer / Sliding Window" },
      { text: "Big-O basics" },
    ],
  },
  {
    label: "Core Concepts",
    chips: [
      { text: "OOP fundamentals" },
      { text: "REST API design & consumption" },
      { text: "SDLC" },
    ],
  },
  {
    label: "Frameworks & Libraries",
    chips: [{ text: "Requests" }, { text: "Selenium WebDriver" }, { text: "pytest" }],
  },
  {
    label: "Database & Tools",
    chips: [
      { text: "MySQL" },
      { text: "Git" },
      { text: "GitHub" },
      { text: "VS Code" },
      { text: "Postman" },
      { text: "Linux CLI" },
    ],
  },
];

const PROJECTS = [
  {
    method: "post",
    title: "AI Resume Screener",
    stack: "Python · FastAPI · Cosine Similarity · Render",
    points: [
      "Web-based tool that scores how well a resume matches a job description, built for my own job search and then generalized for reuse.",
      "Match scoring computed with cosine similarity implemented from scratch in pure Python — no external ML library dependency.",
      "FastAPI backend exposing an endpoint that takes resume + job description text and returns a match score in real time.",
      "Deployed live on Render, so the full pipeline — input to score — is accessible end-to-end, not just running locally.",
    ],
    // TODO(conversion): source file used placeholder "#" links for GitHub/Live demo — fill in real URLs.
    links: [
      { label: "GitHub →", href: "https://github.com/Gowtham-1109/AI_project" },
      { label: "Live demo →", href: "https://ai-project-1-0rpu.onrender.com/" },
    ],
  },
  {
    method: "get",
    title: "Python REST API Client & Automation Framework",
    stack: "Python · Requests · pytest · Postman · Allure",
    points: [
      "Modular Python framework covering 8+ REST API endpoints — GET, POST, PUT, DELETE — with authentication and session handling.",
      "Reusable functions for request construction, response parsing, and JSON schema validation.",
      "Data-driven test design using pytest fixtures and parametrization for scalable coverage.",
      "Structured execution reports generated with pytest-html and Allure.",
    ],
    // TODO(conversion): placeholder link, add real GitHub URL.
    links: [{ label: "GitHub →", href: "https://github.com/Gowtham-1109/Rest-API-Client-Framework" }],
  },
  {
    method: "get",
    title: "Browser Automation Suite (OOP Design) — SauceDemo",
    stack: "Python · Selenium WebDriver",
    points: [
      "End-to-end e-commerce workflow automated — login, search, cart, checkout.",
      "Page Object Model applied to encapsulate elements and actions into reusable classes, eliminating duplication.",
      "Explicit waits and custom locator strategies for reliable handling of dynamic elements.",
    ],
    // TODO(conversion): placeholder link, add real GitHub URL.
    links: [{ label: "GitHub →", href: "https://github.com/Gowtham-1109/AUTOMATION-Pytest--Saucedemo-" }],
  },
  {
    method: "get",
    title: "Performance & Load Scripting — JPetStore",
    stack: "Apache JMeter",
    points: [
      "Parameterized load scripts built with CSV Data Config and JSON extractors for request correlation.",
      "Throughput, response time, and error-rate metrics analyzed to understand behavior under load.",
    ],
    // TODO(conversion): placeholder link, add real GitHub URL.
    links: [{ label: "GitHub →", href: "https://github.com/Gowtham-1109/Jmeter-" }],
  },
];

const EDUCATION = [
  {
    name: "BCA — Nandha Arts and Science College, Erode",
    meta: "Bharathiar University · 2022–2025",
    score: "CGPA 8.0",
  },
  {
    name: "HSC — Kongu Kalvi Nilayam Matric Higher Secondary School, Erode",
    meta: "2021–2022",
    score: "89%",
  },
  {
    name: "SSLC — Nandha Matric Higher Secondary School, Erode",
    meta: "2019–2020",
    score: "64%",
  },
];

const CERTS = [
  { name: "Apache JMeter Introduction", src: "BlazeMeter, 2026" },
  { name: "Python Fundamentals for Beginners", src: "Great Learning, 2024" },
  { name: "C for Beginners", src: "Great Learning, 2024" },
  { name: "Data Structures (Stacks, Queues, Linked Lists)", src: "Great Learning, 2024" },
];

const CMD_TEXT = "curl https://gowtham-m.dev/profile";

const JSON_LINES = [
  { key: "name", value: '"Gowtham M"' },
  { key: "role", value: '"Software Developer (Python)"' },
  { key: "focus", value: '["Backend Development", "REST APIs", "Automation Engineering"]' },
  { key: "location", value: '"Erode, Tamil Nadu, India"' },
  { key: "open_to_work", value: "true", isBool: true },
];

/* ============================================================
   Small presentational helpers
   ============================================================ */

function MethodTag({ method }) {
  return <span className={`method ${method}`}>{method.toUpperCase()}</span>;
}

function RouteTag({ method, path, status, statusColor }) {
  return (
    <div className="route-tag">
      <MethodTag method={method} />
      <span className="path">{path}</span>
      <span className="status-chip" style={statusColor ? { color: statusColor } : undefined}>
        {status}
      </span>
    </div>
  );
}

/* ============================================================
   Main component
   ============================================================ */

export default function GowthamPortfolio() {
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showJson, setShowJson] = useState(false);
  const startedRef = useRef(false);

  // Typing animation — replaces the original inline <script>.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setTyped(CMD_TEXT);
      setShowCursor(false);
      setShowJson(true);
      return;
    }

    let i = 0;
    let charTimer;
    const startTimer = setTimeout(function typeChar() {
      charTimer = setInterval(() => {
        i++;
        setTyped(CMD_TEXT.slice(0, i));
        if (i >= CMD_TEXT.length) {
          clearInterval(charTimer);
          setTimeout(() => {
            setShowCursor(false);
            setShowJson(true);
          }, 300);
        }
      }, 32);
    }, 500);

    return () => {
      clearTimeout(startTimer);
      clearInterval(charTimer);
    };
  }, []);

  return (
    <div className="gp-root">
      <style>{`
        .gp-root{
          --paper:#EEF1F5; --surface:#FFFFFF; --ink:#14181F; --muted:#5B6472;
          --line:#D8DEE6; --ok:#1E8E5A; --ok-bg:#E7F5EE; --req:#3452D9;
          --req-bg:#EAEEFC; --violet:#7C5CFF; --violet-bg:#F1EDFF;
          --amber:#D97706; --amber-bg:#FEF3E2;
          --mono:'JetBrains Mono', monospace; --sans:'Inter', sans-serif;
          background:var(--paper); color:var(--ink); font-family:var(--sans);
          line-height:1.6; -webkit-font-smoothing:antialiased;
        }
        .gp-root *{box-sizing:border-box; margin:0; padding:0;}
        .gp-root a{color:var(--req); text-decoration:none;}
        .gp-root a:hover{text-decoration:underline;}
        .gp-root ::selection{background:var(--req); color:#fff;}
        .gp-root :focus-visible{outline:2px solid var(--req); outline-offset:3px;}
        .gp-root .wrap{max-width:920px; margin:0 auto; padding:0 24px;}

        .gp-root .topbar{
          position:sticky; top:0; z-index:50;
          background:rgba(238,241,245,0.88); backdrop-filter:blur(8px);
          border-bottom:1px solid var(--line);
        }
        .gp-root .topbar-inner{
          max-width:920px; margin:0 auto; padding:14px 24px;
          display:flex; align-items:center; justify-content:space-between;
          font-family:var(--mono); font-size:13px;
        }
        .gp-root .brand{font-weight:600; color:var(--ink);}
        .gp-root .brand span{color:var(--req);}
        .gp-root .nav-routes{display:flex; gap:18px; flex-wrap:wrap;}
        .gp-root .nav-routes a{color:var(--muted); font-size:12.5px;}
        .gp-root .nav-routes a:hover{color:var(--ink); text-decoration:none;}
        @media (max-width:640px){ .gp-root .nav-routes{display:none;} }

        .gp-root .hero{padding:64px 0 40px;}
        .gp-root .eyebrow{
          font-family:var(--mono); font-size:12px; color:var(--muted);
          letter-spacing:0.02em; margin-bottom:14px;
        }
        .gp-root .eyebrow .dot{
          display:inline-block; width:7px; height:7px; border-radius:50%;
          background:var(--ok); margin-right:8px; vertical-align:middle;
          animation:gp-pulse 2s ease-in-out infinite;
        }
        @keyframes gp-pulse{ 0%,100%{opacity:1;} 50%{opacity:0.35;} }
        .gp-root h1{
          font-size:clamp(32px,5vw,46px); font-weight:800; letter-spacing:-0.02em;
          line-height:1.12; margin-bottom:10px;
        }
        .gp-root .role-line{
          font-family:var(--mono); font-size:15px; color:var(--req); font-weight:600;
          margin-bottom:22px;
        }
        .gp-root .subhead{max-width:56ch; color:var(--muted); font-size:16px; margin-bottom:32px;}

        .gp-root .terminal{
          background:var(--ink); color:#DCE3EC; border-radius:10px;
          font-family:var(--mono); font-size:13.5px;
          box-shadow:0 20px 40px -18px rgba(20,24,31,0.45);
          overflow:hidden; margin-bottom:8px;
        }
        .gp-root .terminal-head{
          display:flex; align-items:center; gap:8px;
          padding:11px 14px; background:#1E232C; border-bottom:1px solid #2A303B;
        }
        .gp-root .terminal-head span{width:10px; height:10px; border-radius:50%; display:inline-block;}
        .gp-root .terminal-head span:nth-child(1){background:#E5544D;}
        .gp-root .terminal-head span:nth-child(2){background:#E5B04D;}
        .gp-root .terminal-head span:nth-child(3){background:#4DBE6A;}
        .gp-root .terminal-title{margin-left:8px; font-size:11.5px; color:#7C8698; flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
        .gp-root .terminal-body{padding:20px 22px 24px; min-height:190px;}
        .gp-root .term-line{white-space:pre-wrap; word-break:break-word;}
        .gp-root .prompt{color:#4DBE6A;}
        .gp-root .cmd{color:#DCE3EC;}
        .gp-root .cursor{
          display:inline-block; width:7px; height:15px; background:#DCE3EC;
          vertical-align:text-bottom; margin-left:2px;
          animation:gp-blink 1s step-end infinite;
        }
        @keyframes gp-blink{ 50%{opacity:0;} }
        .gp-root .json-out{color:#9FB0C6; margin-top:12px; opacity:0; transition:opacity .5s ease; white-space:pre-wrap; line-height:1.75;}
        .gp-root .json-out.show{opacity:1;}
        .gp-root .json-key{color:#7CB8F0;}
        .gp-root .json-str{color:#B5E29A;}
        .gp-root .json-bool{color:#E5B04D;}
        .gp-root .caption{font-family:var(--mono); font-size:11.5px; color:var(--muted); margin-top:10px;}

        .gp-root section{padding:52px 0;}
        .gp-root .route-tag{display:flex; align-items:center; gap:10px; margin-bottom:22px;}
        .gp-root .method{
          font-family:var(--mono); font-size:11.5px; font-weight:700;
          padding:3px 8px; border-radius:5px; letter-spacing:0.03em;
        }
        .gp-root .method.get{ color:var(--ok); background:var(--ok-bg); }
        .gp-root .method.post{ color:var(--req); background:var(--req-bg); }
        .gp-root .path{font-family:var(--mono); font-size:14px; color:var(--ink); font-weight:600;}
        .gp-root .status-chip{font-family:var(--mono); font-size:11px; color:var(--ok); margin-left:auto;}
        .gp-root h2.section-title{font-size:22px; font-weight:800; letter-spacing:-0.01em; margin-bottom:6px;}
        .gp-root .section-sub{color:var(--muted); font-size:14.5px; margin-bottom:26px; max-width:60ch;}
        .gp-root hr.rule{border:none; border-top:1px solid var(--line); margin:0 0 40px;}

        .gp-root .about-text{max-width:64ch; font-size:15.5px; color:var(--ink);}
        .gp-root .about-text p{margin-bottom:14px;}
        .gp-root .about-text strong{color:var(--ink);}

        .gp-root .skills-grid{display:grid; grid-template-columns:repeat(2,1fr); gap:14px;}
        @media (max-width:640px){ .gp-root .skills-grid{grid-template-columns:1fr;} }
        .gp-root .skill-card{
          background:var(--surface); border:1px solid var(--line); border-radius:10px;
          padding:16px 18px; border-top:3px solid var(--ok);
        }
        .gp-root .skill-card:nth-child(2){border-top-color:var(--req);}
        .gp-root .skill-card:nth-child(3){border-top-color:var(--violet);}
        .gp-root .skill-card:nth-child(4){border-top-color:var(--amber);}
        .gp-root .skill-card:nth-child(5){border-top-color:var(--req);}
        .gp-root .skill-card:nth-child(6){border-top-color:var(--ok);}
        .gp-root .skill-card .k{
          font-family:var(--mono); font-size:11.5px; color:var(--muted);
          text-transform:uppercase; letter-spacing:0.04em; margin-bottom:9px;
        }
        .gp-root .chip-row{display:flex; flex-wrap:wrap; gap:7px;}
        .gp-root .chip{
          font-family:var(--mono); font-size:12px; background:var(--paper);
          border:1px solid var(--line); border-radius:6px; padding:4px 9px; color:var(--ink);
        }
        .gp-root .chip.strong{border-color:var(--req); color:var(--req); background:var(--req-bg);}

        .gp-root .project-card{
          background:var(--surface); border:1px solid var(--line); border-left:4px solid var(--amber);
          border-radius:12px; padding:22px 24px; margin-bottom:18px;
          transition:border-color .18s ease, transform .18s ease;
        }
        .gp-root .project-card:nth-child(2){border-left-color:var(--ok);}
        .gp-root .project-card:nth-child(3){border-left-color:var(--req);}
        .gp-root .project-card:nth-child(4){border-left-color:var(--violet);}
        .gp-root .project-card:hover{border-color:var(--req); border-left-width:4px; transform:translateY(-2px);}
        .gp-root .project-head{display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin-bottom:4px;}
        .gp-root .project-title{font-size:17px; font-weight:700;}
        .gp-root .project-sub{font-family:var(--mono); font-size:12px; color:var(--muted); margin-bottom:14px;}
        .gp-root .response-label{
          font-family:var(--mono); font-size:11px; color:var(--muted);
          text-transform:uppercase; letter-spacing:0.04em; margin:14px 0 8px;
        }
        .gp-root ul.result-list{list-style:none; padding:0;}
        .gp-root ul.result-list li{
          position:relative; padding-left:18px; margin-bottom:7px;
          font-size:14.5px; color:var(--ink);
        }
        .gp-root ul.result-list li::before{
          content:"›"; position:absolute; left:0; color:var(--req); font-weight:700;
        }
        .gp-root .proj-links{margin-top:14px; font-family:var(--mono); font-size:12.5px;}
        .gp-root .proj-links a{margin-right:16px;}

        .gp-root .edu-row{
          display:flex; justify-content:space-between; align-items:baseline;
          padding:14px 0; border-bottom:1px solid var(--line); gap:16px; flex-wrap:wrap;
        }
        .gp-root .edu-row:last-child{border-bottom:none;}
        .gp-root .edu-name{font-weight:600; font-size:15px;}
        .gp-root .edu-meta{color:var(--muted); font-size:13.5px;}
        .gp-root .edu-score{font-family:var(--mono); font-size:13px; color:var(--ok); white-space:nowrap;}

        .gp-root .cert-list{display:flex; flex-direction:column; gap:10px; margin-top:22px;}
        .gp-root .cert-item{
          display:flex; justify-content:space-between; align-items:center;
          font-size:14px; padding:10px 14px; background:var(--surface);
          border:1px solid var(--line); border-radius:8px; flex-wrap:wrap; gap:6px;
        }
        .gp-root .cert-item .src{font-family:var(--mono); font-size:12px; color:var(--muted);}

        .gp-root .contact-box{background:var(--ink); color:#DCE3EC; border-radius:12px; padding:32px 30px;}
        .gp-root .contact-box .path{color:#DCE3EC;}
        .gp-root .contact-grid{display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-top:22px;}
        @media (max-width:640px){ .gp-root .contact-grid{grid-template-columns:1fr;} }
        .gp-root .contact-item{font-family:var(--mono); font-size:13.5px;}
        .gp-root .contact-item .label{color:#7C8698; font-size:11px; text-transform:uppercase; letter-spacing:0.04em; display:block; margin-bottom:4px;}
        .gp-root .contact-item a{color:#7CB8F0;}

        .gp-root footer{padding:34px 0 60px; text-align:center; font-family:var(--mono); font-size:12px; color:var(--muted);}

        @media (prefers-reduced-motion: reduce){
          .gp-root .eyebrow .dot, .gp-root .cursor{animation:none;}
          .gp-root .json-out{transition:none;}
        }
      `}</style>

      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            gowtham<span>-m</span>.dev
          </div>
          <nav className="nav-routes">
            {NAV_ROUTES.map((r) => (
              <a key={r.href} href={r.href}>
                {r.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="wrap">
        <section className="hero">
          <div className="eyebrow">
            <span className="dot" />
            open_to_work — replies within 24h
          </div>
          <h1>Gowtham M</h1>
          <div className="role-line">
            Software Developer (Python) — Backend &amp; API Development
          </div>
          <p className="subhead">
            BCA graduate who builds Python programs that talk to real systems
            — REST APIs, browser automation, load testing — and is now moving
            that same rigor into backend services with Flask/FastAPI.
          </p>

          <div className="terminal">
            <div className="terminal-head">
              <span></span>
              <span></span>
              <span></span>
              <span className="terminal-title">gowtham@dev — GET /profile</span>
            </div>
            <div className="terminal-body">
              <div className="term-line">
                <span className="prompt">$</span> <span className="cmd">{typed}</span>
                {showCursor && <span className="cursor" />}
              </div>
              <div className={`json-out${showJson ? " show" : ""}`}>
                {"{\n"}
                {JSON_LINES.map((line, idx) => (
                  <span key={line.key}>
                    {"  "}
                    <span className="json-key">"{line.key}"</span>
                    {": "}
                    <span className={line.isBool ? "json-bool" : "json-str"}>{line.value}</span>
                    {idx < JSON_LINES.length - 1 ? ",\n" : "\n"}
                  </span>
                ))}
                {"}"}
              </div>
            </div>
          </div>
          <div className="caption">200 OK · 42ms</div>
        </section>

        <hr className="rule" />

        <section id="about">
          <RouteTag method="get" path="/about" status="200 OK" />
          <h2 className="section-title">Professional Summary</h2>
          <div className="about-text">
            {ABOUT_PARAGRAPHS.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>

        <hr className="rule" />

        <section id="skills">
          <RouteTag method="get" path="/skills" status="200 OK" />
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-sub">
            Grouped the way I'd actually reach for them on a project, not
            alphabetized for show.
          </p>

          <div className="skills-grid">
            {SKILL_GROUPS.map((group) => (
              <div className="skill-card" key={group.label}>
                <div className="k">{group.label}</div>
                <div className="chip-row">
                  {group.chips.map((chip) => (
                    <span
                      key={chip.text}
                      className={`chip${chip.strong ? " strong" : ""}`}
                    >
                      {chip.text}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule" />

        <section id="projects">
          <div className="route-tag">
            <MethodTag method="get" />
            <span className="path">/projects</span>
            <span className="status-chip">200 OK · {PROJECTS.length} items</span>
          </div>
          <h2 className="section-title">Projects</h2>
          <p className="section-sub">
            Each one below is a real, working build — not a tutorial clone.
          </p>

          {PROJECTS.map((proj) => (
            <div className="project-card" key={proj.title}>
              <div className="project-head">
                <MethodTag method={proj.method} />
                <span className="project-title">{proj.title}</span>
              </div>
              <div className="project-sub">{proj.stack}</div>
              <div className="response-label">Response body</div>
              <ul className="result-list">
                {proj.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              <div className="proj-links">
                {proj.links.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>

        <hr className="rule" />

        <section id="education">
          <RouteTag method="get" path="/education" status="200 OK" />
          <h2 className="section-title">Education &amp; Certifications</h2>

          {EDUCATION.map((edu) => (
            <div className="edu-row" key={edu.name}>
              <div>
                <div className="edu-name">{edu.name}</div>
                <div className="edu-meta">{edu.meta}</div>
              </div>
              <div className="edu-score">{edu.score}</div>
            </div>
          ))}

          <div className="cert-list">
            {CERTS.map((cert) => (
              <div className="cert-item" key={cert.name}>
                <span>{cert.name}</span>
                <span className="src">{cert.src}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule" />

        <section id="contact">
          <div className="contact-box">
            <div className="route-tag" style={{ marginBottom: 14 }}>
              <MethodTag method="post" />
              <span className="path">/contact</span>
              <span className="status-chip" style={{ color: "#7CB8F0" }}>
                ready
              </span>
            </div>
            <p style={{ color: "#B7C2D3", fontSize: "14.5px", maxWidth: "56ch" }}>
              Open to entry-level Software Developer / Python Developer roles.
              Happy to walk through any of the projects above in more depth.
            </p>
            <div className="contact-grid">
              <div className="contact-item">
                <span className="label">Email</span>
                <a href="mailto:gowthammanikandan01@gmail.com">
                  gowthammanikandan01@gmail.com
                </a>
              </div>
              <div className="contact-item">
                <span className="label">Phone</span>
                <a href="tel:+917708145079">+91 7708145079</a>
              </div>
              <div className="contact-item">
                <span className="label">LinkedIn</span>
                {/* TODO(conversion): placeholder — add real LinkedIn URL */}
                <a href="https://www.linkedin.com/in/gowtham110904/" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/gowtham110904
                </a>
              </div>
              <div className="contact-item">
                <span className="label">GitHub</span>
                {/* TODO(conversion): placeholder — add real GitHub URL */}
                <a href="https://github.com/Gowtham-1109" target="_blank" rel="noopener noreferrer">
                 Github.com/gowtham-1109
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer>// end of response — thanks for reading</footer>
    </div>
  );
}
