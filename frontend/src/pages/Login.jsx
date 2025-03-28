import React, { useState } from "react";
import { Lock, User, Shield } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");

  const generateCaptcha = () => {
    // Simple captcha generation logic
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const [currentCaptcha, setCurrentCaptcha] = useState(generateCaptcha());

  const handleLogin = (e) => {
    e.preventDefault();
    // Login logic will be implemented later
    console.log("Login attempted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-md">
        <div className="bg-blue-600 text-white p-6 text-center">
          <h2 className="text-3xl font-bold">Bank Financial Services</h2>
          <p className="text-blue-100">Secure Login Portal</p>
        </div>
        <form onSubmit={handleLogin} className="p-8 space-y-6 text-black">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-2 rounded-lg font-bold text-xl tracking-widest select-none">
              {currentCaptcha}
            </div>
            <input
              type="text"
              placeholder="Enter Captcha"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              className="flex-grow pl-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              required
            />
            <Shield className="text-blue-500" />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-bold"
          >
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
