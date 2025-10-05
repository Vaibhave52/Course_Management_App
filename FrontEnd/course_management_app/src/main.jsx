import App from './App'
import "./index.css";
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <ToastContainer position="top-right" autoClose={2000} />
  </BrowserRouter>
)
