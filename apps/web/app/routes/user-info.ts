import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  UserInfoService,
  UserInfoServiceError,
} from "~/services/user-info.service";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const userInfo = await UserInfoService.getUserInfo(request);
    return json(
      { userInfo },
      {
        headers: {
          "Cache-Control": "private, max-age=60",
        },
      }
    );
  } catch (error) {
    console.error("Error in user-info loader:", error);

    if (error instanceof UserInfoServiceError) {
      throw json({ error: error.message }, { status: 500 });
    }

    throw json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const userInfo = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      timezone: formData.get("timezone"),
      bio: formData.get("bio"),
    };

    await UserInfoService.updateUserInfo(request, userInfo);

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating user info:", error);

    if (error instanceof UserInfoServiceError) {
      return json({ error: error.message }, { status: 500 });
    }

    return json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
