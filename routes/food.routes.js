const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

//! food database
const foodMenuCollection = client.db("warmHearts").collection("foodMenus");
const selectedFoodMenuCollection = client
    .db("warmHearts")
    .collection("selectedFoodMenus");

// Function to create TTL index on selectedFoodMenus collection
const initializeTTLIndex = async () => {
    await selectedFoodMenuCollection.createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 15 * 24 * 60 * 60 } // 15 days in seconds
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

router.get("/selectedFoodMenu", verifyToken, async (req, res) => {
    const { email } = req.query;
    const cursor = selectedFoodMenuCollection.find({ userEmail: email });
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

// Update food item status for a user
router.patch("/selectedFoodMenu/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Remove _id from update data if present to avoid modification error
    const { _id, ...updateFields } = updateData;

    const result = await selectedFoodMenuCollection.updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                ...updateFields,
                updatedAt: new Date(),
            },
        }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({
            success: false,
            message: "Selection not found",
        });
    }

    res.json({
        success: true,
        message: "Selections updated successfully",
        data: result,
    });
});

module.exports = router;
