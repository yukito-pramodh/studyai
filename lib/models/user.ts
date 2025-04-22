import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  name: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  learningPreference: {
    type: String,
    enum: ["visual", "auditory", "reading", "kinesthetic"],
    default: "visual",
  },
  profileImage: {
    type: String,
    default: "",
  },
})

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.models.User || mongoose.model("User", UserSchema)
