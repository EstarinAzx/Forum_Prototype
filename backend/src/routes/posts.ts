import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// List posts (Feed or Community)
router.get('/', async (req: Request, res: Response) => {
    try {
        const { communityId } = req.query;

        const where = communityId ? { communityId: communityId as string } : {};

        const posts = await prisma.post.findMany({
            where,
            include: {
                author: {
                    select: { id: true, username: true, name: true },
                },
                community: {
                    select: { id: true, name: true },
                },
                _count: {
                    select: { comments: true, upvotes: true },
                },
                upvotes: {
                    where: {
                        userId: req.userId // This won't work directly in findMany without authenticated user, handled in frontend or separate check
                    },
                    select: {
                        userId: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Transform to add isUpvoted if user is logged in (need to pass token optionally to this route or handle differently)
        // For prototype, we'll just return the raw data
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Create post
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { title, content, communityId } = req.body;

        if (!title || !content || !communityId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                communityId,
                authorId: req.userId!,
            },
            include: {
                author: {
                    select: { id: true, username: true, name: true }
                },
                community: true
            }
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Get single post
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, username: true, name: true },
                },
                community: true,
                _count: {
                    select: { comments: true, upvotes: true },
                },
            },
        });

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// Toggle Upvote
router.post('/:id/upvote', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId!;

        const existingUpvote = await prisma.postUpvote.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId: id
                }
            }
        });

        if (existingUpvote) {
            await prisma.postUpvote.delete({
                where: { id: existingUpvote.id }
            });
            res.json({ upvoted: false });
        } else {
            await prisma.postUpvote.create({
                data: {
                    userId,
                    postId: id
                }
            });
            res.json({ upvoted: true });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle upvote' });
    }
});

export default router;
