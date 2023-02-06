import { Link } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";

export default function DateButtons({ date }){
  return (
    <div className="btn-group pb-3">
      <Link
        type="button"
        className="btn btn-outline-secondary"
        to={(location) => `${location.pathname}?date=${previous(date)}`}
      > 
        Yesterday
      </Link>
      <Link
        type="button"
        className="btn btn-outline-primary"
        to={(location) => `${location.pathname}?date=${today()}`}
      > 
        Today
      </Link>
      <Link
        type="button"
        className="btn btn-outline-secondary"
        to={(location) => `${location.pathname}?date=${next(date)}`}
      > 
        Tomorrow
      </Link>
    </div>
  )
}