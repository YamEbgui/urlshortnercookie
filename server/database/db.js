//import section
const fs = require("fs");
const fsAsync = require("fs/promises");
const path = require("path");
const util = require("util");
const moment = require("moment");
const readFile = (filename) => util.promisify(fs.readFile)(filename, "utf-8");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const UrlSchema = new mongoose.Schema({
  originUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  },
  creatorDate: {
    type: String,
    required: true,
  },
});

const Url = mongoose.model("Url", UrlSchema);
mongoose.connect(
  `mongodb+srv://yam:${process.env.PASSWORD}@database.foklg.mongodb.net/UrlShortner?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  }
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", async function () {
  console.log("connected");
});

//DataBase class that has methods for DataBase use
class DataBase {
  static #createShortCut() {
    //function that generates a unique random sequnce
    let shortUrl = "";
    for (let i = 0; i < 7; i++) {
      if (Math.random() < 0.5) {
        shortUrl += String.fromCharCode(65 + Math.floor(Math.random() * 26));
      } else {
        shortUrl += String.fromCharCode(48 + Math.floor(Math.random() * 10));
      }
    }
    return shortUrl;
  }
  static async #readDataBase() {
    //function that reads the database
    try {
      const fileData = await Url.find({});
      return fileData;
    } catch (error) {
      throw error;
    }
  }
  static async #createUrlObj(_originUrl) {
    //function that creates an url object
    try {
      let newShortCut = await this.#createShortCut();
      while (await this.#checkIfUrlExist(newShortCut)) {
        newShortCut = await this.#createShortCut();
      }
      const urlObj = {
        originUrl: _originUrl,
        shortUrl: newShortCut,
        views: 0,
        creatorDate: moment().format("dddd,MMMM Do YYYY, h:mm:ss a"),
      };
      return urlObj;
    } catch (error) {
      throw error;
    }
  }
  static async addObjToDb(originUrl) {
    // function that adds the new object we generated to the database
    try {
      if (await this.#isShortenExist(originUrl)) {
        return await this.#getShortUrl(originUrl);
      }
      return await this.#writeUrl(await this.#createUrlObj(originUrl));
    } catch (error) {
      throw error;
    }
  }
  static async #writeUrl(newObj) {
    // function that updates the data base with the new objects
    try {
      await Url.insertMany(newObj);
      return newObj.shortUrl;
    } catch (error) {
      throw error;
    }
  }
  static async #checkIfUrlExist(randomSequence) {
    // function that checks if url already exists in database
    try {
      let dataBase = await Url.find({});
      for (let i = 0; i < dataBase.length; i++) {
        if (dataBase[i].shortUrl === randomSequence) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  static async #isShortenExist(_originUrl) {
    // function that checks if the unique sequence we gave him already exists in database
    try {
      let dataBase = await Url.find({});
      for (let i = 0; i < dataBase.length; i++) {
        if (dataBase[i].originUrl === _originUrl) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  static async #getShortUrl(_originUrl) {
    // function that returns a short url
    try {
      let dataBase = await this.#readDataBase();
      for (let i = 0; i < dataBase.length; i++) {
        if (dataBase[i].originUrl === _originUrl) {
          return dataBase[i].shortUrl;
        }
      }
    } catch (error) {
      throw error;
    }
  }
  static async getOriginUrl(_shortUrl) {
    // functions that gets a shorturl and returns originalurl
    try {
      let dataBase = await Url.find({});
      for (let i = 0; i < dataBase.length; i++) {
        if (dataBase[i].shortUrl === _shortUrl) {
          let _views = dataBase[i].views;
          _views++;
          await Url.updateOne(
            { shortUrl: _shortUrl },
            { $set: { views: _views } }
          );
          return dataBase[i].originUrl;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  static async getObjectByShortUrl(_shortUrl) {
    // function that gets a shorturl and returns the url object
    try {
      let dataBase = await this.#readDataBase();
      for (let i = 0; i < dataBase.length; i++) {
        if (dataBase[i].shortUrl === _shortUrl) {
          return dataBase[i];
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
module.exports = DataBase;
