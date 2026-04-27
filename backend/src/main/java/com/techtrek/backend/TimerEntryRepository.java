package com.techtrek.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TimerEntryRepository extends JpaRepository<TimerEntry, UUID> {

    List<TimerEntry> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<TimerEntry> findByTaskIdOrderByCreatedAtDesc(UUID taskId);

    Optional<TimerEntry> findFirstByUserIdAndStatusOrderByStartTimeDesc(UUID userId, String status);

    Optional<TimerEntry> findFirstByUserIdAndStatusInOrderByUpdatedAtDesc(UUID userId, List<String> statuses);
}