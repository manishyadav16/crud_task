const express = require("express");
const bodyParser = require("body-parser");
const categoryRoute = require("./controller/category");
const productRoute = require("./controller/product");
const db = require("./model/dbconn");

const app = express();

const port = 5000;

db.query(
  `
    create table if not exists category(
        id int primary key auto_increment,
        name varchar(60),
        inserted_on datetime,
        updated_on datetime
    )
    `,
  (e, r, f) => {
    if (e) {
      console.log(e);
    } else {
      console.log("CATEGORY TABLE CREATED");
    }
  }
);

db.query(
  `
    create table if not exists products(
        id int primary key auto_increment,
        name varchar(60) unique,
        price int,
        stock int,
        category int,
        inserted_on datetime,
        updated_on datetime,
        foreign key (category) references category(id)
    )
    `,
  (e, r, f) => {
    if (e) {
      console.log(e);
    } else {
      console.log("PRODUCTS TABLE CREATED");
    }
  }
);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/views"));

app.use("/", categoryRoute);
app.use("/product", productRoute);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
