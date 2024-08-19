import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ImageInfo {
  captureId: number;
  recordId: number;
  memberId: number;
  captureUrl: string;
  captureTime: string;
}

export const ImageSlide = (props: { images: ImageInfo[] }) => {
  const navigate = useNavigate();
  const [today /*setToday*/] = useState(new Date());

  // 슬라이더 기본 셋팅
  const settings = {
    dots: window.location.pathname === '/main' ? false : true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: window.location.pathname !== '/main' ? false : true,
  };

  console.log('이미지 슬라이드: ', props.images);

  return props.images.length === 1 ? (
    <div>
      <div
        key={props.images[0].captureId}
        className="w-full h-52 rounded-lg flex place-items-end relative"
      >
        <img
          src={props.images[0].captureUrl}
          alt={`Capture at ${props.images[0].captureTime}`}
          className="w-full h-full object-cover rounded-lg"
        />
        {window.location.pathname !== '/main' ? null : (
          <div
            onClick={() => navigate('/diary/write')}
            className="hover:text-[#FD5900] bg-black bg-opacity-50 flex w-full justify-between place-items-center text-white px-5 py-3 absolute bottom-0"
          >
            <div className="text-lg font-medium">
              <p>{moment(today).format('YYYY-MM-DD')}</p>
              <p>오늘 촬영한 사진으로 일기 작성하기</p>
            </div>
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        )}
      </div>
    </div>
  ) : (
    <Slider {...settings}>
      {props.images.map((image) => (
        <div
          key={image.captureId}
          className="w-full h-52 rounded-lg flex place-items-end relative"
        >
          <img
            src={image.captureUrl}
            alt={`Capture at ${image.captureTime}`}
            className="w-full h-full object-cover rounded-lg"
          />
          {window.location.pathname !== '/main' ? null : (
            <div
              onClick={() => navigate('/diary/write')}
              className="hover:text-[#FD5900] bg-black bg-opacity-50 flex w-full justify-between place-items-center text-white px-5 py-3 absolute bottom-0"
            >
              <div className="text-lg font-medium">
                <p>{moment(today).format('YYYY-MM-DD')}</p>
                <p>오늘 촬영한 사진으로 일기 작성하기</p>
              </div>
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
          )}
        </div>
      ))}
    </Slider>
  );
};
