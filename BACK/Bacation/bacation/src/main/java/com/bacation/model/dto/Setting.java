package com.bacation.model.dto;

import jakarta.persistence.*;

@Entity
@Table(name = "setting")
public class Setting {

    @Id
    @Column(name = "setting_id")
    private long settingId;
    @Column(name = "fall_caution")
    private boolean fallCaution;
    @Column(name = "crash_caution")
    private boolean crashCaution;
    @Column(name = "stuck_caution")
    private boolean stuckCaution;
    @Column(name = "reverse_caution")
    private boolean reverseCaution;
    @Column(name = "sound_caution")
    private boolean soundCaution;

    public Setting() {}

    public Setting(long settingId, boolean fallCaution, boolean crashCaution, boolean stuckCaution) {
        this.settingId = settingId;
        this.fallCaution = fallCaution;
        this.crashCaution = crashCaution;
        this.stuckCaution = stuckCaution;
    }

    public Setting(long settingId, boolean reverseCaution, boolean soundCaution) {
        this.settingId = settingId;
        this.reverseCaution = reverseCaution;
        this.soundCaution = soundCaution;
    }

    public long getSettingId() {
        return settingId;
    }

    public void setSettingId(long settingId) {
        this.settingId = settingId;
    }

    public boolean isFallCaution() {
        return fallCaution;
    }

    public void setFallCaution(boolean fallCaution) {
        this.fallCaution = fallCaution;
    }

    public boolean isCrashCaution() {
        return crashCaution;
    }

    public void setCrashCaution(boolean crashCaution) {
        this.crashCaution = crashCaution;
    }

    public boolean isStuckCaution() {
        return stuckCaution;
    }

    public void setStuckCaution(boolean stuckCaution) {
        this.stuckCaution = stuckCaution;
    }

    public boolean isReverseCaution() {
        return reverseCaution;
    }

    public void setReverseCaution(boolean reverseCaution) {
        this.reverseCaution = reverseCaution;
    }

    public boolean isSoundCaution() {
        return soundCaution;
    }

    public void setSoundCaution(boolean soundCaution) {
        this.soundCaution = soundCaution;
    }

    @Override
    public String toString() {
        return "Setting{" +
                "settingId=" + settingId +
                ", fallCaution=" + fallCaution +
                ", crashCaution=" + crashCaution +
                ", stuckCaution=" + stuckCaution +
                ", reverseCaution=" + reverseCaution +
                ", soundCaution=" + soundCaution +
                '}';
    }
}
