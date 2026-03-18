import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ClipboardList, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function DailyRecordsPage() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    galpon: "",
    mortality: "",
    mortalityCause: "",
    feedConsumed: "",
    waterConsumed: "",
    medication: "",
    medicationAmount: "",
    temperature: "",
    humidity: "",
    observations: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    toast.success("Registro guardado exitosamente", {
      description: `Datos registrados para ${formData.galpon} - ${formData.date}`
    });
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      galpon: "",
      mortality: "",
      mortalityCause: "",
      feedConsumed: "",
      waterConsumed: "",
      medication: "",
      medicationAmount: "",
      temperature: "",
      humidity: "",
      observations: ""
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Registro Diario</h2>
        <p className="text-muted-foreground">Registra datos diarios de producción</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <CardTitle>Nuevo Registro</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="galpon">Galpón</Label>
                <Select
                  value={formData.galpon}
                  onValueChange={(value) => handleChange("galpon", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar galpón" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="galpon1">Galpón 1</SelectItem>
                    <SelectItem value="galpon2">Galpón 2</SelectItem>
                    <SelectItem value="galpon3">Galpón 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mortality Section */}
            <div className="space-y-4 p-4 bg-chart-5/5 rounded-lg border border-chart-5/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-chart-5" />
                <h3 className="font-medium">Registro de Mortalidad</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mortality">Número de Aves Muertas</Label>
                  <Input
                    id="mortality"
                    type="number"
                    min="0"
                    value={formData.mortality}
                    onChange={(e) => handleChange("mortality", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortalityCause">Causa Principal</Label>
                  <Select
                    value={formData.mortalityCause}
                    onValueChange={(value) => handleChange("mortalityCause", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar causa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="enfermedad">Enfermedad</SelectItem>
                      <SelectItem value="estres">Estrés</SelectItem>
                      <SelectItem value="desconocida">Desconocida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Feed & Water Section */}
            <div className="space-y-4 p-4 bg-chart-1/5 rounded-lg border border-chart-1/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-chart-1" />
                <h3 className="font-medium">Consumo de Alimento y Agua</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feedConsumed">Alimento Consumido (kg)</Label>
                  <Input
                    id="feedConsumed"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.feedConsumed}
                    onChange={(e) => handleChange("feedConsumed", e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterConsumed">Agua Consumida (L)</Label>
                  <Input
                    id="waterConsumed"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.waterConsumed}
                    onChange={(e) => handleChange("waterConsumed", e.target.value)}
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            {/* Medication Section */}
            <div className="space-y-4 p-4 bg-chart-3/5 rounded-lg border border-chart-3/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-chart-3" />
                <h3 className="font-medium">Medicamentos Aplicados</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medication">Tipo de Medicamento</Label>
                  <Select
                    value={formData.medication}
                    onValueChange={(value) => handleChange("medication", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ninguno">Ninguno</SelectItem>
                      <SelectItem value="vitaminas">Vitaminas</SelectItem>
                      <SelectItem value="antibiotico">Antibiótico</SelectItem>
                      <SelectItem value="antiparasitario">Antiparasitario</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicationAmount">Cantidad (L o kg)</Label>
                  <Input
                    id="medicationAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.medicationAmount}
                    onChange={(e) => handleChange("medicationAmount", e.target.value)}
                    placeholder="0.00"
                    disabled={formData.medication === "ninguno"}
                  />
                </div>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="space-y-4">
              <h3 className="font-medium">Condiciones Ambientales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatura (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => handleChange("temperature", e.target.value)}
                    placeholder="23.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humidity">Humedad (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={formData.humidity}
                    onChange={(e) => handleChange("humidity", e.target.value)}
                    placeholder="65"
                  />
                </div>
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange("observations", e.target.value)}
                placeholder="Ingresa cualquier observación relevante..."
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Guardar Registro
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="flex-1 sm:flex-initial"
                onClick={() => setFormData({
                  date: new Date().toISOString().split('T')[0],
                  galpon: "",
                  mortality: "",
                  mortalityCause: "",
                  feedConsumed: "",
                  waterConsumed: "",
                  medication: "",
                  medicationAmount: "",
                  temperature: "",
                  humidity: "",
                  observations: ""
                })}
              >
                Limpiar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}