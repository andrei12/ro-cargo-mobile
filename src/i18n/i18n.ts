import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importing translation files
import en from './locales/en.json';
import ro from './locales/ro.json';

const LANGUAGE_KEY = 'user-language';

const languageDetector = {
  type: 'languageDetector',
  async: true, // Use async detection
  detect: async (callback: (language: string) => void) => {
    const savedData = await AsyncStorage.getItem(LANGUAGE_KEY);
    callback(savedData || 'en'); // Default to 'en' if no language is stored
  },
  init: () => {}, // No initialization needed
  cacheUserLanguage: async (language: string) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  },
};

i18n
  .use(languageDetector as any) // Use the custom language detector
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    fallbackLng: 'en', // Fallback language if the current language translation is not available

    resources: {
      en: {
        translation: en,
      },
      ro: {
        translation: ro,
      },
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    returnNull: false,
  });

export default i18n;
