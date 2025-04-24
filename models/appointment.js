import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    date: { type: Date, required: true },
    patient: { type: Schema.Types.ObjectId, ref: "patient", required: true },
    dentist: { type: Schema.Types.ObjectId, ref: "dentist", required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const updateStatus = async function (newStatus) {
  try {
    const appointment = await Appointment.findById(this._id);
    if (!appointment) throw new Error("Appointment not found");
    if (appointment.status == newStatus)
      throw new Error(`Appointment already ${newStatus}`);
    this.status = newStatus;
    await this.save();
    return this;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update appointment status");
  }
};

appointmentSchema.methods.confirm = async function () {
  return updateStatus.call(this, "confirmed");
};

appointmentSchema.methods.cancel = async function () {
  return updateStatus.call(this, "cancelled");
};

const Appointment = model("Appointment", appointmentSchema, "appointments");
export default Appointment;
