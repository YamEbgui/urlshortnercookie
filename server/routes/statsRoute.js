//import section
const express = require("express");
const cors = require("cors");
const statsRouter = express.Router();
const fs = require("fs");
const path = require("path");
const db = require("../database/db");

statsRouter.get("/:shortUrl", async (req, res, next) => {
  try {
    let stats = await db.getObjectByShortUrl(req.params.shortUrl);

    if (!stats) {
      throw { status: 404, message: { error: "URL IS NOT EXIST IN DATABASE" } };
    }
    res.send(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = statsRouter;
