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
      "agreeTos": "I agree to the terms and conditions.",
      "back": "Back",
      "next": "Next",
      "submit": "Submit",
      "selectResource": "Select resource",
      "selectTime": "Select time",
      "tos": "Terms & Conditions",
      "verifyBooking": "Verify booking",
      "bookingConfirmation": "Booking confirmation",
      "bookingReference": "Booking reference number",
      "bookingSuccess": "Booking Success",
      "bookingFailed": "Booking Failed",
      "bookingFailedMessage": "An error has occured, please try again.",
      "returnTo": "Return to",
      "myCalendar": "My Calendar",
      "reselectTime": "Reselect time",
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
      "agreeTos": "我同意這條款和條件。",
      "back": "返回",
      "next": "繼續",
      "submit": "提交",
      "selectResource": "選擇資源",
      "selectTime": "選擇時間",
      "tos": "條款和條件",
      "verifyBooking": "驗證預訂",
      "bookingConfirmation": "預訂結果",
      "bookingReference": "記錄編號",
      "bookingSuccess": "預訂成功",
      "bookingFailed": "預訂失敗",
      "bookingFailedMessage": "發生錯誤，請重試。",
      "returnTo": "回到",
      "myCalendar": "我的日曆",
      "reselectTime": "重新選擇時間",
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
      "agreeTos": "我同意这条款和条件。",
      "back": "返回",
      "next": "继续",
      "submit": "提交",
      "selectResource": "选择资源",
      "selectTime": "选择时间",
      "tos": "条款和条件",
      "verifyBooking": "确认预订",
      "bookingConfirmation": "预订结果",
      "bookingReference": "记录编号",
      "bookingSuccess": "预订成功",
      "bookingFailed": "预订失败",
      "bookingFailedMessage": "发生错误，请重试。",
      "returnTo": "回到",
      "myCalendar": "我的日历",
      "reselectTime": "重新选择时间",
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
