import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [filter, setFilter] = useState("all");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const [postRes, userRes] = await Promise.all([
          axios.get(
            `https://linkedin-clone-4qcp.onrender.com/api/posts/search/${query.replace("#", "")}`
          ),
          axios.get(`https://linkedin-clone-4qcp.onrender.com/api/users/search?name=${query}`),
        ]);

        setPosts(
          postRes.data.map((p) => ({
            ...p,
            showComments: false,
            comments: p.comments || [],
            likes: p.likes || [],
            newComment: "",
            loadingComments: false,
          }))
        );
        setUsers(userRes.data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  //  Like
  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const alreadyLiked = p.likes.some(
          (id) => id.toString() === user._id.toString()
        );
        return {
          ...p,
          likes: alreadyLiked
            ? p.likes.filter((id) => id.toString() !== user._id.toString())
            : [...p.likes, user._id],
        };
      })
    );

    try {
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
      console.error("Error toggling like:", err);
    }
  };

  //comments
  const toggleComments = async (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, showComments: !p.showComments } : p
      )
    );

    const target = posts.find((p) => p._id === postId);
    if (!target || target.showComments) return;

    try {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, loadingComments: true } : p
        )
      );
      const res = await axios.get(`https://linkedin-clone-4qcp.onrender.com/api/posts/${postId}`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: res.data.comments || [], loadingComments: false }
            : p
        )
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  //  Add comment
  const handleAddComment = async (postId) => {
    const target = posts.find((p) => p._id === postId);
    if (!target?.newComment.trim()) return;

    try {
      const res = await axios.post(
        `https://linkedin-clone-4qcp.onrender.com/api/posts/${postId}/comment`,
        { text: target.newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
              ...p,
              comments: [...p.comments, res.data.comment],
              newComment: "",
            }
            : p
        )
      );
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  //  Render Users
  const renderUsers = () =>
    users.map((u, i) => (
      <motion.div
        key={u._id || i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        onClick={() => navigate(`/profile/${u._id}`)}
        className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <img
            src={
              u.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="profile"
            className="w-14 h-14 rounded-full border object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800">{u.name}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
          </div>
        </div>
      </motion.div>
    ));

  //  Render Posts
  const renderPosts = () =>
    posts.map((p, i) => {
      const hasLiked = p.likes.some((id) => id.toString() === user._id.toString());

      return (
        <motion.div
          key={p._id}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >
          {/*  Header */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={
                p.userProfilePic ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="user"
              className="w-10 h-10 rounded-full border object-cover"
            />
            <div>
              <p
                onClick={() => navigate(`/profile/${p.userId?._id || p.userId}`)}
                className="font-semibold text-gray-800 hover:text-primary cursor-pointer"
              >
                {p.userName}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(p.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/*  Content */}
          <p className="text-gray-700 whitespace-pre-wrap mb-2">{p.content}</p>
          {p.image && (
            <img
              src={p.image}
              alt="post"
              className="rounded-lg mt-2 max-h-72 object-cover border"
            />
          )}

          {/*  Like /  Comment */}
          <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
            <button
              onClick={() => handleLike(p._id)}
              className="flex items-center gap-1 hover:text-primary transition"
            >
              <Heart
                size={18}
                className={`${hasLiked ? "fill-primary text-primary" : ""}`}
              />
              <span>{p.likes.length}</span>
            </button>

            <button
              onClick={() => toggleComments(p._id)}
              className="flex items-center gap-1 hover:text-primary transition"
            >
              <MessageCircle size={18} />
              <span>{p.comments.length}</span>
            </button>
          </div>

          {/*  Comments */}
          {p.showComments && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 border-t border-gray-100 pt-3"
            >
              {p.loadingComments ? (
                <p className="text-sm text-gray-400">Loading comments...</p>
              ) : p.comments.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No comments yet. Be the first!
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {p.comments.map((c) => (
                    <div
                      key={c._id}
                      className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100"
                    >
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{c.userName}: </span>
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/*  Add Comment  */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={p.newComment}
                  onChange={(e) =>
                    setPosts((prev) =>
                      prev.map((x) =>
                        x._id === p._id ? { ...x, newComment: e.target.value } : x
                      )
                    )
                  }
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={() => handleAddComment(p._id)}
                  className="bg-primary text-white p-2 rounded-lg hover:bg-accent transition"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      );
    });

  //  Main UI
  return (
    <motion.div
      className="min-h-screen bg-gray-50 pt-8 px-4 flex justify-center"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Search results for “{query}”
        </h2>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {["all", "profiles", "posts"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${filter === f
                  ? "bg-primary text-white"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
                }`}
            >
              {f === "all" ? "All" : f === "profiles" ? "Profiles" : "Posts"}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-500">Loading results...</p>
        ) : posts.length === 0 && users.length === 0 ? (
          <p className="text-gray-500">No results found.</p>
        ) : (
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {filter === "all" && (
              <>
                {users.length > 0 && (
                  <>
                    <h3 className="font-semibold text-gray-700">Profiles</h3>
                    <div className="space-y-3">{renderUsers()}</div>
                  </>
                )}
                {posts.length > 0 && (
                  <>
                    <h3 className="font-semibold text-gray-700 mt-6">Posts</h3>
                    <div className="space-y-3">{renderPosts()}</div>
                  </>
                )}
              </>
            )}
            {filter === "profiles" && (
              <div className="space-y-3">{renderUsers()}</div>
            )}
            {filter === "posts" && <div className="space-y-3">{renderPosts()}</div>}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
