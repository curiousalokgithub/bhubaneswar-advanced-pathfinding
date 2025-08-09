const express = require("express");
const router = express.Router();
const {
  calculateRoute,
  getAllPricing,
} = require("../controllers/routeController");

// Enhanced route calculation endpoint
router.post("/calculate-route", calculateRoute);

// Get real-time pricing for all transport modes
router.post("/get-pricing", getAllPricing);

// Health check for routes service
router.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "Routes API",
    status: "operational",
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      "POST /calculate-route",
      "POST /get-pricing",
      "GET /health",
    ],
  });
});

module.exports = router;
