import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    content: {type: String, required: true},
    sender: {type: Schema.Types.ObjectId, ref: "User", required: true},
    chat: {type: Schema.Types.ObjectId, ref: "Chat", required: true},
    isRead: {type: Boolean, default: false},
}, {timestamps: true});

const Message = model("Message", messageSchema, "messages");
export default Message;