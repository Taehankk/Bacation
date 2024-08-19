package com.bacation.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bacation.model.repository.ActiveRepository;
import com.bacation.model.dto.Setting;

import java.util.Optional;

@Service
public class ActiveService {
    private ActiveRepository activeRepository;

    @Autowired
    public ActiveService(ActiveRepository activeRepository) {
        this.activeRepository = activeRepository;
    }

    public Optional<Setting> getSetting(long settingId) {
        return activeRepository.findById(settingId);
    }

    //insert와 동시에 update 작동함
    public void saveSetting(Setting setting) {
        System.out.println("저장하기 전 모습 : "+setting.toString());
        activeRepository.save(setting);
    }


}
