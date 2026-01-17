# Online Polling System API

A RESTful API for creating and managing polls with user authentication.

## 🚀 Features

- User authentication (signup, login, logout)
- Create and manage polls
- Single and multiple choice voting
- Poll categorization
- Real-time poll results with percentages
- User-specific poll management
- JWT-based authentication
- MongoDB database integration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RehmatVisions/online_polling.git
   cd online_polling/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGO_URI=mongodb://localhost:27017/poll
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   PORT=3000
   ```

4. **Start MongoDB**
   
   **Option 1: Local MongoDB**
   ```bash
   # Start MongoDB service
   mongod --dbpath /path/to/your/db
   ```
   
   **Option 2: Docker**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```
   
   **Option 3: MongoDB Atlas**
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Get your connection string and update `MONGO_URI` in `.env`

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

The complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Base URL
```
http://localhost:3000/api
```

### Quick Start Examples

#### 1. Register a user
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 2. Create a poll
```bash
curl -X POST http://localhost:3000/api/polls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "question": "What is your favorite programming language?",
    "options": ["JavaScript", "Python", "Java", "Go"],
    "type": "single",
    "category": "Technology",
    "expirationDate": "2024-12-31T23:59:59.000Z"
  }'
```

## 🗂️ Project Structure

```
backend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   └── poll.controller.js    # Poll management logic
├── middlewares/
│   └── auth.middleware.js    # JWT authentication middleware
├── models/
│   ├── user.model.js         # User schema
│   └── poll.model.js         # Poll schema
├── routes/
│   ├── auth.route.js         # Authentication routes
│   └── poll.route.js         # Poll routes
├── .env                      # Environment variables
├── .env.example              # Environment variables template
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── API_DOCUMENTATION.md      # Complete API documentation
└── README.md                 # This file
```

## 🔧 Available Scripts

```bash
# Start server in production mode
npm start

# Start server in development mode with nodemon
npm run dev

# Run tests (if available)
npm test
```

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/poll` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |

## 📊 Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Poll Schema
```javascript
{
  question: String (required),
  options: [{
    text: String (required),
    votes: Number (default: 0)
  }],
  type: String (enum: ['single', 'multiple']),
  category: String,
  expirationDate: Date (required),
  createdBy: ObjectId (ref: User),
  voters: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚨 Troubleshooting

### MongoDB Connection Issues

1. **Local MongoDB not running**
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # macOS
   ```

2. **Connection refused error**
   - Ensure MongoDB is running on port 27017
   - Check if another service is using port 27017
   - Verify MongoDB installation

3. **MongoDB Atlas connection issues**
   - Check your connection string format
   - Ensure IP address is whitelisted
   - Verify username and password

### Common Errors

- **JWT token expired**: Login again to get a new token
- **Poll not found**: Verify the poll ID is correct
- **Already voted**: Users can only vote once per poll
- **Poll expired**: Cannot vote on expired polls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Rehmat Visions**
- GitHub: [@RehmatVisions](https://github.com/RehmatVisions)

## 🙏 Acknowledgments

- Express.js for the web framework
- MongoDB for the database
- JWT for authentication
- bcryptjs for password hashing