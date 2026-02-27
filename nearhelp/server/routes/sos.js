import express from 'express';
import db from '../db.ts';
import { authenticateToken, AuthRequest } from '../middleware/auth.ts';
import { generateCrisisGuidance } from '../services/ai.ts';
const router = express.Router();
// Create SOS
router.post('/', authenticateToken, async (req, res) => {
    const { type, latitude, longitude, radius, is_anonymous } = req.body;
    const user_id = req.user.id;
    try {
        // Generate AI guidance
        const guidance = await generateCrisisGuidance(type);
        const stmt = db.prepare(`
      INSERT INTO sos_alerts (user_id, type, latitude, longitude, radius, is_anonymous, ai_guidance)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        const result = stmt.run(user_id, type, latitude, longitude, radius, is_anonymous ? 1 : 0, JSON.stringify(guidance));
        const sos_id = result.lastInsertRowid;
        const sos = db.prepare('SELECT * FROM sos_alerts WHERE id = ?').get(sos_id);
        res.status(201).json(sos);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get active SOS alerts
router.get('/active', authenticateToken, (req, res) => {
    try {
        const alerts = db.prepare(`
      SELECT s.*, u.name as user_name, u.skills as user_skills
      FROM sos_alerts s
      JOIN users u ON s.user_id = u.id
      WHERE s.status = 'active'
    `).all();
        res.json(alerts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Resolve SOS
router.post('/:id/resolve', authenticateToken, (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const sos = db.prepare('SELECT * FROM sos_alerts WHERE id = ?').get(id);
        if (!sos)
            return res.status(404).json({ error: 'SOS not found' });
        if (sos.user_id !== user_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        db.prepare("UPDATE sos_alerts SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
        res.json({ message: 'SOS resolved' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=sos.js.map