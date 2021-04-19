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
      "km": "km",
      "myBookings": "My Bookings",
      "selectedDateTime": "Selected date and time:",
      "referenceNumber": "Reference Number",
      "resource": "Resource",
      "startTime": "Start Time",
      "endTime": "End Time",
      "qrcode": "QR Code",
      "displayqrcode": "Display QR Code",
      "refresh": "Refresh",
      "delete": "Delete",
      "bookingDelete": "Delete Booking",
      "bookingDeleteMessage": "Are you sure that you want to delete this booking?",
      "edit": "Edit",
      "manage": "Manage",
      "loginFailed": "Login Failed",
      "loginFailedMessage": "Your login details were incorrect. Please try again.",
      "accountBanned": "Account Banned",
      "accountBannedMessage": "Your account is banned until ",
      "account": "Account",
      "settings": "Settings",
      "language": "Language",
      "avatar": "Avatar",
      "changeAvatar": "Change Avatar",
      "password": "Password",
      "currentPassword": "Current Password",
      "newPassword": "New Password",
      "confirmNewPassword": "Confirm New Password",
      "changePassword": "Change Password",
      "chooseImage": "Choose an image",
      "passwordBlank": "Please input your password!",
      "confirmPasswordBlank": "Please confirm your password!",
      "passwordNotMatch": "The two passwords that you entered do not match!",
      "changePasswordSuccess": "Change Password Success",
      "changePasswordSuccessMessage": "The password has changed successfully!",
      "oldPasswordDismatchMessage": "The old password you have entered is incorrect.",
      "defaultError": "Error",
      "defaultErrorMessage": "Some errors have occurred, please try again later.",
      "oldNewPasswordSame": "The old password and new password cannot be the same!",
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
      "categories": "資源分類",
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
      "km": "公里",
      "myBookings": "我的預訂",
      "selectedDateTime": "選定的日期和時間：",
      "referenceNumber": "參考編號",
      "resource": "資源",
      "startTime": "開始時間",
      "endTime": "結束時間",
      "qrcode": "二維碼",
      "displayqrcode": "顯示二維碼",
      "refresh": "刷新",
      "delete": "刪除",
      "bookingDelete": "刪除預訂",
      "bookingDeleteMessage": "您確定要刪除此預訂嗎？",
      "edit": "編輯",
      "manage": "管理",
      "loginFailed": "登錄失敗",
      "loginFailedMessage": "您的登錄資料不正確。請再試一次。",
      "accountBanned": "帳戶被禁止",
      "accountBannedMessage": "您的帳戶被禁止使用，直到",
      "account": "帳戶",
      "settings": "設定",
      "language": "語言",
      "avatar": "頭像",
      "changeAvatar": "更改頭像",
      "password": "密碼",
      "currentPassword": "當前密碼",
      "newPassword": "新密碼",
      "confirmNewPassword": "確認新密碼",
      "changePassword": "更改密碼",
      "chooseImage": "選擇一張圖片",
      "passwordBlank": "請輸入您的密碼！",
      "confirmPasswordBlank": "請確認您的密碼！",
      "passwordNotMatch": "您輸入的兩個密碼不匹配！",
      "changePasswordSuccess": "更改密碼成功",
      "changePasswordSuccessMessage": "密碼修改成功！",
      "oldPasswordDismatchMessage": "您輸入的舊密碼不正確。",
      "defaultError": "錯誤",
      "defaultErrorMessage": "發生了一些錯誤，請稍後再試。",
      "oldNewPasswordSame": "舊密碼和新密碼不能相同！",
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
      "categories": "资源分类",
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
      "km": "公里",
      "myBookings": "我的预订",
      "selectedDateTime": "选定的日期和时间：",
      "referenceNumber": "参考编号",
      "resource": "资源",
      "startTime": "开始时间",
      "endTime": "结束时间",
      "qrcode": "二维码",
      "displayqrcode": "展示二维码",
      "refresh": "刷新",
      "delete": "删除",
      "bookingDelete": "删除预订",
      "bookingDeleteMessage": "您确定要删除此预订吗？",
      "edit": "编辑",
      "manage": "管理",
      "loginFailed": "登录失败",
      "loginFailedMessage": "您的登录资料不正确。请再试一次。",
      "accountBanned": "帐户被禁止",
      "accountBannedMessage": "您的帐户被禁止使用，直到",
      "account": "帐户",
      "settings": "设定",
      "language": "语言",
      "avatar": "头像",
      "changeAvatar": "更改头像",
      "password": "密码",
      "currentPassword": "当前密码",
      "newPassword": "新密码",
      "confirmNewPassword": "确认新密码",
      "changePassword": "更改密码",
      "chooseImage": "选择一张图片",
      "passwordBlank": "请输入您的密码！",
      "confirmPasswordBlank": "请确认您的密码！",
      "passwordNotMatch": "您输入的两个密码不匹配！",
      "changePasswordSuccess": "更改密码成功",
      "changePasswordSuccessMessage": "密码修改成功！",
      "oldPasswordDismatchMessage": "您输入的旧密码不正确。",
      "defaultError": "错误",
      "defaultErrorMessage": "发生了一些错误，请稍后再试。",
      "oldNewPasswordSame": "旧密码和新密码不能相同！",
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
