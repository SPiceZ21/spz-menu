import { useState, useEffect } from 'react';
import './App.css';
import { QueueWidget } from './widgets/QueueWidget';
import { VehicleSpawner } from './screens/VehicleSpawner';
import { CharacterCreation } from './screens/CharacterCreation';
import { CrewUI } from './screens/CrewUI';
import { ProfileCard } from './screens/ProfileCard';
import { Leaderboard } from './screens/Leaderboard';
import { NotificationManager } from './components/NotificationCard';

type GameState = 'FREEROAM' | 'QUEUED' | 'RACING';

function App() {
  const [gameState, setGameState] = useState<GameState>('FREEROAM');

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const { type, payload } = e.data;
      if (type === 'SPZ_UPDATE_STATE') {
        setGameState(payload.state as GameState);
      }
      // Global close — Lua-side triggered via main.lua:CloseAll()
      if (type === 'CLOSE_ALL') {
        // Each screen handles its own close via CLOSE_SCREEN or internally,
        // but this is a safety net — broadcast close to all screens
        window.dispatchEvent(new MessageEvent('message', {
          data: { type: 'CLOSE_SCREEN', data: { name: 'spawner' } }
        }));
        window.dispatchEvent(new MessageEvent('message', {
          data: { type: 'CLOSE_SCREEN', data: { name: 'leaderboard' } }
        }));
        window.dispatchEvent(new MessageEvent('message', {
          data: { type: 'CLOSE_SCREEN', data: { name: 'profile' } }
        }));
        window.dispatchEvent(new MessageEvent('message', {
          data: { type: 'CLOSE_SCREEN', data: { name: 'crewManagement' } }
        }));
      }
    };
    window.addEventListener('message', handleMessage);

    const keyHandler = (e: KeyboardEvent) => {
      // Escape key → tell Lua to release NUI focus
      if (e.key === 'Escape') {
        fetch('https://spz-menu/closeAll', { method: 'POST', body: '{}' }).catch(() => {});
      }
      // Dev Hotkey: 1 cycles through the GameStates (FREEROAM -> QUEUED -> RACING)
      if (e.key === '1') {
        setGameState(prev => prev === 'FREEROAM' ? 'QUEUED' : prev === 'QUEUED' ? 'RACING' : 'FREEROAM');
      }
    };
    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', keyHandler);
    };
  }, []);

  const showQueue = gameState !== 'RACING';
  const showSpawner = gameState === 'FREEROAM';
  const showCrew = gameState === 'FREEROAM';
  const showLeaderboard = gameState !== 'RACING';
  const showProfile = gameState !== 'RACING';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Notifications are permanently visible globally in all 3 states */}
      <NotificationManager />
      
      {showQueue && <QueueWidget />}
      {showSpawner && <VehicleSpawner />}
      {showCrew && <CrewUI />}
      {showProfile && <ProfileCard />}
      {showLeaderboard && <Leaderboard />}

      {/* Character Creation is bound internally to unique triggers independent of standard race state structure */}
      <CharacterCreation />
    </div>
  );
}

export default App;
