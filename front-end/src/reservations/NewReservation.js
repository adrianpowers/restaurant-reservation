import { useState } from "react";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import Menu from "../layout/Menu";

export default function NewReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState({...initialFormState});


  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { id } = await createReservation(formData);
    setFormData({...initialFormState});
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