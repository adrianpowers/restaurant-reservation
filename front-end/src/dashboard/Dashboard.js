import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import DateButtons from "./DateButtons";
import ReservationBlock from "./ReservationBlock";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date = today }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const allReservations = reservations.map(res => {
    return <ReservationBlock
      key={res.reservation_id}
      reservation={res}
    />
  })

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}:</h4>
      </div>
      <DateButtons date={date}/>
      {allReservations}
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default Dashboard;