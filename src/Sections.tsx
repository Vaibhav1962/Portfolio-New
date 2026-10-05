import type { ReactNode } from 'react';
import type { SectionId } from './data';

const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);

const Chip = ({ children }: { children: ReactNode }) => <span className="chip">{children}</span>;

function About() {
  return (
    <>
      <h2 className="h2 glow-cyan">I build the backend that keeps the numbers right.</h2>
      <p className="lead">
        Computer Science student at Jaypee Institute of Information Technology, most recently a backend intern at Drona Infotech, where I shipped billing, auth and HR systems on FastAPI and PostgreSQL. I came up through machine learning — one IEEE publication, a few fine-tuned models — and now spend most of my time on APIs, schemas and access control.
      </p>
      <div className="grid g200">
        <div className="info-card">
          <span className="label cyan">EDUCATION</span>
          <span className="white">B.Tech, Computer Science &amp; Engineering</span>
          <span className="muted small">JIIT Noida · Aug 2023 – May 2027</span>
        </div>
        <div className="info-card">
          <span className="label cyan">CGPA</span>
          <span className="white">7.11 / 10.0</span>
        </div>
      </div>
      <div className="col gap10">
        <span className="label cyan">COURSEWORK</span>
        <div className="wrap gap8 chips">
          {['Data Structures & Algorithms', 'Object-Oriented Programming', 'Operating Systems', 'DBMS', 'Computer Networks', 'Machine Learning'].map(c => <Chip key={c}>{c}</Chip>)}
        </div>
      </div>
    </>
  );
}

interface Project { title: string; date: string; stack: string; bullets: string[]; live?: string; github?: string }

const projects: Project[] = [
  {
    title: 'Academic Digital Twin', date: 'MAY 2026', stack: 'FastAPI · PostgreSQL · Docker · Scikit-Learn',
    bullets: [
      'Three-tier system — Vercel frontend, containerized FastAPI on Render, Supabase PostgreSQL — serving 18 REST endpoints for auth, logging, analytics, simulation and PDF export.',
      'What-if engine rescores performance and stress on any change to study hours, sleep or workload, cutting feedback from weeks to under a second.',
      'Random Forest and clustering models return burnout, performance and goal-alignment predictions in under 1s from 5 daily inputs.',
    ],
    live: 'https://minor2-digital-twin.vercel.app/', github: 'https://github.com/Vaibhav1962/minor2-digital-twin',
  },
  {
    title: 'Soul — Emotion & Mental Health Platform', date: 'FEB 2025', stack: 'PyTorch · Transformers · Docker',
    bullets: [
      'Fine-tuned RoBERTa-base on 43K GoEmotions samples: 93% accuracy across 28 emotion classes, 0.928 F1 on crisis detection.',
      'Model and tokenizer load once at startup instead of per request, cutting latency for concurrent users.',
      'Each emotion maps to a clinical risk level; alerts fire whenever a score crosses threshold — no silent misses.',
    ],
  },
  {
    title: 'Plant Disease Classifier', date: 'JUN 2024', stack: 'TensorFlow · Keras · Docker',
    bullets: [
      '93.9% test accuracy across 38 classes and 14 crops, fine-tuning MobileNetV2 on PlantVillage with selective layer unfreezing.',
      '13 MB model that runs on low-power devices, trained on 224×224 images with rotation, flip and zoom augmentation.',
    ],
    live: 'https://vaibhav-23103370.streamlit.app/', github: 'https://github.com/Vaibhav1962/plant-disease-classifier',
  },
];

