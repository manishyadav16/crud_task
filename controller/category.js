const { Router } = require("express");
const categoryRoute = Router();
const path = require("path");
const db = require("../model/dbconn");

categoryRoute.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../views/html/category.html"));
});

categoryRoute.get("/get", (req, res) => {
  db.query(
    `select * from category order by id asc limit 8
    `,
    (e, r, f) => {
      if (e) {
        res.send([]);
      } else {
        res.send(r);
      }
    }
  );
});

categoryRoute.get("/get/:id/:direction", (req, res) => {
  console.log(req.params);
  const { id, direction } = req.params;
  if (direction == "right") {
    db.query(
      `select * from category where id>=? order by id asc limit 8
    `,
      [id],
      (e, r, f) => {
        if (e) {
          res.send([]);
        } else {
          res.send(r);
        }
      }
    );
  } else {
    db.query(
      `select * from category where id<=? order by id asc limit 8
    `,
      [id],
      (e, r, f) => {
        if (e) {
          res.send([]);
        } else {
          res.send(r);
        }
      }
    );
  }
});

categoryRoute.post("/add", (req, res) => {
  const { name } = req.body;

  db.query(
    `insert into category (name, inserted_on) values (?, NOW())
    `,
    [name],
    (e, r, f) => {
      if (e) {
        res.sendStatus(404);
      } else {
        res.send("category added successfully");
      }
    }
  );
});

categoryRoute.put("/update", (req, res) => {
  const { id, name } = req.body;

  db.query(
    `update category set name = ?, updated_on = NOW() where id = ?
    `,
    [name, id],
    (e, r, f) => {
      if (e) {
        res.sendStatus(404);
      } else {
        res.send("category added successfully");
      }
    }
  );
});

categoryRoute.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    `delete from category where id = ?
    `,
    [id],
    (e, r, f) => {
      if (e) {
        res.sendStatus(404);
      } else {
        res.send("category added successfully");
      }
    }
  );
});

categoryRoute.get("/pagination", (req, res) => {
  const { id } = req.params;

  db.query(
    `select count(1) as count from category 
    `,
    [id],
    (e, r, f) => {
      res.send(r[0]);
    }
  );
});

categoryRoute.get("/endpage", (req, res) => {
  db.query(
    `select * from ( select * from category order by id desc limit 8 ) var order by id asc
    `,
    (e, r, f) => {
      res.send(r);
    }
  );
});

module.exports = categoryRoute;
