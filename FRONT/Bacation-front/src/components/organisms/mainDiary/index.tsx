import axios, { AxiosResponse } from 'axios';
import { useDiaryStore } from '../../../store/useDiaryStore';
import { useUserStore } from '../../../store/useUserStore';
import { ImageSlide } from '../../atoms/imageSlide';
import { useEffect } from 'react';

interface ImageInfo {
  captureId: number;
  recordId: number;
  memberId: number;
  captureUrl: string;
  captureTime: string;
}

export const MainDiary = () => {
  const babyInfo = useUserStore((state) => state.babyInfo);
  const setImage = useDiaryStore((state) => state.setCaptures);
  const images = useDiaryStore((state) => state.captures);

  const getImage = async () => {
    try {
      const response: AxiosResponse<ImageInfo[]> = await axios.get(
        'https://i11b307.p.ssafy.io/api/v1/active/capture/list',
      );

      if (response && response.data) {
        const data: ImageInfo[] = response.data;
        setImage(data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <div className="mt-10 font-semibold text-xl space-y-5">
      {images.length === 0 ? null : (
        <div className="space-y-5">
          <p>
            <span className="text-[#FD5900]">{babyInfo.babyName}</span>와의 추억
            기록하기
          </p>
          <ImageSlide images={images} />
        </div>
      )}
    </div>
  );
};
