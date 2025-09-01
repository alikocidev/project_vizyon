import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/Auth";
import TemporaryPage from "./components/TemporaryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./providers/Theme";

// Pages
import "./styles/app.css";
import Home from "./pages/home";
import Login from "./pages/auth/Login";
import Profile from "./pages/profile";
import Register from "./pages/auth/Register";
import EmailVerify from "./pages/email/verify";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <main className="bg-light-primary dark:bg-dark-secondary flex flex-col w-full h-full">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/email/verify" element={<EmailVerify />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
              {/* Temporary routes - will be migrated later */}
              <Route path="/discover" element={<TemporaryPage pageName="Discover" />} />
              <Route path="/movies/theaters" element={<TemporaryPage pageName="Movie Theaters" />} />
              <Route path="/movies/trending" element={<TemporaryPage pageName="Movie Trending" />} />
              <Route path="/movies/popular" element={<TemporaryPage pageName="Movie Popular" />} />
              <Route path="/movies/upcoming" element={<TemporaryPage pageName="Movie Upcoming" />} />
              <Route path="/movies/goat" element={<TemporaryPage pageName="Movie GOAT" />} />
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
