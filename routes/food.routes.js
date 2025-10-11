const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

//! food database
const foodMenuCollection = client.db("warmHearts").collection("foodMenus");
const selectedFoodMenuCollection = client.db("warmHearts").collection("selectedFoodMenus");

// Function to create TTL index on selectedFoodMenus collection
const initializeTTLIndex = async () => {
    await selectedFoodMenuCollection.createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 15 * 24 * 60 * 60  } // 15 days in seconds
    );
    console.log("TTL index created on selectedFoodMenus collection");
};

initializeTTLIndex();

// Get all food items
router.get("/foodmenu", async (req, res) => {
    const cursor = foodMenuCollection.find();
    const result = await cursor.toArray();
    res.send(result);
});

router.get("/selectedFoodMenu", async (req, res) => {
    const { email } = req.query;
    const cursor = selectedFoodMenuCollection.find({ email });
    const result = await cursor.toArray();
    res.send(result);
});

// Add new food item for a user
router.post("/selectedFoodMenu", verifyToken, async (req, res) => {
    const submissionData = req.body;
    submissionData.createdAt = new Date(); 
    const result = await selectedFoodMenuCollection.insertOne(submissionData);
    res.send(result);
});

module.exports = router;
