import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Message from "./Message.json";
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = Message;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,

    detection: {
      lookupLocalStorage: 'selectedLanguage',
      order: ['path', 'localStorage'],
      lookupFromPathIndex: 0, // 0 = localhost:3000/zh-HK, 1 = localhost:3000/user/zh-HK
      //if navigate to / there's no language provided, use localStorage for now
      caches: ['localStorage'] //set exclusively to avoid confusion
    },

    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option


    fallbackLng: ['en'],    
    fallbackNS:'common',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;