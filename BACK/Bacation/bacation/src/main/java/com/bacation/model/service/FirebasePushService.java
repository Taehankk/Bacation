package com.bacation.model.service;


import com.bacation.model.dto.Fcm;
import com.google.firebase.messaging.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;


@Service
public class FirebasePushService {

    @Autowired
    private FirebaseMessaging firebaseMessaging; // 인스턴스 정보
    @Autowired
    private FirebaseService firebaseService; // 사용자 FCM토큰 확인

    public void pushMessage(String detectName) {
        long memberId = MemberService.getCurrentMemberId();
        System.out.println(detectName+" 감지 알림 발송 예정");

        // 일단 푸쉬알림은 따로 있다고 가정
        // 푸쉬알림을 발송한다 = fcm테이블이 생성돼있다.
        Optional<Fcm> fcm = firebaseService.getFcmById(memberId);
        if (! fcm.isPresent()) { // 빈값이면 알림 X
            return ;
        }
        String token = fcm.get().getToken();

        // 메세지 전송, 해당 내용 변경 가능, 추후 변경가능성 있음
        Message message = Message.builder()
                .putAllData(new HashMap<>() {{
                    put("time", LocalDateTime.now().toString());
                }})
                .setNotification(Notification.builder()
                        .setTitle(detectName+"이(가) 발생했습니다.")
                        .setBody("보호자님 확인해주세요.")
                        .build()
                )
                .setToken(token)
                .build();
        sendMessage(message);
    }

    public void sendMessage(Message message) {
        try {
            firebaseMessaging.send(message);
        } catch (FirebaseMessagingException e) {
            System.out.println("안보내짐...");
            System.out.println(e.getMessage());
        }
    }



}
