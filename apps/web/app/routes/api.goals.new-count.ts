import { json, LoaderFunction } from '@remix-run/node';
import { GoalService } from '~/services/goalService.server';
import { requireUserSession } from '~/services/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const { authToken, sessionToken } = await requireUserSession(request);
  
  // Get userId from query params
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return json({ error: 'User ID is required' }, { status: 400 });
  }
  
  try {
    // Use the server-side GoalService to get the count of new goals
    const count = await GoalService.getNewGoalsCount(
      userId,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'x-session-token': sessionToken,
        },
      }
    );
    
    // Add cache headers to prevent excessive requests
    return json({ count }, {
      headers: {
        'Cache-Control': 'max-age=60, s-maxage=60', // Cache for 60 seconds
      }
    });
  } catch (error) {
    console.error('Failed to get new goals count:', error);
    return json({ error: 'Failed to get new goals count' }, { status: 500 });
  }
};
