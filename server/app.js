require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const shortUrlRouter = require("./routes/shortUrlRoute");
const statsUrlRouter = require("./routes/statsRoute");
const reDirectRouter = require("./routes/reDirectRoute");
const errorHandler = require("./handlers/errorHandler");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.resolve(`./dist`)));
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./dist/index.html"));
});
app.use(cors());
app.use(express.json());
app.use("/", reDirectRouter);
app.use("/api/shorturl/", shortUrlRouter);
app.use("/api/stats/", statsUrlRouter);
app.use(errorHandler);

// app.get("/", (req, res) => {
//   res.send("test");
// });

module.exports = app;
