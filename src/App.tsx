import { useState, useRef } from "react"
import LaserFlow from "./LaserFlow"
import SplashCursor from "./SplashCursor"

const asset = "/assets"

interface Project {
  id: string
  name: string
  fullName?: string
  category: string
  platform: "Flutter" | "Next.js" | "React.js"
  tag: "mobile" | "web" | "ai"
  description: string
  technologies: string[]
  features: string[]
  architectureHighlights?: string[]
  accent: string
}

const enterpriseApps = [
  {
    id: "payroll",
    name: "Internal Payroll Management System",
    type: "Enterprise Mobile Application",
    technology: "Flutter · Dart · REST APIs",
    scale: "Coolminds Technologies · Infopark Kakkanad",
    contribution:
      "Built the complete frontend from scratch for Coolminds Technologies internal payroll operations, featuring custom responsive layouts, reusable widgets, and complex compensation/wage screens.",
    highlights: [
      "Zero-to-one frontend architecture for company-wide payroll",
      "Reusable widget library & unified design tokens",
      "Complex wage calculations, tax slabs & deduction screens",
      "Real-time pay slip generation and export workflows",
    ],
    accent: "from-rose-500/20 to-orange-500/20",
  },
  {
    id: "tms",
    name: "Internal Time Management System (TMS)",
    type: "Enterprise Mobile Application",
    technology: "Flutter · Supabase · Real-Time Sync",
    scale: "Internal Workforce Suite · Infopark Kakkanad",
    contribution:
      "Engineered an internal workforce operations app for Coolminds Technologies covering daily attendance logging, automated leave approvals, employee scheduling, and management dashboards.",
    highlights: [
      "Company-wide live attendance tracking & punch records",
      "Multi-level leave approval hierarchies & status feeds",
      "Shift planning & employee work schedules",
      "Executive dashboard analytics & attendance summary cards",
    ],
    accent: "from-amber-500/20 to-emerald-500/20",
  },
  {
    id: "expense",
    name: "Internal AI Expense Management System",
    type: "AI-Powered Enterprise Application",
    technology: "Flutter · OCR · AI APIs · REST APIs",
    scale: "Intelligent Financial Workflows · Coolminds",
    contribution:
      "Contributed to an internal intelligent financial application with automated invoice processing, OCR receipt extraction, and AI-assisted verification workflows for corporate expense claims.",
    highlights: [
      "Intelligent OCR receipt & invoice text extraction",
      "AI-assisted automated expense categorization",
      "Corporate policy compliance checks & anomaly detection",
      "Streamlined reimbursement approval cycle for employees",
    ],
    accent: "from-teal-500/20 to-cyan-500/20",
  },
  {
    id: "ulearn",
    name: "µLearn Large-Scale Community Platform",
    type: "High-Traffic Web Platform",
    technology: "React.js · TypeScript · JavaScript · CSS3",
    scale: "30,000+ Active Learners Served",
    contribution:
      "Contributed to the high-traffic community learning platform under the KKEM and µLearn collaborative initiative, resolving critical frontend issues and enhancing UX across core modules.",
    highlights: [
      "Scalable student learning circle dashboard",
      "Modular organizational tracking widgets",
      "Optimized page loads and state management",
      "Cross-browser responsive UI polish",
    ],
    accent: "from-blue-500/20 to-indigo-500/20",
  },
]

