import useDataStore from '../../../store/useDataStore';
import useModalStore from '../../../store/useChartModalStore';
import { ModalSelectCategory } from '../../molecules/modalSelectCategory';
import { ModalSetTime } from '../../molecules/modalSetTime';
import axios from 'axios';
import { format } from 'date-fns';

export const ChartModal = () => {
  // 파이 차트의 해당 index 저장 변수
  const index = useDataStore((state) => state.activeIndex);
  const setIndex = useDataStore((state) => state.setActiveIndex);

  // 수정 시, 전달되는 데이터
  // 새로운 시간 추가 시, 전달되는 데이터
  const addData = useDataStore((state) => state.addDayData);
  const fetchDayData = useDataStore((state) => state.fetchDayData);

  // 수정 시, 해당 index 의 데이터 불러옴
  // 추가 시, data 기본값 불러옴
  const data = useDataStore((state) =>
    index !== null ? state.dayData[index] : state.data,
  );

  // modal 오픈 상태 저장 변수 boolean
  const setOpenModal = useModalStore((state) => state.setOpenModal);

  // 현재 체크한 category index 저장 변수
  const category = useModalStore((state) => state.category);

  // 시작, 종료 시간 저장 변수
  const startTimeValue = useModalStore((state) => state.startTimeValue);
  const finishTimeValue = useModalStore((state) => state.finishTimeValue);

  // 수정 or 추가 기능
  const updateCategory = async () => {
    data.mode = category;
    // 시작 시간보다 종료시간이 빠르면 alert
    if (startTimeValue >= finishTimeValue) {
      alert('시간을 알맞게 입력하세요');
    } else {
      // 수정일 경우
      if (index !== null) {
        {
          console.log(startTimeValue);
          console.log(finishTimeValue);

          await axios
            .patch('https://i11b307.p.ssafy.io/api/v1/data', {
              memberDataId: data.memberDataId,
              mode: category,
              modeStartTime: format(startTimeValue, 'yyyy-MM-dd HH:mm'),
              modeEndTime: format(finishTimeValue, 'yyyy-MM-dd HH:mm'),
            })
            .then(() => {
              fetchDayData(index, data);
            })
            .catch((error) => {
              console.log('데이터를 수정하지 못했습니다.');
              console.log(error);
            });
        }
      } else {
        // 추가일 경우
        await axios
          .post('https://i11b307.p.ssafy.io/api/v1/data', {
            mode: category,
            startTime: format(startTimeValue, 'yyyy-MM-dd HH:mm'),
            endTime: format(finishTimeValue, 'yyyy-MM-dd HH:mm'),
          })
          .then(() => {
            addData({
              memberDataId: data.memberDataId,
              memberId: data.memberId,
              mode: category,
              modeStartTime: startTimeValue,
              modeEndTime: finishTimeValue,
            });
          })
          .catch((error) => {
            console.log('데이터를 추가하지 못했습니다.');
            console.log(error);
          });
      }

      // 수정 후 index null 처리, modal 창 닫기
      setIndex(null);
      setOpenModal();
    }
  };

  // 데이터 수정 or 추가 없이 index null 처리, modal 창 닫기
  const closeModal = () => {
    setIndex(null);
    setOpenModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 shadow-lg border border-gray-300 rounded-xl">
        <div className="flex justify-center mb-4">
          {index !== null ? (
            <span className="font-bold text-lg">데이터 수정하기</span>
          ) : (
            <span className="font-bold text-lg">데이터 추가하기</span>
          )}
        </div>

        {/* 수유 수면 활동 카테고리 선택 창 */}
        <div className="mb-6">
          <p className="font-semibold text-gray-700 mb-3">카테고리</p>
          <ModalSelectCategory initCategory={data.mode} />
        </div>

        {/* 시간 수정 파트 */}
        <div className="mb-6">
          <p className="font-semibold text-gray-700 mb-3">시간</p>
          <ModalSetTime index={index} />
        </div>

        {/* 수정, 닫기 버튼 */}
        <div className="flex justify-center space-x-2">
          <button
            className="px-6 py-2 bg-[#FD5900] text-white rounded-xl"
            onClick={updateCategory}
          >
            {index !== null ? '수정' : '추가'}
          </button>
          <button
            className="px-6 py-2 bg-gray-200 text-[#FD5900] rounded-xl"
            onClick={closeModal}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
