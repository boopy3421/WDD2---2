import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

//get -> display name, var name ="Moreno"

//post

app.use(express.json());

app.get("/getName", (req, res) => {
  var name = "John Christian Moreno";
  res.status(200).json(name);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body; // destructuring assignment, JSON object

  // basic validation
  if (!username || !password) {
    return res.status(400).send("username and password fields are required") // 400 bad request
  }
  // simulate user authentication
  const user = data.find(
    (u) => u.username === username && u.password === password
  );

  // log the registered users
  if (user) {
    res.send('user ${username} logged in successfully');
  } else {
    res.status(401).send("Invalid username or password"); // 401 unauthorized 
  }
});

app.post("/register", (req, res) => {
  const { username, name, password, role } = req.body;
  // BASIC VALIDATION
  if (!username || !password || !role) {
    return res
      .status(400)
      .send("username, password and role fields are required"); // 400 bad request
  }
  // store user data in memory (DEMO)
  data.push({ username, name, password, role });

  // Log the registered users
  console.log("Registered Users:", data);

  // simulate user registration
  res.send('User ${username} registered successfully');
});

app.post("/logout", (req, res) => {
  // Simulate user logout
  res.send("User logged out successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  // log the registered users
  console.log("Registered Users:", data);
});
