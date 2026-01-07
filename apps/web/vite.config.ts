import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, type PluginOption } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import ReactComponentName from "react-scan/react-component-name/vite";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
    // ReactComponentName({}), // Temporarily disabled - causing unhandled promise rejection
  ] as PluginOption[],
});
