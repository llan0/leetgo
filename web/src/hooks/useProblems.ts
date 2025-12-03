import { useState, useEffect } from "react";
import type { Problem } from "../types";
import { API_BASE } from "../utils/api";

interface UseProblemsResult {
  problems: Problem[];
  loading: boolean;
  error: string | null;
}

export function useProblems(): UseProblemsResult {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProblems() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/v1/problems`);
        if (!res.ok) {
          throw new Error(`Failed to load problems (${res.status})`);
        }
        const data = (await res.json()) as Problem[];
        setProblems(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Failed to load problems");
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, []);

  return { problems, loading, error };
}


