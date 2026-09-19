import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Notification } from '../types/notification';
import { notificationApi } from '../api/notifications';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  isConnected: boolean;
  notifications: Notification[];
  unreadCount: number;
  latestAlert: Notification | null;
  acknowledgeAlert: (id: string) => Promise<void>;
  dismissBanner: () => void;
  refreshNotifications: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [latestAlert, setLatestAlert] = useState<Notification | null>(null);

  const stompClientRef = useRef<Client | null>(null);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationApi.getNotifications(30);
      setNotifications(data);
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.warn('Could not load notifications from API', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect STOMP client if logged out
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      setIsConnected(false);
      setNotifications([]);
      setUnreadCount(0);
      setLatestAlert(null);
      return;
    }

    refreshNotifications();

    // Configure STOMP Client over SockJS fallback to ensure cross-environment stability
    const token = localStorage.getItem('opsflow_access_token');
    const wsBaseUrl = import.meta.env.VITE_WS_URL || (
      typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8080/ws'
        : '/ws'
    );
    const socketFactory = () => {
      return new SockJS(wsBaseUrl);
    };

    const client = new Client({
      webSocketFactory: socketFactory,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
        if (import.meta.env.DEV) {
          // console.debug('[STOMP]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      // Subscribe to operational alerts broadcast channel
      client.subscribe('/topic/alerts', (message: IMessage) => {
        try {
          const alert: Notification = JSON.parse(message.body);
          setLatestAlert(alert);
          setNotifications((prev) => [alert, ...prev]);
          setUnreadCount((prev) => prev + 1);
        } catch (e) {
          console.error('Error parsing inbound WebSocket alert payload', e);
        }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.warn('STOMP Error:', frame.headers['message']);
      setIsConnected(false);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [isAuthenticated, refreshNotifications]);

  const acknowledgeAlert = async (id: string) => {
    try {
      await notificationApi.acknowledgeNotification(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, acknowledged: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (latestAlert?.id === id) {
        setLatestAlert(null);
      }
    } catch (err) {
      console.error('Failed to acknowledge notification', err);
    }
  };

  const dismissBanner = () => {
    setLatestAlert(null);
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        notifications,
        unreadCount,
        latestAlert,
        acknowledgeAlert,
        dismissBanner,
        refreshNotifications,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
