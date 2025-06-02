/**
 * Extracts the problem ID from the current URL
 * @returns The problem ID as a string, or null if not found
 */
export function getProbId(): string | null {
    const url = new URL(window.location.href);
    const query = url.search.substring(1);

    if (/^\d+$/.test(query)) return query;
    if (/^\d+=?$/.test(query)) return query.split("=")[0];

    return null;
} 