import DiaryCalendar from '../../components/organisms/diaryCalendar';
import { TopBar } from '../../components/atoms/topBar';

export const DiaryPage = () => {
  return (
    <div className="w-full mx-auto">
      <TopBar title="작성한 일기 보기" />
      <DiaryCalendar />
    </div>
  );
};
