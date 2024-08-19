package com.bacation.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

// 최종 기능감지로 설정될 부분
// 백 -> DB
@Entity
@Table(name = "detect")
public class Detect {

    @Id
    @Column(name="detect_id")
    private long detectId;
    @Column(name="member_id")
    private long memberId;
    @Column(name = "detect_name")
    private int detectName;
    @Column(name="detect_time")
    private LocalDateTime detectTime;

    public Detect() {}

    public Detect(long detectId, long memberId, LocalDateTime detectTime, int detectName) {
        this.detectId = detectId;
        this.memberId = memberId;
        this.detectTime = detectTime;
        this.detectName = detectName;
    }

    public long getDetectId() {
        return detectId;
    }

    public void setDetectId(long detectId) {
        this.detectId = detectId;
    }

    public long getMemberId() {
        return memberId;
    }

    public void setMemberId(long memberId) {
        this.memberId = memberId;
    }

    public int getDetectName() {
        return detectName;
    }

    public void setDetectName(int detectName) {
        this.detectName = detectName;
    }

    public LocalDateTime getDetectTime() {
        return detectTime;
    }

    public void setDetectTime(LocalDateTime detectTime) {
        this.detectTime = detectTime;
    }

    @Override
    public String toString() {
        return "Detect{" +
                "detectId=" + detectId +
                ", memberId=" + memberId +
                ", detectName=" + detectName +
                ", detectTime=" + detectTime +
                '}';
    }
}
