import { db } from "../config/database";
import { goals } from "../db/schema";
import { eq } from "drizzle-orm";

async function checkGoals() {
  console.log("Checking goals in the database...");
  
  // Get the userId from the command line arguments or use the default test user
  const userId = process.argv[2] || "0af4dd23-53f3-4337-88eb-493203577598";
  console.log(`Checking goals for user ID: ${userId}`);
  
  try {
    // Fetch goals for the user
    const userGoals = await db.select().from(goals).where(eq(goals.userId, userId));
    
    console.log(`Found ${userGoals.length} goals for user`);
    console.log("Goals data:", JSON.stringify(userGoals, null, 2));
    
    // Check if goals is an array
    console.log("Is goals an array?", Array.isArray(userGoals));
    
    // Check the structure of the first goal if available
    if (userGoals.length > 0) {
      console.log("First goal structure:", Object.keys(userGoals[0]));
    }
  } catch (error) {
    console.error("Error fetching goals:", error);
  } finally {
    // Close the database connection
    process.exit(0);
  }
}

checkGoals();
