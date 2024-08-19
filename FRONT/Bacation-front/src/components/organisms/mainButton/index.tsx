import { Link } from 'react-router-dom';

export const MainButton = () => {
  return (
    <div className="flex justify-between mt-8">
      <Link to={'/mode/active'}>
        <div className="bg-[#FCA800] rounded-lg shadow-xl px-4 py-3">
          <p className="text-white text-xl font-medium">활동 모드</p>
          <div className="flex space-x-2">
            <p className="text-white text-xl font-medium">켜기</p>
            <img
              src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/play.png"
              alt=""
              className="w-24 mt-4"
            />
          </div>
        </div>
      </Link>
      <Link to={'/mode/sleep'}>
        <div className="bg-[#3864A7] rounded-lg shadow-xl px-4 py-3">
          <p className="text-white text-xl font-medium">수면 모드</p>
          <div className="flex space-x-2">
            <p className="text-white text-xl font-medium">켜기</p>
            <img
              src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/sleep.png"
              alt=""
              className="w-24 mt-4"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
