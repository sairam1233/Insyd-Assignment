import type { Notification, NotificationType } from './types';

// API configuration with fallback options
const API_BASE = 'https://api-node-insyd.onrender.com/api';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Try different approaches for API access
const getApiUrl = (endpoint: string) => {
  // First try direct API
  return `${API_BASE}${endpoint}`;
};

const BASE_URL = API_BASE;

export async function createEvent(params: { userId: string; type: NotificationType; content: string }) {
  try {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      credentials: 'omit',
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
  const endpoint = `/notifications/${userId}?onlyUnread=${onlyUnread}`;
  
  // Try direct API first
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log('Fetching notifications from:', url);
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Notifications received:', data);
    return data as Promise<Notification[]>;
  } catch (error) {
    console.error('Direct API failed, trying CORS proxy:', error);
    
    // Fallback to CORS proxy
    try {
      const proxyUrl = `${CORS_PROXY}${BASE_URL}${endpoint}`;
      console.log('Trying CORS proxy:', proxyUrl);
      
      const res = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`CORS proxy failed: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log('Notifications received via proxy:', data);
      return data as Promise<Notification[]>;
    } catch (proxyError) {
      console.error('CORS proxy also failed:', proxyError);
      throw new Error(`Failed to fetch notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export async function markAsRead(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, { 
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      credentials: 'omit'
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
