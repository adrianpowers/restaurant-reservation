const knex = require("../db/connection");

function list(date){
  return knex("reservations")
    .select("*")
    .where({ "reservation_date": date })
    .whereNot({ "status": "finished" })
    .orderBy("reservation_time");
}

function create(reservation){
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then(reservations => reservations[0]);
}

function read(reservation_id){
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .first();
}

function status(reservation, status){
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation.reservation_id })
    .update({ status })
    .returning("*")
    .then(reservations => reservations[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function update(reservation_id, reservation){
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update(reservation, "*")
    .returning("*")
    .then(reservations => reservations[0]);
}

module.exports = {
  list,
  create,
  read,
  status,
  search,
  update
}