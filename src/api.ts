import type { Notification, NotificationType } from './types';

// Use proxy in development to avoid CORS issues
const BASE_URL = (import.meta as any).env?.DEV 
  ? '/api' 
  : 'https://api-node-insyd.onrender.com/api';

export async function createEvent(params: { userId: string; type: NotificationType; content: string }) {
  try {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(params)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(`Failed to create event: ${res.status} ${errorText}`);
    }
    
    return res.json() as Promise<Notification>;
  } catch (error) {
    console.error('Network Error:', error);
    throw error;
  }
}

export async function getNotifications(userId: string, onlyUnread = false) {
  try {
    const url = `${BASE_URL}/notifications/${userId}?onlyUnread=${onlyUnread}`;
    console.log('Fetching notifications from:', url);
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(`Failed to fetch notifications: ${res.status} ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Notifications received:', data);
    return data as Promise<Notification[]>;
  } catch (error) {
    console.error('Network Error:', error);
    throw error;
  }
}

export async function markAsRead(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, { 
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(`Failed to mark as read: ${res.status} ${errorText}`);
    }
    
    return res.json() as Promise<Notification>;
  } catch (error) {
    console.error('Network Error:', error);
    throw error;
  }
}
