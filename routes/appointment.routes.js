const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

//! appointment database
const appointmentCollection = client
    .db("warmHearts")
    .collection("appointments");

// Get all appointments
router.get("/appointments", verifyToken, async (req, res) => {
    const cursor = appointmentCollection.find();
    const result = await cursor.toArray();
    res.send(result);
});

// Add new appointment
router.post("/appointments", verifyToken, async (req, res) => {
    const appointmentData = req.body;
    const result = await appointmentCollection.insertOne(appointmentData);
    res.send(result);
});

// get a single appointment by email
router.get("/appointment", verifyToken, async (req, res) => {
    const { email } = req.query;

    // Validate email parameter
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email parameter is required",
        });
    }

    const appointment = await appointmentCollection.findOne({
        userEmail: email,
    });

    if (!appointment) {
        return res.status(404).json({
            success: false,
            message: "No appointment found for this email",
        });
    }

    res.status(200).json({
        success: true,
        data: appointment,
    });
});

module.exports = router;
