import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { Form } from "@remix-run/react";
import { useTheme } from "../ThemeProvider";
import { useUserInfo } from "../../hooks/useUserInfo";
import { UserInfoForm } from "../UserInfoForm";
import { useState } from "react";

export function UserMenu() {
  const { theme, toggleTheme } = useTheme();
  const { userInfo, isLoading, error } = useUserInfo();
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);

  // Show the form modal if there's an error
  if (error) {
    return (
      <>
        <UserInfoForm
          open={showUserInfoForm || !!error}
          onOpenChange={setShowUserInfoForm}
        />
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            onClick={() => setShowUserInfoForm(true)}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg text-black dark:text-white bg-main dark:bg-main-700">
                GU
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-black dark:text-white">
                Complete Profile
              </span>
              <span className="truncate text-xs text-black dark:text-white">
                Click to setup
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 text-black dark:text-white" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </>
    );
  }

  if (isLoading) {
    return (
      <SidebarMenuItem>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 w-full rounded-lg" />
      </SidebarMenuItem>
    );
  }

  const displayName = userInfo
    ? `${userInfo.firstName} ${userInfo.lastName}`
    : "Guest";
  const initials = userInfo
    ? `${userInfo.firstName[0]}${userInfo.lastName[0]}`
    : "GU";

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg text-black dark:text-white bg-main dark:bg-main-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-black dark:text-white">
                {displayName}
              </span>
              <span className="truncate text-xs text-black dark:text-white">
                {userInfo?.timezone || "Loading..."}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 text-black dark:text-white" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg text-black dark:text-white bg-main dark:bg-main-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs">
                  {userInfo?.timezone || "Loading..."}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setShowUserInfoForm(true)}
            >
              <BadgeCheck className="mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="mr-2" />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={toggleTheme}
              className="p-2 cursor-pointer"
            >
              {theme === "light" ? (
                <Moon className="mr-2" />
              ) : (
                <Sun className="mr-2" />
              )}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Form action="/logout" method="post">
            <DropdownMenuItem asChild>
              <button className="w-full flex gap-2 items-center cursor-pointer">
                <LogOut />
                Log out
              </button>
            </DropdownMenuItem>
          </Form>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserInfoForm
        open={showUserInfoForm}
        onOpenChange={setShowUserInfoForm}
      />
    </SidebarMenuItem>
  );
}
