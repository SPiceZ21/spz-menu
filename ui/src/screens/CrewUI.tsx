import React, { useState, useEffect } from 'react';
import { SpzPanel } from '../components/SpzPanel';
import { isMockEnv, mockCrewData } from '../mockData';

interface CrewMember {
  name: string;
  classRank: string;
  rating: string;
  status: string;
  isOwner?: boolean;
}

interface CrewData {
  inCrew: boolean;
  name: string;
  tag: string;
  owner: string;
  membersOnline: number;
  membersTotal: number;
  members: CrewMember[];
}

export const CrewUI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inCrew, setInCrew] = useState<boolean>(false);
  
  const [createName, setCreateName] = useState("");
  const [createTag, setCreateTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmLeave, setConfirmLeave] = useState(false);

  // Mock Data
  const crew: CrewData = isMockEnv ? { ...mockCrewData, inCrew } : {
    inCrew, name: "", tag: "", owner: "", membersOnline: 0, membersTotal: 0, members: []
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;
      if (type === 'crewManagement' || (type === 'OPEN_MENU' && data?.name === 'crewManagement')) {
        // Handle payload if needed here
        setIsOpen(true);
      }
    };
    window.addEventListener('message', handleMessage);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '3') setIsOpen(prev => !prev);
      if (e.key === '4') setInCrew(prev => !prev); // Dev toggle for IN CREW
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCreateCrew = async () => {
    if (!isMockEnv) {
      try {
        await fetch(`https://spz-races/createCrew`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: createName, tag: createTag })
        });
      } catch {}
    }
    // Mock immediately switching states for dev testing
    setInCrew(true);
  };

  const handleLeaveCrew = async () => {
    if (!confirmLeave) {
      setConfirmLeave(true);
      return;
    }
    
    if (!isMockEnv) {
      try {
        await fetch(`https://spz-races/leaveCrew`, { method: 'POST' });
      } catch {}
    }
    setConfirmLeave(false);
    setInCrew(false);
  };

  const handleSearch = async () => {
    if (!isMockEnv) {
      try {
        await fetch(`https://spz-races/searchCrew`, { 
          method: 'POST',
          body: JSON.stringify({ query: searchQuery })
        });
      } catch {}
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100
    }}>
      <SpzPanel style={{ width: 440 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="spz-value" style={{ fontSize: 16 }}>CREW MANAGEMENT</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13 }} onClick={() => setIsOpen(false)}>[ &#x2715; ]</div>
        </div>

        {/* Not in crew view */}
        {!inCrew && (
          <div style={{ padding: '24px 30px' }}>
            <div className="spz-label" style={{ marginBottom: 24, textTransform: 'uppercase', color: 'var(--spz-orange)' }}>
              YOU ARE NOT IN A CREW
            </div>

            {/* Name Input */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <div className="spz-label" style={{ width: 60, color: '#fff' }}>NAME</div>
              <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.15)', padding: '6px 12px', boxSizing: 'border-box' }}>
                <input 
                  type="text" value={createName} onChange={e => setCreateName(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%', fontFamily: 'SPZ, sans-serif' }} 
                />
              </div>
            </div>

            {/* Tag Input */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <div className="spz-label" style={{ width: 60, color: '#fff' }}>TAG</div>
              <div style={{ width: 80, border: '1px solid rgba(255,255,255,0.15)', padding: '6px 12px', boxSizing: 'border-box', marginRight: 16 }}>
                <input 
                  type="text" maxLength={4} value={createTag} 
                  onChange={e => setCreateTag(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%', fontFamily: 'SPZ, sans-serif', textTransform: 'uppercase' }} 
                />
              </div>
              <div className="spz-label" style={{ color: 'rgba(255,255,255,0.3)' }}>2–4 UPPERCASE CHARS</div>
            </div>

            <button className="qw-btn qw-btn-join" style={{ width: '100%', height: 40, marginBottom: 24 }} onClick={handleCreateCrew}>
              CREATE CREW
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.06)' }}></div>
              <div className="spz-label" style={{ padding: '0 12px', color: 'rgba(255,255,255,0.5)' }}>OR</div>
              <div style={{ height: 1, flex: 2, background: 'rgba(255,255,255,0.06)' }}></div>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="spz-label" style={{ width: 60, color: '#fff' }}>SEARCH</div>
              <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.15)', padding: '4px 12px', boxSizing: 'border-box', marginRight: 12 }}>
                <input 
                  type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%', fontFamily: 'SPZ, sans-serif' }} 
                />
              </div>
              <button className="qw-btn qw-btn-leave" style={{ height: 32, padding: '0 16px' }} onClick={handleSearch}>
                GO
              </button>
            </div>
          </div>
        )}

        {/* In crew view */}
        {inCrew && (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 6 }}>
              <div className="spz-value" style={{ fontSize: 20, color: 'var(--spz-white)' }}>{crew.name}</div>
              <div className="spz-value" style={{ fontSize: 16, color: 'var(--spz-orange)', marginLeft: 12 }}>[{crew.tag}]</div>
            </div>
            
            <div className="spz-label" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
              OWNER: <span style={{ color: '#fff' }}>{crew.owner}</span>
            </div>

            <div className="spz-label" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8, marginBottom: 8 }}>
              MEMBERS <span style={{ marginLeft: 12, color: '#fff' }}>{crew.membersOnline} ONLINE / {crew.membersTotal} TOTAL</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24, maxHeight: 200, overflowY: 'auto' }}>
              {crew.members.map((member, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', fontFamily: 'SPZ, sans-serif', fontSize: 13, textTransform: 'uppercase' }}>
                  <div style={{ flex: 1, color: '#fff', fontWeight: 700 }}>{member.name}</div>
                  <div style={{ width: 50, color: 'var(--spz-orange)', fontWeight: 700, textAlign: 'center' }}>{member.classRank}</div>
                  <div style={{ width: 50, color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>{member.rating}</div>
                  <div style={{ width: 80, color: member.isOwner ? 'var(--spz-orange)' : '#fff', textAlign: 'right', fontWeight: member.isOwner ? 700 : 400 }}>
                    {member.status}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="qw-btn" 
              onClick={handleLeaveCrew}
              style={{ 
                width: '100%', height: 40,
                backgroundColor: 'rgba(204,34,0,0.15)',
                color: '#CC2200'
              }}
            >
              {confirmLeave ? 'OWNERSHIP TRANSFERS. CONFIRM?' : 'LEAVE CREW'}
            </button>
          </div>
        )}

      </SpzPanel>
    </div>
  );
};
