import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { OpenVidu, StreamManager, Publisher, Device } from 'openvidu-browser';
import { UserVideoComponent } from '../../molecules/userVideoComponent';
import { TeachableImage } from '../../molecules/teachableImage';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useViduStore from '../../../store/useViduStore';
import { useUserStore } from '../../../store/useUserStore';
import useModeStore from '../../../store/useModeStore';

const APPLICATION_SERVER_URL =
  'https://i11b307.p.ssafy.io/api/v1/video/sessions';

interface Props {
  mySessionId: string;
  myUserName: string;
}

export const OpenViduSession = ({ mySessionId, myUserName }: Props) => {
  const session = useViduStore((state) => state.session);
  const setSession = useViduStore((state) => state.setSession);
  const [mainStreamManager, setMainStreamManager] = useState<StreamManager>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<StreamManager[]>([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState<Device>();
  const userName = useUserStore((state) => state.userInfo.nickname);

  const location = useLocation();

  const navigate = useNavigate();

  const OV = useRef<OpenVidu | null>(null);

  const divRef = useRef<HTMLDivElement>(null);
  const setDivRef = useModeStore((state) => state.setDivRef);

  useEffect(() => {
    setDivRef(divRef);
  }, [divRef]);

  useEffect(() => {
    window.addEventListener('beforeunload', onbeforeunload);
    joinSession();

    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
      leaveSession();
    };
  }, []);

  const onbeforeunload = () => {
    leaveSession();
  };

  const deleteSubscriber = (streamManager: StreamManager) => {
    setSubscribers((subs) => subs.filter((sub) => sub !== streamManager));
  };

  const joinSession = async () => {
    OV.current = new OpenVidu();
    const session = OV.current.initSession();

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((subs) => [...subs, subscriber]);
      if (
        JSON.parse(subscriber.stream.connection.data).clientData === userName
      ) {
        setMainStreamManager(subscriber);
      }
    });

    session.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    session.on('exception', (exception: Error) => {
      console.warn(exception);
    });

    setSession(session);

    const token = await getToken();

    session
      .connect(token, { clientData: myUserName })
      .then(async () => {
        const publisher = await OV.current!.initPublisherAsync(undefined, {
          audioSource: myUserName !== userName ? false : undefined,
          videoSource: myUserName !== userName ? false : undefined,
          publishAudio: myUserName !== userName ? false : true,
          publishVideo: myUserName !== userName ? false : true,
          resolution: '960x640',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        });

        session.publish(publisher);

        const devices = await OV.current!.getDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput',
        );

        const currentVideoDevice = videoDevices.find(
          (device) =>
            device.deviceId ===
            publisher.stream.getMediaStream().getVideoTracks()[0].getSettings()
              .deviceId,
        );

        if (currentVideoDevice !== undefined) {
          setCurrentVideoDevice(currentVideoDevice);
        }

        setPublisher(publisher);
      })
      .catch(() => {
        console.log('There was an error connecting to the session:');
      });
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }

    OV.current = null;
    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);

    if (location.pathname === '/bacation/room') {
      navigate('/bacation/room');
    }
  };

  const switchCamera = async () => {
    if (!OV.current || !currentVideoDevice) return;

    try {
      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput',
      );

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.find(
          (device) => device.deviceId !== currentVideoDevice.deviceId,
        );
        if (newVideoDevice) {
          const newPublisher = await OV.current.initPublisherAsync(undefined, {
            videoSource: newVideoDevice.deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          if (publisher) {
            await session!.unpublish(publisher!);
          }

          await session!.publish(newPublisher);
          if (newVideoDevice) {
            setCurrentVideoDevice(newVideoDevice);
          }
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  const createSession = async (sessionId: string) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL,
      {
        customSessionId: sessionId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data; // The sessionId
  };

  const createToken = async (sessionId: string) => {
    console.log(sessionId);
    const response = await axios.post(
      APPLICATION_SERVER_URL + '/' + sessionId + '/connections',
      {},
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data; // The token
  };

  return (
    <div>
      {session !== undefined && (
        <div id="session" className="">
          <div>
            {location.pathname === '/bacation/room' && (
              <div>
                <input
                  className="btn btn-large btn-danger"
                  type="button"
                  id="buttonLeaveSession"
                  onClick={leaveSession}
                  value="Leave session"
                />
                <input
                  className="btn btn-large btn-success"
                  type="button"
                  id="buttonSwitchCamera"
                  onClick={switchCamera}
                  value="Switch Camera"
                />
              </div>
            )}
          </div>
          <div id="video-container" className="col-md-6">
            {publisher !== undefined &&
              JSON.parse(publisher.stream.connection.data).clientData ===
                userName && (
                <div
                  className={`stream-container col-md-6 col-xs-6 ${location.pathname === '/bacation/room' ? 'max-w-none' : ''}`}
                >
                  <UserVideoComponent streamManager={publisher} />
                </div>
              )}
            {subscribers.map(
              (sub, i) =>
                JSON.parse(sub.stream.connection.data).clientData ===
                  userName && (
                  <div
                    key={i}
                    ref={divRef}
                    className="stream-container col-md-6 col-xs-6"
                  >
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ),
            )}
          </div>
        </div>
      )}
      {location.pathname === '/mode/active'
        ? mainStreamManager && (
            <TeachableImage
              streamManager={mainStreamManager}
              userName={myUserName}
              mode="day"
            />
          )
        : mainStreamManager && (
            <TeachableImage
              streamManager={mainStreamManager}
              userName={myUserName}
              mode="night"
            />
          )}
    </div>
  );
};
