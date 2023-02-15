import { useState } from "react";
import { listReservations } from "../utils/api"
import ReservationBlock from "../dashboard/ReservationBlock";
import formatPhone from "../utils/format-phone";
import ErrorAlert from "./ErrorAlert";

export default function Search(){
  const initialFormState = {
    mobile_number: "",
  };

  const [ formData, setFormData ] = useState({ ...initialFormState });
  const [ reservations, setReservations ] = useState([]);
  const [ errors, setErrors ] = useState([]);

  const handleChange = (event) => {
    formatPhone(event.target);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ac = new AbortController();

    const search = { mobile_number: formData.mobile_number };

    setReservations(await listReservations(search, ac.signal))

    return () => ac.abort();
  }
  
  const displayErrors = errors.map(error => {
    return <ErrorAlert key={error} error={error} />
  });

  const reservationsList = reservations.map(res => {
    return <ReservationBlock key={res.reservation_id} reservation={res} />
  });

  let results = null;

  if(reservations.length){
    results = (
      <div>
        {reservationsList}
      </div>
    )
  } else {
    results = <h5 className="mt-2">No reservations found</h5>
  }

  return (
    <>
      <h5>Search by Mobile Number</h5>
      {errors ? displayErrors : null}
      <div className="d-flex">
        <form className="d-flex" onSubmit={handleSubmit}>
          <input
            required
            type="tel"
            placeholder="Enter Mobile Number"
            onChange={handleChange}
            value={formData.mobile_number}
            className="form-control"
            name="mobile_number"></input>
          <button className="btn btn-primary ml-2" type="submit">
            Search
          </button>
        </form>
      </div>
      {results}
    </>
  )
}