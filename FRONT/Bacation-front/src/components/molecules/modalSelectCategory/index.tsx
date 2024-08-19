import { useEffect } from 'react';
import useModalStore from '../../../store/useChartModalStore';

interface Props {
  initCategory: number;
}

export const ModalSelectCategory = ({ initCategory }: Props) => {
  // 현재 체크한 mode index 저장 변수
  const category = useModalStore((state) => state.category);
  const setCategory = useModalStore((state) => state.setCategory);

  useEffect(() => {
    setCategory(initCategory);
  }, []);

  // 수면, 활동, 수유 id 변경
  const onChangeCheck = (index: string) => {
    setCategory(Number(index));
  };

  return (
    <div className="flex justify-center space-x-8">
      <label className="flex items-center space-x-2">
        <input
          id="1"
          type="checkbox"
          checked={category === 1}
          onChange={({ target: { id } }) => onChangeCheck(id)}
          className="form-checkbox h-5 w-5 text-orange-600"
        />
        <span className="text-gray-700">수면</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          id="0"
          type="checkbox"
          checked={category === 0}
          onChange={({ target: { id } }) => onChangeCheck(id)}
          className="form-checkbox h-5 w-5 text-orange-600"
        />
        <span className="text-gray-700">활동</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          id="2"
          type="checkbox"
          checked={category === 2}
          onChange={({ target: { id } }) => onChangeCheck(id)}
          className="form-checkbox h-5 w-5 text-orange-600"
        />
        <span className="text-gray-700">수유</span>
      </label>
    </div>
  );
};
