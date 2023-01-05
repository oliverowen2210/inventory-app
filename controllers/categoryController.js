const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
const async = require("async");

exports.categories = (req, res) => {
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

      res.render("index", {
        title: "Inventory App",
        categories: results.categories,
        category_count: results.category_count,
        item_count: results.item_count,
      });
    }
  );
};
