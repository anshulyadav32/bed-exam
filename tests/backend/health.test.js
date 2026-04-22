import { beforeEach, describe, expect, it, vi } from 'vitest';

const { prisma, ensureStarted } = vi.hoisted(() => ({
  prisma: {
    $queryRaw: vi.fn(),
    subject: {
      findMany: vi.fn()
    }
  },
  ensureStarted: vi.fn()
}));

vi.mock('../../backend/lib/prisma.js', () => ({ prisma }));
vi.mock('../../backend/lib/startup.js', () => ({ ensureStarted }));

import { GET as getHealth } from '../../backend/app/api/health/route.js';
import { GET as getSubjects } from '../../backend/app/api/subjects/route.js';

describe('Backend API Route Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('health check endpoint should be reachable', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

    const response = await getHealth();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('subjects endpoint should return an array', async () => {
    prisma.subject.findMany.mockResolvedValueOnce([
      { id: 1, name: 'Teaching Aptitude', description: 'Practice set', color: '#123456' }
    ]);

    const response = await getSubjects();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(1);
    expect(ensureStarted).toHaveBeenCalledTimes(1);
    expect(prisma.subject.findMany).toHaveBeenCalledTimes(1);
  });
});
