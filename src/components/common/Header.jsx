import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../slice/logout.actions";
import { setUserDetails } from "../../slice/user.slice";
import { useGetProfileQuery } from "../../services/user.service";
import { useGetCartQuery } from "../../services/cart.service";
import { getFromLocalStorage } from "../../utils";
import toast from "react-hot-toast";
import cartIcon from "../../assets/img/cart-icon.svg";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.data);
  const token = getFromLocalStorage("token");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Fetch user profile if token exists but no user data in Redux
  const { data: userData } = useGetProfileQuery(null, {
    skip: !token || !!isAuthenticated,
  });

  // Fetch cart data to get item count
  const { data: cartData } = useGetCartQuery(null, {
    skip: !token,
  });

  // Calculate total cart items
  const cartItemCount = cartData?.data?.items?.length || 0;

  // Update Redux when user data is fetched
  useEffect(() => {
    if (userData && !isAuthenticated) {
      dispatch(setUserDetails({ data: userData.data }));
    }
  }, [userData, isAuthenticated, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
    setShowProfileMenu(false);
    navigate("/");
  };

  const getInitials = () => {
    if (!isAuthenticated) return "";
    const firstName = isAuthenticated.firstName || "";
    const lastName = isAuthenticated.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo with Dropdown */}
          <div className="flex items-center gap-3">
            {/* Red Dot Logo - Clickable - Smaller orange, larger white */}
            <button
              onClick={() => navigate("/")}
              className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </button>

            {/* Pizza Text and Dropdown */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className="text-lg font-bold text-gray-800 hover:text-orange-500 transition-colors"
              >
                pizza
              </button>

              {/* Dropdown */}
              <select className="text-sm text-gray-600 bg-transparent border border-gray-300 rounded px-2 py-1 cursor-pointer hover:border-orange-500 transition-colors outline-none">
                <option>Pizza Corner</option>
                <option>Pasta Corner</option>
                <option>Burger Corner</option>
              </select>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Menu Link */}
            <button
              onClick={() => navigate("/menu")}
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-sm"
            >
              Menu
            </button>

            {/* Orders Link */}
            <button
              onClick={() => navigate("/orders")}
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-sm"
            >
              Orders
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <img src={cartIcon} alt="Cart" className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Profile Icon or Login Button */}
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {getInitials() || (
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {isAuthenticated.firstName} {isAuthenticated.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {isAuthenticated.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-3"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
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
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/orders");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-3"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      My Orders
                    </button>

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-md transition-colors text-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
