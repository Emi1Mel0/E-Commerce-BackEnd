import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      trim: true,
      minlength: [2, "too short user name"],
    },
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      lowercase: true,
    },
    wishList: [{ type: mongoose.Types.ObjectId, ref: "product" }],
    addresses: [
      {
        street: String,
        phone: String,
        city: String,
        country: String,
        zipcode: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  if (this.password) this.password = bcryptjs.hashSync(this.password, 8);
});
userSchema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = bcryptjs.hashSync(this._update.password, 8);
});

export const userModel = mongoose.model("user", userSchema);
