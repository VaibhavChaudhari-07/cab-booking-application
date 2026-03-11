const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Store active drivers and riders
const activeDrivers = new Map();
const activeRiders = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Driver joins
  socket.on('driver-join', (driverData) => {
    activeDrivers.set(socket.id, {
      id: socket.id,
      ...driverData,
      status: 'available'
    });
    socket.join('drivers');
    console.log('Driver joined:', driverData.name);
    io.emit('drivers-updated', Array.from(activeDrivers.values()));
  });

  // Rider joins
  socket.on('rider-join', (riderData) => {
    activeRiders.set(socket.id, {
      id: socket.id,
      ...riderData
    });
    socket.join('riders');
    console.log('Rider joined:', riderData.name);
  });

  // Driver location update
  socket.on('driver-location-update', (location) => {
    const driver = activeDrivers.get(socket.id);
    if (driver) {
      driver.location = location;
      driver.lastUpdate = Date.now();
      io.emit('drivers-updated', Array.from(activeDrivers.values()));
    }
  });

  // Driver status update
  socket.on('driver-status-update', (status) => {
    const driver = activeDrivers.get(socket.id);
    if (driver) {
      driver.status = status;
      io.emit('drivers-updated', Array.from(activeDrivers.values()));
    }
  });

  // Ride request from rider
  socket.on('request-ride', async (rideData) => {
    try {
      // Find nearby available drivers
      const nearbyDrivers = findNearbyDrivers(rideData.pickupLocation, 5); // 5km radius

      if (nearbyDrivers.length > 0) {
        // Send ride request to nearby drivers
        nearbyDrivers.forEach(driver => {
          io.to(driver.id).emit('ride-request', {
            rideId: rideData.rideId,
            pickupLocation: rideData.pickupLocation,
            dropoffLocation: rideData.dropoffLocation,
            fare: rideData.fare,
            distance: rideData.distance,
            riderId: socket.id
          });
        });

        // Notify rider that drivers are being contacted
        socket.emit('ride-requested', {
          status: 'searching',
          message: `Found ${nearbyDrivers.length} nearby drivers`
        });
      } else {
        socket.emit('ride-requested', {
          status: 'no-drivers',
          message: 'No drivers available nearby'
        });
      }
    } catch (error) {
      console.error('Ride request error:', error);
      socket.emit('ride-error', { message: 'Failed to request ride' });
    }
  });

  // Driver accepts ride
  socket.on('accept-ride', (data) => {
    const { rideId, riderId } = data;
    const driver = activeDrivers.get(socket.id);

    if (driver) {
      // Update driver status
      driver.status = 'busy';

      // Notify rider
      io.to(riderId).emit('ride-accepted', {
        rideId,
        driver: {
          id: driver.id,
          name: driver.name,
          vehicle: driver.vehicle,
          rating: driver.rating
        }
      });

      // Notify other drivers that ride is taken
      socket.to('drivers').emit('ride-taken', { rideId });

      io.emit('drivers-updated', Array.from(activeDrivers.values()));
    }
  });

  // Driver rejects ride
  socket.on('reject-ride', (data) => {
    const { rideId, riderId } = data;
    // Could implement logic to offer to next driver
    console.log(`Driver ${socket.id} rejected ride ${rideId}`);
  });

  // Ride started
  socket.on('start-ride', (data) => {
    const { rideId, riderId } = data;
    io.to(riderId).emit('ride-started', { rideId });
  });

  // Ride completed
  socket.on('complete-ride', (data) => {
    const { rideId, riderId } = data;
    const driver = activeDrivers.get(socket.id);

    if (driver) {
      driver.status = 'available';
      io.emit('drivers-updated', Array.from(activeDrivers.values()));
    }

    io.to(riderId).emit('ride-completed', { rideId });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    activeDrivers.delete(socket.id);
    activeRiders.delete(socket.id);
    io.emit('drivers-updated', Array.from(activeDrivers.values()));
  });
});

// Helper function to find nearby drivers
function findNearbyDrivers(pickupLocation, radiusKm = 5) {
  const nearbyDrivers = [];

  for (const [socketId, driver] of activeDrivers) {
    if (driver.status === 'available' && driver.location) {
      const distance = calculateDistance(
        pickupLocation.lat, pickupLocation.lng,
        driver.location.lat, driver.location.lng
      );

      if (distance <= radiusKm) {
        nearbyDrivers.push({
          id: socketId,
          ...driver,
          distance
        });
      }
    }
  }

  // Sort by distance
  return nearbyDrivers.sort((a, b) => a.distance - b.distance);
}

// Helper function to calculate distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Cab Booking API with Real-time Support' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});