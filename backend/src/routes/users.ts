import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                role: true,
                profilePicture: true,
                createdAt: true
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

export default router;
