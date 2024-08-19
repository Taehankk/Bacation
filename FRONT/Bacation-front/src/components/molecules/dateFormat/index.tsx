import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import useDataStore from '../../../store/useDataStore';

interface Props {
  idx: number;
  date: Date;
  onClick: () => void;
}

export const DateFormat = ({ idx, date, onClick }: Props) => {
  const selectDate = useDataStore((state) => state.selectDate);
  return (
    <div
      key={idx}
      className={`date-item text-center h-24 flex-col content-center px-1 py-2 rounded-lg shadow mx-1 ${idx === selectDate ? 'bg-orgBg2 text-white font-bold' : ' bg-white'}`}
      onClick={() => onClick()}
    >
      <span className="block text-base">{format(date, 'M')}</span>
      <span className="block text-base">{format(date, 'dd')}</span>
      <span className="block w-14 text-base">
        {format(date, 'E', { locale: ko })}
      </span>
    </div>
  );
};
