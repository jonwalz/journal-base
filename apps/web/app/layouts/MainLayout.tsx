import { type PropsWithChildren } from "react";
import { AppSidebar } from "../components/Sidebar";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-background dark:bg-secondaryBlack w-full">
      <AppSidebar>
        <main>{children}</main>
      </AppSidebar>
    </div>
  );
}
