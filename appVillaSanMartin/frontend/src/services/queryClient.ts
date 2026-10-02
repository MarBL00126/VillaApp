import { QueryClient } from '@tanstack/react-query';

// Los requests concurrentes a la misma URL se deduplican y el resultado se reutiliza durante staleTime.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});