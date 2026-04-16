import './App.css';
import { QueueWidget } from './widgets/QueueWidget';
import { VehicleSpawner } from './screens/VehicleSpawner';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <QueueWidget />
      <VehicleSpawner />
    </div>
  );
}

export default App;
