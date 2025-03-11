import { Goal } from '~/types/goals';
import { GoalService } from '~/services/goalService.client';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goal: Goal) => void;
}

export default function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const handleAccept = async () => {
    try {
      const updatedGoal = await GoalService.acceptGoal(goal.id);
      onUpdate(updatedGoal);
    } catch (error) {
      console.error('Failed to accept goal:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const updatedGoal = await GoalService.completeGoal(goal.id);
      onUpdate(updatedGoal);
    } catch (error) {
      console.error('Failed to complete goal:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await GoalService.deleteGoal(goal.id);
      // Instead of updating, we'll let the parent component handle removal
      onUpdate({ ...goal, deletedAt: new Date() });
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const getStatusBadge = () => {
    if (goal.deletedAt) return <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-base text-xs font-medium border-2 border-red-800 dark:border-red-600">Deleted</span>;
    if (goal.completedAt) return <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-base text-xs font-medium border-2 border-green-800 dark:border-green-600">Completed</span>;
    if (goal.acceptedAt) return <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-base text-xs font-medium border-2 border-blue-800 dark:border-blue-600">Accepted</span>;
    return <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-base text-xs font-medium border-2 border-yellow-800 dark:border-yellow-600">Suggested</span>;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="goal-card">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1 mt-2">
              {getStatusBadge()}
              {goal.relatedMetricType && (
                <span className="bg-main-100 dark:bg-main-900/30 text-black dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-border dark:border-darkBorder">
                  {goal.relatedMetricType}
                </span>
              )}
            </div>
            <p className="text-lg font-medium mt-2 text-black dark:text-white">{goal.content}</p>
            
            <div className="mt-2 text-sm text-black/70 dark:text-white/70">
              <p>Suggested: {formatDate(goal.suggestedAt)}</p>
              {goal.targetDate && (
                <p>Target completion: {formatDate(goal.targetDate)}</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!goal.acceptedAt && !goal.completedAt && !goal.deletedAt && (
              <Button 
                onClick={handleAccept}
                size="sm"
                variant="default"
              >
                Accept
              </Button>
            )}
            
            {goal.acceptedAt && !goal.completedAt && !goal.deletedAt && (
              <Button 
                onClick={handleComplete}
                size="sm"
                variant="default"
                className="bg-green-100 dark:bg-green-900/50 border-green-800 dark:border-green-600 text-green-800 dark:text-green-300"
              >
                Complete
              </Button>
            )}
            
            {!goal.deletedAt && (
              <Button 
                onClick={handleDelete}
                size="sm"
                variant="default"
                className="bg-red-100 dark:bg-red-900/50 border-red-800 dark:border-red-600 text-red-800 dark:text-red-300"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
