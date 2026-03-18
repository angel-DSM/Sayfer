import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Home, Bird, TrendingUp, Activity } from "lucide-react";

interface Galpon {
  id: number;
  name: string;
  capacity: number;
  currentBirds: number;
  dailyMortality: number;
  dailyFeed: number;
  dailyWater: number;
  temperature: number;
  humidity: number;
  status: "optimo" | "atencion" | "critico";
}

export function GalponesPage() {
  const [galpones] = useState<Galpon[]>([
    {
      id: 1,
      name: "Galpón 1",
      capacity: 5000,
      currentBirds: 4850,
      dailyMortality: 8,
      dailyFeed: 280,
      dailyWater: 450,
      temperature: 24,
      humidity: 65,
      status: "optimo"
    },
    {
      id: 2,
      name: "Galpón 2",
      capacity: 4500,
      currentBirds: 4380,
      dailyMortality: 12,
      dailyFeed: 260,
      dailyWater: 420,
      temperature: 26,
      humidity: 70,
      status: "atencion"
    },
    {
      id: 3,
      name: "Galpón 3",
      capacity: 5000,
      currentBirds: 4920,
      dailyMortality: 3,
      dailyFeed: 310,
      dailyWater: 480,
      temperature: 23,
      humidity: 62,
      status: "optimo"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimo":
        return "bg-chart-1/20 text-chart-1 hover:bg-chart-1/30";
      case "atencion":
        return "bg-chart-2/20 text-chart-2 hover:bg-chart-2/30";
      case "critico":
        return "bg-chart-5/20 text-chart-5 hover:bg-chart-5/30";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "optimo":
        return "Óptimo";
      case "atencion":
        return "Atención";
      case "critico":
        return "Crítico";
      default:
        return status;
    }
  };

  const totalBirds = galpones.reduce((sum, g) => sum + g.currentBirds, 0);
  const totalMortality = galpones.reduce((sum, g) => sum + g.dailyMortality, 0);
  const averageOccupancy = (galpones.reduce((sum, g) => sum + (g.currentBirds / g.capacity) * 100, 0) / galpones.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Galpones</h2>
        <p className="text-muted-foreground">Monitoreo de instalaciones y aves</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Aves</p>
                <p className="text-3xl font-semibold mt-1">{totalBirds.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bird className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mortalidad Total Hoy</p>
                <p className="text-3xl font-semibold mt-1">{totalMortality}</p>
              </div>
              <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-chart-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ocupación Promedio</p>
                <p className="text-3xl font-semibold mt-1">{averageOccupancy}%</p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Galpones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {galpones.map((galpon) => {
          const occupancy = ((galpon.currentBirds / galpon.capacity) * 100).toFixed(1);
          const mortalityRate = ((galpon.dailyMortality / galpon.currentBirds) * 100).toFixed(2);

          return (
            <Card key={galpon.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">{galpon.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(galpon.status)}>
                    {getStatusLabel(galpon.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Bird Count */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Cantidad de Aves</span>
                    <span className="font-semibold">{galpon.currentBirds.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      Capacidad: {galpon.capacity}
                    </span>
                    <span className="text-xs font-medium">{occupancy}%</span>
                  </div>
                </div>

                {/* Mortality */}
                <div className="flex justify-between items-center py-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Mortalidad del día</span>
                  <div className="text-right">
                    <p className="font-semibold">{galpon.dailyMortality} aves</p>
                    <p className="text-xs text-muted-foreground">{mortalityRate}%</p>
                  </div>
                </div>

                {/* Feed & Water */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Consumo de alimento</span>
                    <span className="font-medium">{galpon.dailyFeed} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Consumo de agua</span>
                    <span className="font-medium">{galpon.dailyWater} L</span>
                  </div>
                </div>

                {/* Environmental Conditions */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Temperatura</span>
                    <span className="font-medium">{galpon.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Humedad</span>
                    <span className="font-medium">{galpon.humidity}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}