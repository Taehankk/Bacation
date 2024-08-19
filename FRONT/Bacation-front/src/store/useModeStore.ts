import { create } from 'zustand';
import { format, differenceInMinutes } from 'date-fns';
import axios from 'axios';
import { Session } from 'openvidu-browser';

interface Alarm {
  settingId: number;
  fallCaution: boolean;
  crashCaution: boolean;
  stuckCaution: boolean;
  reverseCaution: boolean;
  soundCaution: boolean;
}

interface ModeState {
  // 모달창 오픈
  isSettingOpen: boolean;
  setSettingOpen: (value: boolean) => void;
  isSessionOpen: boolean;
  setSessionOpen: (value: boolean) => void;

  // 알람 설정 정보
  alarmSetting: Alarm;
  setAlarmSetting: (value: Alarm) => void;

  // 모드 시작 시간
  startMode: Date;
  setStartMode: (value: Date) => void;
  // 모드 종료 시 실행 메서드
  endMode: (setSession: (session: Session | undefined) => void) => void;

  // 캡쳐하는 div 태그 객체
  divRef: React.RefObject<HTMLDivElement> | null;
  setDivRef: (value: React.RefObject<HTMLDivElement>) => void;

  // 캡쳐 팝업
  popUpOpen: boolean;
  setPopUpOpen: (value: boolean) => void;

  // sessionID 복사 팝업 창
  idCopy: boolean;
  setIdCopy: (value: boolean) => void;

  // url 복사 팝업 창
  urlCopy: boolean;
  setUrlCopy: (value: boolean) => void;
}

const useModeStore = create<ModeState>((set, get) => {
  return {
    isSettingOpen: false,
    setSettingOpen: (value) => set(() => ({ isSettingOpen: value })),
    isSessionOpen: true,
    setSessionOpen: (value) => set(() => ({ isSessionOpen: value })),

    alarmSetting: {
      settingId: 10,
      fallCaution: false,
      crashCaution: false,
      stuckCaution: false,
      reverseCaution: false,
      soundCaution: false,
    },
    setAlarmSetting: (value) => set(() => ({ alarmSetting: value })),

    startMode: new Date(),
    setStartMode: (value) => set(() => ({ startMode: value })),
    endMode: async (setSession) => {
      const { startMode, setSessionOpen } = get(); // 상태 가져오기

      if (differenceInMinutes(new Date(), startMode) > 5) {
        try {
          await axios
            .post('https://i11b307.p.ssafy.io/api/v1/data', {
              mode: window.location.pathname === '/mode/active' ? 0 : 1,
              startTime: format(startMode, 'yyyy-MM-dd HH:mm'),
              endTime: format(new Date(), 'yyyy-MM-dd HH:mm'),
            })
            .then(() => {
              setSession(undefined);
              setSessionOpen(true);
            });
        } catch (error) {
          console.log('데이터를 추가하지 못했습니다.');
          console.log(error);
        }
      }
    },

    divRef: null,
    setDivRef: (value) => set(() => ({ divRef: value })),

    popUpOpen: false,
    setPopUpOpen: (value) => set(() => ({ popUpOpen: value })),

    idCopy: false,
    setIdCopy: (value) => set(() => ({ idCopy: value })),

    urlCopy: false,
    setUrlCopy: (value) => set(() => ({ urlCopy: value })),
  };
});

export default useModeStore;
