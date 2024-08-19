package com.bacation.model.repository;

import com.bacation.model.dto.Record;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface RecordRepository extends JpaRepository<Record, Long> {
    // 해당 날짜로 일지 조회
    @Query("SELECT r FROM Record r " +
            "WHERE r.memberId = :memberId " +
            "AND r.recordTime >= :startTime " +
            "AND r.recordTime < :endTime")
    Optional<Record> getRecordOne(@Param("memberId") Long memberId,
                              @Param("startTime") LocalDateTime startTime,
                              @Param("endTime") LocalDateTime endTime);

    // 특정 사용자의 지금까지 작성한 일지 수
    @Query("select count(r) from Record r where r.memberId = :memberId")
    Long recordCount(@Param("memberId") Long memberId);

    // 특정 날짜 이후 존재하는 모든 일지들
    @Query("select r from Record r where r.memberId = :memberId and r.recordTime > :startTime")
    List<Record> getRecordsByDateTime(@Param("memberId") long memberId,
            @Param("startTime") LocalDateTime startTime);

}
