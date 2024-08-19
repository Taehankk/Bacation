package com.bacation.model.service;

import com.bacation.model.dto.Detect;
import com.bacation.model.repository.DetectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DetectService {
    private DetectRepository DetectRepository;
    @Autowired
    public DetectService(DetectRepository DetectRepository) {
        this.DetectRepository = DetectRepository;
    }

    // 기능 활성화 이후 감지된 내역 조회
    public List<Detect> getDetectList(long memberId, int startName, int endName, LocalDateTime detectTime) {
        return DetectRepository.getDetectList(memberId, detectTime, startName, endName);
    }

    // 마이페이지 하룻동안 특정 모드의 감지 빈도수
    public Integer getDetectCount(long memberId, int startName, int endName, LocalDateTime startTime, LocalDateTime endTime) {
        return DetectRepository.countCountDetections(memberId, startName, endName, startTime, endTime);
    }

    // 마이페이지 하룻동안 특정 모드의 최빈 감지명
    public List<Integer> getMaxDetectNames(long memberId, int startName, int endName, LocalDateTime startTime, LocalDateTime endTime) {
        return DetectRepository.getMaxDetectNames(memberId, startName, endName, startTime, endTime);
    }

    // 최종 감지 내역 저장
    public void saveDetect(Detect detect) {
        DetectRepository.save(detect);
    }

    // 0808추가 : 마이페이지에서 특정 날짜에 감지된 모든 내역 조회
    public List<Detect> getDataDetectList(long memberId, Integer startName, Integer endName, LocalDateTime startTime, LocalDateTime endTime) {
        return DetectRepository.getDataDetectList(memberId, startName, endName, startTime, endTime);
    }

    // 0812 추가 : 마이페이지에서 데이터 분석 중 최빈 감지명 찾기
    public String getTotalDetectName(long memberId, Integer startName, Integer endName) {
        return DetectRepository.getTotalDetectNames(memberId, startName, endName);
    }

    // 0812 추가 : 누적 감지 횟수
    public Integer getTotalDetectCount(long memberId, Integer startName, Integer endName) {
        return DetectRepository.getTotalDetectCount(memberId, startName, endName);
    }

    // 0812 추가 : 지금까지 이용한 날짜들
    public Integer getDetectTimeList(long memberId, Integer startName, Integer endName) {
        return DetectRepository.countDetectDays(memberId, startName, endName);
    }

}
