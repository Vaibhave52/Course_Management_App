import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/"); // assuming login route is "/"
  };

  const goBack = () => {
    navigate(-1); // previous page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-violet-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-8">Oops! Page Not Found</p>

      <div className="flex gap-4">
        <button
          onClick={goBack}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition"
        >
          Go Back
        </button>

        <button
          onClick={goToLogin}
          className="px-6 py-2 bg-violet-600 text-white rounded-lg shadow-md hover:bg-violet-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
