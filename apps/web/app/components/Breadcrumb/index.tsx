import { useLocation } from "@remix-run/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface BreadcrumbNavigationProps {
  journalTitle: string;
}

export function BreadcrumbNavigation({
  journalTitle,
}: BreadcrumbNavigationProps) {
  const location = useLocation();

  // Convert pathname to readable title
  const getPageTitle = (pathname: string) => {
    // Remove leading and trailing slashes
    const path = pathname.replace(/^\/|\/$/g, "");

    if (!path) return "Home";

    // Convert kebab-case to Title Case
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block text-text dark:text-darkText">
          <BreadcrumbLink href="#">{journalTitle}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block text-text dark:text-darkText" />
        <BreadcrumbItem>
          <BreadcrumbPage className="dark:text-darkText text-text">
            {getPageTitle(location.pathname)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
