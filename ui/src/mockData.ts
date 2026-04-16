export const isMockEnv = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock Queue Widget Defaults
export const mockQueueData = {
  state: 'idle' as const,
  pollOpen: false,
  queueCount: 14,
  trackType: 'CIRCUIT',
  playersCount: 14,
  pollTimeLeft: '0:28',
  lastPosition: 'P2',
  ptsGained: 18,
  refreshInterval: 5000,
};

// Mock Vehicle Spawner
export const mockVehicleClasses = [
  {
    id: 'c', label: 'C STREET', locked: false, vehicles: [
      { model: 'sultan', label: 'Sultan' },
      { model: 'dominator', label: 'Dominator' },
      { model: 'zr350', label: 'Annis ZR350' },
      { model: 'dominator', label: 'Vapid Dominator' },
    ]
  },
  { id: 'b', label: 'B SPORT', locked: false, vehicles: [] },
  { id: 'a', label: 'A PRO \u00B7', locked: true, vehicles: [] },
  { id: 's', label: 'S \u00B7', locked: true, vehicles: [] },
];

// Mock Crew View
export const mockCrewData = {
  name: "STREET PHANTOMS",
  tag: "SPZ",
  owner: "THESPZ_MASTER#2106",
  membersOnline: 3,
  membersTotal: 7,
  members: [
    { name: "THESPZ_MASTER#2106", classRank: "S-1", rating: "4.15", status: "★", isOwner: true },
    { name: "RACESTONE#4421", classRank: "B-3", rating: "3.20", status: "ONLINE" },
    { name: "NIGHTRIDER#0092", classRank: "A-2", rating: "2.88", status: "ONLINE" }
  ]
};
