import express from "express";
import "dotenv/config"
import Database from "./config/db.js";

const app = express();
const PORT = process.env.PORT;

Database.connect();
app.listen(PORT, () => {
    console.log('Server is runing at: ', PORT);
    console.log(`http://localhost:${PORT}`);
})