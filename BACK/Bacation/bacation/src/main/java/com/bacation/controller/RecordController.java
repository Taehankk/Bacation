package com.bacation.controller;

import com.bacation.model.dto.*;
import com.bacation.model.dto.Record;
import com.bacation.model.entity.Member;
import com.bacation.model.service.CaptureService;
import com.bacation.model.service.MemberService;
import com.bacation.model.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/v1/record")
public class RecordController {

    private RecordService recordService;
    private CaptureService captureService;

    @Autowired
    private MemberService memberService;

    @Autowired
    public RecordController(RecordService recordService, CaptureService captureService) {
        this.recordService = recordService;
        this.captureService = captureService;
    }

    // 특정 날짜의 일지 조회
    // record 테이블과 capture list를 가져와야함 -> 두개!
    // 프론트에서 준건 특정 날짜와 사용자 아이디
    @GetMapping("")
    public ResponseEntity<?> getOneRecord(@RequestParam String dateTime) {
        long memberId = MemberService.getCurrentMemberId();
        LocalDateTime startTime = getStartMemberTime(dateTime);
        LocalDateTime endTime = getStartMemberTime(dateTime).plusDays(1);

        System.out.println(startTime+" "+endTime+" "+memberId);
        // 1. 먼저 일지를 조회해서 일지 아이디를 가져와야함, 반환대상 1
        Optional<Record> record = recordService.getRecord(memberId, startTime, endTime);
        if (! record.isPresent()) {
            return new ResponseEntity<String>("일지내역이 없습니다. 작성해주십시오.", HttpStatus.NO_CONTENT);
        }
        // 0814 추가 : 아이 출생년월일도 같이 담아서 보내주기

        // 기존 record 정보를 반환될 객체에 정보 넣어줌
        RecordAndBaby resultRecord = new RecordAndBaby();
        resultRecord.setRecordId(record.get().getRecordId());
        resultRecord.setMemberId(record.get().getMemberId());
        resultRecord.setContent(record.get().getContent());
        resultRecord.setRecordCount(record.get().getRecordCount());
        resultRecord.setRecordTime(record.get().getRecordTime());

        // 멤버 테이블을 조회, 멤버 테이블에 적힌 아이 출생년월일을 가져와서 갱신
        Optional<Member> member = memberService.getMemberInfo();
        long days = ChronoUnit.DAYS.between(member.get().getBabyBirthdate(), resultRecord.getRecordTime().toLocalDate());
        resultRecord.setBabyBirthdate(days);

//        // 2. 가져온 일지의 일지 아이디를 추출, 일지아이디를 가진 모든 캡처 목록을 조회, 반환대상 2
//        System.out.println("가져와줘잉 "+record.get());
        List<Capture> captures = captureService.useCaptureList(record.get().getRecordId());
//        System.out.println("작성한 일지 내용 : "+record.get().toString());
//        System.out.println("사용된 모든 캡처 이미지 : "+captures);
//
//        // 반환대상 1,2를 모두 합쳐서 한 객체로 완성, 보낼때 예쁘게~~
        resultRecord.setCaptures(captures);

        return new ResponseEntity<>(resultRecord,HttpStatus.OK);
    }

    // 일지 작성
    // 현재 캡쳐화면의 캡처아이디들과 작성날짜, 작성내용과 작성자의 멤버아이디만 알고 있는 상황
    // 0809추가 : 작성때는 무조건 캡처이미지 다 사용함!!

