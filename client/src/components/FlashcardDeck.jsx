import { useEffect, useState } from "react";

export function FlashcardDeck({ cards, onFinish, onBack }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];
  const isLast = index === cards.length - 1;

  useEffect(() => {
    setFlipped(false);
  }, [index]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "ArrowRight" && !isLast) {
        setIndex((value) => value + 1);
      }
      if (event.key === "ArrowLeft" && index > 0) {
        setIndex((value) => value - 1);
      }
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setFlipped((value) => !value);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, isLast]);

  if (!card) {
    return (
      <section className="panel empty-panel">
        <p>No flashcards available.</p>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
      </section>
    );
  }

  return (
    <section className="panel deck-panel">
      <header className="panel-header compact">
        <p className="eyebrow">Flashcards</p>
        <h2>
          Card {index + 1} of {cards.length}
        </h2>
      </header>

      <button
        type="button"
        className={`flashcard ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
        aria-label={flipped ? "Show question" : "Show answer"}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-front">
            <span className="face-label">Question</span>
            <p>{card.front}</p>
          </div>
          <div className="flashcard-face flashcard-back">
            <span className="face-label">Answer</span>
            <p>{card.back}</p>
          </div>
        </div>
      </button>

      <p className="helper-text keyboard-hint">
        Tap to flip · Arrow keys to navigate · Space to flip
      </p>

      <div className="action-row">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          disabled={index === 0}
        >
          Previous
        </button>
        {!isLast ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIndex((value) => value + 1)}
          >
            Next
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onFinish}>
            Start quiz
          </button>
        )}
      </div>

      <button type="button" className="btn btn-ghost back-link" onClick={onBack}>
        Back to overview
      </button>
    </section>
  );
}
