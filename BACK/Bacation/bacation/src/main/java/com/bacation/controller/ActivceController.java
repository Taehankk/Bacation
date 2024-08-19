package com.bacation.controller;

import com.bacation.model.dto.Setting;
import com.bacation.model.service.ActiveService;
import com.bacation.model.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/active")
public class ActivceController {

    private ActiveService activeService;

    @Autowired
    public ActivceController(ActiveService activeService) {
        this.activeService = activeService;
    }

    // 모드 설정, DB까지 안감
    // 0낙상 1충돌 2끼임 3뒤집기 4울음
    @GetMapping("/{mode}")
    public ResponseEntity<?> chageMode(@PathVariable String mode) {
        int[] detects;
        if (mode.equals("day")) { // 활동 모드
            detects = new int[] {0,1,2};
        }else { // 수면 모드
            detects = new int[] {3,4};
        }
        return new ResponseEntity<int[]>(detects, HttpStatus.OK);
    }

    // 알림 설정 가져오기 **
    @GetMapping("/alarm")
    public ResponseEntity<?> getAlarm() {
        long memberId = MemberService.getCurrentMemberId();
        Optional<Setting> temp = activeService.getSetting(memberId);
        if (temp.isEmpty()) { // 해당 계정의 설정이 없으면 신규 사용자
            // 신규 사용자의 설정 테이블을 생성함
            createAlarm(memberId);
            return new ResponseEntity<>(activeService.getSetting(memberId), HttpStatus.OK);
        }
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    // 알림 설정 테이블 생성
    // 반환 값은 없음
    public void createAlarm(long memberId) {
        Setting setting = new Setting();
        setting.setSettingId(memberId);
        System.out.println("만들어줘잉 "+setting.toString());
        activeService.saveSetting(setting);
    }

    // 알림 설정 정보 수정
    // mode 0 전체 설정 갱신, 1 활동모드 설정 수정, 2 수면모드 설정 수정
    @PatchMapping("/alarm/{mode}")
    public ResponseEntity<?> chageAlarm(@PathVariable("mode") String mode, @RequestBody Setting setting) {
        //이전 정보
        long memberId = MemberService.getCurrentMemberId();
        Optional<Setting> before = activeService.getSetting(memberId);
        // 새로운 정보에 이전 정보를 덧씌우는 형식
        // 최종 save되는 객체는 setting
        setting.setSettingId(before.get().getSettingId());
        if (mode.equals("day")) { // 활동 모드
            // 활동 모드는 낙상, 충돌, 끼임 설정이 갱신된 상태
            // 나머지 설정(뒤집기, 울음)을 예전꺼 -> 새거 에 덧붙여주면 됨
            setting.setReverseCaution(before.get().isReverseCaution());
            setting.setSoundCaution(before.get().isSoundCaution());
        } else if (mode.equals("night")) { // 수면모드, 뒤집기 울음설정이 갱신된 상태, 나머지 정보는
            setting.setFallCaution(before.get().isFallCaution());
            setting.setCrashCaution(before.get().isCrashCaution());
            setting.setStuckCaution(before.get().isStuckCaution());
        } // mode = all이면 전체설정 가져오기, setting 바로 사용하면 됨, 건드릴 거 없음
        activeService.saveSetting(setting);
        Optional<Setting> newSetting = activeService.getSetting(setting.getSettingId());
        return new ResponseEntity<>(newSetting, HttpStatus.ACCEPTED);

    }


}
