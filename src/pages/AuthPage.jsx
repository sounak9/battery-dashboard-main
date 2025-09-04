import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    company: "",
    password: "",
    pin: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Require both email and password for login
      if (!form.email || !form.password) {
        setError("Email and password required");
        return;
      }
      // TODO: Call login API with email and password
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } else {
      // Registration: require all fields
      if (
        !form.username ||
        !form.email ||
        !form.company ||
        !form.password ||
        !form.pin
      ) {
        setError("All fields required");
        return;
      }
      // TODO: Call register API
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen bg-[#0f1c3f] text-white">
      {/* Left Section (Brand) */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-[#1a2756]">
        <h1 className="text-4xl font-bold mb-4">Battery Monitoring</h1>
        <p className="text-lg text-gray-300">
          Monitor, Analyze, and Stay in Control
        </p>
      </div>

      {/* Right Section (Form) */}
      <div className="flex w-full md:w-1/2 justify-center items-center">
        <div className="bg-[#1a2756] rounded-2xl shadow-xl p-10 w-96">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {isLogin ? "Login" : "Register"}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isLogin ? (
              <>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg bg-[#0f1c3f] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg bg-[#0f1c3f] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full px-4 py-2 rounded-lg bg-[#0f1c3f] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg bg-[#0f1c3f] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company ID"
                  className="w-full px-4 py-2 rounded-lg bg-[#0f1c3f] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg bg-[#0f1c3f] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="pin"
                  value={form.pin}
                  onChange={handleChange}
                  placeholder="Security Pin"
                  className="w-full px-4 py-2 rounded-lg bg-[#0f1c3f] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
