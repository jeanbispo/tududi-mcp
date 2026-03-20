export class TududiApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown,
  ) {
    super(`Tududi API error ${status}: ${statusText}`);
    this.name = 'TududiApiError';
  }
}

export type TududiQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null>;

export type TududiQueryParams = Record<string, TududiQueryValue>;

type TududiHttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const API_URL_ENV = 'Tududi-Api-Url';
const API_TOKEN_ENV = 'Bearer Api Token';

interface TududiRequestOptions {
  params?: TududiQueryParams;
  body?: unknown;
}

export class TududiClient {
  constructor(
    private readonly configuredBaseUrl?: string,
    private readonly configuredApiToken?: string,
  ) {}

  private get baseUrl(): string {
    const baseUrl = (this.configuredBaseUrl || '').trim();

    if (!baseUrl) {
      throw new Error(`${API_URL_ENV} is required.`);
    }

    try {
      const normalizedBaseUrl = new URL(baseUrl).toString();
      return normalizedBaseUrl.replace(/\/$/, '');
    } catch {
      throw new Error(`${API_URL_ENV} must be a valid absolute URL.`);
    }
  }

  private get apiToken(): string {
    const apiToken = (this.configuredApiToken || '').trim();

    if (!apiToken) {
      throw new Error(`${API_TOKEN_ENV} is required.`);
    }

    return apiToken;
  }

  private get authorizationHeader(): string {
    return /^Bearer\s+/i.test(this.apiToken)
      ? this.apiToken
      : `Bearer ${this.apiToken}`;
  }

  async get<T>(path: string, params?: TududiQueryParams): Promise<T> {
    return this.request<T>('GET', path, { params });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, { body });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, { body });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }

  private buildUrl(path: string, params?: TududiQueryParams): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(normalizedPath, `${this.baseUrl}/`);

    if (!params) {
      return url.toString();
    }

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          url.searchParams.append(key, String(item));
        }

        continue;
      }

      url.searchParams.append(key, String(value));
    }

    return url.toString();
  }

  private async request<T>(
    method: TududiHttpMethod,
    path: string,
    options: TududiRequestOptions = {},
  ): Promise<T> {
    const response = await fetch(this.buildUrl(path, options.params), {
      method,
      headers: {
        Authorization: this.authorizationHeader,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return undefined as T;
    }

    const body = await this.parseResponseBody(response);

    if (!response.ok) {
      throw new TududiApiError(response.status, response.statusText, body);
    }

    return body as T;
  }

  private async parseResponseBody(response: Response): Promise<unknown> {
    const text = await response.text();

    if (text === '') {
      return undefined;
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return text;
      }
    }

    return text;
  }
}
