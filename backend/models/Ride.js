const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  pickupLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  dropoffLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'requested',
  },
  fare: {
    type: Number,
  },
  distance: {
    type: Number, // in km
  },
  duration: {
    type: Number, // in minutes
  },
  vehicleType: {
    type: String,
    enum: ['standard', 'premium', 'xl'],
    default: 'standard',
  },
  scheduledTime: {
    type: Date,
  },
  notes: {
    type: String,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Ride', rideSchema);