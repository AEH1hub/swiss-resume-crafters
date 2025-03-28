
import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import './index.css'

// Use lazy loading for App component
const App = lazy(() => import('./App'))

// Render with Suspense for better loading experience
createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
    <App />
  </Suspense>
);
