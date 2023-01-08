const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");

function makeid(length) {
  let result = "";
  let characters = "abcdef01234567890123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const multer = require("multer");
const path = require("path");

const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/categories");
  },
  filename: function (req, file, cb) {
    cb(null, makeid(24) + path.extname(file.originalname));
  },
});
const categoryUpload = multer({ storage: categoryStorage });

const itemStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/items");
  },
  filename: function (req, file, cb) {
    cb(null, makeid(24) + path.extname(file.originalname));
  },
});
const itemUpload = multer({ storage: itemStorage });

/**Home page */
router.get("/", categoryController.categories);

/** Category Routes */
router.get(
  "/inventory/category/create",
  categoryController.category_create_get
);
router.post(
  "/inventory/category/create",
  categoryUpload.single("uploaded-image"),
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
  categoryUpload.single("uploaded-image"),
  categoryController.category_update_post
);

/**Category detail/item list*/
router.get("/inventory/category/:id", categoryController.category_detail);

/**Item routes */
router.get("/inventory/item/create", itemController.item_create_get);
router.post(
  "/inventory/item/create",
  itemUpload.single("uploaded-image"),
  itemController.item_create_post
);

router.get("/inventory/item/:id/delete", itemController.item_delete_get);
router.post("/inventory/item/:id/delete", itemController.item_delete_post);

router.get("/inventory/item/:id/update", itemController.item_update_get);
router.post(
  "/inventory/item/:id/update",
  itemUpload.single("uploaded-image"),
  itemController.item_update_post
);

module.exports = router;
