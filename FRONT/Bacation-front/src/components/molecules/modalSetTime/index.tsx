import { useEffect } from 'react';
import useDataStore from '../../../store/useDataStore';

import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import useModalStore from '../../../store/useChartModalStore';

interface Props {
  index: number | null;
}

export const ModalSetTime = ({ index }: Props) => {
  const data = useDataStore((state) =>
    index !== null ? state.dayData[index] : state.data,
  );

  // 시작, 종료 시간 저장 변수
  const startTimeValue = useModalStore((state) => state.startTimeValue);
  const setStartTimeValue = useModalStore((state) => state.setStartTimeValue);
  const finishTimeValue = useModalStore((state) => state.finishTimeValue);
  const setFinishTimeValue = useModalStore((state) => state.setFinishTimeValue);

  // 선택된 날짜의 배열 인덱스
  const selectDate = useDataStore((state) => state.selectDate);
  // 임시 저장된 날짜 배열
  const tempArr = useDataStore((state) => state.tempArr);

  useEffect(() => {
    // 추가 시, data 기본값 불러옴
    if (index !== null) {
      setStartTimeValue(new Date(data.modeStartTime));
      setFinishTimeValue(new Date(data.modeEndTime));
    } else {
      // 수정 시, 해당 index 의 데이터 불러옴
      setStartTimeValue(tempArr[selectDate]);
      setFinishTimeValue(tempArr[selectDate]);
    }
  }, []);

  // 시작 시간 변경
  const changeStartTime = (time: string | null) => {
    if (time !== null) {
      const [hours, minutes] = time.split(':');
      const updatedStartTime = new Date(startTimeValue);
      updatedStartTime.setHours(Number(hours), Number(minutes));
      setStartTimeValue(updatedStartTime);
      data.modeStartTime = updatedStartTime;
    }
  };

  // 종료 시간 변경
  const changeFinishTime = (time: string | null) => {
    if (time !== null) {
      const [hours, minutes] = time.split(':');
      const updatedFinishTime = new Date(finishTimeValue);
      updatedFinishTime.setHours(Number(hours), Number(minutes));
      setFinishTimeValue(updatedFinishTime);
      data.modeEndTime = updatedFinishTime;
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <TimePicker
        className="bg-gray-200 border border-gray-300 rounded-md p-2"
        onChange={(value) => {
          changeStartTime(value);
        }}
        format="a hh:mm"
        value={startTimeValue}
        required={true}
        clockIcon={false}
        disableClock={true}
        clearIcon={null}
      />
      <p className="text-gray-700">~</p>
      <TimePicker
        className="bg-gray-200 border border-gray-300 rounded-md p-2"
        onChange={(value) => {
          changeFinishTime(value);
        }}
        format="a hh:mm"
        value={finishTimeValue}
        required={true}
        clockIcon={false}
        disableClock={true}
        clearIcon={null}
      />
    </div>
  );
};
