import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import { hashPassword, verifyPassword } from '../lib/password';
import { generateTokenPair, verifyToken, getRefreshTokenExpiry, generateAccessToken } from '../lib/jwt';

const router = Router();

// Signup
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { email, password, name, username } = req.body;

        if (!email || !password || !name) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                username,
            },
        });

        const { accessToken, refreshToken } = generateTokenPair(user.id);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: getRefreshTokenExpiry(),
            },
        });

        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const validPassword = await verifyPassword(password, user.password);

        if (!validPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const { accessToken, refreshToken } = generateTokenPair(user.id);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: getRefreshTokenExpiry(),
            },
        });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                role: user.role,
                profilePicture: user.profilePicture,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Refresh Token
router.post('/refresh-token', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token required' });
            return;
        }

        const decoded = verifyToken(refreshToken);

        if (!decoded) {
            res.status(401).json({ error: 'Invalid refresh token' });
            return;
        }

        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            res.status(401).json({ error: 'Invalid or expired refresh token' });
            return;
        }

        const newAccessToken = generateAccessToken(decoded.userId);

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
});

export default router;
