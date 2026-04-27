package com.techtrek.backend;

import java.util.List;
import java.util.UUID;

public class AiScheduleRequest {
    private UUID userId;
    private String message;
    private List<CalendarEventDto> calendarEvents;

    public AiScheduleRequest() {}

    public class CalendarEvent {
    private String title;
    private String startTime;
    private String endTime;

    // getters + setters
    }   
    public UUID getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }

    public List<CalendarEventDto> getCalendarEvents() {
        return calendarEvents;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setCalendarEvents(List<CalendarEventDto> calendarEvents) {
        this.calendarEvents = calendarEvents;
    }

    private List<CalendarEventDto> pendingAiEvents;

    public List<CalendarEventDto> getPendingAiEvents() {
        return pendingAiEvents;
    }

    public void setPendingAiEvents(List<CalendarEventDto> pendingAiEvents) {
        this.pendingAiEvents = pendingAiEvents;
    }
}