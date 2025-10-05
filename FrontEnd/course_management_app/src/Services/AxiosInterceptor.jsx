import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";

function AxiosInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data: message } = error.response;

          if (status === 401 && message === "JWT_EXPIRED") {
            toast.error("Session expired. Please login again.");
            sessionStorage.removeItem("auth");
            navigate("/"); //  back to login
          } else if (status === 403 && message === "UNAUTHORIZED_ACCESS") {
            toast.error("Access Denied - You don’t have permission.");
            navigate("/unauthorized");
          }
        }
        return Promise.reject(error);
      }
    );

    // eject on cleanup
    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [navigate]);

  return null; // doesn't render anything
}

export default AxiosInterceptor;
