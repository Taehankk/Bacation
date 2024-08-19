import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../../store/useUserStore';

const ChildInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const setBabyInfo = useUserStore((state) => state.setBabyInfo);

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  const handleNext = async () => {
    let isValid = true;
    const selectedDate = new Date(birthDate);
    const currentDate = new Date();

    // 이름 길이 검증
    if (!name || name.length > 15) {
      setNameError('이름은 15자 이하로 입력해주세요.');
      isValid = false;
    } else {
      setNameError(null);
    }

    // 성별 선택 검증
    if (!gender) {
      setGenderError('성별을 선택해주세요.');
      isValid = false;
    } else {
      setGenderError(null);
    }

    // 생일이 미래 날짜인 경우 경고 메시지 표시
    if (!birthDate || selectedDate > currentDate) {
      setBirthDateError('생일은 미래 날짜로 설정할 수 없습니다.');
      isValid = false;
    } else {
      setBirthDateError(null);
    }

    if (!isValid) {
      setIsModalOpen(true); // 유효성 검사를 통과하지 못하면 모달을 띄움
      return;
    }

    try {
      const babyInfo = {
        babyName: name,
        babyGender: gender === '남',
        babyBirthdate: birthDate,
      };

      console.log("Sending baby info:", babyInfo);

      const saveResponse = await axios.post('https://i11b307.p.ssafy.io/api/v1/baby/save', babyInfo, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Baby Info Save Success:', saveResponse.data);

      setBabyInfo({
        babyName: name,
        babyGender: gender,
        babyBirthdate: birthDate,
      });

      const alarmResponse = await axios.get('https://i11b307.p.ssafy.io/api/v1/active/alarm');

      console.log('Alarm Info:', alarmResponse.data);

      navigate('/permission');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center mt-16 mb-16">
        <img src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/child-head.png" alt="아이 이미지" className="w-7 h-7 mr-2" />
        <h2 className="text-2xl font-bold">아이에 대해 알고 싶어요!</h2>
      </div>
      <form className="w-4/5 max-w-md">
        <div className="mb-8">
          <label className="block mb-2 font-semibold text-gray-700">
            이름
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="김아기"
              className="w-full mt-2 px-3 py-2 border-b border-gray-400 focus:outline-none"
            />
          </label>
          {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
        </div>
        <div className="mb-8">
          <label className="block mb-2 font-semibold text-gray-700">
            성별
            <div className="mt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setGender('남')}
                className={`w-1/2 mr-2 px-6 py-2 rounded-lg bg-white ${gender === '남' ? 'border-2 border-[#FD5900]' : 'border border-gray-400'}`}
              >
                남
              </button>
              <button
                type="button"
                onClick={() => setGender('여')}
                className={`w-1/2 ml-2 px-6 py-2 rounded-lg bg-white ${gender === '여' ? 'border-2 border-[#FD5900]' : 'border border-gray-400'}`}
              >
                여
              </button>
            </div>
          </label>
          {genderError && <p className="text-sm text-red-500 mt-1">{genderError}</p>}
        </div>
        <div className="mb-3">
          <label className="block mb-2 font-semibold text-gray-700">
            생일
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full mt-2 px-3 py-2 border-b border-gray-400 focus:outline-none"
            />
          </label>
          {birthDateError && <p className="text-sm text-red-500 mt-1">{birthDateError}</p>}
        </div>
        <p className="text-sm text-gray-300 mb-40">아이 정보는 언제든 마이페이지에서 변경할 수 있습니다.</p>
        <div>
          <button
            type="button"
            onClick={handleNext}
            className="py-3 px-4 bg-[#FD5900] text-white rounded-lg w-80"
          >
            다음으로
          </button>
        </div>
      </form>

      {/* 모달창 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl max-w-xs w-full">
            <div className="p-10">
              <div className="flex items-center justify-center text-xl font-bold mb-10 text-gray-600">
                <img 
                  src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/child-head.png" 
                  alt="아이 이미지" 
                  className="w-5 h-5 mr-2" 
                />
                ?
              </div>
              <div className="text-center text-gray-700 mb-6">
                아이 정보를 입력해주세요.
              </div>
              <div
                onClick={closeModal} // 모달 닫기
                className="border-t border-gray-300 flex place-content-center py-6"
              >
                <button className="text-[#FD5900] font-semibold bg-transparent border-none">
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildInfoPage;
