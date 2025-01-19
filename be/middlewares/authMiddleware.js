import { validateSession } from '../models/session.js';

export async function isAuthenticated(req, res, next) {
    try {
        const sessionID = req.cookies.sessionID;
        if (!sessionID) return res.status(401).json('Unauthorized');
        if (!await validateSession(sessionID)) return res.status(401).json('Unauthorized');
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}