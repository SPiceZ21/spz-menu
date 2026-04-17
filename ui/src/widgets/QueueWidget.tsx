import React, { useState, useEffect } from 'react';
import { SpzPanel } from '../components/SpzPanel';
import { isMockEnv, mockQueueData } from '../mockData';

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
  const [data, setData] = useState<QueueData>(isMockEnv ? mockQueueData : {
    state: 'idle',
    pollOpen: false,
    queueCount: 0,
    trackType: '',
    playersCount: 0,
    pollTimeLeft: '',
    lastPosition: '',
    ptsGained: 0,
    refreshInterval: 5000,
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '9') {
        setData(prev => ({
          ...prev,
          state: prev.state === 'idle' ? 'queued' : prev.state === 'queued' ? 'post-race' : 'idle'
        }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Poll for queue update
  useEffect(() => {
    const fetchQueueData = async () => {
      if (isMockEnv) return; // Prevent spamming console with net::ERR_NAME_NOT_RESOLVED during web dev
      try {
        const response = await fetch(`https://spz-menu/getQueueInfo`, {
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
      await fetch(`https://spz-menu/${endpoint}`, {
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
