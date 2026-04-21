// Centralized auth helpers for talking to the Spring Boot backend.
// Token + cached user are kept in localStorage so they survive a refresh.
// Any component can call getUserId() / getCurrentUser() synchronously, or
// use the useCurrentUser() hook to re-render on sign-in/sign-out.

import { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
const TOKEN_KEY = 'studylynk.token';
const USER_KEY = 'studylynk.user';

const listeners = new Set();

function emit() {
  const user = getCurrentUser();
  listeners.forEach((fn) => {
    try { fn(user); } catch { /* ignore listener errors */ }
  });
}

function persist(authResponse) {
  localStorage.setItem(TOKEN_KEY, authResponse.token);
  localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
  emit();
}

async function readError(res, fallback) {
  try {
    const body = await res.json();
    return body.error || body.message || fallback;
  } catch {
    return fallback;
  }
}

export async function signIn(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(await readError(res, `Sign in failed (${res.status})`));
  }
  const data = await res.json();
  persist(data);
  return data.user;
}

export async function signUp(email, password, displayName) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName }),
  });
  if (!res.ok) {
    throw new Error(await readError(res, `Sign up failed (${res.status})`));
  }
  const data = await res.json();
  persist(data);
  return data.user;
}

export function signOut() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emit();
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getUserId() {
  return getCurrentUser()?.id ?? null;
}

export function isAuthenticated() {
  return !!getToken();
}

// Re-fetches the user from /auth/me. Use after page load to verify the
// stored token is still valid; clears local session on 401.
export async function refreshCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    signOut();
    return null;
  }
  if (!res.ok) return getCurrentUser();

  const user = await res.json();
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  emit();
  return user;
}

// Drop-in replacement for fetch() that adds the Bearer token. On 401 it
// clears the local session so the UI can react.
export async function authFetch(input, init = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type') && typeof init.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(input, { ...init, headers });
  if (res.status === 401) signOut();
  return res;
}

export function onAuthChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// React hook: returns the current user (or null) and re-renders on changes.
// Usage:  const user = useCurrentUser();  const userId = user?.id;
export function useCurrentUser() {
  const [user, setUser] = useState(() => getCurrentUser());
  useEffect(() => {
    setUser(getCurrentUser());
    const unsubscribe = onAuthChange(setUser);
    const onStorage = (e) => {
      if (e.key === USER_KEY || e.key === TOKEN_KEY) setUser(getCurrentUser());
    };
    window.addEventListener('storage', onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return user;
}

export const __internal = { API_BASE, TOKEN_KEY, USER_KEY };
