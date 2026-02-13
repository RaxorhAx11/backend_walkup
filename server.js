require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminAnalyticsRouter = require("./routes/admin/analytics-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopMockPaymentRouter = require("./routes/shop/mock-payment-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

const app = express();
const PORT = process.env.PORT || 5000;

/* ================================
   DATABASE CONNECTION
================================ */

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });

/* ================================
   CORS FIX (IMPORTANT)
================================ */

app.use(
  cors({
    origin: true, // allow all origins (fixes Netlify issue)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* ================================
   MIDDLEWARE
================================ */

app.use(cookieParser());
app.use(express.json());

/* ================================
   ROUTES
================================ */

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/analytics", adminAnalyticsRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/mock-payment", shopMockPaymentRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

/* ================================
   HEALTH CHECK
================================ */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

/* ================================
   ERROR HANDLING
================================ */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

/* ================================
   404 ROUTE
================================ */

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ================================
   START SERVER
================================ */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
