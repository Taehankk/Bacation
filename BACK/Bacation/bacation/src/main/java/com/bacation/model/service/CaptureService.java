package com.bacation.model.service;

import com.bacation.model.dto.Capture;
import com.bacation.model.repository.CaptureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CaptureService {

    private CaptureRepository captureRepository;

    @Autowired
    public CaptureService(CaptureRepository captureRepository) {
        this.captureRepository = captureRepository;
    }

    // 특정 날짜의 모든 이미지 조회
    public List<Capture> getCaptureList (long memberId, LocalDateTime startTime, LocalDateTime endTime) {
        return captureRepository.getCaptureList(memberId,startTime,endTime);
    }

    // 캡처아이디로 캡처 사진 조회
    public Optional<Capture> getCapture (long captureId) {
        return captureRepository.findById(captureId);
    }

    // 특정 일지에 사용된 모든 캡처 목록
    public List<Capture> useCaptureList (long recordId) {
        return captureRepository.getCaptureListByRecordId(recordId);
    }

    // 이미지 저장
    public void saveCapture(Capture capture) {
        captureRepository.save(capture);
    }

}
