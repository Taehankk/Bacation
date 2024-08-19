package com.bacation.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name="record")
public class Record {

    @Id
    @Column(name="record_id")
    private long recordId;
    @Column(name="member_id")
    private long memberId;
    @Column(name="content")
    private String content;
    @Column(name="record_count")
    private long recordCount;
    @Column(name="record_time")
    private LocalDateTime recordTime;

    public Record() {}

    public Record(long recordId, long memberId, String content, long recordCount, LocalDateTime recordTime) {
        this.recordId = recordId;
        this.memberId = memberId;
        this.content = content;
        this.recordCount = recordCount;
        this.recordTime = recordTime;
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

    @Override
    public String toString() {
        return "Record{" +
                "recordId=" + recordId +
                ", memberId=" + memberId +
                ", content='" + content + '\'' +
                ", recordCount=" + recordCount +
                ", recordTime=" + recordTime +
                '}';
    }
}
