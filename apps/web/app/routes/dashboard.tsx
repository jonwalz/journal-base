import { Outlet } from "@remix-run/react";
import { MainLayout } from "~/layouts/MainLayout";

export default function DashboardLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
