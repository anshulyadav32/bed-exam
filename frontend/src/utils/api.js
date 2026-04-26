/**
 * Shared fetch/response utilities used across hooks and components.
 */

/**
 * Safely parse a JSON response, returning null if the body is not JSON or
 * cannot be parsed (e.g. empty 204 response, HTML error page).
 * @param {Response} response
 * @returns {Promise<unknown>}
 */
export async function readJsonSafely(response) {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    try {
        return await response.json();
    } catch {
        return null;
    }
}

/**
 * Fetch wrapper that always sends credentials (cookies) and sets a JSON
 * Content-Type on non-GET requests. Returns `{ data, response }`.
 * @param {string} url
 * @param {{ method?: string, headers?: Record<string, string>, body?: unknown }} [options]
 * @returns {Promise<{ data: unknown, response: Response }>}
 */
export async function apiFetch(url, options = {}) {
    const { method = "GET", headers = {}, body } = options;
    const isGet = method.toUpperCase() === "GET";

    const response = await fetch(url, {
        method,
        headers: {
            ...(isGet ? {} : { "Content-Type": "application/json" }),
            ...headers
        },
        credentials: "include",
        cache: "no-store",
        ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    });

    const data = await readJsonSafely(response);
    return { data, response };
}
