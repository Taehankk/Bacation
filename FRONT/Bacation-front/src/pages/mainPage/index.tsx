import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../../store/useUserStore';
import useViduStore from '../../store/useViduStore';
import { MainTop } from '../../components/organisms/mainTop';
import { MainButton } from '../../components/organisms/mainButton';
import { MainDiary } from '../../components/organisms/mainDiary';

export const MainPage = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const setBabyInfo = useUserStore((state) => state.setBabyInfo);
  const restoreUserInfo = useUserStore((state) => state.restoreUserInfo);
  const sessionID = useViduStore((state) => state.sessionID);
  const setSessionID = useViduStore((state) => state.setSessionID);
  
  const session = useViduStore((state) => state.session);

  const [loading, setLoading] = useState(true);

  const getSessionID = async () => {
    try {
      const response = await axios.post('https://i11b307.p.ssafy.io/api/v1/video/sessions', null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSessionID(response.data);
    } catch (error) {
      console.error('Error fetching session ID:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await restoreUserInfo();
        const response = await axios.get('https://i11b307.p.ssafy.io/api/v1/member/info');
        setBabyInfo(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!sessionID) {
      getSessionID();
    }

    fetchData();
  }, [session, sessionID, restoreUserInfo, setBabyInfo]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="m-5">
      <MainTop info={userInfo} />
      <MainButton />
      <MainDiary />
    </div>
  );
};
