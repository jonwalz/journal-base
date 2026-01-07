# API Contracts - Server

## Overview

The server exposes a RESTful API on port `3030` (default). All protected endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

**Base URL**: `http://localhost:3030` (development)
**Documentation**: `/swagger` (Swagger UI when running)

## Authentication Endpoints

### POST /auth/signup

Create a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

**Errors**:
- `400` - Validation error (invalid email/password format)
- `409` - Email already exists

---

### POST /auth/login

Authenticate and receive tokens.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "expiresIn": 3600
}
```

**Errors**:
- `401` - Invalid credentials

---

### POST /auth/logout

Invalidate the current session (requires auth).

**Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

---

## Journal Endpoints

All journal endpoints require authentication.

### GET /journals

List all journals for the authenticated user.

**Response** (200):
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "title": "My Journal",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

---

### POST /journals

Create a new journal.

**Request**:
```json
{
  "title": "My New Journal"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "My New Journal",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### GET /journals/:journalId/entries

List all entries for a journal.

**Response** (200):
```json
[
  {
    "id": "uuid",
    "journalId": "uuid",
    "content": "Today I learned...",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

---

### POST /journals/:journalId/entries

Create a new journal entry. Triggers AI goal generation (async).

**Request**:
```json
{
  "content": "Today I reflected on my growth..."
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "journalId": "uuid",
  "content": "Today I reflected on my growth...",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### GET /journals/:journalId/entries/:entryId

Get a specific entry.

**Response** (200):
```json
{
  "id": "uuid",
  "journalId": "uuid",
  "content": "Entry content...",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### PUT /journals/:journalId/entries/:entryId

Update an entry.

**Request**:
```json
{
  "content": "Updated content..."
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "content": "Updated content...",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

### DELETE /journals/:journalId/entries/:entryId

Delete an entry.

**Response** (204): No content

---

## Goal Endpoints

### GET /goals

List goals for the authenticated user.

**Query Parameters**:
- `status` - Filter by status (suggested, accepted, completed, deleted)
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset

**Response** (200):
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "journalEntryId": "uuid",
    "content": "Practice gratitude daily",
    "suggestedAt": "2025-01-01T00:00:00Z",
    "acceptedAt": null,
    "completedAt": null,
    "targetDate": "2025-02-01",
    "relatedMetricType": "resilience",
    "sourceType": "ai_generated"
  }
]
```

---

### POST /goals/:goalId/accept

Accept a suggested goal.

**Response** (200):
```json
{
  "id": "uuid",
  "acceptedAt": "2025-01-01T00:00:00Z"
}
```

---

### POST /goals/:goalId/complete

Mark a goal as completed.

**Response** (200):
```json
{
  "id": "uuid",
  "completedAt": "2025-01-01T00:00:00Z"
}
```

---

### DELETE /goals/:goalId

Soft-delete a goal.

**Response** (204): No content

---

## Metrics Endpoints

### GET /metrics

Get growth mindset metrics for the user.

**Query Parameters**:
- `startDate` - Filter start (ISO date)
- `endDate` - Filter end (ISO date)
- `type` - Metric type (resilience, effort, challenge, feedback, learning)

**Response** (200):
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "type": "resilience",
    "value": "8",
    "notes": "Handled setback well",
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

---

### POST /metrics

Record a new metric.

**Request**:
```json
{
  "type": "effort",
  "value": "7",
  "notes": "Put extra time into learning"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "type": "effort",
  "value": "7",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

## AI Endpoints

### POST /ai/chat

Send a message to the AI coach.

**Request**:
```json
{
  "message": "How can I improve my resilience?",
  "context": {
    "includeRecentEntries": true,
    "includeMetrics": true
  }
}
```

**Response** (200):
```json
{
  "response": "Based on your recent journal entries, here are some suggestions...",
  "suggestions": [
    "Practice daily reflection",
    "Set small achievable goals"
  ]
}
```

---

### POST /ai/insights

Get AI-generated insights from recent journal entries.

**Response** (200):
```json
{
  "insights": {
    "patterns": ["Consistent morning journaling", "Focus on gratitude"],
    "recommendations": ["Try evening reflection"],
    "growthTrend": "improving"
  }
}
```

---

## User Info Endpoints

### GET /user-info

Get user profile information.

**Response** (200):
```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Growth enthusiast",
  "timezone": "America/New_York",
  "growthGoals": {
    "shortTerm": ["Daily journaling"],
    "longTerm": ["Build resilience"]
  }
}
```

---

### PUT /user-info

Update user profile.

**Request**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "timezone": "America/Los_Angeles"
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "firstName": "John",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

## Settings Endpoints

### GET /settings

Get user settings.

**Response** (200):
```json
{
  "id": "uuid",
  "userId": "uuid",
  "notificationPreferences": {
    "emailNotifications": true,
    "pushNotifications": true,
    "reminderFrequency": "daily"
  },
  "themePreferences": {
    "darkMode": false,
    "fontSize": "medium",
    "colorScheme": "default"
  },
  "privacySettings": {
    "journalVisibility": "private",
    "shareAnalytics": true
  },
  "aiInteractionSettings": {
    "enableAiInsights": true,
    "enableSentimentAnalysis": true,
    "enableGrowthSuggestions": true
  }
}
```

---

### PUT /settings

Update user settings.

**Request**:
```json
{
  "themePreferences": {
    "darkMode": true
  },
  "aiInteractionSettings": {
    "enableAiInsights": false
  }
}
```

**Response** (200): Updated settings object

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common HTTP Status Codes**:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (access denied)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

---
*Generated by BMM Document Project Workflow - 2026-01-06*
