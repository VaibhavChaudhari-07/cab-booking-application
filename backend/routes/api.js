const express = require('express');
const User = require('../models/User');
const Ride = require('../models/Ride');
const Payment = require('../models/Payment');

const router = express.Router();

// User routes
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ride routes
router.get('/rides', async (req, res) => {
  try {
    const rides = await Ride.find().populate('rider driver');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/rides', async (req, res) => {
  try {
    const ride = new Ride(req.body);
    await ride.save();
    res.status(201).json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Payment routes
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find().populate('ride');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payments', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Book a ride
router.post('/book-ride', async (req, res) => {
  try {
    const {
      pickupLocation,
      dropoffLocation,
      pickupAddress,
      dropoffAddress,
      scheduledTime,
      vehicleType,
      notes
    } = req.body;

    // Mock user ID - in a real app, this would come from authentication
    const mockUserId = '507f1f77bcf86cd799439011';

    // Calculate distance (simplified)
    const distance = calculateDistance(
      pickupLocation.lat, pickupLocation.lng,
      dropoffLocation.lat, dropoffLocation.lng
    );

    // Calculate fare based on distance and vehicle type
    const baseRate = 2.5; // $2.50 base fare
    const perKmRate = 1.5; // $1.50 per km
    const multiplier = vehicleType === 'premium' ? 1.5 : vehicleType === 'xl' ? 2 : 1;
    const fare = Math.round((baseRate + distance * perKmRate) * multiplier * 100) / 100;

    const ride = new Ride({
      rider: mockUserId,
      pickupLocation: {
        address: pickupAddress,
        coordinates: {
          lat: pickupLocation.lat,
          lng: pickupLocation.lng,
        },
      },
      dropoffLocation: {
        address: dropoffAddress,
        coordinates: {
          lat: dropoffLocation.lat,
          lng: dropoffLocation.lng,
        },
      },
      fare,
      distance,
      status: scheduledTime ? 'scheduled' : 'requested',
      ...(scheduledTime && { scheduledTime: new Date(scheduledTime) }),
      ...(notes && { notes }),
    });

    await ride.save();
    res.status(201).json({
      success: true,
      ride,
      message: 'Ride booked successfully!'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function to calculate distance between two points
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

module.exports = router;