import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; 
import { useParams } from "react-router";
import { updateReservation, readReservation } from "../utils/api";
import formatPhone from "../utils/format-phone";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

export default function EditReservation(){
  const history = useHistory();
  const { reservation_id } = useParams();
  
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  }
  
  const [formData, setFormData] = useState({ ...initialFormState });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function loadRes() {
      const ac = new AbortController();
      const res = await readReservation(reservation_id, ac.signal);
      setFormData({ ...res })
      return () => ac.abort();
    }
    loadRes();
  }, [reservation_id])

  const validationErrors = [];

  const handleChange = (event) => {
    if (event.target.name === "mobile_number") {
      formatPhone(event.target);
    }
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ac = new AbortController();
    setErrors([]);

    let formattedDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}`
    );

    // FORM VALIDATION

    if (Date.now() > Date.parse(formattedDate)) {
      validationErrors.push({
        message: "reservation must be made for a future date and time.",
      });
    }

    if (formattedDate.toString().slice(0, 3) === "Tue") {
      validationErrors.push({
        message:
          "we're closed on Tuesdays - check our hours for more information!",
      });
    }

    const hours = formattedDate.getHours();
    const minutes = formattedDate.getMinutes();

    if ((hours <= 10 && minutes <= 30) || hours <= 9) {
      validationErrors.push({
        message:
          "we open at 10:30 AM - please fix your reservation accordingly.",
      });
    }

    if ((hours >= 21 && minutes >= 30) || hours >= 22) {
      validationErrors.push({
        message:
          "our last reservations are for 9:30 PM - please fix your reservation accordingly.",
      });
    }

    formData.people = Number(formData.people)

    if (formData.people < 1) {
      validationErrors.push({
        message: "you must have at least one guest.",
      });
    }

    // ERROR HANDLING

    setErrors(validationErrors);

    if (errors.length === 0) {
      await updateReservation(formData, reservation_id, ac.signal);
    }
    
    history.push(`/dashboard?date=${formData.reservation_date}`);

    setFormData({ ...initialFormState });

    return () => ac.abort();
  };

  let errorsElement = errors.map((error) => {
    return <ErrorAlert key={error.message} error={error} />;
  });

  return (
    <>
      <div>
        <h1 className="my-3 text-center">Edit Your Reservation:</h1>
      </div>
      {errorsElement}
      <ReservationForm
        reservation={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}