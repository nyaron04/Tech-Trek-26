package com.techtrek.backend;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByStatus(String status);
    List<Task> findByCategoryId(UUID categoryId);
    List<Task> findByType(String type);
}