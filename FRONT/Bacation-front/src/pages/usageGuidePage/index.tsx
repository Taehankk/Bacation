import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const images = [
  'https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/useguide1.png',
  'https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/useguide2.png',
  'https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/useguide3.png',
];

const texts = [
  '원하는 알림을 설정해요.',
  '다양한 부가 기능을 활용해요.',
  '데이터 분석을 통한 내 아이의 상태 점검',
];

const UsageGuidePage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextContent = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const handleStart = () => {
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4 max-w-xl h-screen flex flex-col justify-between text-center">
      <h2 className="text-2xl font-bold mt-8">
        안전한 아이의 활동을 위한
        <br />
        서비스, <span className="text-[#FD5900]">베케이션</span>
      </h2>
    
      <p className="text-m text-gray-300 mt-4 mb-6">{texts[currentIndex]}</p>
     
      <div className="mx-auto mb-6 flex-grow flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt="Usage step"
          className="max-h-full"
          style={{ width: '80%', maxHeight: '300px' }}
        />
      </div>
      
      <div className="flex justify-center mb-8">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${index === currentIndex ? 'bg-gray-500' : 'bg-gray-200'}`}
          ></span>
        ))}
      </div>
      
      <div className="flex justify-center mb-8">
        {currentIndex === images.length - 1 ? (
          <button
            onClick={handleStart}
            className="bg-[#FD5900] text-white py-3 px-4 rounded-lg w-80"
          >
            시작하기
          </button>
        ) : (
          <button
            onClick={nextContent}
            className="bg-gray-500 text-white py-3 px-4 rounded-lg w-80"
          >
            다음으로
          </button>
        )}
      </div>
    </div>
  );
};

export default UsageGuidePage;
