const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

//! medicine database
const medicineCollection = client.db("warmHearts").collection("medicine");

// Get all medicines
router.get("/medicine", async (req, res) => {
    const cursor = medicineCollection.find();
    const result = await cursor.toArray();
    res.send(result);
});

router.get("/selectedMedicine", verifyToken, async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).send({ error: "Email parameter is required" });
    }

    const result = await medicineCollection.find({ userEmail: email }).toArray();
    res.send(result);
});

module.exports = router;
