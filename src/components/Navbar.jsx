import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { logoutApi } from "../api/authentication";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [cookies, , removeCookie] = useCookies(["jwt"]);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    const [result, error] = await logoutApi(cookies.jwt);
    handleResponse([result, error]);
  };

  const handleLogin = (e) => {
    navigate("/login");
  };

  const handleResponse = ([response, error]) => {
    removeCookie("jwt");

    if (error) {
      console.error("Erro ao fazer logout:", error);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="font-bold text-2xl">code challenges</p>
          <div>
            {cookies.jwt ? (
              <button
                onClick={handleLogout}
                className="bg-indigo-500 rounded px-2 py-1.5 my-4"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-indigo-500 rounded px-2 py-1.5 my-4"
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
