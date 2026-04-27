package com.techtrek.backend;

import java.util.UUID;

public class AiScheduleRequest {
    private UUID userId;
    private String message;

    public AiScheduleRequest() {}

    public UUID getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}