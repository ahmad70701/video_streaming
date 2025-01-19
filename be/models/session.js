import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const sessionSchema = Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    sessionID: { type: String, unique:true, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

const Session = model('Session', sessionSchema);

export async function createSession(userId) {
    const sessionID = randomUUID();
    const session = new Session({
        userId: userId,
        sessionID: sessionID,
        expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60), // 1 hour
    });
    const savedSession = await session.save();
    return savedSession.sessionID;
}

export async function deleteSession(sessionID) {
    return await Session.deleteOne({ sessionID });
}

export async function getSession(sessionID) {
    return await Session.findOne({ sessionID });
}


export async function validateSession(sessionID) {
    const session = await getSession(sessionID);
    if (!session) return false;
    if (session.expiresAt < new Date()) {
        await deleteSession(sessionID);
        return false;
    }
    return true;
}

export async function deleteExpiredSessions() { 
    return await Session.deleteMany({ expiresAt: { $lt: new Date() } });
}