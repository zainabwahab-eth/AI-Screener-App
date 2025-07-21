const express = require("express");
const globalErrorHandler = require("./controller/errController");
const userRouter = require("./route/userRoute");

const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);

app.use(globalErrorHandler);

module.exports = app;
