import { ApiClient } from "./api-client.server";

interface SignUpData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  sessionToken: string;
  user: {
    id: string;
    email: string;
  };
}

export class AuthService {
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>("/auth/signup", data);
    return response.data;
  }

  static async login(data: SignUpData): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  }

  // A method to verify the user's session token
  static async verifySessionToken(sessionToken: string) {
    const response = await ApiClient.post<AuthResponse>(
      "/auth/verify-session-token",
      {},
      { headers: { "x-session-token": sessionToken } }
    );
    return response.data;
  }

  // A method to verify the users auth token
  static async verifyAuthToken(authToken: string) {
    const response = await ApiClient.post<AuthResponse>(
      "/auth/verify-auth-token",
      {},
      { headers: { Authorization: authToken } }
    );
    return response.data;
  }
}
