import React, { useState, useEffect } from 'react';
import { SpzPanel } from '../components/SpzPanel';
import { DotGauge } from '../components/DotGauge';

export const ProfileCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'OPEN_MENU' && e.data?.data?.name === 'profile') setIsOpen(true);
    };
    window.addEventListener('message', handleMessage);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F6') setIsOpen(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'absolute', top: 120, right: 60, width: 340, zIndex: 50 }}>
      <SpzPanel style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="spz-value" style={{ fontSize: 16 }}>THESPZ_MASTER#2106</div>
            <div className="spz-value" style={{ fontSize: 13, color: 'var(--spz-orange)' }}>[SPZ]</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13 }} onClick={() => setIsOpen(false)}>[ &#x2715; ]</div>
        </div>
        
        <div className="spz-label" style={{ marginBottom: 12, opacity: 0.5, letterSpacing: '.14em' }}>SPZ-00001</div>
        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 12 }}></div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="spz-value" style={{ fontSize: 16, color: 'var(--spz-orange)' }}>S-1</div>
          <div className="spz-value" style={{ fontSize: 14 }}>THE SPICEZ</div>
          <div className="spz-label" style={{ margin: '0 8px' }}>&middot;</div>
          <div className="spz-label" style={{ color: '#fff' }}>CLASS S ELITE</div>
        </div>
        
        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', margin: '12px 0' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div className="spz-label" style={{ width: 100 }}>XP</div>
          <div className="spz-value" style={{ fontSize: 14 }}>84,200</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div className="spz-label" style={{ width: 100 }}>CLASS POINTS</div>
          <div className="spz-value" style={{ fontSize: 14 }}>2,100</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div className="spz-label" style={{ width: 100 }}>ALL-TIME PTS</div>
          <div className="spz-value" style={{ fontSize: 14 }}>14,375</div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="spz-label" style={{ width: 100 }}>SR</div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
             <div className="spz-value" style={{ fontSize: 14 }}>4.15</div>
             <DotGauge value={4.15} min={0} max={5.0} segments={10} />
             <div className="spz-value" style={{ fontSize: 14 }}>5.00</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="spz-label" style={{ width: 100 }}>IRATING</div>
          <div className="spz-value" style={{ fontSize: 14 }}>2,102</div>
        </div>

        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', margin: '0 0 12px 0' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px', marginBottom: 12 }}>
          <div className="spz-label">RACES <span style={{color: '#fff', marginLeft:4}}>312</span></div>
          <div className="spz-label">WINS <span style={{color: '#fff', marginLeft:4}}>87</span></div>
          <div className="spz-label">TOP-3 <span style={{color: '#fff', marginLeft:4}}>198</span></div>
          <div className="spz-label">RATE <span style={{color: '#fff', marginLeft:4}}>27.9%</span></div>
        </div>

        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', margin: '0 0 12px 0' }}></div>

        <div className="spz-label" style={{ marginBottom: 12 }}>BEST TIMES</div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
           <div className="spz-value" style={{ fontSize: 11, width: 130 }}>AIRSTRIP ASSAULT</div>
           <div className="spz-value" style={{ fontSize: 11, color: 'var(--spz-orange)' }}>B</div>
           <div className="spz-value" style={{ fontSize: 11 }}>1:32.441</div>
           <div className="spz-label" style={{ width: 60, textAlign: 'right' }}>CIRCUIT</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
           <div className="spz-value" style={{ fontSize: 11, width: 130 }}>GUILLOTINE</div>
           <div className="spz-value" style={{ fontSize: 11, color: 'var(--spz-orange)' }}>B</div>
           <div className="spz-value" style={{ fontSize: 11 }}>1:14.109</div>
           <div className="spz-label" style={{ width: 60, textAlign: 'right' }}>SPRINT</div>
        </div>

        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', margin: '0 0 12px 0' }}></div>

        <button className="qw-btn" style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: 4 }}>
           VIEW FULL HISTORY
        </button>

      </SpzPanel>
    </div>
  );
};
