const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Create a test app instance
const createTestApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Test routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  app.post('/api/test-ride', (req, res) => {
    const { pickupLocation, dropoffLocation } = req.body;

    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    res.json({
      success: true,
      rideId: 'test-ride-123',
      message: 'Ride request created successfully'
    });
  });

  return app;
};

describe('API Routes', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /api/health', () => {
    it('should return server health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        message: 'Server is running'
      });
    });
  });

  describe('POST /api/test-ride', () => {
    it('should create a ride request successfully', async () => {
      const rideData = {
        pickupLocation: {
          address: '123 Main St',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        dropoffLocation: {
          address: '456 Oak Ave',
          coordinates: { lat: 40.7589, lng: -73.9851 }
        }
      };

      const response = await request(app)
        .post('/api/test-ride')
        .send(rideData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        rideId: 'test-ride-123',
        message: 'Ride request created successfully'
      });
    });

    it('should return error for missing fields', async () => {
      const incompleteData = {
        pickupLocation: {
          address: '123 Main St',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        }
        // missing dropoffLocation
      };

      const response = await request(app)
        .post('/api/test-ride')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Missing required fields'
      });
    });
  });
});