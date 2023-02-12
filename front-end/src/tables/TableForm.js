import React from "react";
import { useHistory } from "react-router-dom";

export default function TableForm({ table, handleChange, handleSubmit }) {
  const history = useHistory();

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <label htmlFor="table_name">Table Name</label>
      <br />
      <input
        id="table_name"
        type="text"
        name="table_name"
        placeholder="Table Name"
        value={table.table_name}
        onChange={handleChange}
        className="form-control"
      />
      <br />

      <label htmlFor="capacity">Capacity</label>
      <br />
      <input
        id="capacity"
        type="number"
        name="capacity"
        placeholder="Capacity"
        value={table.capacity}
        onChange={handleChange}
        className="form-control"
      />
      <br />

      <button type="submit" className="btn btn-primary mt-4 mr-2">
        Create Table
      </button>

      <button type="button" className="btn btn-secondary mt-4" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}
