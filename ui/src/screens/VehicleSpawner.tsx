import React, { useState, useEffect } from 'react';
import { SpzPanel } from '../components/SpzPanel';
import { isMockEnv, mockVehicleClasses } from '../mockData';

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

interface Props {
  vehicle: Vehicle;
  onSpawn: (model: string) => void;
}

function VehicleRow({ vehicle, onSpawn }: Props) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '0 10px',
      height: 36, borderBottom: '1px solid rgba(255,255,255,0.06)'
    }}>
      <span className="spz-value" style={{ flex: 1, fontSize: 13 }}>
        {vehicle.label.toUpperCase()}
      </span>
      <button onClick={() => onSpawn(vehicle.model)} style={{
        background: '#FF6B00', border: 'none', borderRadius: 2,
        padding: '4px 14px', fontSize: 10, fontWeight: 700,
        fontFamily: 'SPZ,sans-serif', textTransform: 'uppercase',
        color: '#fff', cursor: 'pointer'
      }}>
        SPAWN
      </button>
    </div>
  )
}

export const VehicleSpawner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('c');

  // Mock data evaluation
  const classes: VehicleClass[] = isMockEnv ? mockVehicleClasses : [];

  // Auto-open logic
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data;
      if (type === 'SPZ:identityReady') {
        setTimeout(() => setIsOpen(true), 800);
      } else if (type === 'SPZ:openSpawner') {
        setIsOpen(true);
      } else if (type === 'SPZ:closeSpawner') {
        setIsOpen(false);
      }
    };
    window.addEventListener('message', handleMessage);

    // Development hotkey test
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '2') setIsOpen(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSpawn = async (model: string) => {
    if (!isMockEnv) {
      try {
        await fetch(`https://spz-races/spawnVehicle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model })
        });
      } catch {}
    } else {
      console.log(`[Dev] spawning ${model}`);
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const currentClass = classes.find(c => c.id === activeTab);

  return (
    <div style={{
      position: 'absolute',
      bottom: '120px', // above queue widget
      left: '50%',
      transform: 'translateX(-50%)',
      width: 380,
    }}>
      <SpzPanel>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 14px 4px 14px'
        }}>
          <div className="spz-value" style={{ fontSize: 13 }}>VEHICLE SELECT</div>
          <div
            style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 12 }}
            onClick={() => setIsOpen(false)}
          >
            [ &#x2715; ]
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {classes.map(c => {
            const isActive = activeTab === c.id;
            return (
              <div
                key={c.id}
                onClick={() => !c.locked && setActiveTab(c.id)}
                style={{
                  padding: '8px 6px',
                  fontWeight: 700, fontSize: 11,
                  fontFamily: 'SPZ, sans-serif', textTransform: 'uppercase',
                  color: isActive ? '#FF6B00' : '#fff',
                  borderBottom: isActive ? '2px solid #FF6B00' : '2px solid transparent',
                  opacity: c.locked ? 0.22 : 1,
                  cursor: c.locked ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4
                }}
              >
                [ {c.label}{c.locked && ' \u1F512'} ]
              </div>
            );
          })}
        </div>

        {/* List */}
        <div style={{ minHeight: 144, maxHeight: 300, overflowY: 'auto' }}>
          {currentClass?.vehicles.map((v, i) => (
            <VehicleRow key={i} vehicle={v} onSpawn={handleSpawn} />
          ))}
          {(!currentClass?.vehicles || currentClass.vehicles.length === 0) && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'SPZ, sans-serif' }}>
              NO VEHICLES AVAILABLE
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 14px',
          fontFamily: 'SPZ, sans-serif', fontWeight: 400, fontSize: 11,
          color: 'rgba(255,255,255,0.5)', letterSpacing: '.14em', textTransform: 'uppercase'
        }}>
          CLASS {activeTab.toUpperCase()} &middot; {currentClass?.vehicles.length || 0} VEHICLES
        </div>
      </SpzPanel>
    </div>
  );
};
