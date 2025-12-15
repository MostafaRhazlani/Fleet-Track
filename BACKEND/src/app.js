import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import multer from "multer";
import "dotenv/config";
import Database from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import tireRoutes from "./routes/tire.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import path from 'path';

const app = express();
// const upload = multer();
const PORT = process.env.PORT;

Database.connect();

// Middlewares
app.use(cors({
    origin: 'http://localhost:3002',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser())
// app.use(upload.none());

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicle", vehicleRoutes);
app.use("/api/v1/tire", tireRoutes);
app.use("/api/v1/trip", tripRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.listen(PORT, () => {
    console.log('Server is runing at: ', PORT);
    console.log(`http://localhost:${PORT}`);
})