import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId, // one who is subscribing
        ref:"User"
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId, // channel to be subscribed
        ref:"User"
    }
},{timestampstrue})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)