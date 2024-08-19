package com.bacation.model.repository;

import com.bacation.model.dto.Detect;
import com.bacation.model.dto.MemberData;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface MemberDataRepository extends JpaRepository<MemberData, Long> {

    @Query("SELECT d " +
            "FROM MemberData d " +
            "WHERE d.memberId = :memberId AND d.modeStartTime >= :startTime "+
            "AND d.modeEndTime < :endTime ORDER BY d.modeStartTime ASC")
    List<MemberData> getMemberDataList(@Param("memberId") Long memberId,
                                       @Param("startTime") LocalDateTime startTime,
                                       @Param("endTime") LocalDateTime endTime);
}
