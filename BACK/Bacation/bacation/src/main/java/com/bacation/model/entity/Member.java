package com.bacation.model.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table( name = "member", schema = "member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;  // auto increment column

    @Column(name = "auth_id")
    private Long authId;

    @Column
    private String nickname;

    @Column
    private String email;

    @Column(name = "profile_img_url")
    private String profileImgUrl;

    @Column(name = "baby_name")
    private String babyName;

    @Column(name = "baby_gender")
    private boolean babyGender;

    @Column(name = "baby_birthdate")
    private LocalDate babyBirthdate;

    @Column(name = "regist_date")
    private LocalDate registDate;

    @Builder
    public Member(Long authId, String email, String nickname, String profileImgUrl, String babyName, boolean babyGender, LocalDate babyBirthdate, LocalDate registDate) {
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
