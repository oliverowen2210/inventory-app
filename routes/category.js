const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

const multer = require("multer");

const multerStorage = multer.memoryStorage();
const multerUpload = multer({ storage: multerStorage });

router.get("/", categoryController.categories);

router.get("/new", categoryController.category_create_get);
router.post(
  "/new",
  multerUpload.single("uploaded-image"),
  categoryController.category_create_post
);

router.get("/:id", categoryController.category_detail);

router.get("/:id/delete", categoryController.category_delete_get);
router.post("/:id/delete", categoryController.category_delete_post);

router.get("/:id/update", categoryController.category_update_get);
router.post("/:id/update", categoryController.category_update_post);

module.exports = router;
