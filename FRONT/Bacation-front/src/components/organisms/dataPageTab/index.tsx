import useDataStore from '../../../store/useDataStore';

export const DataPageTab = () => {
  // 선택된 탭의 index 저장
  const tabIdx = useDataStore((state) => state.tabIdx);
  const setTabIdx = useDataStore((state) => state.setTabIdx);

  // 탭 클릭 시 id 변경
  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget as HTMLElement;
    if (target && target.id) {
      setTabIdx(target.id);
    } else {
      console.error('Element does not have an id');
    }
  };

  return (
    // 탭 선택 파트
    <div className="flex h-10 mb-4 justify-center items-center border-2 border-orgBg1 rounded-2xl">
      <div
        id={'0'}
        className={`w-full h-10 text-center rounded-xl px-4 py-2 cursor-pointer ${tabIdx === '0' ? 'bg-orgBg1 text-orange-600 text font-extrabold' : 'text-gray-500'}`}
        onClick={onClick}
      >
        일별 데이터
      </div>
      <div
        id={'1'}
        className={`w-full h-10 text-center rounded-xl px-4 py-2 cursor-pointer ${tabIdx === '1' ? 'bg-orgBg1 text-orange-600 font-extrabold' : 'text-gray-500'}`}
        onClick={onClick}
      >
        데이터 분석
      </div>
    </div>
  );
};
