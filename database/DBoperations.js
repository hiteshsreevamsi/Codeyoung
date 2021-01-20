const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/Cache.db');

/**
 *  Uncomment the following lines to see all the saved texts in the database.
 */
// const sql = "SELECT * FROM TranslatedTexts";
// db.all(sql, [], (err, rows) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log({ ...rows });
// });

module.exports = class DbOperations {

  // Creating a table if it does not exist whenever we are iniating a DbOperations class object
  constructor () {
    db.run(`CREATE TABLE IF NOT EXISTS TranslatedTexts (
            Text_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Source_Lang VARCHAR(100) NOT NULL,
            Target_Lang VARCHAR(100) NOT NULL,
            Source_Text TEXT,
            Target_Text TEXT
          )`);
  }

  // Saving the any new texts from the third party api responses
  SaveTexts (Source_Lang, Target_Lang, Source_Text, Target_Text, same) {
    let sql_insert;
    if (!same) {
      sql_insert = `INSERT INTO TranslatedTexts (Text_ID, Source_Lang, Target_Lang, Source_Text, Target_Text) VALUES
      (NULL, '${Source_Lang}', '${Target_Lang}',  '${Source_Text}', '${Target_Text}'),
      (NULL, '${Target_Lang}', '${Source_Lang}',  '${Target_Text}', '${Source_Text}');`;
    } else {
      sql_insert = `INSERT INTO TranslatedTexts (Text_ID, Source_Lang, Target_Lang, Source_Text, Target_Text) VALUES
    (NULL, '${Source_Lang}', '${Target_Lang}',  '${Source_Text}', '${Target_Text}');`;
    }

    db.run(sql_insert, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Successfully saved');
      return true;
    });
  }

  //Fetching the already existing texts in the database
  async GetSaved (Source_Lang, Target_Lang, Source_Text) {
    const sql = 'SELECT * FROM TranslatedTexts WHERE Source_Lang = ? AND Target_Lang = ? AND Source_Text = ?';
    const prom = new Promise((resolve, reject) => {
      try {
        db.all(sql, [Source_Lang, Target_Lang, Source_Text], (err, row) => {
          if (err) {
            reject(err);
            return console.error(err.message);
          }
          if (Array.isArray(row)) {
            resolve(row);
          }
        });
      } catch (err) {
        return console.error(err.message);
      }
    });

    return prom;
  }
};
