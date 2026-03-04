import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Section from "./components/Section";
import { trackEvent } from "./analytics";
import {
  aboutSummary,
  certificationItems,
  contactCopy,
  contactInfo,
  educationItems,
  experienceItems,
  jobInquirySubject,
  projectItems,
  skillItems,
} from "./data/portfolioData";

const HeroBackgroundFX = lazy(() => import("./components/HeroBackgroundFX"));

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
      to: contactInfo.email,
      subject: jobInquirySubject,
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
              <p>{aboutSummary}</p>
            </article>
          </Section>
        </section>

        <section id="expertise" className="content-section">
          <Section>
            <header className="section-head">
              <h2 className="section-title heading-font">Skills</h2>
            </header>
            <div className="expertise-grid">
              {skillItems.map((item) => (
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
              {projectItems.map((work) => (
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
              {experienceItems.map((item) => (
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
              {certificationItems.map((item) => (
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
              {educationItems.map((item) => (
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
            <p className="section-intro contact-intro">{contactCopy}</p>

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
                  href={contactInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary magnetic-target"
                  data-magnetic="true"
                  onClick={() => trackEvent("contact_link_click", { destination: "github" })}
                >
                  GitHub
                </a>
                <a
                  href={contactInfo.linkedin}
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
                    to: contactInfo.email,
                    subject: jobInquirySubject,
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
