/**
 * Single source of truth for every fact this site publishes.
 *
 * Rule for editing this file: each entry must be traceable to a verified
 * source — the resume PDF in /public, a public repository, or a document
 * shipped in /public. Nothing here is estimated, rounded up or inferred.
 * If a claim cannot be traced, it does not belong in this file.
 */

export const profile = {
  name: "Rishikesh Patil",
  title: "Applied AI / GenAI Engineer",
  focus: [
    "RAG",
    "Agent Orchestration",
    "LLM Systems",
    "Multimodal AI",
    "ML Research",
    "Full-Stack Engineering",
  ],
  statement: "I don't just study AI. I build systems with it.",
  summary:
    "Final-year B.Tech student in Electronics & Computer Science building AI, ML and full-stack systems across RAG, agentic workflows, speech emotion recognition and continual learning. Currently an SDE Intern at AyriTech, with research targeting Springer-indexed venues.",
  email: "rishikeshpatil0605@gmail.com",
  github: "https://github.com/Rishi-Is-Cool",
  githubUser: "Rishi-Is-Cool",
  linkedin: "https://www.linkedin.com/in/rishikesh-patil-486194312/",
  resume: "/Rishikesh_Patil_Resume.pdf",
  location: "Mumbai, India",
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://rishikesh-portfolio-2025.vercel.app";

/** Section 8 — proof strip. Verified facts only, no counters. */
export const proof = [
  { label: "Current", value: "SDE Intern", detail: "AyriTech · May 2026 – Present" },
  { label: "CGPA", value: "9.65 / 10", detail: "Top 5 in Department" },
  { label: "Degree", value: "B.Tech ECS", detail: "Final year · VIT Mumbai" },
  { label: "Research", value: "3 papers", detail: "Springer venues · 1 first author" },
  { label: "Leadership", value: "20+ devs", detail: "Technical Head, IEEE VIT" },
] as const;

export type Tier = "flagship" | "research" | "selected" | "earlier";

export type LinkKind = "GitHub" | "Live Demo" | "Case Study" | "Research Paper" | "Document";

export interface ProjectLink {
  kind: LinkKind;
  href: string;
}

export interface System {
  slug: string;
  name: string;
  tier: Tier;
  category: "AI" | "Research" | "Full-Stack";
  year: string;
  status: string;
  summary: string;
  /** Verified architecture stages. Empty when the real architecture is not public. */
  architecture: { id: string; label: string; detail: string }[];
  problem: string;
  build: string;
  decisions: { title: string; body: string }[];
  results: string[];
  tech: string[];
  links: ProjectLink[];
  /** Rendered verbatim where a claim needs a caveat. */
  note?: string;
}

export const systems: System[] = [
  {
    slug: "finguard",
    name: "FinGuard AI",
    tier: "flagship",
    category: "AI",
    year: "2026",
    status: "In progress",
    summary:
      "A multi-agent financial fraud detection system built on LangGraph orchestration and RAG pipelines, served through FastAPI with a React frontend.",
    architecture: [
      {
        id: "orchestration",
        label: "LangGraph orchestration",
        detail: "Multi-agent control flow across the fraud detection workflow.",
      },
      {
        id: "retrieval",
        label: "RAG pipelines",
        detail: "Retrieval over the knowledge the agents reason against.",
      },
      {
        id: "tracing",
        label: "LangSmith tracing",
        detail: "Run-level tracing of agent execution.",
      },
      {
        id: "evaluation",
        label: "RAGAS evaluation",
        detail: "Retrieval and answer quality measured rather than assumed.",
      },
      {
        id: "tuning",
        label: "LoRA / QLoRA fine-tuning",
        detail: "Parameter-efficient adaptation of the underlying model.",
      },
      {
        id: "serving",
        label: "FastAPI + React",
        detail: "Python service layer behind a React interface.",
      },
    ],
    problem:
      "Financial fraud detection is a decision that has to be explainable, not just accurate — a score alone gives an analyst nothing to act on. The system is being built around agents that retrieve, reason and leave a trace of how a decision was reached.",
    build:
      "A multi-agent fraud detection system: LangGraph coordinates the agents, RAG pipelines supply the knowledge they reason over, LangSmith traces the runs, and RAGAS is used to evaluate retrieval quality. LoRA / QLoRA covers parameter-efficient fine-tuning. It is served via FastAPI with a React frontend.",
    decisions: [
      {
        title: "LangGraph over a linear chain",
        body: "Fraud review is not a single pass — it branches, revisits and escalates. A graph makes that control flow explicit instead of hiding it inside prompt text.",
      },
      {
        title: "Evaluation in the loop from the start",
        body: "RAGAS-based evaluation and LangSmith tracing were part of the build rather than an afterthought, so retrieval quality is a measurement and not an impression.",
      },
      {
        title: "Parameter-efficient tuning",
        body: "LoRA / QLoRA keeps adaptation affordable on student-scale hardware without retraining a full model.",
      },
    ],
    results: [],
    tech: [
      "LangGraph",
      "LangChain",
      "RAG",
      "LangSmith",
      "RAGAS",
      "LoRA / QLoRA",
      "FastAPI",
      "React",
    ],
    links: [{ kind: "Case Study", href: "/systems/finguard" }],
    note: "This project is in active development. No performance numbers are published here because none have been finalised, and the repository is not public yet.",
  },
  {
    slug: "ace-ser",
    name: "ACE-SER",
    tier: "research",
    category: "Research",
    year: "2026",
    status: "Submitted as Green SER to SCOPES 2027 · institutional copyright filed",
    summary:
      "Adaptive, Efficient & Explainable Speech Emotion Recognition — a complexity-aware system that routes easy utterances away from the heavy model and reconstructs an audible explanation for its predictions.",
    architecture: [
      {
        id: "asca",
        label: "ASCA",
        detail:
          "Adaptive Speech Complexity Analyzer — assesses how hard an utterance is before committing compute to it.",
      },
      {
        id: "gie",
        label: "GIE",
        detail:
          "Green Inference Engine — the routing layer that decides when the heavy branch is actually needed.",
      },
      {
        id: "asre",
        label: "ASRE",
        detail:
          "Audible Saliency Reconstruction Engine — turns model saliency back into something a listener can hear.",
      },
    ],
    problem:
      "State-of-the-art speech emotion recognition leans on large self-supervised speech models. Running the heavy model on every utterance spends compute on inputs that never needed it, and the resulting prediction is opaque to the person relying on it.",
    build:
      "Three modules: ASCA scores utterance complexity, GIE routes between a lightweight and a heavy path on that score, and ASRE reconstructs an audible explanation of the prediction. Together they make inference complexity-aware and the output explainable.",
    decisions: [
      {
        title: "Route, don't shrink",
        body: "Rather than compressing one model until accuracy drops everywhere, the system spends full capacity only on the utterances that need it.",
      },
      {
        title: "Explanations you can hear",
        body: "Saliency over a spectrogram means little to a non-specialist. ASRE reconstructs it as audio, which is the modality the task is actually about.",
      },
      {
        title: "Faithfulness tested, not asserted",
        body: "Perturbation testing was used to check that the explanations track the model's actual behaviour.",
      },
    ],
    results: [
      "Retained 95.13% of full-HuBERT accuracy",
      "Heavy branch invoked on 52.19% of inputs",
      "Perturbation testing confirmed statistically significant explanation faithfulness (p < 10⁻¹⁰⁰)",
    ],
    tech: ["HuBERT", "PyTorch", "Speech Emotion Recognition", "Explainable AI", "Green AI"],
    links: [{ kind: "Case Study", href: "/systems/ace-ser" }],
    note: "Final-year project. Submitted as Green SER to SCOPES 2027; institutional copyright filed. No public repository — the work is under submission.",
  },
  {
    slug: "faculty-evaluation",
    name: "Faculty Evaluation App",
    tier: "selected",
    category: "Full-Stack",
    year: "Jun – Sep 2025",
    status: "Deployed",
    summary:
      "A web application that digitised faculty feedback for the institute, built under the Principal's mentorship.",
    architecture: [],
    problem:
      "Faculty feedback was a paper process — slow to collect and slower to read anything useful out of.",
    build:
      "A React + Vite frontend over Supabase for the real-time database and auth, with admin dashboards for insights. Deployed on Netlify.",
    decisions: [
      {
        title: "Supabase over a hand-rolled backend",
        body: "Auth, Postgres and realtime in one managed service kept a student-run project deployable and maintainable after handover.",
      },
    ],
    results: [],
    tech: ["React", "Vite", "Supabase", "PostgreSQL", "CSS", "Netlify"],
    links: [
      {
        kind: "GitHub",
        href: "https://github.com/shrutmpatil/V-Recruitment-Interview-Evaluation-App",
      },
    ],
  },
  {
    slug: "smartcafe",
    name: "SmartCafe",
    tier: "selected",
    category: "Full-Stack",
    year: "Dec 2025 – Jan 2026",
    status: "Built during the TCE internship",
    summary:
      "A full-stack cafe management system covering inventory tracking, order processing and analytics dashboards for enterprise workflows.",
    architecture: [],
    problem:
      "An internship brief at Tata Consulting Engineers: model a real business workflow end to end rather than a toy CRUD app.",
    build:
      "React frontend over PostgreSQL, implementing inventory tracking, order processing and analytics dashboards.",
    decisions: [],
    results: [],
    tech: ["React", "PostgreSQL", "SQL"],
    links: [{ kind: "GitHub", href: "https://github.com/Rishi-Is-Cool/Cafe-Management" }],
  },
  {
    slug: "recipeweb",
    name: "RecipeWeb",
    tier: "earlier",
    category: "Full-Stack",
    year: "2025",
    status: "Earlier build",
    summary:
      "A recipe discovery platform with authentication, search and favouriting — an earlier full-stack build.",
    architecture: [],
    problem: "",
    build: "",
    decisions: [],
    results: [],
    tech: ["JavaScript", "PostgreSQL"],
    links: [{ kind: "GitHub", href: "https://github.com/Rishi-Is-Cool/RecipeWeb" }],
  },
];

export interface Research {
  id: string;
  /** Short name used for attribution, e.g. "Research → AR-EWC". */
  short: string;
  title: string;
  role: string;
  venue: string;
  status: string;
  year: string;
  abstract: string;
  findings: string[];
  topics: string[];
  gaps?: string[];
}

export const research: Research[] = [
  {
    id: "ar-ewc",
    short: "AR-EWC",
    title:
      "Adaptive Recursive Elastic Weight Consolidation for Continual Learning in ANFIS-Based Building Energy Prediction",
    role: "First Author",
    venue: "3rd Int'l Conf. on Information Technology & Intelligence (ITI 2026), Springer LNNS",
    status: "Scopus indexed",
    year: "2026",
    abstract:
      "AR-EWC introduces a constant-cost, recursively re-anchored penalty for continual ANFIS updates, so a building energy model can keep learning from new data without the cost of the regularisation term growing with every task it has seen.",
    findings: [
      "Benchmarked against 9 baselines across 5 seeds on BDG2",
      "Placed 3rd on accuracy, within 5.3% of the top result",
      "Ran almost 4× faster than the top methods",
      "Highest seed-stability among the top three methods",
    ],
    topics: ["Continual Learning", "ANFIS", "Elastic Weight Consolidation", "BDG2"],
  },
  {
    id: "ser-survey",
    short: "SER Survey",
    title: "Comprehensive Survey on Speech Emotion Recognition",
    role: "Author",
    venue: "International Journal of Speech Technology (Springer Nature)",
    status: "Under Review",
    year: "2026",
    abstract:
      "A PRISMA-based review of 60 papers spanning traditional ML, deep learning, hybrid and multimodal approaches, and self-supervised speech models, mapping where the field's open problems actually sit.",
    findings: ["PRISMA-based review of 60 papers"],
    topics: [
      "Traditional ML",
      "Deep Learning",
      "Hybrid / Multimodal",
      "Self-Supervised Learning",
      "wav2vec 2.0",
      "HuBERT",
      "WavLM",
    ],
    gaps: ["Cross-corpus generalization", "Explainability", "Green AI deployment"],
  },
  {
    id: "ace-ser-paper",
    short: "ACE-SER",
    title: "ACE-SER: Adaptive, Efficient & Explainable Speech Emotion Recognition",
    role: "Final-Year Project",
    venue: "Submitted as Green SER to SCOPES 2027",
    status: "Under submission · institutional copyright filed",
    year: "2026",
    abstract:
      "Three modules — ASCA, GIE and ASRE — make speech emotion recognition complexity-aware and explainable, retaining 95.13% of full-HuBERT accuracy at 52.19% heavy-branch invocation.",
    findings: [
      "Retained 95.13% of full-HuBERT accuracy at 52.19% heavy-branch invocation",
      "Perturbation testing confirmed statistically significant explanation faithfulness (p < 10⁻¹⁰⁰)",
    ],
    topics: ["Speech Emotion Recognition", "HuBERT", "Green AI", "Explainability"],
  },
];

export interface Role {
  org: string;
  title: string;
  period: string;
  location: string;
  current: boolean;
  points: string[];
  link?: { label: string; href: string };
}

export const experience: Role[] = [
  {
    org: "AyriTech",
    title: "SDE Intern",
    period: "May 2026 – Present",
    location: "Hybrid",
    current: true,
    points: [
      "Contributing to a multi-modal emotional AI agent product within a 20+ engineer cohort.",
      "Building RAG-based conversational memory with LangChain and vector database retrieval.",
      "Async backend routing with FastAPI, WebSockets and Redis session state.",
    ],
  },
  {
    org: "Tata Consulting Engineers Limited (TCE)",
    title: "Software Development Intern",
    period: "Dec 2025 – Jan 2026",
    location: "Mumbai, India",
    current: false,
    points: [
      "Built SmartCafe, a full-stack cafe management system in React and PostgreSQL.",
      "Implemented inventory tracking, order processing and analytics dashboards for enterprise workflows.",
    ],
    link: {
      label: "Completion letter",
      href: "/Rishikesh_Patil_TCE_Internship_Completion_Letter.pdf",
    },
  },
  {
    org: "IEEE Student Branch, Vidyalankar Institute of Technology",
    title: "Technical Head",
    period: "Sep 2025 – Present",
    location: "Mumbai, India",
    current: true,
    points: [
      "Lead 20+ developers; organise technical workshops, hackathons and full-stack/ML mentorship programmes.",
      "Spearheaded migration of the IEEE VIT Mumbai website to React with a Supabase backend.",
      "Drove roughly 35% increase in event engagement through interactive UI, dynamic event pages and Git-based agile collaboration.",
    ],
    link: { label: "ieee.vit.edu.in", href: "https://ieee.vit.edu.in" },
  },
];

export const education = {
  institute: "Vidyalankar Institute of Technology, Mumbai",
  degree: "B.Tech in Electronics and Computer Science (Final Year)",
  period: "Aug 2023 – Present",
  cgpa: "9.65 / 10",
  rank: "Top 5 in Department",
} as const;

export interface StackGroup {
  group: string;
  items: { name: string; usedIn: string[] }[];
}

/**
 * `usedIn` names only projects where the technology is verifiably used, per
 * the resume and the project entries above. An empty array renders no claim.
 */
export const stack: StackGroup[] = [
  {
    group: "AI / GenAI",
    items: [
      { name: "LangChain", usedIn: ["FinGuard AI", "AyriTech"] },
      { name: "LangGraph", usedIn: ["FinGuard AI"] },
      { name: "RAG", usedIn: ["FinGuard AI", "AyriTech"] },
      { name: "Vector Databases", usedIn: ["FinGuard AI", "AyriTech"] },
      { name: "LoRA / QLoRA", usedIn: ["FinGuard AI"] },
      { name: "BERT / Transformers", usedIn: [] },
      { name: "LangSmith", usedIn: ["FinGuard AI"] },
      { name: "RAGAS", usedIn: ["FinGuard AI"] },
    ],
  },
  {
    group: "ML / Research",
    items: [
      { name: "PyTorch", usedIn: ["ACE-SER"] },
      { name: "TensorFlow", usedIn: [] },
      { name: "Scikit-learn", usedIn: [] },
      { name: "wav2vec 2.0", usedIn: ["SER Survey"] },
      { name: "HuBERT", usedIn: ["ACE-SER", "SER Survey"] },
      { name: "ANFIS", usedIn: ["AR-EWC"] },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Python", usedIn: ["FinGuard AI", "ACE-SER", "AR-EWC"] },
      { name: "FastAPI", usedIn: ["FinGuard AI", "AyriTech"] },
      { name: "Flask", usedIn: [] },
      { name: "WebSockets", usedIn: ["AyriTech"] },
      { name: "Redis", usedIn: ["AyriTech"] },
      { name: "REST APIs", usedIn: ["FinGuard AI", "Faculty Evaluation App"] },
    ],
  },
  {
    group: "Frontend",
    items: [
      { name: "React", usedIn: ["FinGuard AI", "SmartCafe", "Faculty Evaluation App"] },
      { name: "Next.js", usedIn: ["This portfolio"] },
      { name: "Vite", usedIn: ["Faculty Evaluation App"] },
      { name: "JavaScript", usedIn: ["RecipeWeb", "SmartCafe"] },
      { name: "HTML / CSS", usedIn: ["Faculty Evaluation App"] },
    ],
  },
  {
    group: "Databases",
    items: [
      { name: "PostgreSQL", usedIn: ["SmartCafe", "Faculty Evaluation App", "RecipeWeb"] },
      { name: "Supabase", usedIn: ["Faculty Evaluation App", "IEEE VIT website"] },
      { name: "SQL", usedIn: ["SmartCafe"] },
    ],
  },
  {
    group: "Tools",
    items: [
      { name: "Git & GitHub", usedIn: [] },
      { name: "Netlify", usedIn: ["Faculty Evaluation App"] },
      { name: "Vercel", usedIn: ["This portfolio"] },
    ],
  },
];

export interface Credential {
  title: string;
  issuer: string;
  detail?: string;
  href?: string;
}

export const credentials: Credential[] = [
  {
    title: "Cloud Computing (Credit Transfer Course)",
    issuer: "C-DAC ACTS, Mumbai",
    detail: "Cloud fundamentals, Linux and virtualization; hands-on cloud deployment workflows.",
    href: "/Rishikesh_Patil_CDAC_Certificate.pdf",
  },
  {
    title: "Software Development Internship",
    issuer: "Tata Consulting Engineers Limited",
    detail: "Completion letter, Dec 2025 – Jan 2026.",
    href: "/Rishikesh_Patil_TCE_Internship_Completion_Letter.pdf",
  },
  {
    title: "AR-EWC — First Author",
    issuer: "ITI 2026, Springer LNNS",
    detail: "Scopus-indexed conference publication.",
  },
  {
    title: "ACE-SER — Institutional copyright filed",
    issuer: "Vidyalankar Institute of Technology",
    detail: "Submitted as Green SER to SCOPES 2027.",
  },
  {
    title: "Technical Head, IEEE Student Branch",
    issuer: "Vidyalankar Institute of Technology",
    detail: "Leading a 20+ developer technical team since Sep 2025.",
  },
  {
    title: "MATLAB Onramp",
    issuer: "MathWorks",
  },
  {
    title: "Control System Design using Simulink",
    issuer: "MathWorks",
  },
  {
    title: "Soft Skills",
    issuer: "TCSion",
  },
];

/** Repositories worth surfacing, in priority order. Anything not here is ignored. */
export const featuredRepos = [
  "FinGuard",
  "Portfolio",
  "rag-ai-engineering-journey",
  "Cafe-Management",
  "RecipeWeb",
  "cpu-scheduling-simulator-web",
  "Multi-Classification-Model-",
] as const;

export const nav = [
  { id: "systems", label: "Systems" },
  { id: "research", label: "Research" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "credentials", label: "Credentials" },
  { id: "resume", label: "Resume" },
] as const;
