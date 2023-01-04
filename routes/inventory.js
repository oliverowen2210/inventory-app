const express = require("express");
const router = express.Router;

const categoryontroller = require("../controllers/categoryontroller");
const itemController = require("../controllers/itemController");

router.get("/", categoryController.index);

module.exports = router;
