import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

const PublicRoute = ({ children }) => {
  const token = getToken();
  const user = getUser();

  const isLoggedIn = token && user;

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
