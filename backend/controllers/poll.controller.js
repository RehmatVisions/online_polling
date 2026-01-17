import Poll from "../models/poll.model.js";

// ==================== CREATE POLL ====================
export const createPoll = async (req, res) => {
  try {
    const { question, options, type, category, expirationDate } = req.body;

    // Input validation
    if (!question || !options || !type || !expirationDate) {
      return res.status(400).json({ 
        message: "Missing required fields: question, options, type, expirationDate" 
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        message: "Options must be an array with at least 2 items" 
      });
    }

    if (!["single", "multiple"].includes(type)) {
      return res.status(400).json({ 
        message: "Type must be either 'single' or 'multiple'" 
      });
    }

    // Check if expiration date is in the future
    if (new Date(expirationDate) <= new Date()) {
      return res.status(400).json({ 
        message: "Expiration date must be in the future" 
      });
    }

    // Format options properly
    const formattedOptions = options.map(option => ({
      text: typeof option === 'string' ? option : option.text,
      votes: 0
    }));

    const poll = await Poll.create({
      question,
      options: formattedOptions,
      type,
      category: category || "General",
      expirationDate: new Date(expirationDate),
      createdBy: req.user._id,
    });

    const populatedPoll = await Poll.findById(poll._id).populate("createdBy", "name email");

    res.status(201).json({ 
      message: "Poll created successfully", 
      poll: populatedPoll 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== GET ALL POLLS ====================
export const getPolls = async (req, res) => {
  try {
    const { category, active } = req.query;
    let filter = {};

    // Filter by category if provided
    if (category) {
      filter.category = category;
    }

    // Filter by active polls only if requested
    if (active === 'true') {
      filter.expirationDate = { $gt: new Date() };
    }

    const polls = await Poll.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      message: "Polls fetched successfully",
      count: polls.length,
      polls 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== GET SINGLE POLL ====================
export const getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!poll) return res.status(404).json({ message: "Poll not found" });

    res.status(200).json({ poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== VOTE ON POLL ====================
export const votePoll = async (req, res) => {
  try {
    const { optionIndex, optionIndexes } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (poll.expirationDate < new Date())
      return res.status(400).json({ message: "Poll has expired" });

    // Prevent user from voting twice
    if (poll.voters.includes(req.user._id))
      return res.status(400).json({ message: "You have already voted" });

    // Handle single choice voting
    if (poll.type === "single") {
      if (optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length) {
        return res.status(400).json({ message: "Invalid option index" });
      }
      poll.options[optionIndex].votes += 1;
    }
    
    // Handle multiple choice voting
    else if (poll.type === "multiple") {
      if (!Array.isArray(optionIndexes) || optionIndexes.length === 0) {
        return res.status(400).json({ message: "optionIndexes must be a non-empty array for multiple choice polls" });
      }
      
      // Validate all option indexes
      for (const index of optionIndexes) {
        if (index < 0 || index >= poll.options.length) {
          return res.status(400).json({ message: `Invalid option index: ${index}` });
        }
      }
      
      // Increment votes for selected options
      optionIndexes.forEach(index => {
        poll.options[index].votes += 1;
      });
    }

    poll.voters.push(req.user._id);
    await poll.save();

    const updatedPoll = await Poll.findById(poll._id).populate("createdBy", "name email");

    res.status(200).json({ 
      message: "Vote recorded successfully", 
      poll: updatedPoll 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== DELETE POLL ====================
export const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (poll.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await poll.deleteOne();
    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== GET POLL RESULTS ====================
export const getPollResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate("createdBy", "name email");

    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Calculate total votes
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

    // Calculate percentages
    const resultsWithPercentages = poll.options.map(option => ({
      text: option.text,
      votes: option.votes,
      percentage: totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(2) : 0
    }));

    const pollResults = {
      _id: poll._id,
      question: poll.question,
      type: poll.type,
      category: poll.category,
      expirationDate: poll.expirationDate,
      createdBy: poll.createdBy,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
      totalVotes,
      totalVoters: poll.voters.length,
      isExpired: poll.expirationDate < new Date(),
      options: resultsWithPercentages
    };

    res.status(200).json({ 
      message: "Poll results fetched successfully",
      poll: pollResults 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
