import {
  AlertTriangle,
  Bird,
  Package,
  Pill,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Datos mock
const mortalidadData = [
  { fecha: "Lun", cantidad: 12 },
  { fecha: "Mar", cantidad: 8 },
  { fecha: "Mié", cantidad: 15 },
  { fecha: "Jue", cantidad: 10 },
  { fecha: "Vie", cantidad: 7 },
  { fecha: "Sáb", cantidad: 9 },
  { fecha: "Dom", cantidad: 11 },
];

const consumoData = [
  { galpon: "Galpón 1", alimento: 450 },
  { galpon: "Galpón 2", alimento: 520 },
  { galpon: "Galpón 3", alimento: 380 },
  { galpon: "Galpón 4", alimento: 490 },
];

const ciclosData = [
  { ciclo: "Ciclo 1", aves: 15000, mortalidad: 3.2 },
  { ciclo: "Ciclo 2", aves: 14500, mortalidad: 2.8 },
  { ciclo: "Ciclo 3", aves: 15200, mortalidad: 3.5 },
  { ciclo: "Ciclo 4 (Actual)", aves: 14800, mortalidad: 2.5 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bird className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-muted-foreground text-sm">Total de Aves Activas</h3>
          <p className="text-3xl mt-2">14,850</p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
          </div>
          <h3 className="text-muted-foreground text-sm">Mortalidad del Día</h3>
          <p className="text-3xl mt-2">11</p>
          <p className="text-sm text-muted-foreground mt-1">0.07% del total</p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Package className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
          <h3 className="text-muted-foreground text-sm">Consumo de Alimento Hoy</h3>
          <p className="text-3xl mt-2">1,840 kg</p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Pill className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="text-muted-foreground text-sm">Medicamentos Aplicados</h3>
          <p className="text-3xl mt-2">3</p>
          <p className="text-sm text-muted-foreground mt-1">Diferentes tipos</p>
        </div>
      </div>

      {/* Alertas */}
      <div className="bg-destructive/5 border-l-4 border-destructive rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
          <div>
            <h4 className="text-destructive mb-1">Alertas Importantes</h4>
            <ul className="text-sm space-y-1 text-foreground">
              <li>• Galpón 3: Consumo de alimento por debajo del promedio</li>
              <li>• Inventario: Stock bajo de vitaminas (quedan 2 días)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de mortalidad */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="mb-4">Tasa de Mortalidad (Última Semana)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mortalidadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cantidad"
                stroke="#2d6a3d"
                strokeWidth={2}
                name="Aves muertas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de consumo por galpón */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="mb-4">Consumo de Alimento por Galpón (Hoy)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consumoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="galpon" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="alimento" fill="#52a364" name="Kg de alimento" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumen por ciclo */}
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <h3 className="mb-4">Resumen por Ciclo de Producción</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Ciclo</th>
                <th className="text-left py-3 px-4">Aves Iniciales</th>
                <th className="text-left py-3 px-4">Tasa de Mortalidad</th>
                <th className="text-left py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ciclosData.map((ciclo, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">{ciclo.ciclo}</td>
                  <td className="py-3 px-4">{ciclo.aves.toLocaleString()}</td>
                  <td className="py-3 px-4">{ciclo.mortalidad}%</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm ${
                        ciclo.ciclo.includes("Actual")
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ciclo.ciclo.includes("Actual") ? "En curso" : "Finalizado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
