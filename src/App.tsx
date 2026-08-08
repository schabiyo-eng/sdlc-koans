import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Opening } from './components/Opening'
import { SdlcMap } from './components/SdlcMap'
import { ProgressProvider } from './lib/ProgressContext'
import { getKoanMeta, KOAN_ORDER } from './koans/registry'

function KoanRoute() {
  const { slug } = useParams()
  const meta = slug ? getKoanMeta(slug) : undefined
  if (!meta || !slug || !KOAN_ORDER.includes(slug)) {
    return <Navigate to="/" replace />
  }
  const Comp = meta.Component
  return <Comp />
}

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

  return (
    <ProgressProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Opening />} />
          <Route path="/map" element={<SdlcMap />} />
          <Route path="/koans/:slug" element={<KoanRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  )
}
