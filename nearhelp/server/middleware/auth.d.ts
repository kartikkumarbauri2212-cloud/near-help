import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => any;
//# sourceMappingURL=auth.d.ts.map