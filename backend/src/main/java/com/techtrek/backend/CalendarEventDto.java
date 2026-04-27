package com.techtrek.backend;

public class CalendarEventDto {
    private String title;
    private String startTime;
    private String category;

    public CalendarEventDto() {}

    public String getTitle() {
        return title;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getCategory() {
        return category;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}