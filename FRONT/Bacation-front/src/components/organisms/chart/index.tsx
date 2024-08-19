import {
  VictoryChart,
  VictoryPolarAxis,
  VictoryBar,
  VictoryTheme,
  VictoryLegend,
} from 'victory';
import { ChartModal } from '../chartModal';
import { addMinutes, differenceInMinutes, format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import useDataStore from '../../../store/useDataStore';
import useModalStore from '../../../store/useChartModalStore';
import { useEffect } from 'react';
import axios from 'axios';

export const ChartData = () => {
  // 차트에 불러올 데이터 저장 변수
  const dayData = useDataStore((state) => state.dayData);
  const setDayData = useDataStore((state) => state.setDayData);

  // 선택된 날짜의 배열 인덱스
  const selectDate = useDataStore((state) => state.selectDate);
  // 임시 저장된 날짜 배열
  const tempArr = useDataStore((state) => state.tempArr);
  // 선택된 날짜 포맷
  const selected = format(tempArr[selectDate], 'yyyy-MM-dd');

  useEffect(() => {
    axios
      .get('https://i11b307.p.ssafy.io/api/v1/data/list', {
        params: { dateTime: selected },
      })
      .then((response) => {
        setDayData(response.data);
      })
      .catch((error) => {
        console.log('데이터를 받아오지 못했습니다.');
        console.log(error);
      });
  }, [selected, setDayData, dayData.length]);

  // 차트에 그릴 값으로 변환
  const data = dayData.map((d) => ({
    x:
      differenceInMinutes(
        addMinutes(
          d.modeStartTime,
          differenceInMinutes(d.modeEndTime, d.modeStartTime) / 2,
        ),
        tempArr[selectDate],
      ) / 60,
    y: 24,
    time: differenceInMinutes(d.modeEndTime, d.modeStartTime) / 60,
    detectId: d.mode,
  }));

  // 선택한 차트 파이 부분의 index 저장 변수
  const setActiveIndex = useDataStore((state) => state.setActiveIndex);

  // modal 창 open 여부 boolean 변수
  const openModal = useModalStore((state) => state.openModal);
  const setOpenModal = useModalStore((state) => state.setOpenModal);

  return (
    <div className="w-full flex items-center justify-center bg-white-100">
      <div className="bg-white p-6">
        {/* 기록 자세히 보기 창으로 넘어가는 button */}
        <div className="float-right">
          <Link
            className="text-black text-sm hover:text-[#FD5900]"
            to={'/data/detail'}
          >
            기록 자세히 보기
            <FontAwesomeIcon icon={faAngleRight} className="ml-2" />
          </Link>
        </div>

        {/* 차트 부분 */}
        <div>
          <VictoryChart
            polar
            theme={VictoryTheme.material}
            domain={{ x: [0, 24], y: [0, 24] }}
            startAngle={90}
            endAngle={-270}
          >
            {/* LEGEND */}
            <VictoryLegend
              y={280}
              style={{ border: { stroke: 'none' } }}
              data={[
                { name: '수면', symbol: { fill: '#3864A7', type: 'square' } },
                { name: '활동', symbol: { fill: '#FDDC3F', type: 'square' } },
                { name: '수유', symbol: { fill: '#F2B6C6', type: 'square' } },
              ]}
            />

            {/* Axis 축 세팅(시계처럼) */}
            <VictoryPolarAxis
              tickValues={[0, 3, 6, 9, 12, 15, 18, 21]}
              labelPlacement="vertical"
              style={{
                tickLabels: {
                  padding: ({ text }) => (text <= 12 ? 15 : 20),
                  textAnchor: 'middle', // 수평 위치를 중앙으로 설정
                  verticalAnchor: 'middle', // 수직 위치를 중앙으로 설정
                },
                grid: { stroke: 'none' },
              }}
            />

            {/* 파이 차트 축에 맞게 삽입 */}
            {/* 파이 차트 클릭 시, 해당 파이 수정 모달 open */}
            <VictoryBar
              data={data}
              style={{
                data: {
                  fill: ({ datum }) =>
                    datum.detectId === 1
                      ? '#3864A7'
                      : datum.detectId === 0
                        ? '#FDDC3F'
                        : '#F2B6C6',
                  width: ({ datum }) => (datum.time / 24) * 400,
                },
              }}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onClick: (_, props) => {
                      setActiveIndex(props.index);
                      setOpenModal();
                      return [];
                    },
                  },
                },
              ]}
            />
          </VictoryChart>
        </div>
      </div>

      {/* modal open 시, TimeData 오픈 */}
      {openModal && (
        <div className="absolute flex items-center justify-center">
          <ChartModal />
        </div>
      )}
    </div>
  );
};
