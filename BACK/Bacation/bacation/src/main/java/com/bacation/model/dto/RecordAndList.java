package com.bacation.model.dto;

import jakarta.persistence.Column;

import java.time.LocalDateTime;
import java.util.List;

// 일지 조회시 예쁘게 담아서 보내기 위한 객체
// DB랑 상관 X
public class RecordAndList {

    private long recordId;
    private long memberId;
    private String content;
    private long recordCount;
    private LocalDateTime recordTime;
    private List<Capture> captures;

    public RecordAndList() {}

    public RecordAndList(long recordId, long memberId, String content, long recordCount, LocalDateTime recordTime, List<Capture> captures) {
        this.recordId = recordId;
        this.memberId = memberId;
        this.content = content;
        this.recordCount = recordCount;
        this.recordTime = recordTime;
        this.captures = captures;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public long getRecordCount() {
        return recordCount;
    }

    public void setRecordCount(long recordCount) {
        this.recordCount = recordCount;
    }

    public LocalDateTime getRecordTime() {
        return recordTime;
    }

    public void setRecordTime(LocalDateTime recordTime) {
        this.recordTime = recordTime;
    }

    public List<Capture> getCaptures() {
        return captures;
    }

    public void setCaptures(List<Capture> captures) {
        this.captures = captures;
    }

    @Override
    public String toString() {
        return "RecordAndList{" +
                "recordId=" + recordId +
                ", memberId=" + memberId +
                ", content='" + content + '\'' +
                ", recordCount=" + recordCount +
                ", recordTime=" + recordTime +
                ", captures=" + captures +
                '}';
    }
}
