import { Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import AssetList from './pages/AssetList.jsx'
import AssetForm from './pages/AssetForm.jsx'
import About from './pages/About.jsx'

export default function App() {
  return (
    <>
      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/" element={<AssetList />} />
          <Route path="/add" element={<AssetForm />} />
          <Route path="/edit/:id" element={<AssetForm />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
