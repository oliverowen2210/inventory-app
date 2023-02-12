const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageURL: { type: String },
});

CategorySchema.virtual("URL").get(function () {
  return `/categories/${this._id}`;
});

CategorySchema.virtual("itemCount").get(function () {
  return this.items.length;
});

module.exports = mongoose.model("Category", CategorySchema);
