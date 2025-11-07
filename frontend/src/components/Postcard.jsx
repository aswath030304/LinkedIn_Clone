import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const renderContentWithHashtags = (text) => {
    if (!text) return "";
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) =>
      part.startsWith("#") ? (
        <span
          key={index}
          onClick={() =>
            navigate(`/search?query=${encodeURIComponent(part.substring(1))}`)
          }
          className="text-primary hover:underline cursor-pointer"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const goToProfile = () => {
    const userId = post.userId?._id || post.userId;
    if (userId) navigate(`/profile/${userId}`);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      {/*  Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          onClick={goToProfile}
          src={
            post.userProfilePic ||
            (post.userName
              ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.userName
              )}`
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")
          }
          alt="user"
          className="w-10 h-10 rounded-full border-2 border-primary object-cover cursor-pointer hover:opacity-80"
        />

        <div>
          <h3
            onClick={goToProfile}
            className="text-sm font-semibold text-gray-800 hover:text-primary cursor-pointer"
          >
            {post.userName || "Unknown User"}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {renderContentWithHashtags(post.content)}
      </p>

      {/*  Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="mt-3 rounded-lg w-full max-h-80 object-cover border border-gray-100"
        />
      )}
    </div>
  );
}
