import { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import formatPhone from "../utils/format-phone";
import Menu from "../layout/Menu";

export default function NewReservation() {
  const history = useHistory();
  
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState({...initialFormState});
  const [errors, setErrors] = useState([]); 


  const handleChange = (event) => {
    if(event.target.name === "mobile_number"){
      formatPhone(event.target);
    }
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reservation = await createReservation(formData)
    const date = reservation.reservation_date.split("T")[0];
    setFormData({...initialFormState})
    history.push(`/dashboard?date=${date}`);
  }

  return (
    <>
      <div>
        <h1>Reserve Your Table Now!</h1>
      </div>
      <ReservationForm
        reservation={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  )
}