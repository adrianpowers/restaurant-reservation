import { finishTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import "./Dashboard.css";

export default function TableBlock({ table }) {
  const { table_id, table_name, capacity, reservation_id } = table;
  const history = useHistory();

  const handleClickFinish = async () => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const ac = new AbortController();
      await finishTable(table_id, ac.signal);
      history.go(0);
    }
  };

  const status = reservation_id ? (
    <>
      <div
        className="btn btn-danger mr-2"
        data-table-id-status={table.table_id}
        style={{ cursor: "default" }}
      >
        Occupied
      </div>
      <button
        type="button"
        className="btn btn-warning"
        data-table-id-finish={table.table_id}
        style={{ cursor: "default" }}
        onClick={handleClickFinish}
      >
        Finish
      </button>
    </>
  ) : (
    <div
      className="col btn btn-success"
      data-table-id-status={table.table_id}
      style={{ cursor: "default" }}
    >
      Free
    </div>
  );

  return (
    <div className="card mb-2">
      <div className="card-body">
        <h5 className="card-title block-width text-center">
          <b>Table: {table_name}</b> <i>(seats {capacity})</i>
        </h5>
      </div>
      <div className="m-3">{status}</div>
    </div>
  );
}
