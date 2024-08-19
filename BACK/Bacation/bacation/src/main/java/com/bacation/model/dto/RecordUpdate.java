package com.bacation.model.dto;

public class RecordUpdate {
    private long recordId;
    private String content;
    private String captureIdList;

    RecordUpdate () {}

    public RecordUpdate(long recordId, String content, String captureIdList) {
        this.recordId = recordId;
        this.content = content;
        this.captureIdList = captureIdList;
    }

    public long getRecordId() {
        return recordId;
    }

    public void setRecordId(long recordId) {
        this.recordId = recordId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCaptureIdList() {
        return captureIdList;
    }

    public void setCaptureIdList(String captureIdList) {
        this.captureIdList = captureIdList;
    }

    @Override
    public String toString() {
        return "RecordUpdate{" +
                "recordId=" + recordId +
                ", content='" + content + '\'' +
                ", captureIdList='" + captureIdList + '\'' +
                '}';
    }
}
