import { create } from 'zustand';

interface ChartModalState {
  category: number;
  setCategory: (num: number) => void;
  startTimeValue: Date;
  setStartTimeValue: (time: Date) => void;
  finishTimeValue: Date;
  setFinishTimeValue: (time: Date) => void;
  openModal: boolean;
  setOpenModal: () => void;
}

const today = new Date();
const useModalStore = create<ChartModalState>((set) => ({
  // 수면(1), 활동(0), 수유(2) 선택 idx
  category: 1,
  setCategory: (num) => set(() => ({ category: num })),

  // 시작 시간
  startTimeValue: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ),
  setStartTimeValue: (time) => set(() => ({ startTimeValue: time })),

  // 종료 시간
  finishTimeValue: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ),
  setFinishTimeValue: (time) => set(() => ({ finishTimeValue: time })),

  // 모달 창 열림 설정
  openModal: false,
  setOpenModal: () => set((state) => ({ openModal: !state.openModal })),
}));

export default useModalStore;
