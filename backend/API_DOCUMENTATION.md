# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication Routes

### POST `/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "User registered successfully",
  "user": { "id": "64f8a1b2c3d4e5f6a7b8c9d0", "name": "John Doe", "email": "john@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "User logged in successfully",
  "user": { "id": "64f8a1b2c3d4e5f6a7b8c9d0", "name": "John Doe", "email": "john@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/auth/logout`
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "message": "User logged out successfully"
}
```

### GET `/auth/me`
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "message": "User profile fetched successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Poll Routes

### POST `/polls`
**Headers:** `Authorization: Bearer <token>`
```json
{
  "question": "What's your favorite programming language?",
  "options": ["JavaScript", "Python", "Java", "Go"],
  "type": "single",
  "category": "Technology",
  "expirationDate": "2024-12-31T23:59:59.000Z"
}
```
**Response:**
```json
{
  "message": "Poll created successfully",
  "poll": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "question": "What's your favorite programming language?",
    "options": [
      { "text": "JavaScript", "votes": 0, "_id": "64f8a1b2c3d4e5f6a7b8c9d2" },
      { "text": "Python", "votes": 0, "_id": "64f8a1b2c3d4e5f6a7b8c9d3" }
    ],
    "type": "single",
    "category": "Technology",
    "expirationDate": "2024-12-31T23:59:59.000Z",
    "createdBy": { "_id": "64f8a1b2c3d4e5f6a7b8c9d0", "name": "John Doe" }
  }
}
```

### GET `/polls`
**Query:** `?category=Technology&active=true`
**Response:**
```json
{
  "message": "Polls fetched successfully",
  "count": 2,
  "polls": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "question": "What's your favorite programming language?",
      "options": [
        { "text": "JavaScript", "votes": 5, "_id": "64f8a1b2c3d4e5f6a7b8c9d2" },
        { "text": "Python", "votes": 3, "_id": "64f8a1b2c3d4e5f6a7b8c9d3" }
      ],
      "type": "single",
      "category": "Technology",
      "createdBy": { "_id": "64f8a1b2c3d4e5f6a7b8c9d0", "name": "John Doe" }
    }
  ]
}
```

### GET `/polls/:id`
**Response:**
```json
{
  "poll": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "question": "What's your favorite programming language?",
    "options": [
      { "text": "JavaScript", "votes": 5, "_id": "64f8a1b2c3d4e5f6a7b8c9d2" },
      { "text": "Python", "votes": 3, "_id": "64f8a1b2c3d4e5f6a7b8c9d3" }
    ],
    "type": "single",
    "category": "Technology",
    "createdBy": { "_id": "64f8a1b2c3d4e5f6a7b8c9d0", "name": "John Doe" }
  }
}
```

### POST `/polls/:id/vote`
**Headers:** `Authorization: Bearer <token>`
**Single Choice:**
```json
{
  "optionIndex": 0
}
```
**Multiple Choice:**
```json
{
  "optionIndexes": [0, 2]
}
```
**Response:**
```json
{
  "message": "Vote recorded successfully",
  "poll": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "question": "What's your favorite programming language?",
    "options": [
      { "text": "JavaScript", "votes": 6, "_id": "64f8a1b2c3d4e5f6a7b8c9d2" },
      { "text": "Python", "votes": 3, "_id": "64f8a1b2c3d4e5f6a7b8c9d3" }
    ]
  }
}
```

### GET `/polls/:id/results`
**Response:**
```json
{
  "message": "Poll results fetched successfully",
  "poll": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "question": "What's your favorite programming language?",
    "totalVotes": 8,
    "totalVoters": 8,
    "isExpired": false,
    "options": [
      { "text": "JavaScript", "votes": 5, "percentage": "62.50" },
      { "text": "Python", "votes": 3, "percentage": "37.50" }
    ]
  }
}
```

### GET `/polls/my-polls`
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "message": "Your polls fetched successfully",
  "count": 1,
  "polls": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "question": "What's your favorite programming language?",
      "options": [
        { "text": "JavaScript", "votes": 5, "_id": "64f8a1b2c3d4e5f6a7b8c9d2" },
        { "text": "Python", "votes": 3, "_id": "64f8a1b2c3d4e5f6a7b8c9d3" }
      ],
      "type": "single",
      "category": "Technology"
    }
  ]
}
```

### DELETE `/polls/:id`
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "message": "Poll deleted successfully"
}
```