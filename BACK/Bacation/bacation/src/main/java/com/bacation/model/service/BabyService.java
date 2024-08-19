package com.bacation.model.service;

import com.bacation.model.dto.MemberDto;
import com.bacation.model.entity.Member;
import com.bacation.model.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class BabyService {
    private final MemberRepository memberRepository;

    @Autowired
    public BabyService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // Member를 통해 아기 정보 저장
    public Member saveBabyInfo(MemberDto memberDto) {
        Long memberId = memberDto.getMemberId();
        Optional<Member> optionalMember = memberRepository.findById(memberId);

        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            member.setBabyName(memberDto.getBabyName());
            member.setBabyGender(memberDto.isBabyGender());
            member.setBabyBirthdate(memberDto.getBabyBirthdate()); // LocalDate를 String으로 변환

            return memberRepository.save(member);
        }
        return null; // 또는 예외를 던질 수 있습니다.
    }

//    // 아기 정보 업데이트 -> 업데이트 하려면 아이정보 출력하는 것도 필요할 듯 (240803)
//    public Member updateBabyInfo(MemberDto memberDto) {
//        Long memberId = memberDto.getMemberId();
//        Optional<Member> optionalMember = memberRepository.findById(memberId);
//
//        if (optionalMember.isPresent()) {
//            Member member = optionalMember.get();
//            member.setNickname(memberDto.getNickname());
//            member.setBabyName(memberDto.getBabyName());
//            member.setBabyGender(memberDto.isBabyGender());
//            member.setBabyBirthdate(memberDto.getBabyBirthdate());
//
//            return memberRepository.save(member);
//        }
//        return null; // 또는 예외를 던질 수 있습니다.
//    }
//
//    // Member 조회
//    public MemberDto getMemberDto(Long memberId) {
//        // Member 엔티티 조회
//        Member member = memberRepository.findById(memberId).orElse(null);
//
//        // Member 엔티티가 존재하면 DTO로 변환
//
//            return new MemberDto(
//                    member.getMemberId(),
//                    member.getEmail(),
//                    member.getNickname(),
//                    member.getProfileImgUrl(),
//                    member.getBabyName(),
//                    member.isBabyGender(),
//                    member.getBabyBirthdate()
//                    // 필요한 필드 추가
//            );
//        }
    }




    // 아이정보 사용자로부터 받아오기

    // 아이정도 마이페이지에 출력하기

