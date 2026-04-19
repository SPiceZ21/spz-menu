import { useState, useEffect } from 'react';
import './App.css';
import { QueueWidget }        from './widgets/QueueWidget';
import { VehicleSpawner }     from './screens/VehicleSpawner';
import { CharacterCreation }  from './screens/CharacterCreation';
import { CrewUI }             from './screens/CrewUI';
import { ProfileCard }        from './screens/ProfileCard';
import { Leaderboard }        from './screens/Leaderboard';
import { NotificationManager }from './components/NotificationCard';
import { PollUI }             from './screens/PollUI';
import { PlayMenu }           from './screens/PlayMenu';

type GameState = 'FREEROAM' | 'QUEUED' | 'RACING';

function App() {
  const [gameState, setGameState] = useState<GameState>('FREEROAM');

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const { type, payload } = e.data;
      if (type === 'SPZ_UPDATE_STATE') {
        setGameState(payload.state as GameState);
      }
      if (type === 'CLOSE_ALL') {
        ['spawner', 'leaderboard', 'profile', 'crewManagement'].forEach(name =>
          window.dispatchEvent(new MessageEvent('message', {
            data: { type: 'CLOSE_SCREEN', data: { name } }
          }))
        );
      }
    };
    window.addEventListener('message', handleMessage);

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        fetch('https://spz-menu/closeAll', { method: 'POST', body: '{}' }).catch(() => {});
      }
      // Dev: cycle game state
      if (e.key === '1') {
        setGameState(prev =>
          prev === 'FREEROAM' ? 'QUEUED' : prev === 'QUEUED' ? 'RACING' : 'FREEROAM'
        );
      }
    };
    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', keyHandler);
    };
  }, []);

  const showQueue    = gameState !== 'RACING';
  const showSpawner  = gameState === 'FREEROAM';
  const showCrew     = gameState === 'FREEROAM';
  const showLeaderboard = gameState !== 'RACING';
  const showProfile  = gameState !== 'RACING';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: 'transparent' }}>
      {/* Loading → world entry gate (highest z-index, self-hides after ENTER) */}
      <PlayMenu />

      {/* Always-on: notifications */}
      <NotificationManager />

      {/* Always-on: poll overlay (self-manages via SPZ_POLL_OPEN/CLOSE messages) */}
      <PollUI />

      {/* State-gated screens */}
      {showQueue       && <QueueWidget />}
      {showSpawner     && <VehicleSpawner />}
      {showCrew        && <CrewUI />}
      {showProfile     && <ProfileCard />}
      {showLeaderboard && <Leaderboard />}

      {/* Character creation — manages its own trigger */}
      <CharacterCreation />
    </div>
  );
}

export default App;
