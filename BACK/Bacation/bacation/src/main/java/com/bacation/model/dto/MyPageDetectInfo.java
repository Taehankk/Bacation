package com.bacation.model.dto;

import java.util.Arrays;
import java.util.List;

// 마이페이지에서 총 감지 횟수와 가장 많이 감지된 감지명
public class MyPageDetectInfo {
    List<String> manyDetects;
    int detectCount;

    public MyPageDetectInfo() {}

    public MyPageDetectInfo(List<String> manyDetects, int detectCount) {
        this.manyDetects = manyDetects;
        this.detectCount = detectCount;
    }

    public List<String> getManyDetects() {
        return manyDetects;
    }

    public void setManyDetects(List<String> manyDetects) {
        this.manyDetects = manyDetects;
    }

    public int getDetectCount() {
        return detectCount;
    }

    public void setDetectCount(int detectCount) {
        this.detectCount = detectCount;
    }

    @Override
    public String toString() {
        return "MyPageDetectInfo{" +
                "manyDetects=" + manyDetects +
                ", detectCount=" + detectCount +
                '}';
    }
}
