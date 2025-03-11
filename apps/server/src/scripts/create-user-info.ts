import { db } from "../config/database";
import { users, userInfo } from "../db/schema";
import { eq } from "drizzle-orm";

async function createMissingUserInfo() {
  try {
    console.log("Checking for users without user info records...");
    
    // Get all users
    const allUsers = await db.select().from(users);
    console.log(`Found ${allUsers.length} users in the database`);
    
    // For each user, check if they have a user info record
    for (const user of allUsers) {
      const userInfoRecord = await db.query.userInfo.findFirst({
        where: eq(userInfo.userId, user.id),
      });
      
      if (!userInfoRecord) {
        console.log(`Creating user info record for user ${user.id}`);
        
        // Create a user info record
        await db.insert(userInfo).values({
          userId: user.id,
          firstName: "User",
          lastName: user.id.substring(0, 8), // Use part of the UUID as a placeholder
          timezone: "UTC",
          growthGoals: { shortTerm: [], longTerm: [] },
        });
        
        console.log(`✅ Created user info record for user ${user.id}`);
      } else {
        console.log(`User ${user.id} already has a user info record`);
      }
    }
    
    console.log("✅ All users now have user info records");
  } catch (error) {
    console.error("❌ Error creating user info records:", error);
  } finally {
    process.exit(0);
  }
}

createMissingUserInfo();
