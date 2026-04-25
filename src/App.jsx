import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MonsterPage from './pages/MonsterPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/monster/:id" element={<MonsterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;