    // 0810 추가 : 내역이 없을 시 작성이 되는데, 내역이 있는 상태인데 또 작성하게 되면 정보 갱신으로!
    @PostMapping("")
    public ResponseEntity<?> createRecord(@RequestBody Map<String, String> responseDate) {
        long memberId = MemberService.getCurrentMemberId();
        String content = responseDate.get("content"); // 일지 내용

        // 0810 추가 : 일지 작성 전에 이전에 작성한 내역이 있는지 확인해야함

        // 사용자의 일지조회 먼저!
        LocalDateTime[] temp = getRangeTime(); // temp[0] 시작시간, temp[1] 끝난시간
        Optional<Record> beforeRecord = recordService.getRecord(memberId, temp[0], temp[1]);
        if (beforeRecord.isPresent()) { // 작성 내역이 있어서 내용이 갱신되게끔 바꿈
            beforeRecord.get().setContent(content); // 최근 내용으로 갱신
            recordService.saveRecord(beforeRecord.get()); // 바로 저장
            // 내용만 바꾸는 거라서 캡처 이미지 정보 갱신 필요 X
        } else { // 조회 내역이 없음 -> 일지 생성
            LocalDateTime recordTime = LocalDateTime.now().plusHours(9);
            Record record = new Record();
            record.setMemberId(memberId);
            record.setContent(content);
            record.setRecordTime(recordTime);
            // 1. 특정 사용자의 지금까지 작성한 일지 수를 가져옴 -> 몇번째 일지인지를 채움
            long count = recordService.getRecordCount(memberId)+1;
            System.out.println(count);
            record.setRecordCount(count);
            // 2. recordId 제외 모두 채움 -> 일지 생성 : 일지아이디 접근 가능
            recordService.saveRecord(record);
            // 방금 작성한 일지를 가져와서 일지 아이디를 모든 캡처아이디에 해당하는 캡처테이블을 갱신하려고함

            // 3. 일지는 날짜마다 한개씩만 가능함 -> 방금 작성한 일지는 오늘자 데이터임
            LocalDateTime startTime = getStartTime(recordTime);
            Optional<Record> nowRecord = recordService.getRecord(memberId, getStartTime(recordTime), startTime.plusDays(1));
            System.out.println("방금 막 작성한 일지"+nowRecord.get().toString());

            // 4. 이제 방금 작성한 일지의 일지아이디를 해당날짜의 캡처들의 일지아이디를 삽입
            LocalDateTime[] times = getRangeTime();
            List<Capture> captureList = captureService.getCaptureList(memberId, times[0], times[1]);
            if(! captureList.isEmpty()){
                // 캡처 목록이 있음 -> 갱신해줘야함
                for (int i = 0; i < captureList.size(); i++) {

                    // 캡처 정보를 가져옴
                    Capture capture = captureList.get(i);

                    // 해당 캡처 정보에 일지 아이디를 기입
                    capture.setRecordId(nowRecord.get().getRecordId());

                    // 캡처 정보 갱신 - 다시 저장
                    captureService.saveCapture(capture);
                }
            }
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // 일지 수정
    // 프론트에선 일지 아이디 줌 -> 해당 일지 아이디로 접근 가능해서 날짜 필요 X
    @PutMapping("")
    public ResponseEntity<?> updateRecord(@RequestBody RecordUpdate newRecord) {
        System.out.println(newRecord.toString());
        // 1. 수정 하기 전 이전 일지의 정보들
        long recordId = newRecord.getRecordId();
        Optional<Record> record = recordService.getRecordById(recordId); // 일지
        List<Capture> captureList = captureService.useCaptureList(recordId); // 사용된 사진들
        System.out.println("이전에 선택한 목록들 : "+captureList);
        // 2. 일단 내용 수정
        record.get().setContent(newRecord.getContent()); // 내용 수정

        // 3. 이전에 선택했던 캡쳐화면들 목록 대비 현재 선택된 목록들 비교
        // 선택되지 않은 사진들에 대해 일지 아이디 초기화
        String[] selected = newRecord.getCaptureIdList().split(",");
        System.out.println(Arrays.toString(selected));
        Map<Long, Boolean> map = new HashMap<>(); // 선택됐는지 안됐는지 확인하는 것
        // false = 선택 안됨, true = 선택됨
        for (int i = 0; i < captureList.size(); i ++) {
            // 이전 기록들 일단 다 조회
            map.put(captureList.get(i).getCaptureId(), false);
        }
        for (int i = 0; i < selected.length; i ++) {
            // 선택된 것들만 true로 바꿔주기
            long select = Long.parseLong(selected[i]);
            map.put(select, true);
        }

        //여기까지는 이전목록과 현재목록 전부 혼재된 상황
        // 그냥 map에 들어간 모든 key를 확인해서 ture이면 recordId를 넣어주고, false면 0

        for (long key : map.keySet()) { // captureList가 아닌 map에서 모든키를 봐야함
            Optional<Capture> capture = captureService.getCapture(key);
            if (map.get(key)) {
                // 이번 수정목록에서 해당 이미지를 사용함 -> 일지 아이디를 넣어줌
                capture.get().setRecordId(recordId);
            } else {
                // 이번 수정목록에서 없음 - 사용하지 않는 이미지로,0으로 초기화하기
                capture.get().setRecordId(0);
            }
            // 캡처테이블에 일지 아이디 갱신 후 공통적으로 저장
            captureService.saveCapture(capture.get());
        }
        // 갱신된 내용을 DB에 반영
        recordService.saveRecord(record.get());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 일지 삭제
    // 일지 삭제와 동시에 그 일지와 연결된 캡처 테이블의 일지 아이디 전부 초기화
    @DeleteMapping("/{recordId}")
    public ResponseEntity<?> deleteRecord(@PathVariable long recordId) {
        //1. 일지 삭제
        // 0814 추가 : 일지 삭제하기 전에 그 일지가 작성된 시간도 가져와야함
        // 그래야 n번째 일지라는걸 갱신시킬 수 있음
        long memberId = MemberService.getCurrentMemberId();
        Optional<Record> record = recordService.getRecordById(recordId);
        LocalDateTime time = record.get().getRecordTime(); // 이 시간 기점 이후의 일지들, n번째 전부 갱신
        recordService.deleteRecord(recordId);

        // 2. 해당 일지에 사용했던 모든 캡처사진들의 일지아이디 0으로 초기화
        List<Capture> captureList = captureService.useCaptureList(recordId);
        for (int i = 0; i < captureList.size(); i ++) {
            Capture capture = captureList.get(i);
            capture.setRecordId(0);
            captureService.saveCapture(capture);
        }

        // 0814 추가 : 3. 기존에 있었던 일지의 n번째 일지 라는 표시를 전부 갱신해줌
        // 갱신 대상은 해당 삭제되는 일지 "이후"의 작성된 일지들
        // 예를들어 1 2 3 4 5 번째 일지가 존재할 때
        // 3번째 일지를 삭제하게된다면
        // 1 2 3(원래 4) 4(원래 5) 이렇게 갱신되게끔
        List<Record> recordList = recordService.getAllRecords(memberId, time);
        for (int i = 0; i < recordList.size(); i ++) {
            Record recordUpdate = recordList.get(i);
            recordUpdate.setRecordCount(recordUpdate.getRecordCount()-1);
            // recordCount 갱신 후 DB에 반영
            recordService.saveRecord(recordUpdate);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //"2024-08-02" 문자열을 LocalDateTime으로 바꾸며 0시0분0초로 시작함
    public LocalDateTime getStartMemberTime(String data) {
        LocalDate temp = LocalDate.parse(data, DateTimeFormatter.ISO_LOCAL_DATE);
        return temp.atStartOfDay();
    }

    public LocalDateTime getStartTime(LocalDateTime data) {
        return data.withHour(0).withMinute(0).withSecond(0).withNano(0);
    }

    // 하루시간 범위 가져오기
    public LocalDateTime[] getRangeTime () {
        LocalDateTime[] temp = new LocalDateTime[2];
        temp[0] = LocalDateTime.now().plusHours(9).withHour(0).withMinute(0).withSecond(0).withNano(0);;
        temp[1] = LocalDateTime.now().plusHours(9).withHour(0).withMinute(0).withSecond(0).withNano(0).plusHours(24);;
        return temp;
    }

}
