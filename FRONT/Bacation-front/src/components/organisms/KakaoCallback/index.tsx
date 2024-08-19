import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../../../store/useUserStore';

const KakaoCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      axios
        .post(
          'https://i11b307.p.ssafy.io/api/receive/code',
          new URLSearchParams({
            code: code,
          }),
          {
            headers: headers,
          },
        )
        .then((response) => {
          const jwtToken = response.data.token;
          const isNewMemberResponse = response.data.isNewMember;

          decodeJWT(jwtToken, isNewMemberResponse);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [location.search]);

  const decodeJWT = async (token: string, isNewMemberResponse: boolean) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        'https://i11b307.p.ssafy.io/api/v1/jwt/decode',
        {
          headers: headers,
        },
      );

      const data = response.data;
      setUserInfo({
        id: data.memberId,
        email: data.email,
        nickname: data.nickname,
        profileImage: data.profileImgUrl,
        isLogin: true,
      });

      if (isNewMemberResponse) {
        navigate('/child-info');
      } else {
        navigate('/main');
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  };
  return (
    <div className="loader-wrapper">
      <div className="loader">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          className="star star1"
          viewBox="0 0 256 256"
        >
          <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          className="star star2"
          viewBox="0 0 256 256"
        >
          <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          className="star star3"
          viewBox="0 0 256 256"
        >
          <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
        </svg>
        <style>{`
          .loader-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
    
          .loader {
            user-select: none;
          }
    
          .star {
            opacity: 0;
            fill: #FFA500;
            animation: loader 2s infinite alternate;
          }
    
          .star2 {
            height: 20px;
            margin-left: -10px;
            animation-delay: 0.25s;
          }
    
          .star3 {
            height: 16px;
            margin-left: -15px;
            animation-delay: 0.5s;
          }
    
          @keyframes loader {
            0% {
              opacity: 0;
              transform: translateY(0) translateX(50px) rotate(0deg);
            }
            10% {
              opacity: 0;
              transform: translateY(0) translateX(50px) rotate(0deg);
            }
            100% {
              opacity: 1;
              transform: translateY(-20px) translateX(0) rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default KakaoCallback;
