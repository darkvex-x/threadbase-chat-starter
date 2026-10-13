import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ThreadsPage from "./pages/ThreadsPage.jsx";

export default function App() {
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/threads" element={<ThreadsPage />} />
        </Routes>
      </main>
    </div>
  );
}
