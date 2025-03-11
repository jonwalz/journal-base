import { useState } from 'react';
import { Link } from '@remix-run/react';

interface GoalNotificationProps {
  newGoalsCount: number;
}

export default function GoalNotification({ newGoalsCount }: GoalNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (newGoalsCount === 0 || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm border-l-4 border-blue-500 animate-slide-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">New Growth Goals Available</h3>
          <p className="text-sm text-gray-600 mt-1">
            {newGoalsCount} new goal{newGoalsCount > 1 ? 's' : ''} generated based on your journal entries.
          </p>
          <Link 
            to="/goal-tracking" 
            className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
          >
            View Goals
          </Link>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
