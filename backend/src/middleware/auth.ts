import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import prisma from '../lib/db';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userRole?: string;
        }
    }
}

export async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true },
        });

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        req.userId = user.id;
        req.userRole = user.role;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
}
