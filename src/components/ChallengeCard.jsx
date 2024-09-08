import React, { useMemo } from "react";
import DefaultThumbnail from "../assets/undraw_coding_re_iv62.svg";
import { formatDate } from "../utilities/date";
import { Link } from "react-router-dom";

function ChallengeCard({ challenge }) {
  // Memoize apenas o texto formatado e a classe de cor
  const dateText = useMemo(() => {
    const startDate = new Date(challenge.start_date);
    const endDate = new Date(challenge.end_date);
    const currentDate = new Date();

    if (startDate > currentDate) {
      return {
        text: `Start date: ${formatDate(startDate)}`,
        colorClass: "text-green-600",
      };
    } else if (startDate < currentDate && endDate > currentDate) {
      return {
        text: `End date: ${formatDate(endDate)}`,
        colorClass: "text-red-600",
      };
    } else {
      return {
        text: `Start date: ${formatDate(startDate)} - End date: ${formatDate(
          endDate
        )}`,
        colorClass: "text-gray-600",
      };
    }
  }, [challenge.start_date, challenge.end_date]);

  return (
    <Link to={`/challenge/${challenge.id}`}>
      <div className="flex flex-col border border-black rounded hover:cursor-pointer hover:shadow-lg hover:border-2">
        <img
          className="aspect-square w-full border-b border-black"
          src={DefaultThumbnail}
          alt="Challenge Thumbnail"
        />
        <div className="p-4 space-y-2">
          <p className="font-medium">{challenge.title}</p>
          <p className={`font-medium line-clamp-1 text-ellipsis ${dateText.colorClass}`}>
            {dateText.text}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ChallengeCard;
