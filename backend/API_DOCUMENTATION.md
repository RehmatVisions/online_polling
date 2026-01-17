# Poll & Survey API Documentation

## 🚀 Base URL
```
http://localhost:3000/api
```

## 🔐 Authentication
This API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Table of Contents
- [Authentication Endpoints](#authentication-endpoints)
- [Poll Endpoints](#poll-endpoints)
- [Error Responses](#error-responses)
- [Testing Examples](#testing-examples)

---

## 🔑 Authentication Endpoints

### 1. User Signup
**POST** `/auth/signup`

Creates a new user account and returns a JWT token.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing fields or invalid email format
- `400` - Email already registered
- `400` - Password too short (minimum 6 characters)

---

### 2. User Login
**POST** `/auth/login`

Authenticates user and returns JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing email or password
- `400` - Invalid email or password

---

### 3. User Logout
**POST** `/auth/logout`

Logs out the current user (clears token cookie).

**Headers:** 
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "User logged out successfully"
}
```

---

### 4. Get Current User Profile
**GET** `/auth/me`

Returns the current authenticated user's profile information.

**Headers:** 
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "User profile fetched successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Not authorized, token missing or invalid
- `404` - User not found

---

## 📊 Poll Endpoints

### 1. Create Poll
**POST** `/polls`

Creates a new poll. Requires authentication.

**Headers:** 
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "question": "What's your favorite programming language?",
  "options": ["JavaScript", "Python", "Java", "Go"],
  "type": "single",
  "category": "Technology",
  "expirationDate": "2024-12-31T23:59:59.000Z"
}
```

**Field Descriptions:**
- `question` (required): The poll question
- `options` (required): Array of option strings (minimum 2)
- `type` (required): "single" or "multiple"
- `category` (optional): Poll category (defaults to "General")
- `expirationDate` (required): Must be a future date

**Success Response (201):**
```json
{
  "message": "Poll created successfully",
  "poll": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "question": "What's your favorite programming language?",
    "options": [
      { "text": "JavaScript", "votes": 0, "_id": "64f8a1b2c3d4e5f6a7b8c9d2" },
      { "text": "Python", "votes": 0, "_id": "64f8a1b2c3d4e5f6a7b8c9d3" },
      { "text": "Java", "votes": 0, "_id": "64f8a1b2c3d4e5f6a7b8c9d4" },
      { "text": "Go", "votes": 0, "_id": "64f8a1b2c3d4e5f6a7b8c9d5" }
    ],
    "type": "single",
    "category": "Technology",
    "expirationDate": "2024-12-31T23:59:59.000Z",
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "voters": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `400` - Invalid options array (less than 2 items)
- `400` - Invalid poll type
- `400` - Expiration date in the past
- `401` - Not authorized

---

### 2. Get All Polls
**GET** `/polls`

Retrieves all polls with optional filtering. Public endpoint.

**Query Parameters:**
- `category` (optional): Filter by category
- `active` (optional): Set to "true" to get only active (non-expired) polls

**Example URLs:**
```
GET /polls
GET /polls?category=Technology
GET /polls?active=true
GET /polls?category=Sports&active=true
```

**Success Response (200):**
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
      "expirationDate": "2024-12-31T23:59:59.000Z",
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "voters": ["64f8a1b2c3d4e5f6a7b8c9d6"],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Poll
**GET** `/polls/:id`

Retrieves a specific poll by ID. Public endpoint.

**Example URL:**
```
GET /polls/64f8a1b2c3d4e5f6a7b8c9d1
```

**Success Response (200):**
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
    "expirationDate": "2024-12-31T23:59:59.000Z",
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "voters": ["64f8a1b2c3d4e5f6a7b8c9d6"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Poll not found
- `500` - Server error

---

### 4. Vote on Poll
**POST** `/polls/:id/vote`

Submit a vote for a specific poll. Requires authentication.

**Headers:** 
```
Authorization: Bearer <token>
```

**For Single Choice Polls:**
```json
{
  "optionIndex": 0
}
```

**For Multiple Choice Polls:**
```json
{
  "optionIndexes": [0, 2]
}
```

**Example URL:**
```
POST /polls/64f8a1b2c3d4e5f6a7b8c9d1/vote
```

**Success Response (200):**
```json
{
  "message": "Vote recorded successfully",
  "poll": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "question": "What's your favorite programming language?",
    "options": [
      { "text": "JavaScript", "votes": 6, "_id": "64f8a1b2c3d4e5f6a7b8c9d2" },
      { "text": "Python", "votes": 3, "_id": "64f8a1b2c3d4e5f6a7b8c9d3" }
    ],
    "type": "single",
    "category": "Technology",
    "expirationDate": "2024-12-31T23:59:59.000Z",
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "voters": ["64f8a1b2c3d4e5f6a7b8c9d6", "64f8a1b2c3d4e5f6a7b8c9d7"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid option index
- `400` - Poll has expired
- `400` - User already voted
- `401` - Not authorized
- `404` - Poll not found

---

### 5. Get Poll Results
**GET** `/polls/:id/results`

Get detailed poll results with percentages. Public endpoint.

**Example URL:**
```
GET /polls/64f8a1b2c3d4e5f6a7b8c9d1/results
```

**Success Response (200):**
```json
{
  "message": "Poll results fetched successfully",
  "poll": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "question": "What's your favorite programming language?",
    "type": "single",
    "category": "Technology",
    "expirationDate": "2024-12-31T23:59:59.000Z",
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z",
    "totalVotes": 8,
    "totalVoters": 8,
    "isExpired": false,
    "options": [
      {
        "text": "JavaScript",
        "votes": 5,
        "percentage": "62.50"
      },
      {
        "text": "Python",
        "votes": 3,
        "percentage": "37.50"
      }
    ]
  }
}
```

**Error Responses:**
- `404` - Poll not found
- `500` - Server error

---

### 6. Get User's Own Polls
**GET** `/polls/my-polls`

Retrieve all polls created by the authenticated user. Requires authentication.

**Headers:** 
```
Authorization: Bearer <token>
```

**Success Response (200):**
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
      "category": "Technology",
      "expirationDate": "2024-12-31T23:59:59.000Z",
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "voters": ["64f8a1b2c3d4e5f6a7b8c9d6"],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401` - Not authorized
- `500` - Server error

---

### 7. Delete Poll
**DELETE** `/polls/:id`

Delete a poll. Only the poll creator can delete their own polls. Requires authentication.

**Headers:** 
```
Authorization: Bearer <token>
```

**Example URL:**
```
DELETE /polls/64f8a1b2c3d4e5f6a7b8c9d1
```

**Success Response (200):**
```json
{
  "message": "Poll deleted successfully"
}
```

**Error Responses:**
- `401` - Not authorized
- `403` - Not authorized (not the poll creator)
- `404` - Poll not found
- `500` - Server error

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required fields: question, options, type, expirationDate"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, token missing"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized"
}
```

### 404 Not Found
```json
{
  "message": "Poll not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## 🧪 Testing Examples

### Using cURL

#### 1. Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 3. Create a poll (replace TOKEN with actual token)
```bash
curl -X POST http://localhost:3000/api/polls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "question": "What is your favorite framework?",
    "options": ["React", "Vue", "Angular", "Svelte"],
    "type": "single",
    "category": "Technology",
    "expirationDate": "2024-12-31T23:59:59.000Z"
  }'
```

#### 4. Get all polls
```bash
curl -X GET http://localhost:3000/api/polls
```

#### 5. Vote on a poll (replace POLL_ID and TOKEN)
```bash
curl -X POST http://localhost:3000/api/polls/POLL_ID/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "optionIndex": 0
  }'
```

#### 6. Get poll results (replace POLL_ID)
```bash
curl -X GET http://localhost:3000/api/polls/POLL_ID/results
```

### Using JavaScript/Fetch

#### Complete workflow example:
```javascript
const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// 1. Register user
async function registerUser() {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  authToken = data.token;
  console.log('User registered:', data);
  return data;
}

// 2. Create a poll
async function createPoll() {
  const response = await fetch(`${BASE_URL}/polls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      question: 'What is your favorite programming language?',
      options: ['JavaScript', 'Python', 'Java', 'Go'],
      type: 'single',
      category: 'Technology',
      expirationDate: '2024-12-31T23:59:59.000Z'
    })
  });
  
  const data = await response.json();
  console.log('Poll created:', data);
  return data;
}

// 3. Get all polls
async function getAllPolls() {
  const response = await fetch(`${BASE_URL}/polls`);
  const data = await response.json();
  console.log('All polls:', data);
  return data;
}

// 4. Vote on poll
async function voteOnPoll(pollId) {
  const response = await fetch(`${BASE_URL}/polls/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      optionIndex: 0
    })
  });
  
  const data = await response.json();
  console.log('Vote submitted:', data);
  return data;
}

