import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => {
    setStep(step + 1);
  };

  const skipOnboarding = () => {
    navigate('/login'); 
  };

  const pages = [
    {
      title: "눈에 넣어도 안 아플 아이<br />하지만 힘들지는 않으신가요?",
      description: "서비스를 사용해 자기만의 시간을 확보해요.<br />할 일이 있을때는 서비스를 활용해 <br />집중할 시간을 가져요.",
      button: "다음으로"
    },
    {
      title: "안전한 아이의 활동을 위한<br />서비스,<span class='text-[#FD5900]'>베케이션</span>",
      description: "베이비+베케이션의 합성어로<br />아이 걱정을 하기 힘들 때는 쉬면서<br />더욱 건강한 아이와의 생활을 도와줘요.",
      button: "사용설명 보기"
    }
  ];

  return (
    <div className="container mx-auto p-4 max-w-xl h-screen flex flex-col justify-between">
      <div className="flex justify-center mt-8 space-x-2">
        {pages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              step === index + 1 ? 'bg-gray-500' : 'bg-gray-200'
            }`}
            onClick={() => setStep(index + 1)}
          />
        ))}
      </div>

      <div className="flex-grow flex flex-col justify-center text-left mx-8">
        <h2 className="text-2xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: pages[step - 1].title }}></h2>
        <p className="text-m font-semibold text-gray-400 mb-8" dangerouslySetInnerHTML={{ __html: pages[step - 1].description }}></p>
        <img src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/babymobile.png" alt="baby mobile" className="image mx-auto mb-8" style={{ width: '240px' }}/>
      </div>

      {step === 1 ? (
        <div className="text-center mb-8">
          <button onClick={nextStep} className="button bg-gray-500 text-white py-3 px-4 rounded-lg w-80">
            {pages[step - 1].button}
          </button>
        </div>
      ) : (
        <div className="flex justify-center space-x-4 mb-8 w-80 mx-auto">
          <button onClick={() => navigate('/usage-guide')} className="button bg-[#FD5900] text-white py-3 px-4 rounded-lg w-40">
            {pages[step - 1].button}
          </button>
          <button onClick={skipOnboarding} className="button bg-gray-500 text-white py-3 px-4 rounded-lg w-40">
            건너뛰기
          </button>
        </div>
      )}
    </div>
  );
}

export default Onboarding;
