package com.techtrek.backend;

import java.util.UUID;

public record AuthenticatedUser(UUID id, String email) {}
