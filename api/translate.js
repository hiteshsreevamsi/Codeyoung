const express = require("express");
const route = express.Router();
const { check, validationResult } = require("express-validator");
const translate = require("../services/translateService");
const Db = require("../database/DBoperations");
var dbop = new Db();

route.post(
  "/",
  [
    check("source_language", "Source Language is required").not().isEmpty(),
    check("target_language", "Target Language is required").not().isEmpty(),
    check("source_text", "Text is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { source_language, target_language, source_text } = req.body;
    var data;
    try {
      data = dbop.GetSaved(source_language, target_language, source_text);
      console.log(data);
      if (data.length == 0) {
        const [resp] = await translate(
          source_text,
          source_language,
          target_language
        );
        console.log(resp);
        if (
          dbop.SaveTexts(
            source_language,
            target_language,
            source_text,
            resp[0].translatedText
          )
        ) {
          res.json({
            Source_Lang: source_language,
            Target_Lang: target_language,
            Source_Text: source_text,
            Target_Text: resp[0].translatedText,
          });
        }
      } else {
        res.json(data);
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("internal server error");
    }
  }
);

module.exports = route;
