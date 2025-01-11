"use client";
import * as React from "react";
import { useEffect, useRef } from "react";
import {
  useLocation,
  Form,
  useOutletContext,
  Link,
  useNavigate,
  useFetcher,
} from "@remix-run/react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuSubButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { BreadcrumbNavigation } from "../Breadcrumb";
import { sidebarOptions } from "./constants";
import { JournalSelector } from "./JournalSelector";
import { UserMenu } from "./UserMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Journal } from "~/types/journal";

type ContextType = {
  journals: Journal[];
  selectedJournalId: string | null;
};

export const iframeHeight = "800px";
export const description = "A sidebar that collapses to icons.";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const { journals, selectedJournalId } = useOutletContext<ContextType>();
  const location = useLocation();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const searchParams = new URLSearchParams(location.search);
  const journalIdFromUrl = searchParams.get("journalId");
  const lastJournalIdRef = useRef<string | null>(null);

  // Initialize activeJournal from URL, cookie, or first journal
  const [activeJournal, setActiveJournal] = useState(
    journals.find((j) => j.id === journalIdFromUrl) || // URL has priority
      journals.find((j) => j.id === selectedJournalId) || // Then cookie
      journals[0] || // Then first journal
      null
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(
    journals.length === 0 ? true : false
  );

  // Update URL and trigger navigation when active journal changes
  useEffect(() => {
    if (!activeJournal || activeJournal.id === lastJournalIdRef.current) return;
    lastJournalIdRef.current = activeJournal.id;

    // Only update URL if we're on a page that needs the journal ID
    if (location.pathname === "/journals/history") {
      const newParams = new URLSearchParams(location.search);
      newParams.set("journalId", activeJournal.id);
      navigate(`${location.pathname}?${newParams.toString()}`, {
        replace: true,
      });
    }

    // Always update the cookie when journal changes using fetcher
    const formData = new FormData();
    formData.set("journalId", activeJournal.id);
    formData.set("_action", "setJournal");
    fetcher.submit(formData, { method: "post", action: "/set-journal" });
  }, [activeJournal, location.pathname, navigate, fetcher]);

  return (
    <>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <JournalSelector
                activeJournal={activeJournal}
                setActiveJournal={setActiveJournal}
                onCreateNew={() => setIsCreateModalOpen(true)}
                journals={journals}
              />
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent className="scrollbar">
            <SidebarGroup className="p-0 border-t-4 border-border dark:border-darkNavBorder">
              <SidebarMenu className="gap-0">
                {sidebarOptions.map((items) => (
                  <SidebarMenuItem key={items.name}>
                    <SidebarMenuSubButton asChild className="translate-x-0">
                      <Link
                        className={`rounded-none h-auto block border-b-4 border-border dark:border-darkNavBorder p-4 pl-4 font-base text-text/90 dark:text-darkText/90 hover:bg-main50 dark:hover:bg-main-600 dark:hover:text-white ${
                          location.pathname === items.href
                            ? "bg-main50 dark:bg-main-700 dark:text-white"
                            : ""
                        }`}
                        to={items.href}
                      >
                        {React.createElement(items.icon, { size: 24 })}
                        <span className="text-lg">{items.name}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <UserMenu />
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="bg-white dark:bg-secondaryBlack border-l-4">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="mx-1" />
              <BreadcrumbNavigation journalTitle={activeJournal?.title} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 pt-0 dark:bg-darkBg">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      {/* Create New Journal Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-secondaryBlack">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">
              Create New Journal
            </DialogTitle>
          </DialogHeader>
          <Form
            method="post"
            action="/journals/new"
            onSubmit={(e) => {
              const form = e.currentTarget;
              const name = new FormData(form).get("name") as string;
              if (!name) {
                e.preventDefault();
              } else {
                setIsCreateModalOpen(false);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-slate-900 dark:text-white"
              >
                Journal Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                placeholder="My Journal"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="px-4 py-2  rounded-lg transition-colors"
              >
                Create Journal
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
