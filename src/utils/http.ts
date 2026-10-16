import { fg, bg, reset, warn, info, error, debug } from "./console";

interface FetchOptions {
  method: string;
  headers?: Record<string, string>;
  maxRetries?: number;
  delay?: number;
  exponential?: boolean;
  jitter?: boolean;
}

export interface HttpResponseError extends Error {
  status: number;
}

export function hasErrorStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error && typeof (error as Record<string, unknown>).status === 'number';
}

export function shouldRetryStatus(status: number): boolean {
  return status >= 500 || status === 429;
}

export async function fetchResource<T>(url: string, options?: FetchOptions): Promise<T> {
  const { method = 'GET', maxRetries = 3, delay = 1000, exponential = false, jitter = false } = options || {};

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try
    {
      const init: RequestInit = { method, headers: options?.headers };
      const response = await fetch(url, init);

      if (shouldRetryStatus(response.status) && attempt < maxRetries) {
        throw Object.assign(new Error(`HTTP Error: ${response.status}`), { status: response.status });
      }

      debug(`Successfully loaded resource from '${url}'.`);

      return response.json() as Promise<T>;
    }
    catch (error) {
      lastError = error;

      // if we received a response with a status code, check if we should retry
      if (hasErrorStatus(error)) {
        // do not retry for filtered-out status codes (e.g., 400, 401, 404)
        if (!shouldRetryStatus(error.status)) {
          throw error;
        }
      }

      // if we have exhausted all attempts, stop trying
      if (attempt >= maxRetries) break;

      // calculate backoff delay
      let nextDelay = exponential ? delay * Math.pow(2, attempt) : delay;

      // apply jitter (plus or minus up to 20% of the calculated window)
      if (jitter) {
        const randomness = nextDelay * 0.2;
        nextDelay += (Math.random() * 2 - 1) * randomness;
      }

      warn(`Attempt ${attempt + 1} failed. Retrying in ${fg.brightCyan}${Math.round(nextDelay)}ms${reset}...`);

      // wait before the next attempt
      await new Promise((resolve) => setTimeout(resolve, nextDelay));
    }
  }

  throw lastError;
}
