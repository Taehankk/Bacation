import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStop } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import useModeStore from '../../../store/useModeStore';
import useViduStore from '../../../store/useViduStore';
import { PopUp } from '../popUp';

export const ModeButton = () => {
  const locationNow = useLocation();
  const navigate = useNavigate();

  const bgcolor =
    locationNow.pathname === '/mode/active' ? 'bg-[#FDDC3F]' : 'bg-[#3864A7]';
  const textcolor =
    locationNow.pathname === '/mode/active'
      ? 'text-[#FDDC3F]'
      : 'text-[#3864A7]';

  // 캡쳐하려는 태그 객체 저장
  const divRef = useModeStore((state) => state.divRef);

  const [isCapture, setCapture] = useState(false);

  // 캡쳐 실패 시 팝업 창 관련
  const popUpOpen = useModeStore((state) => state.popUpOpen);
  const setPopUpOpen = useModeStore((state) => state.setPopUpOpen);

  const setSession = useViduStore((state) => state.setSession);
  const endMode = useModeStore((state) => state.endMode);

  // 캡쳐 함수
  const captureNow = async () => {
    if (divRef?.current) {
      try {
        const video = divRef.current;
        setCapture(true);
        if (video) {
          const canvas = await html2canvas(video, {
            scale: 2,
            allowTaint: true,
            useCORS: true,
          });

          const url = canvas.toDataURL('image/png', 1);
          // console.log(url);
          setPopUpOpen(true);

          await axios
            .post('https://i11b307.p.ssafy.io/api/v1/active/capture', {
              image: url,
            })
            .then(() => {
              setCapture(true);
              setPopUpOpen(true);
            })
            .catch((error: Error) => {
              console.log('사진을 저장하지 못했습니다.');
              console.log(error);
            });
        }
      } catch (error) {
        console.log('Error : ' + error);
      }
    } else {
      setCapture(false);
      setPopUpOpen(true);
    }
  };

  return (
    <div className="flex justify-evenly text-center place-items-center font-semibold">
      <div
        onClick={() => {
          endMode(setSession);
          navigate('/main');
        }}
        className={`rounded-full ${bgcolor} bg-opacity-30 w-24 h-24 flex-col place-items-center place-content-center`}
      >
        <FontAwesomeIcon icon={faStop} className={`${textcolor} text-lg`} />
        <p>활동 종료</p>
      </div>
      <div
        onClick={captureNow}
        className="rounded-full bg-[#28C9C3] bg-opacity-30 w-24 h-24 flex-col place-items-center place-content-center"
      >
        <FontAwesomeIcon icon={faImage} className={`text-[#28C9C3] text-lg`} />
        <p>화면 캡쳐</p>
      </div>

      {popUpOpen && (
        <PopUp
          type={isCapture}
          text={isCapture ? '캡쳐 완료' : '화면 연결 후 캡쳐해주세요'}
          category="capture"
        />
      )}
    </div>
  );
};
