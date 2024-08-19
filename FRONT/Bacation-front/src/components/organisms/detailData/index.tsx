import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

import useDataStore from '../../../store/useDataStore';

interface Detail {
  detectId: number;
  memberId: number;
  detectName: number;
  detectTime: Date;
}

interface Props {
  mode: string;
}

export const DetailData = ({ mode }: Props) => {
  const selectDate = useDataStore((state) => state.selectDate);
  const tempArr = useDataStore((state) => state.tempArr);

  const [selected, setSelected] = useState(
    format(tempArr[selectDate], 'yyyy-MM-dd'),
  );

  // 선택된 탭의 index 저장
  const tabIdx = useDataStore((state) => state.tabIdx);

  const [data, setData] = useState<Detail[] | null>(null);

  const url =
    tabIdx === '0'
      ? `https://i11b307.p.ssafy.io/api/v1/data/${mode}/list`
      : `https://i11b307.p.ssafy.io/api/v1/data/${mode}/total`;

  useEffect(() => {
    setSelected(format(tempArr[selectDate], 'yyyy-MM-dd'));
    axios
      .get(url, {
        params: { dateTime: selected },
      })
      .then((response) => {
        const transformedData = response.data.map((item: Detail) => ({
          ...item,
          detectTime: new Date(item.detectTime), // 문자열을 Date 객체로 변환
        }));
        setData(transformedData);
      })
      .catch((error) => {
        console.log('데이터를 받아오지 못했습니다.');
        console.log(error);
      });
  }, [selectDate]);

  return (
    <div className="w-full text-lg">
      {/* 데이터 출력 */}
      <div className="mb-4">
        <div
          className={`border-l-2 ${mode === 'day' ? 'border-[#FDDC3F]' : 'border-[#3864A7]'} p-4 space-y-2`}
        >
          {data && data.length > 0
            ? data.map((d, index) => (
                <div
                  className="flex space-x-5 px-10 py-3 place-items-center"
                  key={index}
                >
                  <p className="text-sm">
                    {d.detectTime.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="font-medium">
                    {d.detectName === 0
                      ? '낙상'
                      : d.detectName === 1
                        ? '충돌'
                        : d.detectName === 2
                          ? '끼임'
                          : d.detectName === 3
                            ? '뒤집기'
                            : '울음'}{' '}
                    발생
                  </p>
                </div>
              ))
            : ''}
        </div>
      </div>
    </div>
  );
};
