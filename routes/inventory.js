const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

const multer = require("multer");
const path = require("path");

const multerStorage = multer.memoryStorage();
const multerUpload = multer({ storage: multerStorage });

/**Home page */
router.get("/", categoryController.categories);

/** Category Routes */
router.get(
  "/inventory/category/create",
  categoryController.category_create_get
);
router.post(
  "/inventory/category/create",
  multerUpload.single("uploaded-image"),
  categoryController.category_create_post
);

router.get(
  "/inventory/category/:id/delete",
  categoryController.category_delete_get
);
router.post(
  "/inventory/category/:id/delete",
  categoryController.category_delete_post
);

router.get(
  "/inventory/category/:id/update",
  categoryController.category_update_get
);
router.post(
  "/inventory/category/:id/update",
  categoryController.category_update_post
);

/**Category detail/item list*/
router.get("/inventory/category/:id", categoryController.category_detail);

/**Item routes */
router.get("/inventory/item/create", itemController.item_create_get);
router.post(
  "/inventory/item/create",
  multerUpload.single("uploaded-image"),
  itemController.item_create_post
);

router.get("/inventory/item/:id/delete", itemController.item_delete_get);
router.post("/inventory/item/:id/delete", itemController.item_delete_post);

router.get("/inventory/item/:id/update", itemController.item_update_get);
router.post("/inventory/item/:id/update", itemController.item_update_post);

module.exports = router;
