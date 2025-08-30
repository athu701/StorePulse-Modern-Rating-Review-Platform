const knex = require("knex");
const knexConfig = require("../knexfile");

const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);
console.log("connect to db");
module.exports = db;
