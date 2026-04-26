import { prisma } from "../lib/prisma.js";

/**
 * Service for handling mock exam scores.
 */
export const scoreService = {
    /**
     * Get recent scores.
     */
    async getRecentScores(limit = 10) {
        return prisma.mockScore.findMany({
            orderBy: { createdAt: "desc" },
            take: limit
        });
    },

    /**
     * Save a new score.
     */
    async saveScore({ candidateName, score, attempted, totalQuestions }) {
        return prisma.mockScore.create({
            data: {
                candidateName: candidateName || "Anonymous",
                score,
                attempted,
                totalQuestions
            }
        });
    }
};
