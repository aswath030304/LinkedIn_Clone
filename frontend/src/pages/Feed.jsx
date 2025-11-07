import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { PlusCircle, Edit2, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostWithComments from "./PostWithComments";
import { motion } from "framer-motion";

export default function Feed() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 4;

  // userData from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await axios.get(`https://linkedin-clone-4qcp.onrender.com/api/posts?page=${pageNum}&limit=${POSTS_PER_PAGE}`);

      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts((prev) => (append ? [...prev, ...sorted] : sorted));

      setHasMore(res.data.length === POSTS_PER_PAGE);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);
  const fetchTrending = async () => {
    try {
      const trendRes = await axios.get("https://linkedin-clone-4qcp.onrender.com/api/posts/trending");
      setTrending(trendRes.data);
    } catch (err) {
      console.error("Error fetching trending topics:", err);
    }
  };

  useEffect(() => {
    fetchPosts(1, false);
    fetchTrending();
  }, [fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight &&
        !loadingMore &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    if (page > 1) fetchPosts(page, true);
  }, [page, fetchPosts]);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://linkedin-clone-4qcp.onrender.com/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="bg-gray-50 pt-6 px-3 md:px-6 flex justify-center min-h-screen"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.15 }}
    >
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6">
        {/* ---------- LEFT SIDEBAR ---------- */}
        <motion.aside
          variants={fadeInUp}
          className="hidden md:flex flex-col w-1/4 gap-4 sticky top-20 self-start h-fit"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-center"
          >
            <img
              src={
                user.profilePic?.startsWith("http")
                  ? user.profilePic
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="user"
              className="w-24 h-24 mx-auto rounded-full border-2 border-primary object-cover mb-3"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
              }}
            />
            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.bio && (
              <p className="text-xs text-gray-600 mt-3 italic border-t pt-2">
                “{user.bio.length > 100
                  ? user.bio.slice(0, 100) + "..."
                  : user.bio}”
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => navigate("/profile")}
                className="flex-1 border border-gray-300 text-sm py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-1"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={() => navigate("/create-post")}
                className="flex-1 bg-primary text-white text-sm py-2 rounded-lg hover:bg-accent transition flex items-center justify-center gap-1"
              >
                <PlusCircle size={14} /> Post
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4"
          >
            <h4 className="font-semibold text-gray-800 mb-3">
              About Connectify
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Connectify helps you grow your network, share insights, and
              collaborate with others.
            </p>
          </motion.div>
        </motion.aside>

        {/* ---------- MAIN FEED ---------- */}
        <motion.main
          variants={fadeInUp}
          className="flex-1 min-h-[calc(100vh-6rem)] pb-10 overflow-y-auto px-1"
        >
          {/* Create Post Box */}
          <motion.div
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-5"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  user.profilePic?.startsWith("http")
                    ? user.profilePic
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="user"
                className="w-11 h-11 rounded-full border object-cover"
              />
              <button
                onClick={() => navigate("/create-post")}
                className="flex-1 text-left text-gray-600 border border-gray-200 rounded-full py-2 px-4 hover:bg-gray-50 transition"
              >
                Start a post...
              </button>
            </div>

            <div className="flex justify-around mt-3 text-sm text-gray-600">
              <button
                onClick={() => navigate("/create-post")}
                className="flex items-center gap-2 hover:text-primary transition"
              >
                <ImageIcon size={16} /> Photo
              </button>
              <button
                onClick={() => navigate("/create-post")}
                className="flex items-center gap-2 hover:text-primary transition"
              >
                ✍️ Write
              </button>
              <button
                onClick={() => navigate("/create-post")}
                className="flex items-center gap-2 hover:text-primary transition"
              >
                💡 Idea
              </button>
            </div>
          </motion.div>

          {/* Feed */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Latest from your network
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>No posts yet. Be the first to share something!</p>
              <button
                onClick={() => navigate("/create-post")}
                className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition"
              >
                Create a Post
              </button>
            </div>
          ) : (
            <>
              <motion.div
                className="flex flex-col gap-5"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {posts.map((p) => (
                  <motion.div key={p._id} variants={fadeInUp}>
                    <PostWithComments post={p} user={user} onLike={handleLike} />
                  </motion.div>
                ))}
              </motion.div>

              {loadingMore && (
                <p className="text-center mt-4 text-gray-500">Loading more...</p>
              )}
            </>
          )}
        </motion.main>

        {/* ---------- RIGHT SIDEBAR ---------- */}
        <motion.aside
          variants={fadeInUp}
          className="hidden lg:flex flex-col w-1/4 gap-4 sticky top-20 self-start h-fit"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5"
          >
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              Trending Topics
            </h3>
            {trending.length > 0 ? (
              <ul className="text-sm text-gray-600 space-y-2">
                {trending.map((tag) => (
                  <li
                    key={tag._id}
                    onClick={() =>
                      navigate(`/search?query=${encodeURIComponent(tag._id)}`)
                    }
                    className="hover:text-primary cursor-pointer transition"
                  >
                    {tag._id}{" "}
                    <span className="text-gray-400 text-xs">
                      ({tag.count} posts)
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No trending topics yet. Start posting to create trends!
              </p>
            )}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5"
          >
            <h4 className="font-semibold text-gray-800 mb-3">
              Community Highlights
            </h4>
            <ul className="text-sm text-gray-600 space-y-3 leading-relaxed">
              <li>
                <strong>Innovation Week:</strong> Discover impactful projects and technical breakthroughs.
              </li>
              <li>
                <strong>Career Insights:</strong> Learn effective strategies for professional growth.
              </li>
              <li>
                <strong>Networking Focus:</strong> Connect with skilled professionals and mentors.
              </li>
            </ul>
          </motion.div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
