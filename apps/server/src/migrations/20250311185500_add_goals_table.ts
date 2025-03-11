import { sql } from '../config/database';

export async function up(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS goals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      journal_entry_id UUID REFERENCES entries(id) NULL,
      content TEXT NOT NULL,
      suggested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      accepted_at TIMESTAMP WITH TIME ZONE NULL,
      completed_at TIMESTAMP WITH TIME ZONE NULL,
      deleted_at TIMESTAMP WITH TIME ZONE NULL,
      target_date DATE NULL,
      related_metric_type VARCHAR(50) NULL,
      source_type VARCHAR(20) NOT NULL,
      CONSTRAINT valid_source_type CHECK (
          source_type IN ('journal_entry', 'daily_generation')
      ),
      CONSTRAINT valid_related_metric CHECK (
          related_metric_type IS NULL OR
          related_metric_type IN ('resilience', 'effort', 'challenge', 'feedback', 'learning')
      )
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(user_id, accepted_at, completed_at, deleted_at);`;
}

export async function down(): Promise<void> {
  await sql`DROP TABLE IF EXISTS goals;`;
}
