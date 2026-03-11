/**
 * Generates a simple browser fingerprint based on browser features.
 * In a real-world app, you might use a library like FingerprintJS.
 */
export function getBrowserFingerprint(): string {
    if (typeof window === 'undefined') return '';

    const components = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset().toString(),
        window.screen.colorDepth.toString(),
        window.screen.width.toString() + 'x' + window.screen.height.toString(),
    ];

    return btoa(components.join('|'));
}
