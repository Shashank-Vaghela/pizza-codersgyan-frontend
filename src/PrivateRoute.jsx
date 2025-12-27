import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFromLocalStorage } from "./utils";
import { useGetProfileQuery } from "./services/user.service";
import { logout, setUserDetails } from "./slice/user.slice";
import Loading from "./Loading";

function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = !!useSelector((state) => state.user.data);
  const token = getFromLocalStorage("token");
  const {
    data: userData,
    isLoading,
    isError,
  } = useGetProfileQuery(null, {
    skip: isAuthenticated, // Skip the query if no token is available
  });

  useEffect(() => {
    if (isError) {
      console.warn("Invalid or expired token. Logging out...");
      dispatch(logout());
      navigate("/login");
    }
    if (!isAuthenticated && userData) {
      dispatch(setUserDetails({ data: userData.data }));
    }

    // If no token is found or the user is not authenticated, navigate to login
    if (!token && !isLoading) {
      dispatch(logout());
      navigate("/login");
    }
  }, [
    token,
    userData,
    isAuthenticated,
    isLoading,
    dispatch,
    navigate,
    isError,
  ]);

  // If loading the user profile, you can display a loader or a placeholder
  if (isLoading) {
    return <Loading />;
  }

  // Render the children components if authenticated
  return isAuthenticated ? children : null;
}

export default PrivateRoute;
