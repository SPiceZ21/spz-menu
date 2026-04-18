import React, { useState, useEffect } from 'react';
import './QueueWidget.css';

type QueueState = 'idle' | 'queued' | 'post-race';

interface QueueData {
  state: QueueState;
  queueCount: number;
  trackType: string;
  playersCount: number;
  pollTimeLeft: string;
  lastPosition: string;
  ptsGained: number;
  refreshInterval: number;
}

const isMockEnv = import.meta.env.DEV;

const defaultData: QueueData = {
  state: 'idle',
  queueCount: 0,
  trackType: '',
  playersCount: 0,
  pollTimeLeft: '',
  lastPosition: '',
  ptsGained: 0,
  refreshInterval: 5000,
};

export const QueueWidget: React.FC = () => {
  const [data, setData] = useState<QueueData>(defaultData);
  const [loading, setLoading] = useState(false);

  // Listen for NUI messages
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const { type, payload } = e.data;
      if (type === 'SPZ_QUEUE_INIT' || type === 'SPZ_QUEUE_UPDATE') {
        setData(prev => ({ ...prev, ...payload }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Poll server for queue state
  useEffect(() => {
    const fetchQueue = async () => {
      if (isMockEnv) return;
      try {
        const res = await fetch('https://spz-menu/getQueueInfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });
        if (res.ok) {
          const result = await res.json();
          setData(prev => ({ ...prev, ...result }));
        }
      } catch { /* not in FiveM */ }
    };
    fetchQueue();
    const id = setInterval(fetchQueue, data.refreshInterval);
    return () => clearInterval(id);
  }, [data.refreshInterval]);

  const handleAction = async () => {
    const endpoint = data.state === 'queued' ? 'leaveQueue' : 'joinQueue';
    setLoading(true);

    // Optimistic update so the button feels instant
    setData(prev => ({
      ...prev,
      state: prev.state === 'queued' ? 'idle' : 'queued',
    }));

    try {
      await fetch(`https://spz-menu/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
    } catch { /* not in FiveM */ }

    setLoading(false);
  };

  const isQueued = data.state === 'queued';

  const statusLabel = isQueued ? 'IN QUEUE' : data.state === 'post-race' ? 'LAST RACE' : 'FREEROAM';

  const infoLine = isQueued
    ? `${data.playersCount} PLAYERS${data.trackType ? ' · ' + data.trackType : ''}`
    : data.state === 'post-race'
      ? `P${data.lastPosition} · +${data.ptsGained} PTS · ${data.queueCount} IN QUEUE`
      : data.queueCount > 0
        ? `${data.queueCount} IN QUEUE${data.trackType ? ' · ' + data.trackType : ''}`
        : 'JOIN THE NEXT RACE';

  return (
    <div className="qw-root">
      <div className="qw-panel spz-panel">
        {/* Orange accent pip */}
        <div className="qw-status-dot" data-queued={isQueued} />

        {/* Labels */}
        <div className="qw-labels">
          <span className="qw-status-label">{statusLabel}</span>
          <span className="qw-info-line">{infoLine}</span>
        </div>

        {/* Action button */}
        <button
          className={`qw-btn ${isQueued ? 'qw-btn-leave' : 'qw-btn-join'}`}
          onClick={handleAction}
          disabled={loading}
        >
          {isQueued ? 'LEAVE' : 'JOIN'}
        </button>
      </div>
    </div>
  );
};
