const sqlite3 = require("sqlite3").verbose();
const path = require("path");

var db = new sqlite3.Database("./database/apptest.db");
const sql = "SELECT * FROM TranslatedTexts";
db.all(sql, [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }
  console.log([{ ...rows }]);
});
module.exports = class DbOperations {
  constructor() {
    db.run(`CREATE TABLE IF NOT EXISTS TranslatedTexts (
            Text_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Source_Lang VARCHAR(100) NOT NULL,
            Target_Lang VARCHAR(100) NOT NULL,
            Source_Text TEXT,
            Target_Text TEXT
          )`);
  }
  SaveTexts(Source_Lang, Target_Lang, Source_Text, Target_Text) {
    const sql_insert = `INSERT INTO TranslatedTexts (NULL, Source_Lang, Target_Lang, Source_Text, Target_Text) VALUES
  (${Source_Lang}, ${Target_Lang},  ${Source_Text},${Target_Text}),
  (${Target_Lang}, ${Source_Lang},  ${Target_Text},${Source_Text});`;
    console.log(sql_insert);
    db.run(sql_insert, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Successfully saved");
      return true;
    });
  }
  GetSaved(Source_Lang, Target_Lang, Source_Text) {
    const sql = `SELECT * FROM TranslatedTexts WHERE Source_Lang = ? AND Target_Lang = ? AND Source_Text = ?`;
    console.log(sql);
    db.all(sql, [Source_Lang, Target_Lang, Source_Text], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(row);
      return function data(row) {
        return { ...row };
      };
    });
  }
};
