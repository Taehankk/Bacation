package com.bacation.controller;

import com.bacation.model.dto.MemberDto;
import com.bacation.model.entity.Member;
import com.bacation.model.service.BabyService;
import com.bacation.model.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class BabyController {

    private final BabyService babyService;

    @Autowired
    private MemberService memberService;


    @Autowired
    public BabyController(BabyService babyService) {
        this.babyService = babyService;
    }

//    // 0810 : 아기 정보 저장 완료
//    @PostMapping("/baby/save")
//    public ResponseEntity<?> saveBabyInfo(@RequestBody MemberDto memberDto) {
//        // 부모의 정보 가져옴
//        Optional<Member> member =  memberService.getMemberInfo(); // 사용자 정보 고정
//
//        // 부모의 정보에 아이의 정보를 기입하는 형식
//        // 아이 출생년월, 이름, 성별
//        member.get().setBabyBirthdate(memberDto.getBabyBirthdate());
//        member.get().setBabyName(memberDto.getBabyName());
//        member.get().setBabyGender(memberDto.isBabyGender());
//
//        // 갱신 완료, 멤버 테이블 update
//        memberService.saveMember(member.get());
//        // 아이 정보 저장이기에 반환은 없음
//        return new ResponseEntity<>("아이 정보 저장 성공", HttpStatus.OK);
//    }

    // 아기 정보 저장 -> 사용했음
    // 0810 : 아기 정보 저장 완료
    @PostMapping("/baby/save")
    public ResponseEntity<Member> saveBabyInfo(@RequestBody MemberDto memberDto) {
        log.info("saveBabyInfo에 들어옴");
        Member updatedMember = babyService.saveBabyInfo(memberDto);
        if (updatedMember != null) {
            log.info("saveBabyInfo 완료");
            return ResponseEntity.ok(updatedMember);
        } else {
            log.info("saveBabyInfo 실패");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

        // 0810 : 아기 정보 수정 - 완료
        // 순서는 이전 정보를 가져오고
        // 최신정보를 이전정보에 덮어씌우는 것 (최신정보의 가짓수가 훨씬 작으니까 이게 더 효율적임)
        @PatchMapping("/baby")
        public ResponseEntity<Member> updateBabyInfo (@RequestBody MemberDto memberDto){
            // 요청 본문에서 memberId를 사용하여 아기 정보 업데이트
            Long memberId = memberService.getCurrentMemberId();
            memberDto.setMemberId(memberId);

            // 이전 정보 조회
            Optional<Member> member = memberService.getMemberInfo();
            System.out.println("아기의 정보는 ? :" + memberDto);


            member.get().setBabyGender(memberDto.isBabyGender()); // 아기 성별
            member.get().setBabyBirthdate(memberDto.getBabyBirthdate()); // 아기 출생일자

            // 멤버 정보 갱신
            memberService.saveMember(member.get());

            return new ResponseEntity<>(member.get(), HttpStatus.OK);
        }

        // 0810 : Member 정보 조회 - 완료
        @GetMapping("/member/info")
        public ResponseEntity<?> getMember () {
            // 서비스에서 memberId로 정보를 조회한다
            Optional<Member> member = memberService.getMemberInfo();
            log.info("반환하는 아이 정보: {}", member);

            // 조회된 정보가 있으면 OK 응답을, 없으면 Not Found 응답을 반환한다
            if (member.isPresent()) {
                return new ResponseEntity<>(member.get(), HttpStatus.OK);
            } else {
                // 조회된 사용자가 없음
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Not Found
            }
        }

    }



