import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, FileText, Download } from "lucide-react";

export function ReportsPage() {
  const [dateRange, setDateRange] = useState("7days");
  const [selectedGalpon, setSelectedGalpon] = useState("todos");

  // Mock comparative data
  const comparativeData = [
    { date: "05/02", galpon1: 8, galpon2: 12, galpon3: 5 },
    { date: "06/02", galpon1: 7, galpon2: 10, galpon3: 6 },
    { date: "07/02", galpon1: 9, galpon2: 15, galpon3: 4 },
    { date: "08/02", galpon1: 6, galpon2: 11, galpon3: 7 },
    { date: "09/02", galpon1: 8, galpon2: 13, galpon3: 5 },
    { date: "10/02", galpon1: 10, galpon2: 14, galpon3: 6 },
    { date: "11/02", galpon1: 8, galpon2: 12, galpon3: 3 },
  ];

  const feedConsumptionData = [
    { date: "05/02", galpon1: 275, galpon2: 255, galpon3: 305 },
    { date: "06/02", galpon1: 280, galpon2: 260, galpon3: 310 },
    { date: "07/02", galpon1: 278, galpon2: 258, galpon3: 308 },
    { date: "08/02", galpon1: 282, galpon2: 262, galpon3: 312 },
    { date: "09/02", galpon1: 285, galpon2: 265, galpon3: 315 },
    { date: "10/02", galpon1: 280, galpon2: 260, galpon3: 310 },
    { date: "11/02", galpon1: 280, galpon2: 260, galpon3: 310 },
  ];

  const cycleData = [
    {
      cycle: "Ciclo 1 (Nov-Dic 2025)",
      avesIniciales: 4200,
      avesFinales: 4115,
      mortalidadTotal: 85,
      tasaMortalidad: "2.02%",
      consumoAlimento: 32500,
      pesoPromedio: 2.3
    },
    {
      cycle: "Ciclo 2 (Dic-Ene 2026)",
      avesIniciales: 4100,
      avesFinales: 4028,
      mortalidadTotal: 72,
      tasaMortalidad: "1.76%",
      consumoAlimento: 31200,
      pesoPromedio: 2.4
    },
    {
      cycle: "Ciclo 3 (Actual - Ene-Feb 2026)",
      avesIniciales: 4150,
      avesFinales: 4092,
      mortalidadTotal: 58,
      tasaMortalidad: "1.40%",
      consumoAlimento: 28800,
      pesoPromedio: 2.2
    }
  ];

  const handleExport = () => {
    // Mock export functionality
    alert("Exportando reporte en formato PDF...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Reportes</h2>
          <p className="text-muted-foreground">Análisis y estadísticas de producción</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Exportar Reporte</span>
          <span className="sm:hidden">Exportar</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateRange">Rango de Fechas</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 días</SelectItem>
                  <SelectItem value="15days">Últimos 15 días</SelectItem>
                  <SelectItem value="30days">Últimos 30 días</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="galpon">Galpón</Label>
              <Select value={selectedGalpon} onValueChange={setSelectedGalpon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Galpones</SelectItem>
                  <SelectItem value="galpon1">Galpón 1</SelectItem>
                  <SelectItem value="galpon2">Galpón 2</SelectItem>
                  <SelectItem value="galpon3">Galpón 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mortality Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Comparativa de Mortalidad por Galpón</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comparativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ebe6" />
                <XAxis dataKey="date" stroke="#6b7465" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7465" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8ebe6',
                    borderRadius: '8px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="galpon1" stroke="#4a7c59" strokeWidth={2} name="Galpón 1" />
                <Line type="monotone" dataKey="galpon2" stroke="#8b7355" strokeWidth={2} name="Galpón 2" />
                <Line type="monotone" dataKey="galpon3" stroke="#6b9b7f" strokeWidth={2} name="Galpón 3" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feed Consumption Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Comparativa de Consumo de Alimento (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feedConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ebe6" />
                <XAxis dataKey="date" stroke="#6b7465" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7465" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8ebe6',
                    borderRadius: '8px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="galpon1" fill="#4a7c59" name="Galpón 1" />
                <Bar dataKey="galpon2" fill="#8b7355" name="Galpón 2" />
                <Bar dataKey="galpon3" fill="#6b9b7f" name="Galpón 3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Production Cycles Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Ciclo de Producción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">Ciclo</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">Aves Iniciales</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">Aves Finales</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">Mortalidad Total</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">Tasa</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">Consumo Total (kg)</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">Peso Prom. (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cycleData.map((cycle, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 font-medium whitespace-nowrap">{cycle.cycle}</td>
                        <td className="p-3 text-right whitespace-nowrap">{cycle.avesIniciales.toLocaleString()}</td>
                        <td className="p-3 text-right whitespace-nowrap">{cycle.avesFinales.toLocaleString()}</td>
                        <td className="p-3 text-right text-chart-5 whitespace-nowrap">{cycle.mortalidadTotal}</td>
                        <td className="p-3 text-right font-medium whitespace-nowrap">{cycle.tasaMortalidad}</td>
                        <td className="p-3 text-right whitespace-nowrap">{cycle.consumoAlimento.toLocaleString()}</td>
                        <td className="p-3 text-right whitespace-nowrap">{cycle.pesoPromedio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Tasa Mortalidad Promedio</p>
            <p className="text-2xl sm:text-3xl font-semibold text-chart-1">1.73%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Consumo Diario Prom.</p>
            <p className="text-2xl sm:text-3xl font-semibold text-chart-2">830 kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Eficiencia Alimenticia</p>
            <p className="text-2xl sm:text-3xl font-semibold text-chart-3">1.85</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Peso Promedio Final</p>
            <p className="text-2xl sm:text-3xl font-semibold text-primary">2.3 kg</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}