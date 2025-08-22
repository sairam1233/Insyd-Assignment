import { useState } from 'react';
import { createEvent } from '../api';
import type { NotificationType } from '../types';
import Toast from '../components/Toast';

export default function CreateEventPage() {
  const [userId, setUserId] = useState('user123');
  const [type, setType] = useState<NotificationType>('FOLLOW');
  const [content, setContent] = useState('Alice followed you');
  const [status, setStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success'|'error'|'info' } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Saving…');
    try {
      await createEvent({ userId, type, content });
      setStatus('Created!');
      setToast({ message: 'Event created successfully!', type: 'success' });
      // Reset form after successful creation
      setTimeout(() => {
        setStatus(null);
        setContent('Alice followed you');
      }, 2000);
    } catch (e: any) {
      setStatus(e.message || 'Failed');
      setToast({ message: e.message || 'Failed to create event', type: 'error' });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <h2>Create New Notification Event</h2>
      
      <label>
        <span>User ID (receiver)</span>
        <input 
          value={userId} 
          onChange={e => setUserId(e.target.value)}
          placeholder="Enter user ID"
          required
        />
      </label>

      <label>
        <span>Notification Type</span>
        <select 
          value={type} 
          onChange={e => setType(e.target.value as NotificationType)}
        >
          <option value="FOLLOW">FOLLOW</option>
          <option value="LIKE">LIKE</option>
          <option value="COMMENT">COMMENT</option>
          <option value="SHARE_JOB">SHARE_JOB</option>
          <option value="SHARE_BLOG">SHARE_BLOG</option>
        </select>
      </label>

      <label>
        <span>Content</span>
        <input 
          value={content} 
          onChange={e => setContent(e.target.value)}
          placeholder="Enter notification content"
          required
        />
      </label>

      <button type="submit" disabled={status === 'Saving…'}>
        {status === 'Saving…' ? 'Creating...' : 'Create Event'}
      </button>
      
      {status && <p className="status">{status}</p>}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </form>
  );
}
