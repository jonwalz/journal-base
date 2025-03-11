import { Goal } from '~/types/goals';
import { Card, CardContent } from '~/components/ui/card';

interface GoalStatsProps {
  goals: Goal[];
}

export default function GoalStats({ goals }: GoalStatsProps) {
  const totalGoals = goals.length;
  const acceptedGoals = goals.filter(g => g.acceptedAt && !g.deletedAt).length;
  const completedGoals = goals.filter(g => g.completedAt).length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="animate-fade-in">
        <CardContent className="p-4">
          <p className="text-sm text-black/70 dark:text-white/70">Total Goals</p>
          <p className="text-2xl font-bold text-black dark:text-white">{totalGoals}</p>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-4">
          <p className="text-sm text-black/70 dark:text-white/70">Accepted</p>
          <p className="text-2xl font-bold text-black dark:text-white">{acceptedGoals}</p>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardContent className="p-4">
          <p className="text-sm text-black/70 dark:text-white/70">Completed</p>
          <p className="text-2xl font-bold text-black dark:text-white">{completedGoals}</p>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <CardContent className="p-4">
          <p className="text-sm text-black/70 dark:text-white/70">Completion Rate</p>
          <p className="text-2xl font-bold text-black dark:text-white">{completionRate}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
