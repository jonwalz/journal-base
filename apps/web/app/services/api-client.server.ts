import { getSession } from "./session.server";
import { ApiError, AuthenticationError } from "~/utils/errors";

const API_BASE_URL = process.env.API_URL || "http://localhost:3030";
console.log("API_BASE_URL", API_BASE_URL);

export interface RequestOptions extends RequestInit {
  data?: unknown;
  headers?: { [key: string]: string };
}

interface ApiResponse<T> {
  data: T;
  headers: { [key: string]: string };
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { data, headers: customHeaders, ...customOptions } = options;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
      credentials: "include",
    };

    const fetchOptions: RequestInit = {
      ...defaultOptions,
      ...customOptions,
    };

    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationError('Your session has expired. Please log in again.');
      }
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new ApiError(response.status, 'API_ERROR', errorData.message || 'An error occurred');
    }

    const responseData = await response.json();
    return {
      data: responseData,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  static async get<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  static async post<T>(
    endpoint: string,
    data: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      data,
    });
  }

  static async put<T>(
    endpoint: string,
    data: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      data,
    });
  }

  static async delete(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<void> {
    await this.request(endpoint, { ...options, method: "DELETE" });
  }

  private static async addAuthHeaders(
    options: RequestOptions = {},
    request: Request
  ): Promise<RequestOptions> {
    const session = await getSession(request);
    const authToken = session.get("authToken");
    const sessionToken = session.get("sessionToken");

    if (!authToken || !sessionToken) {
      throw new Error("No auth token or session token found");
    }

    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken,
      },
    };
  }

  static async getProtected<T>(
    endpoint: string,
    request: Request,
    options?: RequestOptions
  ) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request<T>(endpoint, { ...protectedOptions, method: "GET" });
  }

  static async postProtected<T>(
    endpoint: string,
    request: Request,
    data?: unknown,
    options?: RequestOptions
  ) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request<T>(endpoint, {
      ...protectedOptions,
      method: "POST",
      data,
    });
  }

  static async putProtected<T>(
    endpoint: string,
    request: Request,
    data?: unknown,
    options?: RequestOptions
  ) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request<T>(endpoint, {
      ...protectedOptions,
      method: "PUT",
      data,
    });
  }

  static async deleteProtected<T>(
    endpoint: string,
    request: Request,
    options?: RequestOptions
  ) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request<T>(endpoint, { ...protectedOptions, method: "DELETE" });
  }
}
