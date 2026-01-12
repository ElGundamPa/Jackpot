import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAgentConfigs,
  addAgent,
  updateAgent,
  deleteAgent,
  saveTeamIcons,
  getTeamIcons,
  getAvailableTeams,
  type AgentConfig,
} from "@/services/agentConfigService";
import { useGoogleSheetData } from "@/hooks/useGoogleSheetData";
import { CONFIG } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, Plus, ArrowLeft, Save, Users, Music, Image, Settings, Trophy, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  // Obtener equipos de Google Sheets para filtrar solo agentes reales
  const { teams: googleSheetTeams } = useGoogleSheetData(CONFIG.POLLING_INTERVAL);
  const [agents, setAgents] = useState<Record<string, AgentConfig>>({});
  const [teamIcons, setTeamIcons] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentConfig | null>(null);
  const [formData, setFormData] = useState<AgentConfig>({
    name: "",
    photo: "",
    song: "",
    teamId: "mesa-1",
  });

  useEffect(() => {
    loadData();
  }, [googleSheetTeams]); // Recargar cuando cambien los equipos de Google Sheets

  const loadData = () => {
    // Obtener todos los agentes de Google Sheets
    const allAgentsFromSheets: string[] = [];
    googleSheetTeams.forEach(team => {
      team.agents.forEach(agent => {
        allAgentsFromSheets.push(agent.name.toLowerCase().trim());
      });
    });

    // Obtener configuraciones de localStorage
    const allConfigs = getAgentConfigs();
    
    // Filtrar: solo mostrar agentes que existen en Google Sheets
    const filteredConfigs: Record<string, AgentConfig> = {};
    Object.entries(allConfigs).forEach(([agentName, config]) => {
      const normalizedName = agentName.toLowerCase().trim();
      if (allAgentsFromSheets.includes(normalizedName)) {
        filteredConfigs[agentName] = config;
      } else {
        console.log(`⚠️ Agente "${agentName}" encontrado en localStorage pero NO existe en Google Sheets - será ocultado`);
      }
    });
    
    setAgents(filteredConfigs);
    const icons = getTeamIcons();
    // Asegurar que siempre haya 3 iconos
    const defaultIcons = [
      "https://firebasestorage.googleapis.com/v0/b/verdeando-3baf2.appspot.com/o/Nico.png?alt=media&token=94373b1a-eafb-418b-8bd2-5973a298adcc",
      "https://firebasestorage.googleapis.com/v0/b/verdeando-3baf2.appspot.com/o/Enzo.png?alt=media&token=e149ac46-f387-4408-97f9-29edc42e469e",
      "https://firebasestorage.googleapis.com/v0/b/verdeando-3baf2.appspot.com/o/Generated%20Image%20December%2018%2C%202025%20-%205_22PM.png?alt=media&token=29e91801-e0af-463e-ac41-6fb388c53e65"
    ];
    setTeamIcons(icons.length >= 3 ? icons : defaultIcons);
  };

  const handleOpenAddDialog = () => {
    setEditingAgent(null);
    setFormData({
      name: "",
      photo: "",
      song: "",
      teamId: "mesa-1",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (agent: AgentConfig) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      photo: agent.photo || "",
      song: agent.song || "",
      teamId: agent.teamId || "mesa-1",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAgent(null);
    setFormData({
      name: "",
      photo: "",
      song: "",
      teamId: "mesa-1",
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del agente es requerido",
        variant: "destructive",
      });
      return;
    }

    // Obtener todos los agentes de Google Sheets
    const allAgentsFromSheets: string[] = [];
    googleSheetTeams.forEach(team => {
      team.agents.forEach(agent => {
        allAgentsFromSheets.push(agent.name.toLowerCase().trim());
      });
    });

    // Verificar si el agente existe en Google Sheets
    const normalizedName = formData.name.toLowerCase().trim();
    if (!allAgentsFromSheets.includes(normalizedName)) {
      toast({
        title: "Error",
        description: `El agente "${formData.name}" no existe en Google Sheets. Solo puedes gestionar agentes que existen en el sistema.`,
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingAgent) {
        updateAgent(editingAgent.name, formData);
        toast({
          title: "Éxito",
          description: `Agente "${formData.name}" actualizado correctamente`,
        });
      } else {
        // Verificar si ya existe en localStorage
        if (agents[formData.name]) {
          toast({
            title: "Error",
            description: "Ya existe una configuración para este agente",
            variant: "destructive",
          });
          return;
        }
        addAgent(formData);
        toast({
          title: "Éxito",
          description: `Agente "${formData.name}" agregado correctamente`,
        });
      }
      loadData();
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar el agente",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (name: string) => {
    if (confirm(`¿Estás seguro de eliminar a "${name}"?`)) {
      try {
        deleteAgent(name);
        toast({
          title: "Éxito",
          description: `Agente "${name}" eliminado correctamente`,
        });
        loadData();
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al eliminar el agente",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveTeamIcons = () => {
    try {
      saveTeamIcons(teamIcons);
      toast({
        title: "Éxito",
        description: "Iconos de equipos guardados correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar los iconos",
        variant: "destructive",
      });
    }
  };

  const availableTeams = getAvailableTeams();
  const agentsList = Object.values(agents);
  
  // Estadísticas
  const stats = {
    total: agentsList.length,
    withPhoto: agentsList.filter(a => a.photo && a.photo.trim() !== "").length,
    withSong: agentsList.filter(a => a.song && a.song.trim() !== "").length,
    byTeam: {
      "mesa-1": agentsList.filter(a => a.teamId === "mesa-1").length,
      "mesa-2": agentsList.filter(a => a.teamId === "mesa-2").length,
      "mesa-3": agentsList.filter(a => a.teamId === "mesa-3").length,
    }
  };

  const getTeamBadgeColor = (teamId: string) => {
    if (teamId === "mesa-1") return "bg-purple-500/20 text-purple-300 border-purple-500/50";
    if (teamId === "mesa-2") return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    if (teamId === "mesa-3") return "bg-orange-500/20 text-orange-300 border-orange-500/50";
    return "bg-slate-500/20 text-slate-300 border-slate-500/50";
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 via-blue-900 to-slate-900 overflow-y-auto">
      {/* Patrón de fondo decorativo */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto p-6 lg:p-8 pb-12">
        {/* Header Mejorado */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black text-white mb-1 tracking-tight">
                    Panel de Administración
                  </h1>
                  <p className="text-slate-300 text-lg">Gestiona agentes, equipos y configuraciones</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:border-white/30 transition-all"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al Dashboard
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={handleOpenAddDialog}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Agente
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-slate-700/50 max-w-3xl w-[95vw] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                  <DialogHeader className="space-y-3 pb-4 border-b border-slate-700/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${editingAgent ? 'bg-blue-500/20' : 'bg-green-500/20'}`}>
                        {editingAgent ? (
                          <Edit className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Plus className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      <div>
                        <DialogTitle className="text-2xl font-bold">
                          {editingAgent ? "Editar Agente" : "Nuevo Agente"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 mt-1">
                          {editingAgent
                            ? "Modifica la información del agente"
                            : "Agrega un nuevo agente al sistema"}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto overflow-x-hidden px-1 py-6">
                    <div className="space-y-6 pr-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Nombre del Agente *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamId" className="text-white font-semibold flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Equipo
                    </Label>
                    <Select
                      value={formData.teamId}
                      onValueChange={(value) => setFormData({ ...formData, teamId: value })}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 text-white border-slate-700">
                        {availableTeams.map((team) => (
                          <SelectItem key={team.id} value={team.id} className="hover:bg-slate-700">
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photo" className="text-white font-semibold flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      URL de Foto de Perfil
                    </Label>
                    <Input
                      id="photo"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500"
                      placeholder="https://..."
                    />
                    {formData.photo && (
                      <div className="mt-3 flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl"></div>
                          <img
                            src={formData.photo}
                            alt="Preview"
                            className="relative w-20 h-20 rounded-full object-cover border-4 border-purple-500/50 shadow-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="flex-1 text-sm text-slate-400 truncate">
                          {formData.photo}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="song" className="text-white font-semibold flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      URL de Canción de Celebración
                    </Label>
                    <Input
                      id="song"
                      value={formData.song}
                      onChange={(e) => setFormData({ ...formData, song: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500"
                      placeholder="https://..."
                    />
                    {formData.song && (
                      <div className="mt-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                        <audio
                          src={formData.song}
                          controls
                          className="w-full"
                          onError={(e) => {
                            console.error("Error cargando audio:", formData.song);
                          }}
                        />
                      </div>
                    )}
                  </div>
                    </div>
                  </div>
                  <DialogFooter className="border-t border-slate-700/50 pt-4 flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleCloseDialog}
                    className="bg-slate-700/50 text-white border-slate-600 hover:bg-slate-700 hover:border-slate-500"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingAgent ? "Actualizar" : "Guardar"}
                  </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Total Agentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">{stats.total}</div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Con Foto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">{stats.withPhoto}</div>
                <Image className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Con Canción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">{stats.withSong}</div>
                <Music className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border-orange-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Equipos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">3</div>
                <Trophy className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para organizar el contenido */}
        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-1">
            <TabsTrigger value="agents" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Agentes ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Equipos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-4">
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                      <Users className="w-6 h-6 text-purple-400" />
                      Lista de Agentes
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-1">
                      Gestiona todos los agentes del sistema
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50 hover:bg-slate-700/30">
                        <TableHead className="text-slate-300 font-semibold">Nombre</TableHead>
                        <TableHead className="text-slate-300 font-semibold">Equipo</TableHead>
                        <TableHead className="text-slate-300 font-semibold">Foto</TableHead>
                        <TableHead className="text-slate-300 font-semibold">Canción</TableHead>
                        <TableHead className="text-slate-300 font-semibold text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentsList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-400 py-12">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-lg">No hay agentes configurados</p>
                            <p className="text-sm mt-1">Agrega tu primer agente para comenzar</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        agentsList.map((agent) => (
                          <TableRow
                            key={agent.name}
                            className="border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                          >
                            <TableCell className="text-white font-medium">{agent.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getTeamBadgeColor(agent.teamId)}>
                                {availableTeams.find((t) => t.id === agent.teamId)?.name || agent.teamId}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {agent.photo ? (
                                <div className="relative">
                                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md"></div>
                                  <img
                                    src={agent.photo}
                                    alt={agent.name}
                                    className="relative w-12 h-12 rounded-full object-cover border-2 border-purple-500/50 shadow-lg"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                                        encodeURIComponent(agent.name);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-slate-600/50 flex items-center justify-center text-slate-400 border-2 border-slate-600">
                                  <Image className="w-5 h-5" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              {agent.song ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                  <span className="text-green-400 text-sm font-medium">Configurada</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4 text-slate-500" />
                                  <span className="text-slate-500 text-sm">Sin canción</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEditDialog(agent)}
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border border-blue-500/30"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(agent.name)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/30"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-orange-400" />
                  Configuración de Iconos de Equipos
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  Personaliza los iconos que se muestran en el dashboard principal
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {teamIcons.map((icon, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-purple-500/50 transition-colors">
                      <div className="flex-shrink-0 w-32">
                        <Label className="text-white font-semibold">
                          {availableTeams[index]?.name || `Equipo ${index + 1}`}
                        </Label>
                        <div className="mt-1 text-xs text-slate-400">
                          {stats.byTeam[availableTeams[index]?.id as keyof typeof stats.byTeam] || 0} agentes
                        </div>
                      </div>
                      <Input
                        value={icon}
                        onChange={(e) => {
                          const newIcons = [...teamIcons];
                          newIcons[index] = e.target.value;
                          setTeamIcons(newIcons);
                        }}
                        className="bg-slate-700/50 border-slate-600 text-white flex-1 focus:border-purple-500"
                        placeholder="https://..."
                      />
                      {icon && (
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-lg"></div>
                          <img
                            src={icon}
                            alt={`Equipo ${index + 1}`}
                            className="relative w-20 h-20 rounded-full object-cover border-4 border-purple-500/50 shadow-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={handleSaveTeamIcons}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Iconos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
