import { useState } from "react";
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
import { Calendar, Download } from "lucide-react";

// Datos mock para gráficos comparativos
const datosComparativosMortalidad = [
  { dia: "01/02", galpon1: 3, galpon2: 5, galpon3: 2, galpon4: 4 },
  { dia: "02/02", galpon1: 2, galpon2: 4, galpon3: 3, galpon4: 2 },
  { dia: "03/02", galpon1: 4, galpon2: 6, galpon3: 1, galpon4: 3 },
  { dia: "04/02", galpon1: 3, galpon2: 3, galpon3: 2, galpon4: 5 },
  { dia: "05/02", galpon1: 5, galpon2: 7, galpon3: 3, galpon4: 2 },
  { dia: "06/02", galpon1: 2, galpon2: 4, galpon3: 2, galpon4: 4 },
  { dia: "07/02", galpon1: 3, galpon2: 5, galpon3: 2, galpon4: 1 },
];

const datosConsumoSemanal = [
  { semana: "Sem 1", alimento: 3200, medicamentos: 120 },
  { semana: "Sem 2", alimento: 3450, medicamentos: 95 },
  { semana: "Sem 3", alimento: 3600, medicamentos: 110 },
  { semana: "Sem 4", alimento: 3800, medicamentos: 130 },
];

const datosCiclos = [
  {
    ciclo: "Ciclo 1",
    inicio: "2025-09-01",
    fin: "2025-11-15",
    avesIniciales: 15000,
    avesFinales: 14520,
    mortalidadTotal: 480,
    tasaMortalidad: "3.2%",
  },
  {
    ciclo: "Ciclo 2",
    inicio: "2025-11-20",
    fin: "2026-02-05",
    avesIniciales: 14500,
    avesFinales: 14094,
    mortalidadTotal: 406,
    tasaMortalidad: "2.8%",
  },
  {
    ciclo: "Ciclo 3",
    inicio: "2026-02-10",
    fin: "En curso",
    avesIniciales: 15200,
    avesFinales: 14850,
    mortalidadTotal: 350,
    tasaMortalidad: "2.3%",
  },
];

export default function Reportes() {
  const [fechaInicio, setFechaInicio] = useState("2026-02-01");
  const [fechaFin, setFechaFin] = useState("2026-02-11");
  const [galponSeleccionado, setGalponSeleccionado] = useState("todos");

  const handleExportar = () => {
    // Mock de exportación
    alert("Exportando reporte a PDF...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-1">Reportes y Análisis</h2>
        <p className="text-muted-foreground">
          Visualiza y analiza el rendimiento de tu granja
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <h3 className="mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="fechaInicio" className="block mb-2 text-sm">
              Fecha Inicio
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label htmlFor="fechaFin" className="block mb-2 text-sm">
              Fecha Fin
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label htmlFor="galpon" className="block mb-2 text-sm">
              Galpón
            </label>
            <select
              id="galpon"
              value={galponSeleccionado}
              onChange={(e) => setGalponSeleccionado(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="todos">Todos los galpones</option>
              <option value="1">Galpón 1</option>
              <option value="2">Galpón 2</option>
              <option value="3">Galpón 3</option>
              <option value="4">Galpón 4</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExportar}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Gráficos comparativos */}
      <div className="space-y-6">
        {/* Mortalidad comparativa */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="mb-4">Comparativa de Mortalidad por Galpón</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={datosComparativosMortalidad}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="galpon1"
                stroke="#2d6a3d"
                name="Galpón 1"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="galpon2"
                stroke="#52a364"
                name="Galpón 2"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="galpon3"
                stroke="#d4a574"
                name="Galpón 3"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="galpon4"
                stroke="#8b7355"
                name="Galpón 4"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Consumo semanal */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="mb-4">Consumo Semanal - Alimento y Medicamentos</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={datosConsumoSemanal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semana" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="alimento" fill="#2d6a3d" name="Alimento (kg)" />
              <Bar dataKey="medicamentos" fill="#52a364" name="Medicamentos (ml)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumen por ciclo */}
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <h3 className="mb-4">Resumen por Ciclo de Producción</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-3 px-4">Ciclo</th>
                <th className="text-left py-3 px-4">Fecha Inicio</th>
                <th className="text-left py-3 px-4">Fecha Fin</th>
                <th className="text-left py-3 px-4">Aves Iniciales</th>
                <th className="text-left py-3 px-4">Aves Finales</th>
                <th className="text-left py-3 px-4">Mortalidad Total</th>
                <th className="text-left py-3 px-4">Tasa de Mortalidad</th>
              </tr>
            </thead>
            <tbody>
              {datosCiclos.map((ciclo, index) => (
                <tr key={index} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm ${
                        ciclo.fin === "En curso"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ciclo.ciclo}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(ciclo.inicio).toLocaleDateString("es-ES")}
                  </td>
                  <td className="py-3 px-4">
                    {ciclo.fin === "En curso"
                      ? ciclo.fin
                      : new Date(ciclo.fin).toLocaleDateString("es-ES")}
                  </td>
                  <td className="py-3 px-4">{ciclo.avesIniciales.toLocaleString()}</td>
                  <td className="py-3 px-4">{ciclo.avesFinales.toLocaleString()}</td>
                  <td className="py-3 px-4">{ciclo.mortalidadTotal.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="text-destructive">{ciclo.tasaMortalidad}</span>
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
