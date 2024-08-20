# Bacation
SSAFY 2학기 공통 프로젝트 - Bacation - B307 
## 공통 PJT 회고 - [김태한]
### 1. 컴포넌트화 - Atomic Design
> - Atomic Design 일부 적용
> ex> Day component 에서 DateFormat atom 까지 분리
> - atomic design 적용 시, 컴포넌트 파일의 코드 길이 감소 확인
> - 모든 page 를 atomic design 을 적용하지는 못 함
> - 재사용성에 대한 만족도 약 20%.. 추후 프로젝트 시 도전 및 개선 필요
> - atoms, molecules, organisms, templates, pages 에 대한 명확한 기준, 구분이 필요함

### 2. 렌더링 관련
> - 개발 초반, 복잡한 페이지(data 분석 페이지)에서 최대 2번의 렌더링이 일어나는 것 확인
> - 프로젝트 마무리 단계에서는, 불필요한 렌더링 확인 못 함
> - axios 요청 후 return 받은 데이터를 객체로 바로 저장하고, 변경된 데이터가 바로 화면에 노출되는 방법에 대한 연구 필요
> - 객체에 바로 담는 방법을 사용하였으나, 화면에 즉시 적용되지 않아, 각각의 data 를 다시 받는 상태를 선언.. => 객체 / 각각의 값을 따로 받는 차이를 명확히 공부할 필요 있음
> - 새로고침 없이, axios 로 값을 받아온 후 화면에 즉시 출력하는 방식 고민 필요
> - 컴포넌트의 효율적 렌더링에 대한 만족도 50% 
