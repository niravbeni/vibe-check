import { Router } from 'express';
import prisma from '../../lib/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    console.log('Resetting all votes...');
    
    // Reset all prompts at once
    await prisma.prompt.updateMany({
      data: {
        goodVotes: 0,
        okVotes: 0,
        badVotes: 0,
        totalVotes: 0,
        goodPercentage: 0,
        okPercentage: 0,
        badPercentage: 0
      }
    });
    
    console.log('All votes have been reset');
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting votes:', error);
    res.status(500).json({ error: 'Failed to reset votes' });
  }
});

export default router; 