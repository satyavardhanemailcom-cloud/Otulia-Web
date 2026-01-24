require("dotenv").config();
const express = require("express");
const connectDB = require("./db.js");
const path = require("path");

// middleware import
const corsMiddleware = require("./middleware/cors.middleware.js");

// route import
const homeRoutes = require("./routes/home.routes.js");
const listingRoutes = require("./routes/listing.routes.js");
const assetsRoutes = require("./routes/assets.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const trendingRoutes = require("./routes/trending.routes.js");
const popularRoutes = require("./routes/popular.routes.js");

const app = express();

connectDB();

app.use(express.json());
app.use(corsMiddleware);
const PORT = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, "../client/dist")));

// routes register
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/test", require("./routes/test.routes.js"));
app.use("/api/trending", trendingRoutes);
app.use("/api/popular", popularRoutes);


app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Otulia Backend",
  });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
});
