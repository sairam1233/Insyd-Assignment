import { useEffect, useMemo, useState } from 'react';
import { getNotifications, markAsRead } from '../api';
import type { Notification } from '../types';

const USER_ID = 'user123';

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyUnread, setOnlyUnread] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unreadCount = useMemo(() => items.filter(i => !i.isRead).length, [items]);

  async function load() {
    try {
      setLoading(true);
      console.log('Loading notifications for user:', USER_ID, 'onlyUnread:', onlyUnread);
      const data = await getNotifications(USER_ID, onlyUnread);
      setItems(data);
      setError(null);
    } catch (e: any) {
      console.error('Error loading notifications:', e);
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [onlyUnread]);

  async function onMarkRead(id: string) {
    try {
      await markAsRead(id);
      setItems(prev => prev.filter(n => n._id !== id));
    } catch (e: any) {
      setError(e.message || 'Failed to mark as read');
    }
  }

  return (
    <section>
      <div className="toolbar">
        <label>
          <input 
            type="checkbox" 
            checked={onlyUnread} 
            onChange={e => setOnlyUnread(e.target.checked)} 
          />
          Only unread ({unreadCount})
        </label>
        <button onClick={load}>Refresh</button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      <ul className="list" aria-live="polite">
        {items.map(n => (
          <li key={n._id} className="card">
            <div className="row">
              <div>
                <div className="type">{n.type}</div>
                <div className="content">{n.content}</div>
                <div className="meta">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div>
                {!n.isRead && (
                  <button 
                    aria-label={`Mark notification ${n._id} as read`} 
                    onClick={() => onMarkRead(n._id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
        {!loading && items.length === 0 && <li>No notifications</li>}
      </ul>
    </section>
  );
}
