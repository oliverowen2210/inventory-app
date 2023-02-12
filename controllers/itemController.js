const firebase = require("../firebase");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");

const { body, validationResult } = require("express-validator");
const async = require("async");
const mongoose = require("mongoose");
const path = require("path");

const Category = require("../models/category");
const Item = require("../models/item");

const makeID = require("../utils").makeID;

exports.item_detail = async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    const err = new Error("No item with that ID was found.");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", { title: "Item detail", item });
};

exports.item_create_get = (req, res, next) => {
  Category.find({}).exec((err, categories) => {
    if (err) return next(err);
    if (categories === null) {
      err = new Error("No categories were found.");
      err.status = 404;
      return next(err);
    }
    res.render("item_form", { title: "New item", categories });
  });
};

exports.item_create_post = [
  body("name", "An item name is required.")
    .trim()
    .isLength({ min: 1, max: 40 })
    .escape(),
  body("description", "An item description is required.")
    .isLength({ min: 1, max: 110 })
    .trim()
    .escape(),
  body("price", "An item price is required.").trim().isNumeric().escape(),
  body("count", "An item count is required.").trim().isNumeric().escape(),
  body("category", "A category is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    let imageID = makeID(24);
    let imageURL = null;

    if (req.file) {
      const metadata = {
        contentType: "image/png",
        name: imageID,
      };

      const storage = getStorage(firebase);
      const storageRef = ref(storage, "categories/" + `${imageID}`);

      await uploadBytesResumable(storageRef, req.file.buffer, metadata);
      imageURL = await getDownloadURL(storageRef);
    }

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      count: req.body.count,
      category: req.body.category,
      imageURL,
      _id: mongoose.Types.ObjectId(imageID),
    });
    if (
      !errors.isEmpty() ||
      (req.file && path.parse(req.file.originalname).ext !== ".png")
    ) {
      Category.find({}).exec((err, results) => {
        if (err) return next(err);
        if (results === null) {
          err = new Error("No categories were found.");
          err.status = 404;
          return next(err);
        } else {
          for (let category in results) {
            if (category._id.toString() === req.body.category.toString()) {
              category.selected = true;
              break;
            }
          }

          res.render("item_form", {
            title: "New form",
            categories: results,
            item,
            errors,
          });
        }
      });
    } else {
      async.parallel(
        {
          save(cb) {
            item.save(cb);
          },
          category(cb) {
            Category.findById(req.body.category).exec(cb);
          },
        },
        (err, results) => {
          res.redirect(results.category.URL);
        }
      );
    }
  },
];

exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id).exec((err, item) => {
    if (err) return next(err);
    if (item === null) {
      err = new Error("Item not found.");
      err.status = 404;
      return next(err);
    }

    res.render("item_delete", { title: "Deleting item", item });
  });
};

exports.item_delete_post = (req, res, next) => {
  async.waterfall(
    [
      (callback) => {
        Item.findById(req.body.id).exec((err, result) => {
          callback(err, result);
        });
      },
      (item, callback) => {
        async.parallel(
          {
            category(cb) {
              Category.findById(item.category).exec(cb);
            },
            deleteItem(cb) {
              Item.findByIdAndRemove(req.body.id).exec(cb);
            },
          },
          (err, results) => {
            if (err) return next(err);
            res.redirect(results.category.URL);
          }
        );
      },
    ],
    (err, results) => {
      if (err) console.log(err);
    }
  );
};

exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      item(cb) {
        Item.findById(req.params.id).exec(cb);
      },
      categories(cb) {
        Category.find({}).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.item === null) {
        err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }

      res.render("item_form", {
        title: "Update item",
        item: results.item,
        categories: results.categories,
      });
    }
  );
};

exports.item_update_post = [
  body("name", "An item name is required.")
    .trim()
    .isLength({ min: 1, max: 40 })
    .escape(),
  body("description", "An item description is required.")
    .isLength({ min: 1, max: 50 })
    .trim()
    .escape(),
  body("price", "An item price is required.").trim().isNumeric().escape(),
  body("count", "An item count is required.").trim().isNumeric().escape(),
  body("category", "A category is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      count: req.body.count,
      category: req.body.category,
      _id: req.params.id,
    });

    Item.findByIdAndUpdate(req.params.id, item, {}, (err, theitem) => {
      if (err || (req.file && path.parse(req.file.filename).ext !== ".png")) {
        return next(err);
      }
      Category.findById(theitem.category).exec((err, result) => {
        res.redirect(result.URL);
      });
    });
  },
];
