package com.bacation.model.repository;

import com.bacation.model.dto.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActiveRepository extends JpaRepository<Setting, Long> {
}
