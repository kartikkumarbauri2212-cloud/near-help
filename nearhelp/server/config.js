import dotenv from 'dotenv';
dotenv.config();
export const config = {
    JWT_SECRET: process.env.JWT_SECRET || 'nearhelp_secret_key_123',
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};
console.log('--- Environment Configuration Loaded ---');
console.log('JWT_SECRET status:', config.JWT_SECRET ? 'Defined' : 'MISSING');
console.log('NODE_ENV:', config.NODE_ENV);
//# sourceMappingURL=config.js.map