import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventario from "./pages/Inventario";
import Galpones from "./pages/Galpones";
import RegistroDiario from "./pages/RegistroDiario";
import Reportes from "./pages/Reportes";
import Usuarios from "./pages/Usuarios";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "inventario", Component: Inventario },
      { path: "galpones", Component: Galpones },
      { path: "registro", Component: RegistroDiario },
      { path: "reportes", Component: Reportes },
      { path: "usuarios", Component: Usuarios },
    ],
  },
]);
