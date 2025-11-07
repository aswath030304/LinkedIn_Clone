import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Globe,
  Heart,
  MessageCircle,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://linkedin-clone-4qcp.onrender.com/api/users/${id}/public`
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching public profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading profile...
        </div>
      </div>
    );

  if (!data)
    return (
      <p className="text-center pt-24 text-gray-500 text-lg">
        Profile not found or unavailable.
      </p>
    );

  const { user, posts } = data;

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pt-8 pb-12 flex justify-center"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.15 }}
    >
      <div className="w-full max-w-4xl">
        {/*  Profile Header */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
        >
          {/* Cover image */}
          <div className="h-40 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400"></div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Profile Image */}
            <div className="absolute -top-14 left-8">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={
                  user.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="profile"
                className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg"
              />
            </div>

            {/* Name  */}
            <div className="mt-20 ml-40">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-700 mt-1 text-sm">
                {user.bio ||
                  "Software Developer | Open to work | Tech Enthusiast"}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-gray-500 text-sm">
                {user.education?.length > 0 && (
                  <span className="flex items-center gap-1">
                    <GraduationCap size={14} />
                    {user.education[user.education.length - 1]?.institution ||
                      "No institute info"}
                  </span>
                )}
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-indigo-600"
                  >
                    <Globe size={14} /> Contact info
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/*  About Section */}
        {user.bio && (
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{user.bio}</p>
          </motion.div>
        )}

        {/*  Education Section */}
        {user.education?.length > 0 && (
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Education
            </h2>
            <div className="divide-y divide-gray-100">
              {user.education.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="py-3"
                >
                  <p className="font-semibold text-gray-800">
                    {edu.institution}
                  </p>
                  <p className="text-gray-600 text-sm mt-0.5">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {edu.startYear} - {edu.endYear || "Present"}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/*  Projects Section */}
        {user.projects?.length > 0 && (
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Projects
            </h2>
            <div className="grid gap-4">
              {user.projects.map((proj, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-gray-800">{proj.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {proj.description}
                  </p>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 text-sm mt-2 inline-block hover:underline"
                    >
                      🔗 {proj.link}
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Posts Section */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No posts yet.</p>
          ) : (
            <div className="space-y-6">
              {posts.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition"
                >
                  <p className="text-gray-700 leading-relaxed">{p.content}</p>
                  {p.image && (
                    <img
                      src={p.image}
                      alt="post"
                      className="rounded-lg mt-3 max-h-72 w-full object-cover border"
                    />
                  )}
                  <div className="flex gap-5 text-sm text-gray-500 mt-3">
                    <span className="flex items-center gap-1">
                      <Heart size={16} /> {p.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} /> {p.comments?.length || 0}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
