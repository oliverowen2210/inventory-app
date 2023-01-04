const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      category_count(cb) {
        Category.countDocuments({}, cb);
      },
      item_count(cb) {
        Item.countDocuments({}, cb);
      },
    },
    function (err, results) {
      if (err) return next(err);

      res.render("index", {
        title: "Inventory App",
        category_count: results.category_count,
        item_count: results.item_count,
      });
    }
  );
};
