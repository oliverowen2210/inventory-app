const firebase = require("../firebase");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");

const { body, validationResult } = require("express-validator");
const async = require("async");
const path = require("path");
const mongoose = require("mongoose");

const Category = require("../models/category");
const Item = require("../models/item");
const makeID = require("../utils").makeID;

exports.categories = (req, res, next) => {
  async.parallel(
    {
      categories(cb) {
        Category.find({}).exec(cb);
      },
      category_count(cb) {
        Category.countDocuments({}, cb);
      },
      item_count(cb) {
        Item.countDocuments({}, cb);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.categories === null) {
        err = new Error("No categories have been created.");
        err.status = 404;
        return next(err);
      }

      res.render("category_list", {
        title: "Inventory App",
        categories: results.categories,
        category_count: results.category_count,
        item_count: results.item_count,
      });
    }
  );
};

exports.category_create_get = (req, res) => {
  res.render("category_form", { title: "New category" });
};

exports.category_create_post = [
  body("name", "A category name is required.")
    .isLength({ min: 1, max: 30 })
    .trim(),
  body("description", "A category description is required.")
    .isLength({ min: 1, max: 110 })
    .trim(),
  async (req, res, next) => {
    const errors = validationResult(req);

    let categoryID = makeID(24);
    let imageURL = null;

    if (req.file) {
      if (path.parse(req.file.originalname).ext !== ".png") {
        err = new Error("Image must be png");
        err.status = 400;
        return next(err);
      }
      const metadata = {
        contentType: "image/png",
        name: categoryID,
      };

      const storage = getStorage(firebase);
      const storageRef = ref(storage, "categories/" + `${categoryID}`);

      await uploadBytesResumable(storageRef, req.file.buffer, metadata);
      imageURL = await getDownloadURL(storageRef);
    }

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      imageURL,
      _id: mongoose.Types.ObjectId(categoryID),
    });

    if (
      !errors.isEmpty() ||
      (req.file && path.parse(req.file.originalname).ext !== ".png")
    ) {
      res.render("category_form", {
        title: "New category",
        category,
        errors: errors.array(),
      });
    } else {
      category.save((err, new_category) => {
        if (err) return next(err);
        res.redirect(new_category.URL);
      });
    }
  },
];

exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(cb) {
        Category.findById(req.params.id).exec(cb);
      },
      items(cb) {
        Item.find({ category: req.params.id }).exec(cb);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.category === null) {
        err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }

      res.render("category_detail", {
        title: "Category Detail",
        category: results.category,
        items: results.items,
      });
    }
  );
};

exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.category === null) {
        err = new Error("No category with that ID was found.");
        err.status = 404;
        return next(err);
      }
      res.render("category_delete", {
        title: "Delete category",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};

exports.category_delete_post = (req, res, next) => {
  async.parallel(
    {
      remove_items(callback) {
        Item.remove({ category: req.body.id }).exec(callback);
      },
      remove_category(callback) {
        Category.findByIdAndRemove(req.body.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.redirect("/");
    }
  );
};

exports.category_update_get = (req, res, next) => {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) return next(err);
    if (category === null) {
      err = new Error("No category was found");
      err.status = 404;
      return next(err);
    }

    res.render("category_form", { title: "Update category", category });
  });
};

exports.category_update_post = [
  body("name", "A category name is required.")
    .isLength({ min: 1, max: 30 })
    .trim()
    .escape(),
  body("description", "A category description is required.")
    .isLength({ min: 1, max: 110 })
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    let categoryID = req.params.id;
    let imageURL = null;

    if (req.file) {
      const metadata = {
        contentType: "image/png",
        name: categoryID,
      };

      const storage = getStorage(firebase);
      const storageRef = ref(storage, "categories/" + `${categoryID}`);

      await uploadBytesResumable(storageRef, req.file.buffer, metadata);
      imageURL = await getDownloadURL(storageRef);
    }

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (
      !errors.isEmpty() ||
      (req.file && path.parse(req.file.filename).ext !== ".png")
    ) {
      res.render("category_form", {
        title: "New category",
        category,
        errors: errors.array(),
      });
    } else {
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        (err, thecategory) => {
          if (err) return next(err);
          res.redirect(thecategory.URL);
        }
      );
    }
  },
];
