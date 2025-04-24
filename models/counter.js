import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // This will be the counter name (e.g., 'userId')
  seq: { type: Number, required: true, default: 0 } // This holds the current sequence value
});

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
