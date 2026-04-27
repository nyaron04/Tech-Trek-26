package com.techtrek.backend;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Category> listForUser(@RequestParam UUID userId) {
        return categoryRepository.findByUserIdOrderByCreatedAtAsc(userId);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Category category) {
        // Idempotent-ish: if a category with the same name already exists for
        // this user, return the existing one so callers can use it without
        // having to handle a 409 race themselves.
        return categoryRepository
                .findByUserIdAndNameIgnoreCase(category.getUserId(), category.getName().trim())
                .<ResponseEntity<?>>map(existing -> ResponseEntity.ok(existing))
                .orElseGet(() -> {
                    category.setName(category.getName().trim());
                    Category saved = categoryRepository.save(category);
                    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
                });
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
