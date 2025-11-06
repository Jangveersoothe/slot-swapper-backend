# SlotSwapper

SlotSwapper is a peer-to-peer time-slot scheduling application. Users can mark their busy slots as "swappable" and exchange them with others. The app includes user authentication, slot management, swap requests, and approval workflows.

---

## Features

- User signup and login with JWT authentication
- Create, view, and manage personal time slots
- Mark slots as swappable
- View swappable slots from other users
- Request swaps and approve/reject incoming swap requests

---

## Tech Stack

- **Backend:** Node.js, Express, Sequelize, PostgreSQL/SQLite
- **Frontend:** React
- **Authentication:** JWT
- **Others:** dotenv for environment variables

---

## Setup / Installation

### Backend

1. Navigate to backend folder:

   ```bash
   cd slot-swapper-backend

   ```

2. Install dependencies:
   npm install

3. Create a .env file in the backend root with the following:
   PORT=4000
   JWT_SECRET=your_secret_key

4. Start the backend server:
   npm run dev

5. Backend should now be running at: http://localhost:4000
   cd frontend
   npm install
   npm start
   Frontend should now be running at: http://localhost:3000

API Endpoints
Method Endpoint Description
POST /api/auth/signup Create a new user
POST /api/auth/login Login user, return JWT
GET /api/slot/mine Get your slots
POST /api/slot/ Create a new slot
PUT /api/slot/make-swappable/:id Mark your slot as swappable
GET /api/slot/available Get other users’ swappable slots
POST /api/slot/request-swap/:slotId Request a swap
GET /api/slot/swap-requests Get incoming swap requests
PUT /api/slot/swap-approve/:requestId Approve a swap request

Jangveer Singh
