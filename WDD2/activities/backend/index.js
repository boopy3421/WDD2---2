import express from "express";
import dotenv from "dotenv";
import connectDB from "./congfig/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config(); //initialize dotenv

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // middleware to parse JSON request bodies
app.use("/api/auth", authRoutes); // use the auth routes

//base url + endpoint + route 
// Example : http://localhost:3000/api/auth/register


app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
