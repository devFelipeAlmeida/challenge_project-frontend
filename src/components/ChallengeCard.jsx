import React, { useMemo } from "react";
import DefaultThumbnail from "../assets/undraw_coding_re_iv62.svg";
import { formatDate } from "../utilities/date";
import { Link } from "react-router-dom";

function ChallengeCard({ 
  challenge, 
  userEmail, 
  onComplete, 
  onDelete, 
  onEdit,
  onApprove, // Adiciona a função para aprovar
  onReject // Adiciona a função para rejeitar
}) {
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
    <div className="flex flex-col rounded hover:cursor-pointer">
      <Link 
        to={`/challenge/${challenge.id}`} 
        className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow p-4 md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        {userEmail && (
          <p className="px-4 pt-2 font-semibold text-gray-700">{userEmail}</p>
        )}
        <img
          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src={DefaultThumbnail}
          alt="Challenge Thumbnail"
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{challenge.title}</h5>
          <p className={`font-normal text-gray-700 dark:text-gray-400 ${dateText.colorClass}`}>
            {dateText.text}
          </p>
        </div>
      </Link>

      {onComplete && (
        <button
          onClick={onComplete}
          className="mt-1 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Marcar como Concluído
        </button>
      )}

      {(onEdit || onDelete) && (
        <div className="flex justify-between p-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {(onApprove || onReject) && (
        <div className="flex justify-between p-2">
          {onApprove && (
            <button
              onClick={onApprove}
              className="px-4 py-2 text-white bg-green-700 rounded hover:bg-green-800"
            >
              Aprovar
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className="px-4 py-2 text-white bg-yellow-700 rounded hover:bg-yellow-800"
            >
              Recusar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ChallengeCard;