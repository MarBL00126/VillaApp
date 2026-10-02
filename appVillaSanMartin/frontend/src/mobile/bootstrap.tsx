import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import './mobile.css';
import { MobileApp } from './MobileApp';
import { queryClient } from '../services/queryClient';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MobileApp />
    </QueryClientProvider>
  </StrictMode>,
);