// 5. Get poll results
async function getPollResults(pollId) {
  const response = await fetch(`${BASE_URL}/polls/${pollId}/results`);
  const data = await response.json();
  console.log('Poll results:', data);
  return data;
}

// Run the complete workflow
async function runWorkflow() {
  try {
    const user = await registerUser();
    const poll = await createPoll();
    await getAllPolls();
    await voteOnPoll(poll.poll._id);
    await getPollResults(poll.poll._id);
  } catch (error) {
    console.error('Error:', error);
  }
}

// runWorkflow();
```

### Using Postman

#### Environment Variables:
- `base_url`: `http://localhost:3000/api`
- `auth_token`: (set after login)

#### Collection Structure:
1. **Auth**
   - POST `{{base_url}}/auth/signup`
   - POST `{{base_url}}/auth/login`
   - GET `{{base_url}}/auth/me`
   - POST `{{base_url}}/auth/logout`

2. **Polls**
   - POST `{{base_url}}/polls`
   - GET `{{base_url}}/polls`
   - GET `{{base_url}}/polls/:id`
   - POST `{{base_url}}/polls/:id/vote`
   - GET `{{base_url}}/polls/:id/results`
   - GET `{{base_url}}/polls/my-polls`
   - DELETE `{{base_url}}/polls/:id`

---

## 📝 Additional Notes

### Poll Types
- **single**: Users can select only one option
- **multiple**: Users can select multiple options

### Poll Categories
You can use any string as a category. Common examples:
- Technology
- Sports
- Entertainment
- Education
- General

### Important Rules
1. All timestamps are in ISO 8601 format
2. Poll expiration dates must be in the future when creating
3. Users can only vote once per poll
4. Only poll creators can delete their own polls
5. Expired polls cannot receive new votes
6. JWT tokens expire after 7 days
7. Passwords must be at least 6 characters long
8. Email addresses must be valid format

### MongoDB Connection
Make sure MongoDB is running on your system:
```bash
# Start MongoDB service
mongod --dbpath /path/to/your/db

# Or if using MongoDB Atlas, ensure your connection string is correct
```

### Environment Variables Required
```env
MONGO_URI=mongodb://localhost:27017/poll
JWT_SECRET=your_jwt_secret_here
PORT=3000
```