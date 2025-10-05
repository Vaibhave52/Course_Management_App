import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});
//  Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const authData = sessionStorage.getItem("auth");
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const status = error.response.status;
//       const message = error.response.data;

//       if (status === 401 && message === "JWT_EXPIRED") {
//         toast.error("Session expired. Please login again.");
//         sessionStorage.removeItem("auth");
//         setTimeout(() => {
//           window.location.href = "/"; // back to login
//         }, 500);
//       } else if (status === 403 && message === "UNAUTHORIZED_ACCESS") {
//         toast.error("Access Denied - You don’t have permission.");
//         setTimeout(() => {
//           window.location.href = "/unauthorized";
//         }, 500);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
