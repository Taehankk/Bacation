package com.bacation.model.service;

import com.bacation.model.dto.Detect;
import com.bacation.model.dto.MemberData;
import com.bacation.model.repository.MemberDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MemberDataService {
    private MemberDataRepository memberDataRepository;
    private DetectService detectService;

    @Autowired
    public MemberDataService (MemberDataRepository memberDataRepository, DetectService detectService) {
        this.memberDataRepository = memberDataRepository;
        this.detectService = detectService;
    }
    // 특정 사용자의 하룻동안의 멤버데이터 전체 조회
    public List<MemberData> getMemberDataList(long memberId, LocalDateTime startTime, LocalDateTime endTime) {
        return memberDataRepository.getMemberDataList(memberId, startTime, endTime);
    }

    // 특정 사용자의 특정 데이터의 조회
    public Optional<MemberData> getmemberData(long memberDataId) {
        return memberDataRepository.findById(memberDataId);
    }

    // 0808추가 : 특정 날짜의 특정 모드 감지목록 전부 조회
    public List<Detect> getDataDetectList(long memberId, int startName, int endName, LocalDateTime startTime, LocalDateTime endTime) {
        return detectService.getDataDetectList(memberId, startName, endName, startTime, endTime);
    }
    // 멤버데이터 저장
    public void saveMemberDate(MemberData memberData) {
        memberDataRepository.save(memberData);
    }
}
