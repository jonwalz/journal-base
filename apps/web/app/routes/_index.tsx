import { type MetaFunction, json, LoaderFunctionArgs } from "@remix-run/node";
import { requireAuth } from "~/utils/auth.server";
import Article from "../components/Article";

export async function loader({ request }: LoaderFunctionArgs) {
  requireAuth(request);

  return json({});
}

export const meta: MetaFunction = () => {
  return [
    { title: "Journal Up" },
    {
      name: "Journal Up",
      content:
        "A safe space for emotional processing and self-reflection with AI-guided support.",
    },
  ];
};

export default function Index() {
  return <Article />;
}
