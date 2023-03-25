const mysqldb = require("mysql");
const db = mysqldb.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crudtask",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB connected successfully");
  }
});

module.exports = db;
