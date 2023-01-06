const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

router.get("/", categoryController.categories);

router.get(
  "/inventory/category/create",
  categoryController.category_create_get
);

router.post(
  "/inventory/category/create",
  categoryController.category_create_post
);

router.get("/inventory/category/:id", categoryController.category_detail);

router.get(
  "/inventory/category/:id/delete",
  categoryController.category_delete_get
);
router.post(
  "/inventory/category/:id/delete",
  categoryController.category_delete_post
);

router.get("/inventory/item/create", itemController.item_create_get);
router.post("/inventory/item/create", itemController.item_create_post);

module.exports = router;
