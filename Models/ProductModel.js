const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minLength: [5, "Too short product title"],
      maxLength: [100, "Too longe product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [20, "Too short product description"],
      maxLength: [1000, "Too longe product description"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity must be greater than 0"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      min: [0, "Price must be greater than 0"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Product category is required"],
    },
    subcategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        // required : [true, "Product subcategory is required"]
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      // required : [true, "Product brand is required"]
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Product rating must be above or equal to 1"],
      max: [5, "Product rating must be less than or equal to 5"],
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// create virtual field (reviews) that ref to reviews on a product
ProductSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "product",
  localField: "_id"
});

ProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});
// mongoose middleware to return image path in response
const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageURL;
  }
  if (doc.images) {
    const imagesURL = [];
    // eslint-disable-next-line array-callback-return
    doc.images.forEach((img) => {
      const imgURL = `${process.env.BASE_URL}/products/${img}`;
      imagesURL.push(imgURL);
    });
    doc.images = imagesURL;
  }
};

// 1- getOne - getAll - update
ProductSchema.post("init", (doc) => {
  setImageURL(doc);
});
// 2- Create
ProductSchema.post("save", (doc) => {
  setImageURL(doc);
});
module.exports = mongoose.model("Product", ProductSchema);
