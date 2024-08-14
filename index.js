import path from "path";
import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./db/connection.js";
import { globalErrorHandler } from "./src/utils/error-handling.js";
import { brandRouter, categoryRouter } from "./src/index.routes.js";

// Create express app
const app = express();

// Define port
const port = 3000;

// Load environment variables from the config folder
dotenv.config({ path: path.resolve("./config/.env") });

// MongoDB connection
connectToDB();

// Middlewares
app.use(express.json());

// Define routes
app.use("/categories", categoryRouter);
app.use("/brands", brandRouter);

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(port, () => console.log(`App is listening on port ${port}!`));
