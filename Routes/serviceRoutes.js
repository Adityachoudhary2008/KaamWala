const express = require("express");
const router = express.Router();
const Service = require("../models/Service");   // service model
const History = require("../models/History");   // booking history model

// 1. List all services
router.get("/list", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Error fetching services" });
  }
});

// 2. User booking history
router.get("/history/:userId", async (req, res) => {
  try {
    const history = await History.find({ userId: req.params.userId }).populate("service");
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// 3. Book a service
router.post("/book", async (req, res) => {
  try {
    const { userId, serviceId } = req.body;
    const newHistory = new History({
      userId,
      service: serviceId,
      date: new Date()
    });
    await newHistory.save();
    res.json({ success: true, message: "Service booked successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Booking failed" });
  }
});

module.exports = router;
