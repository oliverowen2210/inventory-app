const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

CategorySchema.virtual("URL").get(function () {
  return `/inventory/category/${this._id}`;
});

CategorySchema.virtual("imageURL").get(function () {
  return `/images/categories/${this._id}.png`;
});

CategorySchema.virtual("itemCount").get(function () {
  return this.items.length;
});

module.exports = mongoose.model("Category", CategorySchema);
