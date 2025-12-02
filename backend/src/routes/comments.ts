import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get comments for a post
router.get('/post/:postId', async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const comments = await prisma.comment.findMany({
            where: {
                postId,
                parentId: null // Top level comments
            },
            include: {
                author: {
                    select: { id: true, username: true, name: true },
                },
                replies: {
                    include: {
                        author: {
                            select: { id: true, username: true, name: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Create comment
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { content, postId, parentId } = req.body;

        if (!content || !postId) {
            res.status(400).json({ error: 'Content and postId are required' });
            return;
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                parentId,
                authorId: req.userId!,
            },
            include: {
                author: {
                    select: { id: true, username: true, name: true }
                }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

export default router;
