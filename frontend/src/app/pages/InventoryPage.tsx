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
  TableRow 
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
import { Plus, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  registrationDate: string;
  status: "normal" | "bajo" | "critico";
}

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Alimento Balanceado Iniciador",
      category: "Alimento",
      quantity: 2500,
      unit: "kg",
      registrationDate: "2026-02-08",
      status: "normal"
    },
    {
      id: 2,
      name: "Alimento Balanceado Finalizador",
      category: "Alimento",
      quantity: 350,
      unit: "kg",
      registrationDate: "2026-02-09",
      status: "bajo"
    },
    {
      id: 3,
      name: "Vitaminas Multiples",
      category: "Medicamento",
      quantity: 45,
      unit: "L",
      registrationDate: "2026-02-05",
      status: "normal"
    },
    {
      id: 4,
      name: "Antibiótico (Amoxicilina)",
      category: "Medicamento",
      quantity: 8,
      unit: "L",
      registrationDate: "2026-02-10",
      status: "critico"
    },
    {
      id: 5,
      name: "Desinfectante",
      category: "Material",
      quantity: 120,
      unit: "L",
      registrationDate: "2026-02-07",
      status: "normal"
    },
    {
      id: 6,
      name: "Viruta para cama",
      category: "Material",
      quantity: 800,
      unit: "kg",
      registrationDate: "2026-02-06",
      status: "bajo"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Alimento",
    quantity: "",
    unit: "kg",
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: InventoryItem = {
      id: items.length + 1,
      name: newItem.name,
      category: newItem.category,
      quantity: parseFloat(newItem.quantity),
      unit: newItem.unit,
      registrationDate: new Date().toISOString().split('T')[0],
      status: "normal"
    };
    setItems([...items, item]);
    setNewItem({ name: "", category: "Alimento", quantity: "", unit: "kg" });
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <Badge className="bg-chart-1/20 text-chart-1 hover:bg-chart-1/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Normal
          </Badge>
        );
      case "bajo":
        return (
          <Badge className="bg-chart-2/20 text-chart-2 hover:bg-chart-2/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Bajo Stock
          </Badge>
        );
      case "critico":
        return (
          <Badge className="bg-chart-5/20 text-chart-5 hover:bg-chart-5/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Crítico
          </Badge>
        );
      default:
        return null;
    }
  };

  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.status === "bajo" || item.status === "critico").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Inventario</h2>
          <p className="text-muted-foreground">Gestión de insumos y materiales</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Agregar Insumo</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Insumo</DialogTitle>
              <DialogDescription>
                Registra un nuevo insumo en el inventario
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Insumo</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alimento">Alimento</SelectItem>
                    <SelectItem value="Medicamento">Medicamento</SelectItem>
                    <SelectItem value="Material">Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidad</Label>
                  <Select
                    value={newItem.unit}
                    onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="unidades">unidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Agregar Insumo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Insumos</p>
                <p className="text-3xl font-semibold mt-1">{totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas de Stock Bajo</p>
                <p className="text-3xl font-semibold mt-1">{lowStockItems}</p>
              </div>
              <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-chart-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Insumos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Nombre</TableHead>
                      <TableHead className="whitespace-nowrap">Categoría</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Cantidad</TableHead>
                      <TableHead className="whitespace-nowrap">Fecha de Registro</TableHead>
                      <TableHead className="whitespace-nowrap">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium whitespace-nowrap">{item.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.category}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{new Date(item.registrationDate).toLocaleDateString('es-ES')}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}