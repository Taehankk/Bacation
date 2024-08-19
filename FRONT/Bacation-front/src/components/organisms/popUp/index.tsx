import { useEffect } from 'react';
import useModeStore from '../../../store/useModeStore';

interface Props {
  type: boolean;
  text: string;
  category: string;
}

// let globalZIndex = 50;

export const PopUp = ({ type, text, category }: Props) => {
  const setPopUpOpen = useModeStore((state) => state.setPopUpOpen);
  const setIdCopy = useModeStore((state) => state.setIdCopy);
  const setUrlCopy = useModeStore((state) => state.setUrlCopy);
  // const [zIndex, setZIndex] = useState(globalZIndex);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 현재의 globalZIndex를 증가시켜 설정
    // setZIndex(globalZIndex);
    // globalZIndex += 1;

    const timer = setTimeout(() => {
      if (category === 'capture') {
        setPopUpOpen(false);
      } else if (category === 'id') {
        setIdCopy(false);
      } else if (category === 'url') {
        setUrlCopy(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`font-bold fixed flex justify-center items-center rounded-full p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50  ${type ? 'bg-[#E7FBE6]' : 'bg-[#FEDECC]'}`}
    >
      {text}
    </div>
  );
};
