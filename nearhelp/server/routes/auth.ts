import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.ts';
import { config } from '../config.ts';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name, skills } = req.body;
  console.log(`[Auth] Register attempt for email: ${email}`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password, name, skills) VALUES (?, ?, ?, ?)');
    const result = stmt.run(email, hashedPassword, name, skills || '');
    
    console.log(`[Auth] User registered successfully with ID: ${result.lastInsertRowid}`);
    res.status(201).json({ id: result.lastInsertRowid, message: 'User registered' });
  } catch (error: any) {
    console.error(`[Auth] Registration error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`[Auth] Login attempt for email: ${email}`);

  try {
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      console.log(`[Auth] Login failed: User not found for email ${email}`);
      return res.status(400).json({ error: 'User not found' });
    }

    console.log(`[Auth] User found: ${user.name} (ID: ${user.id})`);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log(`[Auth] Login failed: Incorrect password for user ${email}`);
      return res.status(400).json({ error: 'Invalid password' });
    }

    console.log(`[Auth] Password verified for user ${email}`);

    if (user.suspended) {
      console.log(`[Auth] Login failed: Account suspended for user ${email}`);
      return res.status(403).json({ error: 'Account suspended' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`[Auth] JWT generated successfully for user ${email}`);
    console.log(`[Auth] Response status: 200 OK`);

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role, 
        skills: user.skills 
      } 
    });
  } catch (error: any) {
    console.error(`[Auth] Login error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

export default router;
