package com.bacation.model.dto;

import java.time.LocalDateTime;

// 서버 상의 감지내역
// DB 정보랑 별도로 존재, 감지내역 조회를 위한 객체
public class DetectInfo {
    private String infoName;
    private LocalDateTime infoTime;

    DetectInfo() {}

    public DetectInfo(String infoName, LocalDateTime infoTime) {
        this.infoName = infoName;
        this.infoTime = infoTime;
    }

    public String getInfoName() {
        return infoName;
    }

    public void setInfoName(String infoName) {
        this.infoName = infoName;
    }

    public LocalDateTime getInfoTime() {
        return infoTime;
    }

    public void setInfoTime(LocalDateTime infoTime) {
        this.infoTime = infoTime;
    }

    @Override
    public String toString() {
        return "DetectInfo{" +
                "infoName='" + infoName + '\'' +
                ", infoTime=" + infoTime +
                '}';
    }
}
