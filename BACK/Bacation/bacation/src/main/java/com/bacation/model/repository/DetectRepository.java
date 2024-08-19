package com.bacation.model.repository;

import com.bacation.model.dto.Detect;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface DetectRepository extends JpaRepository<Detect, Long> {
    @Query("SELECT d " +
            "FROM Detect d " +
            "WHERE d.memberId = :memberId AND d.detectTime >= :detectTime "+
            "AND d.detectName >= :startName " +
            "AND d.detectName < :endName ")
    List<Detect> getDetectList(@Param("memberId") Long memberId,
                               @Param("detectTime") LocalDateTime detectTime,
                               @Param("startName") Integer startName,
                               @Param("endName") Integer endName);


    // 사용자의 특정 모드의 알림 빈도수
    @Query("SELECT COUNT(d) " +
            "FROM Detect d " +
            "WHERE d.detectTime >= :startTime " +
            "AND d.detectTime < :endTime " +
            "AND d.detectName >= :startName " +
            "AND d.detectName < :endName " +
            "AND d.memberId = :memberId")
    Integer countCountDetections(@Param("memberId") Long memberId,
                                 @Param("startName") Integer startName,
                                 @Param("endName") Integer endName,
                                 @Param("startTime") LocalDateTime startTime,
                                 @Param("endTime") LocalDateTime endTime);

    // 하루동안 감지들 중 가장 많이 감지된 기능, 횟수가 동일한 것들 전부 반환함
    @Query(value = "SELECT detect_name " +
            "FROM ( " +
            "    SELECT detect_name, COUNT(detect_name) AS detect_count " +
            "    FROM detect " +
            "    WHERE member_id = :memberId " +
            "      AND detect_time >= :startTime " +
            "      AND detect_time < :endTime " +
            "      AND detect_name >= :startName " +
            "      AND detect_name < :endName " +
            "    GROUP BY detect_name " +
            ") counts " +
            "WHERE detect_count = ( " +
            "    SELECT MAX(detect_count) " +
            "    FROM ( " +
            "        SELECT COUNT(detect_name) AS detect_count " +
            "        FROM detect " +
            "        WHERE member_id = :memberId " +
            "          AND detect_time >= :startTime " +
            "          AND detect_time < :endTime " +
            "          AND detect_name >= :startName " +
            "          AND detect_name < :endName " +
            "        GROUP BY detect_name " +
            "    ) sub " +
            ")", nativeQuery = true)
    List<Integer> getMaxDetectNames(@Param("memberId") Long memberId,
                                    @Param("startName") Integer startName,
                                    @Param("endName") Integer endName,
                                    @Param("startTime") LocalDateTime startTime,
                                    @Param("endTime") LocalDateTime endTime);

    // 0808추가 : 특정 날짜동안 감지된 특정 모드의 내역들
    @Query("SELECT d " +
            "FROM Detect d " +
            "WHERE d.memberId = :memberId "+
            "AND d.detectName >= :startName " +
            "AND d.detectName < :endName "+
    "AND d.detectTime >= :startTime AND d.detectTime < :endTime")
    List<Detect> getDataDetectList(@Param("memberId") Long memberId,
                               @Param("startName") Integer startName,
                               @Param("endName") Integer endName,
                               @Param("startTime") LocalDateTime startTime,
                               @Param("endTime") LocalDateTime endTime);

    // 0812 추가 : 누적으로 활동 혹은 수면모드 내역들 중 가장 많이 감지된 기능 조회, 1개만 반환
    @Query(value = "select d.detect_name, COUNT(*) as count " +
            "from detect d where d.member_id = :memberId " +
            "and d.detect_name >= :startName and d.detect_name < :endName " +
            "group by d.detect_name order by count desc limit 1",
            nativeQuery = true) // 네이티브는 d인식을 잘하기 위함
    String getTotalDetectNames(@Param("memberId") Long memberId,
                               @Param("startName") Integer startName,
                               @Param("endName") Integer endName);


    // 0812 추가 : 누적 감지내역 횟수
    @Query(value = "SELECT COUNT(*) FROM detect WHERE member_id = :memberId" +
            " AND detect_name >= :startName AND detect_name < :endName", nativeQuery = true)
    Integer getTotalDetectCount(@Param("memberId") Long memberId,
                                @Param("startName") Integer startName,
                                @Param("endName") Integer endName);




    // 0812 추가 : 지금까지 이용한 날짜
    @Query(value = "SELECT COUNT(DISTINCT DATE(detect_time)) FROM detect d " +
            "WHERE member_id = :memberId " +
            "AND detect_name >= :startName AND d.detect_name < :endName", nativeQuery = true)
    Integer countDetectDays(@Param("memberId") Long memberId,
                            @Param("startName") Integer startName,
                            @Param("endName") Integer endName);



}
