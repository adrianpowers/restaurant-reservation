import { Link } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";
import "./Dashboard.css";

export default function DateButtons({ date }){
  return (
    <div className="btn-group pb-3">
      <Link
        type="button"
        className="btn btn-outline-secondary"
        to={(location) => `${location.pathname}?date=${previous(date)}`}
      > 
        <h4>Yesterday</h4>
      </Link>
      <Link
        type="button"
        className="btn btn-outline-primary"
        to={(location) => `${location.pathname}?date=${today()}`}
      > 
        <h4>Today</h4>
      </Link>
      <Link
        type="button"
        className="btn btn-outline-secondary"
        to={(location) => `${location.pathname}?date=${next(date)}`}
      > 
        <h4>Tomorrow</h4>
      </Link>
    </div>
  )
}