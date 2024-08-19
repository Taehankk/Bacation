import { useLocation } from 'react-router-dom';
import { OpenViduVideoComponent } from '../../atoms/ovVideo';
import { StreamManager } from 'openvidu-browser';

interface Props {
  streamManager: StreamManager;
}

export const UserVideoComponent = ({ streamManager }: Props) => {
  const location = useLocation();

  return (
    <div>
      {streamManager !== undefined ? (
        <div
          className={`streamcomponent w-full h-full ${location.pathname === '/bacation/room' ? 'max-w-none' : ''}`}
        >
          <OpenViduVideoComponent streamManager={streamManager} />
        </div>
      ) : null}
    </div>
  );
};
