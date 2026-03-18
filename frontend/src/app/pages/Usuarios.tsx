import { useState } from "react";
import { Plus, Edit2, Trash2, Shield, User } from "lucide-react";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "Administrador" | "Empleado";
  estado: "activo" | "inactivo";
  ultimoAcceso: string;
}

// Datos mock
const usuariosIniciales: Usuario[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@sayfer.com",
    rol: "Administrador",
    estado: "activo",
    ultimoAcceso: "2026-02-11",
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria.garcia@sayfer.com",
    rol: "Empleado",
    estado: "activo",
    ultimoAcceso: "2026-02-11",
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@sayfer.com",
    rol: "Empleado",
    estado: "activo",
    ultimoAcceso: "2026-02-10",
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    email: "ana.martinez@sayfer.com",
    rol: "Empleado",
    estado: "inactivo",
    ultimoAcceso: "2026-02-05",
  },
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "Empleado" as "Administrador" | "Empleado",
    password: "",
  });

  const handleAbrirModal = (usuario?: Usuario) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        password: "",
      });
    } else {
      setUsuarioEditando(null);
      setFormData({
        nombre: "",
        email: "",
        rol: "Empleado",
        password: "",
      });
    }
    setMostrarModal(true);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuarioEditando) {
      // Editar usuario existente
      setUsuarios(
        usuarios.map((u) =>
          u.id === usuarioEditando.id
            ? { ...u, nombre: formData.nombre, email: formData.email, rol: formData.rol }
            : u
        )
      );
    } else {
      // Crear nuevo usuario
      const nuevoUsuario: Usuario = {
        id: usuarios.length + 1,
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol,
        estado: "activo",
        ultimoAcceso: "-",
      };
      setUsuarios([...usuarios, nuevoUsuario]);
    }
    setMostrarModal(false);
  };

  const handleEliminar = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con botón */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">
            Administra los usuarios y sus permisos de acceso
          </p>
        </div>
        <button
          onClick={() => handleAbrirModal()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Crear Usuario
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-muted-foreground text-sm">Total Usuarios</h3>
          </div>
          <p className="text-3xl">{usuarios.length}</p>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-secondary" />
            <h3 className="text-muted-foreground text-sm">Administradores</h3>
          </div>
          <p className="text-3xl">
            {usuarios.filter((u) => u.rol === "Administrador").length}
          </p>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-accent-foreground" />
            <h3 className="text-muted-foreground text-sm">Empleados</h3>
          </div>
          <p className="text-3xl">
            {usuarios.filter((u) => u.rol === "Empleado").length}
          </p>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-4 px-6">Nombre</th>
                <th className="text-left py-4 px-6">Email</th>
                <th className="text-left py-4 px-6">Rol</th>
                <th className="text-left py-4 px-6">Estado</th>
                <th className="text-left py-4 px-6">Último Acceso</th>
                <th className="text-left py-4 px-6">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-border last:border-0">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                        {usuario.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span>{usuario.nombre}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{usuario.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        usuario.rol === "Administrador"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {usuario.rol === "Administrador" ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm ${
                        usuario.estado === "activo"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {usuario.ultimoAcceso === "-"
                      ? "-"
                      : new Date(usuario.ultimoAcceso).toLocaleDateString("es-ES")}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAbrirModal(usuario)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEliminar(usuario.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar usuario */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl mb-4">
              {usuarioEditando ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </h3>
            <form onSubmit={handleGuardar} className="space-y-4">
              <div>
                <label className="block mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Rol</label>
                <select
                  value={formData.rol}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rol: e.target.value as "Administrador" | "Empleado",
                    })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Empleado">Empleado</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              {!usuarioEditando && (
                <div>
                  <label className="block mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required={!usuarioEditando}
                  />
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {usuarioEditando ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
