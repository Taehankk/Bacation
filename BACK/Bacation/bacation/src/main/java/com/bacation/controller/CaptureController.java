package com.bacation.controller;

import com.bacation.model.dto.Capture;
import com.bacation.model.service.CaptureService;
import com.bacation.model.service.ImageUploadService;
import com.bacation.model.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/active/capture")
public class CaptureController {

    @Autowired
    private ImageUploadService uploadService;
    @Autowired
    private CaptureService captureService;


    // 현재 날짜 기준 모든 사진 불러오기
    @GetMapping("/list")
    public ResponseEntity<?> getCaptureList(){
        long memberId = MemberService.getCurrentMemberId();

        LocalDateTime[] times = getRangeTime();
        List<Capture> captureList = captureService.getCaptureList(memberId, times[0], times[1]);
        if(captureList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(captureList, HttpStatus.OK);
    }

    // 캡처 이미지 저장하기
    @PostMapping("")
    public ResponseEntity<?> getImageInfo (@RequestBody Map<String, String> responseData) throws Exception{
        // 이미지를 바이트로 저장, 디코딩
        // 메타 데이터를 제외시킨 이미지 관련 문자열만 솎아내기
        long memberId = MemberService.getCurrentMemberId();

        String base64Image = responseData.get("image");
        String base64Data = base64Image.split(",")[1];
        String url = uploadService.upload(base64Data);


        Capture capture = new Capture();
        capture.setMemberId(memberId);
        capture.setCaptureTime(LocalDateTime.now().plusHours(9));
        capture.setCaptureUrl(url);

        captureService.saveCapture(capture);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 일지 작성으로 인해 특정 캡처 사진들의 내부 정보가 갱신됨
    // 캡처 테이블 기준 일지아이디가 부여가 됨
    // 먼저 캡처아이디로 테이블 조회 -> 해당 테이블에 일지 아이디를 갱신시켜줌 -> 다시 저장
    public void getRecordId(long captureId, long recordId) {
        Optional<Capture> capture = captureService.getCapture(captureId);
        System.out.println("가져온 캡처 사진의 정보 : "+capture.get().toString());
        capture.get().setRecordId(recordId); // 일지 아이디를 넣어줌
        // 다시 저장하기
        captureService.saveCapture(capture.get());
    }

    // 하루시간 범위 가져오기
    public LocalDateTime[] getRangeTime () {
        LocalDateTime[] temp = new LocalDateTime[2];
        temp[0] = LocalDateTime.now().plusHours(9).withHour(0).withMinute(0).withSecond(0).withNano(0);;
        temp[1] = LocalDateTime.now().plusHours(9).withHour(0).withMinute(0).withSecond(0).withNano(0).plusHours(24);;
        return temp;
    }


}
