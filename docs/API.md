# API Documentation

## Authentication

All protected endpoints require authentication via Supabase session cookies.

## Events API

### GET /api/events
Get list of published events

**Query Parameters:**
- `type` (optional) - Filter by event type
- `startDate` (optional) - Filter events starting after this date
- `endDate` (optional) - Filter events starting before this date

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Summer Camp 2025",
    "slug": "summer-camp-2025",
    "type": "camp",
    "description": "...",
    "start_at": "2025-06-01T09:00:00Z",
    "end_at": "2025-06-01T15:00:00Z",
    "capacity": 20,
    "price_cents": 5000,
    "image_url": "...",
    "is_published": true
  }
]
```

### POST /api/events
Create new event (Admin only)

**Request Body:**
```json
{
  "title": "Summer Camp 2025",
  "slug": "summer-camp-2025",
  "type": "camp",
  "description": "...",
  "start_at": "2025-06-01T09:00:00Z",
  "end_at": "2025-06-01T15:00:00Z",
  "capacity": 20,
  "price_cents": 5000,
  "is_published": true
}
```

### GET /api/events/[id]
Get event details with capacity info

**Response:**
```json
{
  "id": "uuid",
  "title": "Summer Camp 2025",
  "registeredCount": 15,
  "availableSpots": 5,
  "isFull": false,
  ...
}
```

### PUT /api/events/[id]
Update event (Admin only)

### DELETE /api/events/[id]
Delete event (Admin only)

### POST /api/events/[id]/register
Register for event (Authenticated users)

**Request Body:**
```json
{
  "qty": 1,
  "student_id": "uuid" // optional
}
```

## Blog API

### GET /api/blog
Get published blog posts

**Query Parameters:**
- `tag` (optional) - Filter by tag

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Welcome to Our School",
    "slug": "welcome-to-our-school",
    "excerpt": "...",
    "content": "...",
    "tags": ["announcement", "welcome"],
    "image_url": "...",
    "published_at": "2025-01-01T00:00:00Z"
  }
]
```

### POST /api/blog
Create blog post (Admin only)

### GET /api/blog/[id]
Get blog post by slug

### PUT /api/blog/[id]
Update blog post (Admin only)

### DELETE /api/blog/[id]
Delete blog post (Admin only)

## Newsletter API

### POST /api/newsletter
Subscribe to newsletter

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Subscribed successfully"
}
```

## Profile API

### PUT /api/profile/user
Update user profile (Authenticated users)

**Request Body:**
```json
{
  "name": "John Doe"
}
```

### PUT /api/profile/family
Update family information (Authenticated users)

**Request Body:**
```json
{
  "address": "123 Main St",
  "phone": "555-0123"
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- 10 requests per minute per IP for public endpoints
- 100 requests per minute for authenticated endpoints

Rate limit headers:
- `X-RateLimit-Limit` - Request limit
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Time when limit resets

## Webhooks

### POST /api/webhooks/square
Square payment webhook (requires signature verification)

### POST /api/webhooks/givebutter
Givebutter donation webhook (requires signature verification)
