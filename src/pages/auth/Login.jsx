import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserLoginMutation } from "../../services/auth.service";
import toast from "react-hot-toast";
import heroPizza from "../../assets/img/hero-pizza.png";

const Login = () => {
  const navigate = useNavigate();
  const [userLogin, { isLoading }] = useUserLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load saved users from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedUsers");
    if (saved) {
      try {
        setSavedUsers(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing saved users:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Show suggestions when typing email
    if (name === "email" && value.length > 0) {
      setShowSuggestions(true);
    } else if (name === "email" && value.length === 0) {
      setShowSuggestions(false);
    }
  };

  const handleEmailSelect = (user) => {
    setFormData({
      email: user.email,
      password: user.password,
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userLogin(formData).unwrap();
      
      // Save user credentials to localStorage
      const saved = localStorage.getItem("savedUsers");
      let users = saved ? JSON.parse(saved) : [];
      
      // Check if user already exists
      const existingIndex = users.findIndex((u) => u.email === formData.email);
      
      if (existingIndex !== -1) {
        // Update existing user
        users[existingIndex] = {
          email: formData.email,
          password: formData.password,
        };
      } else {
        // Add new user
        users.push({
          email: formData.email,
          password: formData.password,
        });
      }
      
      // Keep only last 5 users
      if (users.length > 5) {
        users = users.slice(-5);
      }
      
      localStorage.setItem("savedUsers", JSON.stringify(users));
      
      toast.success(response.message || "Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="fixed inset-0 top-[72px] bg-[#FAF7F2] flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-[#FAF7F2] flex items-center justify-center p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
          <p className="text-gray-600 mb-8">
            Enter your email below to login to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => savedUsers.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="m@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                autoComplete="off"
              />
              
              {/* Email Suggestions Dropdown */}
              {showSuggestions && savedUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {savedUsers
                    .filter((user) =>
                      user.email.toLowerCase().includes(formData.email.toLowerCase())
                    )
                    .map((user, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleEmailSelect(user)}
                        className="w-full text-left px-4 py-2 hover:bg-orange-50 transition-colors text-sm text-gray-700"
                      >
                        {user.email}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/2 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <img
          src={heroPizza}
          alt="Delicious Pizza"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
