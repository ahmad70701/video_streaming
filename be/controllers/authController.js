import { randomUUID } from "crypto";
import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from "../models/session.js";

export async function login(req, res){
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json('User not found');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json('Invalid credentials');
        const sessionID = await createSession(user._id);
        res.cookie('sessionID', sessionID, { httpOnly: true,});
        res.status(201).json({ message: 'Login successful' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export async function logout(req, res) {
    try {
        await deleteSession(req.cookies.sessionID);
        res.clearCookie('sessionID');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
