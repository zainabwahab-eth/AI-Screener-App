const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DB_URL;

mongoose
  .connect(DB)
  .then(() => {
    console.log("connection to mongodb successful");
  })
  .catch((err) => console.log("MongoDB Error:", err.message));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Your connected to ${PORT}`);
});
