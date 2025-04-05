import { useState } from 'react';
import { Link } from '@remix-run/react';

interface GoalNotificationProps {
  newGoalsCount: number;
}

export default function GoalNotification({ newGoalsCount }: GoalNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (newGoalsCount === 0 || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-300 rounded-md p-4 max-w-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] animate-slide-in">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold text-lg text-black dark:text-white">New Growth Goals Available</h3>
          <p className="text-sm text-neutral-800 dark:text-neutral-200 mt-1">
            {newGoalsCount} new goal{newGoalsCount > 1 ? 's' : ''} generated based on your journal entries.
          </p>
          <Link
            to="/goal-tracking"
            className="mt-3 inline-block px-3 py-1 bg-blue-500 text-white border-2 border-black dark:border-neutral-300 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] hover:bg-blue-600 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 text-sm font-medium"
          >
            View Goals
          </Link>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-black dark:text-white flex-shrink-0 p-1 border-2 border-black dark:border-neutral-300 rounded-md bg-neutral-200 dark:bg-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150"
          aria-label="Close notification"
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
