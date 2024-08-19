package com.bacation.model.service;

import com.bacation.model.dto.Fcm;
import com.bacation.model.repository.FcmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FirebaseService {

    @Autowired
    private FcmRepository fcmRepository;

    //토큰 생성
    public void fcmSave(Fcm fcm) {
        fcmRepository.save(fcm);
    }

    //토큰 조회
    public Optional<Fcm> getFcmById(long fcmId) {
        return fcmRepository.findById(fcmId);
    }

    //토큰 삭제
    public void deleteFcm(long fcmId) {
        fcmRepository.deleteById(fcmId);
    }
}
