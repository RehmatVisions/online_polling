import mongoose from 'mongoose';
import { Poll } from '../models/Poll.js';
import { Vote } from '../models/Vote.js';
import { getLifecycleQuery } from '../utils/pollStatus.js';

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

export const pollService = {
  async getPollById(pollId) {
    return Poll.findById(pollId);
  },

  async listPolls({ status, category }) {
    const filters = getLifecycleQuery(status);
    if (category) {
      filters.category = new RegExp(`^${category}$`, 'i');
    }
    return Poll.find(filters).sort({ startAt: 1 });
  },

  async getPollResults(pollId) {
    const poll = await Poll.findById(pollId).lean();
    if (!poll) return null;

    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

    const options = poll.options.map((option) => ({
      _id: option._id,
      label: option.label,
      votes: option.votes,
      percentage: totalVotes > 0 ? Number(((option.votes / totalVotes) * 100).toFixed(2)) : 0,
    }));

    return {
      pollId: poll._id,
      question: poll.question,
      status: poll.status,
      totalVotes,
      options,
      expiresAt: poll.expiresAt,
      type: poll.type,
      category: poll.category,
    };
  },

  async submitVote({ pollId, selections, voterId }) {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      const error = new Error('Poll not found');
      error.status = 404;
      throw error;
    }

    const now = new Date();
    if (now < poll.startAt) {
      const error = new Error('Poll has not started yet');
      error.status = 400;
      throw error;
    }
    if (now > poll.expiresAt) {
      const error = new Error('Poll is closed');
      error.status = 400;
      throw error;
    }

    if (!Array.isArray(selections) || selections.length === 0) {
      const error = new Error('At least one selection is required');
      error.status = 400;
      throw error;
    }

    const uniqueSelections = [...new Set(selections.map((id) => id.toString()))];

    if (poll.type === 'single' && uniqueSelections.length !== 1) {
      const error = new Error('Single-choice polls must have exactly one selection');
      error.status = 400;
      throw error;
    }

    const validOptionIds = new Set(poll.options.map((opt) => opt._id.toString()));
    uniqueSelections.forEach((selection) => {
      if (!validOptionIds.has(selection)) {
        const error = new Error('Invalid option selected');
        error.status = 400;
        throw error;
      }
    });

    if (voterId) {
      const existing = await Vote.findOne({ poll: poll._id, voterId });
      if (existing) {
        const error = new Error('You have already voted in this poll');
        error.status = 409;
        throw error;
      }
    }

    const vote = await Vote.create({
      poll: poll._id,
      selections: uniqueSelections.map((id) => toObjectId(id)),
      voterId,
    });

    poll.options = poll.options.map((option) => {
      const optionIdStr = option._id.toString();
      if (uniqueSelections.includes(optionIdStr)) {
        option.votes += 1;
      }
      return option;
    });
    await poll.save();

    return { poll, vote };
  },
};
