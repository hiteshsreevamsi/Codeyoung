const express = require("express");
const route = express.Router();
const { check, validationResult } = require("express-validator");
const translate = require("../services/translateService");
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
    try {
      const [resp] = await translate(
        source_text,
        source_language,
        target_language
      );
      console.log(resp);
      res.json(resp);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("internal server error");
    }
  }
);

module.exports = route;