const projects: Project[] = [
  {
    id: "richmond",
    name: "Richmond",
    fullName: "Richmond – E-Commerce Mobile Application",
    category: "E-commerce Mobile Application",
    platform: "Flutter",
    tag: "mobile",
    description:
      "A production-oriented e-commerce Flutter application covering the complete customer shopping journey, from authentication and product discovery to cart management, checkout, payment, order management, wishlist, and location-based functionality.",
    technologies: [
      "Flutter",
      "Dart",
      "REST API Integration",
      "Stripe",
      "Google Login",
      "Apple Login",
      "Email OTP Authentication",
      "Maps Integration",
    ],
    features: [
      "Email OTP, Google, and Apple multi-provider authentication",
      "Rich product discovery, filterable catalog, and search workflows",
      "Cart and persistent wishlist management",
      "Secure multi-step checkout flow with Stripe payment integration",
      "Order placement, live status tracking, and order history",
      "Interactive maps integration for address pinning & delivery zones",
    ],
    architectureHighlights: [
      "Componentized Flutter widget tree for reusability",
      "Predictable client state management & offline safety",
      "Strict API-driven repository pattern",
      "Polished transactional micro-interactions",
    ],
    accent: "from-orange-400 to-red-600",
  },
  {
    id: "hirescope",
    name: "HireScope",
    fullName: "HireScope – AI Resume Screening Platform",
    category: "AI Recruitment Platform",
    platform: "Next.js",
    tag: "ai",
    description:
      "Intelligent recruitment platform that automates candidate screening and ranking using modern NLP techniques.",
    technologies: ["Next.js", "TypeScript", "AI", "NLP", "Tailwind CSS"],
    features: [
      "AI-powered resume parsing and semantic capability matching",
      "Automated candidate screening against job specifications",
      "Multi-variable candidate score ranking",
      "Executive recruitment analytics dashboards",
      "Candidate pipeline and status management workflows",
    ],
    architectureHighlights: [
      "Server-side Next.js rendering for high-speed recruitment triage",
      "NLP document parsing integration pipelines",
      "Modular dashboard visualization cards",
    ],
    accent: "from-teal-300 to-cyan-600",
  },
  {
    id: "syneat",
    name: "SynEat",
    fullName: "SynEat – AI Diet Recommendation App",
    category: "AI Health & Nutrition Application",
    platform: "Flutter",
    tag: "ai",
    description:
      "Personalized AI diet application designed to generate tailored nutrition plans and health tracking interfaces.",
    technologies: ["Flutter", "Dart", "AI APIs", "Mobile UX"],
    features: [
      "Personalized AI diet recommendations based on health profiles",
      "Dynamic nutrition and caloric planning algorithms",
      "Daily meal intake and health tracking interfaces",
      "Adaptive recommendation workflows that adjust to user progress",
    ],
    architectureHighlights: [
      "Cross-platform Flutter responsive canvas",
      "Asynchronous AI recommendation streaming",
      "Smooth caloric visualization charts",
    ],
    accent: "from-amber-300 to-orange-600",
  },
  {
    id: "luvtrek",
    name: "LuvTrek",
    fullName: "LuvTrek – Dating Application",
    category: "Mobile Dating Application",
    platform: "Flutter",
    tag: "mobile",
    description:
      "Modern mobile dating platform focused on profile management, user interaction, engaging UI, and smooth navigation.",
    technologies: ["Flutter", "Dart", "Mobile UX", "Animations"],
    features: [
      "Comprehensive user profile management and preference setup",
      "Engaging interactive discovery and matching swipe gestures",
      "Mobile-first expressive interface with clean micro-interactions",
      "Smooth navigation transitions optimized for high-refresh screens",
    ],
    architectureHighlights: [
      "High-performance gesture recognition pipeline",
      "Fluid 60fps card transitions",
      "Lightweight local caching for rapid profile card rendering",
    ],
    accent: "from-rose-300 to-pink-600",
  },
  {
    id: "ai-resume",
    name: "AI Resume Builder",
    fullName: "AI Resume Builder – Web Application",
    category: "AI Web Application",
    platform: "Next.js",
    tag: "ai",
    description:
      "AI-powered resume generation platform providing automated content generation and professional formatting.",
    technologies: ["Next.js", "TypeScript", "AI Integration", "Tailwind CSS"],
    features: [
      "Prompt-driven AI resume content generation & bullet crafting",
      "Real-time live formatted preview with professional templates",
      "Instant PDF export with clean typographical styling",
      "ATS-friendly keyword optimization suggestions",
    ],
    architectureHighlights: [
      "Next.js App Router for dynamic document manipulation",
      "Live markdown-to-styled-document parser",
      "Client-side print styling & PDF synthesis",
    ],
    accent: "from-violet-400 to-purple-600",
  },
  {
    id: "travel-booking",
    name: "Travel Booking System",
    fullName: "Travel Booking System – Web Application",
    category: "Travel Web Application",
    platform: "React.js",
    tag: "web",
    description:
      "Travel platform with responsive interfaces for package browsing, booking workflows, and reservation management.",
    technologies: ["React.js", "JavaScript", "CSS3", "REST APIs"],
    features: [
      "Interactive destination and travel package catalog",
      "Responsive multi-step booking checkout flow",
      "Reservation management and booking itinerary summaries",
      "Filtered package searches by price, duration, and rating",
    ],
    architectureHighlights: [
      "Clean React component hierarchy",
      "Controlled booking form validation pipelines",
      "Responsive flex and grid layouts",
    ],
    accent: "from-emerald-300 to-teal-600",
  },
]

