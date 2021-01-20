//Importing the Database operations class
const Db = require('../database/DBoperations');

//Importing the Translation Service class
const Translate = require('../services/translateService');

//Importing check and validationResult functions to validate the input
const { check, validationResult } = require('express-validator');
const express = require('express');
const route = express.Router();

//Creating new instance of translation service
const translate = new Translate();

//Creating new instance of Database operations
const dbop = new Db();

/*
Post Endpoint to get the translated texts
path - '/translate'
params - {
  source_language : String (Language code as per Google Translate api)
  target_language : String (Language code as per Google Translate api) 
  source_text : String 
}
*/
route.post(
  '/',
  [
    check('source_language', 'Source Language is required').not().isEmpty(),
    check('target_language', 'Target Language is required').not().isEmpty(),
    check('source_text', 'Text is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { source_language, target_language, source_text } = req.body;
    let data;
    try {
      data = await dbop.GetSaved(source_language, target_language, source_text);
      if (data.length === 0) {
        const [resp] = await translate.translateText(
          source_text,
          source_language,
          target_language
        );
        const same = await translate.detectLanguage(
          target_language,
          source_text
        );
        dbop.SaveTexts(
          source_language,
          target_language,
          source_text,
          resp.translations[0].translatedText,
          same
        );

        res.json({
          Source_Lang: source_language,
          Target_Lang: target_language,
          Source_Text: source_text,
          Target_Text: resp.translations[0].translatedText,
        });
      } else {
        const [ans] = data;
        delete ans.Text_ID;
        res.json(ans);
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('internal server error');
    }
  }
);

module.exports = route;
