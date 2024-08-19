package com.bacation.model.repository;

import com.bacation.model.dto.Capture;
import com.bacation.model.dto.Detect;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface CaptureRepository extends JpaRepository<Capture, Long> {

    // 특정 날짜의 모든 캡처 사진목록
    @Query("SELECT d " +
            "FROM Capture d " +
            "WHERE d.memberId = :memberId AND d.captureTime >= :startTime "+
            "AND d.captureTime < :endTime "+
            "order by d.captureTime asc ")
    List<Capture> getCaptureList(@Param("memberId") Long memberId,
                               @Param("startTime") LocalDateTime startTime,
                               @Param("endTime") LocalDateTime endTime);

    // 특정 일지에 사용된 모든 캡처 이미지
    @Query("select c from Capture c where c.recordId = :recordId")
    List<Capture> getCaptureListByRecordId(@Param("recordId") Long recordId);
}
