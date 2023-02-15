import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setTables([]);
    const ac = new AbortController();

    async function loadTables() {
      const response = await listTables(ac.signal);
      setTables(response);
    }

    loadTables();
    return () => ac.abort();
  }, []);

  const handleChange = (event) => {
    setTableId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ac = new AbortController();

    try {
      await updateTable(reservation_id, tableId, ac.signal);
      history.push("/dashboard");
    } catch (e) {
      console.error(e);
    }

    setErrors([]);
    return () => ac.abort();
  };

  let displayErrors = errors.map((error) => {
    return <ErrorAlert key={error.message} error={error} />;
  });

  const tableOptions = tables.map((table) => {
    return (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <>
      <div className="my-3">
        <h2>Select Table</h2>
      </div>
      {errors.length ? displayErrors : null}
      <form onSubmit={handleSubmit}>
        <select
          required
          onChange={handleChange}
          value={tableId}
          className="form-control"
          name="table_id"
        >
          <option value="">** Select Table **</option>
          {tableOptions};
        </select>
        <button type="submit" className="btn btn-primary my-2 mr-2">
          Seat
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={history.goBack}
        >
          Cancel
        </button>
      </form>
    </>
  );
}
