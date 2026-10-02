import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// La URL es la clave de caché: componentes distintos que piden la misma URL comparten un único request,
// y al cambiar la URL no se muestran datos de la anterior mientras carga la nueva.
export function useFetch<T>(url: string): FetchResult<T> {
  const query = useQuery<T>({
    queryKey: ['fetch', url],
    queryFn: async () => (await api.get<T>(url)).data,
  });

  const { refetch: queryRefetch } = query;
  const refetch = useCallback(() => {
    void queryRefetch();
  }, [queryRefetch]);

  return {
    data: query.data ?? null,
    loading: query.isPending,
    error: query.isError ? 'No se pudieron cargar los datos. Verificá tu conexión.' : null,
    refetch,
  };
}