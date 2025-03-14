import { useState, useEffect, useRef } from 'react';
import { useLocation, useFetcher } from '@remix-run/react';
import GoalNotification from './ui/GoalNotification';
import type { IUserInfo } from '~/hooks/useUserInfo';

interface GoalNotificationProviderProps {
  userInfo: IUserInfo;
}

export default function GoalNotificationProvider({ userInfo }: GoalNotificationProviderProps) {
  const [newGoalsCount, setNewGoalsCount] = useState(0);
  const location = useLocation();
  const fetcher = useFetcher();
  
  // Use refs to track the last fetch time and prevent excessive requests
  const lastFetchTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(false);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Function to check if we should fetch new goals
  const shouldFetchGoals = () => {
    // Don't fetch if we're on the goal tracking page
    if (location.pathname === '/goal-tracking') {
      return false;
    }
    
    // Don't fetch if we don't have user info
    if (!userInfo?.userId) {
      return false;
    }
    
    // Don't fetch if the fetcher is already loading
    if (fetcher.state !== 'idle') {
      return false;
    }
    
    // Don't fetch if we've fetched recently (within the last 10 seconds)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 10000) {
      return false;
    }
    
    return true;
  };
  
  // Function to fetch new goals
  const fetchNewGoals = () => {
    if (shouldFetchGoals()) {
      lastFetchTimeRef.current = Date.now();
      fetcher.load(`/api/goals/new-count?userId=${userInfo.userId}&_t=${Date.now()}`);
    }
  };
  
  // Effect for initial fetch and interval setup
  useEffect(() => {
    // Skip the first render to avoid double fetching
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    
    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
    
    // If we're on the goal tracking page, reset the count
    if (location.pathname === '/goal-tracking') {
      setNewGoalsCount(0);
      return;
    }
    
    // If we don't have user info, don't fetch
    if (!userInfo?.userId) {
      return;
    }
    
    // Schedule a fetch after a short delay to avoid race conditions
    fetchTimeoutRef.current = setTimeout(() => {
      fetchNewGoals();
      
      // Set up an interval to check for new goals every 5 minutes
      const intervalId = setInterval(fetchNewGoals, 5 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }, 2000);
    
    // Cleanup function
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    };
  }, [location.pathname, userInfo?.userId]);
  
  // Update the count when the fetcher data changes
  useEffect(() => {
    if (fetcher.data && typeof fetcher.data === 'object' && 'count' in fetcher.data) {
      setNewGoalsCount(fetcher.data.count as number);
    }
  }, [fetcher.data]);

  return <GoalNotification newGoalsCount={newGoalsCount} />;
}
