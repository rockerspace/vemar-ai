import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and cleanly handle benign Vite HMR websocket disconnects
if (typeof window !== 'undefined') {
  const isBenign = (r: unknown) => {
    if (!r) return false;
    const str = String(
      (typeof r === 'object' && r !== null && 'message' in r ? (r as { message: string }).message : '') ||
      (typeof r === 'object' && r !== null && 'reason' in r ? (r as { reason: string }).reason : '') ||
      r
    ).toLowerCase();
    return str.includes('websocket') || str.includes('failed to connect') || str.includes('closed without opened');
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reason = event.reason;
      const isWs = typeof WebSocket !== 'undefined' && (reason instanceof WebSocket || (reason && typeof reason === 'object' && 'target' in reason && (reason as { target: unknown }).target instanceof WebSocket));
      if (isWs || isBenign(reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (event) => {
      if (isBenign(event.error) || isBenign(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
