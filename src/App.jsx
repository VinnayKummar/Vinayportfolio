import { Suspense, lazy } from "react";
import Navbar from "./src/components/Navbar";
import Hero from "./src/components/hero";
import Section from "./src/components/section";
import { trackEvent } from "./analytics";

const HeroBackgroundFX = lazy(() => import("./src/components/HeroBackgroundFX"));

const skills = [
  "Backend Development",
  "Data Structures & Algorithms",
  "Object-Oriented Programming",
  "GenAI Systems",
  "Python, SQL, JavaScript",
  "FastAPI, LangChain, LangGraph",
  "SQLAlchemy, Pydantic",
  "PostgreSQL, MySQL",
  "ChromaDB, Pinecone",
  "Docker, Kubernetes",
  "Git, GitHub, Postman",
  "OpenAI API, REST APIs",
];

const projects = [
  {
    title: "LLM Evaluation Platform: Monitoring Core",
    summary:
      "Tracked prompts, responses, latency, and token usage to make model behavior measurable and production-ready.",
    stack: "FastAPI | SQLAlchemy | PostgreSQL",
  },
  {
    title: "LLM Evaluation Platform: Quality Pipelines",
    summary:
      "Implemented automated evaluation workflows and performance dashboards to continuously monitor model quality.",
    stack: "Python | FastAPI | PostgreSQL",
  },
  {
    title: "LLM Evaluation Platform: API Layer",
    summary:
      "Designed scalable backend APIs that support AI experimentation and observability for iterative model improvements.",
    stack: "FastAPI | Pydantic | REST APIs",
  },
];

const experience = [
  {
    role: "Junior Software Engineer",
    company: "Starlite Infotech",
    period: "2024 - Present",
    detail:
      "Built Python backend services to automate sales workflows, integrated real-time client APIs, developed dynamic contract generation from templates, and improved AI agent accuracy through structured prompt engineering.",
  },
];

const certifications = [
  "GenAI for Beginners - Udemy",
  "REST API (Intermediate) - HackerRank",
  "SQL (Intermediate) - HackerRank",
  "FastAPI Masterclass - Udemy",
  "Docker & Kubernetes for Developers - KodeKloud",
  "LangChain & RAG Systems - DeepLearning.AI",
  "Python Advanced Coding & OOP - HackerRank",
  "AWS Cloud Practitioner - AWS",
];

const education = [
  {
    degree: "MS in Computer Science",
    school: "Quinnipiac University",
    period: "2024 - 2026",
    detail: "GPA: 3.4",
  },
  {
    degree: "BSc in Computer Science",
    school: "Osmania University",
    period: "2020 - 2023",
    detail: "",
  },
];

const contact = {
  email: "Cvinaykumaar@gmail.com",
  github: "https://github.com",
  linkedin: "https://www.linkedin.com",
};

const buildGmailComposeUrl = ({ to, subject = "", body = "" }) => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to,
  });
  if (subject) {
    params.set("su", subject);
  }
  if (body) {
    params.set("body", body);
  }
  return `https://mail.google.com/mail/?${params.toString()}`;
};

