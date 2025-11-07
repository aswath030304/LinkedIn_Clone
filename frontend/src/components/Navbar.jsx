import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  LogOut,
  UserCircle2,
  Home,
  Search,
  PlusCircle,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const updateUserFromStorage = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", updateUserFromStorage);
    window.addEventListener("profileUpdated", updateUserFromStorage); // custom trigger
    return () => {
      window.removeEventListener("storage", updateUserFromStorage);
      window.removeEventListener("profileUpdated", updateUserFromStorage);
    };
  }, []);


  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (!token || !storedUser) return setUser(null);

      try {
        const res = await fetch("https://linkedin-clone-4qcp.onrender.com/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.valid) setUser(JSON.parse(storedUser));
        else {
          localStorage.clear();
          setUser(null);
        }
      } catch {
        localStorage.clear();
        setUser(null);
      }
    };
    verifyUser();
  }, [location]);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("logout"));
    setUser(null);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all ${scrolled
        ? "bg-white/95 backdrop-blur border-b shadow-sm py-2"
        : "bg-white border-b border-gray-100 py-3"
        }`}
    >
      <div className="flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto">
        {/*  Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text"
        >
          Connectify
        </Link>

        {user && !["/", "/login", "/signup"].includes(location.pathname) ? (
          <>
            {/*  Search */}
            <div className="hidden md:flex flex-1 justify-center">
              <form
                onSubmit={handleSearch}
                className="relative w-2/4 max-w-md flex items-center"
              >
                <Search
                  size={18}
                  className="absolute left-3 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search people, posts or #hashtags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                />
              </form>
            </div>

            {/*  Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
              <Link
                to="/feed"
                className={`flex items-center gap-1 hover:text-primary transition ${location.pathname === "/feed" ? "text-primary font-semibold" : ""
                  }`}
              >
                <Home size={18} /> Feed
              </Link>
              <button
                onClick={() => navigate("/create-post")}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition text-sm"
              >
                <PlusCircle size={18} /> Post
              </button>
              <Link
                to="/profile"
                className={`flex items-center gap-1 hover:text-primary transition ${location.pathname === "/profile"
                  ? "text-primary font-semibold"
                  : ""
                  }`}
              >
                <UserCircle2 size={18} /> Profile
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <img
                    src={
                      user?.profilePic?.startsWith("http")
                        ? user.profilePic
                        : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    onError={(e) =>
                    (e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")
                    }
                    alt="profile"
                    className="w-9 h-9 rounded-full border-2 border-primary hover:scale-105 transition"
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 bg-white rounded-lg shadow-lg border w-52 p-3 text-sm">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/*  Mobile Menu */}
            <button
              className="md:hidden text-gray-700 hover:text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

            {menuOpen && (
              <div className="absolute top-16 left-0 w-full bg-white border-t shadow-lg z-40">
                <div className="flex flex-col gap-3 p-4 text-gray-700 font-medium">
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center bg-gray-50 rounded-lg px-2 border"
                  >
                    <Search size={18} className="text-gray-400 mr-1" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent p-2 focus:outline-none text-sm"
                    />
                  </form>
                  <Link to="/feed">Feed</Link>
                  <Link to="/profile">Profile</Link>
                  <button
                    onClick={() => {
                      navigate("/create-post");
                      setMenuOpen(false);
                    }}
                    className="text-primary font-semibold"
                  >
                    + Create Post
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Logged-out layout */
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-primary rounded-lg text-primary hover:bg-primary hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
