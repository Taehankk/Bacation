
import create from 'zustand';

// FCMStore 인터페이스 정의
interface FCMStore {
  fcmToken: string | null;
  setFCMToken: (token: string) => void;
}

// zustand 스토어 생성
export const useFCMStore = create<FCMStore>((set) => ({
  fcmToken: null,
  setFCMToken: (token: string) => set({ fcmToken: token }),
}));
