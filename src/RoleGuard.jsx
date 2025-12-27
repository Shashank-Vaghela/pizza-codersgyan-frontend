import { useSelector } from "react-redux";
import NotFound from "./NotFound";

const RoleGuard = ({ requiredRole, children }) => {
  const userData = useSelector((state) => state.user.data);

  if (!userData) {
    return <NotFound />;
  }

  const hasRole = requiredRole.includes(userData.role);

  if (!hasRole) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default RoleGuard;
