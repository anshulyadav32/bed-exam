import { prisma } from "../lib/prisma.js";

/**
 * Service for handling subjects and their details.
 */
export const subjectService = {
    /**
     * Get all subjects with basic info.
     */
    async getAllSubjects() {
        return prisma.subject.findMany({
            select: { id: true, name: true, description: true, color: true },
            orderBy: { id: "asc" }
        });
    },

    /**
     * Get subject details by ID.
     */
    async getSubjectById(id) {
        const subject = await prisma.subject.findUnique({
            where: { id: id.toLowerCase() },
            include: {
                sections: {
                    orderBy: { position: "asc" },
                    select: { heading: true, notesLink: true, images: true, topics: true, explanation: true }
                },
                tests: {
                    orderBy: { id: "asc" },
                    select: { id: true, name: true, duration: true, questions: true }
                }
            }
        });

        if (!subject) return null;

        const { examTotalQuestions, examType, examDifficulty, sections, tests, ...rest } = subject;
        
        return {
            ...rest,
            examPattern: { totalQuestions: examTotalQuestions, type: examType, difficulty: examDifficulty },
            sections,
            tests
        };
    }
};
