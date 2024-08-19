package com.bacation.model.service;

import com.bacation.model.dto.MemberDto;
import com.bacation.model.entity.Member;
import com.bacation.model.repository.MemberRepository;
import com.bacation.model.repository.MemberRepository;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@ToString
public class MemberService {
    private static Long currentMemberId = 10L;
    private static Long currentAuthId;
    private static String currentEmail;

    @Autowired
    private MemberRepository memberRepository;

    // Static 변수를 설정하는 메소드
    public static void setCurrentMember(MemberDto memberDto) {
        currentMemberId = memberDto.getMemberId();
        currentAuthId = memberDto.getAuthId();
        currentEmail = memberDto.getEmail();
    }

    // Static 변수에 접근하는 메소드
    public static Long getCurrentMemberId() {
        return currentMemberId;
    }
    public static Long getCurrentAuthId() {
        return currentAuthId;
    }
    public static String getCurrentEmail() {
        return currentEmail;
    }

    // 예시: 현재 인증된 사용자의 정보를 가져오는 메소드
    public Member getCurrentMember() {
        Long authId = MemberService.getCurrentAuthId();
        String email = MemberService.getCurrentEmail();

        if (authId != null) {
            return memberRepository.findByAuthId(authId).orElse(null);
        } else if (email != null) {
            return memberRepository.findByEmail(email).orElse(null);
        }
        return null;
    }

    // 멤버(아이) 조회
    public Optional<Member> getMemberInfo() {
        return memberRepository.findById(currentMemberId);
    }

    // 멤버(아이) 저장
    public void saveMember(Member member) {
        memberRepository.save(member);
    }
}
