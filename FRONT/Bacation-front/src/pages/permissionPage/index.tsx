import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const PermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPermissionRequested, setIsPermissionRequested] = useState(false);

  const requestNotificationPermission = async () => {
    if (isPermissionRequested) {
      return;
    }

    setIsPermissionRequested(true);

    try {
      const currentToken = await getToken(messaging, { vapidKey: 'BATYL4mwHiao7OQxBpUxHf1cCBS_0_CVNnqCzb501SQI_YqZZcYZOp3eAYgI3nUViV2gRHTbqay1BTKavEKj5iQ' });
      if (currentToken) {
        console.log('Firebase Messaging Token:', currentToken); // 토큰 콘솔로그 추가

        if (Notification.permission === "granted") {
          alert('알람이 허용되었습니다.');
          navigate('/alarm');
        } else {
          alert('알람 허용되지 않음');
        }
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('messaging/permission-blocked')) {
        alert('알림 권한이 차단되었습니다. 브라우저 설정에서 알림 권한을 허용해주세요.');
      } else {
        console.error('An error occurred while retrieving token:', err);
      }
    } finally {
      setIsPermissionRequested(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/push.png"
          alt="알림 아이콘"
          className="w-20 h-20 mt-40 mb-6"
        />
        <h2 className="text-2xl font-bold mb-6 text-center">
          푸시 알림 받기
        </h2>
        <p className="text-gray-500 font-medium text-center mb-24">
          베케이션이 알림을 보내려고 해요.
          <br />
          아이의 상태에 따른 알림을 받아보세요!
        </p>
      </div>

      <button
        onClick={requestNotificationPermission}
        disabled={isPermissionRequested}
        className={`w-4/5 max-w-md py-3 ${isPermissionRequested ? 'bg-gray-400' : 'bg-[#FD5900]'} text-white rounded-lg text-center`}
      >
        {isPermissionRequested ? '알림 요청 중...' : '알림 받기'}
      </button>
      <Link
        to="/alarm"
        className="w-4/5 max-w-md py-3 text-gray-400 rounded-lg text-center underline"
      >
        나중에 받을게요.
      </Link>
    </div>
  );
};

export default PermissionsPage;
