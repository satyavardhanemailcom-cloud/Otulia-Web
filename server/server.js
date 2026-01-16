require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

const app = express();

connectDB();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Otulia Backend",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
