import './App.css';
import { QueueWidget } from './widgets/QueueWidget';
import { VehicleSpawner } from './screens/VehicleSpawner';
import { CharacterCreation } from './screens/CharacterCreation';
import { CrewUI } from './screens/CrewUI';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <QueueWidget />
      <VehicleSpawner />
      <CharacterCreation />
      <CrewUI />
    </div>
  );
}

export default App;
