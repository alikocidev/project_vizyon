import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/auth";
import TemporaryPage from "./components/TemporaryPage";
import { ThemeProvider } from "./providers/theme";

// Pages
import "./styles/app.css";
import Home from "./Pages/home";
import Login from "./Pages/auth/login";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <main className="bg-light-primary dark:bg-dark-secondary">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              {/* Temporary routes - will be migrated later */}
              <Route path="/discover" element={<TemporaryPage pageName="Discover" />} />
              <Route path="/movies/theaters" element={<TemporaryPage pageName="Movie Theaters" />} />
              <Route path="/movies/trending" element={<TemporaryPage pageName="Movie Trending" />} />
              <Route path="/movies/popular" element={<TemporaryPage pageName="Movie Popular" />} />
              <Route path="/movies/upcoming" element={<TemporaryPage pageName="Movie Upcoming" />} />
              <Route path="/movies/goat" element={<TemporaryPage pageName="Movie GOAT" />} />
              <Route path="/profile" element={<TemporaryPage pageName="Profile" />} />
              <Route path="/register" element={<TemporaryPage pageName="Register" />} />
              <Route path="/forgot-password" element={<TemporaryPage pageName="Forgot Password" />} />
              <Route path="/reset-password" element={<TemporaryPage pageName="Reset Password" />} />
            </Routes>
          </Router>
        </main>
      </AuthProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
