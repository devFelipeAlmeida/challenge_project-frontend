import React, { useState, useEffect } from "react";
import Button from "../elements/Button";
import Datepicker from "react-tailwindcss-datepicker";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../components/EditorToolbar";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { addChallenge } from "../api/challenges";
import { useCookies } from "react-cookie";

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
  const [cookies, setCookie] = useCookies([]);
  const navigate = useNavigate();

  useEffect(() => {
    if(!cookies.jwt) {
      navigate('/')
    }
  }, [])

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e);
  };

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
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

  const addChallengeApi = async () => {
    const [result, error] = await addChallenge(cookies.jwt, {
      challenge: {
        title: title,
        description: description,
        start_date: value.startDate,
        end_date: value.endDate,
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
          type="title"
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

        <Button type="submit">add Challenge</Button>
        {errors.api && (
          <p className="text-sm text-medium text-red-500 mt-1">{errors.api}</p>
        )}
      </form>
    </div>
  );
}

export default AddChallenge;
