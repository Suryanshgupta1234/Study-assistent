import { useCallback, useEffect, useRef, useState } from "react";
import { generateStudyPack } from "../api/generateStudyPack";

export function useStudyGenerator() {
  const [status, setStatus] = useState("idle");
  const [studyPack, setStudyPack] = useState(null);
  const [error, setError] = useState(null);
  const lastNotesRef = useRef("");
  const requestIdRef = useRef(0);
  const abortRef = useRef(null);

  const runGenerate = useCallback(async (notes) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const requestId = ++requestIdRef.current;
    lastNotesRef.current = notes;

    setStatus("loading");
    setError(null);

    try {
      const result = await generateStudyPack(notes, controller.signal);

      if (requestId !== requestIdRef.current) return;

      setStudyPack(result);
      setStatus("success");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (requestId !== requestIdRef.current) return;

      const message =
        err instanceof Error ? err.message : "Something went wrong while generating";
      setError(message);
      setStatus("error");
    }
  }, []);

  const generate = useCallback(
    async (notes) => {
      await runGenerate(notes);
    },
    [runGenerate]
  );

  const retry = useCallback(async () => {
    if (!lastNotesRef.current) return;
    await runGenerate(lastNotesRef.current);
  }, [runGenerate]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    requestIdRef.current += 1;
    setStatus("idle");
    setStudyPack(null);
    setError(null);
    lastNotesRef.current = "";
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { status, studyPack, error, generate, retry, reset };
}
