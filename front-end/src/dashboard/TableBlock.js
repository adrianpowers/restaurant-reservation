export default function TableBlock({ table }) {
  const { table_name, capacity, reservation_id } = table;

  const status =
    reservation_id ? (
      <div
        className="btn btn-danger"
        data-table-id-status={table.table_id}
        style={{ cursor: "default" }}
      >
        Occupied
      </div>
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
      <div className="card">
        <div className="card-body">
          <h5 className="card-title"><b>Table: {table_name}</b> <i>(seats {capacity})</i></h5>
        </div>
        <div className="m-3">
          {status}
        </div>
      </div>
    )
}
