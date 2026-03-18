import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { InventoryPage } from "./pages/InventoryPage";
import { GalponesPage } from "./pages/GalponesPage";
import { DailyRecordsPage } from "./pages/DailyRecordsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { UsersPage } from "./pages/UsersPage";
import { ProfilePage } from "./pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "inventario", Component: InventoryPage },
      { path: "galpones", Component: GalponesPage },
      { path: "registro-diario", Component: DailyRecordsPage },
      { path: "reportes", Component: ReportsPage },
      { path: "usuarios", Component: UsersPage },
      { path: "perfil", Component: ProfilePage },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);