import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";

const isValidIndianPhone = (val = "") =>
  /^(\+91[-\s]?)?[6-9]\d{9}$/.test(val.trim());

const isValidUrl = (val = "") =>
  /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i.test(
    val.trim()
  );

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);

const DEGREE_OPTIONS = [
  "10th",
  "12th",
  "Diploma",
  "BA",
  "BSc",
  "BCom",
  "BE",
  "BTech",
  "MTech",
  "MBA",
  "PhD",
  "Other",
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editSection, setEditSection] = useState(null);
  const [tempData, setTempData] = useState({});
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await axios.get("https://linkedin-clone-4qcp.onrender.com/api/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
  };

  const handleChange = (e) => {
    setTempData({ ...tempData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateSection = (section, data) => {
    const nextErrors = {};

    if (section === "contact") {
      if (data.phone && !isValidIndianPhone(data.phone)) {
        nextErrors.phone =
          "Enter a valid Indian mobile (optional +91, 10 digits, starts 6–9).";
      }
      if (data.website && !isValidUrl(data.website)) {
        nextErrors.website = "Website must start with http:// or https://";
      }
    }

    if (section === "personal") {
      if (!data.name || !data.name.trim()) {
        nextErrors.name = "Name cannot be empty.";
      }
    }

    if (section === "about") {
      if (data.bio && data.bio.trim().length < 10) {
        nextErrors.bio = "Write a bit more (minimum ~10 characters).";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSection(editSection, tempData)) return;

    const res = await axios.put(
      "https://linkedin-clone-4qcp.onrender.com/api/profile/update",
      tempData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage"));
    }

    await fetchProfile();
    setEditSection(null);
  };

  if (!user)
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-6 md:pt-6 px-4 flex justify-center overflow-x-hidden">
      <div className="w-full max-w-5xl space-y-6 md:space-y-8">
        {/* Personal Info */}
        <Section title="Personal Details">
          {editSection === "personal" ? (
            <EditPersonal
              user={user}
              tempData={tempData}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={() => {
                setEditSection(null);
                setErrors({});
              }}
              token={token}
              errors={errors}
            />
          ) : (
            <DisplayPersonal
              user={user}
              onEdit={() => {
                setEditSection("personal");
                setTempData({ ...user });
                setErrors({});
              }}
            />
          )}
        </Section>

        {/* Contact */}
        <Section title="Contact Information" icon={<PlusCircle />}>
          {editSection === "contact" ? (
            <EditContact
              tempData={tempData}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={() => {
                setEditSection(null);
                setErrors({});
              }}
              errors={errors}
            />
          ) : (
            <DisplayContact
              user={user}
              onEdit={() => {
                setEditSection("contact");
                setTempData({ ...user });
                setErrors({});
              }}
            />
          )}
        </Section>

        {/* About */}
        <Section title="About Me">
          {editSection === "about" ? (
            <EditAbout
              tempData={tempData}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={() => {
                setEditSection(null);
                setErrors({});
              }}
              errors={errors}
            />
          ) : (
            <DisplayAbout
              user={user}
              onEdit={() => {
                setEditSection("about");
                setTempData({ ...user });
                setErrors({});
              }}
            />
          )}
        </Section>

        {/* Education */}
        <Section title="Education">
          <EducationList user={user} refresh={fetchProfile} token={token} />
        </Section>

        {/* Projects */}
        <Section title="Projects">
          <ProjectsList user={user} refresh={fetchProfile} token={token} />
        </Section>

        {/* My Posts */}
        <Section title="My Posts">
          <MyPosts token={token} />
        </Section>

      </div>
    </div>
  );
}

/* -------------------- REUSABLE SECTION CARD -------------------- */
function Section({ title, children }) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-gray-200 p-5 md:p-6 transition-transform hover:scale-[1.01]">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* -------------------- PERSONAL SECTION -------------------- */
const DisplayPersonal = ({ user, onEdit }) => (
  <div className="flex items-center justify-between flex-wrap gap-4">
    <div className="flex items-center gap-5">
      <img
        src={
          user.profilePic ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        }
        alt="profile"
        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary object-cover"
      />
      <div>
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
          {user.name}
        </h3>
        <p className="text-gray-500 text-sm">{user.location || "No location"}</p>
      </div>
    </div>
    <button
      onClick={onEdit}
      className="px-4 md:px-5 py-2 rounded-lg bg-primary text-white hover:bg-accent transition"
    >
      Edit Profile
    </button>
  </div>
);

const EditPersonal = ({ tempData, onChange, onSave, onCancel, token, errors }) => {
  const [preview, setPreview] = useState(tempData.profilePic || "");
  const [suggestions, setSuggestions] = useState([]);
  const [uploading, setUploading] = useState(false);

  const cities = [
    "Chennai, India",
    "Bangalore, India",
    "Hyderabad, India",
    "Mumbai, India",
    "Pune, India",
    "Delhi, India",
    "Kolkata, India",
    "Coimbatore, India",
    "Madurai, India",
    "Trichy, India",
  ];

  const handleLocationChange = (e) => {
    const value = e.target.value;
    onChange(e);
    setSuggestions(
      value
        ? cities.filter((c) => c.toLowerCase().startsWith(value.toLowerCase()))
        : []
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const res = await axios.post("https://linkedin-clone-4qcp.onrender.com/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.url) {
        setPreview(res.data.url);
        onChange({ target: { name: "profilePic", value: res.data.url } });

      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex gap-5 items-center">
        <div className="relative">
          <img
            src={
              preview || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded cursor-pointer hover:bg-accent">
            {uploading ? "Uploading..." : "Change"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <input
              type="text"
              name="name"
              value={tempData.name || ""}
              onChange={onChange}
              placeholder="Full Name"
              className={`border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary outline-none transition ${errors.name ? "border-red-400" : "border-gray-300"
                }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="location"
              value={tempData.location || ""}
              onChange={handleLocationChange}
              placeholder="Location"
              className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary outline-none transition border-gray-300"
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border mt-1 rounded-md shadow-md w-full z-10">
                {suggestions.map((city) => (
                  <li
                    key={city}
                    onClick={() => {
                      onChange({ target: { name: "location", value: city } });
                      setSuggestions([]);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-2">
        <button
          onClick={onSave}
          className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-accent transition"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* -------------------- MY POSTS SECTION -------------------- */
function MyPosts({ token }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ content: "", image: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get("https://linkedin-clone-4qcp.onrender.com/api/posts/my-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`https://linkedin-clone-4qcp.onrender.com/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const startEditing = (post) => {
    setEditingId(post._id);
    setEditData({ content: post.content, image: post.image || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ content: "", image: "" });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const res = await axios.post("https://linkedin-clone-4qcp.onrender.com/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.url) {
        setEditData({ ...editData, image: res.data.url });
      }
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(
        `https://linkedin-clone-4qcp.onrender.com/api/posts/${id}`,
        { content: editData.content, image: editData.image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchMyPosts();
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  if (loading)
    return <p className="text-gray-500 text-sm">Loading your posts...</p>;

  if (!posts.length)
    return <p className="text-gray-500 text-sm">You haven’t posted anything yet.</p>;

  return (
    <div className="space-y-3">
      {posts.map((p) => (
        <div
          key={p._id}
          className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img
                src={
                  p.userProfilePic ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-gray-800">{p.userName || "You"}</p>
                <p className="text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {editingId !== p._id && (
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(p)}
                  className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {editingId === p._id ? (
            <div className="space-y-2">
              <textarea
                name="content"
                value={editData.content}
                onChange={handleEditChange}
                rows="3"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
              {editData.image && (
                <img
                  src={editData.image}
                  alt="preview"
                  className="rounded-lg max-h-60 object-cover mb-2"
                />
              )}
              <label className="text-sm bg-primary text-white px-3 py-1 rounded cursor-pointer hover:bg-accent">
                {uploading ? "Uploading..." : "Change Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => saveEdit(p._id)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-2 whitespace-pre-wrap">{p.content}</p>
              {p.image && (
                <img
                  src={p.image}
                  alt="post"
                  className="rounded-lg max-h-72 object-cover mt-2"
                />
              )}
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <p>❤️ {p.likes?.length || 0} Likes</p>
                <p className="ml-4">💬 {p.comments?.length || 0} Comments</p>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* -------------------- CONTACT SECTION -------------------- */
const DisplayContact = ({ user, onEdit }) => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
      <FieldRow label="Email" value={user.email} />
      <FieldRow label="Phone" value={user.phone || "N/A"} />
      <FieldRow label="Website" value={user.website || "N/A"} />
    </div>
    <button onClick={onEdit} className="mt-3 text-primary hover:underline text-sm">
      Edit
    </button>
  </div>
);

const FieldRow = ({ label, value }) => (
  <p className="flex items-center gap-2">
    <strong className="text-gray-600">{label}:</strong>{" "}
    <span className="text-gray-800">{value}</span>
  </p>
);

const EditContact = ({ tempData, onChange, onSave, onCancel, errors }) => (
  <div className="space-y-3">
    <div>
      <input
        type="text"
        name="phone"
        value={tempData.phone || ""}
        onChange={onChange}
        placeholder="Phone Number (India)"
        className={`border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition ${errors.phone ? "border-red-400" : "border-gray-300"
          }`}
      />
      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
    </div>
    <div>
      <input
        type="text"
        name="website"
        value={tempData.website || ""}
        onChange={onChange}
        placeholder="Website (https://...)"
        className={`border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition ${errors.website ? "border-red-400" : "border-gray-300"
          }`}
      />
      {errors.website && (
        <p className="text-xs text-red-500 mt-1">{errors.website}</p>
      )}
    </div>
    <div className="flex gap-3">
      <button
        onClick={onSave}
        className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-accent transition"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        Cancel
      </button>
    </div>
  </div>
);

/* -------------------- ABOUT SECTION -------------------- */
const DisplayAbout = ({ user, onEdit }) => (
  <div>
    <p className="text-gray-700">{user.bio || "No about section yet."}</p>
    <button onClick={onEdit} className="mt-3 text-primary hover:underline text-sm">
      Edit
    </button>
  </div>
);

const EditAbout = ({ tempData, onChange, onSave, onCancel, errors }) => (
  <div>
    <textarea
      name="bio"
      rows="4"
      value={tempData.bio || ""}
      onChange={onChange}
      placeholder="Write something about yourself..."
      className={`border p-2 w-full rounded-lg mb-1 focus:ring-2 focus:ring-primary transition ${errors.bio ? "border-red-400" : "border-gray-300"
        }`}
    />
    {errors.bio && <p className="text-xs text-red-500 mb-2">{errors.bio}</p>}
    <div className="flex gap-3">
      <button
        onClick={onSave}
        className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-accent transition"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        Cancel
      </button>
    </div>
  </div>
);

/* -------------------- EDUCATION SECTION  -------------------- */
function EducationList({ user, refresh, token }) {
  const [adding, setAdding] = useState(false);
  const [edu, setEdu] = useState({
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
  });
  const [err, setErr] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [editEdu, setEditEdu] = useState({
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
  });
  const [editErr, setEditErr] = useState({});

  const validateEdu = (e, setError) => {
    const next = {};
    if (!e.institution.trim()) next.institution = "Institution is required.";
    if (!e.degree) next.degree = "Select a degree/level.";
    if (!e.startYear) next.startYear = "Select start year.";
    if (!e.endYear) next.endYear = "Select end year.";
    if (e.startYear && e.endYear && Number(e.endYear) < Number(e.startYear)) {
      next.endYear = "End year cannot be before start year.";
    }
    setError(next);
    return Object.keys(next).length === 0;
  };

  const headers = { Authorization: `Bearer ${token}` };

  const handleAdd = async () => {
    if (!validateEdu(edu, setErr)) return;
    await axios.put("https://linkedin-clone-4qcp.onrender.com/api/profile/add-education", edu, {
      headers,
    });
    setEdu({ institution: "", degree: "", field: "", startYear: "", endYear: "" });
    setAdding(false);
    setErr({});
    refresh();
  };

  const beginEdit = (item) => {
    setEditingId(item._id || item.id || null);
    setEditEdu({
      institution: item.institution || "",
      degree: item.degree || "",
      field: item.field || "",
      startYear: String(item.startYear || ""),
      endYear: String(item.endYear || ""),
    });
    setEditErr({});
  };

  const saveEdit = async (originalItem, index) => {
    if (!validateEdu(editEdu, setEditErr)) return;

    const id = originalItem._id || originalItem.id;
    try {
      if (id) {
        await axios.put(
          `https://linkedin-clone-4qcp.onrender.com/api/profile/update-education/${id}`,
          editEdu,
          { headers }
        );
      } else {
        const updated = [...(user.education || [])];
        updated[index] = { ...updated[index], ...editEdu };
        await axios.put(
          "https://linkedin-clone-4qcp.onrender.com/api/profile/update",
          { education: updated },
          { headers }
        );
      }
    } catch (e) {
      const updated = [...(user.education || [])];
      updated[index] = { ...updated[index], ...editEdu };
      await axios.put(
        "https://linkedin-clone-4qcp.onrender.com/api/profile/update",
        { education: updated },
        { headers }
      );
    }

    setEditingId(null);
    setEditErr({});
    refresh();
  };

  const deleteEdu = async (item, index) => {
    const id = item._id || item.id;
    const confirm = window.confirm("Delete this education entry?");
    if (!confirm) return;

    try {
      if (id) {
        await axios.delete(
          `https://linkedin-clone-4qcp.onrender.com/api/profile/delete-education/${id}`,
          { headers }
        );
      } else {
        const updated = [...(user.education || [])];
        updated.splice(index, 1);
        await axios.put(
          "https://linkedin-clone-4qcp.onrender.com/api/profile/update",
          { education: updated },
          { headers }
        );
      }
    } catch (e) {
      // Fallback to array update
      const updated = [...(user.education || [])];
      updated.splice(index, 1);
      await axios.put(
        "https://linkedin-clone-4qcp.onrender.com/api/profile/update",
        { education: updated },
        { headers }
      );
    }

    refresh();
  };

  return (
    <div>
      {user.education?.length ? (
        <ul className="space-y-3">
          {user.education.map((e, i) => {
            const isEditing = (e._id || e.id || null) === editingId;
            return (
              <li
                key={e._id || e.id || i}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Institution"
                      value={editEdu.institution}
                      onChange={(ev) =>
                        setEditEdu({ ...editEdu, institution: ev.target.value })
                      }
                      className={`border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition ${editErr.institution ? "border-red-400" : "border-gray-300"
                        }`}
                    />
                    {editErr.institution && (
                      <p className="text-xs text-red-500">{editErr.institution}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <select
                          value={editEdu.degree}
                          onChange={(ev) =>
                            setEditEdu({ ...editEdu, degree: ev.target.value })
                          }
                          className={`border p-2 w-full rounded-lg bg-white focus:ring-2 focus:ring-primary transition ${editErr.degree ? "border-red-400" : "border-gray-300"
                            }`}
                        >
                          <option value="">Select degree/level</option>
                          {DEGREE_OPTIONS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        {editErr.degree && (
                          <p className="text-xs text-red-500">{editErr.degree}</p>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={editEdu.field}
                        onChange={(ev) =>
                          setEditEdu({ ...editEdu, field: ev.target.value })
                        }
                        className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition border-gray-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <select
                          value={editEdu.startYear}
                          onChange={(ev) =>
                            setEditEdu({ ...editEdu, startYear: ev.target.value })
                          }
                          className={`border p-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-primary transition ${editErr.startYear ? "border-red-400" : "border-gray-300"
                            }`}
                        >
                          <option value="">Start Year</option>
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        {editErr.startYear && (
                          <p className="text-xs text-red-500">
                            {editErr.startYear}
                          </p>
                        )}
                      </div>

                      <div>
                        <select
                          value={editEdu.endYear}
                          onChange={(ev) =>
                            setEditEdu({ ...editEdu, endYear: ev.target.value })
                          }
                          className={`border p-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-primary transition ${editErr.endYear ? "border-red-400" : "border-gray-300"
                            }`}
                        >
                          <option value="">End Year</option>
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        {editErr.endYear && (
                          <p className="text-xs text-red-500">{editErr.endYear}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => saveEdit(e, i)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditErr({});
                        }}
                        className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {e.institution}
                      </p>
                      <p className="text-sm text-gray-600">
                        {e.degree}, {e.field}
                      </p>
                      <p className="text-xs text-gray-400">
                        {e.startYear} - {e.endYear}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => beginEdit(e)}
                        className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEdu(e, i)}
                        className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No education added yet.</p>
      )}

      {adding ? (
        <div className="mt-4 space-y-2">
          <div>
            <input
              type="text"
              name="institution"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => setEdu({ ...edu, institution: e.target.value })}
              className={`border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition ${err.institution ? "border-red-400" : "border-gray-300"
                }`}
            />
            {err.institution && (
              <p className="text-xs text-red-500 mt-1">{err.institution}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <select
                name="degree"
                value={edu.degree}
                onChange={(e) => setEdu({ ...edu, degree: e.target.value })}
                className={`border p-2 w-full rounded-lg bg-white focus:ring-2 focus:ring-primary transition ${err.degree ? "border-red-400" : "border-gray-300"
                  }`}
              >
                <option value="">Select degree/level</option>
                {DEGREE_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {err.degree && <p className="text-xs text-red-500 mt-1">{err.degree}</p>}
            </div>

            <input
              type="text"
              name="field"
              placeholder="Field of Study"
              value={edu.field}
              onChange={(e) => setEdu({ ...edu, field: e.target.value })}
              className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition border-gray-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <select
                name="startYear"
                value={edu.startYear}
                onChange={(e) => setEdu({ ...edu, startYear: e.target.value })}
                className={`border p-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-primary transition ${err.startYear ? "border-red-400" : "border-gray-300"
                  }`}
              >
                <option value="">Start Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {err.startYear && (
                <p className="text-xs text-red-500 mt-1">{err.startYear}</p>
              )}
            </div>

            <div>
              <select
                name="endYear"
                value={edu.endYear}
                onChange={(e) => setEdu({ ...edu, endYear: e.target.value })}
                className={`border p-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-primary transition ${err.endYear ? "border-red-400" : "border-gray-300"
                  }`}
              >
                <option value="">End Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {err.endYear && (
                <p className="text-xs text-red-500 mt-1">{err.endYear}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setErr({});
              }}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-3 text-primary hover:underline text-sm"
        >
          + Add Education
        </button>
      )}
    </div>
  );
}

/* -------------------- PROJECTS SECTION  -------------------- */
function ProjectsList({ user, refresh, token }) {
  const [adding, setAdding] = useState(false);
  const [project, setProject] = useState({ title: "", description: "", link: "" });
  const [err, setErr] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [editProject, setEditProject] = useState({
    title: "",
    description: "",
    link: "",
  });
  const [editErr, setEditErr] = useState({});

  const headers = { Authorization: `Bearer ${token}` };

  const validateProject = (p, setError) => {
    const next = {};
    if (!p.title.trim()) next.title = "Project title is required.";
    if (p.link && !isValidUrl(p.link)) next.link = "Link must start with http(s)://";
    setError(next);
    return Object.keys(next).length === 0;
  };

  const handleAdd = async () => {
    if (!validateProject(project, setErr)) return;
    await axios.put("https://linkedin-clone-4qcp.onrender.com/api/profile/add-project", project, {
      headers,
    });
    setProject({ title: "", description: "", link: "" });
    setAdding(false);
    setErr({});
    refresh();
  };

  const beginEdit = (item) => {
    setEditingId(item._id || item.id || null);
    setEditProject({
      title: item.title || "",
      description: item.description || "",
      link: item.link || "",
    });
    setEditErr({});
  };

  const saveEdit = async (originalItem, index) => {
    if (!validateProject(editProject, setEditErr)) return;

    const id = originalItem._id || originalItem.id;
    try {
      if (id) {
        await axios.put(
          `https://linkedin-clone-4qcp.onrender.com/api/profile/update-project/${id}`,
          editProject,
          { headers }
        );
      } else {
        const updated = [...(user.projects || [])];
        updated[index] = { ...updated[index], ...editProject };
        await axios.put(
          "https://linkedin-clone-4qcp.onrender.com/api/profile/update",
          { projects: updated },
          { headers }
        );
      }
    } catch (e) {
      const updated = [...(user.projects || [])];
      updated[index] = { ...updated[index], ...editProject };
      await axios.put(
        "https://linkedin-clone-4qcp.onrender.com/api/profile/update",
        { projects: updated },
        { headers }
      );
    }

    setEditingId(null);
    setEditErr({});
    refresh();
  };

  const deleteProject = async (item, index) => {
    const id = item._id || item.id;
    const confirm = window.confirm("Delete this project?");
    if (!confirm) return;

    try {
      if (id) {
        await axios.delete(
          `https://linkedin-clone-4qcp.onrender.com/api/profile/delete-project/${id}`,
          { headers }
        );
      } else {
        const updated = [...(user.projects || [])];
        updated.splice(index, 1);
        await axios.put(
          "https://linkedin-clone-4qcp.onrender.com/api/profile/update",
          { projects: updated },
          { headers }
        );
      }
    } catch (e) {
      const updated = [...(user.projects || [])];
      updated.splice(index, 1);
      await axios.put(
        "https://linkedin-clone-4qcp.onrender.com/api/profile/update",
        { projects: updated },
        { headers }
      );
    }

    refresh();
  };

  return (
    <div>
      {user.projects?.length ? (
        <ul className="space-y-3">
          {user.projects.map((p, i) => {
            const isEditing = (p._id || p.id || null) === editingId;
            return (
              <li
                key={p._id || p.id || i}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={editProject.title}
                        onChange={(e) =>
                          setEditProject({ ...editProject, title: e.target.value })
                        }
                        className={`border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition ${editErr.title ? "border-red-400" : "border-gray-300"
                          }`}
                      />
                      {editErr.title && (
                        <p className="text-xs text-red-500 mt-1">{editErr.title}</p>
                      )}
                    </div>

                    <textarea
                      placeholder="Description"
                      value={editProject.description}
                      onChange={(e) =>
                        setEditProject({
                          ...editProject,
                          description: e.target.value,
                        })
                      }
                      className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition border-gray-300"
                    />

                    <div>
                      <input
                        type="text"
                        placeholder="Project Link (https://...)"
                        value={editProject.link}
                        onChange={(e) =>
                          setEditProject({ ...editProject, link: e.target.value })
                        }
                        className={`border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition ${editErr.link ? "border-red-400" : "border-gray-300"
                          }`}
                      />
                      {editErr.link && (
                        <p className="text-xs text-red-500 mt-1">{editErr.link}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => saveEdit(p, i)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditErr({});
                        }}
                        className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-800">{p.title}</p>
                      <p className="text-sm text-gray-600 mb-1">{p.description}</p>
                      {p.link ? (
                        <p className="text-xs text-gray-500 break-all">{p.link}</p>
                      ) : null}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => beginEdit(p)}
                        className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(p, i)}
                        className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No projects added yet.</p>
      )}

      {adding ? (
        <div className="mt-4 space-y-2">
          <div>
            <input
              type="text"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              className={`border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition ${err.title ? "border-red-400" : "border-gray-300"
                }`}
            />
            {err.title && <p className="text-xs text-red-500 mt-1">{err.title}</p>}
          </div>
          <textarea
            placeholder="Description"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
            className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition border-gray-300"
          />
          <div>
            <input
              type="text"
              placeholder="Project Link (https://...)"
              value={project.link}
              onChange={(e) => setProject({ ...project, link: e.target.value })}
              className={`border p-2 w-full rounded-lg focus:ring-2 focus:ring-primary transition ${err.link ? "border-red-400" : "border-gray-300"
                }`}
            />
            {err.link && <p className="text-xs text-red-500 mt-1">{err.link}</p>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setErr({});
              }}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-3 text-primary hover:underline text-sm"
        >
          + Add Project
        </button>
      )}
    </div>
  );
}
