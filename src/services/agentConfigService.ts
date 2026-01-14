// Servicio para gestionar configuración de agentes dinámicamente
// Usa localStorage para persistencia, puede migrarse a Supabase después

import { AGENT_PHOTOS, AGENT_CELEBRATION_SONGS, TEAM_ICONS, TEAM_THEMES, TeamTheme } from "@/config/agents.config";

export interface AgentConfig {
  name: string;
  photo: string;
  song: string;
  teamId: string; // "mesa-1", "mesa-2", "mesa-3"
}

interface AgentConfigs {
  [agentName: string]: AgentConfig;
}

const STORAGE_KEY = "agent_configs";
const TEAM_ICONS_KEY = "team_icons";

// Obtener configuraciones desde localStorage o usar defaults
export const getAgentConfigs = (): AgentConfigs => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading agent configs from localStorage:", error);
  }
  
  // Si no hay configuración guardada, crear desde los valores por defecto
  const defaultConfigs: AgentConfigs = {};
  
  Object.keys(AGENT_PHOTOS).forEach((name) => {
    defaultConfigs[name] = {
      name,
      photo: AGENT_PHOTOS[name],
      song: AGENT_CELEBRATION_SONGS[name] || "",
      teamId: getDefaultTeamId(name),
    };
  });
  
  return defaultConfigs;
};

// Obtener teamId por defecto basado en el nombre
// Mapeo manual basado en el orden correcto de las mesas
const getDefaultTeamId = (name: string): string => {
  // Mesa 1 - Nicolás
  // Orden correcto según las imágenes: Camila Hernandez, Isaac Fernandez, Daniel Salazar, Leonel Cruz, Emanuel Garcia, Luisa Gutierrez
  const mesa1 = ["Camila Hernandez", "Isaac Fernandez", "Daniel Salazar", "Leonel Cruz", "Emanuel Garcia", "Luisa Gutierrez", "Wilder Zapata"];
  if (mesa1.includes(name)) return "mesa-1";
  
  // Mesa 2 - Enzo
  // Orden correcto según las imágenes: Juan de Dios, Isadora Cruz, Ismael Lopez, Anny Martinez, Giann Carlos, Mariano Campuzano, Maylo Villalobos
  const mesa2 = ["Juan de Dios", "Isadora Cruz", "Ismael Lopez", "Anny Martinez", "Giann Carlos", "Mariano Campuzano", "Maylo Villalobos"];
  if (mesa2.includes(name)) return "mesa-2";
  
  // Mesa 3 - Ricardo
  // Orden correcto según las imágenes: Samanta Rous, Guadalupe Gonzalez, Heiner Ramirez, Leomelly Alvarez
  const mesa3 = ["Samanta Rous", "Guadalupe Gonzalez", "Heiner Ramirez", "Leomelly Alvarez", "Amelia Huaman", "Matias Guerrero"];
  if (mesa3.includes(name)) return "mesa-3";
  
  // Por defecto, distribuir por orden alfabético
  const teams = ["mesa-1", "mesa-2", "mesa-3"];
  const index = Object.keys(AGENT_PHOTOS).indexOf(name);
  return teams[index % teams.length] || "mesa-1";
};

// Guardar configuraciones
export const saveAgentConfigs = (configs: AgentConfigs): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch (error) {
    console.error("Error saving agent configs to localStorage:", error);
    throw error;
  }
};

// Agregar nuevo agente
export const addAgent = (config: AgentConfig): void => {
  const configs = getAgentConfigs();
  configs[config.name] = config;
  saveAgentConfigs(configs);
};

// Actualizar agente existente
export const updateAgent = (oldName: string, config: AgentConfig): void => {
  const configs = getAgentConfigs();
  
  // Si cambió el nombre, eliminar el anterior
  if (oldName !== config.name && configs[oldName]) {
    delete configs[oldName];
  }
  
  configs[config.name] = config;
  saveAgentConfigs(configs);
};

// Eliminar agente
export const deleteAgent = (name: string): void => {
  const configs = getAgentConfigs();
  delete configs[name];
  saveAgentConfigs(configs);
};

// Obtener foto de agente (con fallback)
export const getAgentPhotoFromConfig = (agentName: string, fallbackAvatar: string): string => {
  const configs = getAgentConfigs();
  return configs[agentName]?.photo || AGENT_PHOTOS[agentName] || fallbackAvatar;
};

// Obtener canción de agente (con fallback)
export const getAgentSongFromConfig = (agentName: string): string => {
  const DEFAULT_SONG = "https://assets.mixkit.co/active_storage/sfx/1934/1934-preview.mp3";
  const configs = getAgentConfigs();
  return configs[agentName]?.song || AGENT_CELEBRATION_SONGS[agentName] || DEFAULT_SONG;
};

// Obtener iconos de equipos
export const getTeamIcons = (): string[] => {
  try {
    const stored = localStorage.getItem(TEAM_ICONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading team icons from localStorage:", error);
  }
  return TEAM_ICONS;
};

// Guardar iconos de equipos
export const saveTeamIcons = (icons: string[]): void => {
  try {
    localStorage.setItem(TEAM_ICONS_KEY, JSON.stringify(icons));
  } catch (error) {
    console.error("Error saving team icons to localStorage:", error);
    throw error;
  }
};

// Obtener todos los equipos disponibles
export const getAvailableTeams = () => {
  return [
    { id: "mesa-1", name: "Mesa 1" },
    { id: "mesa-2", name: "Mesa 2" },
    { id: "mesa-3", name: "Mesa 3" },
  ];
};

// Obtener temas de equipos
export const getTeamThemes = (): TeamTheme[] => {
  return TEAM_THEMES;
};
