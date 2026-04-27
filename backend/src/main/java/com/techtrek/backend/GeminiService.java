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
                return fallbackJson("I could not generate a recommendation right now.");
            }

            return cleanJson(text);

        } catch (Exception e) {
            System.out.println("Gemini error: " + e.getMessage());

            if (e.getMessage() != null && e.getMessage().contains("Quota exceeded")) {
                return fallbackJson("You're sending requests a bit too fast. Please wait a few seconds and try again.");
            }

            return fallbackJson("AI recommendation is temporarily unavailable. Please try again later.");
        }
    }

    private Client getClient() {
        if (client == null) {
            client = new Client();
        }
        return client;
    }

    private String cleanJson(String text) {
        return text
                .replace("```json", "")
                .replace("```", "")
                .trim();
    }

    private String fallbackJson(String message) {
        return """
                {
                  "message": "%s",
                  "suggestedBlocks": []
                }
                """.formatted(message.replace("\"", "\\\""));
    }
}