import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

interface TokenPayload {
    userId: string;
}

export function generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
}

export function generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
}

export function generateTokenPair(userId: string) {
    return {
        accessToken: generateAccessToken(userId),
        refreshToken: generateRefreshToken(userId),
    };
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

export function getRefreshTokenExpiry(): Date {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
}
