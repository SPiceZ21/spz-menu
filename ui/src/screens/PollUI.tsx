import React, { useState, useEffect } from 'react';
import { sendToLua } from '../utils/nui';
import './PollUI.css';

interface PollOption {
  name: string;
  label?: string;
  subtext?: string;
  class?: string;
  type?: string;
  laps?: number;
  checkpointCount?: number;
  stats?: { label: string; value: string | number }[];
}

interface PollData {
  phase: 'track' | 'vehicle';
  options: PollOption[];
  timer?: number;
  duration?: number;
  winner?: { index: number };
}

export const PollUI: React.FC = () => {
  const [data, setData] = useState<PollData | null>(null);
  const [selected, setSelected] = useState(-1);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const { type, payload } = e.data;
      if (type === 'SPZ_POLL_OPEN') {
        setData(payload);
        setSelected(-1);
        setHasVoted(false);
      } else if (type === 'SPZ_POLL_RESULT') {
        setData(prev => prev ? { ...prev, ...payload } : prev);
        if (payload?.phase === 'vehicle') {
          setTimeout(() => setData(null), 2800);
        }
      } else if (type === 'SPZ_POLL_CLOSE') {
        setData(null);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Show winner highlight when result arrives
  useEffect(() => {
    const winnerIdx = data?.winner?.index;
    if (winnerIdx != null) setSelected(winnerIdx - 1);
  }, [data?.winner]);

  if (!data) return null;

  const options = data.options || [];
  if (options.length === 0) return null;

  const handleVote = async (idx: number) => {
    if (hasVoted) return;
    setSelected(idx);
    setHasVoted(true);
    await sendToLua('pollVote', { index: idx + 1 });
  };

  return (
    <div className="menu-poll-root">
      {/* Phase label */}
      <div className="menu-poll-phase">
        {data.phase === 'track' ? 'CHOOSE TRACK' : 'CHOOSE VEHICLE'}
      </div>

      {/* Options */}
      <div className="menu-poll-container">
        <div className="menu-poll-options">
          {options.map((option, i) => (
            <div
              key={i}
              className={`menu-poll-card${selected === i ? ' selected' : ''}${i % 2 === 1 ? ' right' : ''}`}
              onClick={() => handleVote(i)}
            >
              <span className="menu-poll-bg-num">{i + 1}</span>

              <div className="menu-poll-content">
                <div className="menu-poll-title">{option.label ?? option.name}</div>
                <div className="menu-poll-meta">
                  {data.phase === 'track' ? (
                    <>
                      <span className="meta-orange">{option.type?.toUpperCase() ?? 'CIRCUIT'}</span>
                      <span className="meta-orange">{option.laps ?? 3} LAPS</span>
                      <span className="meta-blue">{option.checkpointCount ?? '?'} CPS</span>
                    </>
                  ) : (
                    <>
                      <span className="meta-orange">{option.subtext ?? option.class ?? 'CLASS'}</span>
                      {option.stats?.map((s, si) => (
                        <span key={si} className="meta-blue">{s.label}: {s.value}</span>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {hasVoted && selected === i && <div className="menu-poll-voted-line" />}
              {data.winner?.index === i + 1 && <div className="menu-poll-winner-border" />}
            </div>
          ))}
        </div>

        {/* Timer bar */}
        <div className="menu-poll-timer">
          <div
            className="menu-poll-timer-fill"
            style={{
              animation: `poll-timer-drain ${data.timer ?? data.duration ?? 30}s linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
