import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
  });

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const API_BASE = import.meta.env.VITE_API_URL;
      const { data } = await axios.post(`${API_BASE}/api/auth/register`, formData);

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message || "Signup Failed. Try a different email.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-black mb-2 text-gray-900 tracking-tight">
          Create Account
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          Join your team and start managing tasks.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder=""
              required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder=""
              required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              I want to...
            </label>
            <select
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="Member">
                Join as Member ( View & Update Tasks )
              </option>
              <option value="Admin">Join as Admin ( Full Control )</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold mt-8 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          Get Started
        </button>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer font-semibold hover:underline"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
