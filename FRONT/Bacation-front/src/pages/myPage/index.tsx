import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../../store/useUserStore';

interface UserInfo {
  id: string;
  email: string;
  nickname: string;
  profileImage: string;
  isLogin: boolean;
  registDate?: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const userInfo = useUserStore((state) => state.userInfo) as UserInfo;
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const restoreUserInfo = useUserStore((state) => state.restoreUserInfo);
  const babyInfo = useUserStore((state) => state.babyInfo);
  const setBabyInfo = useUserStore((state) => state.setBabyInfo);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [babyName, setBabyName] = useState('');
  const [babyGender, setBabyGender] = useState('');
  const [babyBirthdate, setBabyBirthdate] = useState('');
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await restoreUserInfo();
        const response = await axios.get(`https://i11b307.p.ssafy.io/api/v1/member/info`);
        setBabyInfo(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [restoreUserInfo, setBabyInfo]);

  const handleLogout = async () => {
    try {
      setUserInfo({
        id: '',
        email: '',
        nickname: '',
        profileImage: '',
        isLogin: false,
        registDate: '',
      });
      navigate('/onboarding');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUserInfo = async () => {
    let isValid = true;
    const selectedDate = new Date(babyBirthdate);
    const currentDate = new Date();

    if (!nickname || !babyName || !babyGender || !babyBirthdate) {
      setFormError('정보를 모두 입력해주세요.');
      isValid = false;
    } else {
      setFormError(null);
    }

    if (selectedDate > currentDate) {
      setBirthDateError('생일은 미래 날짜로 설정할 수 없습니다.');
      isValid = false;
    } else {
      setBirthDateError(null);
    }

    if (!isValid) return;

    try {
      const { data } = await axios.post(`https://i11b307.p.ssafy.io/api/v1/baby/save`, {
        babyName,
        babyGender: babyGender === '남',
        babyBirthdate,
        nickname,
      });

      setUserInfo({
        ...userInfo,
        nickname,
      });
      setBabyInfo(data);

      toggleModal();
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const toggleModal = () => {
    if (!isModalOpen) {
      setNickname(userInfo.nickname);
      setBabyName(babyInfo.babyName);
      setBabyGender(babyInfo.babyGender ? '남' : '여');
      setBabyBirthdate(babyInfo.babyBirthdate);
    }
    setModalOpen(!isModalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleDeleteAccount = () => {
    toggleDeleteModal();
    handleLogout();
  };

  return (
    <div className="mx-auto px-4 py-4 max-w-xl mt-20">
      <div className="flex items-center text-center mb-4">
        <img
          src={userInfo.profileImage || "https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/profile.jpg"}
          alt="Profile-image"
          className="w-24 h-24 rounded-full mr-4"
        />
        <div className="text-left flex-1">
          <h2 className="text-2xl font-bold mb-1">{userInfo.nickname || "사용자"}</h2>
          <p className="text-sm text-gray-500">{babyInfo.babyName || "김아기"} · {calculateBabyAge(babyInfo.babyBirthdate)}</p>
        </div>
        <img
          src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/setting.png"
          alt="Edit-profile"
          className="w-6 h-6 rounded-full cursor-pointer"
          onClick={toggleModal}
        />
      </div>

      <div className="my-6 bg-gray-100 p-4 rounded-lg flex items-center justify-center">
        <img src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/calendar.png" alt="calendar icon" className="h-6 w-6 mr-2" />
        <p>
          베케이션과 함께한 지 <span className="text-[#FD5900]">{calculateDaysTogether(userInfo.registDate || '')}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate('/data')}
          className="bg-orange-100 py-4 rounded-lg text-center">
          <img src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/data.png" alt="Data icon" className="h-6 w-6 mx-auto mb-2" />
          기록된 데이터 보기
        </button>

        <button
          onClick={() => navigate('/diary')}
          className="bg-blue-100 py-4 rounded-lg text-center">
          <img src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/diary.png" alt="Diary icon" className="h-6 w-6 mx-auto mb-2" />
          작성한 일기 보기
        </button>
      </div>

      <div className="space-y-4">
        <div className="mb-4 border-l-4 border-[#FD5900]">
          <div
            onClick={() => navigate('/permission')}
            className="bg-gray-100 p-4 rounded shadow-md cursor-pointer">
            설정
          </div>
        </div>

        <div className="mb-4 border-l-4 border-[#FD5900]">
          <div
            onClick={() => window.location.href = 'https://zippy-cake-826.notion.site/1274e0ceaef8415fa7efc4ea922e852d?pvs=4'}
            className="bg-gray-100 p-4 rounded shadow-md cursor-pointer">
            공지사항
          </div>
        </div> 

        <div className="mb-4 border-l-4 border-[#FD5900]">
          <div
            onClick={handleLogout}
            className="bg-gray-100 p-4 rounded shadow-md cursor-pointer">
            로그아웃
          </div> 
        </div> 
      </div>

      <div className="flex justify-center mt-40">
        <button
          onClick={toggleDeleteModal}
          className="text-gray-400 underline bg-transparent border-none">
          회원 탈퇴
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl max-w-xs w-full">
            <div className="p-10">
              <div className="text-xl font-bold mb-10 text-center text-gray-600">
                회원 정보 수정
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="사용자"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  maxLength={15}
                />
                
                <input
                  type="text"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  placeholder="김아기"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  maxLength={15}
                />
                
                <select
                  value={babyGender}
                  onChange={(e) => setBabyGender(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">성별</option>
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select>
                
                <input
                  type="date"
                  value={babyBirthdate}
                  onChange={(e) => setBabyBirthdate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {birthDateError && <p className="text-sm text-red-500">{birthDateError}</p>}
              </div>
              {formError && <p className="text-sm text-red-500 text-center mt-4">{formError}</p>}
            </div>
            <div
              onClick={updateUserInfo}
              className="border-t border-gray-300 flex place-content-center py-6"
            >
              <button className="text-[#FD5900] font-semibold bg-transparent border-none">
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl max-w-xs w-full p-8">
            <div className="text-center text-gray-600 text-lg font-bold mb-12">
              정말 탈퇴하시나요? ㅠ.ㅠ
            </div>
            <div className="flex justify-around mt-6">
            <button
                onClick={handleDeleteAccount}
                className="bg-gray-300 text-white px-4 py-2 rounded-lg">
                예
              </button>
              
              <button
                onClick={toggleDeleteModal}
                className="bg-[#FD5900] text-white px-4 py-2 rounded-lg">
                아니오
              </button>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;

const calculateBabyAge = (birthdate: string): string => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  const ageInMillis = today.getTime() - birthDate.getTime();
  const ageInMonths = Math.floor(ageInMillis / (1000 * 60 * 60 * 24 * 30.44));
  const ageInWeeks = Math.floor((ageInMillis / (1000 * 60 * 60 * 24 * 7)) % 4.34524);
  return `${ageInMonths}개월 ${ageInWeeks}주`;
};

const calculateDaysTogether = (registDate: string): string => { 
  if (!registDate) return '0일';

  const [year, month, day] = registDate.split('-').map(Number);
  const regist = new Date(year, month - 1, day);

  const today = new Date();
  const daysTogether = Math.floor((today.getTime() - regist.getTime()) / (1000 * 60 * 60 * 24));
  return `${daysTogether}일`;
};
