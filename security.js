/**
 * Market Pulse Security Module
 * 
 * Implements OWASP best practices for client-side security:
 * - Rate limiting for API calls
 * - Input validation and sanitization
 * - XSS protection
 * 
 * @version 1.0.0
 */

// =============================================================================
// RATE LIMITER
// Tracks API call frequency and enforces limits with graceful degradation
// =============================================================================

const RateLimiter = {
    // Configuration: requests per window (in ms)
    limits: {
        'coingecko': { maxRequests: 10, windowMs: 60000 },      // 10/min (CoinGecko free tier)
        'rss2json': { maxRequests: 20, windowMs: 60000 },       // 20/min
        'exchangerate': { maxRequests: 5, windowMs: 60000 },    // 5/min
        'global': { maxRequests: 50, windowMs: 60000 }          // 50/min total
    },

    // Storage key prefix
    STORAGE_KEY: 'mp_rate_limit_',

    /**
     * Get rate limit data from localStorage
     * @param {string} endpoint - Endpoint identifier
     * @returns {Object} Rate limit state
     */
    _getState(endpoint) {
        try {
            const key = this.STORAGE_KEY + endpoint;
            const data = localStorage.getItem(key);
            if (!data) return { requests: [], backoffUntil: 0 };
            return JSON.parse(data);
        } catch (e) {
            console.warn('RateLimiter: localStorage error', e);
            return { requests: [], backoffUntil: 0 };
        }
    },

    /**
     * Save rate limit data to localStorage
     * @param {string} endpoint - Endpoint identifier
     * @param {Object} state - Rate limit state
     */
    _setState(endpoint, state) {
        try {
            const key = this.STORAGE_KEY + endpoint;
            localStorage.setItem(key, JSON.stringify(state));
        } catch (e) {
            console.warn('RateLimiter: localStorage write error', e);
        }
    },

    /**
     * Check if request is allowed and track it
     * @param {string} endpoint - Endpoint identifier (coingecko, rss2json, exchangerate)
     * @returns {Object} { allowed: boolean, retryAfter: number (seconds), message: string }
     */
    checkLimit(endpoint) {
        const now = Date.now();
        const config = this.limits[endpoint] || this.limits.global;
        const state = this._getState(endpoint);
        const globalState = this._getState('global');

        // Check backoff period (exponential backoff after repeated failures)
        if (state.backoffUntil > now) {
            const retryAfter = Math.ceil((state.backoffUntil - now) / 1000);
            return {
                allowed: false,
                retryAfter,
                message: `Rate limit exceeded. Please wait ${retryAfter} seconds.`
            };
        }

        // Clean old requests outside the window
        const windowStart = now - config.windowMs;
        state.requests = state.requests.filter(ts => ts > windowStart);
        globalState.requests = globalState.requests.filter(ts => ts > windowStart);

        // Check endpoint limit
        if (state.requests.length >= config.maxRequests) {
            // Apply exponential backoff
            const backoffMs = Math.min(30000, 1000 * Math.pow(2, state.backoffCount || 0));
            state.backoffUntil = now + backoffMs;
            state.backoffCount = (state.backoffCount || 0) + 1;
            this._setState(endpoint, state);

            const retryAfter = Math.ceil(backoffMs / 1000);
            return {
                allowed: false,
                retryAfter,
                message: `Too many requests to ${endpoint}. Please wait ${retryAfter} seconds.`
            };
        }

        // Check global limit
        if (globalState.requests.length >= this.limits.global.maxRequests) {
            return {
                allowed: false,
                retryAfter: 10,
                message: 'Global rate limit reached. Please slow down.'
            };
        }

        // Request allowed - track it
        state.requests.push(now);
        state.backoffCount = 0; // Reset backoff on success
        globalState.requests.push(now);

        this._setState(endpoint, state);
        this._setState('global', globalState);

        return { allowed: true, retryAfter: 0, message: '' };
    },

    /**
     * Reset rate limits (useful for testing or user action)
     * @param {string} endpoint - Optional specific endpoint, or all if omitted
     */
    reset(endpoint) {
        if (endpoint) {
            localStorage.removeItem(this.STORAGE_KEY + endpoint);
        } else {
            Object.keys(this.limits).forEach(ep => {
                localStorage.removeItem(this.STORAGE_KEY + ep);
            });
        }
    }
};


