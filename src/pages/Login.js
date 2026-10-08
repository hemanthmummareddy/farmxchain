import { useState } from "react";
<<<<<<< HEAD
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import { isValidEmail, isStrongPassword } from "../utils/Validators";
=======
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
<<<<<<< HEAD
  const [searchParams] = useSearchParams();

  // Opens in Register mode when the URL is /login?mode=register
  const [mode, setMode] = useState(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
=======

  const [mode, setMode] = useState("login");
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
<<<<<<< HEAD
    name: "",
=======
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
    email: "",
    password: "",
    role: "FARMER",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

<<<<<<< HEAD
  const validateRegister = () => {
    if (!form.name.trim()) return "Please enter your full name";
    if (!isValidEmail(form.email.trim())) return "Please enter a valid email address";
    if (!/^[0-9]{10}$/.test(form.phoneNumber.trim()))
      return "Mobile number must be 10 digits";
    if (!isStrongPassword(form.password))
      return "Password must be at least 8 characters with 1 uppercase letter and 1 number";
    return "";
  };

  const handleSubmit = async () => {
    setError("");

    if (mode === "register") {
      const validationError = validateRegister();
      if (validationError) {
        setError(validationError);
        return;
      }
    } else if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password");
      return;
    }

=======
  const handleSubmit = async () => {
    setError("");
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
    setLoading(true);

    try {
      if (mode === "login") {
        const data = await login(form.email.trim(), form.password);

        const role = data.role;

        if (role === "FARMER") navigate("/farmer/dashboard");
        else if (role === "CUSTOMER") navigate("/customer/dashboard");
        else if (role === "DISTRIBUTOR") navigate("/distributor/dashboard");
        else if (role === "ADMIN") navigate("/admin/dashboard");
        else navigate("/login");
      } else {
        await API.post("/users/register", {
<<<<<<< HEAD
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          phoneNumber: form.phoneNumber.trim(),
        });

        alert("Account created successfully. Please login.");
        setForm((prev) => ({ ...prev, password: "" }));
=======
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          phoneNumber: form.phoneNumber,
        });

        alert("Account created successfully. Please login.");
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
        setMode("login");
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);

<<<<<<< HEAD
      if (!err.response) {
        // No response at all: backend is down or blocked by CORS
        setError("Cannot reach the server. Make sure the backend is running on port 8080.");
      } else if (err.response.status === 401) {
        setError("Invalid email or password");
      } else {
        // Show the real message sent by the backend
        setError(
          err.response.data?.message || "Something went wrong. Please try again."
        );
=======
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Server error. Please try again.");
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
      }
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500";

=======
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT SIDE – FARM IMAGE */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=2000&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-green-900/40"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-extrabold leading-tight">
            Welcome to <br />
            <span className="text-green-300">FarmXChain</span>
          </h1>

          <p className="mt-6 text-lg text-green-100 max-w-md leading-relaxed">
            AI-powered agricultural marketplace connecting farmers,
            distributors, and buyers with transparent pricing and
            secure trade systems.
          </p>

          <div className="mt-10 space-y-3 text-green-200 text-sm">
            <p>✔ AI Price Prediction</p>
            <p>✔ Secure Blockchain Transactions</p>
            <p>✔ Live Market Insights</p>
            <p>✔ Role-Based Dashboards</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE – AUTH PANEL */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              {mode === "login"
                ? "Login to your account"
                : "Create your account"}
            </h2>

            <p className="text-gray-500 mt-2">
              {mode === "login"
                ? "Access your dashboard and manage trades"
                : "Join the smart agricultural marketplace"}
            </p>
          </div>

          {/* TOGGLE */}
          <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setError("");
                  setMode(m);
                }}
                className={`w-1/2 py-3 font-semibold transition-all duration-200 ${
                  mode === m
                    ? "bg-green-600 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">

            {mode === "register" && (
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
<<<<<<< HEAD
                className={inputClass}
=======
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
              >
                <option value="FARMER">🌾 Farmer</option>
                <option value="DISTRIBUTOR">🚚 Distributor</option>
                <option value="CUSTOMER">🛒 Customer</option>
              </select>
            )}

<<<<<<< HEAD
            {mode === "register" && (
              <input
                name="name"
                value={form.name}
                placeholder="Full name"
                onChange={handleChange}
                className={inputClass}
              />
            )}

=======
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="Email address"
              onChange={handleChange}
<<<<<<< HEAD
              className={inputClass}
=======
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
            />

            {mode === "register" && (
              <input
                name="phoneNumber"
                value={form.phoneNumber}
<<<<<<< HEAD
                placeholder="Mobile number (10 digits)"
                onChange={handleChange}
                className={inputClass}
=======
                placeholder="Mobile number"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
              />
            )}

            <input
              name="password"
              type="password"
              value={form.password}
<<<<<<< HEAD
              placeholder={
                mode === "register"
                  ? "Password (8+ chars, 1 uppercase, 1 number)"
                  : "Password"
              }
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className={inputClass}
=======
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-200 disabled:opacity-60 shadow-md"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
