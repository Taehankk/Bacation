package com.bacation.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

// 아직 감지 과정의 객체
// 프론트 -> 백을 위한 객체
public class TempDetect {
    private long memberId; // 사용자의 멤버테이블 아이디
    private String detectName; // 감지명, 티처블머신 클래스명
    private float detectValue; // 감지수치, 티처블 머신 감지수치

    TempDetect() {}

    public TempDetect(long memberId, String detectName, float detectValue) {
        this.memberId = memberId;
        this.detectName = detectName;
        this.detectValue = detectValue;
    }

    public long getMemberId() {
        return memberId;
    }

    public void setMemberId(long memberId) {
        this.memberId = memberId;
    }

    public String getDetectName() {
        return detectName;
    }

    public void setDetectName(String detectName) {
        this.detectName = detectName;
    }

    public float getDetectValue() {
        return detectValue;
    }

    public void setDetectValue(float detectValue) {
        this.detectValue = detectValue;
    }

    @Override
    public String toString() {
        return "TempDetect{" +
                "memberId=" + memberId +
                ", detectName='" + detectName + '\'' +
                ", detectValue=" + detectValue +
                '}';
    }
}