// =============================================================================
// INPUT VALIDATOR
// Schema-based validation with type checks and length limits
// =============================================================================

const InputValidator = {
    // Validation schemas
    schemas: {
        search: {
            type: 'string',
            maxLength: 100,
            minLength: 0,
            // Allow alphanumeric, spaces, common punctuation, currency symbols
            pattern: /^[a-zA-Z0-9\s.,!?$€£¥%&@#-]*$/,
            trim: true
        },
        assetId: {
            type: 'string',
            maxLength: 20,
            pattern: /^[A-Z0-9-]+$/,  // Asset IDs are uppercase alphanumeric
            trim: true
        }
    },

    /**
     * Validate input against a schema
     * @param {*} input - Input value to validate
     * @param {string} schemaName - Name of schema to validate against
     * @returns {Object} { valid: boolean, value: any, errors: string[] }
     */
    validate(input, schemaName) {
        const schema = this.schemas[schemaName];
        if (!schema) {
            console.error(`InputValidator: Unknown schema "${schemaName}"`);
            return { valid: false, value: null, errors: ['Unknown validation schema'] };
        }

        const errors = [];
        let value = input;

        // Type check
        if (typeof value !== schema.type) {
            errors.push(`Expected ${schema.type}, got ${typeof value}`);
            return { valid: false, value: null, errors };
        }

        // Trim if string
        if (schema.trim && typeof value === 'string') {
            value = value.trim();
        }

        // Length checks
        if (schema.maxLength !== undefined && value.length > schema.maxLength) {
            value = value.substring(0, schema.maxLength);
            errors.push(`Input truncated to ${schema.maxLength} characters`);
        }

        if (schema.minLength !== undefined && value.length < schema.minLength) {
            errors.push(`Input must be at least ${schema.minLength} characters`);
            return { valid: false, value, errors };
        }

        // Pattern check - sanitize invalid characters instead of rejecting
        if (schema.pattern && !schema.pattern.test(value)) {
            // Remove invalid characters
            const originalValue = value;
            value = value.split('').filter(char => schema.pattern.test(char)).join('');
            if (value !== originalValue) {
                errors.push('Invalid characters removed');
            }
        }

        return {
            valid: errors.length === 0 || errors.every(e => e.includes('truncated') || e.includes('removed')),
            value,
            errors
        };
    },

    /**
     * Quick validation check without detailed errors
     * @param {*} input - Input value
     * @param {string} schemaName - Schema name
     * @returns {boolean} True if valid
     */
    isValid(input, schemaName) {
        return this.validate(input, schemaName).valid;
    }
};


// =============================================================================
// XSS SANITIZER
// Prevents cross-site scripting attacks in user-generated or external content
// =============================================================================

const XSSSanitizer = {
    /**
     * HTML entity encoding map
     */
    entityMap: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    },

    /**
     * Encode HTML entities to prevent XSS
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"'`=/]/g, char => this.entityMap[char]);
    },

    /**
     * Remove all HTML tags from string
     * @param {string} str - String to strip
     * @returns {string} Plain text string
     */
    stripTags(str) {
        if (typeof str !== 'string') return '';
        // First decode any HTML entities that might hide tags
        const decoded = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        // Remove all tags
        return decoded.replace(/<[^>]*>/g, '');
    },

    /**
     * Sanitize external content (like RSS feeds) for safe display
     * Strips dangerous tags, keeps safe text
     * @param {string} html - HTML content to sanitize
     * @returns {string} Safe HTML string
     */
    sanitizeExternalContent(html) {
        if (typeof html !== 'string') return '';

        // Remove script tags and their content
        let safe = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        // Remove event handlers (onclick, onerror, etc.)
        safe = safe.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
        safe = safe.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

        // Remove javascript: URLs
        safe = safe.replace(/javascript\s*:/gi, '');

        // Remove data: URLs (can contain scripts)
        safe = safe.replace(/data\s*:/gi, '');

        // Remove style tags (can contain expressions)
        safe = safe.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

        // Remove iframe, object, embed, form tags
        safe = safe.replace(/<(iframe|object|embed|form|base|link|meta)\b[^>]*>/gi, '');

        // Now strip all remaining tags for plain text
        return this.stripTags(safe);
    },

    /**
     * Sanitize URL to prevent javascript: and data: protocols
     * @param {string} url - URL to validate
     * @returns {string} Safe URL or empty string
     */
    sanitizeUrl(url) {
        if (typeof url !== 'string') return '';
        const trimmed = url.trim().toLowerCase();

        // Block dangerous protocols
        if (trimmed.startsWith('javascript:') ||
            trimmed.startsWith('data:') ||
            trimmed.startsWith('vbscript:')) {
            console.warn('XSSSanitizer: Blocked dangerous URL protocol');
            return '';
        }

        // Allow http, https, and relative URLs
        if (trimmed.startsWith('http://') ||
            trimmed.startsWith('https://') ||
            trimmed.startsWith('/') ||
            trimmed.startsWith('#') ||
            trimmed.startsWith('./')) {
            return url;
        }

        // Default: treat as relative URL
        return url;
    }
};


