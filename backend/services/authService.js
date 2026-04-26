import { prisma } from "../lib/prisma.js";
import { verifyPassword, hashPassword } from "../lib/auth.js";
import { createTokenPair } from "../lib/session.js";

/**
 * Service for handling user authentication and registration.
 */
export const authService = {
    /**
     * Authenticate a user by email or username.
     */
    async login(emailOrUsername, password) {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ]
            },
            select: { id: true, name: true, email: true, username: true, passwordHash: true, role: true }
        });

        if (!user || !(await verifyPassword(password, user.passwordHash))) {
            return null;
        }

        const { accessToken, refreshToken } = await createTokenPair(user.id, {
            name: user.name, email: user.email, username: user.username, role: user.role
        });

        return {
            user: { id: user.id, name: user.name, email: user.email, username: user.username, role: user.role },
            accessToken,
            refreshToken
        };
    },

    /**
     * Register a new user.
     */
    async signup({ name, email, username, password }) {
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: { name, email, username, passwordHash },
            select: { id: true, name: true, email: true, username: true, role: true }
        });

        const { accessToken, refreshToken } = await createTokenPair(user.id, {
            name: user.name, email: user.email, username: user.username, role: user.role
        });

        return {
            user,
            accessToken,
            refreshToken
        };
    },

    /**
     * Update user profile.
     */
    async updateProfile(userId, { name, email, username, currentPassword, newPassword }) {
        const existing = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, passwordHash: true }
        });

        if (!existing) return { error: "User not found", status: 404 };

        const updateData = { name, email, username };
        if (currentPassword || newPassword) {
            const matched = await verifyPassword(currentPassword, existing.passwordHash);
            if (!matched) return { error: "Current password is incorrect", status: 401 };
            updateData.passwordHash = await hashPassword(newPassword);
        }

        const updatedUser = await prisma.user.update({
            where: { id: existing.id },
            data: updateData,
            select: { id: true, name: true, email: true, username: true, role: true }
        });

        return { user: updatedUser };
    }
};
