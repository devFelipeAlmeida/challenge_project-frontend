import React, { useState, useEffect } from "react";
import Button from "../elements/Button";
import Datepicker from "react-tailwindcss-datepicker";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../components/EditorToolbar";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { addChallenge } from "../api/challenges";
import { useCookies } from "react-cookie";
import { fetchUsers as fetchUsersApi } from "../api/authentication";

const initialErrorsState = {
  title: "",
  description: "",
  date: "",
  api: "",
};

function AddChallenge() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  const [errors, setErrors] = useState(initialErrorsState);
  const [cookies] = useCookies([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.jwt) {
      navigate("/");
    } else {
      fetchUsers(); // Buscar usuários quando o componente for montado
    }
  }, [cookies.jwt, navigate]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e);
  };

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value); // Atualiza o usuário selecionado
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (title.length === 0) {
      newErrors = {
        ...newErrors,
        title: "Please enter title",
      };
    }

    if (description.length === 0) {
      newErrors = {
        ...newErrors,
        description: "Please enter description",
      };
    }

    if (value.startDate === null || value.endDate === null) {
      newErrors = {
        ...newErrors,
        date: "Please select start and end date",
      };
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    addChallengeApi();
  };

  const fetchUsers = async () => {
    const [data, error] = await fetchUsersApi(cookies.jwt); // Passa o JWT como argumento

    if (error) {
      setErrors((prev) => ({
        ...prev,
        api: error,
      }));
    } else {
      setUsers(data); // Atualiza o estado com a lista de usuários
    }
  };

  const addChallengeApi = async () => {
    const [result, error] = await addChallenge(cookies.jwt, {
      challenge: {
        title: title,
        description: description,
        start_date: value.startDate,
        end_date: value.endDate,
        user_id: selectedUser,
      },
    });
    handleResponse([result, error]);
  };

  const handleResponse = async ([response, error]) => {
    if (error) {
      setErrors({
        ...errors,
        api: error,
      });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl">Add Challenge</h1>
      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-8">
        <input
          name="title"
          type="text"
          className="py-2 w-full border border-gray-600 rounded px-3"
          placeholder="Challenge title"
          value={title}
          onChange={handleTitleChange}
        />

        {errors.title && (
          <p className="text-sm text-medium text-red-500 mt-1">
            {errors.title}
          </p>
        )}

        <div className="text-editor">
          <EditorToolbar />
          <ReactQuill
            theme="snow"
            value={description}
            onChange={handleDescriptionChange}
            placeholder={"Write something awesome..."}
            modules={modules}
            formats={formats}
          />
        </div>

        {errors.description && (
          <p className="text-sm text-medium text-red-500 mt-1">
            {errors.description}
          </p>
        )}

        <Datepicker
          minDate={new Date()}
          placeholder="Start Date - End Date"
          inputClassName="border border-gray-600 rounded p-3 py-2 w-full"
          value={value}
          displayFormat={"DD/MM/YYYY"}
          onChange={handleValueChange}
        />

        {errors.date && (
          <p className="text-sm text-medium text-red-500 mt-1">{errors.date}</p>
        )}

        <select
          value={selectedUser}
          onChange={handleUserChange}
          className="py-2 w-full border border-gray-600 rounded px-3"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email} {/* Ou use user.name se for mais apropriado */}
            </option>
          ))}
        </select>

        <Button type="submit">Add Challenge</Button>
        {errors.api && (
          <p className="text-sm text-medium text-red-500 mt-1">{errors.api}</p>
        )}
      </form>
    </div>
  );
}

export default AddChallenge;