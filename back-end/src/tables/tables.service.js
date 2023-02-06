const knex = require("../db/connection");

function list(date){
  return knex("tables")
    .select()
    .orderBy("table_name");
}

function create(table){
  return knex("tables")
    .insert(table)
    .returning("*")
    .then(tables => tables[0]);
}

// function read(table_id){
//   return knex("tables")
//     .select("*")
//     .where({ table_id })
//     .first();
// }

function read(table_id) {
  return knex("tables").select().where({ table_id }).first();
}

function update(table_id, reservation_id){
  return knex.transaction(function (trx) {
    return trx("tables")
      .where({ table_id })
      .update({ reservation_id })
      .returning("*")
      .then(() => {
        return trx("reservations")
          .where({ reservation_id })
          .update({ status: "seated" })
          .returning("*")
          .then((updatedRes) => updatedRes[0]);
      });
  });
}

module.exports = {
  list,
  create,
  read,
  update
}