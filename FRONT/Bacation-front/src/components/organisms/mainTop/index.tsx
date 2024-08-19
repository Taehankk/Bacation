interface Props {
  profileImage: string;
  nickname: string;
}

export const MainTop = (props: { info: Props }) => {
  return (
    <div className="">
      <div className="my-5">
        <img
          src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/logo.png"
          alt=""
          className="w-44"
        />
      </div>
      <div className="flex justify-between place-items-baseline">
        <img
          src={
            props.info.profileImage ||
            'https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/profile.jpg'
          }
          alt="Profile-image"
          className="w-16 h-16 rounded-full mr-4"
        />
        <img
          src="https://bacation.s3.ap-northeast-2.amazonaws.com/frontImage/main.png"
          alt=""
          className="w-56"
        />
      </div>
      <div className="mt-5 text-2xl font-semibold space-y-1">
        <p>
          <span className="text-[#FD5900]">{props.info.nickname}</span>님,
        </p>
        <p>아이는 베케이션에 맡겨주세요!</p>
      </div>
    </div>
  );
};
