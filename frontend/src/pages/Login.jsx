import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://linkedin-clone-4qcp.onrender.com/api/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (remember) {
        localStorage.setItem("rememberEmail", formData.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      setMessage({ text: "Login successful! Redirecting...", type: "success" });
      setTimeout(() => navigate("/feed"), 1500);
    } catch (err) {
      setMessage({ text: "Invalid email or password.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transition-transform hover:scale-[1.01] duration-200">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Log in to your Connectify account
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
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
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

          {/* Remember Me Forgot Password */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-primary"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition"
          >
            Login
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="text-sm text-center text-gray-600 mt-5">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
