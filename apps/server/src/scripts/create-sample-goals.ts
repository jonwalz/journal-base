import { db } from "../config/database";
import { goals } from "../db/schema";
import { eq } from "drizzle-orm";

async function createSampleGoals() {
  try {
    console.log("Creating sample goals for testing...");
    
    // User ID from the error message
    const userId = "0af4dd23-53f3-4337-88eb-493203577598";
    
    // Check if there are any existing goals for this user
    const existingGoals = await db.select().from(goals).where(eq(goals.userId, userId));
    
    if (existingGoals.length > 0) {
      console.log(`User already has ${existingGoals.length} goals. No need to create samples.`);
      process.exit(0);
    }
    
    // Create sample goals with different statuses
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Sample goals to create
    const sampleGoals = [
      {
        userId,
        content: "Spend 30 minutes each day for the next 2 weeks learning about a new aspect of AI or LLMs",
        relatedMetricType: "learning",
        targetDate: nextWeek.toISOString().split('T')[0],
        sourceType: "journal_entry",
        suggestedAt: now,
      },
      {
        userId,
        content: "Seek feedback from 3 trusted peers on your AI-powered app by the end of the month",
        relatedMetricType: "feedback",
        targetDate: nextWeek.toISOString().split('T')[0],
        sourceType: "journal_entry",
        suggestedAt: now,
        acceptedAt: now, // This one is accepted
      },
      {
        userId,
        content: "Embrace the challenge of building an AI-powered app by setting a stretch goal",
        relatedMetricType: "challenge",
        targetDate: tomorrow.toISOString().split('T')[0],
        sourceType: "daily_generation",
        suggestedAt: now,
        acceptedAt: now,
        completedAt: now, // This one is completed
      },
    ];
    
    // Insert the goals into the database
    for (const goal of sampleGoals) {
      await db.insert(goals).values(goal);
      console.log(`Created goal: ${goal.content}`);
    }
    
    console.log("\u2705 Sample goals created successfully!");
  } catch (error) {
    console.error("\u274c Error creating sample goals:", error);
  } finally {
    process.exit(0);
  }
}

createSampleGoals();
