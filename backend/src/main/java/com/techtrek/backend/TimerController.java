package com.techtrek.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/timer")
@CrossOrigin(origins = "*")
public class TimerController {

    private static final String RUNNING = "RUNNING";
    private static final String PAUSED = "PAUSED";
    private static final String COMPLETED = "COMPLETED";
    private static final List<String> ACTIVE_STATUSES = List.of(RUNNING, PAUSED);

    private final TimerEntryRepository timerEntryRepository;

    public TimerController(TimerEntryRepository timerEntryRepository) {
        this.timerEntryRepository = timerEntryRepository;
    }

    @PostMapping("/start")
    public ResponseEntity<?> startTimer(@RequestBody StartTimerRequest request) {
        Optional<TimerEntry> existingActive =
                timerEntryRepository.findFirstByUserIdAndStatusInOrderByUpdatedAtDesc(request.getUserId(), ACTIVE_STATUSES);

        if (existingActive.isPresent()) {
            return ResponseEntity.badRequest().body("This user already has an active timer.");
        }

        TimerEntry timerEntry = new TimerEntry();
        timerEntry.setUserId(request.getUserId());
        timerEntry.setTaskId(request.getTaskId());
        timerEntry.setStartTime(OffsetDateTime.now());
        timerEntry.setStatus(RUNNING);
        timerEntry.setDurationSeconds(0);
        timerEntry.setEndTime(null);

        TimerEntry saved = timerEntryRepository.save(timerEntry);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/pause/{timerId}")
    public ResponseEntity<?> pauseTimer(@PathVariable UUID timerId) {
        Optional<TimerEntry> timerOptional = timerEntryRepository.findById(timerId);

        if (timerOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TimerEntry timerEntry = timerOptional.get();

        if (!RUNNING.equals(timerEntry.getStatus())) {
            return ResponseEntity.badRequest().body("Timer is not currently running.");
        }

        OffsetDateTime pausedAt = OffsetDateTime.now();
        int durationSeconds = totalDurationSeconds(timerEntry, pausedAt);
        timerEntry.setEndTime(pausedAt);
        timerEntry.setStatus(PAUSED);
        timerEntry.setDurationSeconds(durationSeconds);

        TimerEntry updated = timerEntryRepository.save(timerEntry);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/resume/{timerId}")
    public ResponseEntity<?> resumeTimer(@PathVariable UUID timerId) {
        Optional<TimerEntry> timerOptional = timerEntryRepository.findById(timerId);

        if (timerOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TimerEntry timerEntry = timerOptional.get();

        if (!PAUSED.equals(timerEntry.getStatus())) {
            return ResponseEntity.badRequest().body("Timer is not paused.");
        }

        timerEntry.setStartTime(OffsetDateTime.now());
        timerEntry.setEndTime(null);
        timerEntry.setStatus(RUNNING);

        TimerEntry updated = timerEntryRepository.save(timerEntry);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/stop/{timerId}")
    public ResponseEntity<?> stopTimer(@PathVariable UUID timerId) {
        Optional<TimerEntry> timerOptional = timerEntryRepository.findById(timerId);

        if (timerOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TimerEntry timerEntry = timerOptional.get();

        if (!RUNNING.equals(timerEntry.getStatus()) && !PAUSED.equals(timerEntry.getStatus())) {
            return ResponseEntity.badRequest().body("Timer is not active.");
        }

        OffsetDateTime endTime = OffsetDateTime.now();
        int durationSeconds = totalDurationSeconds(timerEntry, endTime);
        timerEntry.setEndTime(endTime);
        timerEntry.setStatus(COMPLETED);
        timerEntry.setDurationSeconds(durationSeconds);

        TimerEntry updated = timerEntryRepository.save(timerEntry);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/active/{userId}")
    public ResponseEntity<?> getActiveTimer(@PathVariable UUID userId) {
        Optional<TimerEntry> activeTimer =
                timerEntryRepository.findFirstByUserIdAndStatusInOrderByUpdatedAtDesc(userId, ACTIVE_STATUSES);

        if (activeTimer.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "No active timer found.");
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(activeTimer.get());
    }

    private int totalDurationSeconds(TimerEntry timerEntry, OffsetDateTime now) {
        int accumulated = timerEntry.getDurationSeconds() == null ? 0 : timerEntry.getDurationSeconds();
        if (RUNNING.equals(timerEntry.getStatus())) {
            accumulated += (int) java.time.Duration.between(timerEntry.getStartTime(), now).getSeconds();
        }
        return accumulated;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TimerEntry>> getTimersByUser(@PathVariable UUID userId) {
        List<TimerEntry> timers = timerEntryRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(timers);
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TimerEntry>> getTimersByTask(@PathVariable UUID taskId) {
        List<TimerEntry> timers = timerEntryRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
        return ResponseEntity.ok(timers);
    }

    public static class StartTimerRequest {
        private UUID userId;
        private UUID taskId;

        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public UUID getTaskId() {
            return taskId;
        }

        public void setTaskId(UUID taskId) {
            this.taskId = taskId;
        }
    }
}
