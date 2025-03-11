import { useState, useEffect } from 'react';
import { useLocation } from '@remix-run/react';
import { GoalService } from '~/services/goalService.client';
import GoalNotification from './ui/GoalNotification';
import { useUserInfo } from '~/hooks/useUserInfo';

export default function GoalNotificationProvider() {
  const [newGoalsCount, setNewGoalsCount] = useState(0);
  const location = useLocation();
  const { userInfo } = useUserInfo();

  useEffect(() => {
    // Don't show notifications on the goal tracking page
    if (location.pathname === '/goal-tracking') {
      setNewGoalsCount(0);
      return;
    }

    // Don't try to fetch goals if we don't have user info yet
    if (!userInfo) {
      return;
    }

    const checkForNewGoals = async () => {
      try {
        const count = await GoalService.getNewGoalsCount(userInfo.userId);
        setNewGoalsCount(count);
      } catch (error) {
        console.error('Failed to check for new goals:', error);
      }
    };

    // Check for new goals when the component mounts or when userInfo changes
    checkForNewGoals();

    // Set up an interval to check for new goals every 5 minutes
    const intervalId = setInterval(checkForNewGoals, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [location.pathname, userInfo]);

  return <GoalNotification newGoalsCount={newGoalsCount} />;
}
