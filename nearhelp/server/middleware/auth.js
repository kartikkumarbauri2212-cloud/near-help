import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.ts';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.log('[Auth Middleware] No token provided');
        return res.status(401).json({ error: 'Access denied' });
    }
    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('[Auth Middleware] Token verification failed:', err.message);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};
//# sourceMappingURL=auth.js.map