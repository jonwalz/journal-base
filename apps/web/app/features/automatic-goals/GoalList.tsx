import { Goal } from '~/types/goals';
import GoalCard from './GoalCard';
import './goal-animations.css';

interface GoalListProps {
  goals: Goal[];
  onGoalUpdate: (goal: Goal) => void;
}

export default function GoalList({ goals, onGoalUpdate }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg animate-fade-in">
        <p className="text-gray-500">No goals found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="goal-list-item">
          <GoalCard 
            goal={goal} 
            onUpdate={onGoalUpdate} 
          />
        </div>
      ))}
    </div>
  );
}
