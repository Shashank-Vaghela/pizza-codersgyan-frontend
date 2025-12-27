import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "../../services/auth.service";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedAdmins, setSavedAdmins] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load saved admins from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedAdmins");
    if (saved) {
      try {
        setSavedAdmins(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing saved admins:", error);
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

  const handleEmailSelect = (admin) => {
    setFormData({
      email: admin.email,
      password: admin.password,
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin(formData).unwrap();
      if (response.data.user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        return;
      }

      // Save admin credentials to localStorage
      const saved = localStorage.getItem("savedAdmins");
      let admins = saved ? JSON.parse(saved) : [];

      // Check if admin already exists
      const existingIndex = admins.findIndex((a) => a.email === formData.email);

      if (existingIndex !== -1) {
        // Update existing admin
        admins[existingIndex] = {
          email: formData.email,
          password: formData.password,
        };
      } else {
        // Add new admin
        admins.push({
          email: formData.email,
          password: formData.password,
        });
      }

      // Keep only last 3 admins
      if (admins.length > 3) {
        admins = admins.slice(-3);
      }

      localStorage.setItem("savedAdmins", JSON.stringify(admins));

      toast.success(response.message || "Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo - Outside the box */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
          <span className="text-2xl font-bold text-gray-800 ml-2">PIZZA</span>
        </div>

        {/* White Box */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Sign In Header - Centered */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">Sign in</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <div className="relative">
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() =>
                    savedAdmins.length > 0 && setShowSuggestions(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  placeholder="Email"
                  required
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Email Suggestions Dropdown */}
              {showSuggestions && savedAdmins.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {savedAdmins
                    .filter((admin) =>
                      admin.email
                        .toLowerCase()
                        .includes(formData.email.toLowerCase())
                    )
                    .map((admin, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleEmailSelect(admin)}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors text-sm text-gray-700"
                      >
                        {admin.email}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500 accent-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-red-500 hover:text-red-600"
              >
                Forgot password
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
