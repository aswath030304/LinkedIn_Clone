import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const securityQuestions = [
    "What is your favorite childhood nickname?",
    "What is the name of your first pet?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What is your favorite teacher's name?",
  ];


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validatePassword = (password) => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[@$!%*?&]/.test(password),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rules = validatePassword(formData.password);
    const allValid = Object.values(rules).every(Boolean);
    if (!allValid) {
      setMessage({
        text:
          "Password must have 8+ characters, uppercase, lowercase, number, and symbol.",
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      return;
    }

    try {
      await axios.post("https://linkedin-clone-4qcp.onrender.com/api/auth/signup", formData);
      setMessage({
        text: "Signup successful! Redirecting to login...",
        type: "success",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage({
        text: "Signup failed. Email may already exist.",
        type: "error",
      });
    }
  };

  const rules = validatePassword(formData.password);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transition-transform hover:scale-[1.01] duration-200">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text mb-2">
          Join Connectify
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Create your professional profile in seconds.
        </p>

        {message.text && (
          <div
            className={`mb-4 text-center text-sm font-medium ${message.type === "error"
              ? "text-red-600 bg-red-50"
              : "text-green-600 bg-green-50"
              } py-2 rounded`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Password  */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-primary"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password  */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {formData.password && (
            <div className="mt-2 text-xs space-y-1 text-gray-600">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${rules.length ? "text-green-600" : "text-gray-400"
                    }`}
                >
                  {rules.length ? "✅" : "⬜"} At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${rules.upper ? "text-green-600" : "text-gray-400"
                    }`}
                >
                  {rules.upper ? "✅" : "⬜"} Contains uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${rules.lower ? "text-green-600" : "text-gray-400"
                    }`}
                >
                  {rules.lower ? "✅" : "⬜"} Contains lowercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${rules.number ? "text-green-600" : "text-gray-400"
                    }`}
                >
                  {rules.number ? "✅" : "⬜"} Contains number
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${rules.symbol ? "text-green-600" : "text-gray-400"
                    }`}
                >
                  {rules.symbol ? "✅" : "⬜"} Contains special symbol
                </span>
              </div>
            </div>
          )}
          <select
            name="securityQuestion"
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a security question</option>
            {securityQuestions.map((q, i) => (
              <option key={i} value={q}>{q}</option>
            ))}
          </select>

          <input
            type="text"
            name="securityAnswer"
            placeholder="Your Answer"
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />


          <button
            type="submit"
            className="mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
