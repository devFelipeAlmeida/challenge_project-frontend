import React from "react";
import { useCookies } from "react-cookie";
import { logoutApi } from "../api/authentication";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notifications from "./Notifications";

function Navbar() {
  const [cookies, , removeCookie] = useCookies(["jwt"]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const [result, error] = await logoutApi(cookies.jwt);
    handleResponse([result, error]);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleResponse = ([response, error]) => {
    removeCookie("jwt"); // Remove o cookie ao deslogar

    if (error) {
      toast.error("Logout failed: Please try again.");
    } else {
      toast.success("Logout successful!");
      navigate("/login");
    }
  };

  return (
    <div className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/">
            <p className="font-bold text-2xl">Code Challenges</p>
          </Link>
          <div className="flex items-center space-x-2">
            <Notifications />
            {cookies.jwt ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 my-4 rounded-md border border-slate-800 py-2 text-center text-sm transition-all shadow-lg bg-slate-800 text-white hover:bg-red-800 hover:text-white hover:border-red-100 focus:bg-white focus:text-red-800 focus:border-red-300 active:bg-white active:text-white active:border-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="px-2 py-1.5 my-4 rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;