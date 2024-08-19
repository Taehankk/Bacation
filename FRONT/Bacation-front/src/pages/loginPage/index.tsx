import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      if (userInfo.isLogin) {
        navigate('/main');
        return; 
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate('/child-info'); 
  };

  return (
    <div className="container mx-auto p-4 max-w-xl h-screen flex flex-col justify-between text-center">
      <h2 className="text-2xl font-bold mt-8">
        안전한 아이의 활동을 위한
        <br />
        서비스, <span className="text-[#FD5900]">베케이션</span>
      </h2>
      <p className="text-m text-gray-300 mt-4 mb-6">
        아이와 함께하는 시간을 더 안전하게
      </p>
      <div className="mx-auto mb-6 flex-grow flex items-center justify-center">
        <img
          src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/babymobile.png"
          alt="baby mobile"
          className="max-h-full"
          style={{ width: '80%', maxHeight: '300px' }}
        />
      </div>
      <div className="flex justify-center mb-8">
        <img 
          src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/kakao_login_large_narrow.png" 
          alt="카카오 로그인" 
          onClick={handleLogin} 
          style={{ cursor: 'pointer', width: '230px', height: 'auto' }} 
        />
      </div>
    </div>
  );
}

export default LoginPage;
