const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;

//! Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const foodRoutes = require("./routes/food.routes");
const medicineRoutes = require("./routes/medicine.routes");
const appointmentRoutes = require("./routes/appointment.routes");

// Import database connection
const { connectToDatabase } = require("./config/db");

// middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Basic route
app.get("/", (req, res) => {
    res.send("warmHearts server is running...");
});

//! Use routes
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", foodRoutes);
app.use("/", medicineRoutes);
app.use("/", appointmentRoutes);


// Connect to database and start server
connectToDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error);
        process.exit(1);
    });
