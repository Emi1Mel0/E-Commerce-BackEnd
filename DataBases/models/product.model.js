import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "title is required"],
      trim: true,
      required: true,
      minLength: [2, "too short product title"],
      maxLength: [200, "too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minLength: [10, "too short product description"],
      maxLength: [500, "too long product description"],
    },
    imgCover: String,
    images: [],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0,
    },
    sold: Number,
    rateAvg: {
      type: Number,
      min: 0,
      max: 5,
    },
    rateCount: { type: Number, min: 0, default: 0 },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "brand",
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    subcategory: {
      type: mongoose.Types.ObjectId,
      ref: "subcategory",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true ,toJSON:{virtuals:true}}
);

productSchema.post("init", function (doc) {
  //   if (doc.imgCover || doc.images) {
  //     // we did this if condition because when you sort
  //     // it loops on something that doesn't has a map
  doc.imgCover = process.env.BASE_URL + "uploads/" + doc.imgCover;
  doc.images = doc.images.map((img) => process.env.BASE_URL + "uploads/" + img);
  //   }
});

productSchema.virtual("myReviews", {
  ref: "review",
  localField: "_id",
  foreignField: "product",
});

productSchema.pre('findOne', function () {
  this.populate('myReviews');
// and by this you can get the review of one single product through virtual population
});

// to link the models between others without saving it into th database
// ref to the wanted model and local field the link between them
// which the id of the product inside the review model
// and the foreign field refers to the product _id in the review model

export const productModel = mongoose.model("product", productSchema);
