const dotenv = require("dotenv");
const express = require("express");
const globalErrorHandler = require("./controller/errController");
const userRouter = require("./route/userRoute");
const jobRouter = require("./route/jobRoute");
const applicationRouter = require("./route/applicationRoute");

dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());

app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/applications", applicationRouter);

app.use(globalErrorHandler);

module.exports = app;
