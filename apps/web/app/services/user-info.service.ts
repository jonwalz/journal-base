import { type IUserInfo } from "~/hooks/useUserInfo";
import { ApiClient } from "./api-client.server";

export class UserInfoServiceError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "UserInfoServiceError";
  }
}

interface UpdateUserInfoData {
  firstName: FormDataEntryValue | null;
  lastName: FormDataEntryValue | null;
  timezone: FormDataEntryValue | null;
  bio: FormDataEntryValue | null;
}

export class UserInfoService {
  static async getUserInfo(request: Request): Promise<IUserInfo> {
    try {
      const response = await ApiClient.getProtected<IUserInfo>(
        "/user-info",
        request
      );

      const userInfo = response.data;

      // Convert string dates to Date objects
      userInfo.createdAt = new Date(userInfo.createdAt);
      userInfo.updatedAt = new Date(userInfo.updatedAt);

      return userInfo;
    } catch (error) {
      throw new UserInfoServiceError("Failed to fetch user info", error);
    }
  }

  static async updateUserInfo(
    request: Request,
    data: UpdateUserInfoData
  ): Promise<IUserInfo> {
    try {
      const response = await ApiClient.postProtected<{ data: IUserInfo }>(
        "/user-info",
        request,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          timezone: data.timezone,
          bio: data.bio,
        }
      );

      const userInfo = response.data.data;

      // Convert string dates to Date objects
      userInfo.createdAt = new Date(userInfo.createdAt);
      userInfo.updatedAt = new Date(userInfo.updatedAt);

      return userInfo;
    } catch (error) {
      throw new UserInfoServiceError("Failed to update user info", error);
    }
  }
}
