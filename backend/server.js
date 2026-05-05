const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const { getAllUsers } = require("./controllers/projectController");
const { protect } = require("./middleware/auth");

// dotenv.config({ path: path.resolve(__dirname, "../.env") });

dotenv.config();

const app = express();

app.use(express.json());
// app.use(cors());


app.use(cors({
  origin: 'https://team-task-manager-client.onrender.com',
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.get("/api/users", protect, getAllUsers);

app.get("/health", (req, res) => res.status(200).send("Server is Healthy"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("MongoDB Database connection established successfully."),
  )
  .catch((err) => console.log("Database connection failed:", err));

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html")),
//   );
// }

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));
  
  // Express 5 ke liye 'SPLAT' parameter syntax use karna zaroori hai
  app.get("/index.html", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  // Ye syntax saari client-side routes ko handle karega bina crash kiye
  app.get("/:any*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
