const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db_name = path.join(__dirname, "database", "apptest.db");
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'apptest.db'");
});

app.use(express.json({ extended: false }));
app.get("/", (req, res) => {
  res.send("Api success");
});
const PORT = process.env.PORT || 4000;
app.use("/translate", require("./api/translate"));
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
