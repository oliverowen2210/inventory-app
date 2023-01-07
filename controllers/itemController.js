const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
const async = require("async");

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
  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      count: req.body.count,
      category: req.body.category,
    });
    if (!errors.isEmpty()) {
      Category.find({}).exec((err, results) => {
        if (err) return next(err);
        if (results === null) {
          err = new Error("No categories were found.");
          err.status = 404;
          return next(err);
        }

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
      });
    } else {
      item.save((err, new_item) => {
        if (err) return next(err);
        res.redirect(new_item.URL);
      });
    }
  },
];
