import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import DateButtons from "./DateButtons";
import ReservationBlock from "./ReservationBlock";
import TableBlock from "./TableBlock";
import "./Dashboard.css";

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
      <div className="header-container my-3 p-3">
        <h1 className="text-center">Dashboard</h1>
      </div>
      <div className="d-md-flex mb-3">
        <h2 className="mb-0">Reservations for {date}:</h2>
      </div>
      <DateButtons date={date} />
      <div className="container d-flex justify-content-start">
        <div className="ml-0">{allReservations}</div>
        <div className="ml-3">{allTables}</div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
    </main>
  );
}

export default Dashboard;
