import { faBook, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ImageSlide } from '../../atoms/imageSlide';

interface DiaryInfo {
  recordId: number;
  memberId: number;
  content: string;
  recordCount: number;
  recordTime: string;
  babyBirthdate: number;
  captures: ImageInfo[];
}

interface ImageInfo {
  captureId: number;
  recordId: number;
  memberId: number;
  captureUrl: string;
  captureTime: string;
}

export const DiaryView = (props: { diary: DiaryInfo; date: string }) => {
  const date = props.date;

  return (
    <div className="mt-3 bg-[#F6F8FA] p-7">
      <div className="mb-3 flex space-x-5">
        <FontAwesomeIcon
          icon={faBook}
          className="mt-1 text-lg text-[#FAA87D]"
        />
        <p className="text-lg font-semibold">{date} 의 일기</p>
      </div>
      {!props.diary ? (
        <div className="bg-white rounded-lg py-10 text-center space-y-3">
          <p className="text-lg font-medium">일기가 없어요</p>
          <p className="text-4xl">😢</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-3">
          {props.diary && <ImageSlide images={props.diary.captures} />}
          <div style={{ whiteSpace: 'pre-wrap' }} className="my-7">
            {props.diary.content}
          </div>
          <div className="mt-3 border-t border-gray-400 py-5 px-3">
            <div className="flex space-x-2">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-lg text-[#FAA87D]"
              />
              <p className="font-medium">
                아이가 태어난 지{' '}
                <span className="text-[#FD5900]">
                  {props.diary.babyBirthdate}일
                </span>
                ,{' '}
                <span className="text-[#FD5900]">
                  {props.diary.recordCount}번째
                </span>{' '}
                기록
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
