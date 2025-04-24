import { Schema, model } from "mongoose";

const treatmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    dentist: { type: Schema.Types.ObjectId, ref: "dentist", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "patient", required: true },
  },
  { timestamps: true }
);

treatmentSchema.methods.updateTreatment = async function (updates) {
  try {
    const treatment = await Treatment.findById(this._id);
    if (!treatment) throw new Error("Treatment not found");
    this.set(updates);
    const updatedTreatment = await this.save();
    return updatedTreatment;
  } catch (err) {
    console.error(err);
    throw new Error("Error updating the treatment");
  }
};

const Treatment = model("Treatment", treatmentSchema, "treatments");

export default Treatment;
