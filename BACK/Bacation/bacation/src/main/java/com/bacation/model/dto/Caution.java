package com.bacation.model.dto;

// 기능 작동 후 해당 기능이 온오프 됐는지 알려주는 객체
// 백 -> 프론트 에서만 사용하는 객체, DB접근 x
public class Caution {
    int detectName;
    boolean caution;

    Caution(){}

    public Caution(int detectName, boolean caution) {
        this.detectName = detectName;
        this.caution = caution;
    }

    public int getDetectName() {
        return detectName;
    }

    public void setDetectName(int detectName) {
        this.detectName = detectName;
    }

    public boolean isCaution() {
        return caution;
    }

    public void setCaution(boolean caution) {
        this.caution = caution;
    }
}
