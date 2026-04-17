import React, { useState, useEffect } from 'react';
import { SpzPanel } from '../components/SpzPanel';
import { isMockEnv } from '../mockData';

export const CharacterCreation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestedUsername, setSuggestedUsername] = useState("racer");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<'mp_m_freemode_01' | 'mp_f_freemode_01' | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload, data } = event.data;
      if (type === 'characterCreation' || (type === 'OPEN_MENU' && data?.name === 'characterCreation')) {
        const suggested = payload?.suggestedUsername || data?.suggestedUsername || "racer";
        setSuggestedUsername(suggested);
        setUsername(suggested);
        setIsOpen(true);
      }
    };
    window.addEventListener('message', handleMessage);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '7') setIsOpen(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleGenderSelect = async (selected: 'mp_m_freemode_01' | 'mp_f_freemode_01') => {
    setGender(selected);
    setError("");
    if (!isMockEnv) {
      try {
        await fetch(`https://spz-menu/previewGender`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gender: selected })
        });
      } catch {}
    }
  };

  const handleSubmit = async () => {
    if (!gender) {
      setError("PLEASE SELECT A GENDER");
      return;
    }
    const cleanName = username.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (cleanName.length < 3) {
      setError("USERNAME MUST BE AT LEAST 3 CHARACTERS");
      return;
    }

    if (!isMockEnv) {
      try {
        await fetch(`https://spz-menu/createCharacter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanName, gender })
        });
      } catch {}
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'var(--spz-overlay)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <div style={{ 
          fontFamily: 'SPZ, sans-serif', fontWeight: 400, fontSize: 14, 
          letterSpacing: '.2em', color: 'var(--spz-muted)', textTransform: 'uppercase', marginBottom: 12 
        }}>
          WELCOME TO SPICEZ
        </div>
        <div className="spz-value" style={{ fontSize: 28, letterSpacing: '.05em' }}>
          CHOOSE YOUR CHARACTER
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 50 }}>
        <SpzPanel 
           style={{ 
             width: 200, height: 160, cursor: 'pointer',
             display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
             borderBottom: gender === 'mp_m_freemode_01' ? '2px solid var(--spz-orange)' : '2px solid transparent',
             transition: 'border-bottom 0.2s ease',
             boxSizing: 'border-box'
           }}
           onClick={() => handleGenderSelect('mp_m_freemode_01')}
        >
          <div className="spz-value" style={{ fontSize: 18, marginBottom: 6 }}>MALE</div>
          <div className="spz-label" style={{ textTransform: 'none' }}>mp_m_freemode</div>
          <div className="qw-btn qw-btn-leave" style={{ 
            marginTop: 20, height: 28, padding: '0 16px', lineHeight: '28px', 
            color: gender === 'mp_m_freemode_01' ? 'var(--spz-orange)' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
             {gender === 'mp_m_freemode_01' ? 'SELECTED' : 'SELECT'}
          </div>
        </SpzPanel>

        <SpzPanel 
           style={{ 
             width: 200, height: 160, cursor: 'pointer',
             display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
             borderBottom: gender === 'mp_f_freemode_01' ? '2px solid var(--spz-orange)' : '2px solid transparent',
             transition: 'border-bottom 0.2s ease',
             boxSizing: 'border-box'
           }}
           onClick={() => handleGenderSelect('mp_f_freemode_01')}
        >
          <div className="spz-value" style={{ fontSize: 18, marginBottom: 6 }}>FEMALE</div>
          <div className="spz-label" style={{ textTransform: 'none' }}>mp_f_freemode</div>
          <div className="qw-btn qw-btn-leave" style={{ 
            marginTop: 20, height: 28, padding: '0 16px', lineHeight: '28px', 
            color: gender === 'mp_f_freemode_01' ? 'var(--spz-orange)' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
             {gender === 'mp_f_freemode_01' ? 'SELECTED' : 'SELECT'}
          </div>
        </SpzPanel>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div className="spz-value" style={{ fontSize: 16, letterSpacing: '.05em' }}>
          CHOOSE A USERNAME
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', marginBottom: 10 }}>
        <SpzPanel style={{ width: 300, display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.15)', padding: '0 16px', boxSizing: 'border-box' }}>
           <input 
             type="text" 
             value={username} 
             spellCheck={false}
             onChange={(e) => {
               setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "").substring(0, 20));
               setError("");
             }}
             style={{ 
               background: 'transparent', border: 'none', outline: 'none', 
               color: '#fff', fontFamily: 'SPZ, sans-serif', fontWeight: 700, fontSize: 16,
               width: '100%', textTransform: 'uppercase'
             }} 
           />
        </SpzPanel>
        
        <button 
           className="qw-btn qw-btn-leave" 
           onClick={() => {
             setUsername(suggestedUsername);
             setError("");
           }}
           style={{ height: 48, padding: '0 16px' }}
        >
          USE MY NAME
        </button>
      </div>

      <div className="spz-label" style={{ marginBottom: 40, textTransform: 'none', opacity: 0.6 }}>
        you'll appear as <span style={{ color: '#fff' }}>{username || 'racer'}#????</span>
      </div>

      <div style={{ height: 20, marginBottom: 16 }}>
        {error && (
          <div style={{ 
            color: 'var(--spz-red)', fontFamily: 'SPZ, sans-serif', fontWeight: 700, 
            fontSize: 12, textTransform: 'uppercase', letterSpacing: '.1em' 
          }}>
            {error}
          </div>
        )}
      </div>

      <button className="qw-btn qw-btn-join" onClick={handleSubmit} style={{ width: 446, height: 48, fontSize: 14 }}>
        CONFIRM
      </button>
    </div>
  );
};
