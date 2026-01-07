import { UserRepository } from "../repositories/user.repository";
import { SessionRepository } from "../repositories/session.repository";
import { UserInfoRepository } from "../repositories/user-info.repository";
import { AuthenticationError, NotFoundError } from "../utils/errors";
import { generateToken, verifyToken } from "../utils/jwt";

export interface AuthResponse {
  token: string;
  sessionToken: string;
  user: {
    id: string;
  };
}

export class AuthService {
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;
  private userInfoRepository: UserInfoRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.sessionRepository = new SessionRepository();
    this.userInfoRepository = new UserInfoRepository();
  }

  async signup(email: string, password: string): Promise<AuthResponse> {
    const passwordHash = await Bun.password.hash(password);
    const user = await this.userRepository.create(email, passwordHash);

    const token = await this.generateToken(user);
    const session = await this.sessionRepository.create(user.id);

    return { token, sessionToken: session.token, user };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const user = await this.userRepository.findByEmail(email);
      const isValid = await Bun.password.verify(password, user.passwordHash);

      if (!isValid) {
        throw new AuthenticationError("Invalid credentials");
      }

      // Delete any existing sessions for this user
      await this.sessionRepository.deleteByUserId(user.id);

      const token = await this.generateToken(user);
      const session = await this.sessionRepository.create(user.id);

      return { token, sessionToken: session.token, user };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error; // Let NotFoundError propagate
      }
      if (error instanceof AuthenticationError) {
        throw new AuthenticationError("Invalid credentials", 401);
      }
      console.error("Failed to validate token:", error);
      throw new AuthenticationError("Invalid credentials");
    }
  }

  async logout(sessionToken: string): Promise<void> {
    await this.sessionRepository.deleteByToken(sessionToken);
  }

  async validateSession(sessionToken: string): Promise<boolean> {
    try {
      const session = await this.sessionRepository.findByToken(sessionToken);
      return new Date() < session.expiresAt;
    } catch {
      return false;
    }
  }

  private async generateToken(user: { id: string; email: string }): Promise<string> {
    return generateToken({ id: user.id, email: user.email });
  }

  async verifySessionToken(token: string): Promise<boolean> {
    try {
      const session = await this.sessionRepository.findByToken(token);
      return !!session;
    } catch (error) {
      return false;
    }
  }

  async verifyAuthToken(token: string): Promise<boolean> {
    try {
      const decoded = await verifyToken(token);
      return !!decoded;
    } catch (error) {
      return false;
    }
  }

  /**
   * Dev-only login that creates a test user if it doesn't exist
   * and returns credentials without password verification
   */
  async devLogin(): Promise<AuthResponse> {
    const devEmail = "dev@test.local";
    const devPassword = "devpassword123";

    try {
      // Try to find existing dev user
      const user = await this.userRepository.findByEmail(devEmail);

      // Ensure user_info exists for the dev user
      try {
        await this.userInfoRepository.findByUserId(user.id);
      } catch {
        // Create user_info if it doesn't exist
        await this.userInfoRepository.create({
          userId: user.id,
          firstName: "Dev",
          lastName: "User",
          bio: "Development test account",
          timezone: "UTC",
          growthGoals: { shortTerm: [], longTerm: [] },
        });
      }

      // Delete any existing sessions
      await this.sessionRepository.deleteByUserId(user.id);

      const token = await this.generateToken(user);
      const session = await this.sessionRepository.create(user.id);

      return { token, sessionToken: session.token, user };
    } catch (error) {
      // User doesn't exist, create it
      const passwordHash = await Bun.password.hash(devPassword);
      const user = await this.userRepository.create(devEmail, passwordHash);

      // Create user_info for the new dev user
      await this.userInfoRepository.create({
        userId: user.id,
        firstName: "Dev",
        lastName: "User",
        bio: "Development test account",
        timezone: "UTC",
        growthGoals: { shortTerm: [], longTerm: [] },
      });

      const token = await this.generateToken(user);
      const session = await this.sessionRepository.create(user.id);

      return { token, sessionToken: session.token, user };
    }
  }
}
