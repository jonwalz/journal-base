import { db } from "../config/database";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../utils/errors";
import type { IUser } from "../types";

export class UserRepository {
  async create(email: string, passwordHash: string): Promise<IUser> {
    try {
      const [user] = await db
        .insert(users)
        .values({ email, passwordHash })
        .returning();

      return user;
    } catch (error) {
      // Handle unique constraint violation
      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed")
      ) {
        throw new NotFoundError("Email already exists");
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async findById(id: string): Promise<IUser> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  /**
   * Get all active users in the system
   * @returns Array of active users
   */
  async getAllActiveUsers(): Promise<IUser[]> {
    // For now, we consider all users as active
    // In the future, we might add an 'active' flag to the users table
    const activeUsers = await db.select().from(users);
    return activeUsers;
  }

  async update(id: string, updates: Partial<IUser>): Promise<IUser> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();

    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  }

  async delete(id: string): Promise<void> {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();

    if (!user) {
      throw new NotFoundError("User");
    }
  }
}
