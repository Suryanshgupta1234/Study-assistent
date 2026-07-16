export function StudyOverview({
  studyPack,
  view,
  wrongQuestionsCount,
  onViewChange,
  onBackToDashboard,
}) {
  return (
    <section className="panel overview-panel">
      <header className="panel-header">
        <p className="eyebrow">Study pack ready</p>
        <h1>{studyPack.title}</h1>
        {studyPack.summary && <p className="lede">{studyPack.summary}</p>}
      </header>

      <div className="stats-grid">
        <article className="stat-card">
          <strong>{studyPack.flashcards.length}</strong>
          <span>Flashcards</span>
        </article>
        <article className="stat-card">
          <strong>{studyPack.quiz.length}</strong>
          <span>Quiz questions</span>
        </article>
        {wrongQuestionsCount > 0 && (
          <article className="stat-card accent">
            <strong>{wrongQuestionsCount}</strong>
            <span>To review</span>
          </article>
        )}
      </div>

      <div className="mode-tabs" role="tablist" aria-label="Study modes">
        <button
          type="button"
          role="tab"
          aria-selected={view === "flashcards"}
          className={`mode-tab ${view === "flashcards" ? "active" : ""}`}
          onClick={() => onViewChange("flashcards")}
        >
          Flashcards
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "quiz"}
          className={`mode-tab ${view === "quiz" ? "active" : ""}`}
          onClick={() => onViewChange("quiz")}
        >
          Quiz
        </button>
        {wrongQuestionsCount > 0 && (
          <button
            type="button"
            role="tab"
            aria-selected={view === "retest"}
            className={`mode-tab ${view === "retest" ? "active" : ""}`}
            onClick={() => onViewChange("retest")}
          >
            Retest wrong ({wrongQuestionsCount})
          </button>
        )}
      </div>

      <div className="action-row">
        <button type="button" className="btn btn-ghost" onClick={onBackToDashboard}>
          Back to dashboard
        </button>
      </div>
    </section>
  );
}

export function getWrongQuestions(studyPack, answers) {
  const wrongIds = new Set(
    answers.filter((answer) => !answer.isCorrect).map((answer) => answer.questionId)
  );
  return studyPack.quiz.filter((question) => wrongIds.has(question.id));
}