export default function App() {
  const handleContactSubmit = (event) => {
    event.preventDefault();
    trackEvent("contact_form_submit");

    const formData = new FormData(event.currentTarget);
    const name = (formData.get("name") || "").toString().trim();
    const senderEmail = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const body = [`Name: ${name}`, `Email: ${senderEmail}`, "", "Message:", message].join("\n");
    const composeUrl = buildGmailComposeUrl({
      to: contact.email,
      subject: "Job Opportunity Inquiry - Software Engineer - Vinay Kumar Chakali",
      body,
    });

    const popup = window.open(composeUrl, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.assign(composeUrl);
    }
  };

  return (
    <div className="site-shell app">
      <div className="global-bg-layer" aria-hidden>
        <Suspense fallback={<div className="hero-fx-canvas" />}>
          <HeroBackgroundFX variant="starfield" />
        </Suspense>
        <div className="global-bg-tint" />
      </div>
      <Navbar />
      <div id="home" />
      <Hero />

      <main className="content-shell">
        <section id="about" className="content-section">
          <Section>
            <header className="section-head">
              <h2 className="section-title heading-font">About Me</h2>
            </header>
            <article className="about-panel">
              <p>
                I am Vinay Kumar Chakali, a Junior Software Engineer and MS in Computer Science
                candidate focused on backend and AI systems. I build production-ready services,
                API-driven workflows, and LLM evaluation pipelines that improve reliability,
                observability, and developer efficiency.
              </p>
            </article>
          </Section>
        </section>

        <section id="expertise" className="content-section">
          <Section>
            <header className="section-head">
              <h2 className="section-title heading-font">Skills</h2>
            </header>
            <div className="expertise-grid">
              {skills.map((item) => (
                <div key={item} className="skill-chip">
                  {item}
                </div>
              ))}
            </div>
          </Section>
        </section>

        <section id="work" className="content-section">
          <Section delay={0.06}>
            <header className="section-head">
              <h2 className="section-title heading-font">Projects</h2>
            </header>
            <p className="section-intro">
              Built for LLM quality, backend scalability, and operational visibility.
            </p>

            <div className="work-grid">
              {projects.map((work) => (
                <article
                  key={work.title}
                  className="work-card magnetic-target"
                  data-magnetic="true"
                >
                  <h3>{work.title}</h3>
                  <p>{work.summary}</p>
                  <span>{work.stack}</span>
                </article>
              ))}
            </div>
          </Section>
        </section>

        <section id="experience" className="content-section">
          <Section delay={0.08}>
            <header className="section-head">
              <h2 className="section-title heading-font">Experience</h2>
            </header>

            <div className="timeline">
              {experience.map((item) => (
                <article key={item.role + item.period} className="timeline-item">
                  <div className="timeline-node" />
                  <div className="timeline-content">
                    <div className="timeline-meta">
                      <h3>
                        {item.role} - {item.company}
                      </h3>
                      <span>{item.period}</span>
                    </div>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        </section>

        <section id="certifications" className="content-section">
          <Section delay={0.09}>
            <header className="section-head">
              <h2 className="section-title heading-font">Certifications</h2>
            </header>
            <div className="expertise-grid">
              {certifications.map((item) => (
                <div key={item} className="skill-chip">
                  {item}
                </div>
              ))}
            </div>
          </Section>
        </section>

        <section id="education" className="content-section">
          <Section delay={0.1}>
            <header className="section-head">
              <h2 className="section-title heading-font">Education</h2>
            </header>

            <div className="timeline">
              {education.map((item) => (
                <article key={item.degree + item.school} className="timeline-item">
                  <div className="timeline-node" />
                  <div className="timeline-content">
                    <div className="timeline-meta">
                      <h3>{item.degree}</h3>
                      <span>{item.period}</span>
                    </div>
                    <p>
                      {item.school}
                      {item.detail ? ` | ${item.detail}` : ""}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        </section>

        <section id="contact" className="content-section pb-24">
          <Section delay={0.12}>
            <header className="section-head">
              <h2 className="section-title heading-font">Let&apos;s Connect</h2>
            </header>
            <p className="section-intro contact-intro">
              I am open to Software Engineer, Backend Engineer, and AI Systems opportunities. If
              you are building scalable backend platforms or LLM-powered products, I would be glad
              to connect.
            </p>

            <div className="contact-layout">
              <form
                className="contact-form"
                onSubmit={handleContactSubmit}
              >
                <label>
                  Name
                  <input type="text" name="name" placeholder="Your name" required />
                </label>
                <label>
                  Email
                  <input type="email" name="email" placeholder="you@example.com" required />
                </label>
                <label>
                  Message
                  <textarea
                    rows={4}
                    name="message"
                    placeholder="Share role, team, or project details"
                    required
                  />
                </label>
                <button type="submit" className="btn-primary magnetic-target" data-magnetic="true">
                  Send Message
                </button>
              </form>

              <div className="contact-links">
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary magnetic-target"
                  data-magnetic="true"
                  onClick={() => trackEvent("contact_link_click", { destination: "github" })}
                >
                  GitHub
                </a>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary magnetic-target"
                  data-magnetic="true"
                  onClick={() => trackEvent("contact_link_click", { destination: "linkedin" })}
                >
                  LinkedIn
                </a>
                <a
                  href={buildGmailComposeUrl({
                    to: contact.email,
                    subject: "Job Opportunity Inquiry - Software Engineer - Vinay Kumar Chakali",
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary magnetic-target"
                  data-magnetic="true"
                  onClick={() => trackEvent("contact_link_click", { destination: "email" })}
                >
                  Email
                </a>
              </div>
            </div>
          </Section>
        </section>
      </main>
    </div>
  );
}
