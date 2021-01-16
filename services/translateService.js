const { TranslationServiceClient } = require("@google-cloud/translate");
const config = require("config");

const CREDENTIALS = { ...config };
const translationClient = new TranslationServiceClient({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});
function translateText(text, source_language, target_language) {
  const location = "global";
  // Construct request
  const request = {
    parent: `projects/${CREDENTIALS.project_id}/locations/${location}`,
    contents: [text],
    mimeType: "text/plain", // mime types: text/plain, text/html
    sourceLanguage: source_language,
    targetLanguageCode: target_language,
  };

  try {
    // Run request
    const response = translationClient.translateText(request);
    return response;
  } catch (error) {
    console.error(error.details);
    return error;
  }
}

module.exports = translateText;
