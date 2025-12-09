import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";
import Database from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const upload = multer();
const PORT = process.env.PORT;

Database.connect();

// Middlewares
app.use(cors());
app.use(upload.none());

// Routes
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
    console.log('Server is runing at: ', PORT);
    console.log(`http://localhost:${PORT}`);
})