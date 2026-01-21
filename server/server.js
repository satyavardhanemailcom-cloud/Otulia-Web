require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

// route import
const homeRoutes = require("./routes/home.routes");
const listingRoutes = require("./routes/listing.routes");
const assetsRoutes = require("./routes/assets.routes");
const authRoutes = require("./routes/auth.routes");
const trendingRoutes = require("./routes/trending.routes");

const app = express();

connectDB();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// routes register
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/trending", trendingRoutes);


app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Otulia Backend",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
