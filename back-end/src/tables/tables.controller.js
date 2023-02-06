const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// ! VALIDATORS

function hasProperties(req, res, next) {
  const requiredProperties = ["table_name", "capacity"];
  const { data = {} } = req.body;
  requiredProperties.forEach((property) => {
    if (!data[property]) {
      return next({
        status: 400,
        message: `Table must include ${property}.`,
      });
    }
  });
  res.locals.data = data;
  return next();
}

function validate(req, res, next) {
  const { table_name, capacity } = res.locals.data;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: "Error: table_name must be at least two characters long.",
    });
  } else if (capacity < 1) {
    return next({
      status: 400,
      message: "Error: table must seat at least one person.",
    });
  } else if (typeof capacity != "number") {
    return next({
      status: 400,
      message: "Error: capacity must be a number.",
    });
  }
  return next();
}

function hasReservationId(req, res, next) {
  const { data = {} } = req.body;
  if (!data.reservation_id) {
    return next({
      status: 400,
      message: "Error: please include reservation_id to be seated.",
    });
  }
  res.locals.data = data;
  return next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = res.locals.data;
  const reservation = await reservationService.read(reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.`,
    });
  }
  res.locals.reservation = reservation;
  return next();
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if(!table){
    return next({
      status: 404,
      message: `Table ${req.params.table_id} cannot be found.`
    })
  }
  res.locals.table = table;
  return next();
}

function validateCapacity(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;
  if(people > capacity){
    return next({
       status: 400,
       message: "Error: this table has insufficient capacity!"
    })
  }
  return next();
}

function tableOccupied(req, res, next) {
  console.log(res.locals.table.reservation_id)
  const occupied = res.locals.table.reservation_id;
  if (occupied) {
    return next({ status: 400, message: "Error: table is occupied." });
  }
  return next();
}

async function list(req, res) {
  const tables = await service.list();
  res.json({ data: [...tables] });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res, next) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.reservation;
  const data = await service.update(table_id, reservation_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasProperties, validate, asyncErrorBoundary(create)],
  update: [
    hasReservationId,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(validateCapacity),
    asyncErrorBoundary(tableOccupied),
    asyncErrorBoundary(update),
  ],
};
