const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");

const multer = require("multer");

const multerStorage = multer.memoryStorage();
const multerUpload = multer({ storage: multerStorage });

/**Item routes */
router.get("/new", itemController.item_create_get);
router.post(
  "/new",
  multerUpload.single("uploaded-image"),
  itemController.item_create_post
);

router.get("/:id", itemController.item_detail);

router.get("/:id/delete", itemController.item_delete_get);
router.post("/:id/delete", itemController.item_delete_post);

router.get("/:id/update", itemController.item_update_get);
router.post("/:id/update", itemController.item_update_post);

module.exports = router;
