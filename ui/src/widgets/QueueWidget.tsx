import React, { useState, useEffect } from 'react';
import { SpzPanel } from '../components/SpzPanel';

type QueueState = 'idle' | 'queued' | 'post-race';

interface QueueData {
  state: QueueState;
  pollOpen: boolean;
  queueCount: number;
  trackType: string;
  playersCount: number;
  pollTimeLeft: string;
  lastPosition: string;
  ptsGained: number;
  refreshInterval: number;
}

export const QueueWidget: React.FC = () => {
  const [data, setData] = useState<QueueData>({
    state: 'idle',
    pollOpen: false,
    queueCount: 14,
    trackType: 'CIRCUIT',
    playersCount: 14,
    pollTimeLeft: '0:28',
    lastPosition: 'P2',
    ptsGained: 18,
    refreshInterval: 5000, // Config.QueueRefreshInterval default equivalent
  });

  // Handle NUI Events for external states like poll opening/closing or configuration updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'SPZ_POLL_STATUS') {
        setData(prev => ({ ...prev, pollOpen: payload.isOpen }));
      } else if (type === 'SPZ_QUEUE_INIT') {
        setData(prev => ({ ...prev, ...payload }));
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Poll for queue update
  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const response = await fetch(`https://spz-races/getQueueInfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        if (response.ok) {
          const result = await response.json();
          setData(prev => ({ ...prev, ...result }));
        }
      } catch (error) {
        // Ignored in browser dev environment
      }
    };

    // Initial fetch
    fetchQueueData();

    // Setup interval
    const intervalId = setInterval(fetchQueueData, data.refreshInterval);
    return () => clearInterval(intervalId);
  }, [data.refreshInterval]); // Dependencies

  const getLeftText = () => {
    switch (data.state) {
      case 'idle': return 'NEXT RACE';
      case 'queued': return 'QUEUED';
      case 'post-race': return 'NEXT RACE';
      default: return 'NEXT RACE';
    }
  };

  const renderInfo = () => {
    switch (data.state) {
      case 'idle':
        return `${data.queueCount} IN QUEUE · ${data.trackType}`;
      case 'queued':
        return `${data.playersCount} PLAYERS · POLL IN ${data.pollTimeLeft} · ${data.trackType}`;
      case 'post-race':
        return `LAST: ${data.lastPosition} · +${data.ptsGained} PTS · ${data.queueCount} IN QUEUE`;
      default:
        return '';
    }
  };

  const handleAction = async () => {
    const endpoint = data.state === 'queued' ? 'leaveQueue' : 'joinQueue';
    try {
      await fetch(`https://spz-races/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      // In a real environment, you might update optimistic state here or refetch queue info immediately
    } catch {
      // Intentionally empty for non-FiveM environments
    }
  };

  return (
    <div className={`queue-widget-container ${data.pollOpen ? 'poll-open' : ''}`}>
      <SpzPanel className="queue-widget">
        <div className="qw-left">
          <div className="qw-left-text">{getLeftText()}</div>
        </div>
        
        <div className="qw-divider"></div>
        
        <div className="qw-right">
          <div className="qw-info spz-label">{renderInfo()}</div>
          
          {data.state === 'idle' || data.state === 'post-race' ? (
            <button className="qw-btn qw-btn-join" onClick={handleAction}>JOIN</button>
          ) : (
            <button className="qw-btn qw-btn-leave" onClick={handleAction}>LEAVE</button>
          )}
        </div>
      </SpzPanel>
    </div>
  );
};
