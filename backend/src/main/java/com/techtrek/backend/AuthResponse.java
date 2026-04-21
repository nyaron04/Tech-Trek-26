package com.techtrek.backend;

import java.util.UUID;

public record AuthResponse(
        String token,
        String tokenType,
        long expiresInSeconds,
        UserView user
) {
    public record UserView(UUID id, String email, String displayName) {
        public static UserView from(AppUser user) {
            return new UserView(user.getId(), user.getEmail(), user.getDisplayName());
        }
    }
}
