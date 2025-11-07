import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFindQuestion = async () => {
    try {
      const res = await axios.post("https://linkedin-clone-4qcp.onrender.com/api/auth/find-question", { email });
      setQuestion(res.data.question);
      setStep(2);
      setMessage("");
    } catch (err) {
      setMessage("No account found with that email.");
    }
  };
  const handleResetPassword = async () => {
    try {
      await axios.post("https://linkedin-clone-4qcp.onrender.com/api/auth/reset-password", { email, answer, newPassword });
      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Incorrect answer or error resetting password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text mb-6">
          Forgot Password
        </h2>

        {message && (
          <p className={`text-center mb-4 ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded-lg w-full mb-4 focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleFindQuestion}
              className="bg-primary text-white py-3 rounded-lg w-full hover:bg-accent transition"
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-700 text-sm mb-2">Security Question:</p>
            <p className="font-medium mb-4">{question}</p>

            <input
              type="text"
              placeholder="Your Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="p-3 border rounded-lg w-full mb-4 focus:ring-2 focus:ring-primary"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-3 border rounded-lg w-full mb-4 focus:ring-2 focus:ring-primary"
            />

            <button
              onClick={handleResetPassword}
              className="bg-primary text-white py-3 rounded-lg w-full hover:bg-accent transition"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
