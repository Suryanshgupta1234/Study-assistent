export function CreateScreen({
  notes,
  onNotesChange,
  onGenerate,
  isLoading,
  error,
  onRetry,
}) {
  const trimmedLength = notes.trim().length;
  const canGenerate = trimmedLength >= 10 && !isLoading;

  return (
    <section className="panel input-panel">
      <header className="panel-header">
        <p className="eyebrow">Create</p>
        <h1>Generate a new study pack</h1>
        <p className="lede">
          Paste your notes or describe a topic. The AI returns structured data
          that becomes flashcards and a quiz — not a chat reply.
        </p>
      </header>

      <label className="field-label" htmlFor="notes-input">
        Your notes or topic
      </label>
      <textarea
        id="notes-input"
        className="notes-input"
        placeholder="Example: Explain the key events of the French Revolution, causes, and outcomes..."
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        rows={8}
        disabled={isLoading}
      />
      <p className="helper-text">
        {trimmedLength < 10
          ? `${10 - trimmedLength} more characters needed`
          : "Ready to generate"}
      </p>

      <div className="action-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onGenerate}
          disabled={!canGenerate}
        >
          {isLoading ? "Generating..." : "Generate study pack"}
        </button>
      </div>

      {isLoading && (
        <div className="status-card loading-card" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <div>
            <strong>Building your study pack</strong>
            <p>This usually takes a few seconds. Hang tight.</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="status-card error-card" role="alert">
          <div>
            <strong>Couldn&apos;t generate study pack</strong>
            <p>{error}</p>
          </div>
          <button type="button" className="btn btn-secondary" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}
    </section>
  );
}
