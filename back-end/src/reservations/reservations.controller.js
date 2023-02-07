/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// ! VALIDATORS

function hasData(req, res, next) {
  const { data } = req.body;
  if (data) {
    return next();
  }
  next({ status: 400, message: "No data found." });
}

function hasProperties(req, res, next) {
  const requiredProperties = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  const { data = {} } = req.body;
  requiredProperties.forEach((property) => {
    if (!data[property]) {
      return next({
        status: 400,
        message: `Reservation must include ${property}`,
      });
    }
  });
  res.locals.reservation = data;
  return next();
}

function validatePeople(req, res, next) {
  const { people } = res.locals.reservation;
  if (typeof people !== "number") {
    return next({ status: 400, message: "Error: people must be a number." });
  }
  return next();
}

function validateResDateAndTime(req, res, next) {
  const { reservation_date } = res.locals.reservation;
  const { reservation_time } = res.locals.reservation;

  // * checks for date formatting

  const dateRegex = /\d{4}\-\d{2}\-\d{2}/;
  if (!dateRegex.test(reservation_date)) {
    return next({
      status: 400,
      message:
        "Error: reservation_date must be a valid date. Use the format: YYYY-MM-DD.",
    });
  }

  // * checks for time formatting

  const timeRegex = /\d{2}\:\d{2}/;
  if (!timeRegex.test(reservation_time)) {
    return next({
      status: 400,
      message:
        "Error: reservation_time must be a valid time. Use the format: HH:MM:SS.",
    });
  }

  // * checks for date and time in the past

  let formattedDate = new Date(`${reservation_date}T${reservation_time}`);

  if (Date.now() > Date.parse(formattedDate)) {
    return next({
      status: 400,
      message: "Error: reservation must be made for a future date and time.",
    });
  }

  // * checks for Tuesdays

  if (formattedDate.toString().slice(0, 3) === "Tue") {
    return next({
      status: 400,
      message:
        "We're closed on Tuesdays - check our hours for more information!",
    });
  }

  // * checks for business hours

  const hours = formattedDate.getHours();
  const minutes = formattedDate.getMinutes();
  if (hours <= 10) {
    if (minutes <= 30) {
      return next({
        status: 400,
        message:
          "We open at 10:30 AM - please fix your reservation accordingly.",
      });
    }
  }
  if (hours >= 21) {
    if (minutes >= 30) {
      return next({
        status: 400,
        message:
          "Our last reservations are for 9:30 PM - please fix your reservation accordingly.",
      });
    }
  }

  return next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.`,
    });
  }
  res.locals.reservation = reservation;
  return next();
}

function validateStatus(req, res, next) {
  const options = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (!options.includes(status)) {
    return next({
      status: 400,
      message:
        "Error: unknown status; must be one of the following: booked, seated, or finished.",
    });
  }
  res.locals.status = status;
  return next();
}

function validateFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "Error: cannot change a finished reservation.",
    });
  }
  return next();
}

function validateBooked(req, res, next) {
  const { status } = res.locals.reservation;
  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `Error: cannot book reservation with status of ${status}. Initial status must be "booked".`,
    });
  }
  return next();
}

function validateUpdate(req, res, next){
  const { status } = res.locals.reservation;
  if(status !== "booked") {
    return next({
      status: 400,
      message: "Error: can only update reservation with a status of 'booked.'"
    })
  }
  return next();
}

async function list(req, res, next) {
  const today = new Date().toISOString().slice(0, 10);
  let { date = today, mobile_number } = req.query;
  let reservations = null;
  if (mobile_number) {
    reservations = await service.search(mobile_number);
  } else {
    reservations = await service.list(date);
  }
  res.json({
    data: [...reservations],
  });
}

async function create(req, res, next) {
  const data = await service.create(res.locals.reservation);
  res.status(201).json({ data });
}

async function read(req, res, next) {
  res.json({ data: res.locals.reservation });
}

async function status(req, res, next) {
  const { reservation, status } = res.locals;
  const data = await service.status(reservation, status);
  res.json({ data });
}

async function update(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const reservation = req.body.data;
  let data = await service.update(reservation_id, reservation)
  if(res.locals.reservation.status !== reservation.status){
    data = await service.status(data, data.status);
  }
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasProperties,
    validatePeople,
    validateResDateAndTime,
    validateBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  status: [
    asyncErrorBoundary(reservationExists),
    validateStatus,
    validateFinished,
    asyncErrorBoundary(status),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasData,
    hasProperties,
    validatePeople,
    validateResDateAndTime,
    validateUpdate,
    asyncErrorBoundary(update)
  ],
};
