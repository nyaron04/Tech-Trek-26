package com.techtrek.backend;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/{id}")
    public Task getTask(@PathVariable UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    @PostMapping
    public Task createTask(@Valid @RequestBody Task task) {
        task.setId(UUID.randomUUID());
        return taskRepository.save(task);
    }

    
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable UUID id, @Valid @RequestBody Task updatedTask) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());
        task.setCategoryId(updatedTask.getCategoryId());
        task.setUserId(updatedTask.getUserId());
        task.setType(updatedTask.getType());

        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        taskRepository.delete(task);
        return "Task deleted successfully";
    }

    @GetMapping("/status/{status}")
    public List<Task> getTasksByStatus(@PathVariable String status) {
        return taskRepository.findByStatus(status);
    }

    @GetMapping("/category/{categoryId}")
    public List<Task> getTasksByCategory(@PathVariable UUID categoryId) {
        return taskRepository.findByCategoryId(categoryId);
    }

    @GetMapping("/type/{type}")
    public List<Task> getTasksByType(@PathVariable String type) {
        return taskRepository.findByType(type);
    }
}