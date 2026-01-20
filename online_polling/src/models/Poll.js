import mongoose from 'mongoose';

const { Schema } = mongoose;

const optionSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const pollSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      validate: [(val) => val.length >= 2, 'Poll must have at least two options'],
    },
    type: {
      type: String,
      enum: ['single', 'multiple'],
      default: 'single',
    },
    category: {
      type: String,
      trim: true,
    },
    startAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    allowAnonymous: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

pollSchema.virtual('status').get(function statusGetter() {
  const now = new Date();
  if (now < this.startAt) return 'upcoming';
  if (now > this.expiresAt) return 'closed';
  return 'active';
});

pollSchema.set('toJSON', { virtuals: true });
pollSchema.set('toObject', { virtuals: true });

export const Poll = mongoose.model('Poll', pollSchema);
