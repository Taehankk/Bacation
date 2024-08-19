importScripts(
  "https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js"
);

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDHAnluW822aeAOU1QxL6J07WrfPhPL19U",
  authDomain: "bacation-23464.firebaseapp.com",
  projectId: "bacation-23464",
  storageBucket: "bacation-23464.appspot.com",
  messagingSenderId: "567893168351",
  appId: "1:567893168351:web:8497f1e6959679eab0996a",
  measurementId: "G-E6CNJFB76L"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notification = payload.notification;

  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    notification
  );

  const notificationTitle = notification.title;
  const notificationOptions = {
    body: notification.body,
    icon: "/firebase-logo.png", // 루트 경로 기준으로 접근
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});