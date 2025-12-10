import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Driver"],
      default: "Driver",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive",
    },
  },
  { timestamps: true }
);

// Remove password when converting to JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", UserSchema);

export default User;
