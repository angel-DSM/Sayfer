import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Edit, Trash2, Users as UsersIcon, Shield, User } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface User {
  id: number;
  name: string;
  email: string;
  role: "administrador" | "empleado";
  createdAt: string;
  status: "activo" | "inactivo";
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Carlos Fernández",
      email: "carlos@sayfer.com",
      role: "administrador",
      createdAt: "2026-01-15",
      status: "activo"
    },
    {
      id: 2,
      name: "María González",
      email: "maria@sayfer.com",
      role: "empleado",
      createdAt: "2026-01-20",
      status: "activo"
    },
    {
      id: 3,
      name: "Juan Pérez",
      email: "juan@sayfer.com",
      role: "empleado",
      createdAt: "2026-02-01",
      status: "activo"
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana@sayfer.com",
      role: "empleado",
      createdAt: "2026-02-05",
      status: "inactivo"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "empleado" as const,
    password: ""
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: new Date().toISOString().split('T')[0],
      status: "activo"
    };
    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "empleado", password: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "administrador") {
      return (
        <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
          <Shield className="w-3 h-3 mr-1" />
          Administrador
        </Badge>
      );
    }
    return (
      <Badge className="bg-chart-2/20 text-chart-2 hover:bg-chart-2/30">
        <User className="w-3 h-3 mr-1" />
        Empleado
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "activo") {
      return <Badge className="bg-chart-1/20 text-chart-1 hover:bg-chart-1/30">Activo</Badge>;
    }
    return <Badge className="bg-muted text-muted-foreground">Inactivo</Badge>;
  };

  const activeUsers = users.filter(u => u.status === "activo").length;
  const adminUsers = users.filter(u => u.role === "administrador").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">Administra los usuarios del sistema</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Crear Usuario</span>
              <span className="sm:hidden">Crear</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Agrega un nuevo usuario al sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "administrador" | "empleado") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="empleado">Empleado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Crear Usuario
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuarios</p>
                <p className="text-3xl font-semibold mt-1">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                <p className="text-3xl font-semibold mt-1">{activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administradores</p>
                <p className="text-3xl font-semibold mt-1">{adminUsers}</p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Nombre</TableHead>
                      <TableHead className="whitespace-nowrap">Correo</TableHead>
                      <TableHead className="whitespace-nowrap">Rol</TableHead>
                      <TableHead className="whitespace-nowrap">Fecha de Creación</TableHead>
                      <TableHead className="whitespace-nowrap">Estado</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString('es-ES')}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la información del usuario
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre Completo</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Correo Electrónico</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rol</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value: "administrador" | "empleado") => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="empleado">Empleado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={editingUser.status}
                  onValueChange={(value: "activo" | "inactivo") => setEditingUser({ ...editingUser, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Guardar Cambios
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}