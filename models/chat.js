import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    name: String,
    participants: [{type: Schema.Types.ObjectId, ref: "User"}],
}, {timestamps: true});
const Chat = model("Chat", chatSchema, "chat");
export default Chat;