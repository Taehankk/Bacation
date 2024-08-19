package com.bacation.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

// 수정을 위한 객체
public class UpdateMemberData {

    private long memberDataId;
    private long memberId;
    private int mode;
    private String modeStartTime;
    private String modeEndTime;

    UpdateMemberData() {}

    // 프론트에서 백으로 보내는 정보들, 멤버아이디만 없음
    public UpdateMemberData(long memberDataId, int mode, String modeStartTime, String modeEndTime) {
        this.memberDataId = memberDataId;
        this.mode = mode;
        this.modeStartTime = modeStartTime;
        this.modeEndTime = modeEndTime;
    }

    public UpdateMemberData(long memberDataId, long memberId, int mode, String modeStartTime, String modeEndTime) {
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

    public String getModeStartTime() {
        return modeStartTime;
    }

    public void setModeStartTime(String modeStartTime) {
        this.modeStartTime = modeStartTime;
    }

    public String getModeEndTime() {
        return modeEndTime;
    }

    public void setModeEndTime(String modeEndTime) {
        this.modeEndTime = modeEndTime;
    }

    @Override
    public String toString() {
        return "UpdateMemberData{" +
                "memberDataId=" + memberDataId +
                ", memberId=" + memberId +
                ", mode=" + mode +
                ", modeStartTime='" + modeStartTime + '\'' +
                ", modeEndTime='" + modeEndTime + '\'' +
                '}';
    }
}
