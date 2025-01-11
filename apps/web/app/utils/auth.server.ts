import { redirect } from "@remix-run/node";
import { AuthService } from "~/services/auth.service";
import { getAuthToken, getSessionToken } from "~/services/session.server";
import { AuthenticationError } from "./errors";

export async function requireAuth(request: Request) {
  const authToken = await getAuthToken(request);
  const sessionToken = await getSessionToken(request);

  if (!authToken || !sessionToken) {
    throw redirect("/login?error=Please log in to continue");
  }

  try {
    // Verify both tokens
    await Promise.all([
      AuthService.verifyAuthToken(authToken),
      AuthService.verifySessionToken(sessionToken),
    ]);

    return { authToken, sessionToken };
  } catch (error) {
    const message = error instanceof AuthenticationError 
      ? error.message 
      : 'Your session has expired. Please log in again.';
    
    throw redirect(`/login?error=${encodeURIComponent(message)}`);
  }
}
