import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function RegistroDiario() {
  const [registroGuardado, setRegistroGuardado] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    galpon: "1",
    mortalidad: "",
    causaMortalidad: "",
    alimento: "",
    medicamento: "",
    dosisMedicamento: "",
    observaciones: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular guardado
    setRegistroGuardado(true);
    setTimeout(() => {
      setRegistroGuardado(false);
      setFormData({
        ...formData,
        mortalidad: "",
        causaMortalidad: "",
        alimento: "",
        medicamento: "",
        dosisMedicamento: "",
        observaciones: "",
      });
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-1">Registro Diario</h2>
        <p className="text-muted-foreground">
          Registra la mortalidad, consumo de alimento y medicamentos aplicados
        </p>
      </div>

      {/* Mensaje de éxito */}
      {registroGuardado && (
        <div className="bg-primary/10 border border-primary rounded-lg p-4">
          <div className="flex items-center gap-3 text-primary">
            <CheckCircle className="w-5 h-5" />
            <p>Registro guardado exitosamente</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="mb-4">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fecha" className="block mb-2">
                Fecha
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="galpon" className="block mb-2">
                Galpón
              </label>
              <select
                id="galpon"
                name="galpon"
                value={formData.galpon}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="1">Galpón 1</option>
                <option value="2">Galpón 2</option>
                <option value="3">Galpón 3</option>
                <option value="4">Galpón 4</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mortalidad */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="mb-4">Registro de Mortalidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mortalidad" className="block mb-2">
                Cantidad de Aves Muertas
              </label>
              <input
                type="number"
                id="mortalidad"
                name="mortalidad"
                value={formData.mortalidad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="causaMortalidad" className="block mb-2">
                Causa Probable
              </label>
              <select
                id="causaMortalidad"
                name="causaMortalidad"
                value={formData.causaMortalidad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Seleccionar...</option>
                <option value="natural">Muerte natural</option>
                <option value="enfermedad">Enfermedad</option>
                <option value="estres">Estrés térmico</option>
                <option value="trauma">Trauma físico</option>
                <option value="desconocida">Desconocida</option>
              </select>
            </div>
          </div>
        </div>

        {/* Consumo de alimento */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="mb-4">Consumo de Alimento</h3>
          <div>
            <label htmlFor="alimento" className="block mb-2">
              Cantidad de Alimento (kg)
            </label>
            <input
              type="number"
              id="alimento"
              name="alimento"
              value={formData.alimento}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        {/* Medicamentos */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="mb-4">Medicamentos Aplicados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="medicamento" className="block mb-2">
                Medicamento
              </label>
              <select
                id="medicamento"
                name="medicamento"
                value={formData.medicamento}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Seleccionar...</option>
                <option value="vitaminas">Vitaminas Complex B</option>
                <option value="antibiotico">Antibiótico General</option>
                <option value="vacuna">Vacuna Newcastle</option>
                <option value="antiparasitario">Antiparasitario</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="dosisMedicamento" className="block mb-2">
                Dosis (ml o unidades)
              </label>
              <input
                type="text"
                id="dosisMedicamento"
                name="dosisMedicamento"
                value={formData.dosisMedicamento}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: 50ml"
              />
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="mb-4">Observaciones Adicionales</h3>
          <div>
            <label htmlFor="observaciones" className="block mb-2">
              Notas o Comentarios
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Escribe cualquier observación relevante del día..."
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              setFormData({
                fecha: new Date().toISOString().split("T")[0],
                galpon: "1",
                mortalidad: "",
                causaMortalidad: "",
                alimento: "",
                medicamento: "",
                dosisMedicamento: "",
                observaciones: "",
              })
            }
            className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Limpiar Formulario
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Guardar Registro
          </button>
        </div>
      </form>
    </div>
  );
}
