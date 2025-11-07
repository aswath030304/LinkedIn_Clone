import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-purple-50 to-indigo-100 px-6 overflow-hidden">
      {/*  Hero Section */}
      <motion.div
        className="max-w-3xl text-center mt-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            Connectify
          </span>
        </h1>

        <p className="mt-4 text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
          The next generation professional network — where ideas grow, talent
          connects, and opportunities find you.
        </p>

        {/*  CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/signup"
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-accent hover:shadow-lg transition-all"
          >
            Join Now
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
          >
            Sign In
          </Link>
        </div>
      </motion.div>

      {/*  Designing */}
      <motion.div
        className="mt-14 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/social-network-communication-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--people-community-group-pack-network-illustrations-4533073.png"
          alt="network illustration"
          className="w-[380px] sm:w-[480px] mx-auto drop-shadow-lg"
        />

        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-56 h-5 bg-purple-300 blur-3xl opacity-40"></div>
      </motion.div>

      {/*  Footer Text */}
      <footer className="mt-20 text-gray-500 text-sm text-center mb-6">
        © {new Date().getFullYear()} Connectify — Made for professionals to
        connect, share, and grow together.
      </footer>
    </div>
  );
}
