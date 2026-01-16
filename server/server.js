require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

// route import
const homeRoutes = require("./routes/home.routes");
const listingRoutes = require("./routes/listing.routes");

const app = express();

connectDB();

app.use(express.json());

// routes register
app.use("/api/home", homeRoutes);
app.use("/api/listings", listingRoutes);


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
