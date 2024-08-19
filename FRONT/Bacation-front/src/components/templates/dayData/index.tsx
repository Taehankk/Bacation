import Day from '../../organisms/day';
import { ChartData } from '../../organisms/chart';
import { AnalysisData } from '../../organisms/analysisData';

export const DayData = () => {
  return (
    <div className="relative">
      {/* 날짜 선택 */}
      <Day />
      {/* 차트 */}
      <ChartData />
      {/* 감지 데이터 */}
      <AnalysisData mode="night" date={new Date()} />
      <AnalysisData mode="day" date={new Date()} />
    </div>
  );
};
