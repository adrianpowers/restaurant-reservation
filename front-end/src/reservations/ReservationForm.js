import React from "react";
import { useHistory } from "react-router-dom";

export default function ReservationForm({ reservation, handleChange, handleSubmit }) {
  const history = useHistory();
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="first_name">First Name</label>
      <br />
      <input
        id="first_name"
        type="text"
        name="first_name"
        placeholder="First Name"
        value={reservation.first_name}
        onChange={handleChange}
      />
      <br />
      
      <label htmlFor="last_name">Last Name</label>
      <br />
      <input
        id="last_name"
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={reservation.last_name}
        onChange={handleChange}
      />
      <br />

      <label htmlFor="mobile_number">Mobile Number</label>
      <br />
      <input
        id="mobile_number"
        type="tel"
        name="mobile_number"
        placeholder="Mobile Number"
        value={reservation.mobile_number}
        onChange={handleChange}
      />
      <br />

      <label htmlFor="reservation_date">Reservation Date</label>
      <br />
      <input
        id="reservation_date"
        type="date"
        name="reservation_date"
        placeholder="Reservation Date"
        value={reservation.reservation_date}
        onChange={handleChange}
      />
      <br />

      <label htmlFor="reservation_time">Reservation Time</label>
      <br />
      <input
        id="reservation_time"
        type="time"
        name="reservation_time"
        placeholder="Reservation Time"
        value={reservation.reservation_time}
        onChange={handleChange}
      />
      <br />

      <label htmlFor="people">People</label>
      <br />
      <input
        id="people"
        type="number"
        name="people"
        placeholder="People"
        value={reservation.people}
        onChange={handleChange}
      />
      <br />

      <button type="button" onClick={history.goBack}>Cancel</button>
      <button type="submit">Submit Reservation</button>
    </form>
  )
}
