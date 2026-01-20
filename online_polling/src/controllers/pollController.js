import { StatusCodes } from 'http-status-codes';
import { pollService } from '../services/pollService.js';

export const listPolls = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const polls = await pollService.listPolls({ status, category });
    res.json({ success: true, data: polls });
  } catch (error) {
    next(error);
  }
};

export const getPoll = async (req, res, next) => {
  try {
    const poll = await pollService.getPollById(req.params.pollId);
    if (!poll) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Poll not found' });
    }
    res.json({ success: true, data: poll });
  } catch (error) {
    next(error);
  }
};

export const getPollResults = async (req, res, next) => {
  try {
    const results = await pollService.getPollResults(req.params.pollId);
    if (!results) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Poll not found' });
    }
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const submitVote = async (req, res, next) => {
  try {
    const { selections, voterId } = req.body;
    const { poll, vote } = await pollService.submitVote({
      pollId: req.params.pollId,
      selections,
      voterId,
    });

    const results = await pollService.getPollResults(poll._id);
    req.app.get('io').to(poll._id.toString()).emit('pollUpdated', results);
    req.app.get('io').emit('pollListUpdated');

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        voteId: vote._id,
        pollId: poll._id,
        results,
      },
    });
  } catch (error) {
    next(error);
  }
};
