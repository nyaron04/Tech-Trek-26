package com.techtrek.backend;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/ai")
public class AiScheduleController {

    private final TaskRepository taskRepository;
    private final TimerEntryRepository timerEntryRepository;
    private final GeminiService geminiService;

    public AiScheduleController(
            TaskRepository taskRepository,
            TimerEntryRepository timerEntryRepository,
            GeminiService geminiService
    ) {
        this.taskRepository = taskRepository;
        this.timerEntryRepository = timerEntryRepository;
        this.geminiService = geminiService;
    }

    @GetMapping("/schedule/{userId}")
    public String getScheduleRecommendation(@PathVariable UUID userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        List<TimerEntry> timerEntries = timerEntryRepository.findByUserIdOrderByCreatedAtDesc(userId);

        String prompt = buildPrompt(tasks, timerEntries);

        return geminiService.generateRecommendation(prompt);
    }

    @PostMapping("/schedule/chat")
    public String getChatScheduleRecommendation(@RequestBody AiScheduleRequest request) {
        List<Task> tasks = taskRepository.findByUserId(request.getUserId());
        List<TimerEntry> timerEntries =
                timerEntryRepository.findByUserIdOrderByCreatedAtDesc(request.getUserId());

        String prompt = buildPrompt(tasks, timerEntries)
                + "\n\nCURRENT CALENDAR EVENTS:\n"
                + buildCalendarEventText(request.getCalendarEvents())
                + "\n\nCURRENT PENDING AI SUGGESTIONS:\n"
                + buildCalendarEventText(request.getPendingAiEvents())          
                + "\n\nUser message:\n"
                + request.getMessage()
                + """

                Based on the user's tasks, timer history, calendar events, and message, suggest calendar time blocks.

                Return ONLY valid JSON in this exact format:
                {
                  "message": "short explanation",
                  "suggestedBlocks": [
                    {
                      "title": "task title",
                      "startTime": "2026-04-27T14:00:00",
                      "endTime": "2026-04-27T15:00:00",
                      "category": "Study"
                    }
                  ]
                }

                Rules:
                - Do not include markdown.
                - Do not include text outside the JSON.
                - Avoid overlapping existing calendar events.
                - Do not create duplicate time blocks.
                - If a similar block already exists, do not recreate it.
                - If no block should be added, return an empty suggestedBlocks array.
                - Use realistic future times based on the user's message.
                - If the user asks for tomorrow, choose a time tomorrow.
                - If the user changes constraints (e.g. "not Tuesday", "shorter session"),
                    adjust the previous schedule instead of creating a completely new one.
                - If the user specifies a duration, the difference between startTime and endTime must match that duration exactly.
                - If the user mentions a task title, use the closest matching task from TASKS.
                - If the user mentions a category like homework, math, study, or work, choose the closest matching task/category from TASKS.
                - Use the matched task title as the block title when possible.
                - If the requested time overlaps with an existing calendar event, choose the nearest available open time instead of returning an overlapping block.
                - For category, return the closest matching category name from the user's existing categories or tasks.     
                - When assigning a category, use the closest matching category name from the user's existing categories.
                - Do not invent new category names.
                - If pending AI suggestions exist, revise those suggestions based on the user's message instead of creating duplicate suggestions.
                - If the user asks to move, shorten, lengthen, or avoid a day/time, update the existing pending block.
                - If the user specifies a duration, use that exact duration.
                - If the user does not specify a duration, estimate duration from timer history for similar tasks or categories.
                - If timer history is unavailable, default to 60 minutes.
                - Never create a block shorter than 15 minutes.
                - Prefer splitting blocks longer than 2 hours into smaller sessions.
                - Use TIMER ENTRIES to estimate how long similar tasks usually take.
                - If the user asks for a task/category and does not specify a duration, calculate a reasonable duration from similar timer entries.
                - Mention the estimate in the message, for example: "Based on your past timer data, this usually takes about 2 hours."
                - If there is no relevant timer history, default to 60 minutes.
                - If the user specifies an exact duration, use the user's duration instead of timer history.
                """;

        return geminiService.generateRecommendation(prompt);
    }

    private String buildCalendarEventText(List<CalendarEventDto> events) {
        if (events == null || events.isEmpty()) {
            return "No existing calendar events found.\n";
        }

        StringBuilder sb = new StringBuilder();

        for (CalendarEventDto e : events) {
            sb.append("- ")
              .append(e.getTitle())
              .append(" from ")
              .append(e.getStartTime());

            if (e.getEndTime() != null) {
                sb.append(" to ").append(e.getEndTime());
            }

            if (e.getCategory() != null) {
                sb.append(" | Category: ").append(e.getCategory());
            }

            sb.append("\n");
        }

        return sb.toString();
    }

    private String buildPrompt(List<Task> tasks, List<TimerEntry> timerEntries){
        StringBuilder prompt = new StringBuilder();

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        prompt.append("Return all scheduled times in ISO format (YYYY-MM-DDTHH:MM:SS).\n\n");
        prompt.append("You are a productivity scheduling assistant.\n");
        prompt.append("Use the user's recent task and timer history to help schedule their time.\n");
        prompt.append("Focus on creating actionable scheduling suggestions.\n\n");

        prompt.append("TASKS:\n");
        if (tasks.isEmpty()) {
            prompt.append("No tasks found.\n");
        } else {
            for (Task task : tasks) {
                prompt.append("- Title: ").append(task.getTitle()).append("\n");
                prompt.append("  Status: ").append(task.getStatus()).append("\n");
                prompt.append("  Type: ").append(task.getType()).append("\n");
                prompt.append("  Category ID: ").append(task.getCategoryId()).append("\n\n");
            }
        }

        prompt.append("TIMER ENTRIES:\n");
        if (timerEntries.isEmpty()) {
            prompt.append("No timer entries found.\n");
        } else {
            for (TimerEntry timer : timerEntries) {
                String taskTitle = "Unknown task";

                for (Task task : tasks) {
                    if (task.getId().equals(timer.getTaskId())) {
                        taskTitle = task.getTitle();
                        break;
                    }
                }

                prompt.append("- Task Title: ").append(taskTitle).append("\n");
                prompt.append("  Task ID: ").append(timer.getTaskId()).append("\n");
                prompt.append("  Start Time: ").append(timer.getStartTime()).append("\n");
                prompt.append("  End Time: ").append(timer.getEndTime()).append("\n");
                prompt.append("  Duration Seconds: ").append(timer.getDurationSeconds()).append("\n");
                prompt.append("  Status: ").append(timer.getStatus()).append("\n\n");
            }
        }

        return prompt.toString();
    }
}