import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { 
  Bird, 
  AlertTriangle, 
  Package, 
  Syringe,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "motion/react";

export function DashboardPage() {
  // Mock data for stats
  const stats = [
    {
      title: "Aves Activas",
      value: "12,450",
      change: "+250",
      trend: "up",
      icon: Bird,
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      title: "Mortalidad del Día",
      value: "23",
      change: "-5 vs ayer",
      trend: "down",
      icon: AlertTriangle,
      bgColor: "bg-chart-5/10",
      iconColor: "text-chart-5"
    },
    {
      title: "Consumo de Alimento",
      value: "850 kg",
      change: "+45 kg",
      trend: "up",
      icon: Package,
      bgColor: "bg-chart-2/10",
      iconColor: "text-chart-2"
    },
    {
      title: "Medicamentos Usados",
      value: "12 L",
      change: "+2 L",
      trend: "up",
      icon: Syringe,
      bgColor: "bg-chart-3/10",
      iconColor: "text-chart-3"
    }
  ];

  // Mock mortality data
  const mortalityData = [
    { date: "05/02", tasa: 0.18 },
    { date: "06/02", tasa: 0.22 },
    { date: "07/02", tasa: 0.15 },
    { date: "08/02", tasa: 0.19 },
    { date: "09/02", tasa: 0.17 },
    { date: "10/02", tasa: 0.21 },
    { date: "11/02", tasa: 0.18 }
  ];

  // Mock consumption data by coop
  const consumptionData = [
    { galpon: "Galpón 1", alimento: 280, agua: 450 },
    { galpon: "Galpón 2", alimento: 260, agua: 420 },
    { galpon: "Galpón 3", alimento: 310, agua: 480 },
  ];

  // Mock production cycle data
  const cycleData = [
    { name: "Ciclo 1", aves: 4200, mortalidad: 85 },
    { name: "Ciclo 2", aves: 4100, mortalidad: 72 },
    { name: "Ciclo 3 (Actual)", aves: 4150, mortalidad: 58 }
  ];

  // Alerts
  const alerts = [
    { id: 1, message: "Inventario bajo: Alimento balanceado", severity: "high" },
    { id: 2, message: "Revisión veterinaria programada: Galpón 2", severity: "medium" },
    { id: 3, message: "Temperatura elevada en Galpón 1", severity: "high" }
  ];

  const COLORS = ['#4a7c59', '#8b7355', '#6b9b7f'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Resumen general de la producción</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <motion.p
                        className="text-3xl font-semibold mb-2"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                      >
                        {stat.value}
                      </motion.p>
                      <div className="flex items-center gap-1 text-sm">
                        {stat.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-chart-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-chart-5" />
                        )}
                        <span className={stat.trend === "up" ? "text-chart-1" : "text-chart-5"}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Alerts */}
      <motion.div variants={itemVariants}>
        <Card className="border-chart-5/20 bg-chart-5/5 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <AlertCircle className="w-5 h-5 text-chart-5" />
              </motion.div>
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                    alert.severity === "high" ? "bg-chart-5/10 hover:bg-chart-5/20" : "bg-chart-2/10 hover:bg-chart-2/20"
                  } transition-colors`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      alert.severity === "high" ? "text-chart-5" : "text-chart-2"
                    }`}
                  />
                  <span className="text-sm">{alert.message}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mortality Rate Chart */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Tasa de Mortalidad (Últimos 7 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mortalityData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="tasa" 
                    stroke="#4a7c59" 
                    strokeWidth={3}
                    dot={{ fill: '#4a7c59', r: 5 }}
                    name="Tasa (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Consumption by Coop */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Consumo por Galpón (Hoy)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ebe6" />
                  <XAxis dataKey="galpon" stroke="#6b7465" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7465" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e8ebe6',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="alimento" fill="#4a7c59" name="Alimento (kg)" />
                  <Bar dataKey="agua" fill="#8b7355" name="Agua (L)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Production Cycles Summary */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20">
          <CardHeader>
            <CardTitle>Resumen por Ciclo de Producción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cycleData.map((cycle, index) => (
                <motion.div
                  key={index}
                  className="p-4 border border-border rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <h4 className="font-medium mb-3">{cycle.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Aves iniciales:</span>
                      <span className="font-medium">{cycle.aves.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mortalidad total:</span>
                      <span className="font-medium text-chart-5">{cycle.mortalidad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tasa mortalidad:</span>
                      <span className="font-medium">
                        {((cycle.mortalidad / cycle.aves) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}