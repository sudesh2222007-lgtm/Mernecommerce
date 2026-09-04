import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SellerRoute = ({ children }) => {
  const { userInfo } = useAuth();

  if (!userInfo) return <Navigate to="/login" replace />;
  if (!userInfo.isSeller && !userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default SellerRoute;
