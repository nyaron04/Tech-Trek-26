package com.techtrek.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Backend is working!";
    }

    @GetMapping("/test")
    public String test() {
        return "Test endpoint works!";
    }
}