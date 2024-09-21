import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { fetchComments, addComment } from "../api/challenges"; // Ajuste o caminho conforme necessário

const Comments = ({ challengeId }) => {
  const [cookies] = useCookies(['jwt']);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getComments = async () => {
      const [result, error] = await fetchComments(cookies.jwt, challengeId);
      if (error) {
        setError(error);
      } else {
        setComments(result);
      }
    };
    getComments();
  }, [challengeId, cookies.jwt]);

  const handleAddComment = async () => {
    const [result, error] = await addComment(cookies.jwt, challengeId, newComment);
    if (error) {
      setError(error);
    } else {
      setComments(prevComments => [...prevComments, result]);
      setNewComment(""); // Limpar o campo de comentário
    }
  };

  return (
    <div className="comments-section mt-8">
      <h2 className="text-xl font-bold">Comments</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="comments-list mt-4">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
             <p><span className="font-bold">{comment.user?.email || "Unknown User"}</span>: {comment.content}</p>
          </div>
        ))}
      </div>
      <div className="add-comment mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default Comments;
