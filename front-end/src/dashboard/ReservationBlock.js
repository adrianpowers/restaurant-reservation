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

  const statusButton =
    status === "booked" ? (
      <div className="btn btn-primary ml-4 mr-2 my-2">Booked</div>
    ) : status === "seated" ? (
      <div className="btn btn-success ml-4 mr-2 my-2">Seated</div>
    ) : status === "cancelled" ? (
      <div className="btn btn-warning ml-4 mr-2 my-2">Cancelled</div>
    ) : (
      <div className="btn btn-secondary ml-4 mr-2 my-2">Finished</div>
    );

  const seatButton = (
    <a
      href={`/reservations/${reservation_id}/seat`}
      role="button"
      className="btn btn-primary my-2"
    >
      Seat
    </a>
  );

  return (
    <div className="card">
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
      <div className="row">
        {statusButton}
        {status === "booked" ? seatButton : null}
      </div>
    </div>
  );
}
