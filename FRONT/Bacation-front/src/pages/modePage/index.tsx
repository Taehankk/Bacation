import { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OpenViduSession } from '../../components/organisms/openViduSession';
import { useUserStore } from '../../store/useUserStore';
import useViduStore from '../../store/useViduStore';
import axios from 'axios';
import { SessionModal } from '../../components/organisms/sessionModal';
import useModeStore from '../../store/useModeStore';
import { AlarmSettingModal } from '../../components/organisms/alarmSettingModal';
import { ModeButton } from '../../components/organisms/modeButton';
import { CheckSetting } from '../../components/organisms/checkSetting';

interface Detail {
  detectId: number;
  memberId: number;
  detectName: number;
  detectTime: Date;
}

export const ModePage = () => {
  const locationNow = useLocation();
  const navigate = useNavigate();

  // 현재 모드
  const modename =
    locationNow.pathname === '/mode/active' ? '활동 모드' : '수면 모드';

  // 사용자 정보
  const userInfo = useUserStore((state) => state.userInfo);

  // 방 접속 시 필요한 세션 ID
  const sessionID = useViduStore((state) => state.sessionID);

  // 감지 값 detectValue
  const detectValue = useViduStore((state) => state.detectValue);
  const detectValueRef = useRef(detectValue);

  // 세션 id 확인 모달 창 open
  const isSessionOpen = useModeStore((state) => state.isSessionOpen);
  const isSettingOpen = useModeStore((state) => state.isSettingOpen);

  const setSession = useViduStore((state) => state.setSession);
  const startMode = useModeStore((state) => state.startMode);
  const setStartMode = useModeStore((state) => state.setStartMode);
  const endMode = useModeStore((state) => state.endMode);

  const [detailData, setDetailData] = useState<Detail[]>([]);

  useEffect(() => {
    setStartMode(new Date());
  }, []);

  useEffect(() => {
    detectValueRef.current = detectValue; // fallValue가 변경될 때마다 최신 값을 유지
  }, [detectValue]);

  // Interval 함수 정의
  const startInterval = () => {
    const interval = setInterval(() => {
      if (detectValueRef.current >= 70) {
        axios
          .post(
            `https://i11b307.p.ssafy.io/api/v1/${
              locationNow.pathname === '/mode/active' ? 'day' : 'night'
            }`,
            {
              memberId: userInfo.id,
              detectName:
                locationNow.pathname === '/mode/active' ? '낙상' : '뒤집기',
              detectValue: detectValueRef.current,
            },
          )
          .then((response) => {
            const newDetail: Detail = {
              detectId: response.data.detectId,
              memberId: response.data.memberId,
              detectName: response.data.detectName,
              detectTime: new Date(response.data.detectTime),
            };

            setDetailData((prevData) => [...prevData, newDetail]);
          });
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    }; // Clean up the interval
  };

  // useEffect에서 함수 호출
  useEffect(() => {
    const cleanup = startInterval();
    return cleanup; // Cleanup on unmount
  }, []); // Dependency array

  return (
    <div className="w-full mx-auto">
      {/* 뒤로가기 버튼 */}
      <div className="flex space-x-5 py-5 mb-3 px-3">
        <FontAwesomeIcon
          icon={faAngleLeft}
          className="mt-1"
          onClick={() => {
            endMode(setSession);
            navigate('/main');
          }}
        />
        <p className="text-lg font-semibold">{modename}</p>
      </div>

      {/* 영상이 들어가야 하는 부분 */}
      <div className="px-5 space-y-5 place-content-center">
        <div className=" w-full h-60 rounded-lg ">
          <OpenViduSession
            mySessionId={sessionID}
            myUserName={
              userInfo.nickname + `${Math.floor(Math.random() * 100)}`
            }
          />
        </div>

        {/* 오늘의 방, 켜진 알림 보기 버튼 */}
        <CheckSetting />

        {/* 활동 종료, 캡쳐 버튼 */}
        <ModeButton />

        <p className="font-semibold text-lg">지금까지 감지된 기록</p>

        <div className="w-full text-lg">
          {/* 데이터 출력 */}
          <div className="mb-4">
            <div
              className={`border-l-2 ${locationNow.pathname === '/mode/active' ? 'border-[#FDDC3F]' : 'border-[#3864A7]'} p-4 space-y-2`}
            >
              {detailData
                .filter((d) => {
                  return d.detectId !== -1 && d.detectTime > startMode;
                })
                .map((detail, index) => (
                  <div
                    key={index}
                    className="flex space-x-5 px-10 py-3 place-items-center"
                  >
                    <p className="text-sm">
                      {detail.detectTime.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="font-medium">
                      {detail.detectName === 0 ? '낙상' : '뒤집기'} 발생
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {/* 회원 정보 수정 모달 */}
      {isSettingOpen && <AlarmSettingModal />}
      {/* 세션 id 확인 모달 */}
      {isSessionOpen && <SessionModal />}
    </div>
  );
};
