import { TopBar } from '../../components/atoms/topBar';
import { DetailData } from '../../components/organisms/detailData';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import useDataStore from '../../store/useDataStore';

export const DetailPage = () => {
  // 선택된 날짜의 배열 인덱스
  const selectDate = useDataStore((state) => state.selectDate);
  // 임시 저장된 날짜 배열
  const tempArr = useDataStore((state) => state.tempArr);
  // 선택된 날짜 포맷
  const selected = format(tempArr[selectDate], 'yyyy-MM-dd E', { locale: ko });

  return (
    <div>
      {/* 이전 페이지로 돌아가기 버튼 */}
      <TopBar title={'기록된 데이터 보기'} />
      <div className="text-lg font-bold">{selected}요일</div>
      <br />

      <span className="text-blue-600 font-semibold  ">수면</span>
      <span> 중 데이터</span>
      <DetailData mode="night" />

      <span className="text-yellow-600 font-semibold">활동</span>
      <span> 중 데이터</span>
      <DetailData mode="day" />
    </div>
  );
};
