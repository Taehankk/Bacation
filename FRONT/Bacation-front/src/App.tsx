import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/organisms/navigation';
import KakaoCallback from './components/organisms/KakaoCallback';
import { DataPage } from './pages/dataPage';
import { MainPage } from './pages/mainPage';
import OnboardingPage from './pages/onboardingPage';
import UsageGuidePage from './pages/usageGuidePage';
import LoginPage from './pages/loginPage';
import InitialSettingsPage from './pages/initialSettingsPage';
import MyPage from './pages/myPage';
import { DetailPage } from './pages/detailPage';
import ChildInfoPage from './pages/childInfoPage';
import { DiaryPage } from './pages/diaryPage';
import { DiaryWrite } from './pages/diaryWritePage';
import { ModePage } from './pages/modePage';
import PermissionsPage from './pages/permissionPage';
import { useUserStore } from './store/useUserStore';
import { RoomInPage } from './pages/roomInPage';

function App() {
  // Zustand를 사용하여 상태 복원 함수 가져오기
  const restoreUserInfo = useUserStore((state) => state.restoreUserInfo);

  const location = useLocation();

  // 컴포넌트가 마운트될 때 사용자 정보를 복원하기 위해 restoreUserInfo 함수 호출
  useEffect(() => {
    restoreUserInfo();
  }, [restoreUserInfo]);

  // 로컬스토리지에서 userInfo를 확인
  const storedUserInfo = localStorage.getItem('userInfo');
  const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

  return (
    <div
      className={`${location.pathname === '/bacation/room' ? 'max-w-none' : 'w-[400px]'}`}
    >
      <div className="mb-20">
        <Routes>
          <Route
            path="/"
            element={
              userInfo && userInfo.isLogin ? (
                <Navigate to="/main" />
              ) : (
                <Navigate to="/onboarding" />
              )
            }
          />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/usage-guide" element={<UsageGuidePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<KakaoCallback />} />
          <Route path="/alarm" element={<InitialSettingsPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/data/detail" element={<DetailPage />} />
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/diary/write" element={<DiaryWrite />} />
          <Route path="/child-info" element={<ChildInfoPage />} />
          <Route path="/mode/active" element={<ModePage />} />
          <Route path="/mode/sleep" element={<ModePage />} />
          <Route path="/permission" element={<PermissionsPage />} />
          <Route path="/bacation/room" element={<RoomInPage />} />
        </Routes>
      </div>
      {location.pathname === '/bacation/room' ? '' : <Navbar />}
    </div>
  );
}

export default App;
