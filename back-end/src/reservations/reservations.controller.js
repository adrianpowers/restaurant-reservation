/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  list,
};
/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const today = new Date();
  const { date = today } = req.query;
  const reservations = await service.list(date);
  res.json({
    data: [...reservations],
  });
}

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
  res.locals.data = data;
  return next();
}

function validatePeople(req, res, next) {
  const { people } = res.locals.data;
  if (typeof people !== "number") {
    return next({ status: 400, message: "Error: people must be a number." });
  }
  return next();
}

function validateResDate(req, res, next) {
  const { reservation_date } = res.locals.data;
  const dateRegex = /\d{4}\-\d{2}\-\d{2}/;
  if(!dateRegex.test(reservation_date)){
    return next({ status: 400, message: "Error: reservation_date must be a valid date. Use the format: YYYY-MM-DD."})
  }
  return next();
}

function validateResTime(req, res, next) {
  const { reservation_time } = res.locals.data;
  // const timeRegex = /\d{2}\:\d{2}\:\d{2}/;
  const timeRegex = /\d{2}\:\d{2}/;
  if(!timeRegex.test(reservation_time)){
    return next({ status: 400, message: "Error: reservation_time must be a valid time. Use the format: HH:MM:SS."})
  }
  return next();
}

async function create(req, res, next) {
  const data = await service.create(res.locals.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasProperties,
    validatePeople,
    validateResDate,
    validateResTime,
    asyncErrorBoundary(create),
  ],
};