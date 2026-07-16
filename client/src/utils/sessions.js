const STORAGE_KEY = "study-assistant-sessions";
const PROGRESS_KEY = "study-assistant-progress";

export function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSession(inputNotes, studyPack) {
  const sessions = loadSessions();
  const session = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    inputNotes,
    studyPack,
  };

  const next = [session, ...sessions].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return session;
}

export function deleteSession(id) {
  const next = loadSessions().filter((session) => session.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveQuizScore(sessionId, score, total) {
  const progress = loadProgress();
  progress[sessionId] = {
    score,
    total,
    completedAt: new Date().toISOString(),
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getDashboardStats() {
  const sessions = loadSessions();
  const progress = loadProgress();

  let totalFlashcards = 0;
  let totalQuizQuestions = 0;
  let quizzesCompleted = 0;
  let bestScore = null;

  for (const session of sessions) {
    totalFlashcards += session.studyPack.flashcards.length;
    totalQuizQuestions += session.studyPack.quiz.length;

    const record = progress[session.id];
    if (record) {
      quizzesCompleted += 1;
      const pct = Math.round((record.score / record.total) * 100);
      if (bestScore === null || pct > bestScore) {
        bestScore = pct;
      }
    }
  }

  return {
    sessionCount: sessions.length,
    totalFlashcards,
    totalQuizQuestions,
    quizzesCompleted,
    bestScore,
  };
}
