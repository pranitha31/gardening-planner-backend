import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Create the Express app
const app = express();
const allowedOrigins = [
  "http://localhost:5173",                      // Your "Work" address
  "https://jade-alfajores-67b1cd.netlify.app"   // Your "Live" address
];

app.use(cors({
  origin: allowedOrigins, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
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



