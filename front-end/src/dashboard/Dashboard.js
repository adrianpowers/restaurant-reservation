import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import DateButtons from "./DateButtons";
import ReservationBlock from "./ReservationBlock";
import TableBlock from "./TableBlock";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date = today }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const allReservations = reservations.map((res) => {
    return <ReservationBlock key={res.reservation_id} reservation={res} />;
  });

  const allTables = tables.map((table) => {
    return <TableBlock key={table.table_name} table={table} />;
  });

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}:</h4>
      </div>
      <DateButtons date={date} />
      <div className="container d-flex">
        <div className="col">{allReservations}</div>
        <div className="col">{allTables}</div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
    </main>
  );
}

export default Dashboard;
