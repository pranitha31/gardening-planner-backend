# 🌦 Weather Planner Backend API

## 📖 Overview

The Weather Planner Backend is a scalable RESTful API designed to support a smart plant management and seasonal planning application.

The system enables secure user authentication, plant tracking, reminder scheduling, and real-time weather integration. It follows modular architecture principles, ensuring maintainability, security, and scalability.

This backend serves as the core service layer for the Weather Planner full-stack application.

---

## 🏗 Architecture & Design

The application follows a layered architecture:

- **Routing Layer** – Handles API endpoints
- **Controller Layer** – Contains business logic
- **Service Layer** – External API integrations (Weather API)
- **Middleware Layer** – Authentication & request validation
- **Database Layer** – Supabase (PostgreSQL)

This separation ensures clean code practices and scalability.

---

## 🚀 Key Features

- JWT-based Authentication & Authorization
- Secure Password Handling
- Plant Management (CRUD Operations)
- Reminder Scheduling System
- Seasonal Task Management
- Real-time Weather Forecast Integration
- Protected API Routes
- Environment-based Configuration
- RESTful API Standards

---

## 🛠 Technology Stack

| Category | Technology |
|-----------|------------|
| Runtime Environment | Node.js |
| Backend Framework | Express.js |
| Database | Supabase (PostgreSQL) |
| Authentication | JSON Web Tokens (JWT) |
| External API | OpenWeather API |
| Configuration | dotenv |
| Security | CORS |

---

## 📂 Project Structure

```
backend/
│
├── config/
│   └── supabaseClient.js
│
├── controllers/
│   ├── authController.js
│   ├── plantController.js
│   ├── reminderController.js
│   └── weatherPlannerController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── plantRoutes.js
│   ├── reminderRoutes.js
│   └── weatherRoutes.js
│
├── services/
│   └── weatherService.js
│
├── server.js
├── package.json
└── .env
```

---

# 🔐 Authentication Endpoints

### Register User
```
POST /api/auth/register
```

### Login User
```
POST /api/auth/login
```

Returns a JWT token required for accessing protected routes.

---

# 🌱 Plant Management (Protected)

```
GET    /api/plants
POST   /api/plants
DELETE /api/plants/:id
```

All routes require valid Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📅 Reminder Management (Protected)

```
GET    /api/reminders
POST   /api/reminders
DELETE /api/reminders/:id
```

---

# 🌦 Weather Endpoints

```
GET /api/weather/current?city=<city_name>
GET /api/weather/forecast?city=<city_name>
```

Data is fetched dynamically from OpenWeather API.

---

# 🗄 Database Schema Overview

### Users
- id (UUID, Primary Key)
- name (Text)
- email (Unique)
- password (Hashed)
- created_at (Timestamp)

### Plants
- id (UUID)
- user_id (Foreign Key → Users)
- plant_name (Text)
- plant_type (Text)
- created_at (Timestamp)

### Reminders
- id (UUID)
- user_id (Foreign Key)
- plant_id (Foreign Key)
- reminder_date (Date)
- reminder_type (Text)
- created_at (Timestamp)

### Seasonal Tasks
- id (UUID)
- season (Text)
- task_description (Text)

---

# ⚙ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/weather-planner-backend.git
cd weather-planner-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
JWT_SECRET=your_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENWEATHER_API_KEY=your_api_key
```

### 4. Run Development Server
```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

# 🌍 Deployment

Backend is deployed on:

```
https://your-deployment-link.com
```

---

# 🔒 Security Practices

- JWT-based authentication
- Protected middleware routes
- Environment variable protection
- CORS configuration
- Password hashing before storage

---

# 📈 Future Enhancements

- Role-Based Access Control (RBAC)
- Email-based Reminder Notifications
- Scheduled Background Jobs
- API Rate Limiting
- Docker Support
- Logging & Monitoring Integration

---

# 👩‍💻 Developer

Computer Science Engineering Student  
Focused on Backend Development, Scalable APIs, and Full-Stack Architecture  

---

## 📄 License

This project is licensed for educational and portfolio purposes.