# Cab Booking App 🚗

A full-stack real-time ride-hailing application built with modern web technologies.

## 🚀 Features

### Core Functionality
- **Real-time Ride Booking**: Book rides with live driver matching
- **Driver Management**: Driver dashboard with ride acceptance/rejection
- **Live Tracking**: Real-time GPS tracking for rides in progress
- **Smart Notifications**: Browser notifications, toast messages, and sound alerts
- **Google Maps Integration**: Interactive maps for location selection and route display

### User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: WebSocket-powered live updates
- **Intuitive UI**: Clean, modern interface built with Tailwind CSS
- **Secure Authentication**: Clerk-powered authentication system

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Real-time Communication**: Socket.IO for instant messaging
- **Modern React**: Next.js 16 with App Router and React 19
- **Database Ready**: MongoDB integration with Mongoose

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Google Maps API** - Maps integration
- **Clerk** - Authentication

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM

## 📁 Project Structure

```
cab-booking-app/
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js app router pages
│   │   │   ├── dashboard/       # Rider dashboard
│   │   │   ├── driver-dashboard/# Driver dashboard
│   │   │   ├── book-ride/       # Ride booking page
│   │   │   └── sign-in/         # Authentication
│   │   ├── components/          # Reusable components
│   │   │   ├── Map.tsx         # Google Maps component
│   │   │   ├── NotificationSystem.tsx
│   │   │   └── RideTracking.tsx
│   │   └── hooks/              # Custom React hooks
│   │       └── useNotifications.ts
│   └── public/                 # Static assets
├── backend/
│   ├── index.js                # Main server file
│   ├── models/                 # Database models
│   └── routes/                 # API routes
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Google Maps API key
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cab-booking-app
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**

   Create `.env.local` in frontend directory:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

   Create `.env` in backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

5. **Start the development servers**

   Terminal 1 - Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🧪 Testing

Run the verification script to ensure everything is working:

```bash
node verify.js
```

## 📱 Usage

### For Riders
1. Sign up/Login using Clerk authentication
2. Enter pickup and drop-off locations on the map
3. Book a ride and wait for driver assignment
4. Track your ride in real-time
5. Receive notifications for ride status updates

### For Drivers
1. Sign up/Login as a driver
2. Go online to receive ride requests
3. Accept or reject incoming ride requests
4. Navigate to pickup location
5. Start and complete rides
6. Receive payment notifications

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Railway/Heroku)
1. Create a new project
2. Connect your repository
3. Set environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built as part of a comprehensive full-stack development learning project
- Inspired by modern ride-hailing applications
- Uses open-source libraries and frameworks

---

**Happy coding! 🚗💨**