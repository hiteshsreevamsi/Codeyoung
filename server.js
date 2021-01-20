// Imports the Express module
const express = require('express');

// Creates a client
const app = express();

//Imports the sqlite module for database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//Create an database when the server starts
const db_name = path.join(__dirname, 'database', 'Cache.db');
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'Cache.db'");
});

app.use(express.json({ extended: false }));
app.get('/', (req, res) => {
  res.send('Api success');
});
const PORT = process.env.PORT || 4000;

//Path to the Translate endpoint definition
app.use('/translate', require('./api/translate'));

//Starting the server on port 4000 in our local
const server = app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
module.exports = server;
