import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Package,
  Home,
  FileText,
  BarChart3,
  Users,
  LogOut,
  Sprout,
} from "lucide-react";

const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/inventario", label: "Inventario", icon: Package },
  { path: "/galpones", label: "Galpones", icon: Home },
  { path: "/registro", label: "Registro Diario", icon: FileText },
  { path: "/reportes", label: "Reportes", icon: BarChart3 },
  { path: "/usuarios", label: "Usuarios", icon: Users },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-sidebar-primary rounded-lg">
              <Sprout className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl">SAYFER</h2>
              <p className="text-xs text-sidebar-foreground/80">Gestión Avícola</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-primary">
              {menuItems.find((item) =>
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path)
              )?.label || "Dashboard"}
            </h1>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm">Juan Pérez</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                JP
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