const skillCategories = [
  {
    title: "Mobile Development",
    icon: "📱",
    skills: [
      "Flutter",
      "Dart",
      "Cross-Platform Development",
      "State Management",
      "Widget Architecture",
      "API Integration",
    ],
  },
  {
    title: "Web Development",
    icon: "🌐",
    skills: [
      "Next.js",
      "React.js",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
    ],
  },
  {
    title: "Backend & Database",
    icon: "⚡",
    skills: [
      "Supabase",
      "Authentication",
      "Database Integration",
      "Real-Time Data",
      "REST APIs",
    ],
  },
  {
    title: "AI & Productivity",
    icon: "✦",
    skills: [
      "AI Integration",
      "OCR Integration",
      "Prompt Engineering",
      "AI-Assisted Development",
      "Workflow Automation",
    ],
  },
  {
    title: "Developer Tools",
    icon: "🛠",
    skills: [
      "Git",
      "GitHub",
      "Postman",
      "Figma",
      "VS Code",
      "Antigravity",
      "Stitch",
      "gitat",
    ],
  },
  {
    title: "Languages",
    icon: "💻",
    skills: ["Dart", "JavaScript", "TypeScript", "Python"],
  },
]

const domains = [
  "E-commerce",
  "Internal Payroll",
  "Time Management (TMS)",
  "AI Expense Systems",
  "Recruitment Platforms",
  "Dating Applications",
  "Health & Nutrition",
  "Travel Booking",
]

