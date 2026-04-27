import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import LoadingSkeleton from './components/LoadingSkeleton';

const HomePage = lazy(() => import('./pages/HomePage'));
const MonsterPage = lazy(() => import('./pages/MonsterPage'));

function App() {
  return (
    <LanguageProvider>
      <Router basename="/Monster-Book">
        <div className="App">
          <Suspense fallback={<LoadingSkeleton />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/monster/:id" element={<MonsterPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
