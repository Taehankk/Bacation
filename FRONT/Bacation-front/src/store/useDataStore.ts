import { create } from 'zustand';

interface Data {
  memberDataId: number;
  memberId: number;
  mode: number;
  modeStartTime: Date;
  modeEndTime: Date;
}

interface DataState {
  // 탭 선택 인덱스
  tabIdx: string;
  setTabIdx: (index: string) => void;

  // 수면, 활동, 수유 데이터 하나 저장
  data: Data;
  setData: (data: Data) => void;

  // 하루 데이터 전체 저장
  dayData: Data[];
  setDayData: (data: Data[]) => void;
  // 데이터 하나 수정
  fetchDayData: (index: number, data: Data) => void;
  // 데이터 하나 추가
  addDayData: (data: Data) => void;

  // 날짜 임시 저장 배열
  tempArr: Date[];
  setTempArr: (dateArr: Date[]) => void;

  // 선택한 날짜 인덱스
  selectDate: number;
  setSelectDate: (index: number) => void;

  // 스크롤 위치 저장
  scrollY: number | undefined;
  setScrollY: (num: number) => void;

  // 선택한 차트 인덱스 저장
  activeIndex: number | null;
  setActiveIndex: (num: number | null) => void;
}

// 오늘 날짜 설정 위한 today 변수
const today = new Date();

const useDataStore = create<DataState>((set) => ({
  // 데이터 페이지 tab index 저장
  tabIdx: '0',
  setTabIdx: (idx) => set(() => ({ tabIdx: idx })),

  // data 하나
  data: {
    memberDataId: -1,
    memberId: -1,
    mode: 1,
    modeStartTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ),
    modeEndTime: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ),
  },
  setData: (data) => set(() => ({ data: data })),

  // 백에서 불러온 하루 동안의 정보
  dayData: [],
  setDayData: (data) => set(() => ({ dayData: data })),

  // 데이터 수정 함수
  fetchDayData: (index, data) =>
    set((state) => ({
      dayData: state.dayData.map((d, i) => (i === index ? data : d)),
    })),

  // 데이터 추가 함수
  addDayData: (data) =>
    set((state) => ({
      dayData: [...state.dayData, data],
    })),

  // 날짜 임시 저장 배열
  tempArr: [new Date(today.getFullYear(), today.getMonth(), today.getDate())],
  setTempArr: (dateArr) => set(() => ({ tempArr: dateArr })),

  // 선택한 날짜의 배열 index
  selectDate: 0,
  setSelectDate: (idx) => set(() => ({ selectDate: idx })),

  // 무한스크롤 위치 저장
  scrollY: 0,
  setScrollY: (num) => set(() => ({ scrollY: num })),

  // chart 에서 사용하는 bar 의 index
  activeIndex: null,
  setActiveIndex: (num) => set(() => ({ activeIndex: num })),
}));

export default useDataStore;
