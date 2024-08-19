import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import useDataStore from '../../../store/useDataStore';
import useModalStore from '../../../store/useChartModalStore';

export const AddTimeButton = () => {
  // 시간 추가 modal 창 open 시, data index를 null 로 설정해야 함
  const setIndex = useDataStore((state) => state.setActiveIndex);

  // modal 창 open 결정 boolean 값
  const setOpenModal = useModalStore((state) => state.setOpenModal);

  // 시간 추가 모달창 오픈
  const addTime = () => {
    setIndex(null);
    setOpenModal();
  };

  return (
    <div
      className="w-20 h-20 flex justify-center items-center text-2xl rounded-full bg-[#FD5900]"
      onClick={addTime}
    >
      <FontAwesomeIcon icon={faClock} className="text-3xl text-white" />
      <FontAwesomeIcon
        icon={faPlusCircle}
        className="absolute top-5 right-5 text-white text-base"
      />
    </div>
  );
};
