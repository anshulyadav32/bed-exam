import { prisma } from "./prisma.js";

const COLORS = {
    info: "\x1b[36m",    // Cyan
    warn: "\x1b[33m",    // Yellow
    error: "\x1b[31m",   // Red
    reset: "\x1b[0m"
};

/**
 * Enhanced logging system.
 * Logs to console with colors and persists critical events to AuditLog table.
 */
class Logger {
    async log(level, action, details = {}) {
        const { userId, resource, metadata, ip, ...rest } = details;
        const timestamp = new Date().toISOString();
        const color = COLORS[level.toLowerCase()] || COLORS.reset;
        
        // 1. Console Logging
        console.log(`${color}[${level.toUpperCase()}]${COLORS.reset} ${timestamp} - ${action}`, rest);

        // 2. Persistent Audit Logging (for high-value actions or errors)
        try {
            if (level === "ERROR" || ["LOGIN", "SIGNUP", "ADMIN_ACTION", "PROFILE_UPDATE"].includes(action)) {
                await prisma.auditLog.create({
                    data: {
                        userId: userId ? Number(userId) : null,
                        action,
                        level,
                        resource: resource || null,
                        metadata: metadata ? JSON.stringify(metadata) : (Object.keys(rest).length ? JSON.stringify(rest) : null),
                        ip: ip || null
                    }
                });
            }
        } catch (err) {
            console.error(`${COLORS.error}[LOGGER_FAILURE]${COLORS.reset} Failed to save audit log:`, err.message);
        }
    }

    info(action, details) { return this.log("INFO", action, details); }
    warn(action, details) { return this.log("WARN", action, details); }
    error(action, details) { return this.log("ERROR", action, details); }
}

export const logger = new Logger();
