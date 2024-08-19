import { Link, useLocation } from 'react-router-dom';
// import home1 from '../../../assets/navbar/home-1.png';
// import home2 from '../../../assets/navbar/home-2.png';
// import child1 from '../../../assets/navbar/child-1.png';
// import child2 from '../../../assets/navbar/child-2.png';

const Navbar = () => {
  // 현재 선택된 아이콘을 관리하는 state
  const locationNow = useLocation();

  //   const userId = sessionStorage.getItem('email');
  //   const userRole = sessionStorage.getItem('role');
  //   const storeId = sessionStorage.getItem('storeid');
  //   const token = sessionStorage.getItem('token');

  //   let url;

  // const navigate = useNavigate();

  // const handleConnectUser = () => {
  //   // 유저버튼 클릭 시 로그인 상태 체크 후 라우팅 진행.
  //   // if (userId === null) {
  //   //   navigate('/login');
  //   // } else if (userId !== null) {
  //   //   navigate('/user');
  //   // }
  // };
  if (
    location.pathname === '/onboarding' ||
    location.pathname === '/usage-guide' ||
    location.pathname === '/login' ||
    location.pathname === '/child-info' ||
    location.pathname === '/permission' ||
    location.pathname === '/alarm' ||
    location.pathname === '/callback' ||
    location.pathname === '/diary/write'
  ) {
    return null;
  } else {
    return (
      <nav className="bg-white flex justify-evenly fixed bottom-0 left-0 right-0 py-2 max-w-[400px] mx-auto">
        {/* 하단 네비게이션 최상위 태그 */}
        <Link to="/main" className="">
          {locationNow.pathname === '/main' ||
          locationNow.pathname === '/mode/active' ||
          locationNow.pathname === '/mode/sleep' ? (
            <div className="grid bg-[#FD5900] px-16 py-1 rounded-2xl text-center place-items-center space-y-2">
              <img
                src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/home-1.png"
                alt=""
                className="mt-1"
              />
              <p className="text-white">홈</p>
            </div>
          ) : (
            <div className="grid px-16 py-1 text-center place-items-center space-y-2">
              <img
                src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/home-2.png"
                alt=""
                className="mt-1"
              />
              <p>홈</p>
            </div>
          )}
        </Link>
        <Link to="/mypage" className="">
          {locationNow.pathname === '/mypage' ||
          locationNow.pathname === '/data' ||
          locationNow.pathname === '/diary' ? (
            <div className="grid bg-[#FD5900] px-16 py-1 rounded-2xl text-center place-items-center space-y-2">
              <img
                src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/child-1.png"
                alt=""
                className="mt-1"
              />
              <p className="text-white">마이</p>
            </div>
          ) : (
            <div className="grid px-16 py-1 text-center place-items-center space-y-2">
              <img
                src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/child-2.png"
                alt=""
                className="mt-1"
              />
              <p>마이</p>
            </div>
          )}
        </Link>
      </nav>
    );
  }
};

export default Navbar;
