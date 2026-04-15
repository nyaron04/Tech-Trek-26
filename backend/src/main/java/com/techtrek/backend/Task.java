package com.techtrek.backend;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    private UUID id;

    @NotBlank(message = "Title cannot be empty")
    private String title;

    private String description;

    @NotBlank(message = "Status cannot be empty")
    private String status;

    @Column(name = "category_id")
    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    @Column(name = "user_id")
    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Type cannot be empty")
    private String type;

    public Task() {}

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getType() {
        return type;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setType(String type) {
        this.type = type;
    }
}