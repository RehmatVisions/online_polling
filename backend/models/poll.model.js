import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },

    options: [
      {
        text: { type: String, required: true },
        votes: { type: Number, default: 0 },
      },
    ],

    type: { type: String, enum: ["single", "multiple"], required: true },

    category: { type: String },

    expirationDate: { type: Date, required: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track who voted
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;
