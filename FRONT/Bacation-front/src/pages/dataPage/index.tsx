import useDataStore from '../../store/useDataStore';
import { DayData } from '../../components/templates/dayData';
import { AnalysisData } from '../../components/organisms/analysisData';
import { DataPageTab } from '../../components/organisms/dataPageTab';
import { AddTimeButton } from '../../components/atoms/addTimeButton';
import { TopBar } from '../../components/atoms/topBar';

export const DataPage = () => {
  // 선택된 탭의 index 저장
  const tabIdx = useDataStore((state) => state.tabIdx);

  return (
    <div className="relative w-full overflow-auto mx-auto px-5">
      <div className="w-full mx-auto">
        {/* 이전 페이지 돌아가는 파트 */}
        <TopBar title={'기록된 데이터 보기'} />
        {/* 전환 탭 */}
        <DataPageTab />
      </div>

      {/* 탭 구성 요소 */}
      <div>
        {/* 일별 데이터 */}
        {tabIdx === '0' && <DayData />}

        {/* 데이터 분석 */}
        {tabIdx === '1' && (
          <div>
            <AnalysisData mode="night" date={new Date()} />
            <AnalysisData mode="day" date={new Date()} />
          </div>
        )}
      </div>

      {/* 시간 추가 버튼(일별 데이터에만 우측 하단 고정) */}
      <div className="fixed flex bottom-20 right-[calc((100vw-400px)/2)]">
        {tabIdx === '0' && <AddTimeButton />}
      </div>
    </div>
  );
};
