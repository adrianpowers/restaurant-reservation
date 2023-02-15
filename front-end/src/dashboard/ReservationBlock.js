import { cancelReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import "./Dashboard.css";

export default function ReservationBlock({ reservation }) {
  const {
    first_name,
    last_name,
    reservation_time,
    people,
    mobile_number,
    status,
    reservation_id,
  } = reservation;

  const history = useHistory();

  const handleClickCancel = async () => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const ac = new AbortController();
      await cancelReservation(reservation_id, ac.signal);
      history.go(0);
      return () => ac.abort();
    }
  };

  const statusButton =
    status === "booked" ? (
      <div
        className="btn btn-success mx-4 my-2 flex-fill oswald"
        data-reservation-id-status={reservation.reservation_id}
      >
        Booked
      </div>
    ) : status === "seated" ? (
      <div
        className="btn btn-warning mx-4 my-2 flex-fill oswald"
        data-reservation-id-status={reservation.reservation_id}
      >
        Seated
      </div>
    ) : status === "cancelled" ? (
      <div
        className="btn btn-danger mx-4 my-2 flex-fill oswald"
        data-reservation-id-status={reservation.reservation_id}
      >
        Cancelled
      </div>
    ) : (
      <div
        className="btn btn-secondary mx-4 my-2 flex-fill oswald"
        data-reservation-id-status={reservation.reservation_id}
      >
        Finished
      </div>
    );

  const seatButton = (
    <a
      href={`/reservations/${reservation_id}/seat`}
      role="button"
      className="btn btn-primary flex-fill oswald"
    >
      Seat
    </a>
  );

  const editButton = (
    <a
      href={`/reservations/${reservation_id}/edit`}
      role="button"
      className="btn btn-warning flex-fill oswald"
    >
      Edit
    </a>
  );

  const cancelButton = (
    <button
      type="button"
      className="btn btn-danger flex-fill oswald"
      data-reservation-id-cancel={reservation.reservation_id}
      onClick={handleClickCancel}
    >
      Cancel
    </button>
  );

  return (
    <div className="card oswald">
      <div className="card-body">
        <h5 className="card-title">
          <b>
            {first_name} {last_name}
          </b>
          : {reservation_time}
        </h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <b>Mobile Number:</b> {mobile_number}
        </li>
        <li className="list-group-item">
          <b>Number of Guests:</b> {people}
        </li>
      </ul>
      <div className="row flex-fill">{statusButton}</div>
      <div className="btn-group" role="group">
        {status === "booked" ? seatButton : null}
        {status === "booked" ? editButton : null}
        {status === "booked" ? cancelButton : null}
      </div>
    </div>
  );
}
