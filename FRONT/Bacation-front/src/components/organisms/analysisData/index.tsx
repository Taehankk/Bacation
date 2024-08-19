import { useEffect, useState } from 'react';
import axios from 'axios';
import useDataStore from '../../../store/useDataStore';
import { format } from 'date-fns';

interface Props {
  mode: string;
  date: Date;
}

export const AnalysisData = ({ mode }: Props) => {
  // 선택된 날짜의 인덱스
  const selectDate = useDataStore((state) => state.selectDate);
  // 임시 저장된 날짜 배열
  const tempArr = useDataStore((state) => state.tempArr);
  // 현재 선택된 날짜 포맷
  const selected = format(tempArr[selectDate], 'yyyy-MM-dd');

  const [manyDetects, setManyDetects] = useState<string[]>([]);
  const [detectCount, setDetectCount] = useState(0);

  // 선택된 탭의 index 저장
  const tabIdx = useDataStore((state) => state.tabIdx);

  const url =
    tabIdx === '0'
      ? `https://i11b307.p.ssafy.io/api/v1/data/${mode}`
      : `https://i11b307.p.ssafy.io/api/v1/data/${mode}/total`;

  useEffect(() => {
    axios
      .get(url, {
        params: { dateTime: selected },
      })
      .then((response) => {
        setManyDetects(response.data[0]);
        setDetectCount(response.data[1]);
      });
  }, [selected]);

  return (
    <div className="w-full flex-col justify-center content-center mt-3">
      <div className="">
        {/* 라벨 */}
        <p className="text-lg">
          <span
            className={`font-semibold ${mode === 'night' ? 'text-[#3864A7]' : 'text-[#FDDC3F]'}`}
          >
            {mode === 'night' ? '수면' : '활동'}
          </span>
          <span> 중 데이터</span>
        </p>

        {/* 데이터 출력 부분 */}
        <div
          className={`mb-4 border-l-4 bg-[#F6F8FA] p-4 ${mode === 'night' ? 'border-[#3864A7]' : 'border-[#FDDC3F]'}`}
        >
          <span className="block text-gray-700">
            평균 알림 횟수 약{' '}
            <span className="text-orange-600">{detectCount}회</span>
          </span>
          <span className="block text-gray-700">
            가장 많이 감지된 움직임은{' '}
            <span>
              <span className="text-orange-600">{manyDetects}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
