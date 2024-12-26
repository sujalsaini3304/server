import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";

const dbSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);


dbSchema.pre("save", async function(next){
  if (!this.isModified("password")) return next();
  const hash = await bcrypt.hash(this.password, 8);
  this.password = hash;
});


const User = mongoose.model("User", dbSchema);


export default User;
