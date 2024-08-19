package com.bacation.controller;

import com.bacation.model.dto.*;
import com.bacation.model.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class DetectController {
    private DetectService detectService;
    private MemberDataService memberDataService;
    private ActiveService activeService;
    private FirebasePushService firebasePush;

    @Autowired
    public DetectController (DetectService detectService,MemberDataService memberDataService, ActiveService activeService, FirebasePushService firebasePush) {
        this.detectService = detectService;
        this.memberDataService = memberDataService;
        this.activeService = activeService;
        this.firebasePush = firebasePush;
    }


    // 활동모드 구동 시간
    // 시작은 최초 실행시 갱신
    // 끝 시간은 종료버튼 누를시 대입
    // 컨트롤러는 싱글턴으로 관리되기 때문에 사용자의 기록이 혼재돼서 저장되므로 분리할 필요가 있음

    // 시작시간과 끝시간을 임시저장, DB에 저장하기 전 갖고 있는 정보
    static Map<Long, Map<String, LocalDateTime>> detectTimes = new HashMap<>();
    // 멤버아이디 1를 가진 유저의 시작시간와 끝낸시간을 확인하는 방법
    // detectTimes.get(1).get("startTime") / detectTimes.get(1).get("endTime")

    // 감지된 내역들 임시 저장소, 특정 빈도수에 도달하면 해당 기능이 작동했다고 인식, DB에 저장함
    static Map<Long, Integer[]> countDetect = new HashMap<>();
    // 특정 사용자의 지금까지 감지된 내역, 아직 DB로 저장안한 내역들
    // countDetect.get(1).get(name)

    // 활동모드 작동동안 감지되고 있는 내역들
    // 아직 기능을 감지하고 있는 과정
    // 아직 세부기준을 결정 안함
    // 1. 학습을 정교하게 할 경우 - 그냥 과반수만 넘겨도 기능이 작동됐다고 인정함
    // 2. 학습이 정교하지 못할 경우 - 반드시 0.7이상 넘겨야 해당 기능이 한 번 작동했다고 인정함
    // 0.5기준 보통 10번 탐지가 4~6초, 20번 탐지가 8초정도 걸림

    // 감지 과정 중 목표 감지 빈도
    static int goalCount = 2;

    //감지 된 명칭 매핑용
    static Map<String, Integer> nameToInt = new HashMap<>();
    static Map<Integer, String> intToName = new HashMap<>();
    static LocalDateTime deadLine = LocalDateTime.now().plusHours(9).withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(1);

    // 0814 추가
    // 알림의 빈도를 조절하기 위한 Map
    static Map<Long, LocalDateTime> cautionTime = new HashMap<>();
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

    // 감지 내역 조회 **
    // 모드 활성화 중에 감지내역 조회 -> 시작시간 이후로 나타난 기록들을 가져와주면 됨
    // 프론트에서 보내야 하는 데이터 X
    @GetMapping("/{mode}/list")
    public ResponseEntity<?> getDetectList(@PathVariable String mode) {
        long memberId = MemberService.getCurrentMemberId();
        int startName;
        int endName;
        if (mode.equals("day")) {
            startName = 0;
            endName = 3;
        } else {
            startName = 3;
            endName = 5;
        }
        List<Detect> detectList = null;
        try {
            detectList = detectService.getDetectList(memberId, startName, endName, detectTimes.get(memberId).get("startTime"));
        } catch (Exception e) {
            return new ResponseEntity<>("감지내역이 아직 없습니다.",HttpStatus.NO_CONTENT);
        }


        return new ResponseEntity<>(detectList, HttpStatus.OK);
    }

    // 감지 기능 작동 **
    // 최초 구동인지 아닌지 확인해야함
    // 멤버도메인이 완성되면 JWT payload에서 memberId를 가져올 예정
    @PostMapping("/{mode}")
    public ResponseEntity<?> addDetect(@PathVariable String mode, @RequestBody TempDetect tempDetect){
        long memberId = MemberService.getCurrentMemberId();

        // 0811 추가 : 기능명칭이 아닌 다른 명칭 -> 기능 작동 X
        // 예시 : 예외상황발생 명칭의 감지명
        if (! nameToInt.containsKey(tempDetect.getDetectName())) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        tempDetect.setMemberId(memberId);
        if (! detectTimes.containsKey(memberId)) { // map에 유저 정보가 없음 -> 최초 실행임
            // 최초실행시 해당 유저의 기능작동시작시간과 끝낸시간 둘다 생성함
            newMember(memberId);
        }

        int key = nameToInt.get(tempDetect.getDetectName());

        countDetect.get(memberId)[key]++;
        if (countDetect.get(memberId)[key] == goalCount) { // 일단 기준
            // 특정 빈도수에 도달, 해당 기능이 작동했다고 인식함

            // DB detect 테이블에 추가
            // 일단 사용자의 정보를 가져와야함 -> Member에서 쿠키에 들어있는 JWT디코딩하는 메서드를 불러와서
            // 사용자 정보를 가져와야할 듯함, 일단 임의로 넣는다고 생각하자
            Detect detect = new Detect();
            detect.setMemberId(memberId);
            detect.setDetectName(key);
            detect.setDetectTime(getNowTime());
            detectService.saveDetect(detect);

            //이후 해당 사용자의 이전감지내역을 전부 초기화해버림
            for (int i = 0; i < 5; i ++) {
                countDetect.get(memberId)[i]=0;
            }

            // 이제 사용자의 설정을 조회, 해당 기능의 알림이 켜져있는지 확인
            // 1. 사용자의 설정정보를 가져옴
            // 2. 해당기능의 명칭 + 해당 기능의 true 혹은 false 를 반환해줌
            Optional<Setting> setting = activeService.getSetting(memberId);
            Caution caution = new Caution(key, getCaution(key, setting));

            // 0808 추가 2
            if (getCaution(key, setting)) { // 알림이 켜진상태
                // 알림설정이 켜져있어 알림을 전송함
                // 발송 전 int값을 한글명칭으로 변환

                // 0814 추가
                // 발송 전 최근 알림 시간을 조회
                // 최근 알림 시간대비 10초이상 지나야 알림 발송, 10초 미만이면 발송 X
                if (! cautionTime.containsKey(memberId)) { // 아직 발생한 적이 없음
                    // 즉시 발생과 동시에 현재 시간을 저장
                    System.out.println("즉시 알림!!");
                    firebasePush.pushMessage(intToName.get(key));
                    cautionTime.put(memberId, LocalDateTime.now().plusHours(9));
                } else { // 이전 내역이 있음
                    LocalDateTime now = LocalDateTime.now().plusHours(9);
                    long difference = Duration.between(cautionTime.get(memberId), now).getSeconds();
                    System.out.println("시간 차 : "+difference);
                    if (difference > 10) { // 10초 이상일때만 알림
                        firebasePush.pushMessage(intToName.get(key));
                    }
                    // 알림 발송을 하든 안하든 시간은 항상 갱신함
                    cautionTime.put(memberId, now);
                }

            }

            // 0814 추가
            // 감지 발생시 바로 조회할 수 있게끔 바꿔주기
            return new ResponseEntity<>(detect, HttpStatus.OK);
        }
        Detect detectNone = new Detect();
        detectNone.setDetectId(-1);
        detectNone.setDetectTime(LocalDateTime.now().plusHours(9));
        detectNone.setMemberId(memberId);
        detectNone.setDetectName(-1);
        return new ResponseEntity<>(detectNone, HttpStatus.OK);
    }

    // 감지 기능 종료 **
    // 멤버도메인이 완성되면 JWT payload에서 memberId를 가져올 예정
    @PostMapping("/{mode}/end")
    public ResponseEntity<?> endDetect(@PathVariable String mode){
        //감지시간에 종료시간 갱신
        int index; // 0 활동, 1 수면, 2 수유
        if (mode.equals("day")) {
            index = 0;
        } else if (mode.equals("night")) {
            index = 1;
        } else {
            index = 2;
        }
        long memberId = MemberService.getCurrentMemberId();
        System.out.println(detectTimes.containsKey(memberId));
        detectTimes.get(memberId).put("endTime",getNowTime());
        System.out.println("끝낸 시간 : "+detectTimes.get(memberId).get("endTime"));
        MemberData memberData = new MemberData();
        memberData.setMemberId(memberId);
        memberData.setMode(index);
        memberData.setModeStartTime(detectTimes.get(memberId).get("startTime"));
        memberData.setModeEndTime(detectTimes.get(memberId).get("endTime"));
        // DB에 저장하기 전 끝낸 시점이 시작 시점대비 하루가 지났는지 확인
        if (timeCheck(memberData.getModeStartTime(), memberData.getModeEndTime())) {
            // true = 하루 지난게 맞음
            // 시작날짜로 한번저장, 끝난날짜로도 저장
            // 예를들어 23:55~02:00동안 이용했다면
            // 1. 23:55~23:59:59:99999 으로 한번 저장, 2. 24:00~02:00 으로 한 번 더 저장
            // -> 시작시간~데드라인-1나노초 / 데드라인~끝낸시간

            // 일단 끝낸 시간을 따로 저장
            LocalDateTime endTime = memberData.getModeEndTime();

            // 1. 나노초빼서 전날 날짜로 한번 저장 23:59:99:9999
            memberData.setModeEndTime(deadLine.minusNanos(1));
            memberDataService.saveMemberDate(memberData);

            // 2. 데드라인~진짜끝낸시간으로 현재 날짜로 한번 더 저장
            memberData.setModeEndTime(endTime);
            memberData.setModeStartTime(deadLine);
            memberDataService.saveMemberDate(memberData);
        } else { // 하루를 넘기지 않았으니 냅다 저장해도 OK
            memberDataService.saveMemberDate(memberData);
        }


        // 데이터 저장 완료, 이제 서버에 갖고있던 해당 사용자의 데이터를 삭제해야함
        // 이 부분이 속도 저하의 큰 문제점이 된다면
        // 삭제하지 않고 버전관리로 넘어감 -> 메모리 부담은 되겠으나 속도개선 가능
        countDetect.remove(memberId);
        detectTimes.remove(memberId);
        return new ResponseEntity<>("감지 기능 종료",HttpStatus.CREATED);
    }

    // 새로운 사용자의 감지기능 활성화
    public void newMember (long memberId) {
        detectTimes.put(memberId, new HashMap<>()); // 시작시간 초기화
        detectTimes.get(memberId).put("startTime", getNowTime());

        // 임시 감지 내역도 초기화
        countDetect.put(memberId, new Integer[]{0,0,0,0,0});
    }

    // 기존 UTC시간이기에 대한민국 기준 +9시간을 해줘야함 -> 갑자기 대한민국 기준으로 되고있음.. 왜...?
    public LocalDateTime getNowTime() {
        return LocalDateTime.now().plusHours(9);
    }

    // 시작시간 대비 끝낸 시간이 하루가 지난 시점인지 확인하는 메서드
    public boolean timeCheck(LocalDateTime startTime, LocalDateTime endTime) {
        LocalDateTime startDay = startTime.withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endDay = endTime.withHour(0).withMinute(0).withSecond(0).withNano(0);
        Duration duration = Duration.between(startDay, endDay);
        if (duration.toHours() >= 24) {
            return true;
        } else {
            return false;
        }
    }

    public boolean getCaution (int key, Optional<Setting> setting) {
        Setting s = setting.get();
        if (key == 0) {
            return s.isFallCaution();
        } else if (key == 1) {
            return s.isCrashCaution();
        } else if (key == 2) {
            return s.isStuckCaution();
        } else if (key == 3) {
            return s.isReverseCaution();
        } else {
            return s.isSoundCaution();
        }
    }

}
