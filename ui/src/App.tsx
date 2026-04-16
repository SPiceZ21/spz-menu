import './App.css';
import { QueueWidget } from './widgets/QueueWidget';
import { VehicleSpawner } from './screens/VehicleSpawner';
import { CharacterCreation } from './screens/CharacterCreation';
import { CrewUI } from './screens/CrewUI';
import { ProfileCard } from './screens/ProfileCard';
import { Leaderboard } from './screens/Leaderboard';
import { NotificationManager } from './components/NotificationCard';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <NotificationManager />
      <QueueWidget />
      <VehicleSpawner />
      <CharacterCreation />
      <CrewUI />
      <ProfileCard />
      <Leaderboard />
    </div>
  );
}

export default App;
