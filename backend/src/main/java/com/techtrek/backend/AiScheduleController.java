package com.techtrek.backend;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
        System.out.println("AI schedule endpoint hit for user: " + userId);
        List<Task> tasks = taskRepository.findByUserId(userId);
        List<TimerEntry> timerEntries = timerEntryRepository.findByUserIdOrderByCreatedAtDesc(userId);

        String prompt = buildPrompt(tasks, timerEntries);

        return geminiService.generateRecommendation(prompt);
    }

    private String buildPrompt(List<Task> tasks, List<TimerEntry> timerEntries) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("You are a productivity scheduling assistant.\n");
        prompt.append("Use the user's recent task and timer history to give a general scheduling recommendation.\n");
        prompt.append("Do not create exact calendar blocks yet. Give practical advice about what the user should prioritize and how they should organize their work.\n\n");

        prompt.append("TASKS:\n");
        if (tasks.isEmpty()) {
            prompt.append("No tasks found.\n");
        } else {
            for (Task task : tasks) {
                prompt.append("- Title: ").append(task.getTitle()).append("\n");
                prompt.append("  Status: ").append(task.getStatus()).append("\n");
                prompt.append("  Type: ").append(task.getType()).append("\n");
                prompt.append("  Category ID: ").append(task.getCategoryId()).append("\n");
                prompt.append("\n");
            }
        }

        prompt.append("TIMER ENTRIES:\n");
        if (timerEntries.isEmpty()) {
            prompt.append("No timer entries found.\n");
        } else {
            for (TimerEntry timer : timerEntries) {
                prompt.append("- Task ID: ").append(timer.getTaskId()).append("\n");
                prompt.append("  Start Time: ").append(timer.getStartTime()).append("\n");
                prompt.append("  End Time: ").append(timer.getEndTime()).append("\n");
                prompt.append("  Duration Seconds: ").append(timer.getDurationSeconds()).append("\n");
                prompt.append("  Status: ").append(timer.getStatus()).append("\n");
                prompt.append("\n");
            }
        }

        prompt.append("Recommendation format:\n");
        prompt.append("Write 1 short paragraph, then 3 bullet points.\n");
        prompt.append("Mention patterns from the timer/task data when possible.\n");

        return prompt.toString();
    }
}