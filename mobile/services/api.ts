import AsyncStorage from "@react-native-async-storage/async-storage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

type ApiRequestOptions<TBody = unknown> = {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  query?: QueryParams;
  auth?: boolean;
};

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "token";
let inMemoryToken: string | null = null;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function buildUrl(path: string, query?: QueryParams): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!query || Object.keys(query).length === 0) {
    return `${API_BASE_URL}${normalizedPath}`;
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return `${API_BASE_URL}${normalizedPath}${queryString ? `?${queryString}` : ""}`;
}

async function parseResponse<T>(response: Response): Promise<T | string | null> {
  const rawText = await response.text();
  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    return rawText;
  }
}

export async function setAuthToken(token: string | null): Promise<void> {
  inMemoryToken = token;

  try {
    if (!token) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      return;
    }
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Keep session functional when native storage is unavailable.
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      inMemoryToken = storedToken;
      return storedToken;
    }
  } catch {
    // Fall back to in-memory token.
  }

  return inMemoryToken;
}

export async function clearAuthToken(): Promise<void> {
  inMemoryToken = null;

  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore removal failures in environments without native storage.
  }
}

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    headers = {},
    query,
    auth = true,
  } = options;

  const token = auth ? await getAuthToken() : null;
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await parseResponse<TResponse>(response);

  if (!response.ok) {
    if (response.status === 401) {
      await clearAuthToken();
    }

    const message =
      typeof data === "object" && data !== null && ("message" in data || "error" in data)
        ? String((data as { message?: string; error?: string }).message || (data as { message?: string; error?: string }).error)
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as TResponse;
}
