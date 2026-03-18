import { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";

interface Insumo {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  unidad: string;
  fecha: string;
  estado: "normal" | "bajo";
}

// Datos mock
const insumosIniciales: Insumo[] = [
  {
    id: 1,
    nombre: "Alimento Iniciador",
    categoria: "Alimento",
    cantidad: 2500,
    unidad: "kg",
    fecha: "2026-02-08",
    estado: "normal",
  },
  {
    id: 2,
    nombre: "Alimento Crecimiento",
    categoria: "Alimento",
    cantidad: 1800,
    unidad: "kg",
    fecha: "2026-02-09",
    estado: "normal",
  },
  {
    id: 3,
    nombre: "Vitaminas Complex B",
    categoria: "Medicamentos",
    cantidad: 15,
    unidad: "litros",
    fecha: "2026-02-10",
    estado: "bajo",
  },
  {
    id: 4,
    nombre: "Antibiótico General",
    categoria: "Medicamentos",
    cantidad: 45,
    unidad: "unidades",
    fecha: "2026-02-07",
    estado: "normal",
  },
  {
    id: 5,
    nombre: "Desinfectante",
    categoria: "Materiales",
    cantidad: 80,
    unidad: "litros",
    fecha: "2026-02-11",
    estado: "normal",
  },
  {
    id: 6,
    nombre: "Vacuna Newcastle",
    categoria: "Medicamentos",
    cantidad: 8,
    unidad: "frascos",
    fecha: "2026-02-06",
    estado: "bajo",
  },
];

export default function Inventario() {
  const [insumos, setInsumos] = useState<Insumo[]>(insumosIniciales);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoInsumo, setNuevoInsumo] = useState({
    nombre: "",
    categoria: "Alimento",
    cantidad: "",
    unidad: "kg",
  });

  const handleAgregarInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    const insumo: Insumo = {
      id: insumos.length + 1,
      nombre: nuevoInsumo.nombre,
      categoria: nuevoInsumo.categoria,
      cantidad: Number(nuevoInsumo.cantidad),
      unidad: nuevoInsumo.unidad,
      fecha: new Date().toISOString().split("T")[0],
      estado: "normal",
    };
    setInsumos([...insumos, insumo]);
    setMostrarModal(false);
    setNuevoInsumo({
      nombre: "",
      categoria: "Alimento",
      cantidad: "",
      unidad: "kg",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header con botón */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Inventario de Insumos</h2>
          <p className="text-muted-foreground">
            Gestión de alimentos, medicamentos y materiales
          </p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Insumo
        </button>
      </div>

      {/* Alerta de stock bajo */}
      <div className="bg-destructive/5 border-l-4 border-destructive rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div>
            <h4 className="text-destructive mb-1">Stock Bajo</h4>
            <p className="text-sm text-foreground">
              {insumos.filter((i) => i.estado === "bajo").length} insumos requieren
              reabastecimiento
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de insumos */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-4 px-6">Nombre</th>
                <th className="text-left py-4 px-6">Categoría</th>
                <th className="text-left py-4 px-6">Cantidad</th>
                <th className="text-left py-4 px-6">Fecha de Registro</th>
                <th className="text-left py-4 px-6">Estado</th>
              </tr>
            </thead>
            <tbody>
              {insumos.map((insumo) => (
                <tr key={insumo.id} className="border-b border-border last:border-0">
                  <td className="py-4 px-6">{insumo.nombre}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-3 py-1 rounded-full text-sm bg-secondary/10 text-secondary">
                      {insumo.categoria}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {insumo.cantidad} {insumo.unidad}
                  </td>
                  <td className="py-4 px-6">
                    {new Date(insumo.fecha).toLocaleDateString("es-ES")}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm ${
                        insumo.estado === "normal"
                          ? "bg-primary/10 text-primary"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {insumo.estado === "normal" ? "Normal" : "Bajo Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para agregar insumo */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl mb-4">Agregar Nuevo Insumo</h3>
            <form onSubmit={handleAgregarInsumo} className="space-y-4">
              <div>
                <label className="block mb-2">Nombre</label>
                <input
                  type="text"
                  value={nuevoInsumo.nombre}
                  onChange={(e) =>
                    setNuevoInsumo({ ...nuevoInsumo, nombre: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Categoría</label>
                <select
                  value={nuevoInsumo.categoria}
                  onChange={(e) =>
                    setNuevoInsumo({ ...nuevoInsumo, categoria: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Alimento">Alimento</option>
                  <option value="Medicamentos">Medicamentos</option>
                  <option value="Materiales">Materiales</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Cantidad</label>
                  <input
                    type="number"
                    value={nuevoInsumo.cantidad}
                    onChange={(e) =>
                      setNuevoInsumo({ ...nuevoInsumo, cantidad: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Unidad</label>
                  <select
                    value={nuevoInsumo.unidad}
                    onChange={(e) =>
                      setNuevoInsumo({ ...nuevoInsumo, unidad: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="kg">kg</option>
                    <option value="litros">litros</option>
                    <option value="unidades">unidades</option>
                    <option value="frascos">frascos</option>
                  </select>
                </div>
              </div>

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
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
