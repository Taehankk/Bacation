package com.bacation.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "memberdata")
public class MemberData {

    @Id
    @Column(name="memberdata_id")
    private long memberDataId;
    @Column(name="member_id")
    private long memberId;
    @Column(name="mode")
    private int mode;
    @Column(name="mode_start_time")
    private LocalDateTime modeStartTime;
    @Column(name="mode_end_time")
    private LocalDateTime modeEndTime;

    public MemberData () {}

    // 아이 패턴 생성시 필요한 생성자, 프론트 -> 백
    public MemberData(long memberId, int mode, LocalDateTime modeStartTime, LocalDateTime modeEndTime) {
        this.memberId = memberId;
        this.mode = mode;
        this.modeStartTime = modeStartTime;
        this.modeEndTime = modeEndTime;
    }

    // DB에서 조회시 필요한 생성자, DB -> 백
    public MemberData(long memberDataId, long memberId, int mode, LocalDateTime modeStartTime, LocalDateTime modeEndTime) {
        this.memberDataId = memberDataId;
        this.memberId = memberId;
        this.mode = mode;
        this.modeStartTime = modeStartTime;
        this.modeEndTime = modeEndTime;
    }

    public long getMemberDataId() {
        return memberDataId;
    }

    public void setMemberDataId(long memberDataId) {
        this.memberDataId = memberDataId;
    }

    public long getMemberId() {
        return memberId;
    }

    public void setMemberId(long memberId) {
        this.memberId = memberId;
    }

    public int getMode() {
        return mode;
    }

    public void setMode(int mode) {
        this.mode = mode;
    }

    public LocalDateTime getModeStartTime() {
        return modeStartTime;
    }

    public void setModeStartTime(LocalDateTime modeStartTime) {
        this.modeStartTime = modeStartTime;
    }

    public LocalDateTime getModeEndTime() {
        return modeEndTime;
    }

    public void setModeEndTime(LocalDateTime modeEndTime) {
        this.modeEndTime = modeEndTime;
    }

    @Override
    public String toString() {
        return "MemberData{" +
                "memberDataId=" + memberDataId +
                ", memberId=" + memberId +
                ", mode=" + mode +
                ", modeStartTime=" + modeStartTime +
                ", modeEndTime=" + modeEndTime +
                '}';
    }
}
