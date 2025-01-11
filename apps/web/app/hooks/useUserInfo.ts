import { useEffect, useState } from "react";
import { useOutletContext } from "@remix-run/react";
import type { RootLoaderData } from "~/root";

export interface IUserInfo {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio: string | null | undefined;
  timezone: string;
  growthGoals: {
    shortTerm: string[];
    longTerm: string[];
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export function useUserInfo() {
  const data = useOutletContext<RootLoaderData>();

  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      if (!data?.userInfo) {
        console.error("No user info in context data");
        setError(new Error("No user info available"));
        return;
      }

      // Convert date strings to Date objects
      const processedUserInfo = {
        ...data.userInfo,
        createdAt: new Date(data.userInfo.createdAt),
        updatedAt: new Date(data.userInfo.updatedAt),
      };

      setUserInfo(processedUserInfo);
      setError(null);
    } catch (err) {
      console.error("Error processing user info:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to process user info")
      );
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  return { userInfo, isLoading, error };
}
