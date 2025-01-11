import { createCookie } from "@remix-run/node";

export const themeCookie = createCookie("theme", {
  maxAge: 34560000, // 400 days
});
