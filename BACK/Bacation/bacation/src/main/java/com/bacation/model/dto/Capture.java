package com.bacation.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "capture")
public class Capture {

    @Id
    @Column(name="capture_id")
    private long captureId;
    @Column(name="record_id")
    private long recordId;
    @Column(name="member_id")
    private long memberId;
    @Column(name="capture_url")
    private String captureUrl;
    @Column(name="capture_time")
    private LocalDateTime captureTime;

    public Capture() {}

    public Capture(long captureId, long recordId, long memberId, String captureUrl, LocalDateTime captureTime) {
        this.captureId = captureId;
        this.recordId = recordId;
        this.memberId = memberId;
        this.captureUrl = captureUrl;
        this.captureTime = captureTime;
    }

    public long getCaptureId() {
        return captureId;
    }

    public void setCaptureId(long captureId) {
        this.captureId = captureId;
    }

    public long getRecordId() {
        return recordId;
    }

    public void setRecordId(long recordId) {
        this.recordId = recordId;
    }

    public long getMemberId() {
        return memberId;
    }

    public void setMemberId(long memberId) {
        this.memberId = memberId;
    }

    public String getCaptureUrl() {
        return captureUrl;
    }

    public void setCaptureUrl(String captureUrl) {
        this.captureUrl = captureUrl;
    }

    public LocalDateTime getCaptureTime() {
        return captureTime;
    }

    public void setCaptureTime(LocalDateTime captureTime) {
        this.captureTime = captureTime;
    }

    @Override
    public String toString() {
        return "Capture{" +
                "captureId=" + captureId +
                ", recordId=" + recordId +
                ", memberId=" + memberId +
                ", captureUrl='" + captureUrl + '\'' +
                ", captureTime=" + captureTime +
                '}';
    }
}
