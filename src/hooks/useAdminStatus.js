import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { fetchCurrentUser } from "../api/authentication"; // Função para obter o usuário atual

const useAdminStatus = (navigate) => {
  const [cookies] = useCookies(["jwt"]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cookies.jwt) {
      navigate("/login"); // Redireciona se não estiver autenticado
      return;
    }

    const fetchUser = async () => {
      try {
        const decodedToken = jwtDecode(cookies.jwt);
        const userId = decodedToken.sub;

        const [userResult, userError] = await fetchCurrentUser(cookies.jwt, userId);

        if (userError) {
          setError(userError);
          return;
        }

        const user = userResult;
        setIsAdmin(user.admin); 
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [cookies.jwt, navigate]);

  return { isAdmin, loading, error };
};

export default useAdminStatus;
