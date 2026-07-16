import { getDashboardStats, loadProgress, loadSessions } from "../utils/sessions";

export function Dashboard({ onOpenSession, onDeleteSession, onNavigate }) {
  const sessions = loadSessions();
  const stats = getDashboardStats();
  const progress = loadProgress();

  if (sessions.length === 0) {
    return (
      <section className="panel dashboard-panel">
        <header className="panel-header">
          <p className="eyebrow">Dashboard</p>
          <h1>Your study hub</h1>
          <p className="lede">
            Saved study packs and quiz progress will show up here.
          </p>
        </header>

        <div className="empty-dashboard">
          <span className="empty-icon" aria-hidden="true">
            📋
          </span>
          <h2>No study packs yet</h2>
          <p>Create your first pack from notes or a topic to get started.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate("create")}
          >
            Create study pack
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="panel dashboard-panel">
        <header className="panel-header dashboard-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Welcome back</h1>
            <p className="lede">Pick up where you left off or start something new.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate("create")}
          >
            + New pack
          </button>
        </header>

        <div className="stats-grid dashboard-stats">
          <article className="stat-card">
            <strong>{stats.sessionCount}</strong>
            <span>Saved packs</span>
          </article>
          <article className="stat-card">
            <strong>{stats.totalFlashcards}</strong>
            <span>Flashcards</span>
          </article>
          <article className="stat-card">
            <strong>{stats.totalQuizQuestions}</strong>
            <span>Quiz questions</span>
          </article>
          <article className="stat-card accent">
            <strong>{stats.quizzesCompleted}</strong>
            <span>Quizzes done</span>
          </article>
          {stats.bestScore !== null && (
            <article className="stat-card accent">
              <strong>{stats.bestScore}%</strong>
              <span>Best score</span>
            </article>
          )}
        </div>
      </section>

      <section className="panel">
        <h2 className="section-heading">Your study packs</h2>
        <div className="session-grid">
          {sessions.map((session) => {
            const record = progress[session.id];
            const scoreLabel = record
              ? `${record.score}/${record.total} on last quiz`
              : "Quiz not taken yet";

            return (
              <article key={session.id} className="session-card">
                <div className="session-card-body">
                  <h3>{session.studyPack.title}</h3>
                  {session.studyPack.summary && (
                    <p className="session-summary">{session.studyPack.summary}</p>
                  )}
                  <div className="session-meta">
                    <span>{session.studyPack.flashcards.length} cards</span>
                    <span>{session.studyPack.quiz.length} questions</span>
                    <span>{scoreLabel}</span>
                  </div>
                  <small className="session-date">
                    {new Date(session.createdAt).toLocaleString()}
                  </small>
                </div>
                <div className="session-card-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onOpenSession(session.id)}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => onDeleteSession(session.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
