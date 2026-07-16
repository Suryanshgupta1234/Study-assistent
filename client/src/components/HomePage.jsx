export function HomePage({ onNavigate }) {
  const steps = [
    {
      step: "1",
      title: "Paste your notes",
      text: "Drop in lecture notes, a textbook chapter, or just describe a topic.",
    },
    {
      step: "2",
      title: "AI builds your pack",
      text: "The model returns structured JSON — flashcards and quiz questions your app renders.",
    },
    {
      step: "3",
      title: "Study interactively",
      text: "Flip cards, take the quiz, and re-test only the questions you missed.",
    },
  ];

  const features = [
    {
      icon: "🃏",
      title: "Flashcards",
      text: "Flip through cards with keyboard or tap. No chat transcript — real UI.",
    },
    {
      icon: "✅",
      title: "Smart quiz",
      text: "Multiple-choice questions with explanations and a score summary.",
    },
    {
      icon: "🔄",
      title: "Retest wrong answers",
      text: "Focus on what you missed instead of redoing everything.",
    },
    {
      icon: "🛡️",
      title: "Built for bad AI output",
      text: "Malformed JSON, timeouts, and stale responses are handled gracefully.",
    },
  ];

  return (
    <div className="home-page">
      <section className="hero panel">
        <p className="eyebrow">AI-powered study tool</p>
        <h1>Turn messy notes into a study pack you can actually use</h1>
        <p className="lede hero-lede">
          Paste notes or a topic. Get flashcards and a quiz — rendered as
          interactive components, not a chatbot.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate("create")}
          >
            Create study pack
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate("dashboard")}
          >
            Open dashboard
          </button>
        </div>
      </section>

      <section className="steps-section">
        <h2 className="section-title">How it works</h2>
        <div className="steps-grid">
          {steps.map((item) => (
            <article key={item.step} className="step-card panel">
              <span className="step-number">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why this app is different</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card panel">
              <span className="feature-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section panel">
        <h2>Ready to study smarter?</h2>
        <p className="lede">
          Generate your first pack in under a minute. Saved sessions show up on
          your dashboard.
        </p>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => onNavigate("create")}
        >
          Get started — it&apos;s free
        </button>
      </section>
    </div>
  );
}
