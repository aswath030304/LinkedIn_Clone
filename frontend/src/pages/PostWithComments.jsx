import { useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/Postcard";

export default function PostWithComments({ post, user }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const toggleComments = async () => {
    if (!showComments) {
      try {
        setLoadingComments(true);
        const res = await axios.get(`https://linkedin-clone-4qcp.onrender.com/api/posts/${post._id}`);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    try {
      const alreadyLiked = likes.some((id) => id.toString() === user._id.toString());

      setLikes(
        alreadyLiked
          ? likes.filter((id) => id.toString() !== user._id.toString())
          : [...likes, user._id]
      );

      const res = await axios.post(
        `https://linkedin-clone-4qcp.onrender.com/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data.likes || []);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `https://linkedin-clone-4qcp.onrender.com/api/posts/${post._id}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, res.data.comment]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const hasLiked = likes.some((id) => id.toString() === user._id.toString());

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
      {/*  Post Header  */}
      <PostCard post={post} />

      {/*  Like &  Comment Buttons */}
      <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-primary transition"
        >
          <Heart
            size={18}
            className={`${hasLiked ? "fill-primary text-primary" : ""}`}
          />
          <span>{likes.length}</span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center gap-1 hover:text-primary transition"
        >
          <MessageCircle size={18} />
          <span>{comments.length}</span>
        </button>
      </div>

      {/*  Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          {loadingComments ? (
            <p className="text-sm text-gray-400">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500">
              No comments yet. Be the first!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {comments.map((c) => (
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

          {/*  Add Comment */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleAddComment}
              className="bg-primary text-white p-2 rounded-lg hover:bg-accent transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
