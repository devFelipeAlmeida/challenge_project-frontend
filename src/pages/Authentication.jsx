import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utilities/validations";
import { Link } from "react-router-dom";
import { registerApi, loginApi } from "../api/authentication";
import { useCookies } from "react-cookie";
import Button from "../elements/Button";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const initialErrorsState = {
  email: "",
  password: "",
  api: "",
};

function Authentication({ pageType }) {
  const [cookies, setCookie] = useCookies([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(initialErrorsState);

  useEffect(() => {
    const message = sessionStorage.getItem("toastMessage");
    if (message) {
      toast.success(message);
      sessionStorage.removeItem("toastMessage");
    }

    if (cookies.jwt) {
      navigate("/");
    }
  }, [cookies.jwt, navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!validateEmail(email)) {
      newErrors = {
        ...newErrors,
        email: "Invalid email",
      };
    }

    if (!validatePassword(password)) {
      newErrors = {
        ...newErrors,
        password: "Password should be at least 6 characters long",
      };
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    if (pageType === PageType.LOGIN) {
      const [response, error] = await loginApi({
        user: {
          email: email,
          password: password,
        },
      });
      handleResponse([response, error]);
    } else {
      const [response, error] = await registerApi({
        user: {
          email: email,
          password: password,
        },
      });
      handleResponse([response, error]);
    }
  };

  const handleResponse = async ([response, error]) => {
    if (error) {
      setErrors({
        ...errors,
        api: error,
      });
      toast.error("Authentication failed: " + error.message);
    } else {
      const jwt = response.headers.get("Authorization");
      setCookie("jwt", jwt);
      sessionStorage.setItem("toastMessage", "Successfully authenticated!");
      navigate("/"); 
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          Code Challenge
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {pageType === PageType.LOGIN ? "Sign in to your account" : "Register a new account"}
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={handleEmailChange}
                  required 
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="••••••••" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={password} 
                  onChange={handlePasswordChange}
                  required 
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      id="remember" 
                      aria-describedby="remember" 
                      type="checkbox" 
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" 
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>
              <Button type="submit" className="w-full rounded-md border border-slate-800 py-2 text-center text-sm transition-all shadow-lg bg-slate-800 text-white hover:bg-white hover:text-slate-800 hover:border-slate-300 focus:bg-white focus:text-slate-800 focus:border-slate-300 active:bg-white active:text-slate-800 active:border-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                {pageType === PageType.LOGIN ? "Sign in" : "Register"}
              </Button>
              {errors.api && <p className="text-sm text-red-500 mt-1">{errors.api}</p>}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {pageType === PageType.LOGIN ? "Don’t have an account yet?" : "Already have an account?"} 
                <Link to={pageType === PageType.LOGIN ? "/register" : "/login"} className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  {pageType === PageType.LOGIN ? " Sign up" : " Sign in"}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export const PageType = Object.freeze({
  LOGIN: 0,
  REGISTER: 1,
});

Authentication.propTypes = {
  pageType: PropTypes.number.isRequired,
};

export default Authentication;
