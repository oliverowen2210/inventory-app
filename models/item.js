const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true },
});

ItemSchema.virtual("URL").get(function () {
  return `/inventory/item/${this._id}`;
});

ItemSchema.virtual("imageURL").get(function () {
  return `/images/items/${this._id}.png`;
});

module.exports = mongoose.model("Item", ItemSchema);
