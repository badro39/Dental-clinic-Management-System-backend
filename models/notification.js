import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  sendDate: {type: Date, default: Date.now},
  patient: { type: Schema.Types.ObjectId, ref: "patient", required: true },
  sendBy: {
    type: [String],
    enum: ["email", "sms", "system"],
    lowercase: true,
    required: true,
  },
});

const Notification = model("Notification", notificationSchema, "notifications");
export default Notification;
