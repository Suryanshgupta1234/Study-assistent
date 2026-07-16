import { useMemo, useState } from "react";

export function QuizMode({
  questions,
  retestOnly = false,
  onComplete,
  onBack,
}) {
  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const progress = `${index + 1} / ${questions.length}`;

  const score = useMemo(
    () => answers.filter((answer) => answer.isCorrect).length,
    [answers]
  );

  if (questions.length === 0) {
    return (
      <section className="panel empty-panel">
        <p>No quiz questions available.</p>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
      </section>
    );
  }

  function handleSubmit() {
    if (!question || selectedIndex === null) return;

    const nextAnswer = {
      questionId: question.id,
      selectedIndex,
      isCorrect: selectedIndex === question.correctIndex,
    };

    const nextAnswers = [...answers, nextAnswer];
    setAnswers(nextAnswers);

    if (index === questions.length - 1) {
      setFinished(true);
      onComplete(nextAnswers);
      return;
    }

    setIndex((value) => value + 1);
    setSelectedIndex(null);
  }

  if (finished) {
    const wrongCount = answers.length - score;

    return (
      <section className="panel quiz-panel">
        <header className="panel-header compact">
          <p className="eyebrow">{retestOnly ? "Retest results" : "Quiz results"}</p>
          <h2>
            You scored {score} / {questions.length}
          </h2>
        </header>

        <div className="results-summary">
          <p>
            {score === questions.length
              ? "Perfect score — great work!"
              : wrongCount === 1
                ? "One question to review."
                : `${wrongCount} questions to review.`}
          </p>
        </div>

        <ul className="review-list">
          {questions.map((item, questionIndex) => {
            const answer = answers[questionIndex];
            const isCorrect = answer?.isCorrect;

            return (
              <li
                key={item.id}
                className={`review-item ${isCorrect ? "correct" : "incorrect"}`}
              >
                <strong>{item.question}</strong>
                <p>Your answer: {item.options[answer?.selectedIndex ?? 0]}</p>
                {!isCorrect && (
                  <p>Correct answer: {item.options[item.correctIndex]}</p>
                )}
                {item.explanation && (
                  <p className="explanation">{item.explanation}</p>
                )}
              </li>
            );
          })}
        </ul>

        <div className="action-row">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back to overview
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="panel quiz-panel">
      <header className="panel-header compact">
        <p className="eyebrow">{retestOnly ? "Retest wrong answers" : "Quiz"}</p>
        <h2>{progress}</h2>
      </header>

      <p className="quiz-question">{question.question}</p>

      <div className="options-grid" role="radiogroup" aria-label="Answer options">
        {question.options.map((option, optionIndex) => (
          <label key={option} className="option-label">
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={selectedIndex === optionIndex}
              onChange={() => setSelectedIndex(optionIndex)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className="action-row">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={selectedIndex === null}
        >
          {index === questions.length - 1 ? "Finish quiz" : "Next question"}
        </button>
      </div>
    </section>
  );
}
