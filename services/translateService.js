const config = require('config');
const { TranslationServiceClient } = require('@google-cloud/translate');

const CREDENTIALS = { ...config };
const translationClient = new TranslationServiceClient({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

module.exports = class TranslateService {
  translateText (text, source_language, target_language) {
    const location = 'global';
    // Construct request
    const request = {
      parent: `projects/${CREDENTIALS.project_id}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain', // mime types: text/plain, text/html
      sourceLanguage: source_language,
      targetLanguageCode: target_language,
    };

    try {
      const response = translationClient.translateText(request);
      return response;
    } catch (error) {
      return console.error(error.details);
    }
  }

  async detectLanguage (sourceLanguage_code, Translated) {
    const location = 'global';
    const request = {
      parent: `projects/${CREDENTIALS.project_id}/locations/${location}`,
      content: Translated,
    };

    try {
      const [response] = await translationClient.detectLanguage(request);

      return response[0].languageCode === sourceLanguage_code;
    } catch (error) {
      console.error(error.details);
    }
  }
};
