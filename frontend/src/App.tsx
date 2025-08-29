import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Providers/Auth";
import TemporaryPage from "./Components/TemporaryPage";

// Pages
import Home from "./Pages/Home";
import { ThemeProvider } from "./Providers/Theme";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <main className="bg-light-primary dark:bg-dark-secondary">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Temporary routes - will be migrated later */}
              <Route path="/discover" element={<TemporaryPage pageName="Discover" />} />
              <Route path="/movies/theaters" element={<TemporaryPage pageName="Movie Theaters" />} />
              <Route path="/movies/trending" element={<TemporaryPage pageName="Movie Trending" />} />
              <Route path="/movies/popular" element={<TemporaryPage pageName="Movie Popular" />} />
              <Route path="/movies/upcoming" element={<TemporaryPage pageName="Movie Upcoming" />} />
              <Route path="/movies/goat" element={<TemporaryPage pageName="Movie GOAT" />} />
              <Route path="/profile" element={<TemporaryPage pageName="Profile" />} />
              <Route path="/login" element={<TemporaryPage pageName="Login" />} />
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

export default App;
