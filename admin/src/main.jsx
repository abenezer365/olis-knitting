import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { Suspense, lazy } from 'react'
import Loading from '@/components/Loading'
const App = lazy(() => import('./App'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <App />
    </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
