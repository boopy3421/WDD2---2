import express from "express";

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
  const { username, password } = req.body;

  if (username == "John Christian Moreno" && password == "123321") {
    res.status(200).json({
      message: "LOGIN SUCCESSFUL",
      status: "success",
    });
  } else {
    res.status(403).json({
      message: "Invalid Username or Password",
      status: "Failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
