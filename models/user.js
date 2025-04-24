import { model, Schema } from "mongoose";
import Counter from "./counter.js";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "dentist", "assistant", "patient"],
      default: "patient",
    },
  },
  {
    discriminatorKey: "role",
    collection: "users",
    timestamps: true,
  }
);

// Pre-save hook to auto-increment the 'id' field
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        "userId", // This is the ID for the counter document. You can name it anything (e.g., 'userId')
        { $inc: { seq: 1 } }, // Increment the seq field
        { new: true, upsert: true } // If document doesn't exist, create it
      );
      this.id = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next(); // If it's not a new document, skip the counter increment
  }
});

userSchema.statics.modifyUser = async function(userId, updates){
  try{
    const user = await User.findById(userId)
    if(!user) return res.status(404).json({error: "User Not Found!"})
    Object.assign(user, updates)
    return await user.save()
  }catch(err){
    console.error(err)
    throw new Error(err.message)
  }
}

const patientSchema = new Schema({
  birthDate: Date,
  address: String,
  tel: String,
});

const assistantSchema = new Schema({});

const adminSchema = new Schema({});

const dentistSchema = new Schema({
  specialisation: String,
  cabinetAddress: String,
  tel: String,
});
// methods
patientSchema.methods.addPatient = async function () {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    // Save the new patient
    await this.save();
    return this;
  } catch (err) {
    throw new Error(err.message);
  }
};

patientSchema.statics.modifyPatient = async function(patientId, updates){
  try{
    
    const patient = await Patient.findById(patientId)
    if(!patient) return res.status(404).json({error: "Patient Not Found!"})
    Object.assign(patient, updates)
    return await patient.save()
  }catch(err){
    console.error(err)
    throw new Error(err.message)
  }
}

const User = model("User", userSchema);

const Admin = User.discriminator("admin", adminSchema);
const Patient = User.discriminator("patient", patientSchema);
const Assistant = User.discriminator("assistant", assistantSchema);
const Dentist = User.discriminator("dentist", dentistSchema);


export {
  User,
  Admin,
  Patient,
  Assistant,
  Dentist,
};
