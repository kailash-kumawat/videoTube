import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      // one who is subscribing the channel.
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    channel: {
      // User who owns the channel.
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
