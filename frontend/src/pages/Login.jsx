import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL.replace(/\/$/, "");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {


      const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      navigate("/dashboard");
    } catch (err) {
      alert(
        "Login Failed: " + (err.response?.data?.message || "Check credentials"),
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-10 bg-white rounded-2xl shadow-xl w-96 border border-gray-200"
      >
        <h2 className="text-3xl font-black mb-6 text-gray-800 tracking-tight">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 mb-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-6 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Sign In
        </button>
        <p className="text-center mt-4 text-sm text-gray-500">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer font-semibold"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
