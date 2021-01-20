# Translation Cacing

Stores the responses from Google Translate api to make the response time quicker. 


### Pasting the Google Translate Api Keys

```
Copy paste the content sent over mail in this file

config/
├── default.json

```

### Install server dependencies

```bash
npm install
```

### Run Express server

```bash
npm run server
```

## To test the Server Please open any API testing applications eg: Postman, etc..


### Hit the following end points to test the data

 To translate the given text into our required language

 - Use language codes mentioned in the google translate website

 To get know of all the supported Languages and Laguage codes visit following link
 [Google Translate Language Codes](https://cloud.google.com/translate/docs/languages) 

```
 http://localhost:4000/translate

 body:{
      "source_language": "Language code of the source language as supported by Google Translate",
      "target_language": "Language code of the source language as Supported by Google Translate",
      "source_text": "Any sentence you want to translate"
    }
```
