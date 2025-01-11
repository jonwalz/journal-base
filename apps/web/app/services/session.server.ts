import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { AuthService } from "./auth.service";

// This should be in an environment variable
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth_session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function setAuthTokens(
  request: Request,
  authToken: string,
  sessionToken: string
) {
  const session = await getSession(request);
  session.set("authToken", authToken);
  session.set("sessionToken", sessionToken);
  return sessionStorage.commitSession(session);
}

export async function getAuthToken(request: Request) {
  const session = await getSession(request);
  return session.get("authToken");
}

export async function getSessionToken(request: Request) {
  const session = await getSession(request);
  return session.get("sessionToken");
}

export async function requireUserSession(
  request: Request,
  redirectTo: string = "/login"
) {
  const session = await getSession(request);
  const authToken = session.get("authToken");
  const sessionToken = session.get("sessionToken");

  if (!authToken || !sessionToken) {
    // Clear the session if tokens are missing
    throw redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }

  try {
    // Verify both tokens
    await Promise.all([
      AuthService.verifyAuthToken(authToken),
      AuthService.verifySessionToken(sessionToken),
    ]);

    return { authToken, sessionToken };
  } catch (error) {
    // Clear the session if token verification fails
    throw redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }
}

export async function destroySession(request: Request) {
  const session = await getSession(request);
  return sessionStorage.destroySession(session);
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
