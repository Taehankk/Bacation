importScripts(
  "https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js"
);


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
