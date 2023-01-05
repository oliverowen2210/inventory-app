const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

router.get("/", categoryController.categories);

router.get(
  "/inventory/category/create",
  categoryController.category_create_get
);

module.exports = router;