export default function App() {
  const [active, setActive] = useState("home")
  const [projectFilter, setProjectFilter] =
    useState<"all" | "mobile" | "web" | "ai">("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [copied, setCopied] = useState(false)
  const revealImgRef = useRef<HTMLImageElement>(null)

  const scrollTo = (id: string) => {
    setActive(id)
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("alankanil1234@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const filteredProjects =
    projectFilter === "all"
      ? projects
      : projects.filter((p) => {
          if (projectFilter === "mobile") return p.platform === "Flutter"
          if (projectFilter === "web")
            return p.platform === "Next.js" || p.platform === "React.js"
          if (projectFilter === "ai") return p.tag === "ai"
          return true
        })

  return (
    <main className="portfolio-shell">
      {/* Interactive WebGL Fluid Splash Cursor from React Bits */}
      <SplashCursor
        CURL={16}
        COLOR_UPDATE_SPEED={15}
        SHADING={false}
        RAINBOW_MODE
      />

      {/* Side Rail Navigation */}
      <aside className="side-rail">
        <a className="rail-mark" href="#home" aria-label="Alan K Anil home">
          AK
        </a>
        <nav className="rail-nav" aria-label="Portfolio sections">
          {[
            ["home", "⌂", "Home"],
            ["enterprise", "⚡", "Enterprise"],
            ["spotlight", "✦", "Spotlight"],
            ["work", "◈", "Projects"],
            ["skills", "⎇", "Skills"],
            ["experience", "◉", "Experience"],
            ["about", "◎", "About & Education"],
            ["contact", "↗", "Contact"],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={active === id ? "rail-link active" : "rail-link"}
              aria-label={label}
            >
              <span>{icon}</span>
              <em>{label}</em>
            </button>
          ))}
        </nav>

        {/* Side Rail Profile Bottom (Updated with Alan's portrait) */}
        <div
          className="rail-bottom"
          title="Alan K Anil — Available for new opportunities"
        >
          <div className="avatar-wrap">
            <img
              src={`${asset}/hero-portrait.jpeg`}
              alt="Alan K Anil"
              className="rail-avatar"
            />
            <span className="availability-dot" aria-hidden="true" />
          </div>
          <span className="rail-caption">
            Available
            <br />
            for work
          </span>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <section className="content-canvas">
        <div className="canvas-noise" aria-hidden="true" />

        {/* Header Topbar */}
        <header className="topbar">
          <div className="top-brand">
            <p className="eyebrow">Portfolio / 2026</p>
            <span className="top-subtext">
              Software Engineer · Coolminds Technologies (Infopark Kakkanad)
            </span>
          </div>
          <div className="top-actions">
            <a
              href={`${asset}/Alan_K_Anil_Resume.pdf`}
              download="Alan_K_Anil_Resume.pdf"
              className="resume-pill"
              title="Download Alan K Anil's Resume (PDF)"
            >
              <span>Resume PDF</span> <i>↓</i>
            </a>
            <a href="mailto:alankanil1234@gmail.com" className="contact-pill">
              Let’s talk <span>↗</span>
            </a>
          </div>
        </header>

        {/* 1. HERO SECTION */}
        <section id="home" className="hero-section section-anchor">
          <div className="hero-copy">
            <p className="hero-kicker">
              <span /> Software Engineer · 2 Years Experience at Coolminds
            </p>
            <h1>
              Alan
              <br />
              <i>K</i> Anil.
            </h1>
            <p className="hero-intro">
              Frontend-focused engineer with{" "}
              <strong>2 years of experience</strong> developing internal
              enterprise applications at{" "}
              <strong>
                Coolminds Technologies Pvt. Ltd. (Infopark Kakkanad, Kochi)
              </strong>{" "}
              using <strong>Flutter</strong> and modern web apps in{" "}
              <strong>Next.js</strong>. Currently pursuing{" "}
              <strong>M.Tech in Computer Science & Engineering at KMEA</strong>.
            </p>
            <div className="hero-roles">
              <span>Flutter Developer</span>
              <span>Next.js Developer</span>
              <span>Coolminds Tech (Infopark)</span>
              <span>Supabase & APIs</span>
              <span>M.Tech CSE @ KMEA</span>
              <span>Ernakulam, India</span>
            </div>

            <div className="hero-cta-group">
              <button
                onClick={() => scrollTo("enterprise")}
                className="btn-primary"
              >
                Explore Enterprise Work <span>⚡</span>
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="btn-secondary"
              >
                Get In Touch <span>↗</span>
              </button>
            </div>
          </div>

          <div className="hero-art" aria-label="Alan K Anil portrait artwork">
            <div className="art-caption">
              <span>01</span>
              <p>
                Crafting considered,
                <br />
                capable products
              </p>
            </div>
            <img
              src={`${asset}/hero-portrait.jpeg`}
              alt="Alan K Anil"
              className="dragon-art"
            />
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <a
              className="art-button"
              href="#work"
              onClick={(e) => {
                e.preventDefault()
                scrollTo("work")
              }}
            >
              View projects <span>↘</span>
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>02+ Yrs</strong>
              <span>Coolminds (Infopark)</span>
            </div>
            <div>
              <strong>04</strong>
              <span>Enterprise Systems</span>
            </div>
            <div>
              <strong>30K+</strong>
              <span>Users Served</span>
            </div>
            <div>
              <strong>08.58</strong>
              <span>B.Tech CGPA</span>
            </div>
          </div>
        </section>

        {/* 2. ENTERPRISE PLATFORMS SECTION */}
        <section id="enterprise" className="enterprise-section section-anchor">
          <div className="section-heading">
            <p className="eyebrow">Internal Enterprise Platforms</p>
            <h2>
              Coolminds Technologies,
              <br />
              Infopark Kakkanad.
            </h2>
            <p>
              Mission-critical internal enterprise suites engineered from
              scratch for Coolminds Technologies — covering company-wide payroll
              automation, employee time tracking, and AI expense intelligence.
            </p>
          </div>

          <div className="enterprise-grid">
            {enterpriseApps.map((app) => (
              <div key={app.id} className="enterprise-card">
                <div
                  className={`enterprise-glow bg-gradient-to-br ${app.accent}`}
                />
                <div className="enterprise-meta">
                  <span className="badge-platform">{app.technology}</span>
                  <span className="enterprise-scale">{app.scale}</span>
                </div>
                <h3>{app.name}</h3>
                <p className="enterprise-summary">{app.contribution}</p>
                <div className="enterprise-bullets">
                  {app.highlights.map((point, i) => (
                    <div key={i} className="bullet-row">
                      <span className="bullet-dot">✦</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2.5. INTERACTIVE LASER FLOW SPOTLIGHT */}
        <section
          id="spotlight"
          className="laser-spotlight-section section-anchor"
        >
          <div
            className="laser-spotlight-container"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const y = e.clientY - rect.top
              const el = revealImgRef.current
              if (el) {
                el.style.setProperty("--mx", `${x}px`)
                el.style.setProperty("--my", `${y + rect.height * 0.35}px`)
              }
            }}
            onMouseLeave={() => {
              const el = revealImgRef.current
              if (el) {
                el.style.setProperty("--mx", "-9999px")
                el.style.setProperty("--my", "-9999px")
              }
            }}
          >
            <LaserFlow
              horizontalBeamOffset={0.1}
              verticalBeamOffset={0.0}
              color="#d53831"
              backgroundColor="#120F17"
              horizontalSizing={0.5}
              verticalSizing={2}
              wispDensity={1}
              wispSpeed={15}
              wispIntensity={5}
              flowSpeed={0.35}
              flowStrength={0.25}
              fogIntensity={0.45}
              fogScale={0.3}
              fogFallSpeed={0.6}
              decay={1.1}
              falloffStart={1.2}
            />

            <div className="laser-spotlight-card">
              <span className="spotlight-eyebrow">
                Interactive Spotlight · Coolminds Technologies
              </span>
              <h3>High-Velocity Code. Calm, Considered Products.</h3>
              <p>
                2 years engineering internal enterprise suites at Infopark
                Kakkanad, pairing Flutter mobile architectures and Next.js web
                systems with AI automation.
              </p>
              <div className="spotlight-chips">
                <span className="spotlight-chip">⚡ Flutter Enterprise</span>
                <span className="spotlight-chip">🌐 Next.js & React</span>
                <span className="spotlight-chip">🤖 AI & OCR Integration</span>
                <span className="spotlight-chip">🎓 M.Tech CSE @ KMEA</span>
              </div>
              <div className="spotlight-hint">
                <span>
                  ✦ Move cursor across the canvas to interact with the laser &
                  reveal the architect
                </span>
              </div>
            </div>

            <img
              ref={revealImgRef}
              src={`${asset}/hero-portrait.jpeg`}
              alt="Alan K Anil interactive portrait"
              className="laser-reveal-image"
              style={{
                position: "absolute",
                width: "100%",
                top: "-30%",
                zIndex: 5,
                mixBlendMode: "lighten",
                opacity: 0.38,
                pointerEvents: "none",
                WebkitMaskImage:
                  "radial-gradient(circle at var(--mx, -9999px) var(--my, -9999px), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
                maskImage:
                  "radial-gradient(circle at var(--mx, -9999px) var(--my, -9999px), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                ...{
                  "--mx": "-9999px",
                  "--my": "-9999px",
                } as React.CSSProperties,
              }}
            />
          </div>
        </section>

        {/* 3. FEATURED PROJECTS SECTION */}
        <section id="work" className="work-section section-anchor">
          <div className="section-heading">
            <p className="eyebrow">Selected Projects</p>
            <h2>
              Ideas, shipped
              <br />
              with intention.
            </h2>
            <p>
              Products combining thoughtful UI/UX interaction design with
              resilient application architecture.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="project-filter-bar">
            {([
              ["all", "All Projects (6)"],
              ["mobile", "Flutter & Mobile (3)"],
              ["web", "Next.js & Web (3)"],
              ["ai", "AI & Workflows (4)"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setProjectFilter(key)}
                className={`filter-tab ${
                  projectFilter === key ? "active" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="project-grid">
            {filteredProjects.map((project, index) => (
              <div
                className={`project-card card-${index + 1}`}
                key={project.id}
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setSelectedProject(project)
                  }
                }}
              >
                <span
                  className={`project-wash bg-gradient-to-br ${project.accent}`}
                />
                {/* Fixed Header: Clean spacing between badges and arrow */}
                <div className="project-card-header">
                  <div className="project-badges-left">
                    <span className="project-index">0{index + 1}</span>
                    <span className="project-platform-badge">
                      {project.platform}
                    </span>
                  </div>
                  <span className="project-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>

                <div className="project-card-body">
                  <small>{project.category}</small>
                  <strong>{project.name}</strong>
                  <p className="project-desc-preview">{project.description}</p>
                  <div className="project-tags">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="tech-badge-more">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="project-inspect-hint">
                  <span>Tap to view details & architecture</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. TECHNICAL SKILLS & DOMAIN EXPERTISE SECTION */}
        <section id="skills" className="skills-section section-anchor">
          <div className="section-heading">
            <p className="eyebrow">Technical Capabilities</p>
            <h2>
              Modern engineering,
              <br />
              proven stack.
            </h2>
            <p>
              Tools, frameworks, and architectural patterns leveraged to build
              scalable enterprise and consumer products.
            </p>
          </div>

          <div className="skills-matrix-grid">
            {skillCategories.map((category) => (
              <div key={category.title} className="skill-cat-card">
                <div className="cat-header">
                  <span className="cat-icon">{category.icon}</span>
                  <h3>{category.title}</h3>
                </div>
                <div className="cat-pills">
                  {category.skills.map((skill) => (
                    <span key={skill} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Domain Knowledge Strip */}
          <div className="domains-card">
            <div className="domains-header">
              <span className="domains-badge">Domain Experience</span>
              <p>
                Practical enterprise and product exposure across diverse
                verticals:
              </p>
            </div>
            <div className="domain-cloud">
              {domains.map((domain) => (
                <span key={domain} className="domain-pill">
                  ✓ {domain}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PROFESSIONAL EXPERIENCE & LEADERSHIP */}
        <section id="experience" className="experience-section section-anchor">
          <div className="section-heading">
            <p className="eyebrow">Career & Leadership</p>
            <h2>
              Experience delivering
              <br />
              tangible impact.
            </h2>
            <p>
              Over 2 years engineering internal enterprise suites at Infopark
              Kakkanad, plus leading collegiate innovation programs.
            </p>
          </div>

          <div className="experience-grid-layout">
            {/* Work Experience */}
            <div className="work-timeline-card">
              <div className="exp-card-top">
                <span className="timeline-tag">Engineering Roles</span>
                <h3>Professional Experience</h3>
              </div>

              {/* Coolminds Technologies */}
              <div className="timeline-block">
                <div className="timeline-meta">
                  <span className="timeline-period">
                    2 Years Experience · Aug 2024 — Present
                  </span>
                  <span className="employment-badge">Full-time</span>
                </div>
                <h4>Software Engineer (Internal Enterprise Systems)</h4>
                <p className="timeline-company">
                  Coolminds Technologies Pvt. Ltd. · Infopark Kakkanad, Kochi
                </p>

                <ul className="timeline-responsibilities">
                  <li>
                    2 years of professional experience developing and
                    maintaining internal enterprise-grade cross-platform mobile
                    applications in Flutter at Infopark Kakkanad.
                  </li>
                  <li>
                    Built the complete frontend of the company’s internal
                    Payroll Management System from scratch, featuring responsive
                    layouts, reusable widgets, and wage workflow screens.
                  </li>
                  <li>
                    Engineered an internal Time Management System (TMS) with
                    live attendance management, leave tracking hierarchies,
                    employee scheduling, and management dashboards.
                  </li>
                  <li>
                    Contributed to an internal AI-powered Expense Management
                    application with intelligent OCR receipt/invoice processing
                    and automated audit workflows.
                  </li>
                  <li>
                    Integrated Supabase and REST APIs for authentication,
                    real-time data synchronization, and robust client state
                    architecture.
                  </li>
                  <li>
                    Transformed business requirements into pixel-perfect,
                    scalable production mobile applications.
                  </li>
                  <li>
                    Leveraged AI development tools (Antigravity, Stitch) to
                    accelerate internal software delivery.
                  </li>
                </ul>

                <div className="timeline-tech-row">
                  {[
                    "Flutter",
                    "Dart",
                    "Supabase",
                    "REST APIs",
                    "Figma",
                    "Antigravity",
                    "Stitch",
                  ].map((tech) => (
                    <span key={tech} className="mini-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* µLearn Foundation */}
              <div className="timeline-block">
                <div className="timeline-meta">
                  <span className="timeline-period">Jun 2023 — Jul 2024</span>
                  <span className="employment-badge">Internship</span>
                </div>
                <h4>Frontend Developer Intern</h4>
                <p className="timeline-company">µLearn Foundation</p>

                <ul className="timeline-responsibilities">
                  <li>
                    Contributed to the µLearn Dashboard serving over 30,000
                    active users.
                  </li>
                  <li>
                    Worked on the Learning Circle platform under the KKEM and
                    µLearn collaborative initiative.
                  </li>
                  <li>
                    Resolved critical frontend bugs and boosted UX
                    responsiveness across organizational modules.
                  </li>
                </ul>

                <div className="timeline-tech-row">
                  {[
                    "React.js",
                    "JavaScript",
                    "TypeScript",
                    "HTML5",
                    "CSS3",
                  ].map((tech) => (
                    <span key={tech} className="mini-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Leadership & Community Achievements */}
            <div className="leadership-card">
              <div className="exp-card-top">
                <span className="timeline-tag">Community & Impact</span>
                <h3>Leadership & Roles</h3>
              </div>

              <div className="leadership-item">
                <div className="lead-icon">🏆</div>
                <div>
                  <h4>IEDC Technical Lead</h4>
                  <span className="lead-meta">
                    2 Years · Innovation & Entrepreneurship Development Centre
                  </span>
                  <p>
                    Guided student developers, orchestrated technical workshops,
                    organized hackathons, and spearheaded technology innovation
                    projects on campus.
                  </p>
                </div>
              </div>

              <div className="leadership-item">
                <div className="lead-icon">🎭</div>
                <div>
                  <h4>College Arts Club Secretary</h4>
                  <span className="lead-meta">Campus Leadership</span>
                  <p>
                    Led event coordination, stage production logistics,
                    cross-department team management, and large-scale cultural
                    initiatives.
                  </p>
                </div>
              </div>

              <div className="leadership-item">
                <div className="lead-icon">🎓</div>
                <div>
                  <h4>µLearn Campus Executive Committee</h4>
                  <span className="lead-meta">Executive Member</span>
                  <p>
                    Drove peer-to-peer technical learning circles, student
                    upskilling tracks, and community collaborations with
                    industry initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. EDUCATION & ABOUT */}
        <section id="about" className="about-section section-anchor">
          <div className="about-card">
            <p className="eyebrow">Professional Philosophy</p>
            <h2>
              Designed for the work
              <br />
              behind the screen.
            </h2>
            <p>
              Software Engineer with 2 years of experience at Coolminds
              Technologies Pvt. Ltd. (Infopark Kakkanad), developing internal
              enterprise applications in Flutter and modern web apps in Next.js.
              Experienced in enterprise Payroll, Time Management, and AI-powered
              Expense Management systems. Currently pursuing an M.Tech in
              Computer Science & Engineering at KMEA Engineering College.
            </p>

            <div className="specializations-box">
              <span className="spec-label">Primary Specializations</span>
              <div className="spec-cloud">
                {[
                  "Flutter App Development",
                  "Internal Enterprise Suites",
                  "Cross-Platform Mobile",
                  "Frontend Architecture",
                  "Next.js & React.js",
                  "API & Supabase Integration",
                  "State Management",
                  "UI/UX Implementation",
                  "AI & OCR Integration",
                  "AI-Assisted Development",
                  "Workflow Automation",
                ].map((spec) => (
                  <span key={spec} className="spec-pill">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="credentials-card">
            <p className="eyebrow">Academics & Background</p>
            <h2>Education & Languages</h2>

            <div className="academic-item">
              <span className="academic-badge">2025 — Present (Pursuing)</span>
              <h3>M.Tech – Computer Science & Engineering</h3>
              <p className="academic-institution">
                KMEA Engineering College, Edathala, Kochi
              </p>
            </div>

            <div className="academic-item">
              <span className="academic-badge">2020 — 2024 · CGPA 8.58</span>
              <h3>B.Tech – Computer Science & Engineering</h3>
              <p className="academic-institution">
                Sree Narayana Guru Institute of Science and Technology
              </p>
            </div>

            <div className="languages-strip">
              <span className="lang-title">Spoken Languages</span>
              <div className="lang-items">
                <div>
                  <strong>English</strong>
                  <span>Professional Proficiency</span>
                </div>
                <div>
                  <strong>Malayalam</strong>
                  <span>Native Proficiency</span>
                </div>
                <div>
                  <strong>Hindi</strong>
                  <span>Working Proficiency</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CONTACT SECTION */}
        <section id="contact" className="contact-section section-anchor">
          <div className="contact-copy">
            <p className="eyebrow">Start A Conversation</p>
            <h2>
              Have a good problem?
              <br />
              Let’s make it <i>work beautifully.</i>
            </h2>
            <p className="contact-subtext">
              Available for full-time roles, engineering contracts, and
              high-impact software collaborations.
            </p>

            <div className="contact-action-bar">
              <a href="mailto:alankanil1234@gmail.com" className="btn-primary">
                Email Alan Directly <span>↗</span>
              </a>
              <a
                href={`${asset}/Alan_K_Anil_Resume.pdf`}
                download="Alan_K_Anil_Resume.pdf"
                className="btn-download"
              >
                Download Resume (PDF) <span>↓</span>
              </a>
            </div>
          </div>

          <div className="contact-card-box">
            <div className="contact-links">
              <div className="contact-row">
                <span className="contact-label">Email</span>
                <div className="contact-row-right">
                  <a href="mailto:alankanil1234@gmail.com">
                    alankanil1234@gmail.com
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="copy-button"
                    title="Copy email address"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="contact-row">
                <span className="contact-label">Phone</span>
                <a href="tel:+919946892274">
                  +91 9946892274 <span>↗</span>
                </a>
              </div>

              <div className="contact-row">
                <span className="contact-label">Location</span>
                <span>Infopark Kakkanad, Ernakulam, Kerala</span>
              </div>

              <div className="contact-row">
                <span className="contact-label">Company</span>
                <span>Coolminds Technologies Pvt. Ltd.</span>
              </div>

              <div className="contact-row">
                <span className="contact-label">GitHub</span>
                <a
                  href="https://github.com/alan0602"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/alan0602 <span>↗</span>
                </a>
              </div>

              <div className="contact-row">
                <span className="contact-label">LinkedIn</span>
                <a
                  href="https://linkedin.com/in/alan-k-anil060602"
                  target="_blank"
                  rel="noreferrer"
                >
                  alan-k-anil060602 <span>↗</span>
                </a>
              </div>

              <div className="contact-row">
                <span className="contact-label">Portfolio</span>
                <a
                  href="https://alan0602.github.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  alan0602.github.io <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <footer className="footer-bar">
          <p>© 2026 Alan K Anil. Software Engineer · Coolminds Technologies.</p>
          <button onClick={() => scrollTo("home")} className="back-to-top">
            Back to top ↑
          </button>
        </footer>
      </section>

      {/* Project Detail Modal / Case Study Drawer */}
      {selectedProject && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-platform">
                  {selectedProject.platform}
                </span>
                <h3 className="modal-title">
                  {selectedProject.fullName || selectedProject.name}
                </h3>
                <p className="modal-category">{selectedProject.category}</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project modal"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>Overview</h4>
                <p className="modal-description">
                  {selectedProject.description}
                </p>
              </div>

              <div className="modal-section">
                <h4>Key Features & Workflows</h4>
                <div className="modal-features-list">
                  {selectedProject.features.map((feat, idx) => (
                    <div key={idx} className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProject.architectureHighlights && (
                <div className="modal-section">
                  <h4>Architecture Highlights</h4>
                  <div className="modal-arch-list">
                    {selectedProject.architectureHighlights.map((arch, idx) => (
                      <div key={idx} className="arch-item">
                        <span className="arch-dot">◈</span>
                        <span>{arch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-section">
                <h4>Tech Stack</h4>
                <div className="modal-tech-pills">
                  {selectedProject.technologies.map((t) => (
                    <span key={t} className="tech-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer: NO external GitHub project redirects (private codebases) */}
            <div className="modal-footer">
              <div className="modal-footer-note">
                <span className="lock-tag">🔒 Private / Internal Project</span>
              </div>
              <button
                className="btn-modal-close"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
