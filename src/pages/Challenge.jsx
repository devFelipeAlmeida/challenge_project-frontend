import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getChallengesById } from "../api/challenges";
import RichTextViewer from "../elements/RichTextViewer";

function Challenge() {
  const location = useLocation();

  const [cookies] = useCookies([]);
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const segments = location.pathname.split("/");
    const challengeId = segments[segments.length - 1];
    getChallengesByIdApi(challengeId);
  }, []);

  const getChallengesByIdApi = async (id) => {
    const [result, error] = await getChallengesById(cookies.jwt, id);
    handleResponse([result, error]);
  };

  const handleResponse = async ([response, error]) => {
    if (error) {
    } else {
      const data = await response.json();
      setChallenge(data.data);
    }
  };
  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-12 space-y-10">
      {challenge && (
        <div>
          <h1 className="text-3xl text-black">{challenge.title}</h1>
          <RichTextViewer className="mt-8" content={challenge.description}/>
        </div>
      )}
    </div>
  );
}

export default Challenge;