// =============================================================================
// SECURITY UTILITIES
// Helper functions for common security operations
// =============================================================================

const SecurityUtils = {
    /**
     * Generate a simple nonce for CSP (if needed dynamically)
     * @returns {string} Random nonce string
     */
    generateNonce() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Check if running in a secure context (HTTPS)
     * @returns {boolean} True if secure
     */
    isSecureContext() {
        return window.isSecureContext || location.protocol === 'https:';
    },

    /**
     * Show security warning toast (integrates with existing toast system)
     * @param {string} message - Warning message
     */
    showSecurityWarning(message) {
        // Use existing toast system if available
        if (typeof showToast === 'function') {
            showToast('⚠️ ' + message, 'warning');
        } else {
            console.warn('Security Warning:', message);
        }
    }
};


// =============================================================================
// FETCH WRAPPER
// Wraps fetch with rate limiting and error handling
// =============================================================================

const SecureFetch = {
    /**
     * Make a rate-limited fetch request
     * @param {string} url - URL to fetch
     * @param {string} endpoint - Endpoint identifier for rate limiting
     * @param {Object} options - Fetch options
     * @returns {Promise<Response|null>} Response or null if rate limited
     */
    async fetch(url, endpoint, options = {}) {
        // Check rate limit
        const limitCheck = RateLimiter.checkLimit(endpoint);

        if (!limitCheck.allowed) {
            SecurityUtils.showSecurityWarning(limitCheck.message);
            // Return a mock response that indicates rate limiting
            return {
                ok: false,
                status: 429,
                statusText: 'Too Many Requests',
                headers: new Headers({
                    'Retry-After': limitCheck.retryAfter.toString()
                }),
                json: async () => ({ error: 'Rate limited', retryAfter: limitCheck.retryAfter }),
                text: async () => 'Rate limited'
            };
        }

        try {
            const response = await fetch(url, {
                ...options,
                // Add security headers
                headers: {
                    ...options.headers,
                    'Accept': 'application/json'
                }
            });
            return response;
        } catch (error) {
            console.error(`SecureFetch: Error fetching ${endpoint}:`, error);
            throw error;
        }
    }
};


// =============================================================================
// EXPORTS (for browser global scope)
// =============================================================================

// Make available globally
window.RateLimiter = RateLimiter;
window.InputValidator = InputValidator;
window.XSSSanitizer = XSSSanitizer;
window.SecurityUtils = SecurityUtils;
window.SecureFetch = SecureFetch;

// Log security module loaded
console.log('%c🔒 Market Pulse Security Module Loaded', 'color: #22c55e; font-weight: bold;');
