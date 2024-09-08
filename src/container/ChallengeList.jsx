import React, { useState, useEffect, act } from "react";
import "react-quill/dist/quill.snow.css";
import { getActiveAndUpcomingChallenges } from "../api/challenges";
import { useCookies } from "react-cookie";
import ChallengeCard from "../components/ChallengeCard";

function ChallengeList() {
  const [cookies] = useCookies([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);

  useEffect(() => {
    getActiveAndUpcomingChallengesApi(cookies.jwt);
  }, []);

  const getActiveAndUpcomingChallengesApi = async () => {
    const [result, error] = await getActiveAndUpcomingChallenges(cookies.jwt);
    handleResponse([result, error]);
  };

  const handleResponse = async ([response, error]) => {
    if (error) {
    } else {
      const data = await response.json();
      setActiveChallenges(data.active);
      setUpcomingChallenges(data.upcoming);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 pt-12 space-y-10">
      {activeChallenges.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold">Active Challenges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 my-6">
            {activeChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {upcomingChallenges.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold">Upcoming Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 my-6">
            {upcomingChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold">Active Challenges</h3>
      <h3 className="text-2xl font-bold">Upcoming Challenges</h3>
      <h1 className="text-4xl">
        Challenges active: {activeChallenges.length} upcoming:{" "}
        {upcomingChallenges.length}
      </h1>
    </div>
  );
}

export default ChallengeList;