function Projects() {
  return (
    <>
      {projects.map(p => (
        <div key={p.title} className="card pink">
          <div className="row-between"><h3 className="h3">{p.title}</h3><span className="muted small">{p.date}</span></div>
          <div className="stack">{p.stack}</div>
          <ul className="bullets">{p.bullets.map(b => <li key={b}>{b}</li>)}</ul>
          {(p.live || p.github) && (
            <div className="links">
              {p.live && <Ext href={p.live}>↗ LIVE</Ext>}
              {p.github && <Ext href={p.github}>↗ GITHUB</Ext>}
            </div>
          )}
        </div>
      ))}
      <div className="card cyan">
        <div className="label cyan">RESEARCH PUBLICATION · IEEE CICN 2024</div>
        <h3 className="h3 plain">Smart Retail: ML for Demand Prediction, Pricing and Inventory Management</h3>
        <ul className="bullets">
          <li>Random Forest pipeline on competitor pricing, customer preference and seasonal features: 8.15% MSE on demand, 1.11% on price across 10 products.</li>
          <li>Presented at the 16th International Conference, Indore; 4 citations, 532 full-text views.</li>
        </ul>
        <div className="links"><Ext href="https://doi.org/10.1109/CICN63059.2024.10847534">↗ DOI 10.1109/CICN63059.2024.10847534</Ext></div>
      </div>
    </>
  );
}

const duties: [string, string][] = [
  ['Billing module.', "Stores each client's agreed fee and recomputes the outstanding balance whenever staff log a payment — a running view of revenue owed vs. collected."],
  ['RBAC on a live HR platform.', 'Role-based access control in FastAPI for 3 user types — bcrypt-hashed passwords, each role bound to a signed JWT.'],
  ['Attendance & client management.', 'Normalized PostgreSQL schema via SQLAlchemy ORM tracking check-ins and each client from onboarding to delivery.'],
  ['Docker.', "Containerized the service and its dependencies so it runs the same on every teammate's machine."],
];

function Experience() {
  return (
    <>
      <div className="row-between end">
        <div className="col gap6">
          <h2 className="h2 exp glow-cyan">Drona Infotech</h2>
          <span className="cyan-text">Software Engineer Intern (Backend) · Noida</span>
        </div>
        <span className="pill">JUN 2026 — JUL 2026</span>
      </div>
      <div className="col gap14">
        {duties.map(([lead, rest], i) => (
          <div key={lead} className="duty">
            <span className="cyan-text">[{String(i + 1).padStart(2, '0')}]</span>
            <span><b>{lead}</b> {rest}</span>
          </div>
        ))}
      </div>
    </>
  );
}

const skills: [string, string][] = [
  ['BACKEND', 'FastAPI · REST API design · JWT auth · RBAC · SQLAlchemy ORM · PostgreSQL · MySQL'],
  ['LANGUAGES', 'Python · C++ · SQL'],
  ['INFRASTRUCTURE & TOOLS', 'Docker · Git · Render · Vercel · Supabase'],
  ['MACHINE LEARNING', 'PyTorch · TensorFlow · Scikit-Learn · Pandas · NumPy'],
];

function Skills() {
  return (
    <>
      <div className="muted prompt">$ cat ./stack.txt</div>
      <div className="grid g240">
        {skills.map(([l, v]) => (
          <div key={l} className="card pink skill">
            <span className="label pink-text">{l}</span>
            <span className="skill-val">{v}</span>
          </div>
        ))}
      </div>
    </>
  );
}

const contacts: [string, string, string, boolean][] = [
  ['EMAIL', 'vaibhav.singh.252005@gmail.com', 'mailto:vaibhav.singh.252005@gmail.com', false],
  ['PHONE', '+91 96547 36687', 'tel:+919654736687', false],
  ['LINKEDIN', 'in/vaibhav252005 ↗', 'https://linkedin.com/in/vaibhav252005', true],
  ['GITHUB', 'Vaibhav1962 ↗', 'https://github.com/Vaibhav1962', true],
  ['LEETCODE', 'user3723OG ↗', 'https://leetcode.com/u/user3723OG/', true],
];

function Contact() {
  return (
    <>
      <h2 className="h2 glow-amber">Open a channel.</h2>
      <div className="col contact-list">
        {contacts.map(([l, v, href, ext]) => (
          <a key={l} href={href} className="contact-row" {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            <span className="amber-text label-sm">{l}</span>{v}
          </a>
        ))}
      </div>
    </>
  );
}

export default function SectionContent({ id }: { id: SectionId }) {
  switch (id) {
    case 'about': return <About />;
    case 'projects': return <Projects />;
    case 'experience': return <Experience />;
    case 'skills': return <Skills />;
    case 'contact': return <Contact />;
  }
}
