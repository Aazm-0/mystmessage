import mongoose, { Schema, Document } from "mongoose";
// The document helps with type safety...


// An interface only for type safety it actually doesnt make anything
export interface Message extends Document {
    content: string;
    createdAt: Date
}

// messageSchema is a Mongoose Schema that will eventually be used to create documents shaped like Message

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

export interface User extends Document {
    userName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerifierd: boolean,
    isAcceptingMessages: boolean;
    messages: Message[]
}
// We put type here cause to allow Schema to reference this data type when creating Methods,static methods and hooks
const userSchema: Schema<User> = new Schema({
    userName: {
        type: String,
        required: [true, "UserName is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verifyCode is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Veify Code expory is required"],
    },
    isVerifierd: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
})

const User = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)

export default User
// : decalres the type
// as asserts the type saying trust me this is the type