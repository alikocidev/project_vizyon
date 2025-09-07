import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "@/pages/home";
import Login from "@/pages/auth/Login";
import Profile from "@/pages/profile";
import Register from "@/pages/auth/Register";
import EmailVerify from "@/pages/email/verify";
import NotFound from "@/pages/NotFound";
import Movie, { MovieDetails } from "@/pages/movie";
import Discover from "@/pages/discover";
import Favorites from "@/pages/favorites";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email/verify" element={<EmailVerify />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
        <Route path="/movie" element={<Movie />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/discover" element={<Discover />} />
        {/* 404 - Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
