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

module.exports = router;