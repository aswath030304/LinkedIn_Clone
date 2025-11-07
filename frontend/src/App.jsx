import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import ForgotPassword from "./pages/ForgotPassword";
import PostComments from "./pages/PostWithComments";
import SearchPage from "./pages/SearchPage";
import UserProfile from "./pages/UserProfile";
import ScrollToTop from "./components/ScrollToTop";
import { useEffect, useState } from "react";

// ✅ Protected Route Wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// ✅ Dynamic Profile Selector
function DynamicProfile() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  if (!currentUser) return null;

  // If visiting own profile → open editable Profile.jsx
  if (currentUser._id === id) {
    return <Profile />;
  }

  // If visiting someone else’s → open public profile
  return <UserProfile />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <ScrollToTop /> {/* ✅ scrolls to top on every route change */}
      <div className="pt-20 px-4 bg-gray-50 min-h-screen">
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/feed"
            element={
              <PrivateRoute>
                <Feed />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />

          {/* 👤 Your Profile */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* 🧠 Dynamic Public vs Own Profile */}
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <DynamicProfile />
              </PrivateRoute>
            }
          />

          {/* 🔍 Search */}
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchPage />
              </PrivateRoute>
            }
          />

          {/* 💬 Post Comments */}
          <Route
            path="/post/:id"
            element={
              <PrivateRoute>
                <PostComments />
              </PrivateRoute>
            }
          />

          {/* 🚫 Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
