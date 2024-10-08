import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getCompletedChallenges, approveChallenge, rejectChallenge } from "../api/challenges"; // Importe as funções para aprovar e rejeitar
import { fetchUsers } from "../api/authentication";
import { toast } from "react-toastify";
import ChallengeCard from "../components/ChallengeCard";

function CompletedChallenges() {
  const [cookies] = useCookies([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCompletedChallengesApi(cookies.jwt);
  }, [cookies.jwt]);

  const getCompletedChallengesApi = async (jwt) => {
    setLoading(true); // Inicia o carregamento
    const [result, error] = await getCompletedChallenges(jwt);
    handleResponse(result, error);
  };

  const handleResponse = async (response, error) => {
    setLoading(false);
    if (error) {
      setError(error);
      toast.error(error);
    } else {
      try {
        const data = await response.json();
        const challengesWithUserDetails = await Promise.all(
          data.data.map(async (challenge) => {
            if (challenge.user_id) {
              const [userDetails, userError] = await fetchUsers(cookies.jwt);
              if (userError) {
                toast.error(userError);
                return { ...challenge, user: { email: "Unknown" } };
              }
              const user = userDetails.find((user) => user.id === challenge.user_id);
              return { ...challenge, user: user || { email: "Unknown" } };
            }
            return challenge;
          })
        );
        setCompletedChallenges(challengesWithUserDetails);
      } catch (parseError) {
        toast.error("Erro ao processar a resposta");
      }
    }
  };

  const handleApprove = async (challengeId) => {
    const [response, error] = await approveChallenge(cookies.jwt, challengeId);
    if (error) {
      toast.error("Falha ao aprovar desafio");
    } else {
      toast.success("Desafio aprovado com sucesso");
      // Atualiza a lista de desafios
      setCompletedChallenges(prev => prev.filter(challenge => challenge.id !== challengeId));
    }
  };

  const handleReject = async (challengeId) => {
    const [response, error] = await rejectChallenge(challengeId, cookies.jwt);
    if (error) {
      toast.error("Falha ao reverter status do desafio");
    } else {
      toast.success("Status do desafio revertido para ativo com sucesso");
      // Atualiza a lista de desafios
      setCompletedChallenges(prev =>
        prev.map(challenge =>
          challenge.id === challengeId ? { ...challenge, status: 'active' } : challenge
        )
      );
    }
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
    return <div className="text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 pt-12 space-y-10">
      <h1 className="text-2xl font-bold">Desafios Concluídos</h1>
      {completedChallenges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 my-6">
          {completedChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              userEmail={challenge.user?.email}
              onApprove={() => handleApprove(challenge.id)} // Passa a função handleApprove
              onReject={() => handleReject(challenge.id)} // Passa a função handleReject
            />
          ))}
        </div>
      ) : (
        <p>Nenhum desafio concluído encontrado.</p>
      )}
    </div>
  );
}

export default CompletedChallenges;
