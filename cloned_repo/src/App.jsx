import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { MonsterStoreProvider } from './context/MonsterStoreContext';
import LoadingSkeleton from './components/LoadingSkeleton';

const HomePage = lazy(() => import('./pages/HomePage'));
const MonsterPage = lazy(() => import('./pages/MonsterPage'));

function App() {
  return (
    <LanguageProvider>
      <MonsterStoreProvider>
        <Router basename="/">
          <div className="App">
            <Suspense fallback={<LoadingSkeleton />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/monster/:id" element={<MonsterPage />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </MonsterStoreProvider>
    </LanguageProvider>
  );
}

export default App;
