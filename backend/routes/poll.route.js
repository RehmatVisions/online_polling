import express from "express";
import {
  createPoll,
  getPolls,
  getPoll,
  votePoll,
  deletePoll,
  getPollResults,
} from "../controllers/poll.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import Poll from "../models/poll.model.js";

const router = express.Router();

// Public route → anyone can view polls
router.get("/", getPolls);

// Get user's own polls (MUST come before /:id route)
router.get("/my-polls", protect, async (req, res) => {
  try {
    const polls = await Poll.find({ createdBy: req.user._id })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      message: "Your polls fetched successfully",
      count: polls.length,
      polls 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get poll results (detailed view) - MUST come before /:id route
router.get("/:id/results", getPollResults);

// Get single poll by ID
router.get("/:id", getPoll);

// Protected routes → only logged-in users can create, vote, delete
router.post("/", protect, createPoll);
router.post("/:id/vote", protect, votePoll);
router.delete("/:id", protect, deletePoll);

export default router;
