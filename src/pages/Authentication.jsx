import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utilities/validations";
import { Link } from "react-router-dom";
import { registerApi, loginApi } from "../api/authentication";
import { useCookies } from "react-cookie";
import Button from "../elements/Button";

const initialErrorsState = {
  email: "",
  password: "",
  api: "",
};

function Authentication({ pageType }) {
  const [cookies, setCookie] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (cookies.jwt) {
      navigate("/");
    }
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(initialErrorsState);

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
    } else {
      const jwt = response.headers.get("Authorization");

      setCookie("jwt", jwt);
      navigate("/");
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 px-12">
        <h3 className="text-2xl font-bold">
          {pageType === PageType.LOGIN ? "Login" : "Register"}
        </h3>

        {pageType === PageType.LOGIN ? (
          <p className="mt-4">
            Not a user?
            <Link to="/register" className="ms-1 underline">
              Register
            </Link>
          </p>
        ) : (
          <p className="mt-4">
            Already a user?
            <Link to="/login" className="ms-1 underline">
              Login
            </Link>
          </p>
        )}

        <form className="mt-10 max-w-96 flex flex-col gap-8">
          <div>
            <input
              name="email"
              type="email"
              className="py-2 w-full border border-gray-600 rounded px-3"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && (
              <p className="text-sm text-medium text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <input
              name="password"
              type="password"
              className="py-2 w-full border border-gray-600 rounded px-3"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <p className="text-sm text-medium text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <Button onClick={handleSubmit}>
            {pageType === PageType.LOGIN ? "Login" : "Register"}
          </Button>
          {errors.api && (
            <p className="text-sm text-medium text-red-500 mt-1">
              {errors.api}
            </p>
          )}
        </form>
      </div>
    </div>
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
