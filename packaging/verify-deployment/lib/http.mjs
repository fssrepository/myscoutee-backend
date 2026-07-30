// Read-only HTTP transport for deployment verification.
const DEFAULT_MAX_BODY_BYTES = 8 * 1024 * 1024;

export class SmokeRequestError extends Error {
  constructor(message, details = undefined) {
    super(message);
    this.name = 'SmokeRequestError';
    this.details = details;
  }
}

export function parseRootUrl(value, label = 'deployment URL') {
  const raw = `${value ?? ''}`.trim();
  if (!raw) {
    throw new SmokeRequestError(`${label} is required`);
  }

  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new SmokeRequestError(`${label} must be an absolute HTTP(S) URL`);
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new SmokeRequestError(`${label} must use http:// or https://`);
  }
  if (url.username || url.password) {
    throw new SmokeRequestError(`${label} must not contain credentials`);
  }
  if (url.search || url.hash) {
    throw new SmokeRequestError(`${label} must not contain a query or fragment`);
  }
  if (url.pathname !== '/' && url.pathname !== '') {
    throw new SmokeRequestError(`${label} must point to the deployment origin, without a path`);
  }
  url.pathname = '/';
  return url;
}

export function createHttpClient(options) {
  const baseUrl = options.baseUrl instanceof URL
    ? new URL(options.baseUrl)
    : parseRootUrl(options.baseUrl);
  const timeoutMs = Number(options.timeoutMs ?? 5000);
  const maxBodyBytes = Number(options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES);
  const cache = new Map();

  if (!Number.isFinite(timeoutMs) || timeoutMs < 250 || timeoutMs > 30000) {
    throw new SmokeRequestError('request timeout must be between 250 and 30000 ms');
  }
  if (!Number.isFinite(maxBodyBytes) || maxBodyBytes < 1024) {
    throw new SmokeRequestError('maximum response body size is invalid');
  }

  async function get(path, requestOptions = {}) {
    return request('GET', path, requestOptions);
  }

  async function head(path, requestOptions = {}) {
    return request('HEAD', path, requestOptions);
  }

  async function getCached(path, requestOptions = {}) {
    const url = resolveUrl(baseUrl, path);
    const key = JSON.stringify({
      url: url.toString(),
      redirect: requestOptions.redirect ?? 'follow',
      headers: requestOptions.headers ?? {}
    });
    if (!cache.has(key)) {
      cache.set(key, request('GET', url, requestOptions));
    }
    return cache.get(key);
  }

  async function request(method, path, requestOptions = {}) {
    if (method !== 'GET' && method !== 'HEAD') {
      throw new SmokeRequestError(
        `installed-deployment verification only permits GET/HEAD, got ${method}`
      );
    }

    const url = resolveUrl(baseUrl, path);
    const controller = new AbortController();
    const requestTimeoutMs = Number(requestOptions.timeoutMs ?? timeoutMs);
    const timer = setTimeout(() => controller.abort(), requestTimeoutMs);
    const startedAt = performance.now();
    let response;

    try {
      const fetched = await fetchWithSafeRedirects(url, {
        method,
        cache: 'no-store',
        headers: {
          Accept: 'application/json, text/html;q=0.9, text/plain;q=0.8, */*;q=0.7',
          'Cache-Control': 'no-cache',
          'User-Agent': 'myscoutee-installed-deployment-verifier/1',
          ...(requestOptions.headers ?? {})
        },
        signal: controller.signal
      }, requestOptions.redirect ?? 'follow');
      response = fetched.response;

      const bytes = await readBoundedBody(
        response,
        Number(requestOptions.maxBodyBytes ?? maxBodyBytes)
      );
      const contentType = `${response.headers.get('content-type') ?? ''}`.toLowerCase();
      const text = shouldDecodeText(contentType)
        ? new TextDecoder().decode(bytes)
        : '';
      const parsed = parseJson(text, contentType);

      return {
        method,
        requestUrl: url.toString(),
        responseUrl: response.url,
        redirected: fetched.redirects.length > 0,
        redirects: fetched.redirects,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        bytes,
        text,
        data: parsed.data,
        jsonError: parsed.error,
        durationMs: performance.now() - startedAt
      };
    } catch (error) {
      if (error instanceof SmokeRequestError) {
        throw error;
      }
      const causeCode = error?.cause?.code ? ` (${error.cause.code})` : '';
      const reason = error?.name === 'AbortError'
        ? `timed out after ${requestTimeoutMs} ms`
        : `${error?.message ?? error}${causeCode}`;
      throw new SmokeRequestError(`${method} ${url} failed: ${reason}`, {
        requestUrl: url.toString()
      });
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    baseUrl,
    get,
    getCached,
    head
  };
}

function resolveUrl(baseUrl, value) {
  if (value instanceof URL) {
    return new URL(value);
  }
  const raw = `${value ?? ''}`;
  return /^https?:\/\//i.test(raw)
    ? new URL(raw)
    : new URL(raw.startsWith('/') ? raw : `/${raw}`, baseUrl);
}

async function readBoundedBody(response, maxBytes) {
  if (!response.body) {
    return new Uint8Array();
  }

  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new SmokeRequestError(
          `GET ${response.url} exceeded the ${maxBytes}-byte response limit`
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

async function fetchWithSafeRedirects(initialUrl, init, redirectMode) {
  if (redirectMode !== 'follow' && redirectMode !== 'manual') {
    throw new SmokeRequestError(`unsupported redirect mode: ${redirectMode}`);
  }
  if (redirectMode === 'manual') {
    return {
      response: await fetch(initialUrl, { ...init, redirect: 'manual' }),
      redirects: []
    };
  }

  const initial = new URL(initialUrl);
  const requestLabel = `${init.method ?? 'GET'} ${initial}`;
  const expectedHostname = initial.hostname.toLowerCase();
  let current = initial;
  let secureOrigin = current.protocol === 'https:' ? current.origin : '';
  const redirects = [];

  while (true) {
    const response = await fetch(current, { ...init, redirect: 'manual' });
    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return { response, redirects };
    }

    const location = response.headers.get('location');
    if (!location) {
      return { response, redirects };
    }
    if (redirects.length >= 5) {
      await cancelBody(response);
      throw new SmokeRequestError(`${requestLabel} exceeded five redirects`, {
        redirects
      });
    }

    let next;
    try {
      next = new URL(location, current);
    } catch {
      await cancelBody(response);
      throw new SmokeRequestError(`${requestLabel} returned an invalid redirect Location`, {
        location
      });
    }
    try {
      validateRedirectHop({
        requestLabel,
        current,
        next,
        expectedHostname,
        secureOrigin
      });
    } catch (error) {
      await cancelBody(response);
      throw error;
    }
    redirects.push({
      status: response.status,
      from: current.toString(),
      to: next.toString()
    });
    await cancelBody(response);
    if (!secureOrigin && next.protocol === 'https:') {
      secureOrigin = next.origin;
    }
    current = next;
  }
}

function validateRedirectHop(options) {
  const {
    requestLabel,
    current,
    next,
    expectedHostname,
    secureOrigin
  } = options;
  if (next.protocol !== 'http:' && next.protocol !== 'https:') {
    throw new SmokeRequestError(`${requestLabel} refused a non-HTTP redirect`, {
      from: current.toString(),
      to: next.toString()
    });
  }
  if (next.username || next.password) {
    throw new SmokeRequestError(`${requestLabel} refused a redirect containing credentials`, {
      from: current.toString(),
      to: next.toString()
    });
  }
  if (next.hostname.toLowerCase() !== expectedHostname) {
    throw new SmokeRequestError(`${requestLabel} refused a cross-host redirect`, {
      from: current.toString(),
      to: next.toString()
    });
  }
  if (current.protocol === 'https:' && next.protocol !== 'https:') {
    throw new SmokeRequestError(`${requestLabel} refused an HTTPS downgrade`, {
      from: current.toString(),
      to: next.toString()
    });
  }
  if (secureOrigin && next.origin !== secureOrigin) {
    throw new SmokeRequestError(`${requestLabel} refused an HTTPS origin change`, {
      from: current.toString(),
      to: next.toString(),
      secureOrigin
    });
  }
  if (
    current.protocol === 'http:'
    && next.protocol === 'http:'
    && next.origin !== current.origin
  ) {
    throw new SmokeRequestError(`${requestLabel} refused an HTTP origin change`, {
      from: current.toString(),
      to: next.toString()
    });
  }
}

async function cancelBody(response) {
  if (response.body) {
    await response.body.cancel();
  }
}

function shouldDecodeText(contentType) {
  return !contentType
    || contentType.startsWith('text/')
    || contentType.includes('json')
    || contentType.includes('javascript')
    || contentType.includes('xml')
    || contentType.includes('svg')
    || contentType.includes('manifest');
}

function parseJson(text, contentType) {
  const trimmed = text.trim();
  const looksLikeJson = contentType.includes('json')
    || contentType.includes('manifest')
    || (trimmed.startsWith('{') && trimmed.endsWith('}'))
    || (trimmed.startsWith('[') && trimmed.endsWith(']'));
  if (!looksLikeJson || !trimmed) {
    return { data: undefined, error: null };
  }
  try {
    return { data: JSON.parse(trimmed), error: null };
  } catch (error) {
    return { data: undefined, error };
  }
}
