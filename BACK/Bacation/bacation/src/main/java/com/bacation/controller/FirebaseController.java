package com.bacation.controller;

import com.bacation.model.dto.Fcm;
import com.bacation.model.service.FirebasePushService;
import com.bacation.model.service.FirebaseService;
import com.bacation.model.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/firebase")
public class FirebaseController {

    @Autowired
    private FirebaseService firebaseService;

    //신규사용자의 fcm토큰 생성
    @PostMapping("")
    public ResponseEntity<?> getFirebaseToken(@RequestBody Fcm fcm) {
        long memberId = MemberService.getCurrentMemberId();

        fcm.setFcmid(memberId);

        //해당 사용자의 토큰 생성
        firebaseService.fcmSave(fcm);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // FCM 토큰 삭제, 알림 권한을 허용하지 않을 경우 해당 api를 호출
    @DeleteMapping("")
    public ResponseEntity<?> deleteFirebaseToken() {
        long memberId = MemberService.getCurrentMemberId();

        firebaseService.deleteFcm(memberId);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}
