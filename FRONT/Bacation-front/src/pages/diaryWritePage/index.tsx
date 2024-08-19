import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { TopBar } from '../../components/atoms/topBar';
import { SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ImageSlide } from '../../components/atoms/imageSlide';
import { useDiaryStore } from '../../store/useDiaryStore';

export const DiaryWrite = () => {
  const [content, setContent] = useState('');
  const captures = useDiaryStore((state) => state.captures);
  const navigate = useNavigate();
  const [today /*setToday*/] = useState(new Date());

  const getInfo = async () => {
    try {
      const response = await axios.get(
        'https://i11b307.p.ssafy.io/api/v1/record',
        {
          params: { dateTime: moment(today).format('YYYY-MM-DD') },
        },
      );

      if (response && response.data) {
        setContent(response.data.content);
        console.log(content);
      }
    } catch (error) {
      console.log('데이터를 받아오지 못했습니다.');
      console.error(error);
    }
  };

  function onChange(e: { target: { value: SetStateAction<string> } }) {
    setContent(e.target.value);
  }

  const save = () => {
    axios
      .post(
        `https://i11b307.p.ssafy.io/api/v1/record`,
        {
          content: content,
        },
        // {
        //   headers: {
        //     // Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        //     Authorization:
        //       'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhX2xtZUBrYWthby5jb20iLCJleHAiOjE3NTQ3NDA4NjksImlkIjoxLCJhdXRoSWQiOjM2MjM0ODA3MDMsIm5pY2tuYW1lIjoi7KGw7JWE66aEIiwiZW1haWwiOiJhX2xtZUBrYWthby5jb20iLCJwcm9maWxlSW1nVXJsIjoiaHR0cDovL3QxLmtha2FvY2RuLm5ldC9hY2NvdW50X2ltYWdlcy9kZWZhdWx0X3Byb2ZpbGUuanBlZy50d2cudGh1bWIuUjY0MHg2NDAifQ.x2mT7DcTN4xoUkg2wpQ8sbuVi07K-bFFM7F5Ir-sovMQGsbusAPGnk9-xSKBT9a3mLHhVwP2flPpOtAyBDRTNw',
        //   },
        // },
      )
      .then(() => {
        navigate('/diary', { replace: true });
      });
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className="w-full mx-auto">
      <TopBar title="오늘의 일기 작성하기" />
      <div className="px-5 place-content-center">
        <p className="font-semibold text-xl mb-5">
          {moment().format('YYYY-MM-DD')}
        </p>
        <ImageSlide images={captures} />
        <div className="space-y-5 mt-10">
          <div className=" flex space-x-3 w-full rounded-lg bg-gray-100 px-5 py-4">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="mt-1 text-[#FD5900]"
            />
            <p className="font-medium">작성 후 저장 버튼을 꼭 눌러 주세요</p>
          </div>
          <textarea
            name=""
            id=""
            value={content}
            onChange={onChange}
            className="w-full h-72 border border-[#FD5900] rounded-lg p-5 resize-none"
            maxLength={200}
          ></textarea>
        </div>
        <div className="flex w-full place-content-center">
          <button
            onClick={save}
            className="button bg-orange-500 text-white py-3 px-4 rounded-md mt-5"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};
