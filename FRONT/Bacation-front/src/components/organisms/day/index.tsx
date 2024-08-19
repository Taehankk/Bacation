import { add } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import useDataStore from '../../../store/useDataStore';
import { DateFormat } from '../../molecules/dateFormat';

const Day = () => {
  // 선택한 날짜 저장
  const setSelectDate = useDataStore((state) => state.setSelectDate);

  // 현재 스크롤 위치값 저장
  const scrollPosition = useDataStore((state) => state.scrollY);
  const setScrollPosition = useDataStore((state) => state.setScrollY);

  // 오늘 날짜 저장
  const today = new Date();
  const currentDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  // 무한 스크롤에 들어가는 날짜들
  // 오늘 날짜 기준 이전 1주일을 미리 저장
  const [dateArr, setDateArr] = useState([
    currentDay,
    add(currentDay, { days: -1 }),
    add(currentDay, { days: -2 }),
    add(currentDay, { days: -3 }),
    add(currentDay, { days: -4 }),
    add(currentDay, { days: -5 }),
    add(currentDay, { days: -6 }),
  ]);

  // 다른페이지에서 뒤로가기 눌렀을 때, 스크롤 위치 복구를 위한 날짜 저장 임시배열
  const tempArr = useDataStore((state) => state.tempArr);
  const setTempArr = useDataStore((state) => state.setTempArr);

  // 임시 배열에 저장된 날짜가 1주일 이상일 때 dateArr 에 복붙
  // 스크롤 위치 복구 안되는 경우 대비해서, 2일 정도 더 추가
  if (tempArr.length > dateArr.length) {
    setDateArr(tempArr);
    setDateArr((prevDateArr) => [
      ...prevDateArr,
      add(tempArr[tempArr.length - 1], { days: -1 }),
      add(tempArr[tempArr.length - 1], { days: -2 }),
    ]);
  }

  // 스크롤 영역 저장 변수
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  // 데이터를 추가해야할 때를 체크하기위한 위치 저장 변수
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 날짜를 추가하는 함수
  // 현재까지 저장된 날짜의 이전 날을 추가
  const dateFetch = () => {
    const newDate = add(dateArr[dateArr.length - 1], { days: -1 });
    setDateArr((prevDateArr) => [...prevDateArr, newDate]);
  };

  // 날짜 선택 시 발동 함수
  // 선택 시, tempArr에 선택 날짜까지 저장, 스크롤 위치 저장
  const clickDate = (idx: number) => {
    setSelectDate(idx);
    const position = scrollAreaRef.current?.scrollLeft ?? 0;
    setTempArr(dateArr.slice(0, idx + 1));
    setScrollPosition(position);
  };

  // 스크롤 영역에 데이터를 추가해야하는 지 계속 감시하는 부분
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dateFetch();
        }
      },
      {
        root: scrollAreaRef.current, // 스크롤 감지할 요소
        rootMargin: '0px',
        threshold: 1.0, // 요소의 100%가 보일 때 트리거
      },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [dateArr]);

  // 다른 페이지에서 navigate 로 이동 시 스크롤을 유지하기 위한 함수
  // scrollPosition에 저장된 위치를 scrollLeft 값에 저장
  useEffect(() => {
    if (scrollPosition !== 0 && scrollAreaRef.current) {
      const scrollLeft = scrollPosition ?? 0; // scrollPosition이 undefined일 경우 0으로 대체
      scrollAreaRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollPosition]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex justify-center items-center w-2/3">
        {/* 무한 스크롤 영역 */}
        <div
          ref={scrollAreaRef}
          className="flex flex-row-reverse items-center"
          style={{
            maxHeight: '80%',
            padding: '0 1rem',
            maxWidth: '1200px',
            overflow: 'scroll',
            scrollbarWidth: 'none',
          }}
        >
          {/* date 배열을 돌면서 날짜 형식 출력 */}
          {dateArr.map((date, idx) => (
            <DateFormat
              key={idx}
              idx={idx}
              date={date}
              onClick={() => clickDate(idx)}
            />
          ))}
          {/* 스크롤의 끝에 감시하는 부분, 다 보이면 배열에 날짜 추가 */}
          <div ref={sentinelRef} className="h-4 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Day;
