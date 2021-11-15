//imports section
const express = require("express");
const cors = require("cors");
const reDirectRouter = express.Router();
const fs = require("fs");
const path = require("path");
const db = require("../database/db");

reDirectRouter.get("/:shortUrl", async (req, res, next) => {
  try {
    const originUrl = await db.getOriginUrl(req.params.shortUrl);
    if (!originUrl) {
      throw { status: 404, message: { error: "NOT FOUND" } };
    }
    if (originUrl.slice(0, 4) !== "http") {
      return res.redirect(`http://${originUrl}`);
    }

    res.redirect(originUrl);
  } catch {
    next({ status: 404, message: { error: "NOT FOUND" } });
  }
});

module.exports = reDirectRouter;
