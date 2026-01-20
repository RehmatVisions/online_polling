import { Router } from 'express';
import { getPoll, getPollResults, listPolls, submitVote } from '../controllers/pollController.js';

const router = Router();

router.get('/', listPolls);
router.get('/:pollId', getPoll);
router.get('/:pollId/results', getPollResults);
router.post('/:pollId/vote', submitVote);

export default router;
