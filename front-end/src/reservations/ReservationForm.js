import React from "react";
import { useHistory } from "react-router-dom";

export default function ReservationForm({
  reservation,
  handleChange,
  handleSubmit,
}) {
  const history = useHistory();
  return (
    <form onSubmit={handleSubmit} className="form-group">
      <div className="row">
        <div className="col">
          <label htmlFor="first_name">First Name</label>
          <br />
          <input
            id="first_name"
            type="text"
            name="first_name"
            placeholder="First Name"
            value={reservation.first_name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col">
          <label htmlFor="last_name">Last Name</label>
          <br />
          <input
            id="last_name"
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={reservation.last_name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

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
        className="form-control"
      />
      <br />

      <div className="row">
        <div className="col">
            <label htmlFor="reservation_date">Reservation Date</label>
            <br />
            <input
              id="reservation_date"
              type="date"
              name="reservation_date"
              placeholder="Reservation Date"
              value={reservation.reservation_date}
              onChange={handleChange}
              className="form-control"
            />
            <br />
          </div>
          
          
        <div className="col">
          <label htmlFor="reservation_time">Reservation Time</label>
            <br />
            <input
              id="reservation_time"
              type="time"
              name="reservation_time"
              placeholder="Reservation Time"
              value={reservation.reservation_time}
              onChange={handleChange}
              className="form-control"
            />
        </div>
      </div>

      <label htmlFor="people">People</label>
      <br />
      <input
        id="people"
        type="number"
        name="people"
        placeholder="People"
        value={reservation.people}
        onChange={handleChange}
        className="form-control"
      />
      <br />
      <button type="submit" className="btn btn-primary mt-4 mr-2 ">
        Submit Reservation
      </button>
      <button
        type="button"
        className="btn btn-secondary mt-4"
        onClick={history.goBack}
      >
        Cancel
      </button>
    </form>
  );
}
