import { Form } from '@remix-run/react';
import { Goal } from '~/types/goals';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

interface GoalCardProps {
  goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
  // These handlers are no longer needed as we're using Remix Form submissions

  const getStatusBadge = () => {
    if (goal.deletedAt) return <span className="bg-red-100 dark:bg-red-900/70 text-red-800 dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-red-800 dark:border-red-400">Deleted</span>;
    if (goal.completedAt) return <span className="bg-green-100 dark:bg-green-900/70 text-green-800 dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-green-800 dark:border-green-400">Completed</span>;
    if (goal.acceptedAt) return <span className="bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-blue-800 dark:border-blue-400">Accepted</span>;
    return <span className="bg-yellow-100 dark:bg-yellow-900/70 text-yellow-800 dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-yellow-800 dark:border-yellow-400">Suggested</span>;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="goal-card bg-white dark:bg-gray-800 border-2 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1 mt-2">
              {getStatusBadge()}
              {goal.relatedMetricType && (
                <span className="bg-main-100 dark:bg-main-900/70 text-black dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-border dark:border-main-600">
                  {goal.relatedMetricType}
                </span>
              )}
            </div>
            <p className="text-lg font-medium mt-2 text-black dark:text-white">{goal.content}</p>
            
            <div className="mt-2 text-sm text-black/70 dark:text-white/90">
              <p>Suggested: {formatDate(goal.suggestedAt)}</p>
              {goal.targetDate && (
                <p>Target completion: {formatDate(goal.targetDate)}</p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!goal.acceptedAt && !goal.completedAt && !goal.deletedAt && (
              <Form method="post">
                <input type="hidden" name="goalId" value={goal.id} />
                <input type="hidden" name="_action" value="acceptGoal" />
                <Button 
                  type="submit"
                  size="sm"
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Accept
                </Button>
              </Form>
            )}
            
            {goal.acceptedAt && !goal.completedAt && !goal.deletedAt && (
              <Form method="post">
                <input type="hidden" name="goalId" value={goal.id} />
                <input type="hidden" name="_action" value="completeGoal" />
                <Button 
                  type="submit"
                  size="sm"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium border-none"
                >
                  Complete
                </Button>
              </Form>
            )}
            
            {!goal.deletedAt && (
              <Form method="post">
                <input type="hidden" name="goalId" value={goal.id} />
                <input type="hidden" name="_action" value="deleteGoal" />
                <Button 
                  type="submit"
                  size="sm"
                  variant="default"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium border-none"
                >
                  Delete
                </Button>
              </Form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
