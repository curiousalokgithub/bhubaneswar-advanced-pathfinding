import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/HeaderEnhanced'
import HomePage from './pages/HomePageEnhanced'
import SearchPage from './pages/SearchPage'
import EnhancedSearchPage from './pages/EnhancedSearchPage'
import EnhancedSearchPageBackend from './pages/EnhancedSearchPageBackend'
import AdvancedRoutePlanningPage from './pages/AdvancedRoutePlanningPage'
import CategoryPage from './pages/CategoryPage'
import StorePage from './pages/StorePage'
import AboutPage from './pages/AboutPage'
import SpecialJourneysPage from './pages/SpecialJourneysPage'
import SpecialJourneysPageEnhanced from './pages/SpecialJourneysPageEnhanced'
import NotFoundPage from './pages/NotFoundPage'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/enhanced-search" element={<EnhancedSearchPage />} />
            <Route path="/real-time-search" element={<EnhancedSearchPageBackend />} />
            <Route path="/advanced-routing" element={<AdvancedRoutePlanningPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/store/:id" element={<StorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/special-journeys" element={<SpecialJourneysPageEnhanced />} />
            <Route path="/special-journeys-old" element={<SpecialJourneysPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
