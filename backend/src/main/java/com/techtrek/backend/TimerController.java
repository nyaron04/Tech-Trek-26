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

    private final TimerEntryRepository timerEntryRepository;

    public TimerController(TimerEntryRepository timerEntryRepository) {
        this.timerEntryRepository = timerEntryRepository;
    }

    @PostMapping("/start")
    public ResponseEntity<?> startTimer(@RequestBody StartTimerRequest request) {
        Optional<TimerEntry> existingRunning =
                timerEntryRepository.findFirstByUserIdAndStatusOrderByStartTimeDesc(request.getUserId(), "RUNNING");

        if (existingRunning.isPresent()) {
            return ResponseEntity.badRequest().body("This user already has a running timer.");
        }

        TimerEntry timerEntry = new TimerEntry();
        timerEntry.setUserId(request.getUserId());
        timerEntry.setTaskId(request.getTaskId());
        timerEntry.setStartTime(OffsetDateTime.now());
        timerEntry.setStatus("RUNNING");
        timerEntry.setDurationSeconds(null);
        timerEntry.setEndTime(null);

        TimerEntry saved = timerEntryRepository.save(timerEntry);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/stop/{timerId}")
    public ResponseEntity<?> stopTimer(@PathVariable UUID timerId) {
        Optional<TimerEntry> timerOptional = timerEntryRepository.findById(timerId);

        if (timerOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TimerEntry timerEntry = timerOptional.get();

        if (!"RUNNING".equals(timerEntry.getStatus())) {
            return ResponseEntity.badRequest().body("Timer is not currently running.");
        }

        OffsetDateTime endTime = OffsetDateTime.now();
        timerEntry.setEndTime(endTime);
        timerEntry.setStatus("COMPLETED");

        int duration = (int) java.time.Duration.between(timerEntry.getStartTime(), endTime).getSeconds();
        timerEntry.setDurationSeconds(duration);

        TimerEntry updated = timerEntryRepository.save(timerEntry);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/active/{userId}")
    public ResponseEntity<?> getActiveTimer(@PathVariable UUID userId) {
        Optional<TimerEntry> activeTimer =
                timerEntryRepository.findFirstByUserIdAndStatusOrderByStartTimeDesc(userId, "RUNNING");

        if (activeTimer.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "No active timer found.");
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(activeTimer.get());
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
