import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./providers/Theme";

// Pages
import "./styles/app.css";
import Home from "./pages/home";
import Login from "./pages/auth/Login";
import Profile from "./pages/profile";
import Register from "./pages/auth/Register";
import EmailVerify from "./pages/email/verify";
import NotFound from "./pages/NotFound";

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
              {/* 404 - Catch all unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </main>
      </AuthProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
