import { json, ActionFunctionArgs, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useActionData } from '@remix-run/react';
import { MainLayout } from "~/layouts/MainLayout";
import GoalDashboard from "~/features/automatic-goals/GoalDashboard";
import { GoalService } from '~/services/goalService';
import type { Goal } from '~/types/goals';
import { requireUserSession, getSession } from '~/services/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    console.log('Goal tracking loader: Starting to fetch user session');
    // Get user authentication tokens and userId
    const { authToken, sessionToken, userId } = await requireUserSession(request);
    
    console.log('Goal tracking loader: User session retrieved', { hasAuthToken: !!authToken, hasSessionToken: !!sessionToken, hasUserId: !!userId });
    
    // Get the user ID from the session directly if it's not returned by requireUserSession
    const session = await getSession(request);
    const userIdFromSession = userId || session.get("userId");
    
    console.log('User ID for API call:', userIdFromSession);
    
    if (!userIdFromSession) {
      console.error('No user ID found in session');
      return json({ goals: [], error: 'User ID not found' });
    }
    
    // Pass the user ID and authentication tokens to the GoalService
    const goals = await GoalService.getGoals(
      { userId: userIdFromSession },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-session-token": sessionToken,
        },
      }
    );
    
    return json({ goals });
  } catch (error) {
    console.error('Error loading goals:', error);
    
    // Log detailed error information for debugging
    console.log('Error type:', typeof error);
    console.log('Error properties:', Object.keys(error || {}));
    console.log('Error stringified:', JSON.stringify(error, null, 2));
    
    if (error && (error as any).originalError) {
      const originalError = (error as any).originalError;
      console.log('Original error:', originalError);
      console.log('Original error message:', originalError.message);
      
      // Check if the error is related to the goals table not existing
      if (originalError.message && originalError.message.includes('relation "goals" does not exist')) {
        console.log('Detected database relation error - goals table does not exist');
        // Return an empty array with a message for the UI
        return json({ 
          goals: [], 
          error: 'The goals feature is not yet available. Please check back later.' 
        });
      }
    }
    
    // For other errors, return a generic error message
    return json({ goals: [], error: 'Failed to load goals. Please try again later.' });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get('_action') as string;
  const goalId = formData.get('goalId') as string;
  
  if (!goalId) {
    return json({ error: 'Goal ID is required' }, { status: 400 });
  }
  
  try {
    // Get user authentication tokens and userId
    const { authToken, sessionToken, userId } = await requireUserSession(request);
    
    // Get the user ID from the session directly if it's not returned by requireUserSession
    const session = await getSession(request);
    const userIdFromSession = userId || session.get("userId");
    
    console.log('User ID for API call (action):', userIdFromSession);
    
    if (!userIdFromSession) {
      console.error('No user ID found in session');
      return json({ error: 'User ID not found' }, { status: 400 });
    }
    
    const authOptions = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken,
      },
      params: {
        userId: userIdFromSession
      }
    };
    
    let goal;
    
    switch (_action) {
      case 'acceptGoal':
        goal = await GoalService.acceptGoal(goalId, authOptions);
        return json({ goal, success: true });
        
      case 'completeGoal':
        goal = await GoalService.completeGoal(goalId, authOptions);
        return json({ goal, success: true });
        
      case 'deleteGoal':
        await GoalService.deleteGoal(goalId, authOptions);
        return json({ success: true });
        
      default:
        return json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error performing ${_action}:`, error);
    return json({ error: `Failed to perform ${_action}` }, { status: 500 });
  }
}

export default function GoalTracking() {
  const { goals, error } = useLoaderData<{ goals: Goal[]; error?: string }>();
  const actionData = useActionData<{ goal?: Goal; error?: string; success?: boolean }>();
  
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Goal Tracking</h1>
        <p className="text-gray-600">
          Track your personalized growth goals generated from your journal entries.
        </p>
        
        {error && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <GoalDashboard initialGoals={goals} actionData={actionData} />
      </div>
    </MainLayout>
  );
}
