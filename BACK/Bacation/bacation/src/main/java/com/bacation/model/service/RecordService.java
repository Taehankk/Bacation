package com.bacation.model.service;

import com.bacation.model.dto.Record;
import com.bacation.model.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RecordService {

    private RecordRepository recordRepository;

    @Autowired
    public RecordService (RecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    public Optional<Record> findById(long id) {
        return recordRepository.findById(id);
    }

    // 특정 사용자 아이디와 날짜로 작성한 일지 조회, 없으면 null값
    public Optional<Record> getRecord(long memberId, LocalDateTime startTime, LocalDateTime endTime) {
        System.out.println("현재 여기는 서비스 : "+memberId+" "+startTime+" "+endTime);
        return recordRepository.getRecordOne(memberId, startTime, endTime);
    }

    // 특정 사용자의 지금까지 작성한 일지 수 가져오기 -> +1하면 몇번째 일지 인지 알 수 있음
    public Long getRecordCount(long memberId) {
        return recordRepository.recordCount(memberId);
    }

    // 일지 아이디로 일지 조회
    public Optional<Record> getRecordById(long recordId) {
        return recordRepository.findById(recordId);
    }

    // 일지 생성
    public void saveRecord(Record record) {
        recordRepository.save(record);
    }

    //일지 삭제
    public void deleteRecord(long recordId) {
        recordRepository.deleteById(recordId);
    }

    // 특정 날짜 이후에 작성된 일지 목록들 가져오기
    // 일지 삭제시 1 2 (3삭제) 4 5 -> 1 2 3 4 로 갱신하기위함
    public List<Record> getAllRecords(long memberId, LocalDateTime startTime) {
        return recordRepository.getRecordsByDateTime(memberId, startTime);
    }
}
