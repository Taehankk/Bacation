import create from 'zustand';
import axios from 'axios';

// UserInfo 인터페이스 : 사용자 정보와 관련된 상태를 정의
interface UserInfo {
  id: string;
  email: string;
  nickname: string;
  profileImage: string;
  isLogin: boolean;
  registDate?: string; 
}

// BabyInfo 인터페이스 : 아기 정보와 관련된 상태를 정의
interface BabyInfo {
  babyName: string;
  babyGender: string;
  babyBirthdate: string;
}

// 통합된 상태 인터페이스 정의: Zustand 스토어에서 관리할 모든 상태와 함수들을 정의
interface AppState {
  userInfo: UserInfo;                           
  setUserInfo: (userInfo: Partial<UserInfo>) => void; // 부분 업데이트를 허용하는 함수
  clearUserInfo: () => void;                    
  restoreUserInfo: () => Promise<void>;         

  babyInfo: BabyInfo;                           
  setBabyInfo: (babyInfo: BabyInfo) => void;    
}

// 초기 상태 정의: 사용자와 아기 정보를 초기화하기 위한 기본 상태 정의
const initialUserState: UserInfo = {
  id: '',
  email: '',
  nickname: '',
  profileImage: '',
  isLogin: false,
  registDate: '', 
};

const initialBabyState: BabyInfo = {
  babyName: '',
  babyGender: '',
  babyBirthdate: '',
};

// Zustand를 사용하여 통합된 상태 생성: 사용자와 아기 정보를 관리하는 Zustand 스토어 생성
export const useUserStore = create<AppState>((set) => ({
  // 사용자 정보 상태 초기화
  userInfo: initialUserState,

  // 사용자 정보를 설정하는 함수
  setUserInfo: (userInfo) => {
    set((state) => ({ userInfo: { ...state.userInfo, ...userInfo } })); // 기존 상태와 병합하여 업데이트
  },

  // 사용자 정보를 초기 상태로 되돌리는 함수
  clearUserInfo: () => {
    set({ userInfo: initialUserState }); // 초기 상태로 사용자 정보 초기화
  },

  // 기존 상태 관리 코드에서 restoreUserInfo 함수 수정
  restoreUserInfo: async () => {
    try {
      // 서버로부터 사용자 정보 요청
      const response = await axios.get('https://i11b307.p.ssafy.io/api/v1/member/info');

      // 서버로부터 받은 사용자 정보로 상태 설정
      const data = response.data;
      set({
        userInfo: {
          id: data.memberId,
          email: data.email,
          nickname: data.nickname,
          profileImage: data.profileImgUrl,
          isLogin: true,
          registDate: data.registDate, 
        },
      });
    } catch (error) {
      console.error('Error restoring user info:', error);
      set({ userInfo: initialUserState }); // 오류 발생 시 초기 상태로 복원
    }
  },

  // 아기 정보 상태 초기화
  babyInfo: initialBabyState,

  // 아기 정보를 설정하는 함수: 새로 받은 아기 정보를 상태에 저장
  setBabyInfo: (babyInfo) => set({ babyInfo }), // 상태 업데이트
}));
