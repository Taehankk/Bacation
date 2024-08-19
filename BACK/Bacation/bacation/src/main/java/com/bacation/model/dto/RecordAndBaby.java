package com.bacation.model.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// db 구조를 바꾸지 않기 위한 객체
// 기존 일지 테이블에 필요한 아이 출생년월일을 추가하기 위한 객체
public class RecordAndBaby {
    private long recordId;
    private long memberId;
    private String content;
    private long recordCount;
    private LocalDateTime recordTime;
    private long babyBirthdate;
    private List<Capture> captures;

    public RecordAndBaby() {}

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

    public long getBabyBirthdate() {
        return babyBirthdate;
    }

    public void setBabyBirthdate(long babyBirthdate) {
        this.babyBirthdate = babyBirthdate;
    }

    public List<Capture> getCaptures() {
        return captures;
    }

    public void setCaptures(List<Capture> captures) {
        this.captures = captures;
    }
}
