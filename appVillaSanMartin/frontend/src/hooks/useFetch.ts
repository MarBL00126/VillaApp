import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    api
      .get<T>(url)
      .then((res) => { if (alive) setData(res.data); })
      .catch(() => { if (alive) setError('No se pudieron cargar los datos. Verificá tu conexión.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [url, revision]);

  const refetch = useCallback(() => setRevision((r) => r + 1), []);

  return { data, loading, error, refetch };
}
