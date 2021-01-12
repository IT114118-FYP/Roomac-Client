import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "login": "Log in",
      "logout": "Log out",
      "welcome": "Welcome",
      "ok": "OK",
      "cancel": "Cancel",
      "logoutConfirmTitle": "Are you sure you want to log out?",
      "home": "Home",
      "categories": "Categories",
      "results": "results",
      "createBooking": "Create Booking",
    }
  },
  hk: {
    translation: {
      "login": "登錄",
      "logout": "登出",
      "welcome": "歡迎",
      "ok": "是",
      "cancel": "否",
      "logoutConfirmTitle": "您確定要登出嗎？",
      "home": "主頁",
      "categories": "分類目錄",
      "results": "結果",
      "createBooking": "預訂",
    }
  },
  cn: {
    translation: {
      "login": "登录",
      "logout": "登出",
      "welcome": "欢迎",
      "ok": "是",
      "cancel": "否",
      "logoutConfirmTitle": "您确定要登出吗？",
      "home": "主页",
      "categories": "分类目录",
      "results": "结果",
      "createBooking": "预订",
    }
  },
};

const i18nextLng = localStorage.getItem("i18nextLng") in resources ? localStorage.getItem("i18nextLng") : 'en'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: i18nextLng,
    fallbackLng: 'sp',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
