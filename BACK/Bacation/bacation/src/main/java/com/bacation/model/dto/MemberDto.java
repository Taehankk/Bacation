package com.bacation.model.dto;
import com.bacation.model.entity.Member;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class MemberDto {
    // auto increment column
    private Long memberId = 10L;
    private Long authId;
    private String email;
    private String nickname;
    private String profileImgUrl;
    private String babyName;
    private boolean babyGender;
    private LocalDate babyBirthdate;
    private LocalDate registDate;

    // 0810 : 기본 생성자 추가
    public MemberDto() {}

    public MemberDto(String babyName, Boolean babyGender, LocalDate babyBirthdate) {
        this.babyName = babyName;
        this.babyGender = babyGender;
        this.babyBirthdate = babyBirthdate;
    }

    public MemberDto(Long memberId, String nickname, String babyName, LocalDate babyBirthdate, boolean babyGender, LocalDate registDate) {
        this.memberId = memberId;
        this.nickname = nickname;
        this.babyName = babyName;
        this.babyBirthdate = babyBirthdate;
        this.babyGender = babyGender;
        this.registDate = registDate;
    }

    public MemberDto(Long memberId, String email, String nickname, String profileImgUrl, String babyName, boolean babyGender, LocalDate babyBirthdate) {
        this.memberId = memberId;
        this.email = email;
        this.nickname = nickname;
        this.profileImgUrl = profileImgUrl;
    }

    public Member toEntity(){
        Member member = Member.builder()
                .authId(authId)
                .nickname(nickname)
                .email(email)
                .profileImgUrl(profileImgUrl)
                .babyName(babyName)
                .babyGender(babyGender)
                .babyBirthdate(babyBirthdate)
                .registDate(registDate)
                .build();
        return member;
    }

    @Builder
    public MemberDto(Long memberId, Long authId, String nickname, String email, String profileImgUrl,
                     String babyName, boolean babyGender, LocalDate babyBirthdate, LocalDate registDate){
        this.memberId = memberId;
        this.authId = authId;
        this.nickname = nickname;
        this.email = email;
        this.profileImgUrl = profileImgUrl;
        this.babyName = babyName;
        this.babyGender = babyGender;
        this.babyBirthdate = babyBirthdate;
        this.registDate = registDate;
    }

}
