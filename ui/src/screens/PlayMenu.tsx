import React, { useState, useEffect } from 'react';
import { sendToLua } from '../utils/nui';
import './PlayMenu.css';

interface PlayMenuData {
  name?: string;
  rank?: string;
  tier?: number;
}

export const PlayMenu: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData]       = useState<PlayMenuData>({});
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const { type, payload } = e.data;
      if (type === 'SPZ_SHOW_PLAY_MENU') {
        setData(payload || {});
        setVisible(true);
        setEntering(false);
      } else if (type === 'SPZ_HIDE_PLAY_MENU') {
        setVisible(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Dev shortcut: press P to toggle
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setVisible(v => !v);
        setData({ name: 'DRIVER', rank: 'ROOKIE' });
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const handleEnter = async () => {
    if (entering) return;
    setEntering(true);
    await sendToLua('requestSpawn');
    // Hide happens via SPZ_HIDE_PLAY_MENU message from Lua
  };

  if (!visible) return null;

  return (
    <div className="pm-root">
      {/* Background blur overlay */}
      <div className="pm-backdrop" />

      <div className="pm-content">
        {/* Logo / title */}
        <div className="pm-logo-row">
          <div className="pm-logo-accent" />
          <div className="pm-logo-text">SPiceZ<span className="pm-logo-sub"> RACING</span></div>
          <div className="pm-logo-accent" />
        </div>

        {/* Player identity card */}
        {data.name && (
          <div className="pm-identity">
            <span className="pm-identity-name">{data.name.toUpperCase()}</span>
            {data.rank && (
              <span className="pm-identity-rank">{data.rank.toUpperCase()}</span>
            )}
          </div>
        )}

        {/* Enter button */}
        <button
          className={`pm-enter-btn ${entering ? 'pm-entering' : ''}`}
          onClick={handleEnter}
          disabled={entering}
        >
          {entering ? 'ENTERING...' : 'ENTER RACE'}
        </button>

        <p className="pm-hint">Click to enter the paddock</p>
      </div>
    </div>
  );
};
