package com.techtrek.backend;

import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@Service
public class GeminiService {

    private Client client;

    public String generateRecommendation(String prompt) {
        try {
            GenerateContentResponse response =
                    getClient().models.generateContent(
                            "gemini-2.5-flash",
                            prompt,
                            null
                    );

            String text = response.text();

            if (text == null || text.isBlank()) {
                return "Gemini returned an empty response.";
            }

            return text;

        } catch (Exception e) {
            System.out.println("Gemini error: " + e.getMessage());

            if (e.getMessage().contains("Quota exceeded")) {
                return "You're sending requests a bit too fast 😅 Give me a few seconds and try again!";
            }

            return "AI recommendation is temporarily unavailable. Please try again later.";
        }
    }

    private Client getClient() {
        if (client == null) {
            client = new Client();
        }

        return client;
    }
}