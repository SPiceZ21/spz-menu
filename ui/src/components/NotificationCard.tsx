import React, { useState, useEffect } from 'react';
import { SpzPanel } from './SpzPanel';
import { ClassBadge } from './ClassBadge';

export interface NotificationPayload {
  id: number;
  type: 'rankup' | 'unlock' | 'info' | 'success' | 'error';
  title?: string;
  message?: string;
  classTag?: string;
}

export const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'notify') {
        const payload = e.data.payload as Omit<NotificationPayload, 'id'>;
        const newNotif = { ...payload, id: idCounter++ };
        setNotifications(prev => [...prev.slice(-3), newNotif]); // Max 4 overall stack
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
        }, 5000);
      }
    };
    window.addEventListener('message', handleMessage);
    
    // Dev hotkey mock
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
         const newNotif: NotificationPayload = {
           id: idCounter++,
           type: 'rankup',
           title: 'B-3 >> B-2',
           message: 'NEXT TIER // RACER'
         };
         setNotifications(prev => [...prev.slice(-3), newNotif]);
         setTimeout(() => { setNotifications(prev => prev.filter(n => n.id !== newNotif.id)); }, 5000);
      }
    }
    window.addEventListener('keydown', keyHandler);

    return () => { window.removeEventListener('message', handleMessage); window.removeEventListener('keydown', keyHandler); };
  }, []);

  return (
    <div style={{
      position: 'absolute', top: 40, right: 40, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 9999
    }}>
      {notifications.map(notif => (
        <NotificationCard key={notif.id} data={notif} />
      ))}
    </div>
  );
};

const NotificationCard: React.FC<{ data: NotificationPayload }> = ({ data }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // 80ms robust slide-in request per specifications
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const slideStyle = {
    transform: mounted ? 'translateX(0)' : 'translateX(120%)',
    transition: 'transform 80ms ease-out, opacity 80ms ease-out',
    opacity: mounted ? 1 : 0
  };

  if (data.type === 'rankup') {
    return (
      <SpzPanel style={{ width: 280, height: 50, display: 'flex', alignItems: 'center', ...slideStyle }}>
        <div style={{ width: 40, display: 'flex', justifyContent: 'center', color: '#fff', fontSize: 18, borderRight: '1px solid rgba(255,255,255,0.1)' }}>&#8593;</div>
        <div style={{ paddingLeft: 12 }}>
          <div className="spz-value" style={{ fontSize: 13 }}>{data.title}</div>
          <div className="spz-label">{data.message}</div>
        </div>
      </SpzPanel>
    );
  }

  if (data.type === 'unlock') {
    return (
      <SpzPanel style={{ width: 280, height: 50, display: 'flex', alignItems: 'center', paddingLeft: 10, gap: 12, ...slideStyle }}>
        <ClassBadge tier={data.classTag || 'B'} size={32} />
        <div className="spz-value" style={{ fontSize: 14 }}>{data.title || `CLASS ${data.classTag}`}</div>
      </SpzPanel>
    );
  }

  const barColor = data.type === 'error' ? 'var(--spz-red)' : 'var(--spz-orange)';
  return (
    <SpzPanel style={{ width: 280, minHeight: 40, borderLeft: `3px solid ${barColor}`, padding: '10px 12px', ...slideStyle }}>
       <div className="spz-value" style={{ fontSize: 12, color: '#fff' }}>{data.message}</div>
    </SpzPanel>
  );
};
