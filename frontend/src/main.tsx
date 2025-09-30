import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Ensure browser tab shows correct title and favicon (handles favicon cache)
try {
  if (typeof document !== 'undefined') {
    document.title = 'Chat2Desk - Mensagens';
    const existing = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    const link = existing ?? document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/webp';
    // Add a cache-busting query to force favicon refresh
    link.href = '/logo-chat2desk.webp?v=2';
    if (!existing) document.head.appendChild(link);
  }
} catch {
  // no-op
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
