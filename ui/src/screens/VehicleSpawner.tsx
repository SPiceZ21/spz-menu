import React, { useState, useEffect } from 'react';
import './VehicleSpawner.css';

const isMockEnv = import.meta.env.DEV;

interface Vehicle {
  model: string;
  label: string;
}

interface VehicleClass {
  id: string;
  label: string;
  locked: boolean;
  vehicles: Vehicle[];
}

const CLASS_LABELS = ['C', 'B', 'A', 'S'];

function buildClassList(serverData: Record<string, any[]>): VehicleClass[] {
  return CLASS_LABELS.map((label, i) => {
    const raw = serverData[String(i)] || [];
    return {
      id: label.toLowerCase(),
      label,
      locked: raw.length === 0,
      vehicles: raw.map((v: any) => ({ model: v.model, label: v.label || v.model })),
    };
  });
}

const mockClasses: VehicleClass[] = CLASS_LABELS.map((label, i) => ({
  id: label.toLowerCase(),
  label,
  locked: i === 3,
  vehicles: i < 3
    ? [{ model: 'sultan', label: 'Sultan RS' }, { model: 'elegy', label: 'Elegy RH8' }]
    : [],
}));

export const VehicleSpawner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(isMockEnv);
  const [activeTab, setActiveTab] = useState('c');
  const [classes, setClasses] = useState<VehicleClass[]>(isMockEnv ? mockClasses : []);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const { type, data, payload } = e.data;
      if (type === 'OPEN_MENU' && data?.name === 'spawner') {
        if (payload?.classes) setClasses(buildClassList(payload.classes));
        setIsOpen(true);
      } else if (type === 'CLOSE_SCREEN' && data?.name === 'spawner') {
        setIsOpen(false);
      } else if (type === 'CLOSE_ALL') {
        setIsOpen(false);
      }
    };
    window.addEventListener('message', handleMessage);
    const keyDown = (e: KeyboardEvent) => { if (e.key === '2') setIsOpen(p => !p); };
    window.addEventListener('keydown', keyDown);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', keyDown);
    };
  }, []);

  const handleSpawn = async (model: string) => {
    if (!isMockEnv) {
      try {
        await fetch('https://spz-menu/spawnVehicle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model }),
        });
      } catch {}
    } else {
      console.log('[Dev] spawn:', model);
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const currentClass = classes.find(c => c.id === activeTab);

  return (
    <div className="vs-root">
      <div className="vs-panel spz-panel">
        {/* Header */}
        <div className="vs-header">
          <span className="vs-title">VEHICLE SELECT</span>
          <button className="vs-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {/* Class tabs */}
        <div className="vs-tabs">
          {classes.map(c => (
            <button
              key={c.id}
              className={`vs-tab ${activeTab === c.id ? 'vs-tab-active' : ''} ${c.locked ? 'vs-tab-locked' : ''}`}
              onClick={() => !c.locked && setActiveTab(c.id)}
              disabled={c.locked}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Vehicle list */}
        <div className="vs-list">
          {currentClass?.vehicles.length ? (
            currentClass.vehicles.map((v, i) => (
              <div key={i} className="vs-row">
                <span className="vs-vehicle-name">{v.label.toUpperCase()}</span>
                <button className="vs-spawn-btn" onClick={() => handleSpawn(v.model)}>
                  SPAWN
                </button>
              </div>
            ))
          ) : (
            <div className="vs-empty">NO VEHICLES AVAILABLE</div>
          )}
        </div>

        {/* Footer */}
        <div className="vs-footer">
          CLASS {activeTab.toUpperCase()} · {currentClass?.vehicles.length ?? 0} VEHICLES
        </div>
      </div>
    </div>
  );
};
