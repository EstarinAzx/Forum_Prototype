import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// List communities
router.get('/', async (req: Request, res: Response) => {
    try {
        const communities = await prisma.community.findMany({
            include: {
                _count: {
                    select: { posts: true },
                },
            },
            orderBy: {
                posts: {
                    _count: 'desc',
                },
            },
        });
        res.json(communities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch communities' });
    }
});

// Create community
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }

        const community = await prisma.community.create({
            data: {
                name,
                description,
                creatorId: req.userId!,
            },
        });

        res.status(201).json(community);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create community' });
    }
});

// Get single community
router.get('/:name', async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const community = await prisma.community.findUnique({
            where: { name },
            include: {
                _count: {
                    select: { posts: true },
                },
            },
        });

        if (!community) {
            res.status(404).json({ error: 'Community not found' });
            return;
        }

        res.json(community);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch community' });
    }
});

export default router;
