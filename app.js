const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const { RedisStore } = require("rate-limit-redis");
const globalErrorHandler = require("./controller/errController");
const userRouter = require("./route/userRoute");
const jobRouter = require("./route/jobRoute");
const applicationRouter = require("./route/applicationRoute");
const viewsRoute = require("./route/viewsRoutes");
const redisClient = require("./redisClient");

dotenv.config({ path: "./config.env" });

const app = express();

//tell express our view engine
app.set("view engine", "pug");

app.use(express.json());
app.use(cookieParser());

app.set("views", path.join(__dirname, "./src/views"));

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use("/css", express.static("src/client/css")); // For CSS
app.use("/img", express.static("src/client/img"));

// const limiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   keyGenerator: (req) => req.user?.id || req.ip,
//   standardHeaders: true,
//   legacyHeaders: false,
//   max: 100,
//   windowMs: 15 * 60 * 1000,
//   handler: (req, res) => {
//     res.status(429).json({
//       status: "fail",
//       message: "Too many requests, please try again later",
//     });
//   },
// });

// app.use("/api", limiter);

// app.use(helmet());

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
//     },
//   })
// );

// Test middleware
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);


app.use("/", viewsRoute);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/applications", applicationRouter);

app.use(globalErrorHandler);

module.exports = app;
