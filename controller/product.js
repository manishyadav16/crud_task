const { Router } = require("express");
const productRoute = Router();
const path = require("path");
const db = require("../model/dbconn");

productRoute.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../views/html/product.html"));
});

productRoute.get("/get", (req, res) => {
  db.query(
    `select p.id, p.name, p.price, p.stock, c.name as category, p.inserted_on, p.updated_on 
      from products p join category c on c.id = p.category
      order by id asc limit 8
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

productRoute.get("/get-categories", (req, res) => {
  db.query(
    `select id,name from category
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

productRoute.get("/get/:id/:direction", (req, res) => {
  console.log(req.params);
  const { id, direction } = req.params;
  if (direction == "right") {
    db.query(
      `select * from products where id>=? order by id asc limit 8
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
      `select * from products where id<=? order by id asc limit 8
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

productRoute.post("/add", (req, res) => {
  const { name, price, stock, category } = req.body;

  db.query(
    `insert into products (name,price,stock,category,inserted_on) values (?,?,?,?, NOW())
    `,
    [name, parseInt(price), parseInt(stock), parseInt(category)],
    (e, r, f) => {
      if (e) {
        console.log(e);
        res.sendStatus(404);
      } else {
        res.send("product added successfully");
      }
    }
  );
});

productRoute.put("/update", (req, res) => {
  const { id, name, price, stock, category } = req.body;

  db.query(
    `update products set name = ?, price=?, stock=?, category=?, updated_on = NOW() where id = ?
    `,
    [name, price, stock, category, id],
    (e, r, f) => {
      if (e) {
        res.sendStatus(404);
      } else {
        res.send("product added successfully");
      }
    }
  );
});

productRoute.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    `delete from products where id = ?
    `,
    [id],
    (e, r, f) => {
      if (e) {
        res.sendStatus(404);
      } else {
        res.send("product added successfully");
      }
    }
  );
});

productRoute.get("/pagination", (req, res) => {
  const { id } = req.params;

  db.query(
    `select count(1) as count from products 
    `,
    [id],
    (e, r, f) => {
      res.send(r[0]);
    }
  );
});

productRoute.get("/endpage", (req, res) => {
  db.query(
    `select * from ( select * from products order by id desc limit 8 ) var order by id asc
    `,
    (e, r, f) => {
      res.send(r);
    }
  );
});

module.exports = productRoute;
'1'