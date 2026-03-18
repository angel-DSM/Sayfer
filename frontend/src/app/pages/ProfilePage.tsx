import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Camera, Save, User, Mail, Phone, MapPin, Shield, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    name: localStorage.getItem("userName") || "Usuario Admin",
    email: "admin@sayfer.com",
    phone: "+57 300 123 4567",
    address: "Finca La Esperanza, Vereda San José",
    role: "administrador" as "administrador" | "empleado",
    joinDate: "15 Enero 2026"
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success("Foto actualizada", {
          description: "Haz clic en Guardar Cambios para confirmar"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfile(editedProfile);
    localStorage.setItem("userName", editedProfile.name);
    setIsEditing(false);
    toast.success("Perfil actualizado", {
      description: "Tus cambios han sido guardados exitosamente"
    });
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="space-y-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-semibold text-foreground">Mi Perfil</h2>
        <p className="text-muted-foreground">Administra tu información personal</p>
      </motion.div>

      {/* Avatar & Header Card */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-2 hover:border-primary/30 transition-all duration-300">
          <div className="h-32 bg-gradient-to-r from-primary via-primary/90 to-secondary relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          <CardContent className="pt-0 px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
              {/* Avatar */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-card bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden shadow-xl">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  <motion.button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </motion.div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-semibold mb-1">{profile.name}</h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <Badge className={profile.role === "administrador" 
                    ? "bg-primary/20 text-primary hover:bg-primary/30" 
                    : "bg-chart-2/20 text-chart-2 hover:bg-chart-2/30"}>
                    <Shield className="w-3 h-3 mr-1" />
                    {profile.role === "administrador" ? "Administrador" : "Empleado"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Miembro desde {profile.joinDate}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="shadow-lg">
                    <User className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="shadow-lg">
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                className="space-y-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor="name">Nombre Completo</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.name}</span>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor="email">Correo Electrónico</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor="phone">Teléfono</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Location & Other Info */}
        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-chart-2/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-chart-2" />
                </div>
                Ubicación y Otros Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                className="space-y-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label htmlFor="address">Dirección</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={editedProfile.address}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.address}</span>
                  </div>
                )}
              </motion.div>

              <div className="space-y-2">
                <Label>Rol en el Sistema</Label>
                <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{profile.role}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fecha de Ingreso</Label>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span>{profile.joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Statistics Cards */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-300">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                className="text-center p-4 bg-gradient-to-br from-chart-1/10 to-chart-1/5 rounded-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-2xl font-semibold text-chart-1">24</p>
                <p className="text-xs text-muted-foreground mt-1">Registros este mes</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-gradient-to-br from-chart-2/10 to-chart-2/5 rounded-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-2xl font-semibold text-chart-2">8</p>
                <p className="text-xs text-muted-foreground mt-1">Reportes generados</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-gradient-to-br from-chart-3/10 to-chart-3/5 rounded-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-2xl font-semibold text-chart-3">12</p>
                <p className="text-xs text-muted-foreground mt-1">Alertas atendidas</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-2xl font-semibold text-primary">98%</p>
                <p className="text-xs text-muted-foreground mt-1">Eficiencia</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
