package com.bacation.controller;

import com.bacation.model.dto.Detect;
import com.bacation.model.dto.MemberData;
import com.bacation.model.dto.MyPageDetectInfo;
import com.bacation.model.dto.UpdateMemberData;
import com.bacation.model.service.DetectService;
import com.bacation.model.service.MemberDataService;
import com.bacation.model.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class DataController {
    private DetectService detectService;
    private MemberDataService memberDataService;

    @Autowired
    DataController(DetectService detectService,MemberDataService memberDataService) {
        this.detectService = detectService;
        this.memberDataService = memberDataService;
    }

    //감지 된 명칭 매핑용
    static Map<String, Integer> nameToInt = new HashMap<>();
    static Map<Integer, String> intToName = new HashMap<>();
    static LocalDateTime deadLine = LocalDateTime.now().plusHours(9).withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(1);
    static String createMemberDateError = "유효한 시간이 아닙니다. 시작 시간은 끝난 시간보다 앞서야하며, 끝난 시간은 반드시 24시이하여야 합니다.";
    static {
        nameToInt.put("낙상",0);
        nameToInt.put("충돌",1);
        nameToInt.put("끼임",2);
        nameToInt.put("뒤집기",3);
        nameToInt.put("울음",4);

        intToName.put(0,"낙상");
        intToName.put(1,"충돌");
        intToName.put(2,"끼임");
        intToName.put(3,"뒤집기");
        intToName.put(4,"울음");
    }

    // 0812 추가 : 누적 감지내역들 중 빈번했던 감지명, 평균횟수
    // 바로 밑의 getDataDetectList를 활용할 것
    @GetMapping("/data/{mode}/total")
    public ResponseEntity<?> getPrefixDataDetectList(@PathVariable("mode") String mode) {
        long memberId = MemberService.getCurrentMemberId();
        int day = 0;
        int startName;
        int endName;
        if (mode.equals("day")) {
            startName = 0;
            endName = 3;
        } else {
            startName = 3;
            endName = 5;
        }

        // 특정 모드에서 가장 빈번히 발생한 감지명, 활동모드 수면모드 전부 따로 조회함

        // 가장 많이 감지된 감지명
        String detectName = detectService.getTotalDetectName(memberId, startName, endName);
        System.out.println("잘 나와...? "+detectName);
        String name = intToName.get(Integer.parseInt(detectName.split(",")[0]));

        // 평균 횟수
        // 전체 감지횟수 / 실행시킨 날짜

        int total = detectService.getTotalDetectCount(memberId, startName, endName); // 전체 감지 횟수
        int days = detectService.getDetectTimeList(memberId, startName, endName); // 실행시킨 날짜들 count
        // 실행날짜의 경우, 현재 오늘 12일인데, 실제 이용날짜는 1,2,12이면 3으로 반환함
        String[] answer = new String[2];
        answer[0] = name;
        answer[1] = ""+Math.floor(total/days);

        return new ResponseEntity<>(answer, HttpStatus.OK);

    }


    // 0808추가 : 마이페이지에서 특정날짜의 모든 감지목록 조회
    @GetMapping("/data/{mode}/list")
    public ResponseEntity<?> getDataDetectList(@PathVariable String mode, @RequestParam String dateTime) {
        long memberId = MemberService.getCurrentMemberId();
        LocalDateTime startTime = getStartMemberTime(dateTime);
        LocalDateTime endTime = getEndMemberTime(dateTime);
        System.out.println(memberId+" 가져와줘잉 : "+startTime+" "+endTime);
        // 활동모드 감지내역만 모두 가져옴
        // 활동모드는 0~2의 모드숫자를 가지고 있음
        int startName;
        int endName;
        if (mode.equals("day")) { // 활동모드의 데이터 조회
            startName = 0;
            endName = 3;

        } else { // 수면모드 데이터의 조회
            startName = 3;
            endName = 5;
        }
        List<Detect> detectList = memberDataService.getDataDetectList(memberId, startName, endName, startTime, endTime);
        return new ResponseEntity<>(detectList, HttpStatus.OK);


    }

    // 마이페이지 하룻동안 알림횟수와 가장 많이 알림이 간 기능 반환
    @GetMapping("/data/{mode}")
    public ResponseEntity<?> getDetectDate(@PathVariable String mode, @RequestParam String dateTime){
        long memberId = MemberService.getCurrentMemberId();
        LocalDateTime startTime = getStartMemberTime(dateTime);
        LocalDateTime endTime = getEndMemberTime(dateTime);
        // 해당 유저의 오늘자 모드기록들 가져와서
        // 해당 모드 작동중에 최빈값의 기능, 그리고 총 알림횟수를 반환해줘야함

        // 1. 총 알림 횟수
        System.out.println("시작 시간 : "+startTime+" 끝낸 시간 : "+endTime);
        int count;
        // 감지기능 범위
        int startName;
        int endName;
        if (mode.equals("day")) { // 활동모드의 데이터 조회
            startName = 0;
            endName = 3;

        } else { // 수면모드 데이터의 조회?
            startName = 3;
            endName = 5;
        }
        count = detectService.getDetectCount(memberId, startName, endName, startTime, endTime);
        List<Integer> detectNames = detectService.getMaxDetectNames(memberId, startName, endName, startTime, endTime);

        // 최종 return할 객체 MyPageDetectInfo
        MyPageDetectInfo myPageDetectInfo = getMyPageDetectInfo(count, detectNames);
        // 2. 최다 빈도 감지명
        System.out.println(myPageDetectInfo.toString());
        return new ResponseEntity<>(myPageDetectInfo, HttpStatus.OK);

    }

    // 특정 사용자의 하룻동안 memberData 정보 조회(활동, 수면, 수유)
    // 마찬가지로 임시로 POST, 멤버도메인 완성되면 GET으로 바꾸고
    // JWT의 payload의 memberId를 가져올 예정
    @GetMapping("/data/list")
    public ResponseEntity<?> getDatatList(@RequestParam String dateTime){
        long memberId = MemberService.getCurrentMemberId();
        LocalDateTime startTime = getStartMemberTime(dateTime);
        LocalDateTime endTime = getEndMemberTime(dateTime);
        System.out.println(startTime+" "+endTime);
        List<MemberData> memberDataList = memberDataService.getMemberDataList(memberId, startTime, endTime);
        return new ResponseEntity<>(memberDataList,HttpStatus.OK);
    }

    // 아이 패턴 생성
    @PostMapping("/data")
    public ResponseEntity<?> createDetect(@RequestBody Map<String, String> requestData){
        LocalDateTime startTime = stringToLocalDateTime(requestData.get("startTime"));
        LocalDateTime endTime = stringToLocalDateTime(requestData.get("endTime"));
        long memberId = MemberService.getCurrentMemberId();
        System.out.println("만들어줘잉 "+startTime+" "+endTime);
        int mode = Integer.parseInt(requestData.get("mode"));
        MemberData memberData = new MemberData(memberId,mode,startTime,endTime);
        memberDataService.saveMemberDate(memberData);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // 마이데이터 수정
    // 멤버아이디를 제외한 요소들이 들어가있는 상태, 멤버아이디는 멤버서비스에서 가져옴
    @PatchMapping("/data")
    public ResponseEntity<?> updateDetect(@RequestBody UpdateMemberData updateMemberData){
        long memberDateId = updateMemberData.getMemberDataId();
        long memberId = MemberService.getCurrentMemberId();
        // 수정 되기전의 원본 데이터
        Optional<MemberData> beforeData = memberDataService.getmemberData(memberDateId);

        // "2024-08-05 12:00"의 문자열을 알잘딱으로 localDateTime으로 바꾸기
        LocalDateTime start = stringToLocalDateTime(updateMemberData.getModeStartTime());
        LocalDateTime end = stringToLocalDateTime(updateMemberData.getModeEndTime());
        
        // 해당 데이터의 아이디로 정보 갱신
        MemberData newMemberData = new MemberData();
        newMemberData.setMemberDataId(memberDateId);
        newMemberData.setMemberId(memberId);
        newMemberData.setMode(updateMemberData.getMode());
        newMemberData.setModeStartTime(start);
        newMemberData.setModeEndTime(end);
        memberDataService.saveMemberDate(newMemberData);

        // 수정했으면 다시 목록을 불러와야함
        List<MemberData> getMemberDataList = memberDataService.getMemberDataList(beforeData.get().getMemberId(), deadLine.plusDays(-1),deadLine);
        return new ResponseEntity<>(getMemberDataList, HttpStatus.OK);
    }

    // 마이페이지 시작시간
    public LocalDateTime getStartMemberTime(String data) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(data, formatter);

        return localDate.atStartOfDay();
    }

    // 마이페이지 끝난시간
    public LocalDateTime getEndMemberTime(String data) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(data, formatter);

        return localDate.atStartOfDay().plusDays(1);
    }

    // 마이페이지 하룻동안 알림횟수와 최빈 감지명
    public MyPageDetectInfo getMyPageDetectInfo(int count, List<Integer> detectNames) {
        List<String> detectNameStringList = new ArrayList<>();
        for (int i = 0; i < detectNames.size(); i++) {
            detectNameStringList.add(intToName.get(detectNames.get(i)));
        }
        MyPageDetectInfo myPageDetectInfo = new MyPageDetectInfo(detectNameStringList,count);
        return myPageDetectInfo;
    }

    // 수유 시간 문자열 -> LocalDateTime 변환
    public LocalDateTime stringToLocalDateTime(String time) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        // 문자열을 LocalDateTime으로 변환
        LocalDateTime localDateTime = LocalDateTime.parse(time, formatter);
        return localDateTime;
    }

}
