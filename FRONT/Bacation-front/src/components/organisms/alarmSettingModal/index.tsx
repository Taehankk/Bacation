import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import IphoneButton from '../button/iphoneButton';
import useModeStore from '../../../store/useModeStore';

export const AlarmSettingModal = () => {
  const alarmSetting = useModeStore((state) => state.alarmSetting);
  const setAlarmSetting = useModeStore((state) => state.setAlarmSetting);

  const [reverseCaution, setReverseCaution] = useState(
    alarmSetting.reverseCaution,
  );
  const [fallCaution, setFallCaution] = useState(alarmSetting.fallCaution);
  const [soundCaution, setSoundCaution] = useState(alarmSetting.soundCaution);

  const isSettingOpen = useModeStore((state) => state.isSettingOpen);
  const setSettingOpen = useModeStore((state) => state.setSettingOpen);

  const handleToggle =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setter((prev) => !prev);
    };

  // 모달을 토글하는 함수
  const settingModal = async () => {
    await axios
      .patch('https://i11b307.p.ssafy.io/api/v1/active/alarm/total', {
        settingId: 10,
        fallCaution: fallCaution,
        crashCaution: false,
        stuckCaution: false,
        reverseCaution: reverseCaution,
        soundCaution: soundCaution,
      })
      .then((response) => {
        setAlarmSetting(response.data);
      });

    setSettingOpen(!isSettingOpen);
  };

  useEffect(() => {
    axios
      .get('https://i11b307.p.ssafy.io/api/v1/active/alarm')
      .then((response) => {
        setAlarmSetting(response.data);
        setReverseCaution(response.data.reverseCaution);
        setFallCaution(response.data.fallCaution);
        setSoundCaution(response.data.soundCaution);
      });
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-3xl max-w-xs w-full">
        <div className=" p-10">
          <div
            className="flex place-content-center space-x-3 text-xl font-bold mb-10 text-center text-gray-600"
            onClick={settingModal}
          >
            <FontAwesomeIcon icon={faBell} className="mt-1 text-[#FD5900]" />
            <a className="">켜진 알림 보기</a>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-lg font-medium">뒤집기 알림</p>
              <IphoneButton
                isChecked={reverseCaution}
                onToggle={handleToggle(setReverseCaution)}
              />
            </div>
            <div className="flex justify-between">
              <p className="text-lg font-medium">낙상 알림</p>
              <IphoneButton
                isChecked={fallCaution}
                onToggle={handleToggle(setFallCaution)}
              />
            </div>
            <div className="flex justify-between">
              <p className="text-lg font-medium">울음소리 알림</p>
              <IphoneButton
                isChecked={soundCaution}
                onToggle={handleToggle(setSoundCaution)}
              />
            </div>
          </div>
        </div>
        <div
          onClick={settingModal}
          className="border-t border-gray-300 flex place-content-center py-6"
        >
          <button className="text-[#FD5900] font-semibold">확인</button>
        </div>
      </div>
    </div>
  );
};
