import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faVideo } from '@fortawesome/free-solid-svg-icons';

import useModeStore from '../../../store/useModeStore';

export const CheckSetting = () => {
  const isSessionOpen = useModeStore((state) => state.isSessionOpen);
  const setSessionOpen = useModeStore((state) => state.setSessionOpen);
  const isSettingOpen = useModeStore((state) => state.isSettingOpen);
  const setSettingOpen = useModeStore((state) => state.setSettingOpen);

  // 세션 모달 open/close
  const sessionModal = () => {
    setSessionOpen(!isSessionOpen);
  };

  // 모달을 토글하는 함수
  const settingModal = () => {
    setSettingOpen(!isSettingOpen);
  };

  return (
    <div className="flex justify-between">
      <div
        className="flex place-content-start space-x-3 text-gray-500"
        onClick={sessionModal}
      >
        <FontAwesomeIcon icon={faVideo} className="mt-1" />
        <a className="border-b border-gray-500">오늘의 방</a>
      </div>
      <div
        className="flex place-content-end space-x-3 text-gray-500"
        onClick={settingModal}
      >
        <FontAwesomeIcon icon={faBell} className="mt-1" />
        <a className="border-b border-gray-500">켜진 알림 보기</a>
      </div>
    </div>
  );
};
