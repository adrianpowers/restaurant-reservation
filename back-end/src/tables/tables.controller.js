const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res){
  const tables = await service.list();
  res.json({ data: [...tables] });
}

async function create(req, res){
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}