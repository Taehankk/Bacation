import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';

import useViduStore from '../../../store/useViduStore';

import useModeStore from '../../../store/useModeStore';
import CopyToClipboard from 'react-copy-to-clipboard';
import { PopUp } from '../popUp';

export const SessionModal = () => {
  // 세션 모달 open/close
  const isSessionOpen = useModeStore((state) => state.isSessionOpen);
  const setSessionOpen = useModeStore((state) => state.setSessionOpen);
  const sessionModal = () => {
    setIdCopy(false);
    setUrlCopy(false);
    setSessionOpen(!isSessionOpen);
  };

  // 세션 ID copy 팝업 창
  const idCopy = useModeStore((state) => state.idCopy);
  const setIdCopy = useModeStore((state) => state.setIdCopy);

  // 방 접속 주소 copy 팝업 창
  const urlCopy = useModeStore((state) => state.urlCopy);
  const setUrlCopy = useModeStore((state) => state.setUrlCopy);

  // 방 접속 시 필요한 세션 ID
  const sessionID = useViduStore((state) => state.sessionID);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-3xl max-w-xs w-full">
        <div className=" p-10">
          <div
            className="flex place-content-center space-x-3 text-xl font-bold mb-10 text-center text-gray-600"
            onClick={sessionModal}
          >
            <FontAwesomeIcon icon={faVideo} className="mt-1 text-[#FD5900]" />
            <a className="">오늘의 방</a>
          </div>
          <div className="space-y-4">
            <div
              onClick={() => {
                setIdCopy(true);
                setUrlCopy(false);
              }}
            >
              <CopyToClipboard text={sessionID}>
                <p className="text-lg font-medium text-center hover:opacity-30">
                  {sessionID}
                </p>
              </CopyToClipboard>
            </div>
            <div
              onClick={() => {
                setUrlCopy(true);
                setIdCopy(false);
              }}
            >
              <CopyToClipboard text="https://i11b307.p.ssafy.io/bacation/room">
                <p className="text-sm text-center hover:opacity-30">
                  https://i11b307.p.ssafy.io/bacation/room
                </p>
              </CopyToClipboard>
            </div>
            <p className="text-sm text-center">페이지의 세션에 입력해주세요</p>
          </div>
        </div>
        <div
          onClick={sessionModal}
          className="border-t border-gray-300 flex place-content-center py-6"
        >
          <button className="text-[#FD5900] font-semibold">확인</button>
        </div>

        {idCopy && <PopUp type={true} text="ID 복사 완료" category="id" />}
        {urlCopy && <PopUp type={true} text="URL 복사 완료" category="url" />}
      </div>
    </div>
  );
};
