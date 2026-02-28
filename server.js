import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Create the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import testRoutes from "./src/routes/testRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";


import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import plantRoutes from "./src/routes/plantRoutes.js";
import reminderRoutes from "./src/routes/reminderRoutes.js";

import seasonalPlannerRoutes from "./src/routes/seasonalPlannerRoutes.js";
import seasonalTaskRoutes from "./src/routes/seasonalTaskRoutes.js";

import weatherPlannerRoutes from "./src/routes/weatherPlannerRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";


app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/reminders", reminderRoutes);

app.use("/api/seasonal-planner", seasonalPlannerRoutes);
app.use("/api/seasonal-tasks", seasonalTaskRoutes);

app.use("/api/weather-planner", weatherPlannerRoutes);
app.use("/api/users", userRoutes);
// Root route
app.get("/", (req, res) => {
  res.send("Gardening Planner API running 🌱");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Digital Time Capsule Backend is Running 🚀");
});
