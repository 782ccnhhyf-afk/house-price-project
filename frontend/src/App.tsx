import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">⌂</span>
          <span>HousePrice AI</span>
        </div>
        <span className="status-pill">ML Prediction</span>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      <footer className="footer">
        House Price Prediction · React + FastAPI + scikit-learn
      </footer>
    </div>
  );
}

export default App;
