package com.bacation.model.repository;

import com.bacation.model.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // SELECT * FROM Member WHERE auth_id = ?;
    Optional<Member> findByAuthId(long authId);
    Optional<Member> findByEmail(String email);
}
