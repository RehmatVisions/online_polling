import mongoose from 'mongoose';

const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    poll: {
      type: Schema.Types.ObjectId,
      ref: 'Poll',
      required: true,
    },
    selections: {
      type: [Schema.Types.ObjectId],
      required: true,
      validate: [(val) => val.length > 0, 'Vote must contain at least one selection'],
    },
    voterId: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

voteSchema.index({ poll: 1, voterId: 1 }, { unique: true, partialFilterExpression: { voterId: { $type: 'string' } } });

export const Vote = mongoose.model('Vote', voteSchema);
