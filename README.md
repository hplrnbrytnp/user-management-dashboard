# User Management Dashboard

A modern, full-stack user management application with a beautiful UI, dark/light theme support, and complete CRUD functionality.

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS** - Styling
- **DOMPurify** - XSS protection for form inputs

### Backend
- **Express 5** - Node.js web framework
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique ID generation

## Features

- Create, read, update, and delete users
- Dark/Light theme toggle with smooth transitions
- Debounced search with minimum character requirement
- Pagination with configurable page size (5, 10, 20)
- Form validation with error messages
- Duplicate email detection
- Responsive design
- Animated UI components

## Project Structure

```
user-management-dashboard/
├── backend/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── controllers/        # Route controllers
│   ├── services/           # Business logic
│   ├── routes/             # API routes
│   ├── data/               # JSON data storage
│   │   └── users.json
│   ├── utils/              # Utility functions
│   └── src/middleware/     # Custom middleware
│       └── errorHandler.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       │   ├── Modal.jsx
│       │   ├── UserForm.jsx
│       │   └── UserList.jsx
│       ├── context/        # React context
│       │   └── ThemeContext.jsx
│       ├── pages/          # Page components
│       │   └── Dashboard.jsx
│       ├── services/       # API services
│       │   └── users.api.js
│       └── index.js
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-management-dashboard
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

### Start the Backend Server
```bash
cd backend
node server.js
```
The backend runs on `http://localhost:5000`

### Start the Frontend Development Server
```bash
cd frontend
npm start
```
The frontend runs on `http://localhost:3000`

## API Endpoints

| Method | Endpoint         | Description     |
|--------|------------------|-----------------|
| GET    | `/api/users`     | Get all users   |
| GET    | `/api/users/:id` | Get user by ID  |
| POST   | `/api/users`     | Create new user |
| PUT    | `/api/users/:id` | Update user     |
| DELETE | `/api/users/:id` | Delete user     |

### Request/Response Example

**Create User**
```json
POST /api/users
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Response**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com"
}
```

## License

ISC
