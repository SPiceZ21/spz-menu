import React, { useState, useEffect } from 'react';
import { SpzPanel } from '../components/SpzPanel';

type Tab = 'GLOBAL' | 'CLASS' | 'TRACKS' | 'HISTORY';

export const Leaderboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('GLOBAL');

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'OPEN_MENU' && e.data?.data?.name === 'leaderboard') setIsOpen(true);
    };
    window.addEventListener('message', handleMessage);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F7') setIsOpen(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('message', handleMessage); window.removeEventListener('keydown', handleKeyDown); };
  }, []);

  if (!isOpen) return null;

  const tabs: Tab[] = ['GLOBAL', 'CLASS', 'TRACKS', 'HISTORY'];

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 700, height: 500, zIndex: 100
    }}>
      <SpzPanel style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 24px 0 24px' }}>
          <div className="spz-value" style={{ fontSize: 20 }}>LEADERBOARD</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13 }} onClick={() => setIsOpen(false)}>[ &#x2715; ]</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginTop: 16 }}>
          {tabs.map(t => (
            <div 
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: '8px 16px', cursor: 'pointer',
                fontFamily: 'SPZ, sans-serif', fontWeight: 700, fontSize: 13, 
                color: activeTab === t ? 'var(--spz-orange)' : '#fff',
                borderBottom: activeTab === t ? '2px solid var(--spz-orange)' : '2px solid transparent',
                letterSpacing: '.05em'
              }}
            >
              {t}
            </div>
          ))}
        </div>

        {/* Content Region */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {activeTab === 'GLOBAL' && (
            <div>
               <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '12px', marginBottom: 4, alignItems: 'center' }}>
                  <div className="spz-value" style={{ width: 40, color: 'var(--spz-muted)' }}>1</div>
                  <div className="spz-value" style={{ flex: 1 }}>TRUERACER#1111</div>
                  <div className="spz-value" style={{ width: 100, textAlign: 'right' }}>24,000 PTS</div>
               </div>
               {/* Player Mock Row highlighted */}
               <div style={{ display: 'flex', background: 'rgba(255,107,0,0.08)', padding: '12px', marginBottom: 4, alignItems: 'center' }}>
                  <div className="spz-value" style={{ width: 40, color: 'var(--spz-orange)' }}>2</div>
                  <div className="spz-value" style={{ flex: 1, color: 'var(--spz-orange)' }}>THESPZ_MASTER#2106</div>
                  <div className="spz-value" style={{ width: 100, textAlign: 'right' }}>14,375 PTS</div>
               </div>
               <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '12px', marginBottom: 4, alignItems: 'center' }}>
                  <div className="spz-value" style={{ width: 40, color: 'var(--spz-muted)' }}>3</div>
                  <div className="spz-value" style={{ flex: 1 }}>CATCHMEIF#9001</div>
                  <div className="spz-value" style={{ width: 100, textAlign: 'right' }}>12,110 PTS</div>
               </div>
            </div>
          )}
          {activeTab === 'CLASS' && (
             <div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                  {['S','A','B','C'].map((c, i) => (
                     <div key={c} style={{ 
                       background: i===0 ? 'var(--spz-orange)' : 'rgba(255,255,255,0.1)', 
                       color: '#fff',
                       padding: '6px 16px', borderRadius: 20, 
                       fontFamily: 'SPZ, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' 
                     }}>
                        {c} CLASS
                     </div>
                  ))}
                </div>
                <div className="spz-label" style={{ marginBottom: 12 }}>CURRENT SEASON POINTS</div>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '12px', marginBottom: 4, alignItems: 'center' }}>
                  <div className="spz-value" style={{ width: 40 }}>1</div>
                  <div className="spz-value" style={{ flex: 1 }}>THESPZ_MASTER#2106</div>
                  <div className="spz-value" style={{ width: 100, textAlign: 'right' }}>2,100 PTS</div>
               </div>
             </div>
          )}
          {activeTab === 'TRACKS' && (
             <div>
                <div className="spz-value" style={{ background: 'rgba(255,255,255,0.05)', padding: 14, cursor: 'pointer', borderLeft: '2px solid var(--spz-orange)' }}>
                  AIRSTRIP ASSAULT <span className="spz-label" style={{marginLeft: 10}}>(TOP 15 &middot; CLASS S)</span>
                </div>
                <div className="spz-value" style={{ background: 'rgba(255,255,255,0.02)', padding: 14, marginTop: 4, cursor: 'pointer' }}>
                  GUILLOTINE <span className="spz-label" style={{marginLeft: 10, opacity: 0}}>(TOP 15)</span>
                </div>
             </div>
          )}
          {activeTab === 'HISTORY' && (
             <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }} className="spz-value">
                    <span style={{ color: 'var(--spz-muted)' }}>YESTERDAY</span>
                    <span>RACE: SPRINT (B)</span>
                    <span style={{ color: 'var(--spz-orange)' }}>1ST PLACE</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, padding: '10px 0' }}>
                   <div className="spz-label" style={{ cursor: 'pointer' }}>[ &#x2190; PREV ]</div>
                   <div className="spz-label" style={{ cursor: 'pointer' }}>[ NEXT &#x2192; ]</div>
                </div>
             </div>
          )}
        </div>
      </SpzPanel>
    </div>
  );
};
