import { create } from 'zustand';
import { Session } from 'openvidu-browser';

interface Detail {
  detectId: number;
  memberId: number;
  detectName: number;
  detectTime: Date;
}

interface ViduState {
  // 접속 세션 저장
  session: Session | undefined;
  setSession: (session: Session | undefined) => void;

  // 감지 값 저장
  detectValue: number;
  setDetectValue: (value: number) => void;

  // 비디오 객체 저장
  videoRef: HTMLDivElement | null;
  setVideoRef: (video: HTMLDivElement) => void;

  // 세션 ID 저장
  sessionID: string;
  setSessionID: (id: string) => void;

  // 감지 시간, 감지 동작 목록 저장
  detailData: Detail[];
  setDetailData: (value: Detail) => void;
}

const useViduStore = create<ViduState>((set) => ({
  session: undefined,
  setSession: (session) => set({ session: session }),

  detectValue: 0,
  setDetectValue: (value) => set(() => ({ detectValue: value })),

  videoRef: null,
  setVideoRef: (video) => set(() => ({ videoRef: video })),

  sessionID: '',
  setSessionID: (id) => set(() => ({ sessionID: id })),

  detailData: [],
  setDetailData: (newDetail) =>
    set((state) => ({
      detailData: [...state.detailData, newDetail],
    })),
}));

export default useViduStore;
