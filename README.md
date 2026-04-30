# E-Healthcare - Online Consultation and Medical Services Platform

A secure, scalable, full-stack web application that allows patients to consult doctors online, book appointments, receive prescriptions, and manage their medical interactions digitally.

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Real-time:** Socket.io (chat)
- **Authentication:** JWT, bcrypt

## Features

### Patient
- Register/login with secure authentication
- Search doctors by specialty, rating, availability
- Book appointments (date & time slots)
- Real-time chat consultations with doctors
- View/download prescriptions
- Rate and review doctors

### Doctor
- Register/login (pending admin approval)
- Create and manage profile (specialization, experience, availability)
- Accept/reject/complete appointments
- Conduct real-time chat consultations
- Issue prescriptions with medications and notes
- View patient history

### Admin
- Full platform control dashboard
- Manage doctors and patients (approve, activate/deactivate, delete)
- View platform analytics (total users, consultations, etc.)
- Oversee all appointments

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, error handling, file upload
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── socket/          # Socket.io handlers
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router pages
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts (Auth)
│   │   └── lib/         # API client, types
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

The backend runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

### Environment Variables

**Backend (.env):**
| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/e-healthcare` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `CLIENT_URL` | Frontend URL (CORS) | `http://localhost:3000` |

**Frontend (.env.local):**
| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io URL | `http://localhost:5000` |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Doctors
- `GET /api/doctors` - List doctors (with search/filter)
- `GET /api/doctors/:id` - Doctor details
- `GET /api/doctors/specializations` - List specializations
- `PUT /api/doctors/availability` - Update availability (doctor only)

### Appointments
- `POST /api/appointments` - Book appointment (patient only)
- `GET /api/appointments` - My appointments
- `GET /api/appointments/:id` - Appointment details
- `PUT /api/appointments/:id/status` - Update status

### Prescriptions
- `POST /api/prescriptions` - Create prescription (doctor only)
- `GET /api/prescriptions` - My prescriptions
- `GET /api/prescriptions/:id` - Prescription details

### Reviews
- `POST /api/reviews` - Create review (patient only)
- `GET /api/reviews/doctor/:doctorId` - Doctor reviews
- `DELETE /api/reviews/:id` - Delete review

### Chat
- `GET /api/chats` - My chats
- `GET /api/chats/appointment/:id` - Chat by appointment
- `POST /api/chats/:chatId/messages` - Send message
- `PUT /api/chats/:chatId/read` - Mark messages read

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/:id/approve` - Approve doctor
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/appointments` - All appointments

## Security

- JWT authentication with role-based access control
- Password hashing with bcrypt (12 rounds)
- Input validation with express-validator
- Protected API routes with middleware
- CORS configuration
- File upload restrictions (type and size limits)

## License

MIT
