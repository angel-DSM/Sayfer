import { Home, Bird, TrendingDown, Package } from "lucide-react";

interface Galpon {
  id: number;
  nombre: string;
  capacidad: number;
  avesActuales: number;
  mortalidadHoy: number;
  consumoAlimento: number;
  estado: "activo" | "mantenimiento" | "vacio";
}

// Datos mock
const galpones: Galpon[] = [
  {
    id: 1,
    nombre: "Galpón 1",
    capacidad: 4000,
    avesActuales: 3850,
    mortalidadHoy: 3,
    consumoAlimento: 450,
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Galpón 2",
    capacidad: 4500,
    avesActuales: 4320,
    mortalidadHoy: 5,
    consumoAlimento: 520,
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Galpón 3",
    capacidad: 3500,
    avesActuales: 3200,
    mortalidadHoy: 2,
    consumoAlimento: 380,
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Galpón 4",
    capacidad: 4000,
    avesActuales: 3480,
    mortalidadHoy: 1,
    consumoAlimento: 490,
    estado: "activo",
  },
];

export default function Galpones() {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-primary/10 text-primary";
      case "mantenimiento":
        return "bg-accent/20 text-accent-foreground";
      case "vacio":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getOcupacion = (actual: number, capacidad: number) => {
    return ((actual / capacidad) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-1">Gestión de Galpones</h2>
        <p className="text-muted-foreground">
          Monitoreo de aves, mortalidad y consumo por galpón
        </p>
      </div>

      {/* Grid de galpones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {galpones.map((galpon) => (
          <div
            key={galpon.id}
            className="bg-card rounded-lg p-6 shadow-sm border border-border"
          >
            {/* Header del galpón */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl">{galpon.nombre}</h3>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs mt-1 ${getEstadoColor(
                      galpon.estado
                    )}`}
                  >
                    {galpon.estado === "activo" && "Activo"}
                    {galpon.estado === "mantenimiento" && "Mantenimiento"}
                    {galpon.estado === "vacio" && "Vacío"}
                  </span>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="space-y-4">
              {/* Aves actuales */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bird className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Aves Actuales</p>
                    <p className="text-lg">
                      {galpon.avesActuales.toLocaleString()} / {galpon.capacidad.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Ocupación</p>
                  <p className="text-lg">
                    {getOcupacion(galpon.avesActuales, galpon.capacidad)}%
                  </p>
                </div>
              </div>

              {/* Mortalidad */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mortalidad Hoy</p>
                    <p className="text-lg">{galpon.mortalidadHoy} aves</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Porcentaje</p>
                  <p className="text-lg">
                    {((galpon.mortalidadHoy / galpon.avesActuales) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Consumo de alimento */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Consumo de Alimento</p>
                    <p className="text-lg">{galpon.consumoAlimento} kg</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Promedio/ave</p>
                  <p className="text-lg">
                    {((galpon.consumoAlimento / galpon.avesActuales) * 1000).toFixed(0)} g
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de detalles */}
            <button className="w-full mt-4 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
              Ver Historial Completo
            </button>
          </div>
        ))}
      </div>

      {/* Resumen general */}
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <h3 className="mb-4">Resumen General</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total de Aves</p>
            <p className="text-2xl">
              {galpones.reduce((sum, g) => sum + g.avesActuales, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Capacidad Total</p>
            <p className="text-2xl">
              {galpones.reduce((sum, g) => sum + g.capacidad, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Mortalidad Total Hoy</p>
            <p className="text-2xl">
              {galpones.reduce((sum, g) => sum + g.mortalidadHoy, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Consumo Total</p>
            <p className="text-2xl">
              {galpones.reduce((sum, g) => sum + g.consumoAlimento, 0)} kg
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
