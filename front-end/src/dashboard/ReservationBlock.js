export default function ReservationBlock({ reservation }){
  const {
    first_name,
    last_name,
    reservation_time,
    people,
    mobile_number,
    status
  } = reservation;

  const statusButton = 
    status === "booked" ? (
      <div className="btn btn-primary">
        Booked
      </div>
    ) : status === "seated" ? (
      <div className="btn btn-success"> 
        Seated
      </div>
    ) : status === "cancelled" ? (
      <div className="btn btn-warning">
        Cancelled
      </div>
    ) : (
      <div className="btn btn-secondary">
        Finished
      </div>
  )

  return (
    <div className="card" style={{width: '16rem', }}>
      <div className="card-body">
        <h5 className="card-title"><b>{first_name} {last_name}</b>: {reservation_time}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <b>Mobile Number:</b> {mobile_number}
        </li>
        <li className="list-group-item">
          <b>Number of Guests:</b> {people}
        </li>
      </ul>
      {statusButton}
    </div>
  )
}