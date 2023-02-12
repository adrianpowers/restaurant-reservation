import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewTable() {
  const history = useHistory();

  const initialFormState = {
    table_name: "",
    capacity: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const validationErrors = [];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ac = new AbortController();
    setErrors([]);

    if (formData.table_name.length < 2) {
      validationErrors.push({
        message: "table name must be at least 2 characters in length.",
      });
    }

    formData.capacity = Number(formData.capacity);

    if (formData.capacity < 1) {
      validationErrors.push({
        message: "capacity must be greater than 0.",
      });
    }

    setErrors(validationErrors);

    if (errors.length === 0) {
      await createTable(formData, ac.signal);
    }

    history.push("/dashboard");

    setFormData({ ...initialFormState });

    return () => ac.abort();
  };

  let errorsElement = errors.map((error) => {
    return <ErrorAlert key={error.message} error={error} />;
  });

  return (
    <>
      <div>
        <h1 className="my-3 text-center">Create New Table</h1>
      </div>
      {errorsElement}
      <TableForm
        table={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
