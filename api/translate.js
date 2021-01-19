const Db = require('../database/DBoperations');
const Translate = require('../services/translateService');
const { check, validationResult } = require('express-validator');
const express = require('express');
const route = express.Router();
const translate = new Translate();
const dbop = new Db();

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
