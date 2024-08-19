package com.bacation.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fcm")
public class Fcm {
    @Id
    @Column(name="fcm_id")
    private long fcmid;
    @Column(name="token")
    private String token;
    public Fcm () {}

    public Fcm (long fcmid, String token) {
        this.fcmid = fcmid;
        this.token = token;
    }

    public long getFcmid() {
        return fcmid;
    }

    public void setFcmid(long fcmid) {
        this.fcmid = fcmid;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public String toString() {
        return "Fcm{" +
                "fcmid=" + fcmid +
                ", token='" + token + '\'' +
                '}';
    }
}
