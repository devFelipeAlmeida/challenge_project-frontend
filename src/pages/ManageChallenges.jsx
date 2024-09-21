import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { fetchCurrentUser } from "../api/authentication"; // Função para obter o usuário atual
import { getChallenges, deleteChallenge } from "../api/challenges";
import { toast } from "react-toastify";
import ChallengeCard from "../components/ChallengeCard";
import { Link, useNavigate } from "react-router-dom"; // Para redirecionar

function ManageChallenges() {
  const [cookies] = useCookies(["jwt"]);
  const [challenges, setChallenges] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Para redirecionar o usuário

  useEffect(() => {
    if (!cookies.jwt) {
      navigate("/login"); // Redireciona se não estiver autenticado
      return;
    }

    const fetchUser = async () => {
      // Decodifica o JWT para obter o ID do usuário
      const decodedToken = jwtDecode(cookies.jwt);
      console.log(decodedToken);
      const userId = decodedToken.sub;

      const [userResult, userError] = await fetchCurrentUser(
        cookies.jwt,
        userId
      );
      if (userError) {
        setError(userError);
        toast.error(userError);
        return;
      }

      const user = userResult;
      setIsAdmin(user.admin); // Verifique a propriedade admin

      if (!user.admin) {
        navigate("/"); // Redireciona se não for admin
      }
    };

    fetchUser();
  }, [cookies.jwt, navigate]);

  useEffect(() => {
    if (!cookies.jwt || !isAdmin) {
      return;
    }

    const fetchChallengesData = async () => {
      const [challengesResult, challengesError] = await getChallenges(
        cookies.jwt
      );

      if (challengesError) {
        setError(challengesError);
        toast.error(challengesError);
      } else {
        // Verifique se o challengesResult é um objeto com a propriedade "data"
        console.log("Challenges Result:", challengesResult);

        if (challengesResult && Array.isArray(challengesResult.data)) {
          setChallenges(challengesResult.data); // Atualize o estado com o array de desafios
        } else {
          setError("Expected array but got something else.");
          toast.error("Expected array but got something else.");
        }
      }

      setLoading(false);
    };

    fetchChallengesData();
  }, [cookies.jwt, isAdmin]);

  const handleDeleteChallenge = async (challengeId) => {
    const [result, error] = await deleteChallenge(cookies.jwt, challengeId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Challenge deleted successfully!");
      setChallenges(
        challenges.filter((challenge) => challenge.id !== challengeId)
      );
    }
  };

  const handleEditChallenge = (challengeId) => {
    // Redireciona para a rota de edição do desafio
    navigate(`/edit-challenge/${challengeId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!isAdmin) {
    return (
      <div className="text-red-500">
        You do not have permission to access this page.
      </div>
    );
  }

  return (
    <div className="mx-auto w-max px-2 sm:px-6 lg:px-8 pt-12 space-y-10">
      <h1 className="text-2xl font-bold">Manage Challenges</h1>
      <div className="flex justify-center space-x-4">
        <Link
          to="/add-challenge"
          className="w-48 rounded-md border border-slate-800 py-2 text-center text-sm transition-all shadow-lg bg-slate-800 text-white hover:bg-white hover:text-slate-800 hover:border-slate-300 focus:bg-white focus:text-slate-800 focus:border-slate-300 active:bg-white active:text-slate-800 active:border-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Create Challenge
        </Link>
        <Link
          to="/completed-challenges"
          className="w-48 rounded-md border border-slate-800 py-2 text-center text-sm transition-all shadow-lg bg-slate-800 text-white hover:bg-white hover:text-slate-800 hover:border-slate-300 focus:bg-white focus:text-slate-800 focus:border-slate-300 active:bg-white active:text-slate-800 active:border-slate-300 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Completed Challenges
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 my-6">
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onDelete={() => handleDeleteChallenge(challenge.id)}
              onEdit={() => handleEditChallenge(challenge.id)} // Passando a função onEdit
            />
          ))
        ) : (
          <p>No challenges available.</p>
        )}
      </div>
    </div>
  );
}

export default ManageChallenges;
