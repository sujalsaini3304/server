import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const dbSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    image:{ type : String , unique:true , required:false , default: null },
  },
  { timestamps: true }
);


const userProfile = new Schema(
  {
    userId: mongoose.Schema.Types.ObjectId , 
    profileImageUrl : { type: String , required: true },
  }
)


dbSchema.pre("save", async function(next){
  if (!this.isModified("password")) return next();
  const hash = await bcrypt.hash(this.password, 8);
  this.password = hash;
});


const User = mongoose.model("User", dbSchema);
const UserProfile = mongoose.model("UserProfile", userProfile);


export{
  UserProfile ,
  User
};
