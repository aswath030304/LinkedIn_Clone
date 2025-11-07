import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Loader2, Smile, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Load loggedin user info
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setMessage("⚠️ Image too large! Max 2MB allowed.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleEmojiClick = (emojiObj) => {
    setContent((prev) => prev + emojiObj.emoji);
    setShowEmojiPicker(false);
  };

  const highlightHashtags = (text) => {
    const regex = /(#\w+)/g;
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-primary font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setMessage("⚠️ Please write something before posting.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      let imageUrl = null;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadRes = await axios.post(
          "https://linkedin-clone-4qcp.onrender.com/api/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadRes.data.url;
      }
      await axios.post(
        "https://linkedin-clone-4qcp.onrender.com/api/posts",
        { content, image: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(" Post created successfully!");
      setTimeout(() => navigate("/feed"), 1000);
    } catch (err) {
      console.error(err);
      setMessage(" Error creating post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-start pt-6 md:pt-8 pb-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 py-6 px-8 w-full max-w-xl transition-all duration-300 hover:shadow-xl">
        {/*  User Info */}
        {user && (
          <div className="flex items-center gap-4 mb-6">
            <img
              src={
                user.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="User"
              className="w-12 h-12 rounded-full border-2 border-primary object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        )}

        {/*  Title */}
        <h2 className="text-xl font-bold text-center text-primary mb-5 tracking-tight">
          Share an Update
        </h2>

        {/*  Message Alert */}
        {message && (
          <div
            className={`mb-5 text-sm px-4 py-2 rounded-lg text-center ${message.includes("❌")
                ? "bg-red-100 text-red-700 border border-red-300"
                : message.includes("⚠️")
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
          >
            {message}
          </div>
        )}

        {/*  Post Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/*  Content  */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to talk about? (Use #hashtags)"
              rows="4"
              className="w-full border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 bottom-3 text-gray-500 hover:text-primary"
            >
              <Smile size={20} />
            </button>
            {showEmojiPicker && (
              <div className="absolute right-0 top-12 z-50 shadow-lg border rounded-xl overflow-hidden bg-white">
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" />
              </div>
            )}
          </div>

          {/*  Hashtag Preview */}
          {content && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800">
              {highlightHashtags(content)}
            </div>
          )}

          {/*  Image Upload */}
          <div className="flex flex-col items-center gap-3">
            {preview && (
              <div className="relative w-full">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-xl object-cover border shadow-sm"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <X size={16} className="text-gray-600" />
                </button>
              </div>
            )}
            <label className="cursor-pointer flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition border border-gray-300 text-sm font-medium text-gray-700">
              <ImagePlus size={18} className="text-primary" />
              {image ? "Change Image" : "Add Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500">Max file size: 2MB</p>
          </div>

          {/*  Post Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-primary text-white py-2.5 rounded-lg hover:bg-accent transition-all font-medium w-full"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
