/**
 * @fileoverview Proxy service for authenticated outbound HTTP requests.
 * Routes API calls through a configured HTTP proxy with Basic auth.
 */

// ============================================================================
// TYPES
// ============================================================================

/** Proxy configuration derived from environment variables. */
export interface ProxyConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const PROXY_HOST = process.env.EXPO_PUBLIC_PROXY_HOST ?? '';
const PROXY_PORT_RAW = process.env.EXPO_PUBLIC_PROXY_PORT ?? '';
const PROXY_USER = process.env.EXPO_PUBLIC_PROXY_USER ?? '';
const PROXY_PASS = process.env.EXPO_PUBLIC_PROXY_PASS ?? '';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Returns the active proxy configuration, or null if not fully configured.
 */
export function getProxyConfig(): ProxyConfig | null {
  const port = parseInt(PROXY_PORT_RAW, 10);
  if (!PROXY_HOST || !port || !PROXY_USER || !PROXY_PASS) {
    return null;
  }
  return { host: PROXY_HOST, port, username: PROXY_USER, password: PROXY_PASS };
}

/**
 * Encodes credentials to a Base64 string for Basic auth.
 */
function encodeCredentials(username: string, password: string): string {
  const credentials = `${username}:${password}`;
  if (typeof btoa !== 'undefined') {
    return btoa(credentials);
  }
  return Buffer.from(credentials).toString('base64');
}

/**
 * Returns the Proxy-Authorization header value for the configured proxy.
 * Returns an empty object when no proxy is configured.
 */
export function getProxyHeaders(): Record<string, string> {
  const config = getProxyConfig();
  if (!config) {
    return {};
  }
  const encoded = encodeCredentials(config.username, config.password);
  return { 'Proxy-Authorization': `Basic ${encoded}` };
}

// ============================================================================
// FETCH WRAPPER
// ============================================================================

/**
 * Fetch wrapper that injects proxy authentication headers when a proxy is configured.
 * Falls back to a plain fetch when no proxy credentials are present.
 */
export async function proxyFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const proxyHeaders = getProxyHeaders();
  const existingHeaders = (options.headers ?? {}) as Record<string, string>;
  const headers: Record<string, string> = { ...existingHeaders, ...proxyHeaders };
  return fetch(url, { ...options, headers });
}
