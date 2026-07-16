import { useEffect, useMemo, useState } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { Dashboard } from "./components/Dashboard";
import { CreateScreen } from "./components/CreateScreen";
import { FlashcardDeck } from "./components/FlashcardDeck";
import { QuizMode } from "./components/QuizMode";
import {
  StudyOverview,
  getWrongQuestions,
} from "./components/StudyOverview";
import { useStudyGenerator } from "./hooks/useStudyGenerator";
import {
  deleteSession,
  loadSessions,
  saveQuizScore,
  saveSession,
} from "./utils/sessions";
import "./App.css";

function App() {
  const { status, studyPack: generatedPack, error, generate, retry, reset } =
    useStudyGenerator();

  const [page, setPage] = useState("home");
  const [notes, setNotes] = useState("");
  const [activePack, setActivePack] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [studyView, setStudyView] = useState("flashcards");
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (status === "success" && generatedPack) {
      const session = saveSession(notes.trim(), generatedPack);
      setActivePack(generatedPack);
      setActiveSessionId(session.id);
      setStudyView("flashcards");
      setQuizAnswers([]);
      setRefreshKey((k) => k + 1);
      setPage("study");
    }
  }, [status, generatedPack, notes]);

  const wrongQuestions = useMemo(() => {
    if (!activePack) return [];
    return getWrongQuestions(activePack, quizAnswers);
  }, [activePack, quizAnswers]);

  function navigate(nextPage) {
    if (nextPage !== "study") {
      reset();
    }
    setPage(nextPage);
  }

  async function handleGenerate() {
    setActivePack(null);
    setActiveSessionId(null);
    await generate(notes.trim());
  }

  function handleOpenSession(id) {
    const session = loadSessions().find((item) => item.id === id);
    if (!session) return;

    reset();
    setNotes(session.inputNotes);
    setActivePack(session.studyPack);
    setActiveSessionId(session.id);
    setQuizAnswers([]);
    setStudyView("flashcards");
    setPage("study");
  }

  function handleDeleteSession(id) {
    deleteSession(id);
    setRefreshKey((k) => k + 1);
    if (activeSessionId === id) {
      setActivePack(null);
      setActiveSessionId(null);
      setPage("dashboard");
    }
  }

  function handleQuizComplete(answers) {
    setQuizAnswers(answers);
    if (activeSessionId && !answers.every((a) => a.isCorrect === undefined)) {
      const score = answers.filter((a) => a.isCorrect).length;
      saveQuizScore(activeSessionId, score, answers.length);
      setRefreshKey((k) => k + 1);
    }
  }

  function renderContent() {
    if (page === "home") {
      return <HomePage onNavigate={navigate} />;
    }

    if (page === "dashboard") {
      return (
        <Dashboard
          key={refreshKey}
          onOpenSession={handleOpenSession}
          onDeleteSession={handleDeleteSession}
          onNavigate={navigate}
        />
      );
    }

    if (page === "create") {
      return (
        <CreateScreen
          notes={notes}
          onNotesChange={setNotes}
          onGenerate={handleGenerate}
          isLoading={status === "loading"}
          error={error}
          onRetry={retry}
        />
      );
    }

    if (page === "study" && activePack) {
      return (
        <>
          <StudyOverview
            studyPack={activePack}
            view={studyView}
            wrongQuestionsCount={wrongQuestions.length}
            onViewChange={setStudyView}
            onBackToDashboard={() => {
              setPage("dashboard");
              setRefreshKey((k) => k + 1);
            }}
          />

          {studyView === "flashcards" && (
            <FlashcardDeck
              cards={activePack.flashcards}
              onFinish={() => setStudyView("quiz")}
              onBack={() => setStudyView("flashcards")}
            />
          )}

          {studyView === "quiz" && (
            <QuizMode
              questions={activePack.quiz}
              onComplete={handleQuizComplete}
              onBack={() => setStudyView("flashcards")}
            />
          )}

          {studyView === "retest" && (
            <QuizMode
              questions={wrongQuestions}
              retestOnly
              onComplete={(answers) => {
                setQuizAnswers((previous) => {
                  const merged = [...previous];
                  for (const answer of answers) {
                    const idx = merged.findIndex(
                      (item) => item.questionId === answer.questionId
                    );
                    if (idx >= 0) merged[idx] = answer;
                    else merged.push(answer);
                  }
                  return merged;
                });
              }}
              onBack={() => setStudyView("quiz")}
            />
          )}
        </>
      );
    }

    return <HomePage onNavigate={navigate} />;
  }

  return (
    <div className="app-layout">
      <Navbar currentPage={page === "study" ? "dashboard" : page} onNavigate={navigate} />
      <main className="app-shell">{renderContent()}</main>
    </div>
  );
}

export default App;
