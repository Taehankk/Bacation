import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IphoneButton from '../../components/organisms/button/iphoneButton';

export const InitialSettingsPage: React.FC = () => {
  const [reverseCaution, setReverseCaution] = useState(false); 
  const [soundCaution, setSoundCaution] = useState(false); 

  const [fallCaution, setFallCaution] = useState(false); 
  const [crashCaution, setCrashCaution] = useState(false); 
  const [stuckCaution, setStuckCaution] = useState(false); 

  const [isNightMode, setIsNightMode] = useState(true); 

  const navigate = useNavigate();

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    setter(prev => !prev);
  };

  const handleNext = () => {
    if (isNightMode) {
      saveSettings(true); 
      setIsNightMode(false); 
    } else {
      saveSettings(false); 
      navigate('/main'); 
    }
  };

  const handlePrevious = () => {
    if (isNightMode) {
      navigate('/permission'); 
    } else {
      setIsNightMode(true); 
    }
  };

  const saveSettings = async (isNightMode: boolean) => {
    try {
      let settings;
      let url;

      if (isNightMode) {
        settings = {
          reverseCaution: reverseCaution,
          soundCaution: soundCaution,
        };

        url = 'https://i11b307.p.ssafy.io/api/v1/active/alarm/night';
      } else {
        settings = {
          fallCaution: fallCaution,
          crashCaution: crashCaution,
          stuckCaution: stuckCaution,
        };

        url = 'https://i11b307.p.ssafy.io/api/v1/active/alarm/day';
      }

      await axios({
        method: 'PATCH',
        url: url,
        data: settings,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error saving settings:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className="mx-auto px-4 py-4 max-w-xl mt-16">
      <h2 className="text-center text-2xl font-bold mb-10">
        {isNightMode ? '수면모드 알림을 설정할까요?' : '활동 모드 알림을 설정할까요?'}
      </h2>
      <p className="text-center font-medium text-gray-500">
        <span className='text-[#FD5900]'>
          {isNightMode ? '누워있는 아이를 위쪽에서 정면으로 ' : '아이의 활동 반경이 '}
        </span>
        {isNightMode ? '촬영해 주세요.' : '가이드 영역 안에 있어야 합니다.'}
      </p>
      <div className="flex justify-center">
        <img
          src={isNightMode ? "https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/guide-night.png" : "https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/guide-day.png"}
          alt="Camera view"
          className="rounded-lg"
          style={{ width: '340px' }}
        />
      </div>
      <div className="mx-auto" style={{ width: '340px' }}>
        <div className="space-y-6">
          {isNightMode ? (
            <>
              <div className="flex justify-between items-center mt-16">
                <span className="text-lg font-medium">뒤집기 알림</span>
                <IphoneButton
                  isChecked={reverseCaution}
                  onToggle={handleToggle(setReverseCaution)}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">울음 소리 알림</span>
                <IphoneButton
                  isChecked={soundCaution}
                  onToggle={handleToggle(setSoundCaution)}
                />
              </div>
              
              <div className="h-8"></div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mt-16">
                <span className="text-lg font-medium">낙상 감지 알림</span>
                <IphoneButton
                  isChecked={fallCaution}
                  onToggle={handleToggle(setFallCaution)}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">충돌 감지 알림</span>
                <IphoneButton
                  isChecked={crashCaution}
                  onToggle={handleToggle(setCrashCaution)}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">끼임 감지 알림</span>
                <IphoneButton
                  isChecked={stuckCaution}
                  onToggle={handleToggle(setStuckCaution)}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between mt-20">
          <button
            className="bg-gray-500 text-white py-3 px-6 rounded-lg w-40"
            onClick={handlePrevious}
          >
            이전
          </button>
          {isNightMode ? (
            <button
              className="bg-[#FD5900] text-white py-3 px-6 rounded-lg w-40"
              onClick={handleNext}
            >
              다음으로
            </button>
          ) : (
            <button
              className="bg-[#FD5900] text-white py-3 px-6 rounded-lg w-40"
              onClick={handleNext}
            >
              활동 시작
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialSettingsPage;
