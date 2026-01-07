export interface Agent {
  id: string;
  name: string;
  avatar: string;
  sales: number;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  goal: number;
  total_real?: number;
  agents: Agent[];
}

export const mockTeams: Team[] = [
  {
    id: "mesa-1",
    name: "Mesa 1",
    goal: 50000,
    agents: [
      { id: "a1", name: "Carlos Mendoza", avatar: "https://i.pravatar.cc/150?img=1", sales: 12500, teamId: "mesa-1" },
      { id: "a2", name: "María García", avatar: "https://i.pravatar.cc/150?img=5", sales: 9800, teamId: "mesa-1" },
      { id: "a3", name: "Juan Rodríguez", avatar: "https://i.pravatar.cc/150?img=3", sales: 8200, teamId: "mesa-1" },
      { id: "a4", name: "Ana Martínez", avatar: "https://i.pravatar.cc/150?img=9", sales: 6395, teamId: "mesa-1" },
    ],
  },
  {
    id: "mesa-2",
    name: "Mesa 2",
    goal: 50000,
    agents: [
      { id: "b1", name: "Roberto Silva", avatar: "https://i.pravatar.cc/150?img=11", sales: 15200, teamId: "mesa-2" },
      { id: "b2", name: "Laura Sánchez", avatar: "https://i.pravatar.cc/150?img=16", sales: 11500, teamId: "mesa-2" },
      { id: "b3", name: "Diego López", avatar: "https://i.pravatar.cc/150?img=12", sales: 7800, teamId: "mesa-2" },
      { id: "b4", name: "Carmen Torres", avatar: "https://i.pravatar.cc/150?img=20", sales: 5100, teamId: "mesa-2" },
    ],
  },
  {
    id: "mesa-3",
    name: "Mesa 3",
    goal: 50000,
    agents: [
      { id: "c1", name: "Fernando Ruiz", avatar: "https://i.pravatar.cc/150?img=15", sales: 13800, teamId: "mesa-3" },
      { id: "c2", name: "Patricia Flores", avatar: "https://i.pravatar.cc/150?img=23", sales: 10200, teamId: "mesa-3" },
      { id: "c3", name: "Miguel Herrera", avatar: "https://i.pravatar.cc/150?img=17", sales: 8900, teamId: "mesa-3" },
      { id: "c4", name: "Isabel Reyes", avatar: "https://i.pravatar.cc/150?img=24", sales: 4500, teamId: "mesa-3" },
    ],
  },
];

export const getTeamTotal = (team: Team): number => {
  return team.agents.reduce((sum, agent) => sum + agent.sales, 0);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
