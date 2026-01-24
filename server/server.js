require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

// middleware import
const corsMiddleware = require("./middleware/cors.middleware.js");

// route import
const homeRoutes = require("./routes/home.routes");
const listingRoutes = require("./routes/listing.routes");
const assetsRoutes = require("./routes/assets.routes");
const authRoutes = require("./routes/auth.routes");
const trendingRoutes = require("./routes/trending.routes");
const popularRoutes = require("./routes/popular.routes");

const app = express();

connectDB();

app.use(express.json());
app.use(corsMiddleware);

// routes register
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/trending", trendingRoutes);
app.use("/api/popular", popularRoutes);


app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Otulia Backend",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  // Server is running on port 8000
});
